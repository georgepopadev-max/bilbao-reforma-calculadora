# TASK-A2 — Migración Masiva 53 Blogs

**Dependencia:** ⚠️ **CORRE EN PARALELO A A1 Y A3** desde el inicio
**Estimación:** ~5h
**Agente:** 1 (modelo: minimax-portal/MiniMax-M2.7)
**Zona propia (NO TOCAR fuera de aquí):**
```
- src/content/blog/*.md                     (46 archivos .md)
- src/scripts/analyzers/html-to-markdown.ts  (script de migración)
- src/pages/blog/[slug].astro                (routing dinámico — crea si A1 no lo ha hecho, pero sin sobreescribir)
- src/pages/blog/index.astro                 (listing — SOLO si A1 no lo creó)
```

⚠️ **NO TOCAR ZONA A1:** layouts BaseLayout/BlogLayout, componentes Header/Footer/FAQ/InContentCTA, src/content/config.ts (A1 lo crea). Si necesitas leer config.ts, solo LECTURA.
⚠️ **NO TOCAR ZONA A3:** src/scripts/calculator/, src/pages/calculadora/, src/pages/empresas/, src/pages/{donostia,vitoria,barrios}/, src/pages/{index,reformas-bilbao,...}.astro
⚠️ **NO TOCAR HUB:** src/pages/blog/hub-reforma-*.astro (zona A1)
⚠️ **NO TOCAR SUBCARPETAS subvención:** A1 hace `subvencion-accesibilidad-bilbao/index.astro` como piloto. A2 hace las OTRAS 7 manualmente como .astro (NO son .md).

---

## 🎯 Objetivo
Migrar los **46 blogs restantes** desde HTML a Markdown en la content collection `blog/`, con un script automatizado que extraiga FAQs, CTAs y metadata. Crear también las 7 subcarpetas subvención restantes como `.astro` (no .md).

**REGLA DE CARRERA:** A2 arranca INMEDIATAMENTE. Escribe los `.md` files primero (no requieren A1). El `npm run build` final lo hace el integrador tras A1 terminar.

## 📦 Entregables
1. **Script de migración:**
   - `src/scripts/analyzers/html-to-markdown.ts`
   - Lee HTML legacy, extrae:
     - `<title>` → title
     - `<meta name="description">` → description
     - `<link rel="canonical">` → canonical
     - JSON-LD FAQPage `mainEntity[]` → array de FAQs
     - JSON-LD BreadcrumbList `itemListElement[]` → array de crumbs
     - `in-content-cta` divs → array de CTAs `{type, label, href}`
     - `<table class="price-table">` → preserved como HTML en el markdown
     - `<h1>`, `<h2>`, `<h3>` → headings
     - `<article>` → cuerpo principal
   - Escribe `.md` con frontmatter YAML
   - **NO** incluir en este script: blog piloto (ya migrados en A1), hubs, subvenciones en subcarpeta

2. **Blogs migrados (46 archivos `.md`):**
   ```
   src/content/blog/
   ├── aerotermia-bilbao-ventajas.md          [YA migrado por A1]
   ├── cambiar-suelo-bilbao.md                 ← migrar
   ├── comparativa-reforma-bano-bilbao.md      ← migrar
   ├── comparativa-reforma-cocina-bilbao.md    [YA migrado por A1]
   ├── empresas-reformas-bilbao.md
   ├── empresas-reformas-donostia.md
   ├── errores-comunes-reforma-bano-bilbao.md
   ├── errores-comunes-reforma-bilbao.md
   ├── errores-reforma-cocina-bilbao.md
   ├── hub-reforma-bano-bilbao.astro           [YA migrado por A1, NO TOCAR]
   ├── hub-reforma-cocina-bilbao.astro         [YA migrado por A1, NO TOCAR]
   ├── licencias-obra-bilbao-2026.md
   ├── licencias-obra-bilbao.md
   ├── materiales-cocina-bilbao.md
   ├── pintar-piso-bilbao.md
   ├── precio-m2-reforma-bano-bilbao.md
   ├── precio-m2-reforma-cocina-bilbao.md
   ├── precio-reforma-integral-bilbao.md
   ├── presupuesto-reforma-bano-bilbao.md
   ├── presupuesto-reforma-cocina-bilbao.md
   ├── presupuesto-reforma-integral-bilbao.md  [YA migrado por A1]
   ├── reforma-80m2-bilbao-ejemplo.md
   ├── reforma-80m2-bilbao.md
   ├── reforma-bano-bilbao-2025.md
   ├── reforma-bano-bilbao.md                  [YA migrado por A1]
   ├── reforma-bano-pequeno-bilbao.md
   ├── reforma-cocina-bano-santutxu.md
   ├── reforma-cocina-bilbao.md
   ├── reforma-personas-mayores-bilbao.md
   ├── reforma-vs-comprar-bilbao.md            [YA migrado por A1]
   ├── reforma-vs-reestructuracion-bilbao.md
   ├── reformas-bilbao-guia-2025.md
   ├── reformas-bilbao-precios.md
   ├── reformas-casco-viejo-bilbao.md
   ├── rehabilitacion-edificio-antiguo-bilbao.md
   ├── renovar-piso-antiguo-bilbao.md
   ├── suelo-radiante-ventajas-bilbao.md
   ├── suelo-radiante-vs-calefaccion.md
   ├── tendencias-reforma-bano-bilbao-2026.md
   ├── tendencias-reforma-cocina-bilbao-2026.md
   ├── tiempo-reforma-integral-bilbao.md
   └── tipos-calefaccion-bilbao.md
   ```
   (Los marcados [YA migrado por A1] NO se vuelven a migrar)

