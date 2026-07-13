# TASK: Emojis → SVGs + Bug PDF Donostia/Vitoria

## Objetivo
1. **Reemplazar emojis** `🏗️` y `🚿` en `reforma-donostia.astro` y `reforma-vitoria.astro` por SVGs inline (mismo estilo que el resto del proyecto — terracota)
2. **Investigar y corregir bug de "descargar PDF"** en las calculadoras Donostia/Vitoria — el PDF no se descarga

## Archivos a modificar
- `src/pages/donostia/reforma-donostia.astro` — 2 emojis (líneas ~10 y ~14)
- `src/pages/vitoria/reforma-vitoria.astro` — 2 emojis (líneas ~10 y ~14)
- `src/pages/donostia/calculadora/index.astro` — bug PDF
- `src/pages/vitoria/calculadora/index.astro` — bug PDF

## Contexto técnico

### Emojis → SVGs
Los SVGs deben seguir el mismo patrón visual (terracota #C45C3E) usado en Calculator.astro para los iconos de las cards de tipo de reforma. Buscar iconos similares ya usados en el proyecto para ser consistente.

### Bug PDF — Diagnóstico
El flujo actual en Donostia/Vitoria calculators:

1. `BilbaoCalc.calculateAndShowResult()` se llama al pulsar "Calcular Presupuesto"
2. El override en donostia/calculadora/index.astro hace:
   - Extrae `state.result.low` y `state.result.high`
   - Pone `sfEl.dataset.budgetLow / budgetHigh`
   - Llama a `stepFinalReveal(low, high, ..., 'donostia', 'Donostia', sfEl)` tras 220ms
3. `StepFinal.astro` → `initStepFinal()` → `reveal()` recibe los parámetros
4. Dentro de `reveal()`:
   - `breakdown` se construye desde `BREAKDOWN_CONFIG[calculatorType]`
   - El botón `#downloadPdfBtn` tiene listener que llama `generateBudgetPDF({ cityLabel, calculatorType, budgetLabel, min: low, max: high, breakdown })`
   - `generateBudgetPDF()` hace `doc.save(filename)` → trigger descarga

**Possibles causas del bug:**
- `stepFinalReveal` se llama 2 veces (primero desde el override, luego desde `initStepFinal` si `budgetLow/high` ya están en dataset) → una de las llamadas tiene breakdown vacío o low/high = 0
- En donostia/calculadora, `calculatorType` pasado es siempre `'integral'` hardcodeado
- `state.result` no existe en el objeto state de BilbaoCalc

**Verificar:** Buscar cómo `BilbaoCalc` (definido en Calculator.astro) computa `result` y si `state.result` existe en Donostia/Vitoria.

## Criterios QA
- Build pasa (`npm run build` verde)
- Los emojis en reforma-donostia y reforma-vitoria se ven como SVGs (no como emoji nativo)
- En producción: al completar una calculadora Donostia o Vitoria y pulsar "Descargar PDF", el PDF se descarga correctamente
- PDF generado tiene contenido (precio, breakdown, recomendaciones)
