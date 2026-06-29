#!/usr/bin/env npx tsx
/**
 * fix-blog-bodies.ts
 * 
 * Reads legacy HTML blog files and extracts the <article> body content,
 * then injects it into the corresponding .md files after the frontmatter.
 * 
 * Preserves HTML inline (tables, CTAs, FAQs, etc.) - does NOT convert to pure MD.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEGACY_DIR = path.join(__dirname, '../../../legacy/blog');
const MD_DIR = path.join(__dirname, '../../../src/content/blog');

// Load all legacy HTML files
const legacyFiles = fs.readdirSync(LEGACY_DIR).filter(f => f.endsWith('.html'));

// Map HTML filenames to MD slugs
// e.g. reforma-bano-bilbao.html -> reforma-bano-bilbao.md
function htmlToSlug(htmlFile: string): string {
  return htmlFile.replace(/\.html$/, '');
}

async function extractArticleBody(htmlContent: string): Promise<string | null> {
  // Try <article> tag first
  let articleMatch = htmlContent.match(/<article(?:\s[^>]*)?>/);
  let contentStart = articleMatch?.index;
  let openTag = articleMatch?.[0];
  let closingTag = '</article>';

  // If no <article>, try <main class="article-main">
  if (!articleMatch) {
    articleMatch = htmlContent.match(/<main class="article-main"[^>]*>/);
    if (articleMatch) {
      contentStart = articleMatch.index;
      openTag = articleMatch[0];
      closingTag = '</main>';
    }
  }

  // Last resort: try <div class="article-content">
  if (!articleMatch) {
    articleMatch = htmlContent.match(/<div class="article-content"[^>]*>/);
    if (articleMatch) {
      contentStart = articleMatch.index;
      openTag = articleMatch[0];
      closingTag = '</div>';
    }
  }

  if (!articleMatch || contentStart === undefined) {
    console.warn('  No article/main/content container found');
    return null;
  }

  // Find the closing tag
  const contentEnd = htmlContent.indexOf(closingTag, contentStart);
  if (contentEnd === -1) {
    console.warn(`  No ${closingTag} closing tag found`);
    return null;
  }

  // Extract raw content
  const rawContent = htmlContent.slice(
    contentStart + openTag.length,
    contentEnd
  );

  // Clean the extracted content
  const cleaned = cleanArticleContent(rawContent, closingTag === '</main>');
  
  return cleaned;
}

function cleanArticleContent(content: string, isMain = false): string {
  let result = content;

  // Remove Google Tag Manager noscript/iframe (header area in article)
  result = result.replace(/<noscript>[\s\S]*?<\/noscript>/gi, '');
  
  // Remove article-header block (breadcrumb, category, title, meta)
  // This usually appears right after <article>
  result = result.replace(
    /<header class="article-header">[\s\S]*?<\/header>\s*/gi,
    ''
  );
  
  // Remove article-meta block (alternative meta format)
  result = result.replace(
    /<div class="article-meta">[\s\S]*?<\/div>\s*/gi,
    ''
  );

  // Remove breadcrumb nav inside article
  result = result.replace(
    /<nav class="article-breadcrumb">[\s\S]*?<\/nav>\s*/gi,
    ''
  );

  // Remove h1 title inside article (it's in frontmatter)
  result = result.replace(/<h1[^>]*>[\s\S]*?<\/h1>\s*/gi, '');

  // Remove standalone article-category span
  result = result.replace(/<span class="article-category">[\s\S]*?<\/span>\s*/gi, '');

  // Remove article-meta-item spans
  result = result.replace(/<span class="article-meta-item">[\s\S]*?<\/span>\s*/gi, '');

  // Remove AdSense placeholders
  result = result.replace(
    /<div class="adsense-container[^>]*>[\s\S]*?<\/div>\s*/gi,
    ''
  );

  // Remove Google Tag Manager iframes
  result = result.replace(
    /<iframe[\s\S]*?googletagmanager[\s\S]*?<\/iframe>\s*/gi,
    ''
  );

  // Remove mobile sidebar fallbacks
  result = result.replace(
    /<!-- Mobile sidebar fallback -->[\s\S]*?<aside class="mobile-sidebar"[^>]*>[\s\S]*?<\/aside>\s*/gi,
    ''
  );

  // Remove related-articles sidebar at the end
  result = result.replace(
    /<div class="related-articles">[\s\S]*?<\/div>\s*/gi,
    ''
  );

  // Remove sidebar widgets at the end
  result = result.replace(
    /<aside class="article-sidebar">[\s\S]*?<\/aside>\s*/gi,
    ''
  );

  // Remove any script tags
  result = result.replace(/<script[\s\S]*?<\/script>\s*/gi, '');

  // Remove HTML comments
  result = result.replace(/<!--[\s\S]*?-->\s*/g, '');

  // Remove hidden elements
  result = result.replace(/<div style="display:none[^"]*"[^>]*>[\s\S]*?<\/div>\s*/gi, '');

  // Trim
  result = result.trim();

  // If result is empty or just whitespace, return null
  if (!result || !result.replace(/\s+/g, '').length) {
    return '';
  }

  return result;
}

