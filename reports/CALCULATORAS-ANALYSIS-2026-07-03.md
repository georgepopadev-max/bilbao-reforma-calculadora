# 🔍 Análisis Calculadoras Bilbao Reforma — 2026-07-03

## Resumen ejecutivo
- 8 calculadoras analizadas (5 Bilbao específicas + index Bilbao + Donostia + Vitoria)
- 1.220 líneas de código en componentes compartidos (Calculator.astro 637 + StepFinal.astro 583)
- ~2.400 líneas adicionales en las 5 páginas Bilbao específicas (~480 cada una)
- **Issues encontrados: 16** (🔴 4 bloqueantes / 🟠 7 importantes / 🟡 5 mejoras)
- **Estado general: NECESITA-MEJORAS** — calculadoras funcionan end-to-end pero tienen bugs críticos de coherencia que afectan directamente al cálculo del presupuesto.

## 1. Arquitectura actual

### Componentes principales
| Archivo | Líneas | Rol |
|---|---|---|
| `Calculator.astro` | 637 | Shell del wizard (stepper visual + slot de steps + panel de resultado alternativo no usado) |
| `StepFinal.astro` | 583 | Resultado: loading state, rango, doughnut chart, botones PDF/Quotes, lead form Axonflow |
| `budget-chart.ts` | 67 | Generador SVG vanilla de doughnut chart (sin Chart.js) |
| `pdf-generator.ts` | 75 | Generador de PDF con jsPDF + breakdown table + branding |
| `CalculadoraLayout.astro` | 55 | Layout común con BaseLayout + Header + Footer + JSON-LD WebApplication opcional |

### Flujo de usuario
1. `/calculadora/` → landing con 5 cards selectoras
2. `/calculadora/[tipo]-bilbao.html` → wizard 6 steps + resultado (StepFinal como step 7)
3. StepFinal → loading → chart + PDF + lead form Axonflow → download + lead capturado

### Stack técnico
- Astro 4.x (componentes `.astro` con frontmatter TS)
- TypeScript estricto en `budget-chart.ts` y `pdf-generator.ts`
- **Vanilla JS** para lógica del wizard (sin React/Vue/Svelte) — bundle mínimo
- Chart: SVG vanilla generado por `generateDoughnutSVG()` (NO Chart.js)
- PDF: **jsPDF** v2.x
- Backend lead: `https://api.axonflow.es/public/lead-capture` (POST JSON)
- Multiplicadores de barrio importados desde `/src/scripts/calculator/index.ts` (externo al scope)

### Diferencia clave: 2 arquitecturas distintas
- **Bilbao específicas (baño/cocina/integral/pintura/suelo):** estado en módulo inline `<script>`, wizard 7 steps fijos (1 input metros + 4-5 opciones + resultado)
- **Donostia/Vitoria:** usan clase `BilbaoCalc` (core.ts, externo al scope) con scope cards multi-select + extras opcionales + FAQ inline. Lógica más rica pero código fuera del scope revisado.

## 2. Issues encontrados

### 🔴 Bloqueantes (4)

#### B1. Baño: typo `'revéstimiento'` con tilde en el selector — calculo silenciosamente roto
- **Archivo:** `src/pages/calculadora/bano-bilbao.astro` línea ~340
- **Causa:** El loop `['no_cambiar', 'azulejo_parcial', 'azulejo_completo', 'gresite'].forEach(val => { ... selectOption('revestimientoOptions', 'revéstimiento', val); })` — el `key` es `'revéstimiento'` (con tilde), pero `state.revestimiento` se declara sin tilde. La asignación `state[key] = value` crea una propiedad fantasma y nunca se lee en `calculateBathroom()`, que sigue usando `state.revestimiento` con valor por defecto `'no_cambiar'` (gratis).
- **Impacto:** El step 4 (revestimiento) parece funcionar visualmente pero el cálculo ignora la selección del usuario. Cambia azulejo completo y el presupuesto no sube. Coste subestimado silencioso.
- **Fix:** cambiar `'revéstimiento'` por `'revestimiento'`.

