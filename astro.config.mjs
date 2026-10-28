import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://www.bilbaoreforma.es';

// Páginas que no son canónicas de sí mismas o no deben indexarse
const SITEMAP_EXCLUDE = new Set([
  '/donostia/reforma-donostia',
  '/vitoria/reforma-vitoria',
]);

// Mismo formato que las canonicals: sin .html ni barra final
function canonicalUrl(url) {
  let path = new URL(url).pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return SITE + (path === '/' ? '/' : path);
}

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
      filter: (page) => !SITEMAP_EXCLUDE.has(new URL(canonicalUrl(page)).pathname),
      serialize: (item) => ({ ...item, url: canonicalUrl(item.url) }),
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
