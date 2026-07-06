# CONTEXTO — Bilbao Reforma Calculadora
# Versión: 2026-07-06

## Proyecto
BilbaoReforma.es — Calculadora de presupuestos de reformas para Bilbao, Donostia y Vitoria.

## Stack
Astro 4.16 + Tailwind 3.4 + TypeScript strict + jsPDF

## Archivos clave del flujo
- `src/components/calculator/StepFinal.astro` — Resultado compartido ( Bilbao 5 calculadoras)
- `src/components/calculator/budget-chart.ts` — Doughnut SVG
- `src/components/calculator/pdf-generator.ts` — Generador PDF
- `src/components/calculator/Calculator.astro` — Shell del wizard
- `src/pages/donostia/calculadora/index.astro` — Wizard Donostia (INDEPENDIENTE, no usa StepFinal)
- `src/pages/vitoria/calculadora/index.astro` — Wizard Vitoria (INDEPENDIENTE, no usa StepFinal)

## Arquitectura actual
- Bilbao: 5 páginas (bano, cocina, integral, pintura, suelo) → comparten StepFinal.astro
- Donostia + Vitoria: wizards propios con result step inline (NO comparten StepFinal)
- El doughnut SVG solo existe en StepFinal.astro (Bilbao)

## Problemas a resolver (TAREA-001)
1. Gráfica: posicionada en lateral, texto entrecortado, mal en mobile
2. PDF: textos mixtos (chino/inglés), layout descuidado
3. Unificación: Donostia y Vitoria no usan el doughnut ni StepFinal
4. Responsive: tiene que verse bien en 375px, 768px, 1024px, 1440px
5. Diseño: poco atractivo en paso final, diferencial vs competencia

## Prácticas
- Clean code, sin duplicación
- Componentes genéricos reutilizables
- Frontend = piel fina, sin lógica de negocio
- Mira CLAUDE-STANDARDS.md en la raíz del proyecto
