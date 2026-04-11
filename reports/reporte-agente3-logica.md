# REPORTE AGENTE 3 — REVISIÓN DE LÓGICA

**Proyecto:** bilbao-reforma-calculadora  
**Fecha:** 2026-04-11  
**Archivos revisados:** `js/calculator.js`, `calculadora/index.html`, `contacto.html`, `index.html`, `SPEC.md`, CSS y páginas varias

---

## CÁLCULOS

### ✅ Multiplicadores de antigüedad — CORRECTOS
| Antigüedad | Multiplicador | Implementado |
|-----------|--------------|--------------|
| < 20 años | 1.00 | ✅ `new: 1.0` |
| 20–40 años | 1.05 | ✅ `moderate: 1.05` |
| 40–70 años | 1.15 | ✅ `old: 1.15` |
| > 70 / Casco Viejo | 1.25 | ✅ `historic: 1.25` |

Sin embargo, **BUG CRÍTICO en Step 3 del HTML**: el badge muestra `×1.20` y `×1.30` pero el código JS usa `×1.15` y `×1.25`. Las etiquetas visuales del HTML no coinciden con los valores aplicados.

### ✅ Multiplicadores de calidad — CORRECTOS
- Básica: 0.8 ✅
- Media: 1.0 ✅
- Premium: 1.4 ✅

### ⚠️ Rangos €/m² por tipo de reforma — DISCREPANCIA entre SPEC y código

| Tipo | SPEC (€/m²) | Código (basePerSqm) | ¿Coincide? |
|------|-------------|---------------------|------------|
| Reforma básica | 200–300 | 250 (min 200, max 300) | ✅ |
| Reforma media | 400–500 | 450 (min 400, max 500) | ✅ |
| Reforma integral | 600–800 | 700 (min 600, max 800) | ✅ |
| Reforma lujo | 900–1.400 | 1150 (min 900, max 1400) | ✅ |

**Problema menor:** La SPEC.md define "reforma media: 400–500 €/m²" pero los valores de calidad (básica/media/premium) dentro de la misma reforma media tienen rangos distintos (350–400, 400–500, 500–600). El cálculo usa `reformScope[key].minPerSqm * qualityMult`, lo cual aplica el multiplicador sobre el mínimo en lugar de sobre el rango completo.

### ⚠️ Imprevistos (15%) — IMPLEMENTADO CORRECTAMENTE
El `contingencyPercent: 0.15` se aplica sobre el subtotal (base + age mult + extras), lo cual es correcto.

### ⚠️ Extras — CÁLCULO CORRECTO, PERO DISCREPANCIA DE PRECIOS EN HTML vs JS
El extra "Ventanas PVC" en el JS dice `min: 150, max: 300` pero en el HTML del Step 5 aparece `+150–300 €/ud` ✅. El extra "Suelo radiante" en JS dice `min: 60, max: 90` pero en el HTML del Step 5 aparece `+60–130 €/m²` ❌ (el rango de la SPEC dice 60–90 para basic, 80–100 media, 100–130 premium — el JS no diferencia por calidad).

### ✅ Lógica de pintura y suelo por estancias individuales — CORRECTA
- Pintura: usa `base.minPerSqm`/`maxPerSqm` × qualityMult ✅
- Suelo: deduce el rango por calidad (basic: 25–35, medium: 45–65, premium: 65–100) ✅
- Baño/Cocina: precio fijo × qualityMult ✅

### ✅ Baño/Cocina como precio fijo (no €/m²) — correcto
El código distingue `unit === 'm²'` vs precio fijo, y aplica bien ambas lógicas.

### ❌ Suelo radiante: el extra no se aplica a reforma por estancias (rooms)
Cuando se selecciona "reforma por estancias" (no por scope), los extras como suelo radiante, aerotermia y domótica se calculan correctamente. Sin embargo, para reforma scope (integral), el suelo radiante se suma como extra. Esto es **inconsistente** porque el suelo radiante debería ser parte del cálculo base de una reforma integral, no un extra opcional.

---

## VALIDACIONES

### ❌ VALIDACIÓN STEP 2 — INCONSISTENCIA CRÍTICA
- **Input HTML** (`calculadora/index.html` Step 2): `max="200"`
- **Validación JS** (`calculator.js` línea 382): `data.sqm > 500`
- **Slider HTML**: `max="200"`

El usuario puede escribir 500 m² en el input numérico (pasa la validación JS), pero el slider solo llega a 200 y la validación del input HTML limitaría a 200. **BUG: el rango real es 20–500 en la lógica, pero 20–200 en la UI visual.**

