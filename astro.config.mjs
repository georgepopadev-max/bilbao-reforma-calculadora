import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://bilbaoreforma.es';

// Mismo formato que las canonicals: sin .html ni barra final
function canonicalUrl(url) {
  let path = new URL(url).pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return SITE + (path === '/' ? '/' : path);
}

// lastmod de los artículos del blog, desde updated/date del frontmatter
const BLOG_LASTMOD = Object.fromEntries(
  readdirSync('./src/content/blog')
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const src = readFileSync(`./src/content/blog/${f}`, 'utf8');
      const date = src.match(/^updated: "?([\d-]+)"?/m)?.[1] || src.match(/^date: "?([\d-]+)"?/m)?.[1];
      return [`${SITE}/blog/${f.replace(/\.md$/, '')}`, date];
    })
    .filter(([, date]) => date)
);

// lastmod de las páginas .astro que declaran dateModified literal en su schema
function walkAstro(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return walkAstro(p);
    return f.endsWith('.astro') && !f.includes('[') ? [p] : [];
  });
}
const PAGE_LASTMOD = Object.fromEntries(
  walkAstro('./src/pages')
    .map((p) => {
      const date = readFileSync(p, 'utf8').match(/["']?dateModified["']?\s*:\s*["'](\d{4}-\d{2}-\d{2})/)?.[1];
      const path = p.replace(/^\.?\/?src\/pages/, '').replace(/\.astro$/, '').replace(/\/index$/, '');
      return [canonicalUrl(SITE + (path || '/')), date];
    })
    .filter(([, date]) => date)
);
const LASTMOD = { ...PAGE_LASTMOD, ...BLOG_LASTMOD };

// Páginas legales: indexables, pero sin valor para el sitemap
const SITEMAP_EXCLUDE = new Set(['/aviso-legal', '/politica-privacidad'].map((p) => SITE + p));

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'file',
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => !SITEMAP_EXCLUDE.has(canonicalUrl(page)),
      serialize: (item) => {
        const url = canonicalUrl(item.url);
        return LASTMOD[url] ? { ...item, url, lastmod: LASTMOD[url] } : { ...item, url };
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