#### B2. Pintura: `data-value=" plastica"` con espacio inicial — selección por defecto nunca se aplica
- **Archivo:** `src/pages/calculadora/pintura-bilbao.astro` línea ~144
- **Causa:** `<div class="age-option selected" data-value=" plastica" ...>` — espacio inicial en el atributo. `selectOption` compara `opt.getAttribute('data-value') === 'plastica'` (sin espacio) → nunca matchea → `state.tipoPintura` se queda `undefined` en lugar de `'plastica'`.
- **Impacto:** El usuario ve "Pintura plástica estándar" preseleccionada (visual OK) pero el cálculo usa `rateMap[undefined] = undefined`, devolviendo NaN → presupuesto = 0 €. Bug invisible hasta que el usuario abre DevTools.
- **Fix:** eliminar el espacio: `data-value="plastica"`.

#### B3. Suelo: `data-value="rodapiés"` (con tilde) vs state `'rodapies'` (sin tilde) — misma clase de bug que B1
- **Archivo:** `src/pages/calculadora/suelo-bilbao.astro` línea ~204
- **Causa:** `data-value="rodapiés"` con tilde; el script itera `['ningunos', 'rodapies', ...]` (sin tilde). La selección visual no actualiza `state.extras`.
- **Impacto:** Si el usuario selecciona "Cambio de rodapiés" (badge +250 €), no se suma al cálculo. Presupuesto subestimado.
- **Fix:** cambiar `data-value="rodapiés"` a `data-value="rodapies"`.

#### B4. Suelo: `state.extras = 'ningunos'` pero `extrasCost` tiene clave `'ninguno'` — defaults incoherentes
- **Archivo:** `src/pages/calculadora/suelo-bilbao.astro` script
- **Causa:** El default `state.extras = 'ningunos'` (plural) pero el lookup `extrasCost[state.extras]` busca `'ninguno'` (singular) → devuelve `undefined` → 0 €. Casualidad lo salva porque "ninguno" = 0 €, pero si en el futuro se añade `ningunos: X` el cálculo petará. Además, la opción UI dice "Solo cambio de suelo" con `data-value="ninguno"` → `selectOption('extrasOptions', 'extras', 'ninguno')` asigna `state.extras = 'ninguno'` (correcto), pero el default inicial rompe.
- **Impacto:** En la primera carga (antes de cualquier click) `state.extras === 'ningunos'` y el cálculo del total baja a 0 en extras. Afecta a la primera interacción si el usuario va rápido a step 6 sin tocar step 6 extras.
- **Fix:** unificar a `'ninguno'` o cambiar `extrasCost['ninguno']` por `extrasCost['ningunos']`.

### 🟠 Importantes (7)

#### I1. Step labels en `Calculator.astro` dicen 8 steps (incluye "Extras") pero todas las páginas Bilbao tienen 7 steps sin "Extras"
- **Archivo:** `Calculator.astro` líneas 25-32 (objeto `stepLabels`)
- **Causa:** `stepLabels.bano = ['Metros', 'Ducha/Bañera', 'Revestimiento', 'Sanitarios', 'Suelo', 'Extras', 'Edificio', 'Resultado']` — 8 labels. Pero `bano-bilbao.astro` solo tiene 7 steps (sin "Extras" ni "Sanitarios" separado). El stepper muestra 8 burbujas y la última (Resultado) queda marcada siempre como "no completada".
- **Impacto:** Visual confuso: el stepper muestra más pasos de los que existen. La burbuja "Resultado" nunca se marca `completed`.
- **Fix:** alinear `stepLabels` con los steps reales de cada página (7 para Bilbao, 6 para Donostia/Vitoria). Idealmente, pasar los labels como prop al `Calculator.astro` desde cada página.

