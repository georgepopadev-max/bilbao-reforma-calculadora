/**
 * html-to-markdown.ts
 * Converts legacy HTML blog files to Markdown with YAML frontmatter.
 * 
 * Usage: npx tsx src/scripts/analyzers/html-to-markdown.ts [blog-file.html] [output.md]
 *   or: npx tsx src/scripts/analyzers/html-to-markdown.ts --all
 * 
 * Extracts: title, description, canonical, date, readingTime, FAQPage, BreadcrumbList,
 *           in-content CTAs, price tables, article content.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FAQ {
  name: string;
  acceptedAnswer: string;
}

interface Breadcrumb {
  name: string;
  item: string;
}

interface CTA {
  type: 'herramienta' | 'leer';
  label: string;
  href: string;
}

interface Frontmatter {
  title: string;
  description: string;
  canonical: string;
  date?: string;
  readingTime?: string;
  category?: string;
  city?: string;
  faqs: FAQ[];
  breadcrumbs: Breadcrumb[];
  ctas: CTA[];
  priceTables: number; // count of price tables
}

// ─── Slug extractor ──────────────────────────────────────────────────────────

function slugFromPath(htmlPath: string): string {
  const base = path.basename(htmlPath, '.html');
  return base;
}

// ─── JSON-LD extractor ───────────────────────────────────────────────────────

function extractJsonLd<T>($: cheerio.CheerioAPI, type: string): T | null {
  const scripts = $('script[type="application/ld+json"]');
  for (const script of scripts.toArray()) {
    const text = $(script).html() || '';
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        const found = data.find((d: Record<string, unknown>) => d['@type'] === type);
        if (found) return found as T;
      } else if (data['@type'] === type) {
        return data as T;
      }
    } catch {
      // ignore parse errors
    }
  }
  return null;
}

// ─── FAQPage extractor ────────────────────────────────────────────────────────

function extractFaqs($: cheerio.CheerioAPI): FAQ[] {
  const faqPage = extractJsonLd<{ mainEntity?: Array<{ name: string; acceptedAnswer?: { text?: string } }> }>($, 'FAQPage');
  if (!faqPage?.mainEntity) return [];
  return faqPage.mainEntity.map(faq => ({
    name: faq.name || '',
    acceptedAnswer: faq.acceptedAnswer?.text || '',
  }));
}

// ─── BreadcrumbList extractor ─────────────────────────────────────────────────

function extractBreadcrumbs($: cheerio.CheerioAPI): Breadcrumb[] {
  const breadcrumb = extractJsonLd<{ itemListElement?: Array<{ name?: string; item?: string }> }>($, 'BreadcrumbList');
  if (!breadcrumb?.itemListElement) return [];
  return breadcrumb.itemListElement.map(item => ({
    name: item.name || '',
    item: item.item || '',
  }));
}

// ─── CTA extractor ────────────────────────────────────────────────────────────

function extractCTAs($: cheerio.CheerioAPI): CTA[] {
  const ctas: CTA[] = [];
  $('.in-content-cta').each((_, el) => {
    const labelEl = $(el).find('.in-content-cta-label');
    const labelText = labelEl.text().trim();
    const type: CTA['type'] = labelText.includes('Herramienta') ? 'herramienta' : 'leer';
    $(el).find('a').each((__, anchor) => {
      const href = $(anchor).attr('href') || '';
      const ctaLabel = $(anchor).text().trim();
      if (href && ctaLabel) {
        ctas.push({ type, label: ctaLabel, href });
      }
    });
  });
  return ctas;
}

// ─── Article content extractor ───────────────────────────────────────────────

function extractArticle($: cheerio.CheerioAPI): string {
  const $article = $('.article-content');
  if ($article.length === 0) return '';

  // Clean up: remove in-content-cta, sidebar, scripts, ads
  $article.find('.in-content-cta, .adsense-sidebar, script, .sidebar-widget').remove();

  // Remove article-inner elements that are just wrappers
  $article.find('.article-inner').children().unwrap();

  // Remove empty paragraphs
  $article.find('p').each((_, p) => {
    const text = $(p).text().trim();
    if (!text) $(p).remove();
  });

  // Process tables: wrap in .table-wrap
  $article.find('table').each((_, table) => {
    const $table = $(table);
    $table.wrap('<div class="table-wrap"></div>');
  });

  // Preserve HTML tables
  return $article.html() || '';
}

// ─── City detector ───────────────────────────────────────────────────────────

function detectCity($: cheerio.CheerioAPI, canonical: string): string {
  if (canonical.includes('donostia')) return 'donostia';
  if (canonical.includes('vitoria')) return 'vitoria';
  // Check body classes / nav links for hints
  const bodyText = $('body').text().toLowerCase();
  if (bodyText.includes('donostia') || bodyText.includes('san sebastián')) return 'donostia';
  if (bodyText.includes('vitoria') || bodyText.includes('gasteiz')) return 'vitoria';
  return 'bilbao';
}

// ─── Category detector ────────────────────────────────────────────────────────

function detectCategory(title: string, canonical: string): string {
  const t = title.toLowerCase() + canonical.toLowerCase();
  if (t.includes('baño') || t.includes('bano')) return 'bano';
  if (t.includes('cocina')) return 'cocina';
  if (t.includes('integral')) return 'integral';
  if (t.includes('pintura') || t.includes('pintar')) return 'pintura';
  if (t.includes('suelo') || t.includes('parqué') || t.includes('porcelánico') || t.includes('vinílico')) return 'suelo';
  if (t.includes('subvencion') || t.includes('ayuda')) return 'subvenciones';
  if (t.includes('empresa')) return 'empresas';
  if (t.includes('precio') || t.includes('presupuesto') || t.includes('coste')) return 'presupuesto';
  if (t.includes('licencia') || t.includes('permiso')) return 'legal';
  if (t.includes('fachada')) return 'fachada';
  if (t.includes('calefaccion') || t.includes('suelo radiante') || t.includes('aerotermia') || t.includes('caldera')) return 'calefaccion';
  return 'general';
}

// ─── Main converter ──────────────────────────────────────────────────────────

function convertHtmlToMarkdown(htmlContent: string, htmlPath: string): string {
  const $ = cheerio.load(htmlContent);

  // ── Metadata ──
  const title = $('title').text().trim()
    .replace(/\s*[-|]\s*Bilbao Reforma\s*$/i, '')
    .replace(/\s*\|\s*Bilbao Reforma\s*$/i, '')
    .trim() || slugFromPath(htmlPath);

  const description = $('meta[name="description"]').attr('content')?.trim() || '';

  const canonical = $('link[rel="canonical"]').attr('href')?.trim() || '';

  // Date: look in article-meta
  let date: string | undefined;
  const dateMatch = $('.article-meta').text().match(/\d{1,2}\s+[ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic][a-z]*\s+\d{4}/i);
  if (dateMatch) {
    date = dateMatch[0];
  }

  // Reading time
  let readingTime: string | undefined;
  const rtMatch = $('.article-meta').text().match(/(\d+)\s*min\s*de\s*lectura/i);
  if (rtMatch) {
    readingTime = rtMatch[1] + ' min';
  }

  // ── JSON-LD data ──
  const faqs = extractFaqs($);
  const breadcrumbs = extractBreadcrumbs($);
  const ctas = extractCTAs($);

  // ── Price tables ──
  const priceTableCount = $('.article-content table').length;

  // ── Article body ──
  const articleHtml = extractArticle($);

  // ── City & category ──
  const city = detectCity($, canonical);
  const category = detectCategory(title, canonical);

  // ── Build frontmatter ──
  const fm: Frontmatter = {
    title,
    description,
    canonical,
    date,
    readingTime,
    category,
    city,
    faqs,
    breadcrumbs,
    ctas,
    priceTables: priceTableCount,
  };

  // ── Serialize frontmatter ──
  let frontmatter = '---\n';
  frontmatter += `title: "${fm.title.replace(/"/g, '\\"')}"\n`;
  frontmatter += `description: "${fm.description.replace(/"/g, '\\"')}"\n`;
  frontmatter += `canonical: "${fm.canonical}"\n`;
  if (fm.date) frontmatter += `date: "${fm.date}"\n`;
  if (fm.readingTime) frontmatter += `readingTime: "${fm.readingTime}"\n`;
  frontmatter += `category: "${fm.category}"\n`;
  frontmatter += `city: "${fm.city}"\n`;
  frontmatter += `faqs:\n`;
  for (const faq of fm.faqs) {
    frontmatter += `  - name: "${faq.name.replace(/"/g, '\\"')}"\n`;
    frontmatter += `    answer: "${faq.acceptedAnswer.slice(0, 200).replace(/"/g, '\\"')}"\n`;
  }
  frontmatter += `breadcrumbs:\n`;
  for (const crumb of fm.breadcrumbs) {
    frontmatter += `  - name: "${crumb.name.replace(/"/g, '\\"')}"\n`;
    frontmatter += `    url: "${crumb.item}"\n`;
  }
  frontmatter += `ctas:\n`;
  for (const cta of fm.ctas) {
    frontmatter += `  - type: "${cta.type}"\n`;
    frontmatter += `    label: "${cta.label.replace(/"/g, '\\"')}"\n`;
    frontmatter += `    href: "${cta.href}"\n`;
  }
  frontmatter += `priceTables: ${fm.priceTables}\n`;
  frontmatter += '---\n\n';

  // ── Combine ──
  // Replace relative hrefs (without ../) with full blog paths for .html files
  let body = articleHtml;

  return frontmatter + body;
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--all')) {
    // Migrate all blog HTML files
    const blogDir = path.resolve('blog');
    const outDir = path.resolve('src/content/blog');
    const fs2 = await import('fs/promises');
    await fs2.mkdir(outDir, { recursive: true });

    const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && !f.includes('index.html') && !f.includes('hub-'));
    console.log(`Found ${files.length} blog HTML files to migrate`);

    let migrated = 0;
    let errors = 0;
    const errorFiles: string[] = [];

    for (const file of files.sort()) {
      const inPath = path.join(blogDir, file);
      const outFile = file.replace(/\.html$/, '.md');
      const outPath = path.join(outDir, outFile);

      // Skip if already migrated by A1
      try {
        if (fs.existsSync(outPath)) {
          console.log(`SKIP (exists): ${outFile}`);
          continue;
        }
      } catch {}

      try {
        const html = fs.readFileSync(inPath, 'utf-8');
        const markdown = convertHtmlToMarkdown(html, inPath);
        fs.writeFileSync(outPath, markdown, 'utf-8');
        migrated++;
        console.log(`OK: ${outFile}`);
      } catch (err) {
        errors++;
        errorFiles.push(file);
        console.error(`ERROR: ${file} — ${err}`);
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Migrated: ${migrated}`);
    console.log(`Errors: ${errors}`);
    if (errorFiles.length) console.log(`Failed: ${errorFiles.join(', ')}`);
    return;
  }

  if (args.length >= 2) {
    const [inPath, outPath] = args;
    const html = fs.readFileSync(inPath, 'utf-8');
    const markdown = convertHtmlToMarkdown(html, inPath);
    fs.writeFileSync(outPath, markdown, 'utf-8');
    console.log(`Written: ${outPath}`);
    return;
  }

  // Single file from stdin
  const html = fs.readFileSync(0, 'utf-8');
  const markdown = convertHtmlToMarkdown(html, 'stdin');
  process.stdout.write(markdown);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
