# TAREA-003: Analizar calculadora filtrada

## 📋 Análisis

### Concepto
Las "calculadoras filtradas" son páginas específicas para cada tipo de reforma con URL propia. Ejemplo: `/calculadora/cocina-bilbao.html`. Incluyen:
1. SEO optimizado (meta title, H1, descripción)
2. Contenido editorial sobre esa estancia
3. Wizard pre-configurado para ese tipo (pintura seleccionada por defecto)

### Estructura planificada (del PLAN.md)
```
calculadora/
├── cocina-bilbao.html    # Pre-selecciona: cocina
├── bano-bilbao.html      # Pre-selecciona: baño
├── pintura-bilbao.html   # Pre-selecciona: pintura
├── suelo-bilbao.html     # Pre-selecciona: suelo
└── integral-bilbao.html  # Pre-selecciona: scope integral
```

### Diferencia con calculadora principal
- Hero/header con keyword de long-tail
- Introducción SEO antes del wizard
- Wizard pre-selecciona el tipo de reforma
- Artículos relacionados al final

### Ficheros a crear/modificar
- `calculadora/cocina-bilbao.html` — NUEVO
- `calculadora/bano-bilbao.html` — NUEVO
- `calculadora/pintura-bilbao.html` — NUEVO
- `calculadora/suelo-bilbao.html` — NUEVO
- `calculadora/integral-bilbao.html` — NUEVO
- `calculadora/index.html` — Puede necesitar ajustes para soportar preselección por URL

### Cómo pre-seleccionar desde la URL
Opción simple: usar query params
```
calculadora/cocina-bilbao.html?preset=cocina
```

En `calculator.js`, al init, leer `URLSearchParams` y setear `state.data.reformTypes = ['kitchen']` o `state.data.reformScope = 'integral'`.

### Artículos relacionados (ya existen en blog/)
- cocina → `blog/reforma-cocina-bilbao.html`
- baño → `blog/reforma-bano-bilbao.html`
- pintura → `blog/pintar-piso-bilbao.html`
- suelo → `blog/cambiar-suelo-bilbao.html`
- integral → `blog/precio-reforma-integral-bilbao.html`

### Reescribir analysis
Analizar:
1. ¿La calculadora actual soporta preselección via JS (sin hardcodear en HTML)?
2. ¿Cuánto contenido editorial hay que escribir para cada página?
3. ¿El PLAN.md describe exactamente qué contenido lleva cada una?