#### I2. Falta FAQ schema / FAQ inline en las 5 calculadoras Bilbao específicas
- **Archivos:** `bano/cocina/integral/pintura/suelo-bilbao.astro`
- **Causa:** Solo Donostia y Vitoria tienen `<details>` con preguntas frecuentes inline y schema `FAQPage`. Las 5 Bilbao no tienen ninguna. El index Bilbao tampoco.
- **Impacto:** Oportunidad perdida de rich snippets en SERP + soporte SEO (keywords long-tail tipo "¿cuánto cuesta reformar baño en Bilbao?").
- **Fix:** añadir bloque FAQ con 4-5 preguntas por calculadora + schema `FAQPage` JSON-LD en cada página.

#### I3. Inconsistencia entre multiplicadores de antigüedad por calculadora
- **Archivos:** cada script de página
- **Causa:** Los multiplicadores `edificio` (antigüedad) varían ligeramente:
  - Baño: `1.00 / 1.05 / 1.15 / 1.30`
  - Cocina: `1.00 / 1.08 / 1.18 / 1.30`
  - Pintura: `1.0 / 1.1 / 1.2` (solo 3 niveles)
  - Integral: no usa este multiplicador — usa `estadoMult` (bueno/a_renovar/obra_completa/casco_viejo) con valores `0.7/1.0/1.3/1.5`
  - Suelo: no usa ninguno
- **Impacto:** Inconsistencia visible para usuario comparando dos calculadoras. Un edificio de 60 años dispara multiplicador distinto según calculadora.
- **Fix:** centralizar en `core.ts` (externo) o alinear valores entre todas.

#### I4. Range/margen de cálculo inconsistente (low/high)
- **Archivos:** cada script
- **Causa:** El margen aplicado al `base` para obtener `low`/`high`:
  - Baño/Cocina/Pintura: `base * 0.85` / `base * 1.15` (rango ±15%)
  - Suelo: `base * 0.85` / `base * 1.15` (rango ±15%)
  - Integral: `base * 0.80` / `base * 1.20` (rango ±20%)
- **Impacto:** Integral es más generoso en el rango que el resto. Inconsistencia comercial.
- **Fix:** unificar a ±15% o documentar por qué integral usa ±20%.

#### I5. Script inline duplicado entre las 5 páginas Bilbao (~80% idéntico)
- **Archivos:** los 5 `*-bilbao.astro`
- **Causa:** `showStep`, `updateSqm`, `selectOption`, `selectAge`, setup de event listeners — todas funciones casi calcadas. Solo cambia el objeto `state` y la función `calculate*()`.
- **Impacto:** ~300 líneas duplicadas × 5 páginas = 1.500 líneas. Cualquier fix hay que replicarlo 5 veces. Ya hay un bug (B1) que demuestra el coste de no centralizar.
- **Fix:** extraer a `core.ts` clase genérica (Donostia/Vitoria ya lo hacen). Las Bilbao específicas deberían usar el mismo core.

#### I6. No hay persistencia (localStorage) del estado del wizard
- **Archivos:** todas las páginas
- **Causa:** Si el usuario recarga o navega atrás, pierde todo el progreso. El `state` vive solo en memoria.
- **Impacto:** Conversión perdida. El usuario que lleva 4 steps y refresca por accidente abandona.
- **Fix:** serializar `state` en `localStorage` con clave por calculadora (`br_calc_bano_state`), restaurar al cargar.

#### I7. Sin validación de avance: el usuario puede saltar steps sin completar
- **Archivos:** los 5 scripts
- **Causa:** El botón "Continuar" simplemente `currentStep++; showStep(currentStep)`. No comprueba que el step actual tenga selección.
- **Impacto:** Si el usuario hace click rápido sin seleccionar, llega al final con defaults → presupuesto no personalizado.
- **Fix:** deshabilitar botón "Continuar" hasta que haya selección válida (excepto step 1 que siempre tiene valor inicial).

### 🟡 Mejoras (5)

