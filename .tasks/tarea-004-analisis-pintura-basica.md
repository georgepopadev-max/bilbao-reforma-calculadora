# TAREA-004: Fix pintura básica — evitar precios bajo mercado

## 📋 Análisis

### Problema
En `js/calculator.js`, el cálculo de pintura con calidad "básica" puede dar menos de 8 €/m²:

```
Pintura: minPerSqm: 8, maxPerSqm: 20, basePerSqm: 14
Quality basic multiplier: 0.8

Con quality = basic:
  min = 8 * 0.8 = 6.4 €/m²  ← POR DEBAJO del mercado (mínimo 8€)
  max = 20 * 0.8 = 16 €/m²  ← OK
  base = 14 * 0.8 = 11.2 €/m²  ← OK
```

El mínimo del mercado en Bilbao para pintura con mano de obra es **8 €/m²**.

### Solución
Añadir un clamp: el precio por m² nunca puede ser menor que el mínimo absoluto del mercado para ese tipo.

### Implementación
En `calculateByRooms()`, cuando se calcula pintura:

```javascript
if (reformTypes.includes('painting')) {
  const base = PRICE_DATA.reformType.painting;
  // Clamp: el mínimo por m² nunca baja del mercado (8 €/m² para pintura)
  const minRate = Math.max(base.minPerSqm * qualityMult, 8);
  const maxRate = base.maxPerSqm * qualityMult;
  const avgRate = (minRate + maxRate) / 2;
  
  const low = sqm * minRate;
  const high = sqm * maxRate;
  // ...
}
```

Alternativa: hacer un helper genérico `clampMinPrice(rate, type)` que aplique el mínimo por tipo.

### Mínimos absolutos del mercado ( €/m² )
- Pintura: 8 €/m²
- Suelo: 25 €/m² (por debajo de esto no hay profesional)
- Baño: 3.000 € (min absolute)
- Cocina: 5.000 € (min absolute)

### Mínimo a cambiar
Solo pintura por ahora (es el único caso documentado donde baja del mínimo).
