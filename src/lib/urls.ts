/**
 * Rutas internas canónicas: absolutas, sin .html y sin barra final.
 */
export type City = 'bilbao' | 'donostia' | 'vitoria';

export const SITE_URL = 'https://www.bilbaoreforma.es';

// Bilbao vive en la raíz; Donostia y Vitoria bajo su prefijo.
export function cityPath(city: City = 'bilbao', section = ''): string {
  const base = city === 'bilbao' ? '' : `/${city}`;
  const path = section ? `${base}/${section}` : base;
  return path || '/';
}

// Normaliza cualquier URL interna al formato canónico.
export function canonicalPath(url: string): string {
  let path = url.startsWith('http') ? new URL(url).pathname : url;
  path = path.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return path || '/';
}

export function absoluteUrl(url: string): string {
  const path = canonicalPath(url);
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}
