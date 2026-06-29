# CONTEXT — Proyecto Migración Bilbao Reforma a Astro

## 🎯 Objetivo general
Migrar `bilbao-reforma-calculadora/` (103 HTML vanilla) a Astro 4.x manteniendo:
- URLs `.html` exactas (no migración a `/blog/<slug>/`)
- Schema.org idéntico (FAQPage, BreadcrumbList, LocalBusiness, ItemList, CollectionPage, Service, OfferCatalog)
- Vercel adapter (mismo deploy)
- SEO intacto (Google no debe notar diferencia)
- `legacy/` con copia de los 103 HTML actuales como backup

## 📊 Estado actual (verificado)
```
103 HTML totales:
├── 8 páginas raíz (index, contacto, reformas-bilbao, presupuesto-reforma-bilbao, sobre-nosotros, aviso-legal, politica-privacidad)
├── 53 blogs Bilbao (45 raíz + 8 en subcarpetas subvencion-*)
├── 11 páginas Donostia (index, blog, calculadora, empresas)
├── 13 páginas Vitoria (idem)
├── 7 fichas empresas
├── 6 calculadoras (integral, baño, cocina, pintura, suelo)
└── 3 barrios (indautxu, santutxu, deusto)

Stack monolítico:
├── css/styles.css: 3.987 líneas
├── js/calculator.js: 1.695 líneas
├── js/datasetValidated.js: 412 líneas
└── NO usar Tailwind nuevo — el styles.css actual tiene un sistema de variables CSS que se DEBE respetar y migrar a design tokens de Tailwind config
```

## 🏗️ Arquitectura Astro acordada

```
bilbao-reforma-calculadora/  (MISMO directorio, no crear carpeta nueva)
├── astro.config.mjs
├── tailwind.config.mjs          (basado en variables de styles.css actual)
├── package.json (añadir astro, tailwind, @astrojs/tailwind, @astrojs/vercel, @astrojs/mdx, content-collections)
├── tsconfig.json (strict)
├── src/
│   ├── layouts/ (Base, Blog, Hub, City, Empresa, Calculadora)
│   ├── components/ (Header, Footer, CitySwitcher, InContentCTA, PriceTable, FAQSection, etc.)
│   ├── content/ (config.ts + blog/* + empresas/* + barrios/*)
│   ├── data/ (ciudades.yml, barrios.yml, categorias.yml)
│   ├── pages/ (estructura 1:1 con HTML actual pero en .astro)
│   ├── scripts/calculator/ (TS modules: core, pricing, barrios, ui, types)
│   └── styles/ (tokens.css + base.css + components.css + tailwind.css)
├── legacy/  ← COPIA EXACTA de los 103 HTML actuales (BACKUP)
└── public/ (assets estáticos)
```

## ✅ Decisiones cerradas con George
1. **URLs:** mantener `.html` (no migrar a `/`)
2. **CSS:** Tailwind + design tokens (NO 3.987 líneas monolíticas)
3. **Calculadoras:** partir `calculator.js` en TS modules
4. **MDX:** NO — blogs con estructura simple
5. **Legacy:** SÍ, mantener como backup

## 📋 Patrones detectados (CRÍTICOS)

### Blogs estándar Bilbao (43 archivos)
- **Header:** `.site-header` + city-switcher + mobile-menu
- **Footer:** 1 de 4 variantes detectadas (unificar en 1)
- **Schema FAQPage:** todos con 2-8 FAQs
- **Schema BreadcrumbList:** todos
- **CTAs:** 84 instancias de `in-content-cta` (2 variantes: "📊 Herramienta recomendada" / "📖 Leer también")
- **Tablas:** 15 archivos con `<table class="price-table">` con `city-badge`
- **In-content-CTA text:** varía por blog
- **Canonical:** `https://www.bilbaoreforma.es/blog/<slug>.html`

### Subcarpetas subvenciones (8 archivos en `blog/subvencion-*/index.html`)
- **CSS distinto inline:** shorthand vars `c-g`, `c-v`, `c-t` (NO usa `styles.css` global, todas las clases compactas)
- **Estructura más simple:** div `.body` con hijos `.art-h`, `.meta`, `.t` (tabla), `.hi` (highlight), `.warn`, `.cta`, `.faq`
- **1 FAQ cada uno** vs 2-8 en blogs estándar
- **Canonical:** `https://www.bilbaoreforma.es/blog/<carpeta>/`
- **URL real visitante:** `https://www.bilbaoreforma.es/blog/subvencion-accesibilidad-bilbao` (sin .html porque es `index.html` en subcarpeta)

### HUBS (2 archivos)
- `hub-reforma-bano-bilbao.html` (460 líneas)
- `hub-reforma-cocina-bilbao.html` (459 líneas)
- Schema: Article + FAQPage + BreadcrumbList + **CollectionPage** + **ItemList** (lista de blogs hijos)
- ItemList interno: URLs hardcoded a blogs hijos — REQUIERE actualización dinámica al migrar blogs
- Cada uno referencia 6-8 blogs hijos como ListItem

### Footer — 4 variaciones detectadas
1. `<footer class="blog-footer">` (legacy, ya no se usa)
2. `<footer class="site-footer" style="background:...">` (custom inline style)
3. `<footer class="site-footer">` (normal)
4. `<footer style="background:...">` (sin clase)

## 🚫 Lo que NO debe cambiar
- Output HTML final idéntico al actual
- URLs exactas
- Schema.org JSON-LD idéntico
- Cache-bust en CSS (mantener `?v=YYYYMMDDHHMM`)

## 🎯 Stack final acordado
- **Astro 4.x** con `@astrojs/vercel` adapter (preset del repo: `vercel.json` ya existe)
- **Tailwind CSS** con `@astrojs/tailwind` integration
- **Design tokens** basados en variables del styles.css actual (`--color-grafito`, `--color-beige`, `--color-verde-montana`, `--color-terracota`, fonts Playfair + Inter + DM Mono)
- **TypeScript strict** en content collections y calculator TS modules
- **Vanilla TS** para calculadora (zero React/JSX islands)
- **Markdown** (.md) para blog simple
- **MDX** no usado de momento
- **cleancss-cli** instalado localmente para QA de CSS final (lección aprendida: nunca minificar CSS a mano)

## 📁 Directorio `legacy/`
- Crear antes de tocar nada
- Copiar los 103 HTML con estructura idéntica
- NO tocar nada dentro de legacy/
- Útil como rollback + diff QA

## 🧪 QA obligatorio
- Diff HTML byte-a-byte (modo `--ignore-whitespace`) entre blog original y blog generado
- Test con [Search Console Rich Results](https://search.google.com/test/rich-results) — schema FAQPage + BreadcrumbList válidos
- `next build` (Astro build) verde
- TypeScript `astro check` verde
- Calculadora funcional (`/calculadora/bano-bilbao`) con mismos clamps 2.500€ baño, 5.000€ cocina, multiplicadores barrio
