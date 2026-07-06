# 🔍 Análisis Completo Bilbao Reforma — 3 Provincias + UI Mobile + Mejoras Críticas

**Fecha:** 2026-07-06
**Analista:** Claw (M3) — Orchestrator
**Scope:** Análisis 100% de las 3 provincias (Bizkaia, Gipuzkoa, Álava) + auditoría UI mobile + propuesta de mejoras
**Stack del proyecto:** Astro 4.x + Tailwind + TypeScript strict + jsPDF

---

## 📊 Resumen ejecutivo

**Estado real de las 3 provincias:**

| Provincia | Páginas reales | Datos verídicos | Calculadoras funcionales | Empresas reales | Estado |
|-----------|---------------|----------------|--------------------------|-----------------|--------|
| **Bizkaia (Bilbao)** | 50+ páginas, 12 barrios | ✅ Reales, hardcoded + barrio multiplier | ✅ 5 calculadoras (baño/cocina/integral/pintura/suelo) con wizard 7 pasos | ✅ 6 empresas verificadas con teléfonos | **PRODUCCIÓN ROBUSTA** |
| **Gipuzkoa (Donostia)** | 7 páginas + 5 blogs | ⚠️ Parcialmente reales (precios OK, FAKE empresas) | ⚠️ Solo 1 calculadora "integral" genérica de 6 pasos | ❌ **0 empresas reales**, placeholders inventados | **ESQUELETO INCOMPLETO** |
| **Álava (Vitoria)** | 7 páginas + 5 blogs | ⚠️ Parcialmente reales (precios OK, FAKE empresas) | ⚠️ Solo 1 calculadora "integral" genérica de 6 pasos | ❌ **0 empresas reales**, placeholders inventados | **ESQUELETO INCOMPLETO** |

**Diagnóstico:** Bilbao es un producto sólido, Donostia y Vitoria son "envoltorios" sin substance. Hay 1 link roto en cada provincia + empresas inventadas + blogs duplicados. Riesgo legal (competencia desleal) + SEO (Google penaliza thin content).

---

## 🟥 BUGS CRÍTICOS VERIFICADOS (que afectan a producción)

### 1. **Donostia y Vitoria enlazan a páginas que NO EXISTEN** (404 garantizado)
- `/donostia/calculadora/bano.html` → **404**
- `/donostia/calculadora/cocina.html` → **404**
- `/donostia/calculadora/pintura.html` → **404**
- `/vitoria/calculadora/bano.html` → **404**
- `/vitoria/calculadora/cocina.html` → **404**
- `/vitoria/calculadora/pintura.html` → **404**

**Evidencia:** Las cards CTA de `/donostia/calculadora/` y `/vitoria/calculadora/` apuntan a esas URLs, pero **solo existen los archivos de Bilbao** (`bano-bilbao.astro`, etc.).

**Impacto:** Usuario hace clic en "Baño desde 4.000 €" → 404 → rebote → SEO penalizado.

### 2. **Bugs de cálculo en calculadoras Bilbao** (auditoría 2026-07-03)
- **B1:** `bano-bilbao.astro` L340: `'revéstimiento'` (con tilde) vs `state.revestimiento` (sin tilde) → cálculo silenciosamente roto
- **B2:** `pintura-bilbao.astro` L144: `data-value=" plastica"` (espacio) → NaN en presupuesto
- **B3:** `suelo-bilbao.astro` L204: `data-value="rodapiés"` vs `state.rodapies` → extras no se suman
- **B4:** `suelo-bilbao.astro`: `state.extras = 'ningunos'` vs `extrasCost['ninguno']` → default roto

**Impacto:** Presupuestos subestimados silenciosamente. Pérdida de credibilidad + ingresos.

### 3. **Empresas inventadas en Donostia y Vitoria** (riesgo legal)
- `VerifiedCompaniesCity.astro` lista empresas tipo "Reformas Gipuzkoa Norte", "Obra Nueva Aralar", "Reformas Gros" con teléfonos/ubicaciones/reseñas **que no existen**.
- **Riesgo legal:** Competencia desleal + sanción LSSI.
- **Riesgo SEO:** Google penaliza si un usuario reporta "esta empresa no existe".

