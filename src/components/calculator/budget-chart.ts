/**
 * Budget Doughnut Chart — Vanilla SVG generator
 * No Chart.js dependency.
 */

export interface BreakdownItem {
  label: string;
  value: number;
  color: string;
  /** Optional absolute amount (€) — shown next to the percentage. */
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

export function generateDoughnutSVG(
  breakdown: BreakdownItem[],
  size: number = 200
): string {
  const total = breakdown.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return '';

  // Slimmer ring gives more air to small segments (was 28 → 24)
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Accessibility summary for screen readers
  const summaryText = breakdown
    .map(item => `${item.label}: ${Math.round((item.value / total) * 100)}%`)
    .join(', ');

  let offset = 0;
  let paths = '';
  let legend = '';

  for (const item of breakdown) {
    const fraction = item.value / total;
    const dashLength = circumference * fraction;
    const dashGap = circumference - dashLength;
    const pct = Math.round(fraction * 100);
    const tooltipText = `${item.label}: ${pct}%${typeof item.amount === 'number' ? ' (' + formatEUR(item.amount) + ')' : ''}`;

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
        <animate attributeName="stroke-dasharray" from="0 ${circumference}" to="${dashLength} ${dashGap}" dur="1s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" />
      </circle>
    `;

    offset += dashLength;

    const amountLabel =
      typeof item.amount === 'number'
        ? `<span class="budget-legend-amount">${formatEUR(item.amount)}</span>`
        : '';

    legend += `
      <div class="budget-legend-item">
        <span class="budget-legend-dot" style="background:${item.color}"></span>
        <span class="budget-legend-label">${item.label}</span>
        <span class="budget-legend-value">${Math.round(fraction * 100)}%</span>
        ${amountLabel}
      </div>
    `;
  }

  return `
    <div class="budget-chart" role="img" aria-label="Desglose del presupuesto: ${summaryText}">
      <div class="budget-chart-svg">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
          <title>Desglose del presupuesto por categoría</title>
          <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent" stroke="var(--color-crema)" stroke-width="${strokeWidth}" />
          ${paths}
        </svg>
        <div class="budget-chart-center">
          <span class="budget-chart-label">Total</span>
          <span class="budget-chart-total" data-budget-total>—</span>
        </div>
        <div class="budget-chart-tooltip" aria-hidden="true"></div>
      </div>
      <div class="budget-legend" role="list">
        ${legend}
      </div>
    </div>
  `;
}