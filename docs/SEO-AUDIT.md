# Auditoría SEO — Bilbao Reforma Calculadora

**Fecha de auditoría:** 2026-06-24
**Alcance:** Sitio completo (Bilbao + Donostia + Vitoria)
**Modelo:** static site — HTML/CSS/JS vanilla — Vercel

---

## Resumen ejecutivo

- **Fortaleza principal:** El proyecto tiene una base SEO sólida — schema markup completo (LocalBusiness + FAQPage + HowTo + CollectionPage), sitemap.xml con 3 sitemap-index, páginas por barrio, arquitectura de hub-and-spoke para baño/cocina, y mucho contenido SEO long-tail bien estructurado. El robots.txt es limpio.
- **Problema más urgente:** Las imágenesOG están ausentes en el 95% de las páginas (homepage, blog index, 42 de 44 artículos). Esto perjudica gravemente el CTR en redes sociales y la capacidad de Google para mostrar rich snippets visuales.
- **第二大 problema:** Hay artículos duplicados (mismo contenido con URLs distintas) que diluyen el link equity y generan cannibalización de keywords.
- **Tercera prioridad:** No hay hreflang entre las versiones Bilbao / Donostia / Vitoria, ni Twitter Cards en la mayoría de páginas.
- **Oportunidad más clara:** La keyword `"calculadora reformas Bilbao"` es el asset más diferenciador y está infra-aprovechada — la homepage no tiene `og:image` y el blog index tampoco, lo que mata el viral potential de un contenido que se comparte bien.

---

## Issues priorizados por impacto

### 🔴 Alto impacto

| # | Issue | Página(s) afectada(s) | Fix sugerido |
|---|---|---|---|
| H1 | **Homepage sin `og:image`** | `index.html` | Crear `/images/og-default.jpg` y añadir `<meta property="og:image" content="…">` + `<meta property="og:image:width" content="1200">` + `<meta property="og:image:height" content="630">` |
| H2 | **Blog index sin `og:image`** | `blog/index.html` | Crear og-image para el blog index |
| H3 | **42/44 artículos sin `og:image`** | `blog/*.html` | Generar og-image para cada artículo. Mínimo: los 10 más importantes (baño, cocina, integral, precios). Solo 2 artículos lo tienen (`licencias-obra-bilbao-2026`, `subvenciones-reformas-bilbao-2026`) |
| H4 | **2/44 artículos sin canonical** | `licencias-obra-bilbao-2026.html`, `subvenciones-reformas-bilbao-2026.html` | Añadir `<link rel="canonical">` en `<head>` de ambos |
| H5 | **Artículos duplicados** | `reforma-bano-bilbao.html` vs `reforma-bano-bilbao-2025.html`; `reforma-cocina-bilbao.html` vs `reforma-cocina-bilbao.html` (breve, misma URL); `licencias-obra-bilbao.html` vs `licencias-obra-bilbao-2026.html`; `subvenciones-reformas-bilbao.html` vs `subvenciones-reformas-bilbao-2026.html` | 301-redirect de la versión vieja a la nueva + `sitemap.xml` actualizado. Consolidad en una sola URL con contenido combinado |
| H6 | **Meta keywords obsoleto** | `index.html` | Eliminar `<meta name="keywords">`. Google no lo usa desde 2009 y puede сигнализиар negligencia SEO. Solo la descripción (`description`) importa |
| H7 | **Sin Twitter Cards** | `index.html`, `blog/index.html`, 42 artículos | Añadir `<meta name="twitter:card" content="summary_large_image">` + `twitter:title` + `twitter:description` + `twitter:image` en todas las páginas principales |

### 🟡 Medio impacto

