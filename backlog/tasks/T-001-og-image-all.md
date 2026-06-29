# T-001 [ALTA] — og:image en TODAS las páginas

## Estado: PENDIENTE
## Estimación: 1h

## 🎯 Objetivo
Asegurar que TODAS las 97 páginas (no solo blogs) tengan `og:image` válido. Google penaliza posts sin imagen al compartir en redes sociales y reduce CTR orgánico.

## 📋 Acciones atómicas

### A. Auditar páginas SIN og:image
```bash
cd /home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora
# Contar cuántos tienen y cuántos no
echo "Con og:image:" && find dist -name "*.html" -exec grep -l 'og:image' {} \; | wc -l
echo "Sin og:image:" && find dist -name "*.html" -exec grep -L 'og:image' {} \; | wc -l
echo "" && echo "Páginas sin og:image:"
find dist -name "*.html" -exec grep -L 'og:image' {} \;
```

### B. Estrategia de imagen
- **Blogs:** una imagen genérica por blog o una específica si existe. Default: `/images/og/blog-default.jpg`
- **Ciudades:** `/images/og/<city>-default.jpg` (bilbao, donostia, vitoria)
- **Empresas:** logo de cada empresa o genérico si no tienen
- **Calculadoras:** una imagen por calculadora con screenshot
- **Páginas legales:** genérica del site

### C. Implementar
1. **SI NO EXISTE** la imagen: usar la og:image del index.html legacy
2. **SÍ existe en /public/images/og/**: usarla
3. **SI NO HAY imágenes disponibles**: crear placeholders con texto overlay
4. **Para cada página**, añadir en el layout correspondiente:
```astro
<meta property="og:image" content="https://www.bilbaoreforma.es/images/og/<page>-og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="<descripción clara para accesibilidad y SEO>">
```

### D. NO TOCAR
- Los .astro que ya tienen og:image correcto
- El index.html legacy

### E. Verificar con lighthouse-style check
```bash
# Después del build, todos deberían tener og:image
find dist -name "*.html" -exec grep -L 'og:image' {} \; | wc -l
# Debe ser 0
```

## 🚦 QA TEXTOS (OBLIGATORIO)
Para cada nueva imagen:
- **Alt text descriptivo** (no "imagen.jpg" sino "baño reformado Bilbao 2026 con azulejos")
- **Caption contextual** (donde aplique)
- **Filename SEO-friendly** ("reforma-bano-bilbao-og.jpg", no "IMG_1234.jpg")

## 📤 Output esperado
- Lista de archivos modificados (paths absolutos)
- Output build verde (`npm run build 2>&1 | tail -5`)
- Conteo final: 0 páginas sin og:image
- Lista de imágenes añadidas con alt text

## 📚 Contexto
- `src/layouts/BaseLayout.astro` (extender con og:image default)
- `src/layouts/BlogLayout.astro`
- `src/layouts/CityLayout.astro` (nuevo)
- `src/layouts/EmpresaLayout.astro` (nuevo)
- `src/layouts/CalculadoraLayout.astro` (nuevo)
- `legacy/index.html` (referencia de og:image del site)

