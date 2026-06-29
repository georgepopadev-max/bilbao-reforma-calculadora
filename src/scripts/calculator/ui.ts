/**
 * Calculator UI — DOM manipulation, badges, validations
 * Part of src/scripts/calculator/ (A3 zone)
 */

import { CONFIG } from './config.js';
import { BARRIO_LABELS, presetBarrio } from './barrios.js';
import { formatCurrency } from './pricing.js';
import type { CalculationResult, CalculatorData, BreakdownItem } from './types.js';

// ============================================================
// DOM HELPERS
// ============================================================

export function query<T extends HTMLElement = HTMLElement>(
  selector: string,
  parent: Element | Document = document
): T | null {
  return parent.querySelector<T>(selector);
}

export function queryAll<T extends HTMLElement = HTMLElement>(
  selector: string,
  parent: Element | Document = document
): T[] {
  return Array.from(parent.querySelectorAll<T>(selector));
}

// ============================================================
// BADGES
// ============================================================

/**
 * Inject barrio preset badge into step 3 header.
 * Called during init when ?barrio= URL param is present.
 */
export function injectBarrioBadge(): void {
  if (!presetBarrio || !BARRIO_LABELS[presetBarrio]) return;

  const step3Header = query('#step3 .step-header');
  if (!step3Header) return;

  const badge = document.createElement('div');
  badge.className = 'barrio-preset-badge';
  badge.style.cssText =
    'display:inline-block;background:var(--color-verde-montana);' +
    'color:white;padding:0.25rem 0.75rem;border-radius:20px;' +
    'font-size:0.8125rem;font-weight:600;margin-bottom:0.75rem;';
  badge.textContent = 'Barrio: ' + BARRIO_LABELS[presetBarrio];
  step3Header.insertBefore(badge, step3Header.firstChild);
}

// ============================================================
// PROGRESS BAR
// ============================================================

export function updateProgressBar(currentStep: number, totalSteps: number): void {
  const fill = query('#progressBarFill');
  if (fill) {
    fill.style.width = ((currentStep / totalSteps) * 100) + '%';
  }

  queryAll('.progress-step').forEach((p) => {
    const s = parseInt(p.getAttribute('data-step') ?? '0', 10);
    p.classList.toggle('active', s === currentStep);
  });
}

// ============================================================
// WIZARD STEPS
// ============================================================

export function showStep(step: number, totalSteps: number): void {
  queryAll('.wizard-step').forEach((el) => {
    el.classList.remove('active');
    (el as HTMLElement).style.display = 'none';
  });

  const stepEl = query(`.wizard-step[data-step="${step}"]`);
  if (stepEl) {
    stepEl.classList.add('active');
    (stepEl as HTMLElement).style.display = 'block';
  }

  updateProgressBar(step, totalSteps);
}

// ============================================================
// RESULT DISPLAY
// ============================================================

export function updateResultDisplay(result: CalculationResult, data: CalculatorData): void {
  // Update price range
  const lowEl = query('.result-range-low');
  const highEl = query('.result-range-high');
  const titlePriceEl = query('.result-title-price');

  if (lowEl) lowEl.textContent = formatCurrency(result.low) + ' €';
  if (highEl) highEl.textContent = formatCurrency(result.high) + ' €';
  if (titlePriceEl) {
    titlePriceEl.textContent = formatCurrency(result.low) + ' € y ' + formatCurrency(result.high) + ' €';
  }

  // Update comparison
  const compValueEl = query('.result-comparison-value');
  if (compValueEl) compValueEl.textContent = result.avgPerSqm + ' €/m²';

  // Dynamic label
  const reformTypeLabel = data.reformScope
    ? getScopeData(data.reformScope).label.toLowerCase()
    : data.reformTypes.length === 1
    ? getReformTypeLabel(data.reformTypes[0]).toLowerCase()
    : 'múltiples estancias';

  const ageLabel = getAgeLabel(data.buildingAge);
  const comparisonLabelEl = query('.result-comparison-label');
  if (comparisonLabelEl) {
    comparisonLabelEl.textContent = `para ${reformTypeLabel} en edificio ${ageLabel}`;
  }

  // Update subtitle
  const subtitleEl = query('.result-subtitle');
  if (subtitleEl) {
    const typeLabel = data.reformScope
      ? getScopeData(data.reformScope).label
      : data.reformTypes.map((t) => getReformTypeLabel(t)).join(', ');
    subtitleEl.textContent = 'Estimación para un piso de ' + data.sqm + 'm² con ' + (typeLabel || 'reforma');
  }

  // Update breakdown bars
  updateBreakdownBars(result);
}

