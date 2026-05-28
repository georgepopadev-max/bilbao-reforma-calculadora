# TAREA-002B: Hacer compatibles bathroom/kitchen con datasetValidated

## 📋 Análisis

### Problema
`calculator.js` espera `PRICE_DATA.reformType.bathroom` y `.kitchen` con estructura plana:
```js
bathroom: { min: 3000, max: 12000 }
kitchen: { min: 5000, max: 16000 }
```

`datasetValidated.js` tiene estructura anidada con `variants` y `qualityTiers` — incompatible.

### Solución
Añadir un helper que extraiga `min/max` desde la estructura de `datasetValidated` para bathroom y kitchen, manteniendo el resto de la lógica igual.

---

## 🔧 Desarrollo

### Ficheros: `js/calculator.js`

**Ubicación:** después de la línea de import de DATASET_VALIDATED.

**Añadir:**
```javascript
// Helper: extraer rango de bathroom/kitchen desde datasetValidated
// datasetValidated tiene variants{} anidados, calculator.js espera min/max planos
function getRoomRangeFromDataset(typeKey) {
  const typeData = DATASET_VALIDATED.reformType[typeKey];
  if (!typeData) return null;
  // Si ya tiene min/max directo (legacy), usar esos
  if (typeData.min !== undefined && typeData.max !== undefined) {
    return { min: typeData.min, max: typeData.max };
  }
  // Si tiene variants, promediar el rango global
  if (typeData.variants) {
    const variantKeys = Object.keys(typeData.variants);
    let min = Infinity, max = 0;
    variantKeys.forEach(k => {
      const v = typeData.variants[k];
      if (v.minPerSqm !== undefined) {
        // Es por m² — guardar para conversión (no aplica aquí)
      }
      // Para bathroom/kitchen el dataset usa min/max directos en variants
      if (v.min !== undefined && v.min < min) min = v.min;
      if (v.max !== undefined && v.max > max) max = v.max;
    });
    if (min !== Infinity && max > 0) return { min, max };
  }
  return null;
}
```

**Uso:** En `PRICE_DATA.reformType`, para bathroom y kitchen usar:
```javascript
const bathroomRange = getRoomRangeFromDataset('bathroom') || { min: 3000, max: 12000 };
const kitchenRange = getRoomRangeFromDataset('kitchen') || { min: 5000, max: 16000 };

reformType: {
  painting: { label: 'Pintura', minPerSqm: 8, maxPerSqm: 20, unit: 'm²', basePerSqm: 14 },
  flooring: { label: 'Suelo', minPerSqm: 25, maxPerSqm: 130, unit: 'm²', basePerSqm: 55 },
  bathroom: { label: 'Baño completo', min: bathroomRange.min, max: bathroomRange.max, unit: 'ud', basePerSqm: 0 },
  kitchen: { label: 'Cocina', min: kitchenRange.min, max: kitchenRange.max, unit: 'ud', basePerSqm: 0 },
},
```

---

## ✅ QA
- [ ] `node --check js/calculator.js` pasa sin errores
- [ ] Seleccionar Baño completo → sigue mostrando 3.000–12.000 € (o rango nuevo del dataset)
- [ ] Seleccionar Cocina → sigue mostrando 5.000–16.000 € (o rango nuevo del dataset)
- [ ] Los cálculos con bathroom/kitchen son correctos (same results que antes)
- [ ] Console sin errores al usar calculator
