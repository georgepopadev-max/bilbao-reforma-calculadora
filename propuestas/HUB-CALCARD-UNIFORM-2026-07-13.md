# BRIEF: Unificar Hubs Donostia y Vitoria con Calc-Cards estilo Bilbao

## Problema actual
- Bilbao hub: 5 calc-cards premium con iconos SVG, descripciones, precios por tipo → bien
- Donostia hub: wizard genérico de 6 pasos inline + 3 CTA cards feas con `?type=bano` (URLs inexistentes)
- Vitoria hub: mismo problema

## Solución
Reemplazar TODO el contenido del hub (header + CTA cards + wizard) en donostia y vitoria por el MISMO grid de calc-cards que tiene Bilbao, adaptado a:
- URLs de las calculadoras específicas Donostia/Vitoria
- Precios regionales (Donostia +10%, Vitoria -10%)

## Archivos a modificar
1. `src/pages/donostia/calculadora/index.astro` — reemplazar TODO el contenido por calc-cards
2. `src/pages/vitoria/calculadora/index.astro` — mismo cambio

## Contenido exacto a poner en cada hub

### Donostia — Calc-Cards Grid
Reemplazar TODO desde línea 14 (`<CalculadoraLayout...`) hasta la línea antes de `</CalculadoraLayout>` o del script, por:

```
<!-- Header editorial -->
<div class="calculator-intro-editorial" style="max-width:800px;margin:2rem auto;padding:0 1.5rem;text-align:center;">
  <h1>Calculadora de Reformas en Donostia 2026</h1>
  <p>Obtén un <strong>presupuesto orientativo para tu reforma en Donostia/San Sebastián</strong> en menos de 2 minutos. Datos basados en precios reales de empresas de reformas en Gipuzkoa, actualizados 2026.</p>
</div>

<!-- Calc-cards grid — mismo estilo que Bilbao -->
<div class="calc-cards-grid" style="max-width:1100px;margin:0 auto;padding:0 1.5rem 4rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.25rem;">

  <!-- Reforma Integral -->
  <a href="/donostia/calculadora/integral-donostia.html" class="calc-card calc-card-integral">
    <div class="calc-card-icon" aria-hidden="true"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
    <h2 class="calc-card-title">Reforma Integral</h2>
    <p class="calc-card-desc">Renovación completa de vivienda o local. Incluye albañilería, fontanería, electricidad, suelos y acabados.</p>
    <span class="calc-card-price">desde <strong>780 €/m²</strong></span>
    <span class="calc-card-cta">Calcular →</span>
  </a>

  <!-- Reforma de Baño -->
  <a href="/donostia/calculadora/bano-donostia.html" class="calc-card calc-card-bano">
    <div class="calc-card-icon" aria-hidden="true"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h11"/><path d="M12 6h0"/><path d="M9 17v-2a2 2 0 0 1 2-2h2"/></svg></div>
    <h2 class="calc-card-title">Reforma de Baño</h2>
    <p class="calc-card-desc">Sanitarios, alicatado, fontanería y electricidad del baño. Incluye instalación de ducha o bañera.</p>
    <span class="calc-card-price">desde <strong>2.750 €</strong></span>
    <span class="calc-card-cta">Calcular →</span>
  </a>

  <!-- Reforma de Cocina -->
  <a href="/donostia/calculadora/cocina-donostia.html" class="calc-card calc-card-cocina">
    <div class="calc-card-icon" aria-hidden="true"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg></div>
    <h2 class="calc-card-title">Reforma de Cocina</h2>
    <p class="calc-card-desc">Muebles, encimera, electrodomésticos, fontanería y albañilería. Distribución abierta o cerrada.</p>
    <span class="calc-card-price">desde <strong>5.500 €</strong></span>
    <span class="calc-card-cta">Calcular →</span>
  </a>

  <!-- Pintura -->
  <a href="/donostia/calculadora/pintura-donostia.html" class="calc-card calc-card-pintura">
    <div class="calc-card-icon" aria-hidden="true"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 11h2m-2 0v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6m14 0V7a2 2 0 0 0-2-2H9L7 3v2M5 11h14"/></svg></div>
    <h2 class="calc-card-title">Pintura</h2>
    <p class="calc-card-desc">Paredes, techos, puertas y ventanas. Pintura ecológica, gotelé eliminado o pre-tratado.</p>
    <span class="calc-card-price">desde <strong>9 €/m²</strong></span>
    <span class="calc-card-cta">Calcular →</span>
  </a>

  <!-- Cambio de Suelo -->
  <a href="/donostia/calculadora/suelo-donostia.html" class="calc-card calc-card-suelo">
    <div class="calc-card-icon" aria-hidden="true"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="18" width="20" height="4" rx="1"/><path d="M4 14V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/></svg></div>
    <h2 class="calc-card-title">Cambio de Suelo</h2>
    <p class="calc-card-desc">Parqué, porcelánico, vinilo o laminado. Incluye retirada del suelo anterior si es necesario.</p>
    <span class="calc-card-price">desde <strong>33 €/m²</strong></span>
    <span class="calc-card-cta">Calcular →</span>
  </a>
</div>

<!-- Help section — igual que Bilbao -->
<div style="max-width:800px;margin:0 auto 4rem;padding:0 1.5rem;text-align:center;">
  <h3 style="font-family:var(--font-playfair,serif);font-size:1.25rem;margin-bottom:1rem;">¿Necesitas ayuda para decidir?</h3>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;">
    <a href="tel:+34642147856" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background:var(--color-verde-montana,#4A6741);color:white;border-radius:8px;font-weight:600;text-decoration:none;">📞 Asesoramiento gratis</a>
    <a href="/donostia/blog/" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background:var(--color-terracota,#C45C3E);color:white;border-radius:8px;font-weight:600;text-decoration:none;">📖 Guías completas</a>
    <a href="/donostia/empresas/" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background:var(--color-grafito,#333);color:white;border-radius:8px;font-weight:600;text-decoration:none;">🏢 Empresas verificadas</a>
  </div>
</div>
```

