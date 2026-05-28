# TAREA-002: Importar y mapear datos compatibles de datasetValidated.js

## 📋 Análisis

### Problema
`js/calculator.js` tiene `PRICE_DATA` con datos duplicados de `js/datasetValidated.js`. Los datos de `reformScope`, `qualityMultiplier` y `ageMultiplier` son **idénticos en estructura** — se pueden importar directamente.

### Solución
Importar `DATASET_VALIDATED` desde `datasetValidated.js` y substituir las secciones compatibles de `PRICE_DATA`.

### Datos compatibles (1:1)
- `reformScope` — basic, medium, integral, luxury
- `qualityMultiplier` — basic, medium, premium
- `ageMultiplier` — new, moderate, old, historic

### Datos NO compatibles (dejar como están)
- `reformType` — bathroom/kitchen usan структура diferente (se tarta en 002B)
- `extras` — solo existe en calculator.js
- `contingencyPercent` — solo existe en calculator.js

---

## 🔧 Desarrollo

### Ficheros: `js/calculator.js`

**Cambio 1** — Añadir import al inicio del IIFE (línea ~9):
```javascript
import { DATASET_VALIDATED } from './datasetValidated.js';
```

**Cambio 2** — Reemplazar las secciones compatibles de `PRICE_DATA`:
```javascript
const PRICE_DATA = {
  // reformType, extras, contingencyPercent — unchanged (ver tarea 002B)

  // reformScope — sourced from DATASET_VALIDATED
  reformScope: DATASET_VALIDATED.reformScope,

  // qualityMultiplier — sourced from DATASET_VALIDATED
  qualityMultiplier: DATASET_VALIDATED.qualityMultiplier,

  // ageMultiplier — sourced from DATASET_VALIDATED
  ageMultiplier: DATASET_VALIDATED.ageMultiplier,
};
```

**Nota:** Los valores `minPerSqm`/`maxPerSqm` de `reformScope` en datasetValidated YA incluyen el rango completo. Copiar tal cual.

**Verificar** que `datasetValidated.js` exporta como ES module:
```javascript
// En datasetValidated.js debe decir:
export const DATASET_VALIDATED = { ... }
// NO: const DATASET_VALIDATED = { ... }
```

Si está como `const DATASET_VALIDATED`, convertir a `export const DATASET_VALIDATED`.

---

## ✅ QA
- [ ] `node --check js/calculator.js` pasa sin errores
- [ ] Los datos de reformScope/qualityMultiplier/ageMultiplier siguen igual que antes
- [ ] Los cálculos de reforma completa siguen funcionando (same results)
- [ ] Los botones de quality y age en el wizard siguen respondiendo igual
- [ ] Console sin errores al cargar la calculadora