### ✅ Validación Step 1: exige al menos un tipo de reforma o scope ✅
### ✅ Validación Step 3: exige antigüedad del edificio ✅
### ✅ Validación Step 4: exige nivel de calidad ✅
### ✅ Step 5 (extras): opcional, sin validación ✅

### ❌ No se puede avanzar sin reforma scope en Step 1
La validación exige `reformScope || reformTypes.length > 0`. Si el usuario no ha seleccionado nada, el botón "Continuar" está deshabilitado visualmente (`disabled`), lo cual es correcto. Sin embargo, si hace click en el botón de forma programada (o lo activa por accesibilidad), la validación muestra error. Esto funciona pero no hay feedback visual hasta intentar avanzar.

### ✅ Contacto.html: formulario con `required`, `type="email"`, `type="tel"` ✅
Todos los campos obligatorios están marcados correctamente.

---

## ENVÍO DE DATOS

### ❌ NO HAY BACKEND — FORMULARIO DE CONTACTO ES PURAMENTE ESTÉTICO

El formulario de contacto en `contacto.html` tiene `style="display:none"` (oculto). El formulario visible es el sidebar de información con un enlace `mailto:`. **No hay código JavaScript de envío de formulario.**

### ✅ Lead gen en calculator.js: submitLead() — SOLO console.log
```javascript
submitLead: function() {
  // ...
  console.log('Lead submitted:', leadData);
  alert('¡Gracias ' + name + '! Te contactaremos pronto...');
  // In production: send to backend
}
```
Esto confirma que **no hay backend conectado**. Los datos del lead se pierden (solo se imprimen en consola del navegador). El botón "Descargar PDF" genera un archivo de texto descargable (funciona), pero no hay envío real de email.

### ❌ Formulario de contacto principal (contacto.html) tiene `display:none`
El `<div class="contact-form-card" style="display:none">` está oculto permanentemente. El único formulario funcional es el de lead gen de la calculadora, que solo hace `console.log`.

### ✅ mailto: funciona para consultas simples (empresas@bilbaoreforma.es)
Los enlaces mailto: en el sidebar funcionan, pero son envío manual, no automatizado.

---

## COMPORTAMIENTO EXTREMO

### ❌ 0 m² — LA VALIDACIÓN ACEPTA 0
El código valida `!data.sqm || data.sqm < 20 || data.sqm > 500`. Si `data.sqm` es `0`, `!data.sqm` es `true` → muestra error. ✅ Correcto.

### ⚠️ 500 m² — PASA VALIDACIÓN JS PERO NO LA UI HTML
El input numérico con `max="200"` en HTML no permitiría más de 200 en el slider, pero la validación JS acepta hasta 500. Un usuario podría editar el input HTML vía inspector para meter 500. El cálculo lo haría sin problema (sería un piso enorme pero matemáticamente válido).

### ✅ 20 m² — MÍNIMO CORRECTO ✅

### ❌ Selección de todos los extras a la vez
Si el usuario marca ventanas (4 ud × 300€ = 1.200€), terraza (10m² × 500€ = 5.000€), suelo radiante (80m² × 90€ = 7.200€), demolición (0 m², no seleccionado por defecto), domótica (3.000€ flat), aerotermia (6.000€ flat) → total extras: ~22.400€ que se añaden al presupuesto base. **No hay ningún límite de extras ni advertencia de importe extremo.**

### ❌ Suelo radiante + Reforma Integral: doble contabilidad
Si el usuario selecciona "Reforma Integral" como scope Y marca "Suelo radiante" como extra, el suelo radiante se suma como extra sobre el cálculo integral. Esto es conceptualmente incorrecto porque una reforma integral debería incluir suelo radiante como parte del cálculo base, no como extra. El usuario pagaría дважды por el mismo concepto.

### ✅ Cálculo con calidad premium + edificio >70 años + todos los extras
El código multiplica correctamente: `base × qualityMult × ageMult + extras + contingency`. No hay overflow en JS para números típicos de reforma (< 10M €).

---

## ERRORES DE CÓDIGO

### 🔴 console.log DE DEPURACIÓN PERSISTENTES
```
calculator.js:408:  console.log('nextStep called, currentStep:', ...)
calculator.js:410:  console.log('validation failed')
calculator.js:417:  console.log('advancing to step', ...)
calculator.js:1065: console.log('downloadPDF called')
calculator.js:1244: console.log('Lead submitted:', leadData)
calculator.js:1283: console.log('Bilbao Calculadora initialized')
```
**6 console.log de debug activos** en producción. Expuestos en consola del navegador del usuario.

