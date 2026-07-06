# 🎨 Rediseño Doughnut Chart — StepFinal Bilbao Reforma

**Fecha:** 2026-07-03
**Componente:** `src/components/calculator/budget-chart.ts` (75 líneas)
**Wrapper:** `src/components/calculator/StepFinal.astro` líneas 155-200

---

## Diagnóstico del diseño actual

### Lo que funciona
- Vanilla SVG sin dependencias (cero JS extra en runtime) → bundle ligero, renderiza offline.
- Doble grid `1fr 1.2fr` chart+leyenda es razonable en desktop; el breakpoint <640px ya está previsto.
- Total en el centro (Playfair, grafito) da contexto inmediato sin obligar a sumar.
- Leyenda con dot + label + % es legible y ordenada.

### Lo que NO funciona (problemas detectados)
1. **Falta el dato clave: importe en €** — el usuario llega al StepFinal para ver **cuánto cuesta cada partida**. Mostrar solo % obliga a multiplicar mentalmente (28% × total). Impacto: alto.
2. **Total en el centro compite con `final-range`** — el rango de precios grande (clamp 2–2.75rem) ya está arriba; el total del donut (1.25rem) se siente repetitivo y pequeño. Impacto: medio.
3. **Sin accesibilidad** — SVG sin `<title>`, `<desc>`, `role="img"` ni `aria-label`. Usuarios con screen reader no saben qué hay. Impacto: medio (legal/RSEO).
4. **Sin interactividad** — hover/focus no resalta el segmento ni conecta con su fila de leyenda. Chart se siente "muerto" tras un cálculo de varios pasos. Impacto: medio-alto (engagement).
5. **Stroke 28px / radio ~116px** — los segmentos pequeños (Pintura 14%, ~5° del arco) se confunden visualmente con el `color-crema` de fondo. Impacto: medio.
6. **Leyenda con jerarquía plana** — dot 12px, label, % todos mismo peso visual. El % debería destacar; el label debería ser secundario. Impacto: bajo-medio.
7. **Sin animación de entrada** — el resto de la calculadora tiene transiciones (StepFinal se siente estático). Impacto: bajo.
8. **En mobile el donut queda aislado** — al colapsar a 1 columna, el chart sin contexto lateral se siente "suelto". Impacto: bajo-medio.

### Limitaciones técnicas
- **Vanilla SVG (sin Chart.js):** no hay animaciones nativas, no hay tooltip built-in, no hay data binding reactivo. Cualquier interactividad requiere CSS + JS manual (~30 líneas extra). Aceptable porque el componente es server-rendered (HTML string).
- **75 líneas:** cabe una variante "mejorada in-place" sin crecer mucho. Una variante "premium" con animación requeriría mover el componente a cliente (`.ts` con `querySelector` tras render) o pre-renderizar el JS inline.

---

## Alternativa A — "Mejorada in-place"

**Filosofía:** mismos huesos, ajustes quirúrgicos de información y jerarquía.

**Cambios concretos:**
- Leyenda pasa a **3 columnas por fila**: `[dot] [label + €] [%]`. El importe en € se calcula en el `StepFinal.astro` (que ya tiene el total) y se pasa al `breakdown` como campo extra `amount: number`.
- Total del centro **sube a clamp(1.5–1.75rem)** y se posiciona más cerca del borde superior (gap menor al label "TOTAL").
- Stroke width baja de **28 → 24px** para dar más aire a segmentos pequeños.
- Añadir `<title>Desglose del presupuesto por categoría</title>` dentro del `<svg>` + `role="img"` en el contenedor.
- Leyenda: label en `var(--color-grafito)` peso 500, % en `var(--color-grafito)` peso 700, importe en `var(--color-gris)`.

**Sketch ASCII (desktop):**
```
┌─────────────────────────────────────────────────┐
│  ╭───────╮    Albañilería      28%  8.400 €    │
│  │ 28%   │    Cocina+Baños     25%  7.500 €    │
│  │ total │    Instalaciones    18%  5.400 €    │
│  ╰───────╯    Pintura          14%  4.200 €    │
│                Suelo            15%  4.500 €    │
└─────────────────────────────────────────────────┘
```

**Tiempo:** ~2h
**Riesgo:** bajo (cambios localizados, sin refactor)

---

## Alternativa B — "Información rica"

**Filosofía:** el usuario quiere el "cuánto", no solo el "%". El chart pasa a ser secundario; el desglose numérico es el protagonista.

**Cambios concretos:**
- **Layout 2 zonas**: izquierda doughnut (más pequeño, ~180px, soporte visual), derecha tabla de desglose con **barras horizontales de progreso** dentro de cada fila.
- Cada fila de la tabla: `[color] [categoría] [barra—————] [€] [%]`.
- Total del centro del donut se mantiene pero pasa a **"ver más"** que scrollea a la tabla (móvil) o muestra tooltip con importes (desktop).
- Hover sobre segmento del SVG → resalta fila correspondiente de la tabla (vía `data-cat` compartido). Requiere ~25 líneas de JS vanilla.
- Versión print-friendly (email/PDF): la tabla es legible sin chart.

