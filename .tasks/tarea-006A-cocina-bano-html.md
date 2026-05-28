# TAREA-006A: Crear cocina-bilbao.html y bano-bilbao.html

## 📋 Análisis

### Concepto
Páginas específicas para cada tipo de reforma. URL: `/calculadora/cocina-bilbao.html?preset=cocina`. Cada página tiene:
1. Meta SEO optimizado para long-tail
2. Contenido editorial introductorio
3. Wizard pre-configurado (via query param)
4. Sección de artículos relacionados del blog

---

## 🔧 Desarrollo

### Fichero: `calculadora/cocina-bilbao.html`

Copiar desde `calculadora/index.html` como base. Cambios:

**Meta SEO** (dentro de `<head>`):
```html
<title>Calculadora de Reforma de Cocina en Bilbao 2025 — Precio Instantáneo</title>
<meta name="description" content="Calcula el presupuesto orientativo para reformar tu cocina en Bilbao. Precios por m² actualizados, sin registro. Cocinas desde 5.000 € hasta 16.000 €.">
```

**H1 del hero** (dentro de `<header>` o `<main>`):
```html
<h1>Calculadora de Reforma de Cocina en Bilbao</h1>
```

**Intro editorial** (antes del wizard):
```html
<section class="calc-intro">
  <p>Reformar una cocina en Bilbao cuesta entre 5.000 € y 16.000 € dependiendo de los materiales.Nuestra calculadora te da un presupuesto orientativo en 2 minutos, sin registro.</p>
  <p><strong>La cocina es la estancia más cara de reformar</strong> — incluye fontanería, electricidad, muebles, encimera y electrodomésticos. Usa esta herramienta para tener una idea clara antes de pedir presupuestos.</p>
</section>
```

**Script** (antes de `</body>`):
```html
<script>window.BilbaoCalc && window.BilbaoCalc.init();</script>
```
(El init() ya lee el query param `?preset=cocina` de la tarea 005B)

**Artículos relacionados** (al final antes del footer):
```html
<section class="related-articles">
  <h2>Artículos relacionados</h2>
  <a href="../blog/reforma-cocina-bilbao.html">Reforma de Cocina en Bilbao: Precios y Consejos</a>
  <a href="../blog/materiales-cocina-bilbao.html">Materiales de Cocina: Guía de Encimeras 2025</a>
</section>
```

**Canonical URL:**
```html
<link rel="canonical" href="https://bilbaoreforma.es/calculadora/cocina-bilbao.html">
```

### Fichero: `calculadora/bano-bilbao.html`

Mismo proceso, cambiar:
- Title: "Calculadora de Reforma de Baño en Bilbao 2025"
- Meta description: hablar de baños desde 3.000 € a 12.000 €
- H1: "Calculadora de Reforma de Baño en Bilbao"
- Intro: hablar de lo que incluye un baño (sanitarios, alicatado, fontanería)
- Preset: `?preset=bano`
- Artículos: `reforma-bano-bilbao.html`

---

## ✅ QA
- [ ] Página carga sin errores 404
- [ ] El wizard muestra "Baño completo" pre-seleccionado (por el ?preset=bano)
- [ ] Meta title y description visibles en el HTML
- [ ] Canonical URL apunta a la página correcta
- [ ] Los enlaces a artículos del blog funcionan
- [ ] `node --check` no aplica (es HTML puro)