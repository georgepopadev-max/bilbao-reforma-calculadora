# Landing Pages SEO — Calculadoras Bilbao Largo Plazo

## Estrategia completa 2026

---

## 1. Keyword Research por Calculator

### Reforma Integral
| Keyword | Intención | Dificultad | Impacto |
|---------|-----------|------------|---------|
| presupuesto reforma integral bilbao | informational | media | 🔥🔥🔥 |
| precio reforma integral piso bilbao | informational | media | 🔥🔥🔥 |
| cuanto cuesta reforma integral bilbao | informational | baja | 🔥🔥 |
| reforma integral bilbao precio m2 | informational | baja | 🔥🔥 |
| presupuesto reforma completa bilbao | informational | baja | 🔥 |

### Reforma de Baño
| Keyword | Intención | Dificultad | Impacto |
|---------|-----------|------------|---------|
| presupuesto reforma baño bilbao | informational | media | 🔥🔥🔥 |
| precio reforma baño bilbao | informational | media | 🔥🔥🔥 |
| cuanto cuesta reformar baño bilbao | informational | baja | 🔥🔥 |
| reforma baño pisobilbao precio | informational | baja | 🔥🔥 |

### Reforma de Cocina
| Keyword | Intención | Dificultad | Impacto |
|---------|-----------|------------|---------|
| presupuesto reforma cocina bilbao | informational | media | 🔥🔥🔥 |
| precio reforma cocina bilbao | informational | media | 🔥🔥🔥 |
| cuanto cuesta reforma cocina bilbao | informational | baja | 🔥🔥 |

### Pintura
| Keyword | Intención | Dificultad | Impacto |
|---------|-----------|------------|---------|
| presupuesto pintura piso bilbao | informational | baja | 🔥🔥 |
| precio pintar piso bilbao | informational | baja | 🔥🔥 |
| pintura con alisado bilbao | informational | baja | 🔥 |

### Cambio de Suelo
| Keyword | Intención | Dificultad | Impacto |
|---------|-----------|------------|---------|
| presupuesto cambio suelo bilbao | informational | baja | 🔥🔥 |
| precio cambiar suelo piso bilbao | informational | baja | 🔥🔥 |
| suelo madera bilbao precio | informational | baja | 🔥 |

---

## 2. URLs propuestas (nuevas)

No reutilizamos las existentes (ya están embebidas en el flujo de wizard). Creamos landing pages nuevas con URLs keyword-driven:

| Tipo | URL propuesta | Keyword objetivo |
|------|---------------|-----------------|
| Integral | `/presupuesto-reforma-integral-bilbao.html` | presupuesto reforma integral bilbao |
| Baño | `/presupuesto-reforma-bano-bilbao.html` | presupuesto reforma baño bilbao |
| Cocina | `/presupuesto-reforma-cocina-bilbao.html` | presupuesto reforma cocina bilbao |
| Pintura | `/presupuesto-pintura-piso-bilbao.html` | presupuesto pintura piso bilbao |
| Suelo | `/presupuesto-cambio-suelo-bilbao.html` | presupuesto cambio suelo bilbao |

**Por qué URLs nuevas y no sobreescribir:**
- Las actuales (`/calculadora/integral-bilbao.html`) funcionan bien como destino del wizard
- Las landing pages nuevas capturan el tráfico SEO externo y redirigen a la calculator
- No cannibalizamos lo que ya indexa

---

## 3. Estructura de cada Landing Page

### Bloques de contenido (en orden)

**A) Hero compacto (h1 + subtítulo)**
```
<h1>Presupuesto Reforma Integral Bilbao 2026 — Desde 700€/m²</h1>
<p>Calcula el precio orientativo de tu reforma integral en Bilbao en menos de 2 minutos. Datos reales de empresas de reformas en Bilbao, actualizados 2026.</p>
```

**B) Calculator embebida** (misma component `Calculator.astro` que ahora)

**C) Guía de precios por m²** (+200 palabras)
- Tabla de precios por rango de tamaño
- Comparativa: acabado básico / medio / alto
- FAQ local con schema markup

**D) Comparativa de mercado**
- Rango de precios Bilbao vs media España
- Por qué sale más barato o más caro en Bilbao

**E) CTA final** → "Solicita 3 presupuestos a empresas verificadas"

**F) Cards internas** → enlace a las otras 4 calculators

---

## 4. Modelo de landing page ( Integral como referencia)

