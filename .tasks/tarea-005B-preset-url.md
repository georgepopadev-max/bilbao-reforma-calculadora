# TAREA-005B: Modificar init() para soportar ?preset= en URL

## 📋 Análisis

### Problema
`calculator.js` no lee query params. Al cargar `/calculadora/cocina-bilbao.html?preset=cocina`, el wizard no pre-selecciona nada.

### Solución
En `init()`, leer `URLSearchParams` y llamar a `updateReformTypes(['kitchen'])` o `updateReformScope('integral')` según el valor.

---

## 🔧 Desarrollo

### Fichero: `js/calculator.js`

**Buscar función init() (~línea 1248)**

**Reemplazar o añadir al inicio de init():**
```javascript
function init() {
  // Pre-seleccionar desde query params si existen
  const params = new URLSearchParams(window.location.search);
  const preset = params.get('preset');
  
  if (preset) {
    // Mapeo de preset → reformScope o reformTypes
    const scopePresets = { 'basic': 'basic', 'media': 'medium', 'integral': 'integral', 'premium': 'luxury' };
    const typePresets = { 'cocina': 'kitchen', 'bano': 'bathroom', 'pintura': 'painting', 'suelo': 'flooring' };
    
    if (scopePresets[preset]) {
      BilbaoCalc.updateReformScope(scopePresets[preset]);
    } else if (typePresets[preset]) {
      BilbaoCalc.updateReformTypes([typePresets[preset]]);
    }
  }
  
  // Initialize with first step visible (static HTML)
  showStep(1);
  bindNavigationEvents();
}
```

**Nota:** `BilbaoCalc.updateReformTypes` y `BilbaoCalc.updateReformScope` deben estar definidos en el objeto público antes de que init() los llame. Verificar que están en `window.BilbaoCalc`.

---

## ✅ QA
- [ ] `node --check js/calculator.js` pasa
- [ ] URL `?preset=cocina` → pre-selecciona Cocina al cargar
- [ ] URL `?preset=integral` → pre-selecciona Reforma integral
- [ ] URL `?preset=bano` → pre-selecciona Baño
- [ ] URL sin preset → comportamiento normal (step 1 vacío)
- [ ] Console sin errores al cargar con preset