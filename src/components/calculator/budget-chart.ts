/**
 * Budget Doughnut Chart — Vanilla SVG generator
 * No Chart.js dependency.
 */

export interface BreakdownItem {
  label: string;
  value: number;
  color: string;
}

export function generateDoughnutSVG(
  breakdown: BreakdownItem[],
  size: number = 200
): string {
  const total = breakdown.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return '';

  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let offset = 0;
  let paths = '';
  let legend = '';

  for (const item of breakdown) {
    const fraction = item.value / total;
    const dashLength = circumference * fraction;
    const dashGap = circumference - dashLength;

    paths += `
      <circle
        cx="${center}"
        cy="${center}"
        r="${radius}"
        fill="transparent"
        stroke="${item.color}"
        stroke-width="${strokeWidth}"
        stroke-dasharray="${dashLength} ${dashGap}"
        stroke-dashoffset="${-offset}"
        transform="rotate(-90 ${center} ${center})"
      />
    `;

    offset += dashLength;

    legend += `
      <div class="budget-legend-item">
        <span class="budget-legend-dot" style="background:${item.color}"></span>
        <span class="budget-legend-label">${item.label}</span>
        <span class="budget-legend-value">${Math.round(fraction * 100)}%</span>
      </div>
    `;
  }

  return `
    <div class="budget-chart">
      <div class="budget-chart-svg">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent" stroke="var(--color-crema)" stroke-width="${strokeWidth}" />
          ${paths}
        </svg>
        <div class="budget-chart-center">
          <span class="budget-chart-label">Total</span>
          <span class="budget-chart-total" data-budget-total>—</span>
        </div>
      </div>
      <div class="budget-legend">
        ${legend}
      </div>
    </div>
  `;
}