```
/presupuesto-reforma-integral-bilbao.html

<CalculadoraLayout
  title="Presupuesto Reforma Integral Bilbao 2026 | Desde 700€/m²"
  description="Calcula el presupuesto orientativo de tu reforma integral en Bilbao. Precio real desde 700€/m² según tamaño y acabados. Sin registro, en 2 minutos."
  canonical="https://www.bilbaoreforma.es/presupuesto-reforma-integral-bilbao.html"
>

<!-- Hero SEO -->
<section class="calc-landing-hero">
  <nav class="breadcrumb">...</nav>
  <h1>Presupuesto Reforma Integral Bilbao 2026 — Desde 700€/m²</h1>
  <p>Usa nuestra calculadora para obtener un presupuesto orientativo de reforma integral en Bilbao y Bizkaia. Datos basados en precios reales de empresas locales, actualizados 2026.</p>
</section>

<!-- Calculator -->
<Calculator city="bilbao" calculatorType="integral" />

<!-- SEO Content: Guía de precios -->
<section class="calc-landing-guide">
  <h2>¿Cuánto cuesta una reforma integral en Bilbao?</h2>
  <p>正文...</p>
  <table>...</table>
  <h3>Factores que afectan al precio</h3>
  <ul>...</ul>
</section>

<!-- FAQ con Schema -->
<section class="calc-landing-faq">
  <h2>Preguntas frecuentes sobre la reforma integral en Bilbao</h2>
  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">...</div>
</section>

<!-- CTA empresas -->
<section class="calc-landing-cta">...</section>

<!-- Cross-links a otras calculators -->
<nav class="calc-related">...</nav>
```

---

## 5. Estrategia de enlaces internos

```
Homepage →链接→ /presupuesto-reforma-integral-bilbao.html
                    ↓
          /presupuesto-reforma-bano-bilbao.html (cross-link)
          /presupuesto-reforma-cocina-bilbao.html (cross-link)
          /presupuesto-pintura-piso-bilbao.html (cross-link)
          /presupuesto-cambio-suelo-bilbao.html (cross-link)

Blog posts →链接→ Calculator específica relevante

Vitoria/Donostia →链接→ calculators vitoria/donostia (ya hecho)
```

---

## 6. Schema Markup por landing

- `FAQPage` schema en cada landing
- `HowTo` schema en Integral (pasos de reforma)
- `Product` + `Offer` en Baño y Cocina (rangos de precio)

---

## 7. Timeline estimado

| Fase | Tareas | Duración |
|------|--------|----------|
| Sprint 1 | Reforma Integral + Baño (2 landing pages) | 1 sesión agente |
| Sprint 2 | Cocina + Pintura + Suelo (3 landing pages) | 1 sesión agente |
| Sprint 3 | Homepage actualiza enlaces → 5 landing pages | 30 min manual |
| Sprint 4 | Blog posts enlazan a landing pages | 1 sesión agente |

**Total:** ~2-3 sesiones de agente + 1 sprint de QA

---

## 8. Impacto esperado

- Queries objetivo: `presupuesto reforma integral bilbao` (actualmente pos 67 homepage) → posición <20 con landing page
- `precio reforma baño bilbao` (actualmente no aparece) → posición <30
- CTR mejora al ser landing page con `<h1>` keyword-matched
- Autoridad de dominio crece con 5 páginas nuevas + cross-links

---

## 9. Riesgo y mitigación

**Riesgo:** Contenido duplicado entre landing page y calculator embebida
**Mitigación:** Calculator embebida usa el mismo componente, pero la landing page tiene contenido editorial ORIGINAL (guía de precios + FAQ) que no existe en ningún otro lugar

**Riesgo:** Las calculator pages existentes (`/calculadora/integral-bilbao.html`) cannibalizan
**Mitigación:** Canonical de landing apunta a landing, calculator actual sigue vigente para usuarios del wizard

---

## 10. Alternativa: Opción A + C en paralelo

Para no esperar 2-3 sprints, hacer primero Opción A (cards en homepage) mientras el agente trabaja en las landing pages. Ambos canales se alimentan.

---

## Desplegable (no aplicar aún — esperando aprobación)

Para iniciar el desarrollo de las 5 landing pages, necesitamos aprobación para lanzar 1 agente de desarrollo.

**Archivos a crear/modificar:**
- `src/pages/presupuesto-reforma-integral-bilbao.astro` (nuevo)
- `src/pages/presupuesto-reforma-bano-bilbao.astro` (nuevo)
- `src/pages/presupuesto-reforma-cocina-bilbao.astro` (nuevo)
- `src/pages/presupuesto-pintura-piso-bilbao.astro` (nuevo)
- `src/pages/presupuesto-cambio-suelo-bilbao.astro` (nuevo)
- `src/styles/components.css` (extender con estilos landing)
- `src/layouts/CalculadoraLayout.astro` (ajustar canonical)
- `vercel.json` (5 rewrites nuevas)