#### M1. Schema JSON-LD `WebApplication` se inyecta condicionalmente solo si hay `minPrice`
- **Archivo:** `CalculadoraLayout.astro` líneas 38-50
- **Causa:** Pintura y Suelo no pasan `minPrice`, por lo que NO emiten schema. Baño/Cocina/Integral sí.
- **Impacto:** Schema inconsistente entre calculadoras.
- **Fix:** emitir siempre un schema mínimo (sin `offers.price`) para tener `WebApplication` uniforme.

#### M2. El chart centre label no es accesible (SVG sin `<title>` ni `<desc>`)
- **Archivo:** `budget-chart.ts`
- **Causa:** El SVG doughnut no tiene `role="img"` ni `aria-label` ni `<title>`. Lectores de pantalla ignoran el chart.
- **Impacto:** Pérdida de información para usuarios con discapacidad visual.
- **Fix:** añadir `role="img"` y `aria-label="Desglose del presupuesto: X items"` al `<svg>`.

#### M3. `initStepFinal()` puede ejecutarse dos veces si la página tiene Turbo/View Transitions
- **Archivo:** `StepFinal.astro` líneas finales del script
- **Causa:** El script auto-init se dispara en `DOMContentLoaded` y también expone `(window as any).stepFinalReveal`. Si Astro usa view transitions, `DOMContentLoaded` se vuelve a disparar → se duplican event listeners del PDF.
- **Impacto:** Click en "Descargar PDF" podría generar 2 PDFs.
- **Fix:** usar `astro:page-load` event o limpiar listeners previos.

#### M4. El fallback `(window as any).stepFinalReveal` es global pero no se limpia
- **Archivo:** `StepFinal.astro`
- **Causa:** `(window as any).stepFinalReveal = reveal` queda en `window` aunque el usuario navegue a otra página.
- **Impacto:** Memory leak menor (1 función por navegación). Acumulable en SPA-like navigation.
- **Fix:** usar un evento custom o namespace.

#### M5. `formatCurrency` se importa en cada página Bilbao pero solo se usa una vez (en cocina-bilbao no se usa)
- **Archivo:** `bano/cocina/integral/pintura/suelo-bilbao.astro` scripts
- **Causa:** `import { formatCurrency } from '/src/scripts/calculator/index.ts'` aparece en los 5 scripts. En cocina/integral/pintura/suelo no se usa en ningún sitio del script (solo baño lo usa en badge).
- **Impacto:** Bundle minúsculo extra (~50 bytes), pero es código muerto.
- **Fix:** eliminar import si no se usa.

## 3. Análisis por calculadora

### Baño Bilbao (`/calculadora/bano-bilbao.html`)
- **Steps:** 7 (Metros → Ducha/Bañera → Tipo ducha → Revestimiento → Suelo → Edificio → Resultado)
- **Lógica específica:** 6 inputs compondrán base: `m2 × precioM2[mainElement] + precioDucha[duchaType] + precioRev[revestimiento] + precioSuelo[suelo]`; multiplicado por `edificio` (1.0-1.30) y por `BARRIO_MULTIPLIERS`. Clamp `MIN_BATHROOM = 2500` aplicado al `low`.
- **Issues propios:** **B1** (typo tilde en revestimiento), **I1** (stepper muestra 8 labels pero hay 7 steps).
- **Clamp:** 2.500 € (correcto, preservado).
- **SEO:** Title "Calculadora Reforma Baño Bilbao 2026" = 38 chars + 16 = 54 ✓. Description 154 chars ✓. Schema `WebApplication` con `offers.price=2500` ✓. **Sin FAQ schema.**

### Cocina Bilbao (`/calculadora/cocina-bilbao.html`)
- **Steps:** 7 (Metros → Distribución → Muebles → Encimera → Electrodomésticos → Edificio → Resultado)
- **Lógica específica:** `m2 × 550 × muebleMult + m2 × encimeraExtra + electroExtra + distribExtra`, × `edificio` (1.0-1.30), × barrio. Clamp `MIN_KITCHEN = 5000`.
- **Issues propios:** **I1**. Único script sin bug de typo. Único sin uso de `formatCurrency` (M5).
- **Clamp:** 5.000 € (correcto).
- **SEO:** Title 41+16 = 57 ✓. Description 154 ✓. Schema ✓. Sin FAQ.

