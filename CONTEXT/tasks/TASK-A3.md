# TASK-A3 — Layouts Especiales + Split Calculadora

**Dependencia:** ⚠️ **CORRE EN PARALELO A A1 Y A2** desde el inicio
**Estimación:** ~6h
**Agente:** 1 (modelo: minimax-portal/MiniMax-M2.7)
**Zona propia (NO TOCAR fuera de aquí):**
```
- src/scripts/calculator/                     (6 TS modules: core, pricing, barrios, ui, types, config)
- src/pages/calculadora/                      (6 archivos .astro: bano, cocina, integral, pintura, suelo, index)
- src/pages/empresas/                         (7 .astro)
- src/pages/donostia/                         (11 .astro)
- src/pages/vitoria/                          (13 .astro)
- src/pages/barrios/                          (3 .astro)
- src/pages/                                  (8 raíz .astro: index, reformas-bilbao, presupuesto-reforma-bilbao, sobre-nosotros, contacto, aviso-legal, politica-privacidad)
- src/data/                                   (ciudades.yml, barrios.yml, categorias.yml)
- src/content/empresas/                       (7 .md)
- src/content/barrios/                        (3 .md)
- src/layouts/CityLayout.astro                 (NUEVO — para donostia/* y vitoria/*)
- src/layouts/EmpresaLayout.astro              (NUEVO)
- src/layouts/CalculadoraLayout.astro          (NUEVO)
```

