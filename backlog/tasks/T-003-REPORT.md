# T-003 — Informe: H2 con keywords long-tail en blogs débiles

## Resumen

- **Blogs candidatos (<5 H2):** 8 blogs analizados
- **Blogs con <5 H2:** 1 blog (`reforma-bano-bilbao.astro` — 5 H2)
- **Blogs corregidos:** 1 blog
- **H2 añadidos:** 3

## Detalle de análisis

| Archivo | H2 iniciales | H2 finales | H2 añadidos |
|---|---|---|---|
| `reforma-bano-bilbao.astro` | 5 | 8 | 3 |
| `subvencion-accesibilidad-bilbao/index.astro` | 7 | — | 0 (ya OK) |
| `subvencion-accesibilidad-donostia/index.astro` | 7 | — | 0 (ya OK) |
| `subvencion-cambio-calderas-vitoria/index.astro` | 7 | — | 0 (ya OK) |
| `subvencion-cambio-ventanas-bilbao/index.astro` | 7 | — | 0 (ya OK) |
| `subvencion-eficiencia-energetica-bilbao/index.astro` | 7 | — | 0 (ya OK) |
| `subvencion-fachadas-bilbao/index.astro` | 7 | — | 0 (ya OK) |
| `subvencion-rehabilitacion-energetica-donostia/index.astro` | 7 | — | 0 (ya OK) |

> Los blogs de subvenciones comparten estructura de hub (7 H2) y no requieren cambios.

## H2 añadidos en `reforma-bano-bilbao.astro`

### H2 #1 — Errores comunes en reformas de baño en Bilbao que disparan el presupuesto
**Keyword long-tail:** errores reforma baño Bilbao que disparan presupuesto
**Descripción:** 3 párrafos sobre errores típicos: no revisar tuberías antes de empezar, no definir alcance preciso, no contrastar precios de materiales, y no contratar licencia cuando corresponde. Añade valor real cubriendo un tema que preocupa a propietarios.

### H2 #2 — ¿Reforma de baño o cocina primero? Guía para decidir en tu piso de Bilbao
**Keyword long-tail:** reforma baño vs cocina qué primero Bilbao
**Descripción:** 4 párrafos con criterios prácticos para priorizar: primero baño si hay fontanería en mal estado, primero cocina si hay problemas de eficiencia energética. Incluye comparativa de impacto en valor de mercado.

### H2 #3 — Empresas de reformas de baño en Bilbao: cómo elegir y qué evitar
**Keyword long-tail:** empresas reformas baño Bilbao recomendaciones
**Descripción:** 4 párrafos con filtros de selección: documentación obligatoria, cómo evaluar presupuestos (desconfiar de precios muy bajos), pedir referencias y visitar obras anteriores, y necesidad de contrato escrito.

## Validación

- [x] Build verde: `npm run build` → 144 páginas, 0 errores
- [x] Contenido 100% español
- [x] Sin errores ortográficos
- [x] Keywords long-tail naturales, no forzadas
- [x] Tono coherente con el blog
- [x] Sin cambios en título, meta description ni estructura existente
