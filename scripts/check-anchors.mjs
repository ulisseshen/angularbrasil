#!/usr/bin/env node

/**
 * Script to validate anchor links in markdown files.
 *
 * This script checks that all internal anchor links (e.g., [text](#anchor))
 * point to valid heading IDs in the same document.
 */

import {readFileSync, readdirSync, statSync} from 'fs';
import {join, relative, dirname} from 'path';

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
  const mdHeadingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  while ((match = mdHeadingRegex.exec(content)) !== null) {
    const depth = match[1].length; // Count the # characters
    const headingText = match[2].trim();
    const customId = extractCustomId(headingText);
    const line = content.substring(0, match.index).split('\n').length;

    // Remove custom ID syntax from text for auto-generation
    const textWithoutCustomId = headingText.replace(/{#\s*[\w-]+\s*}/g, '').trim();
    const autoId = generateAnchorId(textWithoutCustomId);
    const id = customId || autoId;

    // CRITICAL: h1 headings don't get IDs in the HTML output (they're rendered as special headers)
    // So custom IDs on h1 headings will not work and should be errors
    if (depth === 1 && customId) {
      warnings.push({
        line: line,
        text: headingText,
        message: 'H1 heading has custom ID but h1 headings do not get IDs in HTML output',
        customId: customId,
        severity: 'error',
      });
    }

    // Validate: if heading has non-ASCII chars, it should have a custom ID
    if (hasNonAsciiChars(textWithoutCustomId) && !customId && depth > 1) {
      warnings.push({
        line: line,
        text: headingText,
        message: 'Portuguese/non-ASCII heading without custom English ID',
        suggestedId: autoId,
      });
    }

    // Validate: auto-generated ID should only have valid characters
    if (!customId && !isValidCustomId(autoId) && depth > 1) {
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
      depth: depth,
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
      depth: 2, // docs-step elements are treated like h2 headings
      hasCustomId: !!customId,
      warning: null,
    });
  }

  return {headings, warnings};
}

