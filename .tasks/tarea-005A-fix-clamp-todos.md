# TAREA-005A: Fix clamp mínimo para todos los reformTypes

## 📋 Análisis

### Problema
Con calidad "básica", todos los reformTypes dan `low` por debajo del mínimo del mercado:
- Pintura: 8×0.8=6.4 < 8 ❌
- Suelo: 25×0.8=20 < 25 ❌
- Baño: 3000×0.8=2400 < 3000 ❌
- Cocina: 5000×0.8=4000 < 5000 ❌

### Solución
Clamp: `Math.max(valorCalculado, minAbsoluto)`

---

## 🔧 Desarrollo

### Fichero: `js/calculator.js`

**Buscar la sección de cálculo por tipo (líneas ~162-177)**:

```javascript
if (reformTypes.includes('painting')) {
  const base = PRICE_DATA.reformType.painting;
  const low = sqm * base.minPerSqm * qualityMult;  // ← 6.4 ❌
  const high = sqm * base.maxPerSqm * qualityMult;
  // ...
}
```

**Reemplazar cada bloque con clamp**:

```javascript
if (reformTypes.includes('painting')) {
  const base = PRICE_DATA.reformType.painting;
  const minRate = Math.max(base.minPerSqm * qualityMult, 8); // clamp 8
  const maxRate = base.maxPerSqm * qualityMult;
  const low = sqm * minRate;
  const high = sqm * maxRate;
  // ...
  breakdown.push({ lowRate: Math.round(minRate), ... });
}
```

**Aplicar a TODOS los bloques**:
- `painting`: clamp `minRate` a 8
- `flooring`: clamp `minRate` a 25
- `bathroom`: clamp a `Math.max(calculated, base.min)`
- `kitchen`: clamp a `Math.max(calculated, base.min)`

**Buscar y reemplazar uno por uno** — no reescribir toda la función, solo ajustar los cálculos low.

---

## ✅ QA
- [ ] `node --check js/calculator.js` pasa
- [ ] Pintura basic → low ≥ 8 €/m²
- [ ] Suelo basic → low ≥ 25 €/m²
- [ ] Baño basic → low ≥ 3000 €
- [ ] Cocina basic → low ≥ 5000 €
- [ ] Calidad media/premium sigue igual (sin clamp)
- [ ] Los cálculos dan valores coherentes