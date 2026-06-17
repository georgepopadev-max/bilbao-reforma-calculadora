# Auditoría de Navegación del Blog — bilbaoreforma.es

## Problemas identificados

1. **Sin sistema de filtrado por categoría en el index.html**
   Los artículos muestran tags visuales (Errores, Guía, Baño, Cocina…) pero no son clicables. No hay forma de navegar por temas sin recorrer todos los artículos.

2. **Sidebar genérico, no contextual**
   Los 4-7 artículos relacionados en el sidebar se repiten en几乎todos los artículos (cambiar-suelo, reforma-cocina, precio-reforma-integral, empresas-reformas). El artículo sobre "Errores reforma cocina" muestra los mismos enlaces que "Reforma baño". No hay相关性algoritmo ni diferenciación por tema.

3. **Zero internal linking dentro del contenido del artículo**
   En el artículo `reforma-bano-bilbao-2025.html` hay **0 enlaces internos** dentro del contenido (entre `<article>` y `</article>`, excluyendo header/sidebar/footer). El único enlace es al index, no a otros artículos del blog. Esto rompe el Journey del usuario y cannibaliza SEO.

4. **CTA único y repetitivo**
   Solo existe un CTA: "Calcular presupuesto gratis". Aparece al final del contenido. No hay CTAs temáticos ("Ver ejemplo real", "Descargar checklist", "Comparar materiales") que capten al usuario con diferentes intents.

5. **Sin navegación anterior/siguiente**
   No existe prev/next navigation al final de los artículos. El usuario que termina de leer no tiene un camino natural hacia otro contenido.

6. **Sidebar sin widgets de retención**
   Falta: "Artículos recientes", "Explora por tipo de reforma", newsletter/signup, o cualquier contenido que no sea siempre los mismos 4 enlaces a otros artículos + calculadora.

7. **Tags inconsistentes y sin taxonomy**
   Los tags varían en nombre (Baño vs Reformabaño, Calefacción vs Suelo) y color. No hay una taxonomía clara ni página de tag.

---

## Oportunidades de mejora

1. **Tags clicables + página de categoría**
   Convertir los tags existentes en enlaces que filtren el index, y crear páginas `/blog/categoria/baño.html`, `/blog/categoria/cocina.html`… o filtrar por JS en el mismo index.html.

2. **Sidebar contextual por tema**
   En lugar de artículos genéricos, el sidebar debe mostrar los artículos más relevantes para ese tema específico. Ejemplo: el artículo de "Errores reforma cocina" → sidebar con artículos de cocina y presupuestos, no con artículos aleatorios sobre baños.

3. **Internal links in-content (no solo sidebar)**
   Insertar 2-4 "Leer también" links dentro del cuerpo del artículo, en párrafos relevantes. Ejemplo: en el artículo de precio reforma integral, un párrafo sobre cocinas podría enlazar naturalmente a "Reforma cocina Bilbao".

4. **CTAs variados y placed strategically**
   - CTAs temáticos: "Ver ejemplo de presupuesto de cocina" dentro del contenido sobre cocinas
   - CTAs de valor: "Descarga la checklist de errores a evitar" (PDF)
   - CTAs de exploración: "Compara: ¿reformar o comprar?"

5. **Navegación prev/next**
   Añadir al final de cada artículo: "← Artículo anterior" y "Siguiente artículo →" ordenados por fecha o por categoría.

6. **Sección "Explora por tipo de reforma" en el index**
   Reemplazar la grid plana de 21 artículos por secciones por categoría con mini-cards. Ejemplo:
   - **Baño** (3 artículos) → mini-cards
   - **Cocina** (3 artículos) → mini-cards
   - **Eficiencia energética** (aerotermia, suelo radiante) → mini-cards

7. **"Artículos trending" o "Más leídos"**
   Sin analytics, se puede inferir por fecha de modificación reciente (archivos con fecha más reciente = más relevantes para 2025). Crear una sección "Artículos actualizados" en el index o sidebar.

---

