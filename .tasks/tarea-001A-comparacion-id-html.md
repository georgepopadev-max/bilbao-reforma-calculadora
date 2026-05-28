# TAREA-001A: Añadir id al span de comparación Bilbao

## 📋 Análisis
En `calculadora/index.html`, el texto de comparación Bilbao no tiene `id` y no se puede actualizar dinámicamente desde JS.

## 🔧 Desarrollo

### Fichero: `calculadora/index.html`

**Línea ~604** — Buscar:
```html
<div class="result-comparison-label">para reforma media en edificio 20-40 años</div>
```

**Reemplazar por:**
```html
<div class="result-comparison-label" id="resultComparisonLabel">para reforma media en edificio 20-40 años</div>
```

Solo se añade `id="resultComparisonLabel"`. Nada más.

---

## ✅ QA
- [ ] Buscar en el HTML el `id="resultComparisonLabel"` existe
- [ ] El texto visible sigue siendo el mismo
- [ ] No hay otros cambios en el fichero
