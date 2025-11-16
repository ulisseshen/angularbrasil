#!/usr/bin/env node

/**
 * Script to automatically fix anchor links in markdown files.
 *
 * This script finds invalid anchor links and attempts to fix them by
 * matching with available heading IDs in the document.
 */

import {readFileSync, writeFileSync, readdirSync, statSync} from 'fs';
import {join, relative} from 'path';

// Generate anchor ID from heading text
function generateAnchorId(text) {
  return text
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
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

  const mdHeadingRegex = /^#{1,6}\s+(.+)$/gm;
  let match;
  while ((match = mdHeadingRegex.exec(content)) !== null) {
    const headingText = match[1].trim();
    const customId = extractCustomId(headingText);
    const id = customId || generateAnchorId(headingText);

    headings.push({
      text: headingText,
      id: id,
    });
  }

  const docsStepRegex = /<docs-step\s+title="([^"]+)"/g;
  while ((match = docsStepRegex.exec(content)) !== null) {
    const headingText = match[1].trim();
    const customId = extractCustomId(headingText);
    const id = customId || generateAnchorId(headingText);

    headings.push({
      text: headingText,
      id: id,
    });
  }

  return headings;
}

// Find best match for an invalid anchor among valid IDs
function findBestMatch(invalidAnchor, validIds) {
  // Exact match check (shouldn't happen, but just in case)
  if (validIds.has(invalidAnchor)) {
    return invalidAnchor;
  }

  const validIdsArray = Array.from(validIds);

  // Try to find a very similar match using edit distance
  let bestMatch = null;
  let bestScore = Infinity;

  for (const validId of validIdsArray) {
    // Simple similarity score based on common prefixes and substrings
    const commonPrefixLen = getCommonPrefixLength(invalidAnchor, validId);
    const containsSubstring =
      validId.includes(invalidAnchor.substring(0, Math.min(10, invalidAnchor.length))) ||
      invalidAnchor.includes(validId.substring(0, Math.min(10, validId.length)));

    // Calculate a simple score (lower is better)
    const lengthDiff = Math.abs(invalidAnchor.length - validId.length);
    const score = lengthDiff - commonPrefixLen * 2 - (containsSubstring ? 5 : 0);

    if (score < bestScore) {
      bestScore = score;
      bestMatch = validId;
    }
  }

  // Only return a match if the score is reasonable
  if (bestScore < 10 && bestMatch) {
    return bestMatch;
  }

  return null;
}

function getCommonPrefixLength(str1, str2) {
  let i = 0;
  while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
    i++;
  }
  return i;
}

// Fix anchors in a markdown file
function fixAnchorsInFile(filePath, dryRun = false) {
  const content = readFileSync(filePath, 'utf8');
  let newContent = content;

  const headings = extractHeadings(content);
  const validIds = new Set(headings.map((h) => h.id));

  // Find all anchor links
  const anchorRegex = /\[([^\]]+)\]\(#([^)]+)\)/g;
  const replacements = [];

  let match;
  while ((match = anchorRegex.exec(content)) !== null) {
    const linkText = match[1];
    const anchor = match[2];
    const fullMatch = match[0];

    if (!validIds.has(anchor)) {
      const suggestion = findBestMatch(anchor, validIds);

      if (suggestion) {
        replacements.push({
          from: fullMatch,
          to: `[${linkText}](#${suggestion})`,
          oldAnchor: anchor,
          newAnchor: suggestion,
        });
      }
    }
  }

  // Apply replacements
  if (replacements.length > 0) {
    for (const replacement of replacements) {
      newContent = newContent.replace(replacement.from, replacement.to);
    }

    if (!dryRun) {
      writeFileSync(filePath, newContent, 'utf8');
    }

    return {
      fixed: true,
      count: replacements.length,
      replacements: replacements,
    };
  }

  return {fixed: false, count: 0, replacements: []};
}

// Recursively find all markdown files
function findMarkdownFiles(dir, files = []) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
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
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
  const searchDir = args[0] || 'adev/src/content';
  const dryRun = process.argv.includes('--dry-run');
  const fullSearchDir = join(baseDir, searchDir);

  console.log(`${dryRun ? 'Checking' : 'Fixing'} anchor links in ${searchDir}...\n`);

  const markdownFiles = findMarkdownFiles(fullSearchDir);
  console.log(`Found ${markdownFiles.length} markdown files\n`);

  let totalFixed = 0;
  let filesFixed = 0;

  for (const file of markdownFiles) {
    const result = fixAnchorsInFile(file, dryRun);

    if (result.fixed) {
      filesFixed++;
      totalFixed += result.count;

      console.log(
        `${dryRun ? '📝' : '✅'} ${relative(baseDir, file)} (${result.count} fix${result.count > 1 ? 'es' : ''})`,
      );

      for (const replacement of result.replacements) {
        console.log(`   #${replacement.oldAnchor} → #${replacement.newAnchor}`);
      }
      console.log('');
    }
  }

  if (totalFixed === 0) {
    console.log('✅ No anchor links to fix!');
  } else {
    console.log(
      `\n${dryRun ? '📝' : '✅'} ${dryRun ? 'Would fix' : 'Fixed'} ${totalFixed} anchor link(s) in ${filesFixed} file(s)\n`,
    );

    if (dryRun) {
      console.log('Run without --dry-run to apply these fixes.');
    }
  }
}

main();
