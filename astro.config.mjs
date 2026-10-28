import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

const SITE = 'https://www.bilbaoreforma.es';

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
      serialize: (item) => {
        const url = canonicalUrl(item.url);
        return BLOG_LASTMOD[url] ? { ...item, url, lastmod: BLOG_LASTMOD[url] } : { ...item, url };
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