### 🔴 `toggleExtra` INTERFACE CONFUSA (BUG CRÍTICO)
```javascript
toggleExtra: function(key, el) {
  // el is the DOM element clicked (for static HTML)
  // Determine current checked state from element
  const isChecked = el && el.getAttribute('aria-pressed') === 'true';
  ...
}
```
En la calculadora HTML (Step 5), se llama como:
```javascript
onclick="window.BilbaoCalc.toggleExtra('windows', this)"
```
Y en JS (Step 5 rendering) se llama como:
```javascript
onchange="window.BilbaoCalc.toggleExtra('${key}', this.checked, ${qty})"
```
**INTERFAZ INCOMPATIBLE**: La versión del HTML pasan un elemento DOM, pero la versión del JS renderizado pasa un booleano (`this.checked`). Esto significa que cuando el usuario interactúa con los extras renderizados dinámicamente (Step 5 vía `renderStep5`), `toggleExtra` recibe un boolean y `el.getAttribute('aria-pressed')` devuelve `undefined`, lo que hace que `isChecked` sea `false` siempre. **Los extras checkeados dinámicamente NO se deseleccionan correctamente.**

Además, la versión de la línea 1169 (`toggleExtraOnly`) se invoca desde `toggleExtra` cuando ya está checkeado, pero la lógica de "toggle" se basa en `aria-pressed` del elemento, no del estado real del checkbox.

### 🔴 `toggleExtra` tiene 3 interfaces distintas
1. `toggleExtra(key, el)` — elemento DOM (Step 5 HTML estático)
2. `toggleExtra(key, checked_boolean, qty)` — booleano (Step 5 dinámico rendering)
3. `toggleExtraOnly(key)` — lee de `state.data.extras[key]` directamente

La función intenta adivinar cuál se usó basándose en el tipo del segundo argumento. **Código propenso a errores.**

### 🟡 ageMultiplier del código (1.25) ≠ Labels del HTML (×1.30)
- Código JS: `historic: 1.25` (+25%)
- HTML del Step 3: badge muestra `×1.30` (+30%) para "Más de 70 años / Casco Viejo"
- El badge "×1.20" para "40–70 años" está OK (el código dice 1.15, badge dice ×1.20 — ambos son incorrectos entre sí)

### 🟡 `updateQuality` — Map incorrecto para `data-quality="basica"`
```javascript
const qualityMap = { 'basica': 'basic', 'media': 'medium', 'premium': 'premium' };
```
El HTML usa `data-quality="basica"` (sin acento), que mapea a `'basic'`. Esto funciona. Pero hay un mapeo similar en `toggleReformType`:
```javascript
const typeMap = { 'pintura': 'painting', 'suelo': 'flooring', 'bano': 'bathroom', 'cocina': 'kitchen' };
```
Y en la versión del HTML se usa `data-reform="pintura"` pero se llama `window.BilbaoCalc.toggleReformType('painting')` directamente. El mapeo del objeto `typeMap` en la línea 1147 nunca se usa en la práctica (las tarjetas del HTML llaman directamente con la key API).

### 🟡 `typeof extra.qty !== 'undefined'` vs `extra.qty || 0`
En `calculateExtras`, si `extra.qty` es `0` (falso), la expresión `extra.qty || extraData.defaultQty` devuelve el default. Esto es correcto para el caso defaultQty=0 (demolición). Pero si el usuario pone cantidad 0 a propósito en un extra per-unit, se reemplaza por defaultQty. No hay forma de indicar "0" explícitamente. **No es crítico.**

### 🟡 Double `PRICE_DATA.extras[key]` lookup
```javascript
const qty = extra.qty || extraData.defaultQty;
```
Dos lookups por extra en el mismo cálculo. No es bug, solo ineficiencia.

---

## NAVEGACIÓN Y RUTAS

### ✅ Todas las páginas referenciadas existen
- `calculadora/index.html` ✅
- `blog/index.html` ✅
- `empresas/index.html` ✅
- `contacto.html` ✅
- `aviso-legal.html` ✅
- `politica-privacidad.html` ✅
- `sobre-nosotros.html` ✅

### ✅ Links internos de la home page funcionan
Los enlaces del header y footer (`calculadora/index.html`, `blog/index.html`, etc.) apuntan correctamente.

### 🟡 Blog: varios artículos SEO referencian links que pueden estar rotos
Los enlaces a artículos como `reforma-cocina-bilbao.html`, `pintar-piso-bilbao.html` existen en el filesystem. Verificados: todos los archivos de blog referenciados en la home sidebar existen.

### ❌ Link mal escrito en aviso-legal.html
```html
<a href="politica-privacidad.html">política-privacidad.html</a>
```
El texto del enlace incluye la extensión `.html` en el anchor text: "política-privacidad.html" en lugar de "Política de Privacidad". Es un error cosmético/minor.