function getScopeData(scope: string): { label: string } {
  const scopes: Record<string, { label: string }> = {
    basic: { label: 'Reforma básica' },
    medium: { label: 'Reforma media' },
    integral: { label: 'Reforma integral' },
    luxury: { label: 'Reforma premium' },
  };
  return scopes[scope] ?? { label: scope };
}

function getReformTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    painting: 'Pintura',
    flooring: 'Suelo',
    bathroom: 'Baño completo',
    kitchen: 'Cocina',
  };
  return labels[type] ?? type;
}

function getAgeLabel(age: string): string {
  const labels: Record<string, string> = {
    new: '< 20 años',
    moderate: '20–40 años',
    old: '40–70 años',
    historic: '> 70 años',
  };
  return labels[age] ?? '';
}

export function updateBreakdownBars(result: CalculationResult): void {
  const container = query('#resultBreakdownBars');
  if (!container || !result.breakdown.length) return;

  const totalHigh = result.breakdown.reduce((sum, item) => sum + item.highTotal, 0);
  const chartData = result.breakdown.filter((item) => !item.item.includes('Imprevistos'));
  const colors = CONFIG.CHART_COLORS;

  let barsHTML = '';

  chartData.forEach((item, idx) => {
    const pct = totalHigh > 0 ? Math.round((item.highTotal / totalHigh) * 100) : 0;
    const itemAvg = Math.round((item.lowTotal + item.highTotal) / 2);
    const colorClass = ['bano', 'cocina', 'suelo', 'pintura', 'instalaciones', 'imprevistos'][idx % 6];

    barsHTML += '<div class="breakdown-bar">';
    barsHTML += '<div class="breakdown-bar-header">';
    barsHTML += `<span class="breakdown-bar-label">${item.item}</span>`;
    barsHTML += `<span class="breakdown-bar-value">${pct}% · ~${formatCurrency(itemAvg)} €</span>`;
    barsHTML += '</div>';
    barsHTML += '<div class="breakdown-bar-track">';
    barsHTML += `<div class="breakdown-bar-fill ${colorClass}" style="width:${pct}%"></div>`;
    barsHTML += '</div>';
    barsHTML += '</div>';
  });

  // Add contingency back if present
  const contingency = result.breakdown.find((item) => item.item.includes('Imprevistos'));
  if (contingency) {
    const pct = Math.round((contingency.highTotal / totalHigh) * 100);
    const itemAvg = Math.round((contingency.lowTotal + contingency.highTotal) / 2);
    barsHTML += '<div class="breakdown-bar">';
    barsHTML += '<div class="breakdown-bar-header">';
    barsHTML += `<span class="breakdown-bar-label">Imprevistos (15%)</span>`;
    barsHTML += `<span class="breakdown-bar-value">${pct}% · ~${formatCurrency(itemAvg)} €</span>`;
    barsHTML += '</div>';
    barsHTML += '<div class="breakdown-bar-track">';
    barsHTML += `<div class="breakdown-bar-fill imprevistos" style="width:${pct}%"></div>`;
    barsHTML += '</div>';
    barsHTML += '</div>';
  }

  container.innerHTML = barsHTML;
}

// ============================================================
// NAVIGATION STATE
// ============================================================

export function updateNavigationState(
  hasReformScope: boolean,
  hasReformTypes: boolean
): void {
  const nextBtn = query('#btn-next');
  if (nextBtn) {
    nextBtn.toggleAttribute('disabled', !hasReformScope && !hasReformTypes);
  }
}

// ============================================================
// FORM HELPERS
// ============================================================

