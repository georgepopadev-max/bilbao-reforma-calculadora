# Sprint SEO Bilbao Reforma — Análisis & Plan de Acción

**Fecha:** 2026-06-23
**Duración propuesta:** 4 días (martes 23 — viernes 26)
**Estado actual:** Pos. 80, 120 imp/día, 0,7% CTR, 0 clicks
**Objetivo:** Subir a top 30 en 4-6 semanas, multiplicar x10-15 tráfico orgánico

---

## 1. 🔍 Diagnóstico SEO (estado real hoy)

### ✅ Lo que SÍ tienes bien

| Elemento | Estado | Notas |
|----------|--------|-------|
| HTTPS | ✅ | Vercel + HSTS activo |
| Redirección 308 sin www → www | ✅ | Confirmado en headers |
| Sitemap.xml index | ✅ | 3 sub-sitemaps (bilbao/donostia/vitoria) |
| Robots.txt | ✅ | Permite todo lo bueno, bloquea `/content/` |
| Schema LocalBusiness en home | ✅ | JSON-LD completo con geo, horarios, address |
| Schema FAQPage en home | ✅ | 4 preguntas implementadas |
| Canonical en home | ✅ | Apunta a `www.bilbaoreforma.es/` |
| Title optimizado | ✅ | "Calculadora Reformas Bilbao 2025 — Presupuesto Gratis en 2 Min" |
| Meta description | ✅ | Buena, con CTA y keywords |
| Open Graph | ✅ | og:title, og:description, og:type, og:locale |
| 42 artículos en blog | ✅ | Buen volumen de contenido |
| Calculadora funcional | ✅ | Core del sitio, valor real para el usuario |

### 🔴 Problemas CRÍTICOS (cuello de botella SEO)

#### A. **Inconsistencia masiva de canonical**
- **15 blogs con canonical `https://bilbaoreforma.es/...`** (SIN www)
- **4 blogs con canonical `https://www.bilbaoreforma.es/...`** (CON www)
- Google los ve como URLs distintas → **dilución de autoridad** + contenido duplicado potencial
- Esto explica en parte la posición 80: Google no sabe qué versión indexar

**Acción:** Estandarizar TODOS los canonicals a `https://www.bilbaoreforma.es/...` con www.

#### B. **2 blogs sin canonical (riesgo alto)**
- `blog/index.html` (la index del blog, importante)
- `blog/pintar-piso-bilbao.html` (URL legacy)

**Acción:** Añadir canonical a ambos.

#### C. **Falta Schema FAQPage en muchos blogs**
- 40/42 blogs tienen 1 schema (probablemente Article o BlogPosting)
- Solo 1 blog (licencias-obra-bilbao-2026.html) tiene 2 schemas
- **Ningún blog tiene BreadcrumbList** (importante para SEO)
- **Ningún blog tiene FAQPage** (quick win para rich snippets)

**Acción:** Añadir BreadcrumbList a TODOS los blogs + FAQPage a los 10 más importantes.

#### D. **H1 "blog/index.html" genérico**
- H1 actual: "Blog de Reformas en Bilbao"
- **Debe ser keyword-rich:** "Blog de Reformas en Bilbao: Guías, Precios y Consejos 2026"

#### E. **Title "Reforma Integral Bilbao 2025" desactualizado**
- Estamos en 2026
- Google penaliza sutilmente títulos con año pasado vs año actual cuando otros competidores los actualizan
- 7-8 blogs con "2025" en title → **actualizar a 2026**

#### F. **No hay página de barrios**
- El plan SEO del 13/06 menciona `/barrios/` pero no existe
- Oportunidad de long-tail: "reforma baño Deusto", "reforma cocina Indautxu", etc.
- La competencia NO tiene esto bien cubierto

#### G. **Internal linking débil**
- Hay blogs que no enlazan entre sí
- No hay hub pages (página pilar que agrupe todas las páginas relacionadas)
- 120 imp/día con 0,7% CTR → Google no ve la estructura topical clara

#### H. **Sin enlaces a /calculadora/ desde blogs contextuales**
- Un blog sobre "reforma baño Bilbao" debería enlazar claramente a la calculadora de baño
- Verificar que cada blog tenga al menos 1 CTA a la calculadora

### 🟡 Problemas MEDIOS (importantes pero no críticos)

