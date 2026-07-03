# 📚 Documentación Técnica — Calculadoras Bilbao Reforma

## Índice
1. [Visión general](#1-visión-general)
2. [Arquitectura](#2-arquitectura)
3. [Cómo añadir una nueva calculadora](#3-cómo-añadir-una-nueva-calculadora)
4. [Wizard step types](#4-wizard-step-types)
5. [Sistema de precios](#5-sistema-de-precios)
6. [Integración PDF](#6-integración-pdf)
7. [Integración Chart](#7-integración-chart)
8. [Lead form (Axonflow)](#8-lead-form-axonflow)
9. [Testing](#9-testing)
10. [Troubleshooting](#10-troubleshooting)

## 1. Visión general

Las calculadoras son el **core comercial** de bilbaoreforma.es: permiten al usuario obtener un presupuesto orientativo en 2 minutos sin registro. Hay **5 verticales** (baño, cocina, integral, pintura, suelo) replicados en **3 ciudades** (Bilbao, Donostia, Vitoria-Gasteiz) = **8 calculadoras operativas**.

Cada calculadora convierte un visitante anónimo en:
1. **Lead cualificado** (email + teléfono) → enviado a Axonflow CRM
2. **Micro-commitment** (descarga PDF con presupuesto) → aumenta engagement

**KPIs objetivo:**
- Conversion wizard → lead: ~15-20%
- Tiempo medio en wizard: <90 segundos
- Abandono por step: <10%

## 2. Arquitectura

### Stack
- **Astro 4.x** — SSG con islands de hidratación selectiva (cero por defecto)
- **TypeScript estricto** — en módulos `.ts`; en `.astro` se relaja en frontmatter
- **Vanilla JS** para wizard (NO React/Vue/Svelte) — bundle mínimo, debugging directo
- **jsPDF v2.x** — generación PDF client-side sin servidor
- **Chart: SVG vanilla** — generado por función pura, sin Chart.js/Canvas

### Componentes

#### `Calculator.astro` (637 líneas)
**Rol:** Shell del wizard. Renderiza:
- Stepper visual (burbujas numeradas en horizontal)
- `<slot />` para los steps de la página
- Panel de resultado legacy (no usado por las páginas Bilbao actuales — usan `StepFinal` directamente como step 7)

**Props:**
```ts
interface Props {
  title: string;        // "Reforma de Baño en Bilbao"
  city: 'bilbao' | 'donostia' | 'vitoria';
  calculatorType: 'bano' | 'cocina' | 'integral' | 'pintura' | 'suelo';
  minPrice?: number;    // Precio mínimo garantizado (solo display)
}
```

**Importante:** El objeto `stepLabels` (líneas 25-32) define los labels del stepper por tipo. **Debe estar sincronizado con los steps reales de la página** — actualmente está desincronizado (muestra 8 labels para calculadoras con 7 steps). Ver issue I1 en `CALCULATORAS-ANALYSIS-2026-07-03.md`.

#### `StepFinal.astro` (583 líneas)
**Rol:** Paso final del wizard. Renderiza:
- Loading spinner (1s artificial mientras se "calcula")
- Rango de presupuesto (`finalRangeLow` — `finalRangeHigh`)
- Doughnut chart vía `generateDoughnutSVG()` inyectado en `#finalBudget`
- Botones: Descargar PDF / Solicitar 3 presupuestos
- Lead form (email + teléfono + consent) → Axonflow
- Disclaimer legal

**Mecanismo de activación:** Hay dos paths:
1. **Auto-init** (líneas finales del `<script>`): se ejecuta en `DOMContentLoaded`. Si el atributo `data-budget-low` ya tiene valor, se renderiza.
2. **Manual init**: la página padre llama `(window as any).stepFinalReveal(low, high, label, type, city, cityLabel, el)` después de calcular.

**Props:**
```ts
Astro.props.calculatorType  // 'bano' | 'cocina' | ...
Astro.props.city            // 'bilbao' | 'donostia' | 'vitoria'
Astro.props.budgetLow       // number — se setea vía dataset
Astro.props.budgetHigh      // number — se setea vía dataset
Astro.props.budgetLabel     // string — ej 'Reforma de Baño'
```

#### `budget-chart.ts` (67 líneas)
**Función principal:** `generateDoughnutSVG(breakdown, size = 200) → string`
**Input:** array de `{ label, value, color }`. Calcula fracciones, genera paths SVG con `stroke-dasharray`, renderiza leyenda HTML inline.
**Output:** string HTML que se inyecta con `innerHTML` en `#finalBudget`.

**Por qué vanilla SVG y no Chart.js:** Cero dependencias, bundle 0 KB extra, control total del branding (colores exactos Bilbao Reforma). Trade-off: no hay animaciones ni interactividad.

#### `pdf-generator.ts` (75 líneas)
**Función principal:** `generateBudgetPDF(budget: BudgetInfo) → void`
**Estructura del PDF generado:**
1. Header: "Bilbao Reforma" + "Presupuesto de {calcLabel}"
2. Metadata: ciudad + fecha
3. Rango: `{min} € — {max} €` en verde
4. Tabla de breakdown: bullets de color + label + valor + % del max
5. Disclaimer footer

**Filename pattern:** `presupuesto-{type}-{city}-{YYYY-MM-DD}.pdf`

#### `CalculadoraLayout.astro` (55 líneas)
**Rol:** Layout común para todas las calculadoras. Envuelve con `BaseLayout` (que añade "| Bilbao Reforma" al title si no está), inyecta `<Header>` + `<main>` + `<Footer>`.

**Schema opcional:** Si se pasa `minPrice`, inyecta JSON-LD `WebApplication` con `offers.price`. Si no, no se inyecta schema.

### Flujo de datos

```
Usuario aterriza en /calculadora/[tipo]-[ciudad].html
    ↓
<CalculadoraLayout> carga:
    - BaseLayout con title + description + canonical
    - JSON-LD WebApplication (si hay minPrice)
    - Header + Footer
    ↓
<Calculator> shell renderiza:
    - Stepper visual con burbujas
    - <slot /> → 7 wizard-steps inline en la página
    ↓
Script de la página:
    1. Lee state inicial (defaults hardcoded)
    2. Lee ?barrio= de URL → aplica multiplicador
    3. Bindea event listeners (meters input, option clicks, nav buttons)
    4. En click "Ver presupuesto":
        a. calculate{Baño,Cocina,...}() → { low, high }
        b. showStep(7) → muestra StepFinal
        c. Setea dataset.budgetLow/High en #stepFinal
        d. Llama window.stepFinalReveal(low, high, ...)
    ↓
StepFinal auto-init o manual-init:
    1. reveal() oculta loading, muestra contenido
    2. Renderiza doughnut con generateDoughnutSVG()
    3. Bindea botón PDF → generateBudgetPDF()
    4. Bindea botón "Solicitar 3 presupuestos" → /empresas/
    5. Bindea lead form → POST a api.axonflow.es
```

## 3. Cómo añadir una nueva calculadora

### Paso 1: Crear página

```bash
cp src/pages/calculadora/bano-bilbao.astro src/pages/calculadora/nuevo-tipo-bilbao.astro
```

Editar frontmatter:
```yaml
---
import CalculadoraLayout from '../../layouts/CalculadoraLayout.astro';
import Calculator from '../../components/calculator/Calculator.astro';
import StepFinal from '../../components/calculator/StepFinal.astro';

const MIN_NUEVO = 1500; // Precio mínimo
---
```

### Paso 2: Configurar Layout

```astro
<CalculadoraLayout
  title="Calculadora [Tipo] Bilbao 2026"
  description="[max 155 chars]"
  canonical="https://www.bilbaoreforma.es/calculadora/nuevo-tipo-bilbao.html"
  city="bilbao"
  calculatorType="nuevo_tipo"  // ⚠️ Si es nuevo tipo, hay que añadirlo al type union
  minPrice={1500}  // Opcional, activa schema WebApplication
>
```

### Paso 3: Añadir el tipo a `Calculator.astro`

Editar:
1. `calculatorType: '...' | 'nuevo_tipo'` en Props (línea 4)
2. `calcLabel` (línea 11-14) — etiqueta para el título "Tu {calcLabel} en {cityName} cuesta entre"
3. `stepLabels` (línea 25-32) — añadir array de 7-8 labels

### Paso 4: Añadir el tipo a `StepFinal.astro`

Editar:
1. `calculatorType: '...' | 'nuevo_tipo'` en Props (línea 1-10)
2. `BREAKDOWN_CONFIG` (línea 60-90 en el script) — añadir desglose con colores + porcentajes que sumen 100
3. `CALCULATOR_LABELS` (línea 92-98) — añadir label legible

### Paso 5: Añadir a `pdf-generator.ts`

Editar `BudgetInfo` interface (línea 8):
```ts
calculatorType: '...' | 'nuevo_tipo';
```

### Paso 6: Diseñar wizard steps

Seguir el patrón de las 5 páginas existentes:
- Step 1: siempre metros (con slider + presets + input numérico)
- Steps 2-5: opciones con `data-value` único, una `selected` por defecto
- Step 6: tipo de edificio / extras (opcional)
- Step 7: `<StepFinal calculatorType="nuevo_tipo" city="bilbao" />`

### Paso 7: Implementar lógica de cálculo

```ts
function calculateNuevoTipo() {
  const m2 = state.metros;
  // ... lógica específica ...
  let base = ...;
  
  // SIEMPRE aplicar multiplicador de barrio
  if (barrio && BARRIO_MULTIPLIERS[barrio as keyof typeof BARRIO_MULTIPLIERS]) {
    base *= BARRIO_MULTIPLIERS[barrio as keyof typeof BARRIO_MULTIPLIERS];
  }
  
  // Aplicar clamp mínimo si aplica
  const low = Math.max(Math.round(base * 0.85), MIN_NUEVO);
  const high = Math.round(base * 1.15);
  return { low, high };
}
```

### Paso 8: Añadir a index

En `src/pages/calculadora/index.astro`, añadir nueva card:
```astro
<a href="/calculadora/nuevo-tipo-bilbao.html" class="calc-card calc-card-nuevo">
  <div class="calc-card-icon" aria-hidden="true">🔨</div>
  <h2 class="calc-card-title">Reforma [Tipo]</h2>
  <p class="calc-card-desc">[descripción]</p>
  <span class="calc-card-price">desde <strong>1.500 €</strong></span>
  <span class="calc-card-cta">Calcular →</span>
</a>
```

Y el borde superior custom en `<style>`:
```css
.calc-card-nuevo { border-top: 4px solid #color-hex; }
```

## 4. Wizard step types

El wizard usa solo 3 tipos de input. Todos definidos en `Calculator.astro` (`:global(.wizard-step)` styles).

### Tipo A: Meters input (step 1, siempre)
```astro
<div class="meters-input-group">
  <label class="meters-label" for="metersInput">Metros cuadrados</label>
  <div class="meters-value-display">
    <span class="meters-value-number" id="metersDisplayValue">75</span>
    <span class="meters-value-unit">m²</span>
  </div>
  <input type="number" id="metersInput" class="meters-input" value="75" min="20" max="300" />
  <input type="range" id="metersSlider" class="meters-slider" min="20" max="300" value="75" />
  <div class="meters-presets">
    <button class="meters-preset-btn" data-meters="50">Piso pequeño<br><small>~40–55 m²</small></button>
    <!-- ... -->
  </div>
</div>
```
**Event binding:** `metersInput` y `metersSlider` → `updateSqm(value)` que sincroniza los 3 (display, input, slider).

### Tipo B: Option cards (radio-like)
```astro
<div class="age-options" id="myOptions">
  <div class="age-option selected" data-value="opcion1" role="button" tabindex="0" aria-pressed="true">
    <div class="age-option-radio"></div>
    <div>
      <div class="age-option-title">Título</div>
      <div class="age-option-desc">Descripción</div>
    </div>
    <span class="age-option-badge">+400 €</span>
  </div>
  <!-- ... -->
</div>
```
**Reglas:**
- Exactamente UNA opción con clase `selected` por contenedor
- `data-value` debe ser string sin espacios ni tildes (ver bug B2 en análisis)
- `aria-pressed="true"` solo en la seleccionada
- `tabindex="0"` permite focus con teclado (pero **falta handler keydown** — issue accesibilidad)

**Event binding:**
```ts
['opcion1', 'opcion2'].forEach(val => {
  document.querySelectorAll(`[data-value="${val}"]`).forEach(el => {
    el.addEventListener('click', () => selectOption('myOptions', 'stateKey', val));
  });
});
```

⚠️ **Gotcha conocido:** los selectores deben coincidir EXACTAMENTE con `data-value` y con la clave del `state`. Cualquier tilde o espacio rompe el binding (ver B1, B2, B3, B4 en análisis).

### Tipo C: Building age (caso especial de option cards)
Igual que Tipo B pero usa `data-age` en lugar de `data-value`, y la función `selectAge(age)` mapea a multiplicadores numéricos.

## 5. Sistema de precios

### Fórmula general

```
base = (m2 × ratePrincipal) + sum(extras) + sum(absoluteExtras)
base *= buildingMultiplier
base *= BARRIO_MULTIPLIERS[barrio]  // si ?barrio= en URL
low = max(round(base × (1 - margin)), MIN_CLAMP)
high = round(base × (1 + margin))
```

### Parámetros por calculadora

| Calc | Rate principal | Margin ± | Min clamp | Edificio mult |
|---|---|---|---|---|
| Baño | m2 × 450-750 (varía por tipo) | 15% | 2.500 € | 1.0/1.05/1.15/1.30 |
| Cocina | m2 × 550 × mueblesMult | 15% | 5.000 € | 1.0/1.08/1.18/1.30 |
| Integral | m2 × rateMap[calidad] × estadoMult × acabadosMult | 20% | (sin clamp) | (usa estadoMult en su lugar) |
| Pintura | m2 × rateMap[tipo] × paredesMult | 15% | (sin clamp) | 1.0/1.1/1.2 |
| Suelo | m2 × baseRate × gamaMult × instalMult | 15% | (sin clamp) | (no aplica) |

### Multiplicadores de barrio

Importados de `/src/scripts/calculator/index.ts`:
```ts
import { BARRIO_MULTIPLIERS, BARRIO_LABELS } from '/src/scripts/calculator/index.ts';
```

⚠️ **Este archivo está FUERA del scope de revisión.** Si necesitas modificarlos, edita ese módulo directamente.

### Pricing de referencia 2026 (mercado vasco)

| Calc | Rango típico |
|---|---|
| Baño | 2.500 – 12.000 € |
| Cocina | 5.000 – 16.000 € |
| Integral | 700 – 1.200 €/m² |
| Pintura | 8 – 18 €/m² |
| Suelo | 25 – 100 €/m² |

## 6. Integración PDF

**Trigger:** Click en `#downloadPdfBtn` dentro de `StepFinal`.

**Función:** `generateBudgetPDF(budget: BudgetInfo)` en `pdf-generator.ts`.

**Dependencia:** `jspdf` (importado al top del módulo).

**Estructura del PDF:**
- Página A4 portrait
- Header: brand + título
- Metadata: ciudad + fecha (es-ES)
- Rango: en verde (#4A6741), fuente 16pt
- Tabla: 5 filas (baño/cocina), 4 (pintura), 4 (suelo)
- Footer disclaimer en gris claro

**Filename:** `presupuesto-{calculatorType}-{city}-{YYYY-MM-DD}.pdf`

**Customización:** Para cambiar branding, editar las constantes de color (rgb triplets) en líneas 30-50 del archivo `pdf-generator.ts`.

## 7. Integración Chart

**Trigger:** `reveal()` en `StepFinal` tras setear budget.

**Función:** `generateDoughnutSVG(breakdown, size)` en `budget-chart.ts`.

**Input esperado:**
```ts
interface BreakdownItem {
  label: string;   // "Albañilería y azulejos"
  value: number;   // Importe en euros (no %)
  color: string;   // hex "#4A6760"
}
```

**Output:** HTML string con:
- `<svg>` circular (200×200 por defecto)
- Stroke segments via `stroke-dasharray` + `stroke-dashoffset`
- Centro: "Total" + valor formateado
- Leyenda HTML lateral con dots de color

**Colores estándar Bilbao Reforma:**
- `#4A6760` — grafito/verde-azul (principal)
- `#C45C3E` — terracota (acento)
- `#6B8F71` — verde montaña (éxito)
- `#D4A843` — mostaza (warning)
- `#8B7355` — tierra (neutro)

⚠️ **Limitación de accesibilidad:** el SVG no tiene `role="img"` ni `aria-label`. Añadir antes de producción.

## 8. Lead form (Axonflow)

**Trigger:** Submit en `#leadCaptureForm`.

**Endpoint:** `https://api.axonflow.es/public/lead-capture` (POST JSON).

**Payload:**
```json
{
  "email": "user@example.com",
  "phone": "+34 600 000 000",
  "source": "bilbao-reforma-calculadora",
  "calculator_type": "bano",
  "city": "Bilbao",
  "budget_min": 3500,
  "budget_max": 4500,
  "budget_label": "Reforma de Baño",
  "consent": true,
  "utm_source": "google"  // opcional
}
```

**Estados:**
1. **Validación:** HTML5 native (`required`, `type="email"`, `pattern`). Si falla, `form.checkValidity()` retorna false → mensaje "Por favor, completa todos los campos correctamente."
2. **Loading:** botón se deshabilita, texto cambia a "Enviando..."
3. **Success (res.ok):** feedback verde "✓ ¡Datos enviados!"
4. **Error (res !ok):** feedback rojo "Error al enviar. Inténtalo de nuevo o llámanos."
5. **Network error (catch):** feedback rojo "Error de conexión."

⚠️ **No hay reintentos automáticos.** Si Axonflow está caído, el usuario tiene que volver a submit manualmente.

⚠️ **No hay analytics/tracking del evento.** Considerar añadir `gtag('event', 'lead_captured', {...})` antes/después del POST.

## 9. Testing

### Manual checklist por calculadora

Para cada una de las 8 calculadoras (`/calculadora/{tipo}-{ciudad}.html`):

1. **Carga inicial:**
   - [ ] Step 1 visible con metros por defecto
   - [ ] Stepper muestra N burbujas (esperado: 7 para Bilbao específicas)
   - [ ] Sin errores en consola JS

2. **Step 1 (metros):**
   - [ ] Mover slider actualiza el número grande
   - [ ] Escribir en input actualiza slider y número
   - [ ] Click en preset actualiza los 3 sincronizadamente
   - [ ] Input rechaza valores fuera de [min, max]

3. **Steps de opciones:**
   - [ ] Click en opción cambia visual (clase `selected` + `aria-pressed="true"`)
   - [ ] Solo 1 opción `selected` por step
   - [ ] La opción por defecto está preseleccionada al cargar

4. **Navegación:**
   - [ ] "Continuar →" avanza al siguiente step
   - [ ] "← Atrás" vuelve sin perder selección
   - [ ] Stepper marca steps anteriores como `completed` (verde)
   - [ ] Stepper marca step actual como `active` (terracota)

5. **Step final:**
   - [ ] Loading spinner aparece brevemente
   - [ ] Rango low–high se muestra formateado (es-ES con puntos)
   - [ ] Chart doughnut renderiza con leyenda y porcentajes
   - [ ] Botón PDF descarga archivo con nombre correcto
   - [ ] Botón "Solicitar 3 presupuestos" navega a `/empresas/`

6. **Lead form:**
   - [ ] Submit vacío → error de validación
   - [ ] Email inválido → error de validación
   - [ ] Submit válido → POST a Axonflow → feedback success
   - [ ] Consent checkbox requerido funciona

7. **Multiplicador de barrio:**
   - [ ] `?barrio=abando` en URL → badge aparece en step 1
   - [ ] Presupuesto es ≥1.05× vs sin barrio (verificar BARRIO_MULTIPLIERS)

### Casos edge a verificar

- **m2 muy bajo** (justo en el `min`): ¿el clamp funciona?
- **m2 muy alto** (justo en el `max`): ¿hay overflow visual?
- **Combinaciones más baratas + baratas** (todos los ×0.7, ×0.8): ¿el `low` es plausible?
- **Combinaciones más caras + caras** (todos los ×1.5+): ¿el `high` está dentro del rango mostrado en la landing?
- **Email con caracteres unicode**: ¿se envía correctamente?
- **Refresh a mitad de wizard**: ¿se pierde el estado? (actualmente SÍ — ver I6 en análisis)

## 10. Troubleshooting

### El presupuesto es 0 € o NaN
**Causa probable:** typo en `data-value` o en la key del state (ver B1-B4 en análisis).
**Diagnóstico:**
```js
// En DevTools console después de seleccionar opciones:
console.log(window.yourStateName)
```
**Fix:** verificar que `data-value` y la key del state coincidan exactamente (sin tildes, sin espacios).

### El chart no aparece
**Causa probable:** `finalBudget` div está vacío.
**Diagnóstico:** inspeccionar `#finalBudget` en DevTools.
**Fix:** verificar que `window.stepFinalReveal` se llama después de calcular el budget. Verificar consola por errores JS.

### El PDF descarga pero está vacío
**Causa probable:** `breakdown` array está vacío (todos los valores son 0).
**Diagnóstico:** abrir PDF descargado.
**Fix:** verificar que el `breakdown` en `StepFinal.astro` (líneas 60-90 del script) tiene entries con `pct > 0` para el calculatorType correspondiente.

### El lead form da error de CORS
**Causa probable:** `api.axonflow.es` no permite el origin.
**Diagnóstico:** ver network tab, status CORS error.
**Fix:** verificar con backend que el origin esté en la whitelist de Axonflow.

### Stepper muestra 8 burbujas pero solo hay 7 steps
**Causa:** issue I1 en análisis. `Calculator.astro` tiene `stepLabels` desincronizado.
**Fix:** editar `stepLabels` en `Calculator.astro` líneas 25-32 para que coincida con los steps reales.

### La opción preseleccionada no se aplica al cálculo
**Causa:** issue B2 (espacio en data-value) o B1/B3 (tilde).
**Fix:** comparar carácter a carácter `data-value` vs `state[key]` vs `keyMap[value]`.

### El cálculo da negativo
**Causa:** clamp no aplicado, o multiplicadores en orden inverso.
**Fix:** `const low = Math.max(round(base * 0.85), MIN_CLAMP)` — verificar que `MIN_CLAMP` está definido.

### La ciudad no se muestra correctamente
**Causa:** prop `city` mal pasada a `StepFinal`.
**Fix:** verificar `<StepFinal calculatorType="..." city="bilbao" />` (city debe ser uno de: 'bilbao' | 'donostia' | 'vitoria').

---

**Última actualización:** 2026-07-03  
**Mantenedor:** Equipo Bilbao Reforma  
**Contacto:** hola@bilbaoreforma.es