function findFrontmatterEnd(mdContent: string): number {
  const lines = mdContent.split('\n');
  let inFrontmatter = false;
  let firstDash = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '---') {
      if (firstDash === -1) {
        firstDash = i;
        inFrontmatter = true;
      } else {
        // Found closing ---
        return i;
      }
    }
  }
  return -1;
}

async function processBlog(slug: string): Promise<{success: boolean; error?: string}> {
  const legacyFile = path.join(LEGACY_DIR, `${slug}.html`);
  const mdFile = path.join(MD_DIR, `${slug}.md`);

  // Check if legacy HTML exists
  if (!fs.existsSync(legacyFile)) {
    // Try to find by partial match
    const legacyFilesForSlug = fs.readdirSync(LEGACY_DIR).filter(f => 
      f.includes(slug.replace(/-/g, '')) || f.includes(slug)
    );
    if (legacyFilesForSlug.length > 0) {
      return { success: false, error: `Slug mismatch: found ${legacyFilesForSlug.join(', ')} for ${slug}` };
    }
    return { success: false, error: `No legacy HTML found for ${slug}` };
  }

  // Read MD file
  if (!fs.existsSync(mdFile)) {
    return { success: false, error: `No MD file found for ${slug}` };
  }

  const mdContent = fs.readFileSync(mdFile, 'utf-8');
  const htmlContent = fs.readFileSync(legacyFile, 'utf-8');

  // Find frontmatter end
  const frontmatterEndLine = findFrontmatterEnd(mdContent);
  if (frontmatterEndLine === -1) {
    return { success: false, error: `No frontmatter found in ${slug}.md` };
  }

  const frontmatter = mdContent.split('\n').slice(0, frontmatterEndLine + 1).join('\n');

  // Extract article body
  const articleBody = await extractArticleBody(htmlContent);

  if (!articleBody || articleBody.length < 50) {
    return { success: false, error: `Article body too short or empty for ${slug}` };
  }

  // Build new MD content
  const newContent = frontmatter + '\n\n' + articleBody + '\n';

  fs.writeFileSync(mdFile, newContent, 'utf-8');
  return { success: true };
}

async function main() {
  console.log('🔧 Fixing blog bodies...\n');

  // Get all MD files
  const mdFiles = fs.readdirSync(MD_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${mdFiles.length} MD files\n`);

  const results = {
    success: [] as string[],
    failed: [] as {slug: string; error: string}[],
    skipped: [] as string[],
  };

  for (const mdFile of mdFiles) {
    const slug = mdFile.replace(/\.md$/, '');
    process.stdout.write(`Processing ${slug}... `);
    
    try {
      const result = await processBlog(slug);
      if (result.success) {
        console.log('✅');
        results.success.push(slug);
      } else {
        console.log(`❌ ${result.error}`);
        results.failed.push({ slug, error: result.error! });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.log(`❌ Error: ${errMsg}`);
      results.failed.push({ slug, error: errMsg });
    }
  }

  console.log('\n--- SUMMARY ---');
  console.log(`✅ Success: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⏭️  Skipped: ${results.skipped.length}`);

  if (results.failed.length > 0) {
    console.log('\nFailed blogs:');
    for (const f of results.failed) {
      console.log(`  - ${f.slug}: ${f.error}`);
    }
  }

  if (results.success.length === 42) {
    console.log('\n🎉 All 42 blogs fixed!');
  }
}

main().catch(console.error);