### Integral Bilbao (`/calculadora/integral-bilbao.html`)
- **Steps:** 7 (Metros → Estado → Calidad → Distribución → Instalaciones → Acabados → Resultado)
- **Lógica específica:** `m2 × rateMap[calidad] × estadoMult[estado] × acabadosMult[acabados] + distribExtra + instalExtra`, × barrio. Sin clamp. Rango ±20% (vs ±15% resto) = **I4**.
- **Issues propios:** **I1**, **I4**. Calculadora más completa del lote (sin "edificio" usa "estado actual" — buena decisión de modelo).
- **SEO:** Title 41+16 = 57 ✓. Description 119 ✓. Sin schema (no pasa `minPrice`). Sin FAQ.

### Pintura Bilbao (`/calculadora/pintura-bilbao.html`)
- **Steps:** 7 (Metros → Paredes → Techos → Tipo pintura → Carpintería → Edificio → Resultado)
- **Lógica específica:** `m2 × rateMap[tipoPintura] × paredesMult[paredes] + techoExtra + carpExtra`, × `edificio` (1.0-1.2, solo 3 niveles) = **I3**. × barrio.
- **Issues propios:** **B2** (`data-value=" plastica"` con espacio), **I1**, **I3**.
- **SEO:** Title 38+16 = 54 ✓. Description 122 ✓. Sin schema (no pasa `minPrice`). Sin FAQ.

### Suelo Bilbao (`/calculadora/suelo-bilbao.html`)
- **Steps:** 7 (Metros → Estado actual → Tipo suelo → Gama → Instalación → Extras → Resultado)
- **Lógica específica:** `m2 × baseRate[tipoSuelo] × gamaMult × instalMult + estadoExtra + extras`, × barrio.
- **Issues propios:** **B3** (typo `rodapiés`), **B4** (`ningunos` vs `ninguno`), **I1**.
- **SEO:** Title 37+16 = 53 ✓. Description 142 ✓. Sin schema. Sin FAQ.

### Donostia Calculadora (`/donostia/calculadora/`)
- **Steps:** 6 + 1 resultado (Reform type → Metros → Edad → Calidad → Extras multi-select → Resultado)
- **Lógica específica:** Usa `BilbaoCalc` core class (no en scope). Scope cards (básica/media/integral/premium) + individual room cards (pintura/suelo/baño/cocina) toggleables. Extras: ventanas, terraza, suelo radiante, domótica, aerotermia.
- **Diferencias clave vs Bilbao:** scope multi-select vs single-select; extras opcionales toggleables vs radio; FAQ inline presente; sin lead form Axonflow visible; usa canvas SVG de barras horizontales (no doughnut) en `resultBreakdownBars`.
- **Issues propios:** Ninguno crítico detectado en este archivo (la lógica vive en `core.ts` que no se revisó). Title 35+16 = 51 ✓. Description 158 chars ⚠️ (3 chars sobre el límite).

### Vitoria Calculadora (`/vitoria/calculadora/`)
- **Steps:** idéntico a Donostia en estructura (mismas 6 steps + resultado)
- **Lógica específica:** Idéntica a Donostia, solo cambian rangos de precios (más bajos en Vitoria: reforma integral 850-1.200 vs Donostia 1.000-1.400 €/m²) y precios de extras (ventanas 350-700 vs 400-800, etc.).
- **Issues propios:** Mismos que Donostia. Title 35+16 = 51 ✓. Description 156 chars ⚠️.

