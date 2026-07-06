# SPRINT UI-2: Correcciones Críticas + Mobile Polish + Chart Mejorado
**Agente único — Análisis + Desarrollo + QA (todo en uno)**
**Stack:** Astro 4.x + Tailwind + TypeScript strict

## 📋 CONTEXTO

Proyecto: `/home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora/`
URL producción: https://www.bilbaoreforma.es
Stack: Astro 4.16, Tailwind 3.4, jsPDF, TypeScript strict
Estado: Build verde actual. Bilbao funciona, Donostia/Vitoria son esqueletos.
Tiempo estimado: 6-8 horas
Reglas:
- Clean code (sin duplicación)
- Componentes reutilizables
- Mobile-first (375px mínimo, verificado en 3 viewports)
- Accesibilidad WCAG 2.1 AA mínimo
- QA obligatorio antes de cerrar cada tarea

## 🎯 TAREAS (orden de ejecución)

### T1. Fix 6 enlaces rotos Donostia/Vitoria [1h]
**Archivos:**
- `src/pages/donostia/calculadora/index.astro` — 3 hrefs rotos
- `src/pages/vitoria/calculadora/index.astro` — 3 hrefs rotos
- `src/pages/donostia/reforma-donostia.astro` — 1 href posiblemente roto
- `src/pages/vitoria/reforma-vitoria.astro` — 1 href posiblemente roto

**Solución:** Cambiar hrefs para apuntar a `/calculadora/index.html` (general) en vez de las páginas específicas que no existen. Mantener el scope (baño/cocina/pintura) como query param `?type=bano`.

**Verificación:**
```bash
grep -rn "calculadora/bano.html\|calculadora/cocina.html\|calculadora/pintura.html\|calculadora/suelo.html" src/pages/
```
Debe devolver 0 resultados.

**QA:** Curl HEAD a cada URL modificada, verificar 200.

---

### T2. Fix 4 bugs de cálculo calculadoras Bilbao [1h]

#### B1. `src/pages/calculadora/bano-bilbao.astro` ~L340
**Bug:** `'revéstimiento'` (con tilde) vs `state.revestimiento` (sin tilde)
**Fix:** Cambiar la key a `'revestimiento'` (sin tilde)

#### B2. `src/pages/calculadora/pintura-bilbao.astro` ~L144
**Bug:** `data-value=" plastica"` (espacio inicial)
**Fix:** Cambiar a `data-value="plastica"` (sin espacio)

#### B3. `src/pages/calculadora/suelo-bilbao.astro` ~L204
**Bug:** `data-value="rodapiés"` vs `state.rodapies` (sin tilde)
**Fix:** Cambiar a `data-value="rodapies"`

#### B4. `src/pages/calculadora/suelo-bilbao.astro`
**Bug:** `state.extras = 'ningunos'` vs `extrasCost['ninguno']` (singular)
**Fix:** Unificar a `'ninguno'`

**Verificación post-fix:**
```bash
cd /home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora
npm run build 2>&1 | tail -20
```
Debe compilar sin errores.

**QA manual:** Abrir cada calculadora, cambiar opciones, verificar que el presupuesto cambia coherentemente.

---

### T3. Eliminar empresas inventadas Donostia/Vitoria [1h]

**Archivos:**
- `src/components/home/VerifiedCompaniesCity.astro` — Eliminar contenido inventado

**Solución:** Reemplazar el array completo de empresas con texto honesto:
```
"Próximamente verificaremos empresas en Donostia/Gipuzkoa. 
Mientras tanto, consulta nuestro directorio de Bilbao (6 empresas 
verificadas con reseñas reales)."
```
Y CTA al directorio de Bilbao.

**Importante:** NO usar nombres inventados, teléfonos falsos, ni reseñas fabricadas.

**QA:** 
- `grep -n "Reformas Gipuzkoa\|Reformas Álava\|Obra Nueva Aralar\|Reformas Gros\|Reformas Ensanche" src/components/home/VerifiedCompaniesCity.astro` → debe devolver 0 resultados
- Build verde

---

### T4. Slider knob 44×44px (mobile accessibility) [1h]