export function updateSqmDisplay(sqm: number): void {
  const display = query<HTMLElement>('#metersDisplayValue');
  const input = query<HTMLInputElement>('#metersInput');
  const slider = query<HTMLInputElement>('#metersSlider');

  if (display) display.textContent = String(sqm);
  if (input) input.value = String(sqm);
  if (slider) slider.value = String(sqm);
}

export function selectAgeOption(age: string): void {
  const container = query('#ageOptions');
  if (!container) return;

  container.querySelectorAll('.age-option').forEach((el) => {
    const elAge = el.getAttribute('data-age');
    const isSelected = elAge === age;
    el.classList.toggle('selected', isSelected);
    el.setAttribute('aria-pressed', String(isSelected));
  });
}

export function selectQualityOption(quality: string): void {
  const container = query('#qualityOptions');
  if (!container) return;

  container.querySelectorAll('.quality-card, .age-option').forEach((el) => {
    const elQuality = el.getAttribute('data-quality') || el.getAttribute('data-value');
    const isSelected = elQuality === quality;
    el.classList.toggle('selected', isSelected);
    el.setAttribute('aria-pressed', String(isSelected));
  });
}

export function toggleExtraItem(key: string, checked: boolean): void {
  const item = query(`[data-extra="${key}"]`);
  if (item) {
    item.classList.toggle('selected', checked);
    item.setAttribute('aria-pressed', String(checked));
  }
}

export function toggleReformTypeCard(type: string, selected: boolean): void {
  // Handle both data-reform (static HTML) and data-type (dynamic)
  queryAll(`[data-type="${type}"], [data-reform="${type}"]`).forEach((el) => {
    el.classList.toggle('selected', selected);
    el.setAttribute('aria-pressed', String(selected));
  });
  // Deselect scope cards
  queryAll('[data-scope]').forEach((el) => {
    el.classList.remove('selected');
    el.setAttribute('aria-pressed', 'false');
  });
}

export function selectScopeCard(scope: string, selected: boolean): void {
  queryAll(`[data-scope="${scope}"]`).forEach((el) => {
    el.classList.toggle('selected', selected);
    el.setAttribute('aria-pressed', String(selected));
  });
  // Deselect type cards
  queryAll('.type-card[data-reform], [data-type]').forEach((el) => {
    el.classList.remove('selected');
    el.setAttribute('aria-pressed', 'false');
  });
}

// ============================================================
// CHART
// ============================================================

let _chartInstance: any = null;

