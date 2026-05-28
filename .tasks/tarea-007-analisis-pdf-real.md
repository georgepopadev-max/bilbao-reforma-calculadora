# TAREA-007: PDF real con jsPDF

## 📋 Análisis

### Problema
`generatePDF()` actual (js/calculator.js) usa `window.print()` en una ventana nueva. Limitaciones:
- Depende de la configuración de impresión del navegador
- El usuario puede cancelar o guardar como HTML
- Calidad inconsistente entre navegadores
- La mayoría de usuarios esperan un PDF descargable

### Solución
Usar **jsPDF** (librería cliente, CDN) para generar un PDF descargable real.

### Implementación
1. Añadir script jsPDF desde CDN en el HTML de la calculadora
2. Reescribir `generatePDF()` para usar jsPDF (no window.print)
3. Mantener el diseño del PDF lo más similar posible al actual

### jsPDF CDN
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

### API jsPDF básica
```javascript
const { jsPDF } = window.jspdf;
const doc = new jsPDF();
doc.text('Hola mundo', 10, 10);
doc.save('presupuesto.pdf');
```

### Estructura del PDF a generar
- Header: logo "Bilbao Reforma", número presupuesto, fecha
- Título: "PRESUPUESTO DE REFORMA"
- Datos: tipo reforma, m², calidad, antigüedad
- Tabla: partidas, cantidad, €/ud, total
- Totales: subtotal, IVA, TOTAL
- Nota de disclaimer
- Footer: bilbaoreforma.es

### Cambios en calculator.js
Reescribir `generatePDF()` para usar doc.setFont, doc.text, doc.line, doc.table (jsPDF tiene table plugin).

### Dependencias
Solo jsPDF via CDN — no npm, no build.

---

## 🔧 Desarrollo

### Paso 1: Añadir jsPDF al HTML de la calculadora
En `calculadora/index.html`, antes de `</head>`:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

### Paso 2: Reescribir generatePDF() en js/calculator.js
Reescribir la función completa para usar jsPDF en vez de HTML+window.print.

Estructura del documento:
- Orientación: portrait
- Formato: A4
- Márgenes: 20mm
- Colores: usar terracota #C45C3E para acentos

**NO reescribir todo el PDF de golpe** — primero probar con datos básicos, luego añadir detalles.

### Paso 3: Verificar
El botón "Descargar PDF" debe:
1. Mostrar "Generando PDF..." brevemente
2. Descargar archivo `presupuesto-BR-YYYY-MM-DD-NNN.pdf`
3. No abrir ventana de impresión del navegador
