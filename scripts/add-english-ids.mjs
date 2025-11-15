#!/usr/bin/env node

/**
 * Script to add explicit English IDs to Portuguese headings.
 *
 * This script finds anchor links that don't match Portuguese headings and
 * adds {#english-id} to the headings to preserve English anchor compatibility.
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
      line: content.substring(0, match.index).split('\n').length,
      fullMatch: match[0],
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
      line: content.substring(0, match.index).split('\n').length,
      fullMatch: match[0],
      isDocsStep: true,
    });
  }

  return headings;
}

// Extract internal anchor links from markdown content
function extractAnchorLinks(content) {
  const links = [];

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

// Add English IDs to headings in a file
function addEnglishIdsToFile(filePath, dryRun = false) {
  const content = readFileSync(filePath, 'utf8');
  let newContent = content;

  const headings = extractHeadings(content);
  const links = extractAnchorLinks(content);

  const validIds = new Set(headings.map((h) => h.id));
  const updates = [];

  // Find anchor links that don't match any heading ID
  for (const link of links) {
    if (!validIds.has(link.anchor)) {
      // Try to find a heading that could match this anchor
      const bestHeading = findBestHeadingMatch(link.anchor, headings);

      if (bestHeading && !extractCustomId(bestHeading.text)) {
        // Add custom ID to this heading
        updates.push({
          heading: bestHeading,
          customId: link.anchor,
        });
      }
    }
  }

  // Remove duplicates
  const uniqueUpdates = [];
  const seen = new Set();
  for (const update of updates) {
    const key = `${update.heading.line}:${update.customId}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueUpdates.push(update);
    }
  }

  // Apply updates
  if (uniqueUpdates.length > 0) {
    for (const update of uniqueUpdates) {
      const heading = update.heading;
      let newHeading;

      if (heading.isDocsStep) {
        // For docs-step: <docs-step title="Text">
        newHeading = heading.fullMatch.replace(
          /title="([^"]+)"/,
          `title="$1 {#${update.customId}}"`,
        );
      } else {
        // For regular headings: ## Text
        newHeading = `${heading.fullMatch} {#${update.customId}}`;
      }

      newContent = newContent.replace(heading.fullMatch, newHeading);
    }

    if (!dryRun) {
      writeFileSync(filePath, newContent, 'utf8');
    }

    return {
      updated: true,
      count: uniqueUpdates.length,
      updates: uniqueUpdates,
    };
  }

  return {updated: false, count: 0, updates: []};
}

// Find the best heading match for an anchor
function findBestHeadingMatch(anchor, headings) {
  let bestMatch = null;
  let bestScore = Infinity;

  for (const heading of headings) {
    // Skip headings that already have custom IDs
    if (extractCustomId(heading.text)) {
      continue;
    }

    // Calculate similarity score
    const headingId = generateAnchorId(heading.text);
    const commonPrefixLen = getCommonPrefixLength(anchor, headingId);
    const containsSubstring =
      headingId.includes(anchor.substring(0, Math.min(10, anchor.length))) ||
      anchor.includes(headingId.substring(0, Math.min(10, headingId.length)));

    const lengthDiff = Math.abs(anchor.length - headingId.length);
    const score = lengthDiff - commonPrefixLen * 2 - (containsSubstring ? 5 : 0);

    if (score < bestScore) {
      bestScore = score;
      bestMatch = heading;
    }
  }

  // Only return a match if the score is reasonable
  if (bestScore < 15 && bestMatch) {
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

  console.log(`${dryRun ? 'Checking' : 'Adding'} English IDs in ${searchDir}...\n`);

  const markdownFiles = findMarkdownFiles(fullSearchDir);
  console.log(`Found ${markdownFiles.length} markdown files\n`);

  let totalUpdated = 0;
  let filesUpdated = 0;

  for (const file of markdownFiles) {
    const result = addEnglishIdsToFile(file, dryRun);

    if (result.updated) {
      filesUpdated++;
      totalUpdated += result.count;

      console.log(
        `${dryRun ? '📝' : '✅'} ${relative(baseDir, file)} (${result.count} heading${result.count > 1 ? 's' : ''})`,
      );

      for (const update of result.updates) {
        console.log(`   Line ${update.heading.line}: Added {#${update.customId}}`);
      }
      console.log('');
    }
  }

  if (totalUpdated === 0) {
    console.log('✅ No headings need English IDs!');
  } else {
    console.log(
      `\n${dryRun ? '📝' : '✅'} ${dryRun ? 'Would add' : 'Added'} ${totalUpdated} English ID(s) to ${filesUpdated} file(s)\n`,
    );

    if (dryRun) {
      console.log('Run without --dry-run to apply these changes.');
    }
  }
}

main();