// Extract internal anchor links from markdown content
function extractAnchorLinks(content) {
  const links = [];

  // Match [text](#anchor) or [text](#anchor 'title') pattern (internal links)
  const internalAnchorRegex = /\[([^\]]+)\]\(#([^\s)'"]+)(?:\s+['"][^'"]*['"])?\)/g;
  let match;
  while ((match = internalAnchorRegex.exec(content)) !== null) {
    const linkText = match[1];
    let anchor = match[2];
    const line = content.substring(0, match.index).split('\n').length;

    // Remove any trailing quotes or whitespace
    anchor = anchor.trim().replace(/['"]$/, '');

    // Skip empty anchors
    if (!anchor) continue;

    links.push({
      type: 'internal',
      text: linkText,
      anchor: anchor,
      line: line,
      hasInvalidChars: !isValidCustomId(anchor),
      hasNonAscii: hasNonAsciiChars(anchor),
    });
  }

  // Match [text](path/to/file.md#anchor) pattern (cross-file links, exclude external URLs)
  const crossFileAnchorRegex = /\[([^\]]+)\]\(([^)#:]+\.md)#([^\s)'"]+)(?:\s+['"][^'"]*['"])?\)/g;
  while ((match = crossFileAnchorRegex.exec(content)) !== null) {
    const linkText = match[1];
    const filePath = match[2];
    let anchor = match[3];
    const line = content.substring(0, match.index).split('\n').length;

    // Skip external URLs (http:// or https://)
    if (filePath.includes('://')) continue;

    // Remove any trailing quotes or whitespace
    anchor = anchor.trim().replace(/['"]$/, '');

    // Skip empty anchors
    if (!anchor) continue;

    links.push({
      type: 'cross-file',
      text: linkText,
      targetFile: filePath,
      anchor: anchor,
      line: line,
      hasInvalidChars: !isValidCustomId(anchor),
      hasNonAscii: hasNonAsciiChars(anchor),
    });
  }

  return links;
}

// Build a map of all files and their available anchors
function buildAnchorMap(markdownFiles, baseDir) {
  const anchorMap = new Map();

  for (const file of markdownFiles) {
    try {
      const content = readFileSync(file, 'utf8');
      const {headings} = extractHeadings(content);
      const validIds = headings.filter((h) => h.depth > 1).map((h) => h.id);
      const relativePath = relative(baseDir, file);

      anchorMap.set(relativePath, new Set(validIds));
    } catch (error) {
      // Skip files that can't be read
    }
  }

  return anchorMap;
}

// Resolve a cross-file path relative to the current file
function resolveCrossFilePath(currentFilePath, targetPath, baseDir) {
  const currentDir = join(baseDir, dirname(currentFilePath));
  const resolvedPath = join(currentDir, targetPath);
  return relative(baseDir, resolvedPath);
}

// Check a single markdown file
function checkMarkdownFile(filePath, baseDir, anchorMap) {
  const content = readFileSync(filePath, 'utf8');
  const relativePath = relative(baseDir, filePath);

  const {headings, warnings} = extractHeadings(content);
  const links = extractAnchorLinks(content);

  // Only h2-h6 headings get IDs in the HTML output (h1 is rendered as special header)
  const validIds = new Set(headings.filter((h) => h.depth > 1).map((h) => h.id));
  const errors = [];

  for (const link of links) {
    // Check if anchor link itself has invalid characters
    if (link.hasInvalidChars) {
      errors.push({
        file: relativePath,
        line: link.line,
        anchor: link.anchor,
        linkText: link.text,
        availableIds: link.type === 'internal' ? Array.from(validIds) : [],
        errorType: 'invalid-chars',
        message: `Anchor link contains invalid characters (only [\w-]+ allowed)`,
        linkType: link.type,
      });
    }
    // Check if anchor link has Portuguese/non-ASCII characters
    else if (link.hasNonAscii) {
      errors.push({
        file: relativePath,
        line: link.line,
        anchor: link.anchor,
        linkText: link.text,
        availableIds: link.type === 'internal' ? Array.from(validIds) : [],
        errorType: 'non-ascii',
        message: `Anchor link contains Portuguese/non-ASCII characters (use English IDs)`,
        linkType: link.type,
      });
    }
    // Check internal links
    else if (link.type === 'internal') {
      if (!validIds.has(link.anchor)) {
        errors.push({
          file: relativePath,
          line: link.line,
          anchor: link.anchor,
          linkText: link.text,
          availableIds: Array.from(validIds),
          errorType: 'not-found',
          message: `Anchor link target does not exist in document`,
          linkType: 'internal',
        });
      }
    }
    // Check cross-file links
    else if (link.type === 'cross-file') {
      const targetFilePath = resolveCrossFilePath(relativePath, link.targetFile, baseDir);
      const targetAnchors = anchorMap.get(targetFilePath);

      if (!targetAnchors) {
        errors.push({
          file: relativePath,
          line: link.line,
          anchor: link.anchor,
          linkText: link.text,
          targetFile: link.targetFile,
          resolvedPath: targetFilePath,
          availableIds: [],
          errorType: 'file-not-found',
          message: `Target file not found: ${link.targetFile}`,
          linkType: 'cross-file',
        });
      } else if (!targetAnchors.has(link.anchor)) {
        errors.push({
          file: relativePath,
          line: link.line,
          anchor: link.anchor,
          linkText: link.text,
          targetFile: link.targetFile,
          availableIds: Array.from(targetAnchors),
          errorType: 'not-found',
          message: `Anchor link target does not exist in ${link.targetFile}`,
          linkType: 'cross-file',
        });
      }
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

  // Build anchor map for cross-file link validation
  console.log('Building anchor map for cross-file validation...');
  const anchorMap = buildAnchorMap(markdownFiles, baseDir);
  console.log('');

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of markdownFiles) {
    const {errors, warnings, relativePath} = checkMarkdownFile(file, baseDir, anchorMap);

    if (errors.length > 0) {
      totalErrors += errors.length;
      console.log(`\n❌ ${relativePath}`);

      for (const error of errors) {
        console.log(`   Line ${error.line}: Invalid anchor "#${error.anchor}"`);
        console.log(`   Link text: "${error.linkText}"`);

        if (error.linkType === 'cross-file') {
          console.log(`   Target file: ${error.targetFile}`);
        }

        if (error.message) {
          console.log(`   Error: ${error.message}`);
        }

        // Only suggest alternatives for "not-found" errors
        if (error.errorType === 'not-found') {
          // Try to suggest a similar valid ID
          const suggestions = error.availableIds.filter(
            (id) =>
              id.includes(error.anchor.substring(0, 5)) ||
              error.anchor.includes(id.substring(0, 5)),
          );

          if (suggestions.length > 0) {
            console.log(`   Did you mean: ${suggestions.map((s) => `#${s}`).join(', ')}?`);
          } else if (error.availableIds.length > 0 && error.availableIds.length <= 10) {
            console.log(
              `   Available anchors: ${error.availableIds.map((s) => `#${s}`).join(', ')}`,
            );
          }
        }
        console.log('');
      }
    }

    if (showWarnings && warnings.length > 0) {
      // Separate errors from warnings
      const criticalWarnings = warnings.filter((w) => w.severity === 'error');
      const normalWarnings = warnings.filter((w) => w.severity !== 'error');

      totalErrors += criticalWarnings.length;
      totalWarnings += normalWarnings.length;

      if (criticalWarnings.length > 0 || (errors.length === 0 && normalWarnings.length > 0)) {
        const symbol = criticalWarnings.length > 0 ? '❌' : '⚠️';
        if (errors.length === 0) {
          console.log(`\n${symbol} ${relativePath}`);
        }
      }

      // Show critical warnings as errors
      for (const warning of criticalWarnings) {
        console.log(`   Line ${warning.line}: ${warning.message}`);
        console.log(`   Heading: "${warning.text}"`);
        if (warning.customId) {
          console.log(`   Custom ID: {#${warning.customId}}`);
          console.log(
            `   Fix: Remove the custom ID from the h1 heading or move it to an h2-h6 heading`,
          );
        }
        console.log('');
      }

      // Show normal warnings
      for (const warning of normalWarnings) {
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