**Archivos:**
- `src/components/calculator/Calculator.astro` — CSS `.meters-slider`
- Cualquier otro slider en `src/pages/calculadora/*.astro`

**Fix CSS:**
```css
.meters-slider {
  width: 100%;
  height: 44px; /* WCAG 2.5.5 minimum touch target */
  accent-color: var(--color-terracota);
  padding: 10px 0;
}

/* WebKit pseudo-elements */
.meters-slider::-webkit-slider-thumb {
  width: 28px;
  height: 28px;
  background: var(--color-terracota);
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid var(--color-blanco);
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

/* Firefox */
.meters-slider::-moz-range-thumb {
  width: 28px;
  height: 28px;
  background: var(--color-terracota);
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid var(--color-blanco);
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
```

**QA:** 
- Chrome DevTools mobile 375px
- Tocar el knob con el dedo → debe ser fácil
- `npm run build` verde

---

### T5. CitySwitcher mobile padding [30min]

**Archivo:** `src/components/CitySwitcher.astro`

**Fix CSS:**
```css
.city-btn {
  padding: 12px 16px; /* Era 8px 12px */
  gap: 8px; /* Nuevo */
  min-height: 44px; /* WCAG tap target */
  display: inline-flex;
  align-items: center;
}
```

**QA:** Mobile 375px, los 3 botones se ven cómodos, no se solapan.

---

### T6. Blog hub grid 1fr en mobile [30min]

**Archivo:** `src/pages/blog/index.astro` (o `src/components/...` según estructura)

Buscar el grid con `repeat(auto-fit, minmax(120px, 1fr))` y añadir:
```css
@media (max-width: 640px) {
  .article-grid {
    grid-template-columns: 1fr;
  }
}
```

**QA:** Abrir `/blog/` en 375px → debe verse 1 columna, texto legible.

---

### T7. Wizard line connector 3px [30min]

**Archivo:** `src/components/calculator/Calculator.astro`

**Fix CSS:**
```css
.stepper-track::before {
  top: 16px; /* Ajustar si es necesario */
  left: 16px;
  right: 16px;
  height: 3px; /* Era 2px */
  background: var(--color-beige);
  z-index: 0;
}

@media (min-width: 640px) {
  .stepper-track::before {
    top: 18px;
    height: 3px; /* Era 2px */
  }
}
```

**QA:** Tablet 768px, la línea del wizard se ve claramente, comunica progreso.

---

### T8. Reemplazar emojis por SVG en calculadora index [1.5h]

**Archivo:** `src/pages/calculadora/index.astro`

**Fix:** Reemplazar cada emoji 🏠 🚿 🍳 🎨 🪵 por un SVG inline simple:

```astro
---
const calculatorIcons = {
  integral: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  bano: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h11"/><path d="M12 6h0"/><path d="M9 17v-2a2 2 0 0 1 2-2h2"/></svg>',
  cocina: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>',
  pintura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 11h2m-2 0v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6m14 0V7a2 2 0 0 0-2-2H9L7 3v2M5 11h14"/></svg>',
  suelo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>'
};
---
```

Aplicar en cada card. Color actual `var(--color-terracota)` 32x32px.

**QA:** Visual en Chrome/Safari/Firefox mobile, SVGs se ven, no hay □.

---

### T9. Gráfico doughnut con animación y tooltip [2.5h] ⭐ IDEA GEORGE

**Archivo:** `src/components/calculator/budget-chart.ts`

**Mejoras:**
1. **Animación de entrada** (CSS transitions):
   - Cada arco del doughnut anima con `stroke-dasharray` desde 0 hasta su valor final
   - Duración: 1s, ease-out
   - Implementación: añadir `<animate>` SVG o CSS keyframes

2. **Tooltip on hover/tap**:
   - Mostrar label + % + € al tocar/hover
   - En mobile: tap para mostrar, tap fuera para ocultar
   - Posición: cerca del dedo, no del segmento (mejor UX mobile)
   - CSS: `position:absolute; background:var(--color-grafito); color:var(--color-blanco); padding:8px 12px; border-radius:8px; font-size:0.875rem;`