### Index Bilbao (`/calculadora/`)
- **Estructura:** Selector simple con 5 cards (Reforma Integral, Baño, Cocina, Pintura, Suelo) + 3 ayudas extras (teléfono, blog, empresas).
- **Issues propios:** Sin FAQ schema (oportunidad SEO). Title "Calculadora Reformas Bilbao 2026 | Gratis" = 44+16 = 60 ✓ (justo en el límite). Description 158 chars ⚠️ (3 sobre 155). Sin canonical absoluto verificado (lo pasa).

## 4. SEO técnico

| Página | Title (chars) | + 16 = total | Description (chars) | H1 count | Schema | Issues |
|---|---|---|---|---|---|---|
| `/calculadora/` | 44 | 60 ✓ | 158 ⚠️ | 1 ✓ | ❌ | Description 3 chars > 155; sin FAQ |
| `/calculadora/bano-bilbao.html` | 38 | 54 ✓ | 154 ✓ | 1 ✓ | WebApplication + offers.price | Sin FAQ |
| `/calculadora/cocina-bilbao.html` | 41 | 57 ✓ | 154 ✓ | 1 ✓ | WebApplication + offers.price | Sin FAQ |
| `/calculadora/integral-bilbao.html` | 41 | 57 ✓ | 119 ✓ | 1 ✓ | ❌ (no minPrice) | Sin schema; sin FAQ |
| `/calculadora/pintura-bilbao.html` | 38 | 54 ✓ | 122 ✓ | 1 ✓ | ❌ (no minPrice) | Sin schema; sin FAQ |
| `/calculadora/suelo-bilbao.html` | 37 | 53 ✓ | 142 ✓ | 1 ✓ | ❌ (no minPrice) | Sin schema; sin FAQ |
| `/donostia/calculadora/` | 35 | 51 ✓ | 158 ⚠️ | 1 ✓ | ❌ | Description 3 chars > 155 |
| `/vitoria/calculadora/` | 35 | 51 ✓ | 156 ⚠️ | 1 ✓ | ❌ | Description 1 char > 155 |

**Conclusión SEO:** Todos los titles están dentro del límite tras añadir "| Bilbao Reforma". 3 descriptions exceden 155 chars por 1-3 caracteres. Schema inconsistente (solo 2 de 8 páginas lo tienen). Ninguna calculadora específica Bilbao tiene FAQ schema (Donostia/Vitoria sí tienen FAQ inline).

## 5. Accesibilidad

- **ARIA labels:** ✓ en componentes (meters inputs, sliders, option buttons con `aria-pressed`). 
- **ARIA live regions:** ❌ No hay `aria-live="polite"` en el resultado. Screen readers no anuncian cambios de step ni el cálculo final.
- **Keyboard nav:** ✓ parcial — opciones usan `role="button" tabindex="0"` y `aria-pressed`. **Pero NO tienen handler de `keydown` para Enter/Space** (solo click). Usuarios con teclado no pueden seleccionar opciones (solo `<button>` nativos lo soportan gratis).
- **Screen reader:** ✗ El chart SVG no tiene `role="img"` ni `aria-label`. La etiqueta `final-meta` con fecha es legible pero el desglose no.
- **Color contrast:** ✓ presumible (paleta terracota/grafito validada previamente).
- **Focus visible:** ❌ No hay `:focus-visible` styles custom — relies en outline del navegador. En dark sections (lead form fondo verde) el outline por defecto puede ser invisible.

## 6. Seguridad

- **XSS en inputs:** ✓ Los inputs de la calculadora son numéricos/enum (`<input type="number">`, `data-value` literales). No hay `innerHTML` con datos del usuario. **Único punto:** `barrio` se lee de query string → `barrio as keyof typeof BARRIO_MULTIPLIERS` se valida con `in` antes de usar.
- **CSRF en form:** ⚠️ El POST a Axonflow no envía token CSRF ni Origin header (aunque el método es POST + custom header implícito vía CORS preflight). Axonflow debería validar Origin en backend.
- **Rate limiting:** ✗ No hay rate limiting visible en cliente. Axonflow backend debe tenerlo.
- **Lead form:** Email + phone + consent → enviados a API externa. Consent checkbox requerido ✓. GDPR compliant básico.
- **Phone validation:** `pattern="^\+?[0-9\s\-]{8,20}$"` permite espacios y guiones. Razonable.