3. **Subvenciones en subcarpeta (8 archivos restantes — .astro MANUAL):**
   ```
   src/pages/blog/
   ├── subvencion-accesibilidad-bilbao/index.astro   [YA por A1]
   ├── subvencion-accesibilidad-donostia/index.astro   ← migrar MANUAL
   ├── subvencion-cambio-calderas-vitoria/index.astro  ← migrar MANUAL
   ├── subvencion-cambio-ventanas-bilbao/index.astro  ← migrar MANUAL
   ├── subvencion-eficiencia-energetica-bilbao/index.astro  ← migrar MANUAL
   ├── subvencion-fachadas-bilbao/index.astro          ← migrar MANUAL
   ├── subvencion-rehabilitacion-energetica-donostia/index.astro  ← migrar MANUAL
   └── subvenciones-reformas/index.astro              ← migrar MANUAL
   ```
   ⚠️ Estos NO son Markdown — son `.astro` porque usan CSS compacto inline. Cada uno tiene 1 FAQ y una tabla `.t` (no `.price-table`).

4. **Subvenciones Bilbao como blog estándar** (1 archivo):
   - `blog/subvenciones-reformas-bilbao.html` — SÍ migrar a `.md` (es blog normal)
   - `blog/subvenciones-reformas-bilbao-2026.html` — SÍ migrar a `.md`

5. **Index de blog:**
   - `src/pages/blog/index.astro` que liste todos los blogs filtrables por categoría/ciudad

## ✅ QA obligatorio
- [ ] Los 46 archivos `.md` tienen frontmatter válido (TypeScript Zod schema)
- [ ] `astro check` verde
- [ ] `npm run build` genera los 53 HTML en `dist/blog/`
- [ ] Para CADA blog migrado: dif VS `legacy/` debe ser MÍNIMO
- [ ] Schema FAQPage + BreadcrumbList presente en cada uno (test automático con script que parsea el HTML generado)
- [ ] CTAs `in-content-cta` extraídos y renderizados correctamente (al menos 30 CTAs detectados vs 84 totales en legacy)
- [ ] Tablas `price-table` migradas (15 archivos esperados)
- [ ] Ciudad detectada correctamente: 45 bilbao + ~11 donostia + 13 vitoria (los que no son de ciudad se asume bilbao)

## 📂 Contexto a leer
- `bilbao-reforma-calculadora/CONTEXT/CONTEXT.md`
- `bilbao-reforma-calculadora/CONTEXT/tasks/TASK-A1.md` (entender A1)
- `bilbao-reforma-calculadora/src/scripts/analyzers/html-to-markdown.ts` (si ya está en A1; si no, crearlo nuevo)

## 🚫 Restricciones
- NO migrar blogs piloto (ya los hizo A1)
- NO re-migrar hubs (A1 los hizo como .astro MANUAL)
- NO tocar `legacy/`
- NO perder ningún contenido del HTML original (FAQ, tabla, link, breadcrumb)
- NO generar CTAs genéricos — respetar el texto y link del HTML original

## 📤 Reporte
1. ✅ Lista de archivos `.md` creados
2. ✅ Lista de subcarpetas subvención migradas
3. ✅ Output de `npm run build` (resumen de páginas generadas)
4. ✅ Total de CTAs extraídos vs total esperado (84)
5. ✅ Total de FAQs extraídas vs total esperado (~7 individuales en subcarpetas + todas las de blogs estándar)
6. ⚠️ Cualquier blog que NO se pudo migrar y por qué
7. ⚠️ Cualquier desviación del schema Zod detectada
