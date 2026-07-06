# BRIEF — TAREA-001: Rediseño Flujo Calculadora Bilbao Reforma

**PROYECTO:** BilbaoReforma.es
**TAREA #:** TASK-001
**OBJETIVO:** Rediseñar el paso final (resultado) de las 3 calculadoras para que sea atractivo, responsive y genere PDFs de confianza.

---

## PROBLEMAS CONCRETOS

### 1. Gráfica — Mal posicionada y entrecortada
**Ubicación actual:** `StepFinal.astro` → CSS `.budget-chart { grid-template-columns: 1fr 1.2fr }`
- En móvil (375px): la leyenda se acumula al lado del donut, texto se corta
- El tooltip del donut se sale del contenedor
- El texto central del donut ("Total") puede quedar entrecortado en pantallas pequeñas
- Diseño genérico, no transmite profesionalidad

### 2. PDF — No transmite confianza
**Ubicación actual:** `pdf-generator.ts`
- Algunos textos de recomendaciones tienen fragmentos en chino/inglés mezclados
- El ID del documento no es legible ni tiene formato profesional
- Layout del PDF podría ser más premium
- El PDF descargado debería verse como un documento oficial de una empresa consolidada

### 3. Unificación — Donostia y Vitoria divergen
- `donostia/calculadora/index.astro` → Tiene su propio step 6 con barras horizontales
- `vitoria/calculadora/index.astro` → Igual que Donostia
- **Decisión:** Ambas deben usar el mismo componente de resultado (StepFinal.astro) para consistencia

### 4. Responsive — 4 resoluciones
Garantizar que el resultado se vea bien en:
- **375px** — móvil pequeño
- **768px** — tablet
- **1024px** — desktop
- **1440px** — wide desktop

---

## REQUISITOS DE DISEÑO

### Paso Final — Lo que quiere George
1. **Gráfica:** Centrada, grande, atractiva. O bien un donut rediseñado O bien barras horizontales más limpias. Tiene que verse bien en móvil.
2. **Rango de precio:** Muy visible, con el importe en grande
3. **Diseño premium** que transmita confianza para bajar del PDF
4. **Botón PDF:** Prominente, bien visible
5. **Consistente** en las 3 ciudades

### PDF — Características
1. **ID de documento** legible: BR-2026-07-06-001 (secuencial)
2. **Sin errores de texto** — todo en español limpio
3. **Datos reales** de precios del mercado Vasco 2026
4. **Logo/header** profesional
5. **Comparativa de ciudad** — muestra cómo se compara el presupuesto con la media
6. **4-5 recomendaciones** prácticas y en español
7. **Footer RGPD** correcto
8. **Validez 30 días**明示

---

## ARCHIVOS A TOCAR

### Componente principal (REDISEÑAR)
- `src/components/calculator/StepFinal.astro`
  → NUEVO diseño: donut/barras + price range + acciones + form

### Gráfica SVG (MEJORAR)
- `src/components/calculator/budget-chart.ts`
  → Hacerla responsive, tooltip correcto, text legible en mobile

### PDF (ARREGLAR)
- `src/components/calculator/pdf-generator.ts`
  → Limpiar textos, mejorar layout, ID profesional

### Unificación (MIGRACIÓN)
- `src/pages/donostia/calculadora/index.astro`
  → Reemplazar su step 6 propio por StepFinal.astro
- `src/pages/vitoria/calculadora/index.astro`
  → Reemplazar su step 6 propio por StepFinal.astro

---

## RESTRICCIONES
- NO romper las 5 calculadoras Bilbao existentes
- Build verde antes de entregar
- NO usar emojis en el PDF (profesional)
- Mantener el form de lead capture (Axonflow) funcionando
- Mobile-first CSS

---

## SALIDA ESPERADA
- Build passing: `cd /home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora && npm run build`
- PDFs con textos en español limpio
- Gráfica visible y legible en 375px, 768px, 1024px, 1440px
- Donostia y Vitoria usando el mismo componente de resultado que Bilbao