| # | Issue | Página(s) afectada(s) | Fix sugerido |
|---|---|---|---|
| M1 | **Sin `hreflang` para versiones de ciudad** | `donostia/`, `vitoria/` | Añadir `<link rel="alternate" hreflang="es-es" href="…">` en las 3 versiones (y la versión principal Bilbao) para consolidar signals. También `<html lang="es">` ya está bien, pero falta la señal explícita de variants |
| M2 | **Sin `font-display: swap` en CSS** | `css/styles.css` | La Google Font (Inter, Playfair Display) se carga sin `font-display: swap`, lo que causa FOIT (flash of invisible text). Añadir `display=swap` a las URLs de Google Fonts |
| M3 | **lazy loading ausente en homepage y blog** | `index.html`, `blog/*.html` | Aunque hay few imágenes reales, las que hay en `empresas/` sí usan `loading="lazy"`. Asegurar que **todas** las `<img>` usen `loading="lazy"` y `decoding="async"` |
| M4 | **Sin lastmod en varios artículos del sitemap** | `sitemap-bilbao.xml` | Añadir `<lastmod>` a las entradas sin él (varios artículos blog no tienen fecha de modificación) |
| M5 | **Sin imágenes reales en los artículos del blog** | `blog/*.html` | Los artículos solo usan SVGs inline placeholder. Añadir al menos 1 imagen real por artículo (optimizada a WebP, < 100KB, con `alt` descriptivo) para mejorar engagement y sharing visual |
| M6 | **No hay `srcset` ni WebP** | `/images/` | Las 2 imágenes existentes son PNG. Convertir a WebP para la og:image y añadir `srcset` si hay varias resoluciones |
| M7 | **robots.txt muy permisivo** | `robots.txt` | `Allow: /` es correcto, pero debería añadir `Crawl-delay: 1` para evitar sobrecargar el servidor con crawls rápidos |
| M8 | **No hay VideoObject ni ImageGallery schema** | `blog/*.html` | Para artículos tipo "tendencias" y "comparativas", un `ImageGallery` o `VideoObject` mejoraría rich snippets |

### 🟢 Bajo impacto

| # | Issue | Página(s) | Fix sugerido |
|---|---|---|---|
| L1 | **Sin `dns-prefetch` para Google Fonts** | `index.html` | `dns-prefetch` ya está con `preconnect` en fonts, pero si se usan otros CDNs (fontawesome, etc.), añadir `dns-prefetch` específico |
| L2 | **Footer address sin `itemprop` completo** | `index.html` | El footer ya usa `itemtype="https://schema.org/PostalAddress"`, pero falta `streetAddress` y el `address` global con `itemprop="address"` |
| L3 | **Testimonios sin schema `Review` o `Testimonial`** | `index.html` | Los testimonios en la homepage usan datos estructurados inline pero no hay schema `Review`. Añadir `Review` o `AggregateRating` para rich stars en SERP |
| L4 | **Favicon SVG no incluido en algunas subpáginas** | `donostia/`, `vitoria/` | Verificar que todos los subdominios (donostia, vitoria) cargan sus propios SVG favicons correctamente |

---

## Quick wins (< 1h cada uno)

> **Total estimado: ~4-5 horas si se hacen en batch**

1. **Añadir `og:image` a homepage + blog index** (~15 min)
   - Crear `/images/og-default.jpg` (1200×630)
   - Añadir los 4 meta tags og:image en `index.html` y `blog/index.html`

2. **Eliminar `<meta name="keywords">`** (~2 min)
   - Es ruido que сигнализиар desconocimiento SEO moderno

3. **Añadir `font-display: swap`** (~5 min)
   - En la URL de Google Fonts: añadir `&display=swap` al href

4. **Añadir `twitter:card` a homepage + blog index** (~10 min)
   - `summary_large_image` es el más efectivo para contenido con imágenes

5. **Añadir canonical a los 2 artículos sin él** (~5 min)
   - `licencias-obra-bilbao-2026.html` y `subvenciones-reformas-bilbao-2026.html`

6. **Añadir `Crawl-delay: 1` en robots.txt** (~2 min)

