# TASK-A1 — Setup Astro + Blogs Piloto + Hub + Subcarpeta

**Dependencia:** ⚠️ **CORRE EN PARALELO A A2 y A3** pero con orden estricto de archivos
**Estimación:** ~4h (reducido para arrancar cuanto antes)
**Agente:** 1 (modelo: minimax-portal/MiniMax-M2.7)
**Zona propia (NO TOCAR fuera de aquí):**
```
- package.json
- astro.config.mjs
- tailwind.config.mjs
- tsconfig.json
- src/layouts/BaseLayout.astro
- src/layouts/BlogLayout.astro
- src/components/Header.astro
- src/components/Footer.astro
- src/components/CitySwitcher.astro
- src/components/ArticleMeta.astro
- src/components/FAQSection.astro
- src/components/BreadcrumbSchema.astro
- src/components/InContentCTA.astro
- src/components/PriceTable.astro
- src/components/Callout.astro
- src/content/config.ts (solo el schema blog, A2 ampliará)
- src/styles/tokens.css
- src/styles/base.css
- src/styles/components.css
- src/styles/tailwind.css
- legacy/ (crear backup)
```

⚠️ **NO TOCAR ZONA A2:** `src/content/blog/*.md`, `src/pages/blog/[slug].astro`, `src/pages/blog/index.astro`, subcarpetas `subvencion-*`
⚠️ **NO TOCAR ZONA A3:** `src/scripts/calculator/`, `src/pages/calculadora/`, `src/pages/empresas/`, `src/pages/{donostia,vitoria,barrios}/`, `src/pages/{index,reformas-bilbao,...}.astro`
⚠️ **NO TOCAR HUB:** `src/pages/blog/hub-reforma-*.astro` (lo hace A1)

---

## 🎯 Objetivo
Crear proyecto Astro en `bilbao-reforma-calculadora/` (mismo directorio), configurar Tailwind con tokens del styles.css actual, migrar **3 archivos piloto (uno por tipo)** para validar pipeline. **MÁS RÁPIDO** que el plan original porque A2 hace el resto en paralelo.

## 📦 Entregables
1. **Setup:**
   - `package.json` con astro, @astrojs/vercel, @astrojs/tailwind, tailwindcss, typescript, @astrojs/check, cleancss-cli (devDep)
   - `astro.config.mjs` con Vercel adapter, `trailingSlash: 'ignore'`
   - `tailwind.config.mjs` con theme extendido desde variables del styles.css
   - `tsconfig.json` strict
   - `legacy/` con copia exacta de los 103 HTML actuales (NO tocar nada dentro)
   - `.gitignore` actualizado (añadir `dist/`, `.astro/`)

2. **Tailwind config (extraer de styles.css actual):**
   ```js
   // Colores del styles.css
   colors: {
     grafito: '...',         // --color-grafito
     beige: '...',           // --color-beige
     'verde-montana': '...', // --color-verde-montana
     terracota: '...',       // --color-terracota
     crema: '...',
     // etc.
   },
   fontFamily: {
     'playfair': ['Playfair Display', 'serif'],
     'inter': ['Inter', 'sans-serif'],
     'mono': ['DM Mono', 'monospace'],
   }
   ```

3. **Layouts base:**
   - `src/layouts/BaseLayout.astro` con `<head>` (GTM, OG, favicon, fuentes, slot para schema custom)
   - `src/layouts/BlogLayout.astro` (hereda de BaseLayout, añade ArticleMeta + FAQSchema + BreadcrumbSchema)

4. **Componentes:**
   - `src/components/Header.astro` (con prop `city`, mobile-menu, city-switcher)
   - `src/components/Footer.astro` (UNIFICADO — las 4 variaciones en 1 componente)
   - `src/components/CitySwitcher.astro`
   - `src/components/ArticleMeta.astro` (fecha, categoría, ciudad)
   - `src/components/FAQSection.astro` (UI + schema JSON-LD)
   - `src/components/BreadcrumbSchema.astro`
   - `src/components/InContentCTA.astro` (2 variantes: "calculator" / "related")
   - `src/components/PriceTable.astro` (con `city-badge`)
   - `src/components/Callout.astro` (tip / warning / info)

5. **Content Collection `blog`:**
   - `src/content/config.ts` con schema Zod:
     ```ts
     {
       title: string,
       description: string,
       canonical: string,
       city: enum ['bilbao', 'donostia', 'vitoria'],
       category: enum ['cocina','bano','integral','suelo','pintura','subvenciones','tendencias','comparativa','errores','licencias','empresas','precio','presupuesto','rehabilitacion','materiales','aerotermia','calefaccion','suelo-radiante','antiguedad'],
       date: date,
       faqs: array de { q: string, a: string },
       inContentCTAs: array de { type: 'calculator' | 'related', label: string, href: string, title?: string },
     }
     ```