⚠️ **NO TOCAR ZONA A1:** BaseLayout, BlogLayout, Header, Footer, CitySwitcher, ArticleMeta, FAQSection, BreadcrumbSchema, InContentCTA, PriceTable, Callout, src/styles/, src/content/config.ts (el blog schema existe pero A1 ya lo CREÓ, A2 puede añadir `empresas` y `barrios`)
⚠️ **NO TOCAR ZONA A2:** src/content/blog/*.md, src/pages/blog/[slug].astro, src/pages/blog/index.astro, subcarpetas subvencion-*
⚠️ **NO TOCAR HUB:** src/pages/blog/hub-reforma-*.astro (zona A1)
⚠️ **NO TOCAR PILOTOS DE A1:** src/pages/blog/reforma-bano-bilbao.md, src/pages/blog/subvencion-accesibilidad-bilbao/index.astro

---

## 🎯 Objetivo
Migrar las páginas que **NO son blogs** (index raíz, calculadoras, ciudades, empresas, barrios) y partir el `calculator.js` monolítico en TypeScript modules.

**REGLA DE CARRERA:** A3 arranca INMEDIATAMENTE. Trabaja en `src/pages/` excepto `blog/`. Crea layouts NUEVOS (CityLayout, EmpresaLayout, CalculadoraLayout) sin tocar BaseLayout/BlogLayout existentes. Lee `BaseLayout.astro` cuando lo necesite para extends/inherit pero NO lo modifica.

## 📦 Entregables

### A. Páginas migradas

**1. Bilbao raíz (8 archivos `.astro`):**
```
src/pages/
├── index.astro                      (LocalBusiness + Service + OfferCatalog + FAQPage)
├── reformas-bilbao.astro
├── presupuesto-reforma-bilbao.astro
├── sobre-nosotros.astro
├── contacto.astro
├── aviso-legal.astro
├── politica-privacidad.astro
└── barrios/
    ├── reforma-indautxu.astro       (3 barrios: indautxu, santutxu, deusto)
    ├── reforma-santutxu.astro
    └── reforma-deusto.astro
```

**2. Donostia (11 archivos):**
```
src/pages/donostia/
├── index.astro
├── blog/
│   └── [slug].astro                 (mismo routing dinámico que Bilbao)
├── calculadora/
│   └── bano-donostia.astro          (reutiliza calculadora shared + prop city="donostia")
├── empresas/
│   └── [slug].astro
└── (las que falten: reforma-donostia.astro, etc.)
```

**3. Vitoria (13 archivos):**
```
src/pages/vitoria/
├── index.astro
├── blog/[slug].astro
├── calculadora/[slug].astro
├── empresas/[slug].astro
└── (resto)
```

**4. Empresas (7 archivos):**
```
src/pages/empresas/
├── index.astro
├── eraber.astro
├── raquel-gonzalez-interiorismo.astro
├── rb-interiores.astro
├── reformas-fernandez.astro
├── reformas-zunzunegui.astro
└── vascol-reformas.astro
```

**5. Calculadoras (6 archivos):**
```
src/pages/calculadora/
├── bano-bilbao.astro          (baño con clamp mínimo 2.500€)
├── cocina-bilbao.astro        (cocina con clamp mínimo 5.000€)
├── integral-bilbao.astro
├── pintura-bilbao.astro
├── suelo-bilbao.astro
└── index.astro
```
⚠️ Cada una debe mantener clamp mínimo del HTML legacy:
- `bano-bilbao.html` → clamp 2.500€
- `cocina-bilbao.html` → clamp 5.000€
- Resto: sin clamp específico

### B. Layouts especiales

```
src/layouts/
├── BaseLayout.astro             (extiende A1, ya existe)
├── BlogLayout.astro             (extiende A1, ya existe)
├── HubLayout.astro              (ya existe en A1)
├── CityLayout.astro             (NUEVO — para donostia/* y vitoria/*)
├── EmpresaLayout.astro          (NUEVO — con LocalBusiness propio de cada empresa)
└── CalculadoraLayout.astro      (NUEVO — incluye island con calculator.ts)
```

### C. Calculadora TypeScript

Partir `js/calculator.js` (1.695 líneas) en módulos:

```
src/scripts/calculator/
├── core.ts                (init, steps router, form management)
├── pricing.ts             (cálculos de precio, datasetValidated.ts logic)
├── barrios.ts            (multiplicadores, presets, labels)
├── ui.ts                 (DOM manipulation, badges, validaciones)
├── types.ts              (TypeScript types/interfaces)
└── config.ts             (constantes, magic numbers, clamp mínimos)
```

**Reglas:**
- Mantener API pública (mismas funciones exportadas)
- Mantener mismas clamp rules:
  - `MIN_BATHROOM = 2500` (€)
  - `MIN_KITCHEN = 5000` (€)
- Mantener multiplicadores barrio:
  - `casco-viejo: 1.30`
  - `indautxu: 1.15`
  - `deusto: 1.10`
  - `getxo: 1.10`
- Mantener BARRIO_TO_AGE y BARRIO_LABELS

### D. Content Collections adicionales

```
src/content/
├── config.ts             (ya existe de A1)
├── blog/                 (ya existe de A1)
├── empresas/             (NUEVO — 7 .md con schema Zod para empresas)
│   ├── eraber.md
│   ├── raquel-gonzalez-interiorismo.md
│   ├── rb-interiores.md
│   ├── reformas-fernandez.md
│   ├── reformas-zunzunegui.md
│   └── vascol-reformas.md
└── barrios/              (NUEVO — 3 .md con multiplicadores y descripciones)
    ├── indautxu.md
    ├── santutxu.md
    └── deusto.md
```

### E. Data files

```
src/data/
├── ciudades.yml          (Bilbao, Donostia, Vitoria-Gasteiz)
├── barrios.yml           (3 barrios + multiplicadores)
└── categorias.yml        (lista de categorías de blog)
```

## ✅ QA obligatorio
- [ ] `npm run build` verde
- [ ] `astro check` verde
- [ ] Cada página `.astro` en `dist/` con HTML idéntico al legacy
- [ ] **Calculadora funcional:** abrir `dist/calculadora/bano-bilbao.html` y probar:
  - Baño 5m² en Casco Viejo → clamp 2.500€ debe aplicarse si sale menor
  - Cocina 8m² en Deusto → clamp 5.000€ debe aplicarse
  - Multiplicador barrio debe funcionar (Casco Viejo 1.30x)
- [ ] **Empresas:** cada empresa renderiza con su LocalBusiness schema válido
- [ ] **Ciudades:** Donostia y Vitoria con su propio header (city prop), breadcrumb actualizado
- [ ] Index principal con LocalBusiness + Service + OfferCatalog + FAQPage schema
- [ ] Schema Organization correcto en cada empresa
- [ ] Tag `tel:` correctamente con `+34 642 147 856`
- [ ] **TypeScript strict compila sin errores** en calculator/

## 📂 Contexto a leer
- `bilbao-reforma-calculadora/CONTEXT/CONTEXT.md`
- `bilbao-reforma-calculadora/CONTEXT/tasks/TASK-A1.md` (entender A1)
- `bilbao-reforma-calculadora/js/calculator.js` (módulo actual)
- `bilbao-reforma-calculadora/js/datasetValidated.js` (lógica de precios)
- `bilbao-reforma-calculadora/empresas/eraber.html` (ejemplo de empresa)
- `bilbao-reforma-calculadora/donostia/index.html` (ejemplo de ciudad)
- `bilbao-reforma-calculadora/calculadora/bano-bilbao.html` (calculadora con clamp)

## 🚫 Restricciones
- NO usar React/JSX islands (mantener vanilla TS)
- NO cambiar reglas de cálculo del `datasetValidated.js`
- NO romper compatibilidad con presets URL params `?barrio=` y `?age=`
- NO generar HTML finales distintos a los legacy
- NO usar `ts-ignore` para silenciar errores
- NO instalar dependencias innecesarias (solo las que ya están acordadas: astro, @astrojs/vercel, @astrojs/tailwind, tailwindcss, typescript, cleancss-cli)

## 📤 Reporte
1. ✅ Lista de archivos `.astro` creados
2. ✅ Output de `npm run build` (total páginas generadas)
3. ✅ Output de tests manuales de calculadora (3 escenarios probados)
4. ✅ Output de `astro check`
5. ⚠️ Cualquier desviación detectada
6. ⚠️ Cualquier empresa o ciudad que NO se pudo migrar