| # | Problema | Impacto | Dificultad |
|---|----------|---------|------------|
| 1 | No hay páginas por barrio | Alto | Media |
| 2 | No hay hubs temáticos (baño, cocina, integral) | Alto | Media |
| 3 | Pocas imágenes con alt descriptivos | Medio | Baja |
| 4 | Sin Schema HowTo en tutoriales | Medio | Baja |
| 5 | Sitemap no incluye 7-8 blogs nuevos | Alto | Baja |
| 6 | Sin Schema Video si hay vídeos | Bajo | Baja |
| 7 | Open Graph image no optimizada | Bajo | Baja |
| 8 | Twitter Cards faltan | Bajo | Baja |

---

## 2. 🎯 Estrategia SEO (por qué estás en pos. 80)

### Diagnóstico competitivo

| Competidor | Fortaleza | Debilidad que tú puedes atacar |
|------------|-----------|--------------------------------|
| **reformas-bilbao.com** | 20+ años, DA alta | Contenido desactualizado, sin calculadora interactiva |
| **cronoshare.com** | Autoridad brutal | Contenido genérico, NO local de Bilbao |
| **reformareal.com** | Buenos precios | Sin herramientas interactivas, sin guía profunda |
| **cuantocuestamireforma.com** | Datos actualizados 2026 | Sin calculadora, sin engagement |
| **vascol.eus** | Calculadora + autoridad local | Diseño antiguo, sin blog SEO |

**Tu ventaja competitiva (no explotada):**
- ✅ Calculadora interactiva única
- ✅ Datos locales reales
- ✅ Stack moderno (Vercel, rápido)
- ✅ 42 blogs indexados

**Por qué no rankeas:**
1. Google no sabe qué versión de tu sitio es la canónica (problema A)
2. No hay topical authority clara (problema G)
3. Falta schema rico para rich snippets
4. Algunas páginas tienen año desactualizado

---

## 3. 🔑 Keywords Priorizadas (investiga + análisis SERP)

### Tier 1 — Quick Wins (pos. 50-80 → top 20-30 en 4-6 semanas)

| Keyword | Volumen estimado* | Dificultad | Tu posición actual | Acción |
|---------|------------------|------------|---------------------|--------|
| calculadora reforma bilbao | 50-100/mes | Baja | ~80 | Optimizar home + FAQ + schema |
| presupuesto reforma baño bilbao | 100-200/mes | Media | ~70-80 | Blog dedicado (ya existe, optimizar) |
| presupuesto reforma cocina bilbao | 100-200/mes | Media | ~70-80 | Blog dedicado (ya existe, optimizar) |
| precio reforma integral bilbao | 200-500/mes | Media-Alta | N/A | Blog pilar + datos calculadora |
| reformas cascos viejos bilbao | 30-50/mes | Baja | N/A | Blog (ya existe, falta FAQ schema) |
| reforma baño pequeño bilbao | 30-50/mes | Baja | ~80 | Blog (ya existe, falta optimizar) |

### Tier 2 — Mid-term (pos. N/A → top 30 en 8-12 semanas)

| Keyword | Volumen | Dificultad | Acción |
|---------|---------|------------|--------|
| reformas bilbao | 1.000-2.000/mes | Alta | Crear /reformas-bilbao.html (ya existe) + autoridad |
| empresa reformas bilbao | 200-500/mes | Alta | Mejorar /empresas/ + señales locales |
| precio m2 reforma cocina | 100-200/mes | Media | Blog precio-m2 (ya existe) + schema HowTo |
| subvenciones reformas bilbao | 100-300/mes | Media | Blog (ya existe) + actualizar a 2026 |
| licencias obra bilbao | 100-200/mes | Media | Blog (ya existe) + schema FAQ |

### Tier 3 — Long-tail Local (nuevas oportunidades, baja competencia)

| Keyword | Volumen | Dificultad | Acción |
|---------|---------|------------|--------|
| reforma cocina deusto bilbao | 10-30/mes | Baja | Crear página barrio |
| reforma baño indautxu precio | 10-30/mes | Baja | Crear página barrio |
| presupuesto reforma santutxu | 10-30/mes | Baja | Crear página barrio |
| reforma piso 60m2 bilbao | 10-30/mes | Baja | Blog (ya existe 80m2, crear 60m2) |
| reforma piso antiguo bilbao | 20-50/mes | Media | Blog (ya existe) + schema |
| aerotermia bilbao | 50-100/mes | Media | Blog (ya existe) + FAQ schema |

