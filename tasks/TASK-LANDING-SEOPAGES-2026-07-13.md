# Task: Landing Pages SEO — 5 Calculators Bilbao

## Objetivo
Crear 5 landing pages SEO para Bilbao, una por cada tipo de Calculator. Cada landing page tiene:
- `<h1>` keyword-matched
- Calculator embebida
- Guía de precios local (+200 palabras originales, NO copiadas de blog)
- FAQ con schema markup
- CTA empresas
- Cross-links a las otras 4 calculators

## URLs a crear
| Archivo | URL producción |
|---------|---------------|
| `src/pages/presupuesto-reforma-integral-bilbao.astro` | `/presupuesto-reforma-integral-bilbao.html` |
| `src/pages/presupuesto-reforma-bano-bilbao.astro` | `/presupuesto-reforma-bano-bilbao.html` |
| `src/pages/presupuesto-reforma-cocina-bilbao.astro` | `/presupuesto-reforma-cocina-bilbao.html` |
| `src/pages/presupuesto-pintura-piso-bilbao.astro` | `/presupuesto-pintura-piso-bilbao.html` |
| `src/pages/presupuesto-cambio-suelo-bilbao.astro` | `/presupuesto-cambio-suelo-bilbao.html` |

## Arquitectura de cada landing page

### Estructura HTML
```
<CalculadoraLayout
  title="Presupuesto Reforma Integral Bilbao 2026 | Desde 700€/m²"
  description="..."
  canonical="https://www.bilbaoreforma.es/presupuesto-reforma-integral-bilbao.html"
>
  <!-- Breadcrumb -->
  <nav class="breadcrumb-landing">...</nav>

  <!-- Hero SEO -->
  <header class="landing-hero">
    <h1>Presupuesto Reforma Integral Bilbao 2026 — Desde 700€/m²</h1>
    <p>正文 introductorio con keywords...</p>
  </header>

  <!-- Calculator embebida -->
  <Calculator city="bilbao" calculatorType="integral" />

  <!-- Guía de precios local (contenido ORIGINAL) -->
  <section class="landing-guide">
    <h2>¿Cuánto cuesta una reforma integral en Bilbao?</h2>
    <p>正文...</p>
    <table class="price-table">...</table>
    <h3>Factores que afectan al precio</h3>
    <ul>...</ul>
  </section>

  <!-- FAQ con Schema -->
  <section class="landing-faq" itemscope itemtype="https://schema.org/FAQPage">
    <h2>Preguntas frecuentes</h2>
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <h3 itemprop="name">...</h3>
      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p itemprop="text">...</p>
      </div>
    </div>
  </section>

  <!-- CTA empresas -->
  <section class="landing-cta">...</section>

  <!-- Cross-links a otras calculators -->
  <nav class="landing-related">...</nav>
</CalculadoraLayout>
```

## Contenido específico por tipo

### 1. Reforma Integral
- **Keywords:** presupuesto reforma integral bilbao, precio reforma integral piso bilbao
- **Title:** Presupuesto Reforma Integral Bilbao 2026 | Desde 700€/m²
- **Guía:** Explicar rangos por m², factores (antigüedad edificio, permisos, acabados), comparativa Bilbao vs España
- **FAQ:** ¿cuánto tarda una reforma integral? ¿necesito licencia? ¿puedo vivir en el piso?

### 2. Reforma de Baño
- **Keywords:** presupuesto reforma baño bilbao, precio reforma baño bilbao
- **Title:** Presupuesto Reforma Baño Bilbao 2026 | Desde 2.500€
- **Guía:** Desglose por partidas (sanitarios, alicatado, fontanería, electricidad), baño completo vs parcial
- **FAQ:** ¿cuánto tarda reforma baño? ¿cambio bañera por ducha?

### 3. Reforma de Cocina
- **Keywords:** presupuesto reforma cocina bilbao, precio reforma cocina bilbao
- **Title:** Presupuesto Reforma Cocina Bilbao 2026 | Desde 5.000€
- **Guía:** Comparativa cocina abierta vs cerrada, encimeras, electrodomésticos, permisos
- **FAQ:** ¿cuánto cuesta mudar cocina? ¿necesito licencia?

### 4. Pintura
- **Keywords:** presupuesto pintura piso bilbao, precio pintar piso bilbao
- **Title:** Presupuesto Pintura Piso Bilbao 2026 | Desde 8€/m²
- **Guía:** Alisado de paredes vs temple, alturas, calidades de pintura, exteriores
- **FAQ:** ¿cuántas manos de pintura? ¿cuánto tarda pintar un piso?

### 5. Cambio de Suelo
- **Keywords:** presupuesto cambio suelo bilbao, precio cambiar suelo piso bilbao
- **Title:** Presupuesto Cambio de Suelo Bilbao 2026 | Desde 25€/m²
- **Guía:** Tipos de suelo (parqué, porcelánico, vinilo), retirada del anterior, suelo radiante
- **FAQ:** ¿cuánto tarda cambiar suelo? ¿parqué o porcelánico?

## Estilos CSS
- Añadir a `src/styles/components.css`:
  - `.breadcrumb-landing` — max-width 1100px, padding 1rem 1.5rem
  - `.landing-hero` — text-align center, padding 3rem 1.5rem, background crema
  - `.landing-hero h1` — Playfair, clamp(1.75rem, 4vw, 2.5rem), color grafito
  - `.landing-hero p` — max-width 640px, margin 1rem auto, color gris
  - `.landing-guide` — max-width 800px, margin 0 auto, padding 2rem 1.5rem
  - `.landing-guide h2` — Playfair, 1.75rem
  - `.landing-guide table.price-table` — ya existe en components.css
  - `.landing-faq` — max-width 800px, margin 0 auto, padding 2rem 1.5rem
  - `.landing-cta` — background terracota gradient, padding 3rem, text-align center
  - `.landing-related` — max-width 1100px, margin 0 auto, padding 2rem 1.5rem
  - Media query mobile: todos los max-width pasan a 100%, padding se reducen

## Vercel.json — rewrites
Añadir 5 rewrites nuevas (mantener las existentes):
```json
{ "src": "/presupuesto-reforma-integral-bilbao", "dest": "/presupuesto-reforma-integral-bilbao.html" },
{ "src": "/presupuesto-reforma-bano-bilbao", "dest": "/presupuesto-reforma-bano-bilbao.html" },
{ "src": "/presupuesto-reforma-cocina-bilbao", "dest": "/presupuesto-reforma-cocina-bilbao.html" },
{ "src": "/presupuesto-pintura-piso-bilbao", "dest": "/presupuesto-pintura-piso-bilbao.html" },
{ "src": "/presupuesto-cambio-suelo-bilbao", "dest": "/presupuesto-cambio-suelo-bilbao.html" }
```

## QA requirements
1. `npm run build` verde (0 errores, 0 warnings)
2. Build output: +5 páginas nuevas
3. Cada page compila sin errores Astro
4. Canonical y title únicos por página

## NO hacer
- No modificar calculator components (Calculator.astro, StepFinal.astro)
- No cambiar las calculator pages existentes en /calculadora/
- No cambiar vercel.json existente (solo añadir rewrites)
- No aplicar cambios en otros proyectos