### 🟡 Footer usa `hola@bilbaoreforma.es` vs Contacto usa `info@bilbaoreforma.es`
Inconsistencia de emails de contacto entre páginas. No es 404 pero genera confusión.

---

## RESPONSIVE Y CROSS-BROWSER

### ✅ Mobile menu toggle funciona
El `mobileToggle` handler en el `<script>` de `calculadora/index.html` y `index.html` es simple y compatible con todos los navegadores.

### ✅ Touch events: uso de `onclick` en vez de eventos táctiles
Todas las interacciones usan `onclick` (que funciona tanto en desktop como en móvil). No hay problemas táctiles detectados.

### ✅ Atributos ARIA básicos
`aria-pressed`, `aria-expanded`, `aria-label` presentes en elementos interactivos. Aceptable para lector de pantalla.

### 🟡 Step 5 extras: no hay indicador visual del impacto en precio en tiempo real
La SPEC dice: "Mostrar impacto en precio en tiempo real (+X €)". El código no actualiza ningún indicador visual de impacto cuando se togglean extras. Esto es una feature missing, no un bug.

---

## RECOMENDACIONES PRIORITARIAS

### 1. 🔴 CRÍTICO: Fix `toggleExtra` — interfaz inconsistente
La función `toggleExtra(key, el)` recibe parámetros distintos según el contexto (DOM element vs boolean). Esto causa que los extras checkeados dinámicamente en Step 5 no se deseleccionen correctamente. Unificar la interfaz: usar `state.data.extras[key].checked` como fuente de verdad.

### 2. 🔴 CRÍTICO: Implementar backend de email
`submitLead()` hace solo `console.log`. Los leads se pierden. Implementar:
- Un endpoint serverless (Netlify Functions, Vercel API, o servicio como Formspree/EmailJS)
- O un formulario real con action POST
- Sin esto, la monetización por lead gen es imposible.

### 3. 🔴 CRÍTICO: Unificar rango de m² (JS + HTML + Slider)
La validación JS acepta 20–500, pero el slider y el input HTML tienen `max=200`. Elegir un rango consistente:
- Opción A: cambiar todo a 20–500
- Opción B: cambiar JS a 20–200 (más realista para pisos residenciales en Bilbao)

### 4. 🟠 ALTO: Quitar todos los console.log de debug
Los 6 `console.log` de depuración deben eliminarse antes de producción. Filtrar en DevTools es insuficiente si se monitorea error reporting (Sentry, etc.).

### 5. 🟠 ALTO: Corregir badges de multiplicador de edad en Step 3
Los badges del HTML (`×1.20` y `×1.30`) no coinciden con los valores reales del código (`1.15` y `1.25`). Esto miente al usuario sobre el sobrecoste.

### 6. 🟡 MEDIO: Suelo radiante como extra en Reforma Integral — doble contabilidad
Si el usuario marca "Reforma Integral" como scope Y marca "Suelo radiante" como extra, está pagando дважды. Considerar: incluir suelo radiante en el cálculo base de integral o deshabilitarlo como extra cuando se selecciona scope.

### 7. 🟡 MEDIO: Formulario de contacto en `contacto.html` está `display:none`
El formulario principal está oculto y nunca se muestra. Si el propósito era esconderlo awaiting backend, documentar con un comment. Si fue error, habilitarlo.

### 8. 🟡 MEDIO: Consistencia de emails de contacto
`hola@bilbaoreforma.es` (footer) vs `info@bilbaoreforma.es` (contacto sidebar) vs `empresas@bilbaoreforma.es`. Unificar a un solo email maestro.

---

## RESUMEN

La lógica de cálculo de `calculator.js` es **mayormente correcta** — los multiplicadores de calidad, antigüedad e imprevistos aplican bien, y los precios base por m² coinciden con la SPEC. El motor de cálculo en sí no tiene errores aritméticos.

Sin embargo, hay **3 problemas críticos**:

1. **`toggleExtra` tiene interfaz rota** — los extras no togglean correctamente cuando se usan desde el Step 5 renderizado dinámicamente.
2. **No hay backend de email** — todos los formularios (lead gen y contacto) son inoperativos. Los leads se pierden.
3. **Inconsistencia de rango m²** — la validación JS (20–500) no coincide con la UI visual (slider hasta 200).

Además, hay **6 console.log de debug activos**, **badges de edad incorrectos**, y **el formulario de contacto principal está oculto**. La funcionalidad de lead gen existe visualmente pero no envía datos a ningún lado.

La arquitectura general es sólida (estado limpio, funciones pequeñas, renderizado por estado). Con las correcciones de los puntos críticos, la calculadora estaría lista para producción.