3. **Accesibilidad**:
   - `role="img"` + `aria-label="Desglose del presupuesto: Item1 X%, Item2 Y%"`
   - `<title>` en cada segmento

**Código base:**

```typescript
export function generateDoughnutSVG(
  breakdown: BreakdownItem[],
  size: number = 200
): string {
  // ...existing code...
  
  // Añadir animation
  paths += `
    <circle ... >
      <title>${item.label}: ${Math.round(fraction * 100)}%${...}</title>
      <animate attributeName="stroke-dasharray" from="0 ${circumference}" to="${dashLength} ${dashGap}" dur="1s" fill="freeze" />
    </circle>
  `;
  
  // Añadir interactividad (data-segment para hover/tap)
  // Tooltip se maneja con JS aparte
}
```

**CSS para tooltip (en Calculator.astro o nuevo componente):**
```css
.budget-chart-segment {
  cursor: pointer;
  transition: opacity 0.2s;
}
.budget-chart-segment:hover,
.budget-chart-segment.active {
  opacity: 0.8;
}

.budget-chart-tooltip {
  position: absolute;
  background: var(--color-grafito);
  color: var(--color-blanco);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  pointer-events: none;
  transform: translate(-50%, -100%);
  margin-top: -8px;
  white-space: nowrap;
  z-index: 10;
  font-family: var(--font-inter);
  font-weight: 600;
}

.budget-chart-tooltip::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--color-grafito);
}
```

**JS para tooltip (en StepFinal.astro o budget-chart.ts):**
```javascript
// Añadir event listeners a cada circle segment
document.querySelectorAll('.budget-chart-segment').forEach(segment => {
  segment.addEventListener('click', (e) => {
    const tooltip = document.querySelector('.budget-chart-tooltip');
    if (tooltip) {
      const rect = segment.getBoundingClientRect();
      const parentRect = segment.closest('.budget-chart').getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width/2 - parentRect.left}px`;
      tooltip.style.top = `${rect.top - parentRect.top}px`;
      tooltip.textContent = segment.dataset.tooltip;
      tooltip.style.opacity = '1';
    }
  });
});

// Cerrar al tap fuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('.budget-chart')) {
    const tooltip = document.querySelector('.budget-chart-tooltip');
    if (tooltip) tooltip.style.opacity = '0';
  }
});
```

**QA:**
- Chrome desktop: hover sobre segmento → tooltip aparece con label + % + €
- Chrome mobile 375px: tap sobre segmento → tooltip aparece, tap fuera → desaparece
- Animación: cada arco entra suavemente desde 0
- Lighthouse accessibility >90

---

### T10. PDF premium mejorado [3h] ⭐ IDEA GEORGE

**Archivo:** `src/components/calculator/pdf-generator.ts`

**Mejoras:**

1. **Branding completo:**
   - Logo Bilbao Reforma (vector o texto estilizado)
   - Colores brand (terracota #C45C3E, grafito #2D2D2D)
   - Header con línea decorativa

2. **Contenido extra:**
   - Fecha de generación + validez (30 días)
   - ID presupuesto (ej: BR-2026-07-06-001)
   - Comparativa con precio medio de la ciudad
   - 3-5 recomendaciones personalizadas ("Para tu reforma de 80m², te recomendamos...")
   - QR code al WhatsApp business (usar librería `qrcode` o vanilla)

3. **Footer legal:**
   - RGPD compliance text
   - Contacto empresa
   - "Presupuesto orientativo, no vinculante"

4. **Estructura visual:**
```js
// HEADER (y=20)
doc.setFontSize(22);
doc.setTextColor(196, 92, 62); // terracota
doc.text('Bilbao Reforma', 20, 20);

doc.setFontSize(10);
doc.setTextColor(100, 100, 100);
doc.text('Calculadora de presupuestos · 2026', 20, 28);

// Línea decorativa
doc.setDrawColor(196, 92, 62);
doc.setLineWidth(0.5);
doc.line(20, 32, 190, 32);

// TÍTULO (y=45)
doc.setFontSize(16);
doc.setTextColor(45, 45, 45);
doc.text(`Presupuesto de ${budget.calculatorLabel}`, 20, 45);