7. **Crear og-images batch para los 10 artículos más importantes** (~2-3h)
   - Programa: `reforma-bano-bilbao`, `reforma-cocina-bilbao`, `precio-reforma-integral-bilbao`, `presupuesto-reforma-bano-bilbao`, `presupuesto-reforma-cocina-bilbao`, `precio-m2-reforma-bano-bilbao`, `precio-m2-reforma-cocina-bilbao`, `reformas-bilbao-guia-2025`, `reformas-bilbao-precios`, `errores-comunes-reforma-bilbao`
   - Mismo template con título, keyword, y ciudad — solo cambiar texto

8. **Crear og-images para el resto de artículos (34 restantes)** (~4-6h si se hace manualmente)
   - Esto es más de 1h — se clasifica como medium effort

---

## Medium-effort wins (1-4h cada uno)

1. **Consolidar artículos duplicados** (~2-3h)
   - Analizar qué artículos son duplicados exactos vs updates de año
   - Hacer 301-redirect de viejo → nuevo
   - Actualizar sitemap para reflejar URLs canónicas

2. **Generar y añadir og:image a los 34 artículos restantes** (~3-4h)
   - Crear script de generación batch o hacerlo manualmente con un template

3. **Añadir `hreflang` entre Bilbao / Donostia / Vitoria** (~1-2h)
   - Crear versión "master" de cada sitemap con hreflang correcto
   - Añadir `<link rel="alternate" hreflang="es-ES">` en cada `<head>`

4. **Añadir 1 imagen real por artículo blog** (~3-4h)
   - Buscar/crear imágenes libres de derechos (Unsplash, Pexels)
   - Convertir a WebP, < 100KB
   - Añadir con `alt`, `loading="lazy"`, `decoding="async"`, `srcset`

5. **Añadir schema `Review` / `AggregateRating` a testimonios homepage** (~1h)

6. **Optimizar imágenes existentes a WebP** (~1h)
   - `logo-bilbao-reforma.png` → WebP
   - `og-default.jpg` → crear en WebP además de JPG

---

## Proyectos grandes (sprint completo, 1-2 semanas)

1. **Rebuild del contenido de Donostia y Vitoria**
   - Las versiones de Donostia y Vitoria son shells sin profundidad de contenido.local. Replicar la estructura Bilbao con artículos específicos por ciudad (no copias de Bilbao renombradas)
   - Esto requiere contenido local real para cada ciudad

2. **Portal de leads mejorado**
   - El modelo actual de mailto + jsPDF limita la conversión. Un formulario real con email + consentimiento GDPR + CRM backend (no-code: Webflow + Zapier, o similar) multiplicaría leads

3. **Auditoría de enlaces internos completa**
   - Implementar el internal linking audit ya موجود en `content/internal-linking-audit.md`
   - Crear enlaces contextuales entre artículos (ej: "reforma-bano" → "precio-m2-bano" → "hub-bano")

4. **Core Web Vitals audit + optimization**
   - Medir LCP, FID, CLS con PageSpeed Insights
   - El site parece ligero, pero no hay minificación de HTML
   - Considerar critical CSS inline para above-the-fold

5. **SEO para "near me" + mapa de barrios**
   - Crear `/barrios/` pages para más barrios: Begoña, Zazpi, San Ignacio, Otxarkoaga, Bolueta
   - Añadir `LocalBusiness` schema específico por barrio

6. **Programa de linkbuilding**
   - Los competidores de Bilbao (portalbilbao.com, ahoramejor.com) tienen backlinks de directorios locales
   - Registrar en: bizkaiadirectorio.com, euskalguztelk.com, guías locales de Bilbao

---

## Keywords long-tail recomendadas

Basado en análisis del contenido existente y gaps vs competidores:

