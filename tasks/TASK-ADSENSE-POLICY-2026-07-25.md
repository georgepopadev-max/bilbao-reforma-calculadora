# TASK-ADSENSE-POLICY — Fix AdSense "Contenido de poco valor"

## Problema
Google AdSense marca bilbaoreforma.es con **"Contenido de poco valor"** (low-value content / thin content).
El sitio no puede mostrar anuncios hasta resolverlo.

## Archivos culprits identificados

### 🔴 P1 — HTML roto (crítico)
- `src/pages/blog/subvencion-cambio-calderas-vitoria/index.astro` — 66 líneas
  - divs sin cerrar (`class="faq-a"`, `class="hi"`, `class="warn"` → no existen en CSS)
  - Tabla duplicada al final del artículo
  - HTML malformado que rompe el parsing

### 🔴 P1 — Posts de subvenciones demasiado cortos (thin content)
Cada uno tiene solo ~65-66 líneas de contenido thin, sin estructura adecuada:

1. `src/pages/blog/subvencion-cambio-ventanas-bilbao/index.astro` — 66 líneas
2. `src/pages/blog/subvencion-eficiencia-energetica-bilbao/index.astro` — 65 líneas
3. `src/pages/blog/subvencion-fachadas-bilbao/index.astro` — 66 líneas
4. `src/pages/blog/subvencion-rehabilitacion-energetica-donostia/index.astro` — 66 líneas

### 🟡 P2 — Fichas de empresa esqueleto (5 líneas cada una)
- `src/pages/empresas/reformas-fernandez.astro` — 5 líneas
- `src/pages/empresas/eraber.astro` — 5 líneas
- `src/pages/empresas/vascol-reformas.astro` — 5 líneas
- `src/pages/empresas/rb-interiores.astro` — 5 líneas
- `src/pages/empresas/raquel-gonzalez-interiorismo.astro` — 5 líneas
- `src/pages/empresas/reformas-zunzunegui.astro` — 5 líneas

### 🟡 P2 — Índice blog (`src/pages/blog/index.astro` — 166 líneas)
- Solo lista de enlaces, sin contenido introductorio

### 🟡 P2 — Índice empresas (`src/pages/empresas/index.astro` — 38 líneas)
- Solo lista de enlaces, sin contenido introductorio

---

## Estándar de calidad AdSense

Google espera:
- **~300-500+ palabras de contenido único** por página
- Texto sustancial, no solo lists o tablas
- HTML válido (sin elementos rotos)
- Sin contenido duplicado intra-sitio

**Referencia de buena calidad**: `src/pages/blog/subvencion-accesibilidad-bilbao/index.astro` (189 líneas, bien estructurado, tiene FAQ, pasos, tablas, texto narrativo).

---

## Instrucciones

### BEFORE ANY WRITE: Mostrar el texto al usuario para approval

Para CADA archivo que vayas a modificar, haz esto:

1. Lee el archivo actual
2. Crea el contenido nuevo (o mejorado)
3. **Guarda el texto propuesto en un snippet** para que yo (el orchestrator) pueda mostrárselo a George
4. Envía un mensaje describiendo: qué archivo, qué cambia, y el texto clave (párrafos principales)

### Orden de trabajo

1. **Fix HTML roto** → `subvencion-cambio-calderas-vitoria` (más rápido, más dañino)
2. **Expandir posts cortos** → 4 posts de subvenciones → cada uno debe quedar con 200+ líneas de contenido real
3. **Enriquecer fichas de empresa** → 6 fichas → cada una con contenido único de 100+ líneas
4. **Mejorar índices** → blog/index + empresas/index con intros sustanciales

### Estructura para posts de subvenciones (objetivo)
- Header completo (breadcrumb, título, meta)
- Introducción de 2-3 párrafos (contexto + why)
- Sección "Cuantía de la ayuda" (tabla + explicación)
- Sección "Requisitos"
- Sección "Documentación necesaria"
- Sección "Plazos y convocatoria 2026"
- Sección "Paso a paso" (lista numerada)
- FAQ (5 preguntas mínimo)
- CTA al final
- Artículos relacionados
- Footer

### Estructura para fichas de empresa (objetivo)
- Header + breadcrumb
- Hero con descripción extendida (mínimo 150 palabras de texto único)
- Historia de la empresa / años de experiencia
- Detalle de servicios (cada uno con 1-2 frases de descripción)
- Zona de actuación (barrios, ciudades)
- CTA de contacto

---

## Reglas

- **No hacer commit/push automáticamente** — primero enseñar el texto a George
- **Antes de cada write**, enviar snippet del contenido nuevo al orchestrator (sesión `agent:main:...`)
- Si el contenido requiere contexto补充 (ej. datos reales de la empresa), usar datos realistas y honestos
- Mantener el estilo visual existente del sitio (colores terracota/verde, Playfair Display, etc.)
- No inventar testimonios ni datos falsos de rating — mantener los existentes
- Respetar los canonical URLs existentes

---

## Verificación final

Después defixear todos los archivos:
1. `npm run build` para verificar que el build sigue verde
2. Listar los archivos modificados con sus líneas nuevas

## Proyecto
`/home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora/`

## Canal de汇报
Enviar progreso al orchestrator (sesión principal). Textos nuevos → enviar snippet completo antes de write.