// METADATA (y=55)
doc.setFontSize(10);
doc.setTextColor(100, 100, 100);
doc.text(`Ciudad: ${budget.city}`, 20, 55);
doc.text(`Fecha: ${fechaFormateada}`, 20, 62);
doc.text(`ID: BR-${idPresupuesto}`, 20, 69);
doc.text(`Validez: 30 días`, 20, 76);

// RANGO PRECIO (y=90)
doc.setFillColor(240, 247, 238); // verde light
doc.rect(15, 85, 180, 25, 'F');
doc.setFontSize(20);
doc.setTextColor(74, 103, 65); // verde montana
doc.text(`${budget.min.toLocaleString('es-ES')} € — ${budget.max.toLocaleString('es-ES')} €`, 20, 100);

// DESGLOSE (y=120+)
// ... existing breakdown table ...

// COMPARATIVA CIUDAD (y=200+)
doc.setFontSize(12);
doc.setTextColor(45, 45, 45);
doc.text('Precio medio en tu ciudad:', 20, 210);
doc.text(`${precioMedioCiudad} €/m²`, 20, 218);

// RECOMENDACIONES (y=230+)
// ...

// QR CODE WHATSAPP (esquina inferior derecha)
// ...

// FOOTER LEGAL (y=280)
doc.setFontSize(8);
doc.setTextColor(150, 150, 150);
doc.text('Presupuesto orientativo, no vinculante. Válido 30 días.', 20, 280);
doc.text('Bilbao Reforma · +34 642 147 856 · info@bilbaoreforma.es', 20, 285);
doc.text('RGPD: Tus datos se usan solo para enviarte este presupuesto y ofertas relevantes. Puedes darte de baja en cualquier momento.', 20, 290, { maxWidth: 170 });
```

**Instalar qrcode (si se usa librería):**
```bash
cd /home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora
npm install qrcode @types/qrcode
```

O usar vanilla SVG/canvas QR generator.

**QA:**
- Descargar PDF desde calculadora baño Bilbao
- Verificar: logo, colores brand, desglose, comparativa, QR funcional (escanear con móvil debe abrir WhatsApp), footer legal
- Tamaño archivo <500KB

---

## 📊 ENTREGABLES FINALES

1. **Build verde:** `npm run build` sin errores ni warnings
2. **6 enlaces rotos corregidos** (verificación con curl)
3. **4 bugs de cálculo corregidos** (test manual cada calculadora)
4. **Empresas fake eliminadas** (grep devuelve 0)
5. **Mobile polish completo** (slider, cityswitcher, blog grid, wizard line)
6. **Gráfico con animación + tooltip** funcional en desktop y mobile
7. **PDF premium** con branding, comparativa, QR, footer legal
8. **Reporte final** con:
   - Lista de archivos modificados
   - Diff resumido de cambios importantes
   - Screenshots antes/después (si es posible)
   - Verificación de QA de cada tarea
   - Cualquier issue encontrado durante desarrollo

---

## 🚦 PROTOCOLO DE QA

Para cada tarea:
1. **Implementar** el fix
2. **Build:** `npm run build` → debe ser verde
3. **Verificar** según criterios específicos de la tarea
4. **Documentar** en el reporte final

Si encuentras un bug adicional durante el desarrollo:
- Documentarlo en el reporte
- NO lo arregles a menos que sea trivial (<5min)
- Priorizar terminar las tareas principales

---

## ⏱️ TIMELINE ESTIMADO

- T1-T3: 3h (críticos, hacer primero)
- T4-T7: 2.5h (mobile polish batch)
- T8: 1.5h (SVG icons)
- T9: 2.5h (chart animado + tooltip)
- T10: 3h (PDF premium)

**Total: ~12h** (puede ser más rápido si todo sale bien)

Si te quedas sin tiempo, **prioridad absoluta** es T1-T3 (críticos que rompen UX/legal). T4-T10 son mejoras pero pueden esperar al siguiente sprint.

---

## 🎯 EMPIEZA POR T1

No leas más docs, empieza por T1 (enlaces rotos) y avanza secuencialmente. Si encuentras bloqueos, documenta y sigue con la siguiente.

Éxito. 🐾