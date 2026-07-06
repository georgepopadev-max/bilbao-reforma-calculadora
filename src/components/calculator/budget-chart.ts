/**
 * Budget Doughnut Chart — Vanilla SVG generator
 * No Chart.js dependency.
 * 2026-07-06: responsive sizing, tooltip clamped to container.
 */

export interface BreakdownItem {
  label: string;
  value: number;
  color: string;
  /** Optional absolute amount (EUR) — shown next to the percentage. */
  amount?: number;
}

const eurFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

function formatEUR(n: number): string {
  return eurFormatter.format(n);
}

/**
 * Generate a responsive donut SVG + legend HTML string.
 *
 * Layout:
 *   Mobile (<640px)  — stacked: donut on top, legend below
 *   Tablet (≥640px) — side-by-side: donut left, legend right
 *   Wide   (≥1024px)— side-by-side with larger donut
 *
 * Tooltip is absolutely positioned inside `.budget-chart-svg` and clamped
 * so it never overflows the container.
 */
export function generateDoughnutSVG(
  breakdown: BreakdownItem[],
  size: number = 220
): string {
  const total = breakdown.reduce((sum, item) => sum + item.value, 0);
  if (total === 0 || breakdown.length === 0) return '';

  const strokeWidth = Math.round(size * 0.09); // proportional stroke
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const summaryText = breakdown
    .map(item => `${item.label}: ${Math.round((item.value / total) * 100)}%`)
    .join(', ');

  // Build SVG arcs
  let offset = 0;
  let paths = '';

  for (const item of breakdown) {
    const fraction = item.value / total;
    const dashLength = circumference * fraction;
    const dashGap   = circumference - dashLength;
    const pct       = Math.round(fraction * 100);
    const tooltipText =
      `${item.label}: ${pct}%` +
      (typeof item.amount === 'number' ? ` (${formatEUR(item.amount)})` : '');

    paths += `
      <circle
        cx="${center}"
        cy="${center}"
        r="${radius}"
        fill="transparent"
        stroke="${item.color}"
        stroke-width="${strokeWidth}"
        stroke-dasharray="0 ${circumference}"
        stroke-dashoffset="${-offset}"
        transform="rotate(-90 ${center} ${center})"
        class="budget-chart-segment"
        data-tooltip="${tooltipText}"
        data-pct="${pct}"
        data-label="${item.label}"
      >
        <title>${tooltipText}</title>
        <animate
          attributeName="stroke-dasharray"
          from="0 ${circumference}"
          to="${dashLength} ${dashGap}"
          dur="0.9s"
          fill="freeze"
          calcMode="spline"
          keySplines="0.25 0.1 0.25 1"
        />
      </circle>`;

    offset += dashLength;
  }

  // Build legend items
  let legend = '';
  for (const item of breakdown) {
    const fraction = item.value / total;
    const pct = Math.round(fraction * 100);
    const amountLabel =
      typeof item.amount === 'number'
        ? `<span class="budget-legend-amount">${formatEUR(item.amount)}</span>`
        : '';

    legend += `
      <div class="budget-legend-item">
        <span class="budget-legend-dot" style="background:${item.color}"></span>
        <span class="budget-legend-label">${item.label}</span>
        <span class="budget-legend-pct">${pct}%</span>
        ${amountLabel}
      </div>`;
  }

  // Responsive SVG size classes for container breakpoints
  const svgW    = Math.round(size * 0.58); // donut takes ~58% of container on desktop
  const svgSize = size;

  return `
<div class="budget-chart" role="img" aria-label="Desglose del presupuesto: ${summaryText}">
  <div class="budget-chart-svg" style="width:${svgSize}px;max-width:100%;flex-shrink:0;">
    <svg
      width="${svgSize}"
      height="${svgSize}"
      viewBox="0 0 ${svgSize} ${svgSize}"
      aria-hidden="true"
      style="display:block;width:100%;height:auto;overflow:visible;"
    >
      <title>Desglose del presupuesto por categoria</title>
      <!-- Background ring -->
      <circle
        cx="${center}"
        cy="${center}"
        r="${radius}"
        fill="transparent"
        stroke="var(--color-crema, #FAF7F2)"
        stroke-width="${strokeWidth}"
      />
      ${paths}
    </svg>
    <!-- Center text (absolute, centered in SVG) -->
    <div class="budget-chart-center">
      <span class="budget-chart-label">Total</span>
      <span class="budget-chart-total" data-budget-total>—</span>
    </div>
    <!-- Tooltip (clamped to container) -->
    <div class="budget-chart-tooltip" aria-hidden="true"></div>
  </div>
  <div class="budget-legend" role="list">
    ${legend}
  </div>
</div>`;
}
