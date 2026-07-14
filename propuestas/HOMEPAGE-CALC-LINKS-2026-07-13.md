# Análisis: Calculator Pages Bilbao — Por qué no posicionan

## Situación actual

### URLs de Calculator Bilbao (existen ✅)
- `/calculadora/integral-bilbao.html`
- `/calculadora/bano-bilbao.html`
- `/calculadora/cocina-bilbao.html`
- `/calculadora/pintura-bilbao.html`
- `/calculadora/suelo-bilbao.html`
- `/calculadora/` (hub 5 cards)

### El problema: homepage para queries de Calculator
Del Search Console (últimos 7 días):
- Homepage (`/`) → 102 impresiones, posición 66.85, **0 clics** para queries como "presupuesto reforma bilbao"
- `/calculadora/` (hub Bilbao) → **NO aparece** en las 25 primeras queries
- `/donostia/calculadora/` → posición **6.78**, CTR **22.22%** ✅

## Causa raíz

El homepage **no enlaza directamente** a las Calculator pages individuales. El Hero solo va a `/calculadora/` (el hub). El `<h1>` del homepage es "Reformas en Bilbao | Presupuesto Online + Empresas Verificadas" — demasiado genérico, no contiene las keywords específicas de cada calculator.

## Por qué Donostia SÍ funciona
1. La página `/donostia/` tiene enlace directo al blog → el blog enlaza a calculators específicas
2. La calculator hub `/donostia/calculadora/` se indexó bien
3. Blog posts como "Reforma Cocina Donostia" → enlazan a `/donostia/calculadora/cocina-donostia.html`

## Solución propuesta

### Opción A: Añadir sección "Tipos de Calculadora" en Homepage (rápido, gratis)
Añadir 5 cards de Calculator directamente en el homepage de Bilbao, debajo del Hero, que enlacen a cada calculator page. Esto:
- Da a Google contexto de que el homepage tiene calculators específicas
- Crea un camino claro: búsqueda → homepage → calculator específica
- Reduce el "salto extra" que hace que el usuario se pierda

### Opción B: Crear landing pages SEO para cada Calculator (más efectivo)
Crear 5 páginas tipo:
- `/calculadora/reforma-integral-bilbao.html` (nueva URL keyword-driven)
- `/calculadora/presupuesto-reforma-bano-bilbao.html`
etc.

Cada una con:
- `<h1>` con la keyword exacta
- Texto introductorio de +200 palabras (con la keyword)
- Calculator embebida
- FAQ con schema markup
- Breadcrumb + link a la siguiente calculator

**Pero esto es más trabajo y ya existen las calculator pages** — la Opción A les da más contexto de links.

### Opción C: Mejorar los enlaces internos del blog
Los posts del blog de Bilbao enlazan a las calculators? Revisar `/blog/reformas-bilbao-precios.html` y otros — que enlacen a `/calculadora/integral-bilbao.html` y `/calculadora/bano-bilbao.html` con anchor text keywordado.

## Recomendación: Opción A + Opción C combinadas

**Inmediato (Opción A):**
- Añadir 5 cards de Calculator debajo del Hero en homepage
- Usar anchor text keywordado: "Calcular presupuesto Reforma Integral Bilbao →"

**Corto plazo (Opción C):**
- Revisar que los posts del blog enlacen a las calculators específicas

**No priorizariamos Opción B** — las calculator pages ya existen, solo les falta.link authority.