### Vitoria — Calc-Cards Grid (mismo formato, precios -10%)
```
<!-- Header editorial -->
<div class="calculator-intro-editorial" style="max-width:800px;margin:2rem auto;padding:0 1.5rem;text-align:center;">
  <h1>Calculadora de Reformas en Vitoria-Gasteiz 2026</h1>
  <p>Obtén un <strong>presupuesto orientativo para tu reforma en Vitoria-Gasteiz y Álava</strong> en menos de 2 minutos. Datos basados en precios reales de empresas de reformas en Álava, actualizados 2026.</p>
</div>

<!-- Calc-cards grid -->
<div class="calc-cards-grid" style="max-width:1100px;margin:0 auto;padding:0 1.5rem 4rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.25rem;">
  [MISMA ESTRUCTURA PERO:]
  - href="/vitoria/calculadora/integral-vitoria.html" etc
  - precios: 630 €/m² (integral), 2.250 € (baño), 4.500 € (cocina), 7 €/m² (pintura), 27 €/m² (suelo)
  - tel: +34642147856
  - blog: /vitoria/blog/
  - empresas: /vitoria/empresas/
</div>
```

## IMPORTANTE
- NO copies el import de Calculator ni StepFinal si no se usan (eliminarlos si el wizard se va)
- El archivo debe quedar mínimo: solo el frontmatter con import de CalculadoraLayout + el HTML de las calc-cards
- Los estilos de `.calc-card`, `.calc-card-icon`, `.calc-card-title`, etc. ya existen en el CSS global (Calculator.astro tiene los estilos en `<style>`)
- Asegúrate que el `CalculadoraLayout` sigue envolviendo todo

## Criterios QA
- Build pasa (`npm run build` verde)
- Donostia hub muestra 5 calc-cards con iconos SVG y precios Donostia
- Vitoria hub muestra 5 calc-cards con iconos SVG y precios Vitoria
- Todos los enlaces apuntan a las calculadoras específicas de cada ciudad
- En producción se ve visualmente idéntico al hub de Bilbao