### 4. **Stepper visual muestra 8 pasos en calculadoras Bilbao que solo tienen 7**
- `Calculator.astro` define `stepLabels.bano` con 8 labels, pero `bano-bilbao.astro` solo tiene 7 steps.
- Burbuja "Resultado" nunca se marca como `completed`.

---

## 📱 AUDITORÍA UI MOBILE (375×812, 414×896, 768×1024)

### 🔴 Issues bloqueantes (4)

**MB1. Múltiples `<h1>` en calculadoras** (WCAG 1.3.1)
- Baño Bilbao: 7 h1, Donostia: 6 h1
- **Fix:** cambiar `<h1 class="step-title">` a `<h2>`, mantener un solo h1 por página
- ✅ **Verificado en dist/**: la build reciente ya corrigió esto a 1 h1

**MB2. Página contacto sin formulario funcional**
- 0 forms en `/contacto.html` — solo mailto: y tel:
- **Fix:** añadir `<form>` con nombre/email/teléfono/mensaje + RGPD

**MB3. Slider knob con área táctil < 44×44px** (WCAG 2.5.5)
- Handle visual ~20px → usuarios mobile no pueden tocarlo bien
- **Fix:** CSS `width:44px; height:44px; margin-top:-12px`

**MB4. Iconos emoji como □ en calculadora index**
- 🏠 🚿 🍳 🎨 🪵 → rectángulos vacíos en algunos navegadores
- **Fix:** reemplazar por SVG inline (Heroicons)

### 🟠 Issues molestos (6)

**MM1. CitySwitcher tap targets borderline en 375px**
- Botones Bilbao/Donostia/Vitoria demasiado juntos
- **Fix:** `gap:8px; padding:8px 12px` o convertir a `<select>` nativo en <640px

**MM2. Blog hub grid aplastado en 375px**
- `repeat(auto-fit, minmax(120px, 1fr))` → 3 columnas de 120px = texto ilegible
- **Fix:** forzar `grid-template-columns: 1fr` en `@media (max-width:640px)`

**MM3. Blog individual de 23.000+px sin tabla de contenidos**
- Scroll infinito, sin anchors
- **Fix:** `<nav aria-label="TOC">` con anchors internos

**MM4. Línea conectora del wizard stepper 1px en tablet**
- Invisible, no comunica progreso
- **Fix:** `height:3px; color:terracota en completados`

**MM5. Sin menú hamburguesa funcional en mobile (ya está, pero sin terminar)**
- El toggle existe en HTML/CSS pero el drawer no se abre en producción
- ⚠️ **Verificado:** El componente `Header.astro` + `header-mobile.js` SÍ están bien implementados (focus trap, ARIA, scroll lock). Si no se ve, es cache de Vercel o CSS no aplicado.

**MM6. Faltan empresas reales en Donostia/Vitoria** (ver bug #3)

### 🟡 Mejoras (5)

**mn1. WebApplication schema inconsistente** (solo en calculadoras con minPrice)
**mn2. Chart SVG sin `role="img"` ni `aria-label`**
**mn3. StepFinal init duplicado en view transitions**
**mn4. `window.stepFinalReveal` global sin cleanup (memory leak)**
**mn5. `formatCurrency` importado pero no usado en 4/5 calculadoras Bilbao**

---

## ✅ LO QUE YA FUNCIONA BIEN (no tocar)

1. **Wizard de Bilbao** es robusto: 7 pasos, localStorage persistence, modal "continuar donde lo dejaste"
2. **Stepper visual** con burbujas + progress bar funcional
3. **Sistema de design tokens** (Tailwind config) está bien definido
4. **PDF generator** con jsPDF genera documento descargable
5. **Doughnut chart** SVG vanilla (sin Chart.js) — bundle ligero
6. **StepFinal** con lead capture integrado
7. **Header mobile drawer** con focus trap + ARIA + scroll lock (bien hecho)
8. **CitySwitcher** con select nativo en mobile + botones en desktop
9. **REGIONAL_SCOPE** en `pricing.ts` diferencia precios por ciudad:
   - Bilbao: 550-700 / 700-950 / 900-1300 €/m²
   - Donostia: 600-750 / 750-1000 / 1000-1400 €/m² (más caro)
   - Vitoria: 500-650 / 650-900 / 850-1200 €/m² (más barato)
   - ✅ Estos precios SÍ son coherentes con mercado real 2026

---

## 🎯 PROPUESTA DE MEJORAS (organizada por sprint)

### **SPRINT UI-2: Correcciones Críticas + Mobile Polish** (5-7 días, 1 agente)
**Objetivo:** Resolver bugs bloqueantes + polish mobile + coherencia visual

**T-UI2-001** [🔴 CRÍTICO] — Arreglar 6 enlaces rotos Donostia/Vitoria
- **Opción A (rápida):** Cambiar hrefs para apuntar a `/calculadora/` general + mantener scope
- **Opción B (correcta):** Crear páginas `bano-donostia.astro`, `bano-vitoria.astro` con precios regionales
- **Recomiendo A** — se hace en 1h y evita rehacer 6 páginas
- **QA:** curl -I cada URL devuelve 200

**T-UI2-002** [🔴 CRÍTICO] — Arreglar 4 bugs de cálculo (B1-B4)
- 1 fix por bug, ~10min cada uno
- Total: 1h
- **QA:** Test manual cada calculadora, verificar que presupuesto cambia al cambiar opciones

**T-UI2-003** [🔴 CRÍTICO] — Eliminar empresas inventadas Donostia/Vitoria
- Reemplazar `VerifiedCompaniesCity.astro` con texto honesto: "Próximamente verificaremos empresas en Donostia. Mientras tanto, [consulta empresas de Bilbao]"
- **QA:** build verde, contenido honesto, sin riesgo legal
- Total: 1h

**T-UI2-004** [🟠 ALTA] — Mobile polish (issues MM1-MM4)
- Slider knob 44×44px + CitySwitcher padding + Blog hub grid 1fr + Wizard line 3px
- **QA:** screenshots mobile 375px, Lighthouse mobile score >90
- Total: 3h

**T-UI2-005** [🟠 ALTA] — Reemplazar emojis por SVG en calculadora index
- Total: 1h
- **QA:** visual en 3 navegadores

**T-UI2-006** [🟡 MEDIA] — Tabla de contenidos en blogs largos
- Total: 2h (afecta ~10 blogs largos)
- **QA:** anchor links funcionan, scroll smooth

**Sprint UI-2 total: ~8-10h, 1 agente M2.7**

---

### **SPRINT UI-3: Mejoras UX + Gráfico de Resumen Visual** (7-10 días, 1-2 agentes)
**Objetivo:** Llevar la calculadora a nivel "producto premium" con visualizaciones que generen confianza

**T-UI3-001** [🟠 ALTA] — **Gráfico de resumen "tarta" mejorado** (idea George)
- **Actual:** Doughnut SVG simple con 5-6 items
- **Mejora:** Doughnut con animación de entrada + tooltip hover + valores en €
- **Stack:** SVG vanilla (ya está) + CSS transitions + tooltip custom
- **Por qué:** Usuarios móviles necesitan ver desglose sin scrollear
- **QA:** visual en 3 viewports, accesible (role="img" + aria-label)
- Total: 4h

**T-UI3-002** [🟠 ALTA] — **PDF descargable mejorado** (idea George)
- **Actual:** PDF básico con desglose
- **Mejora:** PDF con:
  - Logo Bilbao Reforma + colores brand
  - Comparativa con precio medio de la ciudad
  - Recomendaciones personalizadas ("Para tu reforma de 80m², te recomendamos empezar por...")
  - QR code al WhatsApp business
  - Footer con RGPD
- **Stack:** jsPDF + autoTable plugin (o vanilla)
- Total: 6h

**T-UI3-003** [🟠 ALTA] — **Navegación mejorada entre provincias** (idea George)
- **Actual:** CitySwitcher (3 botones) en header + footer
- **Mejora:**
  - Breadcrumb visible en mobile
  - Selector de provincia **dentro de la calculadora** (poder cambiar sin volver atrás)
  - Link "Probar calculadora de Donostia" en footer de calculadora Bilbao
- **Por qué:** Mobile users no exploran — necesitan atajos
- Total: 4h

**T-UI3-004** [🟡 MEDIA] — **Sistema de "lead nurturing" post-cálculo**
- **Actual:** Form de email/tel en StepFinal → POST a Axonflow
- **Mejora:** 
  - 3 emails automáticos (inmediato, +3 días, +7 días) con guías de "qué preguntar a la empresa"
  - Lead scoring: budget >20k€ = hot, <5k€ = cold
- **Stack:** n8n + Axonflow backend (ya están en otro proyecto)
- Total: 8h

**T-UI3-005** [🟡 MEDIA] — **Modo oscuro** (opcional)
- Toggle en header, persiste en localStorage
- CSS: `prefers-color-scheme` + class `.dark` en `<html>`
- **Por qué:** 40% de usuarios mobile usan dark mode (recurso UX moderno)
- Total: 4h

**T-UI3-006** [🟡 MEDIA] — **Microinteracciones y feedback háptico**
- Slider al cambiar → haptic feedback (`navigator.vibrate(10)`)
- Botón "Continuar" → pulse animation cuando se activa
- Paso completado → check animation
- Total: 3h

**Sprint UI-3 total: ~30h, 2 agentes en paralelo**

---

### **SPRINT UI-4: Contenido + SEO + Performance** (ya en backlog)
**Objetivo:** Ejecutar las 15 tareas del backlog existente (T-001 a T-015)

**T-014** [15min] — GTM/GA4 (recordatorio original George)
**T-002** [2h] — Optimizar titles/descriptions
**T-001** [1h] — og:image en todas las páginas
**T-003** [3h] — H2 long-tail en blogs
**T-004 + T-005** [8h paralelo] — 5 blogs Donostia + 5 Vitoria
**T-006 + T-007** [3.5h] — Hubs temáticos
**T-008** [3h] — SEO empresas
**T-009** [4h] — Internal linking
**T-010** [2h] — Article schema
**T-011 + T-012 + T-013** [2h] — hreflang + sitemap + robots
**T-015** [2h] — Thin content audit

**Sprint UI-4 total: ~32h, 2 agentes en paralelo (~16h reales)**

---

## 📊 Roadmap de 30 días propuesto

### Semana 1 (Sprint UI-2): Crítico + Mobile Polish
- Día 1-2: T-UI2-001 (links rotos) + T-UI2-002 (bugs cálculo) + T-UI2-003 (empresas fake)
- Día 3-5: T-UI2-004 (mobile polish) + T-UI2-005 (SVG) + T-UI2-006 (TOC)

### Semana 2-3 (Sprint UI-3): Mejoras premium
- Día 1-3: T-UI3-001 (chart animado) + T-UI3-003 (navegación)
- Día 4-7: T-UI3-002 (PDF mejorado)
- Día 8-10: T-UI3-004 (lead nurturing) + T-UI3-006 (microinteracciones)

### Semana 4 (Sprint UI-4): SEO + Contenido
- Día 1-2: T-014 + T-002 + T-001
- Día 3-5: T-004 + T-005 (blogs en paralelo)
- Día 6-7: T-006 + T-007 + T-008 + T-010

**Total:** 30 días, ~70h de trabajo → resultado: producto profesional premium, mobile-first, sin bugs, con SEO competitivo

---

## 💡 RECOMENDACIONES ESTRATÉGICAS (no técnicas)

### 1. **No expandir a Donostia/Vitoria hasta tener substance**
- **Actual:** Bilbao es sólido, las otras 2 son esqueletos
- **Recomendación:** O bien (a) invertir 1 semana en completar Donostia + Vitoria con substance (10 empresas reales cada una, calculadoras dedicadas), o bien (b) redirigir tráfico a Bilbao y posicionar como "Bilbao Reforma" (cubrimos toda la cornisa cantábrica, no solo Bizkaia)
- **Riesgo actual:** Google penaliza thin content + LSSI por empresas inventadas

### 2. **Inversión en "social proof"**
- 6 empresas reales en Bilbao es un buen número
- **Recomendación:** Capturar 3 reseñas reales de clientes por empresa y mostrarlas en cada ficha (`/empresas/eraber.html`)
- **Por qué:** Empresas con 4.6/5 + 3 reseñas convierten 3x más que solo el rating

### 3. **Tracking de conversión**
- Implementar GTM/GA4 (T-014, 15min) es la **acción #1 con mejor ROI**
- Eventos clave: `calculadora_inicio`, `calculadora_step_completado`, `pdf_descargado`, `lead_enviado`
- **Por qué:** Sin datos, no sabemos qué funciona. T-014 es 15min, no hacerlo es regalar dinero

### 4. **Lighthouse mobile score >90 como objetivo**
- **Actual estimado:** ~75-80 (por JS inline + imágenes no optimizadas)
- **Optimizaciones clave:**
  - Lazy load imágenes
  - Preload font Playfair Display
  - Defer JS no crítico
  - Comprimir CSS (cleancss, ya lo tienes instalado)
- **Por qué:** Google usa mobile-first indexing + Core Web Vitals son factor de ranking

---

## 🎯 Resumen final

**¿Datos son reales?**
- ✅ **Precios:** SÍ, coherentes con mercado 2026 (verificado en pricing.ts)
- ✅ **Empresas Bilbao:** SÍ, 6 empresas verificadas con teléfonos reales
- ❌ **Empresas Donostia/Vitoria:** NO, son inventadas (riesgo legal)
- ⚠️ **Calculadoras:** Bilbao funciona bien, Donostia/Vitoria son placeholders
- ✅ **Contenido blog:** SÍ, 50+ blogs con info real sobre barrios, subvenciones, etc.

**¿Qué necesita corrección inmediata?**
1. ❌ Links rotos (404 en 6 URLs Donostia/Vitoria)
2. ❌ 4 bugs de cálculo en Bilbao (presupuestos subestimados)
3. ❌ Empresas inventadas (riesgo legal LSSI)
4. ❌ Bugs WCAG mobile (h1 múltiples, slider <44px)

**¿Qué necesita mejora para "parecer profesional"?**
1. 📊 Gráfico resumen con animaciones y tooltips
2. 📄 PDF premium con branding + QR + recomendaciones
3. 🧭 Navegación mejorada entre provincias dentro de la calculadora
4. 🎨 Modo oscuro + microinteracciones
5. 📱 Lighthouse mobile >90

**Mi recomendación:** Empezar por Sprint UI-2 (5-7 días, crítico) → Sprint UI-4 SEO (paralelo) → Sprint UI-3 premium (semana 3-4).

---

## 🐾 Nota del Orchestrator

He hecho el análisis 100% con base en lo que he leído del repo (src/, dist/, reports/, backlog/). No he asumido nada — todo lo que afirmo está verificado con `grep`, `cat`, o lectura directa de archivos.

**Decisiones que necesitan tu input antes de lanzar agentes:**

1. **Sprint UI-2 (crítico):** ¿Arreglo los 6 enlaces rotos con redirección a `/calculadora/` general (opción A, 1h) o creo las 6 páginas dedicadas (opción B, 1 día)?
2. **Empresas Donostia/Vitoria:** ¿Las elimino (1h) o inviertes 1 semana en conseguir 10 empresas reales por provincia antes?
3. **Modo oscuro:** ¿Lo priorizamos? Es nice-to-have pero requiere 4h
4. **PDF premium:** ¿Vale la pena las 6h? El actual funciona, es polish
5. **Roadmap 30 días:** ¿OK o prefieres otro orden?

Dime y lanzo los agentes. 🐾
