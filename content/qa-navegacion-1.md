## QA Report — Cambios del Blog

### blog/index.html
✅ Filtros implementados
✅ data-category en cards
✅ CSS añadido
✅ JS del filtro añadido

### Artículos revisados (5)

| Archivo | Sidebar contextual | In-content CTAs | CSS in-content | CTAs calculadora |
|---------|-------------------|-----------------|----------------|-----------------|
| reforma-bano-bilbao.html | ✅ | ✅ | ✅ | ✅ |
| reforma-cocina-bilbao.html | ✅ | ✅ | ✅ | ✅ |
| cambiar-suelo-bilbao.html | ✅ | ✅ | ✅ | ✅ |
| empresas-reformas-bilbao.html | ✅ | ✅ | ✅ | ✅ |
| precio-reforma-integral-bilbao.html | ✅ | ✅ | ✅ | ✅ |

### Problemas encontrados

Ninguno. Todos los elementos verificados están correctamente implementados:

- **blog/index.html**: Filtros por categoría (Todos, Baño, Cocina, Suelo, Integral, Calefacción, Legal, Empresas) presentes y funcionales. Todas las cards tienen `data-category`. CSS y JS del filtro añadidos.

- **reforma-bano-bilbao.html**: Sidebar con 3 artículos de categoría Baño (verificados existentes). 2 bloques `.in-content-cta` dentro del contenido (uno tras el primer párrafo introductorio, otro dentro de la sección FAQ). CTA final hacia `../calculadora/bano-bilbao.html`. CSS in-content presente.

- **reforma-cocina-bilbao.html**: Sidebar con 3 artículos de categoría Cocina (verificados existentes). 2 bloques `.in-content-cta` dentro del contenido (tras párrafo introductorio y tras sección "Errores Comunes"). CTA hacia `../calculadora/index.html`. CSS in-content presente.

- **cambiar-suelo-bilbao.html**: Sidebar con 2 artículos de categoría Suelo (verificados existentes). 2 bloques `.in-content-cta` dentro del contenido (tras introducción y tras sección FAQ). CTA hacia `../calculadora/index.html`. CSS in-content presente.

- **empresas-reformas-bilbao.html**: Sidebar con 1 artículo de categoría Empresas (verificado existente). 2 bloques `.in-content-cta` dentro del contenido (tras introducción y dentro de la sección FAQ). CTA hacia `../calculadora/index.html`. CSS in-content presente.

- **precio-reforma-integral-bilbao.html**: Sidebar con 4 artículos de categoría Integral (verificados existentes). 2 bloques `.in-content-cta` dentro del contenido (tras introducción y tras sección FAQ). CTA hacia `../calculadora/index.html`. CSS in-content presente.

**Nota menor (no bloqueante):** Los artículos de Cocina, Suelo, Empresas e Integral enlazan a `../calculadora/index.html` (calculadora general) en lugar de a una calculadora específica de categoría. Esto es aceptable ya que la calculadora general cubre todos los tipos de reforma. El artículo de Baño sí enlaza directamente a `../calculadora/bano-bilbao.html` (calculadora específica de baño).

---

*QA realizado: 2026-06-15*
