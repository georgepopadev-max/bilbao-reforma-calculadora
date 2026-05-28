# TAREA-001B: Texto dinámico de comparación Bilbao en JS

## 📋 Análisis
En `updateResultDisplay()` (JS), el texto de comparación Bilbao es hardcodeado. Hay que construirlo dinámicamente basándose en el tipo de reforma y antigüedad del edificio seleccionados.

## 🔧 Desarrollo

### Fichero: `js/calculator.js`

**Ubicación:** función `updateResultDisplay()`, después de la línea que actualiza `compValueEl` (~línea 588).

**Añadir ANTES del cierre de `updateResultDisplay()`:**

```js
    // Texto dinámico para la etiqueta de comparación Bilbao
    const reformTypeLabel = data.reformScope
      ? PRICE_DATA.reformScope[data.reformScope].label.toLowerCase()
      : (data.reformTypes.length === 1
        ? PRICE_DATA.reformType[data.reformTypes[0]]?.label.toLowerCase()
        : 'múltiples estancias');
    const ageLabelText = PRICE_DATA.ageMultiplier[data.buildingAge]?.label || '';
    const comparisonLabelEl = document.querySelector('.result-comparison-label');
    if (comparisonLabelEl) {
      comparisonLabelEl.textContent = `para ${reformTypeLabel} en edificio ${ageLabelText}`;
    }
```

**Regla:** Buscar la línea `if (compValueEl) compValueEl.textContent = result.avgPerSqm + ' €/m²';` y añadir el bloque nuevo justo después.

---

## ✅ QA
- [ ] `node --check js/calculator.js` pasa sin errores
- [ ] Seleccionar **Reforma básica** → texto dice "para reforma básica en edificio..."
- [ ] Seleccionar **Piso nuevo (<20 años)** → texto incluye "< 20 años"
- [ ] Seleccionar **Integral + Casco Viejo** → texto coherente
- [ ] Seleccionar **solo Pintura** → texto dice "para Pintura en edificio..."
