# Plan: og:image y hreflang para Bilbao Reforma

## 1. Estado Actual

### og:image

| Archivo | ogImage override? | Valor |
|---|---|---|
| `BaseLayout.astro` | ✅ Define estructura | `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:card`, `twitter:image` |
| `src/pages/index.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/calculadora/index.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/calculadora/bano-bilbao.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/calculadora/cocina-bilbao.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/calculadora/pintura-bilbao.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/calculadora/suelo-bilbao.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/calculadora/integral-bilbao.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/donostia/calculadora/index.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/donostia/calculadora/bano-donostia.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/donostia/calculadora/cocina-donostia.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/donostia/calculadora/pintura-donostia.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/donostia/calculadora/suelo-donostia.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/donostia/calculadora/integral-donostia.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/vitoria/calculadora/index.astro` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/vitoria/calculadora/*` | ❌ | Falla a `/images/og/home-og.jpg` |
| `src/pages/barrios/reforma-*.astro` | ✅ `bilbao-og.jpg` | Per barrio — **⚠️ bilbao-og.jpg NO EXISTE en el filesystem** |
| `src/pages/blog/[slug].astro` | ✅ `blog-og.jpg` | OK — archivo existe |

**Problemas encontrados:**
- `home-og.jpg` existe en `images/og/` (source), pero NO en `public/images/og/` (producción servida). Falta copiarlo al build.
- `bilbao-og.jpg` referenciado en 9 páginas de barrios **NO existe** en ningún directorio del proyecto.
- Ninguna página de calculadora individual tiene og:image dinámico.
- Donostia y Vitoria usan la imagen genérica de Bilbao.

### hreflang

**Estado: NO EXISTE ningún tag hreflang** en todo el proyecto.

- Búsqueda en todos los `.astro`: resultado vacío.
- No hay `<link rel="alternate" hreflang` en ningún layout.
- Las 3 versiones de ciudad (Bilbao, Donostia, Vitoria) no tienen declaración de equivalencia.

---

## 2. Recomendación og:image

### Problema crítico
El `public/` no tiene las imágenes `og/home-og.jpg` ni `og/blog-og.jpg`. Astro sirve `public/` tal cual, así que las referencias `https://www.bilbaoreforma.es/images/og/home-og.jpg` devuelven 404 en producción.

### Solución recomendada: Imágenes estáticas + componente OG dinámico

**Paso A — Copiar imágenes existentes a `public/`**
```bash
mkdir -p public/images/og
cp images/og/home-og.jpg public/images/og/
cp images/og/blog-og.jpg public/images/og/
```
Crear además `public/images/og/donostia-og.jpg` y `public/images/og/vitoria-og.jpg` con versiones específicas por ciudad.

**Paso B — Añadir og:image a cada página de calculadora**

Modificar `CalculadoraLayout.astro` para recibir `ogImage` y `ogImageAlt` como props y pasarlas a `BaseLayout`. Luego cada página de calculadora específica pasa su imagen:

- `calculadora/index.astro` → `ogImage="/images/og/home-og.jpg"` (o imagen principal)
- `calculadora/bano-bilbao.astro` → `ogImage="/images/og/bilbao-og.jpg"` (crear)
- `calculadora/cocina-bilbao.astro` → `ogImage="/images/og/bilbao-og.jpg"`
- `calculadora/pintura-bilbao.astro` → `ogImage="/images/og/bilbao-og.jpg"`
- `calculadora/suelo-bilbao.astro` → `ogImage="/images/og/bilbao-og.jpg"`
- `calculadora/integral-bilbao.astro` → `ogImage="/images/og/bilbao-og.jpg"`
- `donostia/calculadora/index.astro` → `ogImage="/images/og/donostia-og.jpg"`
- `donostia/calculadora/bano-donostia.astro` → `ogImage="/images/og/donostia-og.jpg"` etc.
- `vitoria/calculadora/*` → `ogImage="/images/og/vitoria-og.jpg"`

**Paso C — Fix urgente para páginas de barrios**
Las 9 páginas de barrios referencian `bilbao-og.jpg` que NO existe. Crear ese archivo o cambiar la referencia.

**Paso D — og:image dinámico (opcional avanzado)**
Si se quiere og:image con texto dinámico (ciudad + tipo de reforma + presupuesto), la opción más limpia en Astro 4 es un endpoint API:
- Crear `src/pages/api/og/[city].ts` que devuelva imagen PNG con `@resvg/resvg-js` o similar
- Las páginas apontam a `https://www.bilbaoreforma.es/api/og/bilbao.png?type=integral&price=12000`

**Archivos a modificar:**
1. `public/images/og/` — copiar/crear imágenes estáticas
2. `src/layouts/CalculadoraLayout.astro` — aceptar `ogImage` y `ogImageAlt` props
3. Todas las calculadoras específicas (`src/pages/calculadora/*.astro`)
4. Todas las calculadoras Donostia (`src/pages/donostia/calculadora/*.astro`)
5. Todas las calculadoras Vitoria (`src/pages/vitoria/calculadora/*.astro`)
6. `src/pages/barrios/reforma-*.astro` — fix referencia a `bilbao-og.jpg` (crear imagen o cambiar path)

---

## 3. Recomendación hreflang

### Estructura hreflang para las 3 ciudades

Las páginas de cada ciudad son fundamentalmente el mismo contenido en español, adaptado por ciudad. La estructura correcta:

```html
<!-- Página principal de cada ciudad -->
<link rel="alternate" hreflang="es-ES" href="https://www.bilbaoreforma.es/">
<link rel="alternate" hreflang="x-default" href="https://www.bilbaoreforma.es/">

<!-- Página Bilbao -->
<link rel="alternate" hreflang="es-ES" href="https://www.bilbaoreforma.es/">

<!-- Página Donostia -->
<link rel="alternate" hreflang="es-ES" href="https://www.bilbaoreforma.es/donostia/">

<!-- Página Vitoria -->
<link rel="alternate" hreflang="es-ES" href="https://www.bilbaoreforma.es/vitoria/">

<!-- Versión vasca (x-default + eu-ES si se traduce) -->
<link rel="alternate" hreflang="x-default" href="https://www.bilbaoreforma.es/">
<link rel="alternate" hreflang="eu-ES" href="https://www.bilbaoreforma.es/eu/">
```

Dado que NO hay versiones en euskera actualmente, la estructura sería:

**Página principal (`/`):**
```html
<link rel="alternate" hreflang="x-default" href="https://www.bilbaoreforma.es/">
<link rel="alternate" hreflang="es-ES" href="https://www.bilbaoreforma.es/">
```

**Página Bilbao (`/calculadora/`, `/calculadora/bano-bilbao.html`, etc.):**
```html
<link rel="alternate" hreflang="es-ES" href="https://www.bilbaoreforma.es/calculadora/">
```

**Página Donostia (`/donostia/`, `/donostia/calculadora/`, etc.):**
```html
<link rel="alternate" hreflang="es-ES" href="https://www.bilbaoreforma.es/donostia/">
```

**Página Vitoria (`/vitoria/`, `/vitoria/calculadora/`, etc.):**
```html
<link rel="alternate" hreflang="es-ES" href="https://www.bilbaoreforma.es/vitoria/">
```

### Implementación

El mejor punto de implementación es `BaseLayout.astro`, añadiendo props de `hreflangs`:

```astro
// Props añadidas a BaseLayout.astro:
hreflangs?: Array<{ hreflang: string; href: string }>

// En el <head>:
{hreflangs.map(({ hreflang, href }) => (
  <link rel="alternate" hreflang={hreflang} href={href} />
))}
```

Luego cada layout que extiende `BaseLayout` (CityLayout, CalculadoraLayout) pasa los hreflangs correspondientes.

**Archivos a modificar:**
1. `src/layouts/BaseLayout.astro` — aceptar y renderizar array `hreflangs`
2. `src/layouts/CityLayout.astro` — calcular y pasar hreflangs para donostia/vitoria
3. `src/layouts/CalculadoraLayout.astro` — pasar hreflangs hacia `BaseLayout`
4. `src/pages/index.astro` — pasar hreflangs x-default + es-ES
5. Opcionalmente: `src/pages/barrios/reforma-*.astro` — hreflang Bilbao

---

## 4. Prioridad

### 🔴 Alta (afecta SEO inmediatamente)
1. **Copiar `home-og.jpg` y `blog-og.jpg` a `public/images/og/`** — actualmente son 404 en producción
2. **Crear `bilbao-og.jpg`, `donostia-og.jpg`, `vitoria-og.jpg`** — referenciadas pero no existen
3. **Fix hreflang básico** — al menos `x-default` + `es-ES` en la home

### 🟡 Media (mejora SEO compartido)
4. **Añadir og:image a todas las páginas de calculadora** vía `CalculadoraLayout`
5. **Implementar hreflang por ciudad** en `CityLayout` y `CalculadoraLayout`

### 🟢 Baja (optimización)
6. **og:image dinámico por tipo de reforma** (API endpoint con texto)
7. **Versión en euskera + hreflang eu-ES**

---

## Resumen de archivos a tocar

| Archivo | Cambio |
|---|---|
| `public/images/og/home-og.jpg` | Copiar desde `images/og/home-og.jpg` |
| `public/images/og/blog-og.jpg` | Copiar desde `images/og/blog-og.jpg` |
| `public/images/og/bilbao-og.jpg` | Crear (actualmente referenciado pero no existe) |
| `public/images/og/donostia-og.jpg` | Crear |
| `public/images/og/vitoria-og.jpg` | Crear |
| `src/layouts/BaseLayout.astro` | Añadir soporte props `hreflangs` |
| `src/layouts/CalculadoraLayout.astro` | Aceptar `ogImage`, `ogImageAlt`, `hreflangs` y pasarlos |
| `src/layouts/CityLayout.astro` | Calcular y pasar `hreflangs` |
| `src/pages/index.astro` | Pasar `hreflangs` |
| `src/pages/calculadora/*.astro` | Pasar `ogImage` específico |
| `src/pages/donostia/calculadora/*.astro` | Pasar `ogImage` específico |
| `src/pages/vitoria/calculadora/*.astro` | Pasar `ogImage` específico |
| `src/pages/barrios/reforma-*.astro` | Fix `bilbao-og.jpg` (crear imagen o cambiar referencia) |