| Keyword | Tipo | Dificultad | Prioridad |
|---|---|---|---|
| `calculadora presupuesto reforma integral Bilbao` | informational + transactional | Baja | 🔴 Alta |
| `cuanto cuesta reformarme el baño en Bilbao` | informational | Baja | 🔴 Alta |
| `precio m2 reforma cocina Bilbao 2026` | informational | Media | 🔴 Alta |
| `empresa reforma piso Bilbao recomendada` | navigational | Media | 🔴 Alta |
| `reforma baño pequeño 4m2 Bilbao precio` | long-tail informational | Baja | 🟡 Media |
| `reforma integral piso 70m2 Bilbao presupuesto` | long-tail transactional | Media | 🟡 Media |
| `reforma edificio antiguo Casco Viejo Bilbao precio` | long-tail informational | Baja | 🟡 Media |
| `licencia obra reforma Bilbao tiempo tramitación` | informational | Baja | 🟡 Media |
| `subvenciones Gobierno Vasco reforma vivienda Bilbao 2026` | informational | Baja | 🟡 Media |
| `reforma piso Indautxu presupuesto` | long-tail local | Baja | 🟡 Media |
| `empresas reformas Deusto Bilbao opiniones` | navigational | Media | 🟡 Media |
| `cuanto tarda una reforma integral en Bilbao` | informational | Baja | 🟢 Baja |
| `reforma vs comprar piso Bilbao merece pena` | informational/comparativa | Baja | 🟢 Baja |
| `cambio suelo parquet Bilbao precio m2` | informational | Baja | 🟢 Baja |
| `suelo radiante Bilbao precio instalación` | informational | Baja | 🟢 Baja |
| `reforma baño para personas mayores Bilbao` | informational | Baja | 🟢 Baja |

---

## Schema markup recomendado (código listo para copiar-pegar)

### Home / Calculadora — WebSite + SearchAction

```html
<!-- Schema.org WebSite con SearchAction -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Bilbao Reforma",
  "url": "https://www.bilbaoreforma.es/",
  "description": "Calculadora de presupuestos de reformas en Bilbao 2026. Precios orientativos gratis en 2 minutos.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.bilbaoreforma.es/calculadora/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
</script>
```

### Article (blog posts)

```html
<!-- Schema.org Article para blog posts -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[TÍTULO DEL ARTÍCULO]",
  "description": "[META DESCRIPTION]",
  "author": {
    "@type": "Organization",
    "name": "Bilbao Reforma",
    "url": "https://www.bilbaoreforma.es/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Bilbao Reforma",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.bilbaoreforma.es/images/logo-bilbao-reforma.png"
    }
  },
  "datePublished": "2026-06-17",
  "dateModified": "2026-06-24",
  "inLanguage": "es-ES",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "[URL CANÓNICA]"
  },
  "image": {
    "@type": "ImageObject",
    "url": "[OG IMAGE URL]",
    "width": 1200,
    "height": 630
  }
}
</script>
```

### Service schema (para directorio de empresas)

```html
<!-- Schema.org Service para páginas de empresa -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "[Nombre de Empresa] - Reformas Bilbao",
  "description": "[Descripción breve de la empresa]",
  "provider": {
    "@type": "LocalBusiness",
    "name": "[Nombre de Empresa]",
    "url": "[URL de la página de empresa]",
    "telephone": "[Teléfono]",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bilbao",
      "addressRegion": "Bizkaia",
      "postalCode": "48001",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.26,
      "longitude": -2.93
    }
  },
  "areaServed": {
    "@type": "State",
    "name": "Bizkaia"
  },
  "serviceType": "Reformas de vivienda",
  "url": "[URL de la página de empresa]"
}
</script>
```