**Sketch ASCII (desktop):**
```
┌──────────────────────────────────────────────────┐
│  ╭─────╮  ┌──────────────────────────────────┐   │
│  │  T  │  │ ▌ Albañilería    ████████░░ 28% │   │
│  ╰─────╯  │ ▌ Cocina+Baños   ███████░░░ 25% │   │
│   30k €   │ ▌ Instalaciones  █████░░░░░ 18% │   │
│           │ ▌ Pintura        ████░░░░░░ 14% │   │
│           │ ▌ Suelo          ████░░░░░░ 15% │   │
│           └──────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
        8.400€   7.500€  5.400€  4.200€  4.500€
```

**Tiempo:** ~4h (incluye JS de interactividad)
**Riesgo:** medio (cambio de layout puede romper responsive del StepFinal; requiere test móvil)

---

## Alternativa C — "Visual premium"

**Filosofía:** el chart es la "foto final" del cálculo. Hay que darle peso emocional.

**Cambios concretos:**
- **Animación de entrada**: segmentos se dibujan progresivamente con `stroke-dasharray` animado vía CSS `@keyframes` (~1.2s ease-out, escalonado 100ms entre segmentos).
- Total en el centro: contador animado de 0 → total con `requestAnimationFrame` (~800ms).
- **Hover effects**: segmento se expande (stroke-width 24→30 con transición), resto se opaca a 40%, fila de leyenda correspondiente se resalta con borde izquierdo del color.
- Tipografía: label "TOTAL" en uppercase + tracking +0.1em; cifra en Playfair 1.875rem peso 700 con `font-feature-settings: "tnum"` (tabular nums).
- Background del contenedor: gradiente sutil `linear-gradient(135deg, blanco, crema-50)` + sombra más profunda `0 12px 32px rgba(0,0,0,0.08)`.
- Versión incluye los importes en € de la Alternativa A (no son excluyentes).

**Sketch ASCII (estado hover sobre Albañilería):**
```
┌═════════════════════════════════════════════════┐
║  ╭───────────╮    ┃ ▌ Albañilería    8.400 € 28% ║
║  │ ████████  │    ┃ ▌ Cocina+Baños       7.500 € ║
║  │  TOTAL    │    ┃ ▌ Instalaciones      5.400 € ║
║  │ 30.000 €  │    ┃ ▌ Pintura            4.200 € ║
║  ╰───────────╯    ┃ ▌ Suelo              4.500 € ║
║   (resto opaco)   (sin highlight)              ║
└═════════════════════════════════════════════════┝
```

**Tiempo:** ~6h (animaciones + JS de hover + test cross-browser)
**Riesgo:** medio-alto (animaciones pueden chocar con `prefers-reduced-motion`; requiere fallback)

---

## Recomendación

**Implementar primero: A**

Razones:
1. **Resuelve el problema #1** (falta el dato €) con cambio mínimo y sin refactor.
2. **Tiempo/beneficio óptimo**: 2h cubren el 70% del valor percibido (dato accionable + accesibilidad básica).
3. **Riesgo bajo**: la calculadora está en producción; un cambio quirúrgico no rompe nada.
4. La Alternativa B es valiosa pero rompe layout y require test móvil exhaustivo. La C es "nice to have" que se puede añadir encima de A en una segunda iteración.

**Plan de implementación:**
1. **Modificar `BreakdownItem`** para aceptar `amount?: number` (opcional, retrocompatible). En `StepFinal.astro`, pasar el importe calculado por categoría al array `breakdown`.
2. **Cambiar `generateDoughnutSVG`** para:
   - Renderizar `<title>` y `role="img"` con resumen textual.
   - Cambiar `strokeWidth` de 28 a 24.
   - En la leyenda, añadir una segunda línea debajo del label con `formatEUR(amount)` si existe (estilo `var(--color-gris)`, `font-size: 0.75rem`).
3. **Ajustar CSS en `StepFinal.astro`** (líneas 161-180):
   - `.budget-chart-total` → `clamp(1.5rem, 3vw, 1.75rem)` + `font-feature-settings: "tnum"`.
   - `.budget-legend-item` → reorganizar a `grid-template-columns: auto 1fr auto auto` con gap 0.5rem.
4. **Test responsive**: verificar que el nuevo label de 2 líneas en leyenda no rompe en móvil (<360px) — si rompe, reducir `font-size` a 0.6875rem.
5. **Smoke test**: ejecutar `npm run dev`, completar una calculadora, screenshot desktop + mobile, validar contraste con axe DevTools.

**Iteración futura (no ahora):** una vez A esté estable, evaluar C (animaciones) como v2. B queda descartada salvo que feedback indique que el desglose es demasiado denso.

---

## Riesgos a considerar

- **Datos calculados**: los importes por categoría requieren que `StepFinal.astro` ya tenga el breakdown con valores absolutos, no solo %. Si el cálculo actual solo produce %, hay que extraer los subtotales (1-2h extra).
- **i18n / formato €**: usar `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })` para evitar hardcodear "€".
- **Contraste de colores**: los 5 colores de las categorías deben mantener ratio ≥4.5:1 sobre blanco. Si alguno falla, ajustar luminosidad en el design system.
- **Print/email**: la calculadora probablemente se envía por email. Verificar que el chart con importes se ve bien en clientes que bloquean SVG animado (futuro C) o con CSS desactivado.
- **Performance**: el SVG ya es server-rendered; añadir `<title>` no impacta. No riesgo de regresión LCP.