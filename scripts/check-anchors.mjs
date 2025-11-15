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
  return text
    .toLowerCase()
    .replace(/`/g, '') // Remove backticks
    .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .trim();
}

// Extract custom ID from heading text if present
function extractCustomId(text) {
  const customIdRegex = /{#\s*([\w-]+)\s*}/;
  const match = customIdRegex.exec(text);
  return match ? match[1] : null;
}

// Extract headings from markdown content
function extractHeadings(content) {
  const headings = [];

  // Match markdown headings (## Heading)
  const mdHeadingRegex = /^#{1,6}\s+(.+)$/gm;
  let match;
  while ((match = mdHeadingRegex.exec(content)) !== null) {
    const headingText = match[1].trim();
    const customId = extractCustomId(headingText);
    const id = customId || generateAnchorId(headingText);

    headings.push({
      text: headingText,
      id: id,
      line: content.substring(0, match.index).split('\n').length,
    });
  }

  // Match docs-step titles (<docs-step title="...">)
  const docsStepRegex = /<docs-step\s+title="([^"]+)"/g;
  while ((match = docsStepRegex.exec(content)) !== null) {
    const headingText = match[1].trim();
    const customId = extractCustomId(headingText);
    const id = customId || generateAnchorId(headingText);

    headings.push({
      text: headingText,
      id: id,
      line: content.substring(0, match.index).split('\n').length,
    });
  }

  return headings;
}

// Extract internal anchor links from markdown content
function extractAnchorLinks(content) {
  const links = [];

  // Match [text](#anchor) pattern
  const anchorRegex = /\[([^\]]+)\]\(#([^)]+)\)/g;
  let match;
  while ((match = anchorRegex.exec(content)) !== null) {
    const linkText = match[1];
    const anchor = match[2];
    const line = content.substring(0, match.index).split('\n').length;

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

  const headings = extractHeadings(content);
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

  return errors;
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

  console.log(`Checking anchor links in ${searchDir}...\n`);

  const markdownFiles = findMarkdownFiles(fullSearchDir);
  console.log(`Found ${markdownFiles.length} markdown files\n`);

  let totalErrors = 0;

  for (const file of markdownFiles) {
    const errors = checkMarkdownFile(file, baseDir);

    if (errors.length > 0) {
      totalErrors += errors.length;
      console.log(`\n❌ ${relative(baseDir, file)}`);

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
  }

  if (totalErrors === 0) {
    console.log('✅ All anchor links are valid!');
  } else {
    console.log(`\n❌ Found ${totalErrors} invalid anchor link(s)\n`);
    process.exit(1);
  }
}

main();