export function updateChart(breakdown: BreakdownItem[]): void {
  const canvas = query<HTMLCanvasElement>('#breakdownChart');
  if (!canvas) return;

  if (_chartInstance) {
    _chartInstance.destroy();
    _chartInstance = null;
  }

  const chartData = breakdown.filter((item: BreakdownItem) => !item.item.includes('Imprevistos'));
  const total = chartData.reduce((sum: number, item: BreakdownItem) => sum + item.highTotal, 0);

  if (chartData.length === 0 || total === 0) return;

  const labels = chartData.map((item: BreakdownItem) => item.item);
  const values = chartData.map((item: BreakdownItem) => item.highTotal);
  const percentages = chartData.map((item: BreakdownItem) =>
    Math.round((item.highTotal / total) * 100)
  );

  const ChartClass = (window as any).Chart;
  if (!ChartClass) return;

  _chartInstance = new ChartClass(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: CONFIG.CHART_COLORS.slice(0, chartData.length),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: CONFIG.CHART_CUTOUT,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(context: any) {
              const idx = context.dataIndex;
              const pct = percentages[idx];
              const value = values[idx].toLocaleString('es-ES');
              return `${context.label}: ${value} € (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

// ============================================================
// PDF GENERATION
// ============================================================

export function generatePDF(result: CalculationResult, data: CalculatorData): void {
  if (!result) {
    alert('Calcula tu presupuesto primero.');
    return;
  }

  const { jsPDF } = window as any;
  if (!jsPDF) {
    alert('Error generando PDF. Inténtalo de nuevo.');
    return;
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Collect client name
  const nameInput = query<HTMLInputElement>('#leadName');
  const clientName = nameInput?.value?.trim() ?? '';

  const today = new Date();
  const dateStr = today.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const budgetNum =
    CONFIG.PDF_BUDGET_PREFIX +
    '-' +
    today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0') +
    '-' +
    String(Math.floor(Math.random() * 900) + 100);

  const qualityLabel = getQualityLabel(data.quality);
  const ageLabel = getAgeLabel(data.buildingAge);
  const reformLabel = data.reformScope
    ? getScopeData(data.reformScope).label
    : data.reformTypes.map((t) => getReformTypeLabel(t)).join(', ');

  const { TERRACOTA, DARK, GRAY, LIGHT_GRAY } = CONFIG.PDF_COLORS;
  const margin = 20;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Header
  doc.setFillColor(...TERRACOTA);
  doc.rect(margin, y, contentW, 2, 'F');

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...TERRACOTA);
  doc.text('Bilbao Reforma', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Presupuestos orientativos · Bilbao y provincia', margin, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text(budgetNum, pageW - margin, y, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text('Fecha: ' + dateStr, margin, y + 11);
  doc.text('Validez: ' + CONFIG.PDF_VALIDITY_DAYS + ' días', margin, y + 16);

  y += 22;

  // Title
  doc.setFont('helvetica', 'light');
  doc.setFontSize(20);
  doc.setTextColor(...TERRACOTA);
  doc.text('PRESUPUESTO DE REFORMA', pageW / 2, y, { align: 'center' });
  y += 14;

  // Meta grid
  const metaH = 28;
  const halfW = contentW / 2 - 4;

  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(margin, y, halfW, metaH, 2, 2, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(170, 170, 170);
  doc.text((clientName ? 'Cliente' : 'Datos del proyecto').toUpperCase(), margin + 5, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text(clientName || reformLabel, margin + 5, y + 14);
  if (clientName) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text('Proyecto: ' + reformLabel, margin + 5, y + 21);
  }

  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(margin + halfW + 8, y, halfW, metaH, 2, 2, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(170, 170, 170);
  doc.text('Datos del proyecto'.toUpperCase(), margin + halfW + 13, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...DARK);
  doc.text('Superficie: ' + data.sqm + ' m²', margin + halfW + 13, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.text('Calidad: ' + qualityLabel + '   Antigüedad: ' + ageLabel, margin + halfW + 13, y + 19);

  y += metaH + 10;

  // Table header
  const colPartida = margin;
  const colCantidad = margin + 72;
  const colEurUd = margin + 112;
  const colTotal = margin + 150;

  doc.setFillColor(...TERRACOTA);
  doc.rect(margin, y, contentW, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Partida', colPartida + 3, y + 5.5);
  doc.text('Cantidad', colCantidad + 3, y + 5.5);
  doc.text('€/ud', colEurUd + 3, y + 5.5);
  doc.text('Total', colTotal + 3, y + 5.5);
  y += 8;

  // Table body
  let subtotalLow = 0;
  let subtotalHigh = 0;

  result.breakdown.forEach((item, idx) => {
    const avgRate = Math.round((item.lowRate + item.highRate) / 2);
    const avgTotal = Math.round((item.lowTotal + item.highTotal) / 2);
    subtotalLow += item.lowTotal;
    subtotalHigh += item.highTotal;

    if (idx % 2 === 1) {
      doc.setFillColor(...LIGHT_GRAY);
      doc.rect(margin, y, contentW, 7, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    doc.text(item.item, colPartida + 3, y + 5);
    doc.setTextColor(...GRAY);
    doc.text(item.qty + ' ' + item.unit, colCantidad + 3, y + 5);
    doc.text(avgRate.toLocaleString('es-ES') + ' €', colEurUd + 3, y + 5);
    doc.setTextColor(...DARK);
    doc.text(avgTotal.toLocaleString('es-ES') + ' €', colTotal + 3, y + 5);

    y += 7;
  });

  // Totals
  y += 4;
  const totalsX = pageW - margin - 80;
  const totalsW = 80;

  const subtotal = Math.round((result.low + result.high) / 2);
  const iva = Math.round(subtotal * CONFIG.IVA_RATE);
  const total = subtotal + iva;

  const fmt = (n: number) => n.toLocaleString('es-ES') + ' €';

  const drawTotalsRow = (
    label: string,
    value: string,
    bg: readonly number[],
    fontSize: number,
    tc: readonly number[]
  ) => {
    doc.setFillColor(...bg);
    doc.rect(totalsX, y, totalsW, 7, 'F');
    doc.setFont('helvetica', fontSize === 11 ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(...tc);
    doc.text(label, totalsX + 4, y + 5);
    doc.setTextColor(...DARK);
    doc.text(value, totalsX + totalsW - 4, y + 5, { align: 'right' });
    y += 7;
  };

  drawTotalsRow('Subtotal (sin IVA)', fmt(subtotal), LIGHT_GRAY, 9, GRAY);
  drawTotalsRow('IVA (10%)', fmt(iva), LIGHT_GRAY, 9, GRAY);
  drawTotalsRow('TOTAL', fmt(total), TERRACOTA, 12, [255, 255, 255]);

  y += 8;

  // Note box
  doc.setFillColor(255, 248, 240);
  doc.rect(totalsX, y, totalsW, 20, 'F');
  doc.setDrawColor(...TERRACOTA);
  doc.setLineWidth(0.5);
  doc.line(totalsX, y, totalsX, y + 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...TERRACOTA);
  doc.text('Nota importante:', totalsX + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.setFontSize(7);
  const noteLines = doc.splitTextToSize(
    'Los precios indicados son orientativos y sin IVA. Este presupuesto tiene una horquilla de ±15% sobre la estimación final.',
    totalsW - 8
  );
  doc.text(noteLines, totalsX + 4, y + 10);

  y += 24;

  // Conditions
  const condY = y;
  const condItems = ['Precios/m² orientativos', 'Plazo a confirmar', 'Sin compromiso', 'Bilbao y provincia'];

  doc.setFontSize(8);
  let condX = margin;
  condItems.forEach((item) => {
    doc.setFillColor(244, 244, 244);
    const itemW = doc.getTextWidth(item) + 8;
    doc.roundedRect(condX, condY, itemW, 7, 1, 1, 'F');
    doc.setTextColor(...GRAY);
    doc.text(item, condX + 4, condY + 4.5);
    condX += itemW + 3;
  });

  y = condY + 14;

  // Footer
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text('bilbaoreforma.es · info@bilbaoreforma.es', pageW / 2, y, { align: 'center' });
  y += 3.5;
  doc.setFontSize(7);
  doc.text('Este documento es una estimación orientativa y no constituye una oferta contractual.', pageW / 2, y, { align: 'center' });
  y += 3.5;
  doc.text('Presupuesto generado automáticamente · ' + dateStr, pageW / 2, y, { align: 'center' });

  // Save
  doc.save('presupuesto-' + budgetNum + '.pdf');
}

function getQualityLabel(quality: string): string {
  const labels: Record<string, string> = {
    basic: 'Básica',
    medium: 'Media',
    premium: 'Premium',
  };
  return labels[quality] ?? quality;
}

// ============================================================
// BATHROOM CALCULATOR UI HELPERS
// ============================================================

export function bathroomSelectOption(
  containerId: string,
  key: string,
  value: string
): void {
  const container = query('#' + containerId);
  if (!container) return;

  container.querySelectorAll('.age-option').forEach((opt) => {
    const isSelected = opt.getAttribute('data-value') === value;
    opt.classList.toggle('selected', isSelected);
    opt.setAttribute('aria-pressed', String(isSelected));
  });
}

export function bathroomUpdateBuildingAge(age: string): void {
  bathroomSelectOption('ageOptions', 'buildingAge', age);
}

export function bathroomToggleExtra(val: string, isSelected: boolean): void {
  const item = query(`[data-extra="${val}"]`);
  if (item) {
    item.classList.toggle('selected', isSelected);
    item.setAttribute('aria-pressed', String(isSelected));
  }
}
