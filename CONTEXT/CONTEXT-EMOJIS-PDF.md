# Contexto: Emojis → SVGs + Bug PDF Donostia/Vitoria

## Proyecto
BilbaoReforma.es — Calculadora de presupuestos de reformas (Astro + Tailwind)

## Tareas
1. **Emojis → SVGs**: `reforma-donostia.astro` y `reforma-vitoria.astro` tienen `🏗️` y `🚿` en las cards de tipo de reforma. Reemplazar por SVGs inline estilo terracota (#C45C3E).

2. **Bug PDF Donostia/Vitoria**: El botón "Descargar PDF" en la pantalla de resultado de las calculadoras Donostia y Vitoria no descarga nada. El mismo flujo en Bilbao (bano-bilbao.astro, etc.) funciona.

## Archivos clave

### Emojis
- `src/pages/donostia/reforma-donostia.astro` — líneas ~10 y ~14
- `src/pages/vitoria/reforma-vitoria.astro` — líneas ~10 y ~14

### Bug PDF
- `src/pages/donostia/calculadora/index.astro` — override de `calculateAndShowResult` (línea ~415-440)
- `src/pages/vitoria/calculadora/index.astro` — mismo patrón
- `src/components/calculator/StepFinal.astro` — `reveal()` (línea ~697) y listener del botón PDF (línea ~769)
- `src/components/calculator/budget-chart.ts` — `BreakdownItem` interface
- `src/components/calculator/pdf-generator.ts` — `generateBudgetPDF()` que hace `doc.save()`

## Flujo PDF (funciona en Bilbao)
1. `stepFinalReveal(low, high, budgetLabel, calculatorType, city, cityLabel, el)` se llama
2. Dentro de `reveal()`: `breakdown` se construye desde `BREAKDOWN_CONFIG[calculatorType]`
3. El listener del botón PDF (línea ~769) llama `generateBudgetPDF({ cityLabel, calculatorType, budgetLabel, min: low, max: high, breakdown })`
4. `generateBudgetPDF()` termina con `doc.save(filename)` → descarga

## Donostia/Vitoria override (línea ~415-440)
```typescript
BilbaoCalc.calculateAndShowResult = function () {
  _origCalcDonostia();
  setTimeout(() => {
    const state = (BilbaoCalc as any).state;
    const result = state?.result;
    const sfEl = document.getElementById('stepFinal');
    if (!sfEl || !result) return;
    const low  = result.low  ?? 0;
    const high = result.high ?? 0;
    if (low <= 0 || high <= 0) return;
    sfEl.dataset.budgetLow  = String(low);
    sfEl.dataset.budgetHigh = String(high);
    if (typeof (window as any).stepFinalReveal === 'function') {
      (window as any).stepFinalReveal(low, high, 'Reforma Integral', 'integral', 'donostia', 'Donostia', sfEl);
    }
  }, 220);
};
```

## Bilbao referencia (funciona)
En `bano-bilbao.astro` línea ~395:
```typescript
(window as any).stepFinalReveal(low, high, 'Reforma de Baño', 'bano', 'bilbao', 'Bilbao', sfEl);
```

## Posible causa del bug
El override de Donostia hardcodea `calculatorType='integral'` y `budgetLabel='Reforma Integral'`. Pero el `calculatorType` para el breakdown en StepFinal se usa para seleccionar `BREAKDOWN_CONFIG[calculatorType]`. Si el cálculo de Donostia no está usando los tipos de reforma correcta, el breakdown puede no generarse correctamente. Además, `stepFinalReveal` se llama desde el override Y potencialmente desde `initStepFinal` si `budgetLow/high` ya están en el dataset.

**Acción**: Eliminar la doble llamada: o bien el override llama a `stepFinalReveal` y NO se pone `dataset.budgetLow/high`, o bien se pone los datos en dataset y se deja que `initStepFinal` llame a `reveal` sin llamar a `stepFinalReveal` manualmente.

## QA
- `npm run build` pasa (129 páginas)
- Emojis reemplazados por SVGs en reforma-donostia y reforma-vitoria
- PDF descarga funciona en Donostia y Vitoria