## Implementación sugerida (priorizada)

### Alta prioridad

**1. Convertir tags en enlaces de filtro + crear páginas de categoría**

Los tags actuales ya existen como `<span>` con color. Transformarlos en `<a>` que filtren por JS:

```html
<!-- En index.html, encima de la grid de artículos -->
<div class="blog-filters">
  <button class="filter-btn active" data-filter="all">Todos</button>
  <button class="filter-btn" data-filter="baño">Baño</button>
  <button class="filter-btn" data-filter="cocina">Cocina</button>
  <button class="filter-btn" data-filter="guía">Guía</button>
  <button class="filter-btn" data-filter="calefacción">Calefacción</button>
  <button class="filter-btn" data-filter="legal">Legal</button>
</div>

<style>
.blog-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; justify-content: center; }
.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-terracota);
  background: transparent;
  color: var(--color-terracota);
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}
.filter-btn:hover, .filter-btn.active {
  background: var(--color-terracota);
  color: white;
}
.article-card[data-category]:not(.shown) { display: none; }
.article-card { transition: opacity 0.3s; }
</style>

<script>
// Minimal JS filter - add data-category to each article card
const btns = document.querySelectorAll('.filter-btn');
btns.forEach(btn => {
  btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.article-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.add('shown');
      } else {
        card.classList.remove('shown');
      }
    });
  });
});
</script>
```

Cada article-card necesita `data-category="baño"` (minúsculas, sin acentos).

---

**2. Sidebar contextual: artículos relacionados por categoría**

En cada artículo, el sidebar debe mostrar los 4-5 artículos de la MISMA categoría. Esto requiere mantener una lista de categorías en cada HTML del artículo:

```html
<!-- En reforma-cocina-bilbao.html, sidebar: -->
<div class="sidebar-widget">
  <h3 class="sidebar-widget-title">Artículos sobre Cocina</h3>
  <a href="errores-reforma-cocina-bilbao.html" class="sidebar-article-link">
    <span class="sidebar-article-title">Errores Comunes en Reforma de Cocina</span>
  </a>
  <a href="cambiar-suelo-bilbao.html" class="sidebar-article-link">
    <span class="sidebar-article-title">Suelo Ideal para Cocina: Parqué o Vinilo</span>
  </a>
  <a href="materiales-cocina-bilbao.html" class="sidebar-article-link">
    <span class="sidebar-article-title">Materiales de Cocina: Encimeras y Muebles</span>
  </a>
</div>
```

Esto es un cambio manual por archivo, pero el impacto en engagement es alto.

---

**3. Internal links in-content: "Leer también" insertados en el cuerpo**

En el contenido del artículo (dentro de `.article-content`), insertar 2 bloques de "Leer también" en párrafos naturalesa上下文. Ejemplo para `reforma-bano-bilbao-2025.html`, después del primer `<table>` de precios:

```html
<div class="in-content-cta">
  <span class="in-content-cta-label">📖 Leer también</span>
  <a href="reforma-cocina-bilbao.html">Cuánto cuesta reformar una cocina en Bilbao →</a>
  <a href="cambiar-suelo-bilbao.html">Cambiar el suelo: parqué vs porcelánico vs vinilo →</a>
</div>

<style>
.in-content-cta {
  background: var(--color-crema);
  border-left: 3px solid var(--color-terracota);
  padding: 1rem 1.25rem;
  margin: 1.5rem 0;
  border-radius: 0 var(--radius-card) var(--radius-card) 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.in-content-cta-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-terracota);
  margin-bottom: 0.25rem;
}
.in-content-cta a {
  font-size: 0.9375rem;
  color: var(--color-grafito);
  text-decoration: none;
  font-weight: 500;
}
.in-content-cta a:hover {
  color: var(--color-terracota);
  text-decoration: underline;
}
</style>
```

---

### Media prioridad

**4. CTAs variados y por secciones del contenido**

Reemplazar el CTA genérico del final por CTAs contextuales en diferentes puntos del artículo:

```html
<!-- Después de sección de precios: -->
<div class="article-cta">
  <h3>¿Sabes cuánto debería costar tu reforma?</h3>
  <p>Usa nuestra calculadora para obtener un rango de precio realista para tu piso.</p>
  <a href="../calculadora/index.html" class="btn">Calcular presupuesto →</a>
</div>

<!-- Después de sección de errores/comunes: -->
<div class="article-cta" style="background: linear-gradient(135deg, #E8F0E4 0%, #F5FBF5 100%); border-color: var(--color-verde-montana);">
  <h3>¿Ya tienes 3 presupuestos?</h3>
  <p>Compara precios de mercado antes de firmar. Saber el rango te ahorra del 15 al 30%.</p>
  <a href="../calculadora/index.html" class="btn" style="background: var(--color-verde-montana);">Verificar presupuestos →</a>
</div>
```

**5. Navegación prev/next al final de cada artículo**

```html
<nav class="post-nav" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--color-beige);">
  <a href="articulo-anterior.html" class="post-nav-link" style="text-decoration:none;">
    <span style="font-size:0.75rem;color:var(--color-gris);">← Anterior</span>
    <span style="display:block;font-weight:600;color:var(--color-grafito);">Título del artículo anterior</span>
  </a>
  <a href="siguiente-articulo.html" class="post-nav-link" style="text-decoration:none; text-align:right;">
    <span style="font-size:0.75rem;color:var(--color-gris);">Siguiente →</span>
    <span style="display:block;font-weight:600;color:var(--color-grafito);">Título del siguiente</span>
  </a>
</nav>
```

**6. Sección "Explora por tipo de reforma" en index.html**

Reorganizar el index.html con secciones por categoría:

```html
<section style="margin-bottom: 3rem;">
  <h2 style="font-family:var(--font-inter);font-size:1.5rem;font-weight:700;margin-bottom:1rem;">
    🛁 Reforma de Baño
  </h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;">
    <!-- Bath articles cards here -->
  </div>
</section>

<section style="margin-bottom: 3rem;">
  <h2 style="font-family:var(--font-inter);font-size:1.5rem;font-weight:700;margin-bottom:1rem;">
    🍳 Reforma de Cocina
  </h2>
  <!-- Kitchen articles -->
</section>

<!-- Etc. -->
```

---

### Baja prioridad

**7. "Artículos recientemente actualizados" en sidebar**

En ausencia de analytics, añadir un widget de artículos con fecha de modificación más reciente:

```html
<div class="sidebar-widget">
  <h3 class="sidebar-widget-title">Actualizado Recientemente</h3>
  <!-- Manually curated 3-4 most recent articles -->
</div>
```

**8. Newsletter widget en sidebar**

```html
<div class="sidebar-widget" style="background: var(--color-crema);">
  <h3 class="sidebar-widget-title">📬 Recibe Guías Gratis</h3>
  <p style="font-size:0.875rem;color:var(--color-gris);margin-bottom:1rem;">Recibe por email nuestras guías de precios y consejos.</p>
  <a href="../contacto.html" class="btn" style="width:100%;justify-content:center;font-size:0.875rem;">Suscribirme →</a>
</div>
```

---

## Resumen de cambios por impacto

| Prioridad | Cambio | Impacto en retención | Dificultad |
|-----------|--------|---------------------|------------|
| Alta | Tags clicables + filtro por JS | ⭐⭐⭐ | Fácil |
| Alta | Sidebar contextual por categoría | ⭐⭐⭐ | Media (manual por artículo) |
| Alta | Internal links in-content | ⭐⭐⭐ | Fácil (insertar 2-4 bloques) |
| Media | CTAs variados y temáticos | ⭐⭐ | Fácil |
| Media | Navegación prev/next | ⭐⭐ | Fácil |
| Media | Index organizado por secciones | ⭐⭐ | Fácil (reorganizar index) |
| Baja | Actualizado recientemente | ⭐ | Fácil |
| Baja | Newsletter widget | ⭐ | Fácil |