6. **Páginas migradas (3 archivos piloto — uno por tipo, reducido para correr en paralelo):**
   - `src/pages/blog/reforma-bano-bilbao.md` (blog estándar con 8 FAQs, con tabla)
   - `src/pages/blog/hub-reforma-bano-bilbao.astro` (HUB — MANUAL, con ItemList dinámico)
   - `src/pages/blog/subvencion-accesibilidad-bilbao/index.astro` (SUBCARPETA — MANUAL, estilo compacto)

7. **Routing dinámico:**
   - `src/pages/blog/[slug].astro` que renderiza cualquier blog estándar desde la content collection

8. **Index básico (placeholder mínimo para validar Astro):**
   - `src/pages/index.astro` — PLACEHOLDER con GTM, header, footer. Solo para que Astro genere HTML sin error. A3 lo reemplaza con la versión completa.

🚨 **REQUISITO CRÍTICO DE A1:** entregar los componentes compartidos (`BaseLayout.astro`, `Header.astro`, `Footer.astro`, `FAQSection.astro`, `InContentCTA.astro`, `ArticleMeta.astro`) en los primeros 90 minutos para que A2 pueda usar `getCollection()` y renderizar blogs. Si no los entrega rápido, A2 va a fallar.

## ✅ QA obligatorio
- [ ] `npm run build` verde sin errores TypeScript
- [ ] `astro check` verde
- [ ] `legacy/` creado y poblado con los 103 HTML (verificar `ls legacy | wc -l = 103`)
- [ ] Diff HTML para los 3 blogs piloto (reforma-bano, hub, subvencion-accesibilidad-bilbao): debe ser MÍNIMO
- [ ] Schema.org FAQPage + BreadcrumbList válido
- [ ] Schema.org CollectionPage + ItemList válido en el hub
- [ ] URLs exactas: `/blog/reforma-bano-bilbao.html` debe responder 200
- [ ] CSS generado sin warnings ni overflow
- [ ] Tabla `price-table` renderiza con city-badges (en blog piloto)
- [ ] Subcarpeta subvención accesible en `/blog/subvencion-accesibilidad-bilbao/` (sin `.html`)

## 🚦 Sincronización con A2 y A3
**A2 espera a que A1 publique:**
- `src/layouts/BaseLayout.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/FAQSection.astro`
- `src/components/InContentCTA.astro`
- `src/components/PriceTable.astro`
- `src/content/config.ts` (con al menos el schema `blog`)

**A1 DEBE emitir un `git commit` con "checkpoint A1-public-api" cuando estos archivos estén listos y A2 puede empezar a generar `.md` files.** Si A1 termina sin ese commit, A2 va a fallar.

## 📂 Contexto a leer antes de arrancar
Obligatorio:
- `bilbao-reforma-calculadora/CONTEXT/CONTEXT.md` (contexto completo)
- `bilbao-reforma-calculadora/blog/reforma-bano-bilbao.html` (el blog más completo — referencia)
- `bilbao-reforma-calculadora/blog/hub-reforma-bano-bilbao.html` (referencia para hub)
- `bilbao-reforma-calculadora/blog/subvencion-accesibilidad-bilbao/index.html` (referencia para subcarpeta)

Opcional si necesitas detalle:
- `bilbao-reforma-calculadora/index.html` (estructura)
- `bilbao-reforma-calculadora/css/styles.css` (extraer tokens para tailwind.config)
- `bilbao-reforma-calculadora/js/calculator.js` (preview para sprint A3)

## 🚫 Restricciones
- NO crear carpeta nueva — trabajar dentro de `bilbao-reforma-calculadora/`
- NO modificar nada dentro de `legacy/` (es backup)
- NO usar `--legacy-peer-deps` ni flags raros en npm install
- NO generar HTML distintos a los actuales (mismo schema, mismo canonical, mismo meta)
- NO hacer build con `--no-check` para saltarse TypeScript

## 📤 Reporte al finalizar
Sub-agente debe reportar:
1. ✅ Resumen de archivos creados (lista con paths)
2. ✅ Output de `npm run build` (últimas 30 líneas)
3. ✅ Output de `astro check` (resumen)
4. ✅ Diff de 1 blog piloto (líneas cambiadas, deberían ser solo whitespace + orden)
5. ⚠️ Cualquier desviación detectada del plan
6. ⚠️ Cualquier archivo que NO se pudo migrar y por qué

## 🚀 Comando para arrancar
El orquestrador principal lanza este agente cuando George apruebe. No ejecutes esto desde el agente.