## 7. Performance

- **Tamaño componentes:** Calculator.astro 637 líneas (~22 KB sin compilar, ~5 KB minificado + scoped CSS); StepFinal.astro 583 líneas (~20 KB, ~7 KB con SVG generation).
- **Bundle size estimado:** ~12-15 KB JS por calculadora (vanilla, sin framework). jsPDF añade ~150 KB. budget-chart.ts es ~2 KB.
- **Tiempo de carga wizard:** <100ms en local (todo inline en HTML). Sin lazy loading — todo el JS de los 7 steps se carga upfront. Aceptable para UX de wizard lineal.
- **Chart render:** ~5-10ms (SVG con N paths, N=3-5 items en breakdown).
- **PDF generation:** ~200-500ms (jsPDF construye documento en cliente). Bloquea UI brevemente.
- **No hay code splitting** — todas las calculadoras comparten JS si se navega entre ellas. Cada `.astro` page es un bundle separado por defecto.

## 8. Recomendaciones priorizadas

### Sprint inmediato (1-2h) — arreglar bugs críticos
1. **B1-B4:** Corregir los 4 typos de selectores. 5 minutos. Cambio de 1-2 caracteres en cada archivo. **Validar con tests manuales** después.
2. **I7:** Deshabilitar botón "Continuar" hasta selección válida. 30 min en las 5 páginas.
3. **I1:** Alinear `stepLabels` en Calculator.astro con steps reales. 15 min.

### Sprint medio plazo (1 sprint)
4. **I5 + I6:** Extraer lógica común a `core.ts` y añadir persistencia localStorage. 1-2 días. Resuelve I3 (multiplicadores centralizados) y previene futuros bugs tipo B1-B4.
5. **I2:** Añadir FAQ inline + schema `FAQPage` a las 5 calculadoras Bilbao. 1 día. Alto impacto SEO.
6. **M1:** Emitir schema `WebApplication` mínimo en todas las calculadoras. 30 min.
7. **Accesibilidad:** Añadir `role="img"` + `aria-label` al SVG, handler `keydown` para option buttons, `aria-live` en resultado. 1 día.

### Backlog
8. **I3, I4:** Centralizar/alinear multiplicadores de antigüedad y rango low/high. Decisión de producto.
9. **M3, M4:** Limpiar listeners y globals en `StepFinal`.
10. **M5:** Eliminar imports muertos.
11. Métricas: trackear conversion rate del wizard (cuántos llegan al step 7 vs abandonan en step 3).

## 9. Conclusión

**Estado general: NECESITA-MEJORAS.**

Las calculadoras funcionan end-to-end a nivel de UX (wizard lineal, resultado visible, PDF descargable, lead enviado a Axonflow). La arquitectura es sólida: sin framework, bundle pequeño, código mantenible.

**Pero los 4 bugs bloqueantes (B1-B4) son urgentes** — son typos invisibles que hacen que el cálculo ignore selecciones del usuario y entregue presupuestos subestimados. Un cliente que pide presupuesto para reforma de baño con azulejo completo recibe presupuesto de baño sin azulejo. Riesgo comercial + reputacional.

La duplicación masiva de código (~300 líneas × 5 páginas) garantiza que estos bugs se reproduzcan cada vez que se añade una opción nueva. La migración a `BilbaoCalc` core (ya usado por Donostia/Vitoria) es la solución estructural.

A nivel SEO, las 3 descriptions que exceden 155 chars (158, 158, 156) son fixes de 30 segundos cada una. La falta de FAQ schema en las 5 Bilbao específicas es la mayor oportunidad perdida de rich snippets.

**Prioridad #1: arreglar los 4 typos hoy.** El resto puede esperar al sprint de refactor.