*Volúmenes estimados por análisis SERP manual y patrones del sector reformas España 2026.

---

## 4. 📋 BACKLOG DEL SPRINT (4 días, 12 tareas atómicas)

### 🔴 FASE 1 — CRÍTICO (Día 1, ~3h) — Sin esto, el resto no funciona

#### **T1. Estandarizar canonicals con www** [CRÍTICO]
- **Problema:** 15 blogs tienen canonical sin www + 2 sin canonical
- **Acción:** Cambiar TODOS los canonicals a `https://www.bilbaoreforma.es/...` con www
- **Ficheros:** 17 archivos HTML en `blog/`
- **QA:** `curl -s URL | grep canonical` para cada uno + validar con [Google Search Console URL Inspection](https://search.google.com/search-console/inspect)
- **Impacto:** ALTO — consolida señales de autoridad
- **Estimación:** 30 min

#### **T2. Añadir canonicals faltantes** [CRÍTICO]
- **Problema:** 2 blogs sin canonical
- **Ficheros:** `blog/index.html`, `blog/pintar-piso-bilbao.html`
- **Acción:** Insertar `<link rel="canonical" href="https://www.bilbaoreforma.es/blog/...">` después de `<title>`
- **QA:** curl + grep
- **Estimación:** 10 min

#### **T3. Actualizar titles con año 2026** [ALTO]
- **Problema:** 7-8 blogs con "2025" en title
- **Acción:** Cambiar "2025" → "2026" en `<title>` y meta description
- **Ficheros:** ~7 archivos
- **Lista detectada:**
  - `blog/aerotermia-bilbao-ventajas.html` (H1: "...2025...")
  - `blog/empresas-reformas-bilbao.html` (H1: "...2025-2026...")
  - `blog/empresas-reformas-donostia.html` (H1: "...2025...")
  - `blog/licencias-obra-bilbao.html` (H1: "...2025...")
  - `blog/materiales-cocina-bilbao.html` (H1: "...2025...")
  - `blog/pintar-piso-bilbao.html` (H1: "...2025...")
  - `blog/precio-reforma-integral-bilbao.html` (H1: "...2025...")
  - `blog/reforma-bano-bilbao-2025.html` (H1: "...2025...")
  - `blog/reforma-bano-bilbao.html` (H1: "...2025...")
  - `blog/reforma-cocina-bilbao.html` (H1: "...2025...")
  - `blog/reformas-bilbao-guia-2025.html` (H1: "...2025...")
  - `blog/reformas-bilbao-precios.html` (H1: "...2025...")
  - `blog/renovar-piso-antiguo-bilbao.html` (H1: "...2025...")
  - `blog/tipos-calefaccion-bilbao.html` (H1: "...2025...")
- **QA:** grep -E "2025" en titles después
- **Estimación:** 20 min

#### **T4. Optimizar blog/index.html** [ALTO]
- **Problema:** H1 genérico + sin canonical
- **Acciones:**
  - H1: "Blog de Reformas en Bilbao: Guías, Precios y Consejos 2026"
  - Title: "Blog de Reformas Bilbao 2026 | Guías, Precios y Consejos"
  - Meta description: ~155 chars con keywords
  - Canonical: `https://www.bilbaoreforma.es/blog/`
  - Añadir Schema Blog o CollectionPage
  - Añadir intro SEO (200 palabras) sobre qué encontrarás
- **Estimación:** 1h

---

### 🟡 FASE 2 — ALTO IMPACTO (Días 1-2, ~5h)

#### **T5. Crear páginas de barrio (long-tail local)** [ALTO]
- **Objetivo:** Capturar "reforma [barrio] Bilbao"
- **Crear 3 páginas** (las más fuertes primero):
  - `/barrios/reforma-deusto.html` → "Reforma Deusto Bilbao: Precios y Empresas 2026"
  - `/barrios/reforma-indautxu.html` → "Reforma Indautxu Bilbao: Precios y Empresas 2026"
  - `/barrios/reforma-santutxu.html` → "Reforma Santutxu Bilbao: Precios y Empresas 2026"
- **Estructura cada página:**
  - H1 con keyword
  - 600-800 palabras: особенности del barrio (casco viejo vs moderno), precios medios, empresas locales
  - Tabla de precios orientativos
  - 3-4 FAQs con Schema
  - CTA calculadora
  - Internal links a blogs relacionados
- **Esquema:** LocalBusiness (sub-zona) + FAQPage + BreadcrumbList
- **Estimación:** 3h (1h/página)

#### **T6. Crear 1 hub temático "Baño"** [ALTO]
- **Objetivo:** Consolidar topical authority en reformas de baño
- **Archivo:** `/blog/hub-reforma-bano-bilbao.html` (o similar)
- **Contenido:** 1.500 palabras + enlaces a TODOS los blogs de baño + calculadora baño
- **Lista de blogs a enlazar:**
  - presupuesto-reforma-bano-bilbao.html
  - precio-m2-reforma-bano-bilbao.html
  - reforma-bano-bilbao.html
  - reforma-bano-bilbao-2025.html
  - reforma-bano-pequeno-bilbao.html
  - comparativa-reforma-bano-bilbao.html
  - errores-comunes-reforma-bano-bilbao.html
  - tendencias-reforma-bano-bilbao-2026.html
- **Schema:** CollectionPage + ItemList
- **Estimación:** 2h

#### **T7. Crear 1 hub temático "Cocina"** [ALTO]
- **Objetivo:** Mismo concepto que T6 para cocinas
- **Archivo:** `/blog/hub-reforma-cocina-bilbao.html`
- **Lista de blogs a enlazar:**
  - presupuesto-reforma-cocina-bilbao.html
  - precio-m2-reforma-cocina-bilbao.html
  - reforma-cocina-bilbao.html
  - comparativa-reforma-cocina-bilbao.html
  - errores-reforma-cocina-bilbao.html
  - tendencias-reforma-cocina-bilbao-2026.html
  - materiales-cocina-bilbao.html
- **Estimación:** 2h

#### **T8. Añadir Schema BreadcrumbList a todos los blogs** [ALTO]
- **Problema:** 0 blogs tienen breadcrumbs schema
- **Acción:** Generar script que añada BreadcrumbList JSON-LD a cada blog
- **Estructura típica:** Inicio > Blog > [Título post]
- **Estimación:** 1h (puede ser tarea de agente)

---

### 🟢 FASE 3 — QUICK WINS ON-PAGE (Días 2-3, ~4h)

#### **T9. Añadir Schema FAQPage a top 10 blogs** [ALTO]
- **Problema:** 0 blogs tienen FAQPage schema
- **Acción:** Para cada blog top, añadir 3-4 FAQs relevantes con schema
- **Top 10 blogs por potencial:**
  1. presupuesto-reforma-bano-bilbao.html
  2. presupuesto-reforma-cocina-bilbao.html
  3. precio-m2-reforma-cocina-bilbao.html
  4. precio-m2-reforma-bano-bilbao.html
  5. precio-reforma-integral-bilbao.html
  6. reformas-bilbao-precios.html
  7. subvenciones-reformas-bilbao-2026.html
  8. licencias-obra-bilbao-2026.html
  9. reformas-casco-viejo-bilbao.html
  10. tiempo-reforma-integral-bilbao.html
- **Estimación:** 2h (12 min/blog)

#### **T10. Mejorar internal linking entre blogs** [ALTO]
- **Problema:** Blogs poco conectados entre sí
- **Acción:** Por cada blog top 10, añadir 3-5 links a blogs relacionados
- **Ejemplo:** "presupuesto-reforma-bano-bilbao.html" → enlaza a "precio-m2-reforma-bano-bilbao", "errores-comunes-reforma-bano-bilbao", "tendencias-reforma-bano-bilbao-2026", "reforma-bano-pequeno-bilbao", "calculadora de baño"
- **Estimación:** 1.5h

#### **T11. Añadir enlaces contextuales a calculadora desde blogs** [MEDIO]
- **Problema:** No todos los blogs enlazan a la calculadora específica
- **Acción:** Cada blog de reforma baño → `/calculadora/bano-bilbao.html`, cocina → `/calculadora/cocina-bilbao.html`, etc.
- **Estimación:** 30 min

#### **T12. Optimizar sitemap con páginas nuevas y lastmod** [MEDIO]
- **Problema:** sitemap no refleja todos los blogs ni cambios
- **Acción:** Regenerar sitemap-bilbao.xml con TODAS las URLs + fechas lastmod reales
- **Añadir al sitemap:** las 3 páginas de barrio + 2 hubs
- **Estimación:** 30 min

---

### 🔵 FASE 4 — VALIDACIÓN & MEDICIÓN (Día 4, ~2h)

#### **T13. Auditoría post-sprint con herramientas externas** [QA]
- **Acciones:**
  1. [Google Rich Results Test](https://search.google.com/test/rich-results) → validar schemas
  2. [Google Search Console URL Inspection](https://search.google.com/search-console/inspect) → comprobar indexación
  3. [PageSpeed Insights](https://pagespeed.web.dev/) → performance home + 3 blogs
  4. [Schema Markup Validator](https://validator.schema.org/) → validar JSON-LD
  5. [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/) (si tienes) → auditoría técnica completa
- **Documentar:** capturas, issues encontrados, plan para Sprint 2
- **Estimación:** 1.5h

#### **T14. Configurar monitoring mensual** [QA]
- **Acciones:**
  - Crear dashboard con posiciones keywords objetivo (Google Sheets o similar)
  - Configurar alerta Search Console para errores 404
  - Programar check mensual de posiciones
- **Estimación:** 30 min

---

## 5. 📊 Timeline y dependencias

```
DÍA 1 (martes 23):
  ├─ T1, T2 (canonical fix) [30min + 10min]
  ├─ T3 (titles 2026) [20min]
  ├─ T4 (blog/index.html) [1h]
  └─ T8 (breadcrumbs schema) [1h] ← empieza agente en paralelo

DÍA 2 (miércoles 24):
  ├─ T5.1 (página Deusto) [1h]
  ├─ T5.2 (página Indautxu) [1h]
  ├─ T5.3 (página Santutxu) [1h] ← 3 páginas en paralelo si hay agentes
  └─ T6 (hub baño) [2h]

DÍA 3 (jueves 25):
  ├─ T7 (hub cocina) [2h]
  ├─ T9 (FAQPage top 10) [2h]
  ├─ T10 (internal linking) [1.5h]
  └─ T11 (links a calculadora) [30min]

DÍA 4 (viernes 26):
  ├─ T12 (sitemap) [30min]
  └─ T13, T14 (QA + monitoring) [2h]
```

---

## 6. 🎯 KPIs del Sprint

| Métrica | Baseline | Objetivo post-sprint | Plazo medición |
|---------|----------|----------------------|----------------|
| Impresiones/día | 120 | 200+ | 2 semanas |
| CTR orgánico | 0,7% | 2-3% | 2 semanas |
| Posición media keywords Tier 1 | 80 | 40-50 | 4-6 semanas |
| Posición media keywords Tier 2 | N/A | 60-70 | 6-8 semanas |
| Páginas con Schema FAQPage | 1 (home) | 11 (home + 10 blogs) | Inmediato |
| Páginas con BreadcrumbList | 0 | 42 (todos los blogs) | Inmediato |
| Errores canonical | 17 | 0 | Inmediato |
| Blogs con año desactualizado | 14 | 0 | Inmediato |

---

## 7. 🚀 Sprint 2 (preview — para después)

Cuando terminemos este, los siguientes vectores serían:

- **Pillar pages por tipo de reforma** (baño, cocina, integral, calefacción)
- **Páginas comparativas Bilbao vs Donostia vs Vitoria** (captar tráfico comparativo)
- **Schema HowTo en tutoriales paso a paso**
- **Local SEO avanzado:** Google Business Profile, NAP consistency, backlinks locales
- **Link building:** directorio de empresas Bizkaia, partnerships con proveedores
- **Performance:** Core Web Vitals verdes
- **Contenido visual:** infografías con datos de precios (compartibles en redes)

---

## 8. 📁 Ficheros del Sprint

Todos los cambios se aplicarán a:
- `/home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora/blog/*.html` (42 archivos)
- `/home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora/barrios/*.html` (3 nuevos)
- `/home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora/sitemap-bilbao.xml`

---

## 9. ✅ Criterios de "Hecho" (Definition of Done)

Cada tarea se considera cerrada SOLO si:
- [x] Implementada en código
- [x] Desplegada en Vercel (producción)
- [x] Validada con herramienta externa (Rich Results Test / Search Console)
- [x] Sin errores en consola del navegador
- [x] Sin regresiones (calculadora sigue funcionando, no se rompe nada)
- [x] Documentada en este sprint (status: ✅)

---

**Estado sprint:** Pendiente aprobación para arrancar
**Próximo paso:** Aprobación de George → lanzamiento martes 23
**Estimación total:** ~16h de trabajo en 4 días