### FAQPage genérico para artículos (copiar y adaptar)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta [keyword principal]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Respuesta con dato concreto de precio]"
      }
    },
    {
      "@type": "Question",
      "name": "¿[segunda FAQ]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Respuesta]"
      }
    }
  ]
}
</script>
```

---

## Sugerencias de nuevos artículos

| # | Título propuesto | Keyword target | Razón estratégica |
|---|---|---|---|
| 1 | **"Reforma Integral Piso 60m2 Bilbao: Presupuesto Detallado 2026"** | `reforma integral piso 60m2 Bilbao` | Long-tail de alta intención de conversión. Artículo de ejemplo real tipo caso-práctico. |
| 2 | **"Reforma Piso Indautxu Bilbao: Precios, Barrio y Empresas 2026"** | `reforma piso Indautxu Bilbao` | Página de barrio para Indautxu (zona premium). Solo existe Deusto, Santutxu, Indautxu en barrios/ |
| 3 | **"Reforma Cocina 10m2 Bilbao: Precio y Ejemplo Real 2026"** | `reforma cocina 10m2 Bilbao` | Long-tail específica de cocina. Complemento natural al hub de cocina existente. |
| 4 | **"Reforma Baño 4m2 Pequeño Bilbao: Soluciones y Precio 2026"** | `reforma baño 4m2 Bilbao` | Artículo ya existe (`reforma-bano-pequeno-bilbao.html`) — consolidar y mejorar con prices actualizados 2026 |
| 5 | **"Mudanza + Reforma: Cuánto Cuesta Reformar para Alquilar en Bilbao"** | `reforma para alquilar Bilbao` | Nicho desatendido. Dueños/inversores son audiencia de alto valor comercial. |
| 6 | **"Reforma con Aislamiento Térmico Bilbao: SATE, Ventanas y Ahorro"** | `reforma aislamiento térmico Bilbao` | Tema de eficiencia energética trending 2026. Combinable con aerotermia/suelo radiante ya cubiertos. |
| 7 | **"Reforma Cocina vs Baño: Qué Reforma Priorizar en 2026"** | `reforma cocina vs baño Bilbao` | Artículo comparativo que genera enlaces internos y tiempo en site. |
| 8 | **"Empresas Reformas Bilbao con Buenas Reseñas 2026: Top 10"** | `empresas reformas Bilbao opiniones` | Genera backlinks (las empresas quieren aparecer) y consolida el directorio como recurso de autoridad. |
| 9 | **"Reforma piso Bilbaino de los 70: Guía del Casco Viejo y Barrios Industriales"** | `reforma piso años 70 Bilbao` | Atractivo local. Casco Viejo es un barrio de referencia con edificios de esta época. |
| 10 | **"Guía Definitiva: Cuánto Cuesta Reformar en Bizkaia 2026 (Todos los Barrios)"** | `precios reforma Bizkaia 2026` | Artículo paraguas que consolida la autoridad del site sobre "precio reforma" en toda la provincia. |

---

## Tabla resumen de issues

| Prioridad | Cantidad | Issues principales |
|---|---|---|
| 🔴 Alto | 7 | og:image ausente (home, blog index, 42 artículos), canonical missing, duplicados, meta keywords obsoleto, sin Twitter Cards |
| 🟡 Medio | 8 | hreflang, font-display, lazy loading, lastmod, imágenes reales en blog, WebP, Crawl-delay, VideoObject |
| 🟢 Bajo | 4 | dns-prefetch, address schema, Review/Testimonial, favicon SVG en subdominios |

---

## Competidores clave observados

| Competidor | Lo que hacen bien | Gap de Bilbao Reforma |
|---|---|---|
| **portalbilbao.com** | Listado en guías locales de Bilbao | Bilbao Reforma no tiene presencia en esos directorios |
| **ahoramejor.com** | Contenido de comparativas extenso | Bilbao Reforma tiene mejor schema pero menos backlinks |
| **eraber.com** | Blog con contenido temático denso (oficinas, locales) | Bilbao Reforma tiene calculator como USP, pero no lo explora en contenido |
| **robleragency.com** | Páginas por ciudad dentro de España | Bilbao Reforma ya lo hace (Donostia, Vitoria) — pero el contenido no es local |

---

*Auditoría realizada por subagente. Investigación de lectura, sin modificaciones al código fuente.*
