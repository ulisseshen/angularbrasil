#!/usr/bin/env node

/**
 * Script to validate anchor links in markdown files.
 *
 * This script checks that all internal anchor links (e.g., [text](#anchor))
 * point to valid heading IDs in the same document.
 */

import {readFileSync, readdirSync, statSync} from 'fs';
import {join, relative} from 'path';

// Generate anchor ID from heading text (following common markdown conventions)
function generateAnchorId(text) {
  // Remove custom ID syntax first
  text = text.replace(/{#\s*[\w-]+\s*}/g, '');

  return text
    .toLowerCase()
    .replace(/`/g, '') // Remove backticks
    .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .trim();
}

// Extract custom ID from heading text if present
// Returns null if not present or if invalid
function extractCustomId(text) {
  const customIdRegex = /{#\s*([\w-]+)\s*}/;
  const match = customIdRegex.exec(text);
  return match ? match[1] : null;
}

// Check if text contains non-ASCII characters (Portuguese, etc.)
function hasNonAsciiChars(text) {
  return /[^\x00-\x7F]/.test(text);
}

// Validate that a custom ID only contains allowed characters
function isValidCustomId(id) {
  return /^[\w-]+$/.test(id);
}

// Extract headings from markdown content
function extractHeadings(content) {
  const headings = [];
  const warnings = [];

  // Match markdown headings (## Heading)
  const mdHeadingRegex = /^#{1,6}\s+(.+)$/gm;
  let match;
  while ((match = mdHeadingRegex.exec(content)) !== null) {
    const headingText = match[1].trim();
    const customId = extractCustomId(headingText);
    const line = content.substring(0, match.index).split('\n').length;

    // Remove custom ID syntax from text for auto-generation
    const textWithoutCustomId = headingText.replace(/{#\s*[\w-]+\s*}/g, '').trim();
    const autoId = generateAnchorId(textWithoutCustomId);
    const id = customId || autoId;

    // Validate: if heading has non-ASCII chars, it should have a custom ID
    if (hasNonAsciiChars(textWithoutCustomId) && !customId) {
      warnings.push({
        line: line,
        text: headingText,
        message: 'Portuguese/non-ASCII heading without custom English ID',
        suggestedId: autoId,
      });
    }

    // Validate: auto-generated ID should only have valid characters
    if (!customId && !isValidCustomId(autoId)) {
      warnings.push({
        line: line,
        text: headingText,
        message:
          'Auto-generated ID contains invalid characters (likely from special chars in heading)',
        generatedId: autoId,
      });
    }

    headings.push({
      text: headingText,
      id: id,
      line: line,
      hasCustomId: !!customId,
      warning: warnings.length > 0 ? warnings[warnings.length - 1] : null,
    });
  }

  // Match docs-step titles (<docs-step title="...">)
  const docsStepRegex = /<docs-step\s+title="([^"]+)"/g;
  while ((match = docsStepRegex.exec(content)) !== null) {
    const headingText = match[1].trim();
    const customId = extractCustomId(headingText);
    const line = content.substring(0, match.index).split('\n').length;

    const textWithoutCustomId = headingText.replace(/{#\s*[\w-]+\s*}/g, '').trim();
    const autoId = generateAnchorId(textWithoutCustomId);
    const id = customId || autoId;

    headings.push({
      text: headingText,
      id: id,
      line: line,
      hasCustomId: !!customId,
      warning: null,
    });
  }

  return {headings, warnings};
}

// Extract internal anchor links from markdown content
function extractAnchorLinks(content) {
  const links = [];

  // Match [text](#anchor) or [text](#anchor 'title') pattern
  const anchorRegex = /\[([^\]]+)\]\(#([^\s)'"]+)(?:\s+['"][^'"]*['"])?\)/g;
  let match;
  while ((match = anchorRegex.exec(content)) !== null) {
    const linkText = match[1];
    let anchor = match[2];
    const line = content.substring(0, match.index).split('\n').length;

    // Remove any trailing quotes or whitespace
    anchor = anchor.trim().replace(/['"]$/, '');

    // Skip empty anchors
    if (!anchor) continue;

    links.push({
      text: linkText,
      anchor: anchor,
      line: line,
    });
  }

  return links;
}

// Check a single markdown file
function checkMarkdownFile(filePath, baseDir) {
  const content = readFileSync(filePath, 'utf8');
  const relativePath = relative(baseDir, filePath);

  const {headings, warnings} = extractHeadings(content);
  const links = extractAnchorLinks(content);

  const validIds = new Set(headings.map((h) => h.id));
  const errors = [];

  for (const link of links) {
    if (!validIds.has(link.anchor)) {
      errors.push({
        file: relativePath,
        line: link.line,
        anchor: link.anchor,
        linkText: link.text,
        availableIds: Array.from(validIds),
      });
    }
  }

  return {errors, warnings, relativePath};
}

// Recursively find all markdown files
function findMarkdownFiles(dir, files = []) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules and hidden directories
      if (!entry.startsWith('.') && entry !== 'node_modules') {
        findMarkdownFiles(fullPath, files);
      }
    } else if (entry.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Main function
function main() {
  const baseDir = process.cwd();
  const searchDir = process.argv[2] || 'adev/src/content';
  const fullSearchDir = join(baseDir, searchDir);
  const showWarnings = process.argv.includes('--warnings');

  console.log(`Checking anchor links in ${searchDir}...\n`);

  const markdownFiles = findMarkdownFiles(fullSearchDir);
  console.log(`Found ${markdownFiles.length} markdown files\n`);

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of markdownFiles) {
    const {errors, warnings, relativePath} = checkMarkdownFile(file, baseDir);

    if (errors.length > 0) {
      totalErrors += errors.length;
      console.log(`\n❌ ${relativePath}`);

      for (const error of errors) {
        console.log(`   Line ${error.line}: Invalid anchor "#${error.anchor}"`);
        console.log(`   Link text: "${error.linkText}"`);

        // Try to suggest a similar valid ID
        const suggestions = error.availableIds.filter(
          (id) =>
            id.includes(error.anchor.substring(0, 5)) || error.anchor.includes(id.substring(0, 5)),
        );

        if (suggestions.length > 0) {
          console.log(`   Did you mean: ${suggestions.map((s) => `#${s}`).join(', ')}?`);
        } else if (error.availableIds.length > 0) {
          console.log(`   Available anchors: ${error.availableIds.map((s) => `#${s}`).join(', ')}`);
        }
        console.log('');
      }
    }

    if (showWarnings && warnings.length > 0) {
      totalWarnings += warnings.length;
      if (errors.length === 0) {
        console.log(`\n⚠️  ${relativePath}`);
      }

      for (const warning of warnings) {
        console.log(`   Line ${warning.line}: ${warning.message}`);
        console.log(`   Heading: "${warning.text}"`);
        if (warning.suggestedId) {
          console.log(`   Auto-generated ID would be: #${warning.suggestedId}`);
        }
        if (warning.generatedId) {
          console.log(`   Invalid auto-generated ID: #${warning.generatedId}`);
        }
        console.log('');
      }
    }
  }

  console.log('');

  if (totalErrors === 0 && (!showWarnings || totalWarnings === 0)) {
    console.log('✅ All anchor links are valid!');
  } else {
    if (totalErrors > 0) {
      console.log(`❌ Found ${totalErrors} invalid anchor link(s)`);
    }
    if (showWarnings && totalWarnings > 0) {
      console.log(`⚠️  Found ${totalWarnings} warning(s) (potential future issues)`);
    }
    console.log('');

    if (totalErrors > 0) {
      process.exit(1);
    }
  }
}

main();
