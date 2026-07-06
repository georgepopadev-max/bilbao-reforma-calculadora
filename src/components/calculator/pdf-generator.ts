/**
 * PDF Generator — Premium jsPDF budget document
 * Downloads as presupuesto-{type}-{city}-{date}.pdf
 */
import jsPDF from 'jspdf';
import type { BreakdownItem } from './budget-chart';

export interface BudgetInfo {
  city: string;
  calculatorType: 'bano' | 'cocina' | 'integral' | 'pintura' | 'suelo';
  calculatorLabel: string;
  min: number;
  max: number;
  breakdown: BreakdownItem[];
}

const TERRACOTA = [196, 92, 62];
const GRAFITO = [45, 45, 45];
const GRIS = [107, 107, 107];
const VERDE = [74, 103, 65];
const VERDE_LIGHT = [240, 247, 238];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

function generateBudgetId(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `BR-${yyyy}-${mm}-${dd}-${seq}`;
}

function getCityAveragePrice(calculatorType: BudgetInfo['calculatorType']): string {
  const prices: Record<string, string> = {
    bano: '750–1.200 €/m²',
    cocina: '800–1.500 €/m²',
    integral: '750–1.400 €/m²',
    pintura: '8–18 €/m²',
    suelo: '35–140 €/m²',
  };
  return prices[calculatorType] || '750–1.200 €/m²';
}

function getRecommendations(
  calculatorType: BudgetInfo['calculatorType'],
  min: number,
  max: number
): string[] {
  const recommendations: Record<string, string[]> = {
    bano: [
      'Prioriza la impermeabilización de la ducha o bañera para evitar humedades futuras.',
      'Si el baño tiene más de 20 años, valora cambiar las tuberías de agua (€400–800 extra).',
      'Un plato de ducha a ras de suelo (walk-in) mejora la accesibilidad y el valor de la vivienda.',
      'Elige platos de ducha de resina o stone resin: más silenciosos y cálidos que el acero.',
    ],
    cocina: [
      'La encimera de Porcelanosa o Dekton aporta gran diferencia visual con coste razonable.',
      'Si cambiaszimagen de la cocina, valora mover puntos de luz (€150–300).',
      'Un fregadero de un seno + escurridor es más funcional que dos senos pequeños.',
      'Instala tomadas USB en el mosaico: mínimo 4, idealmente 6+ cerca de la zona de café.',
    ],
    integral: [
      'Planifica el cambio de electricidad completo: pipaza antiguo es riesgo real en edificios >40 años.',
      'La aislamiento térmico de fachada (SATE) tiene amortización en ~8 años y sube el IBI.',
      'Un suelo radiante eléctrico后悔 no requiere obra de rotor en多数 casos de rehabilitación.',
      'Válvulas termostáticas en cada radiador: inversión ~€120 que se amortiza en 1-2 winters.',
    ],
    pintura: [
      'La pintura ecológica de mineral al silícico es más transpirable y dura 15+ años en fachadas.',
      'Para interiores, la pintura lavable clase I es几乎是 obligatorio con niños o animales.',
      'El gotelé eliminable (projés + plaste) cuesta ~€6-8/m² extra pero当代客厅 immediate.',
    ],
    suelo: [
      'El porcelánico efecto madera es el mejor equilibrio precio/durabilidad: no se hincha con la humedad.',
      'Si instalas suelo nuevo sobre el existente, убедись de que el suelo actual esté bien nivelado.',
      'El lipio de la старрaris: inversión inicial alta (~€120/m²) pero valor de vivienda sube proporcionalmente.',
    ],
  };
  return recommendations[calculatorType] || recommendations['integral'];
}

export function generateBudgetPDF(budget: BudgetInfo): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const marginL = 20;
  const marginR = pageW - 20;

  // ── HEADER ────────────────────────────────────────────────────────────────
  doc.setFontSize(22);
  doc.setTextColor(...TERRACOTA);
  doc.text('Bilbao Reforma', marginL, 22);

  doc.setFontSize(10);
  doc.setTextColor(...GRIS);
  doc.text('Calculadora de presupuestos · bilbaoreforma.es', marginL, 29);

  // Decorative line
  doc.setDrawColor(...TERRACOTA);
  doc.setLineWidth(0.6);
  doc.line(marginL, 33, marginR, 33);

  // ── TITLE ─────────────────────────────────────────────────────────────────
  doc.setFontSize(16);
  doc.setTextColor(...GRAFITO);
  doc.text(`Presupuesto de ${budget.calculatorLabel}`, marginL, 46);

  // ── METADATA ───────────────────────────────────────────────────────────────
  const budgetId = generateBudgetId();
  const today = new Date();
  const validityDate = new Date(today);
  validityDate.setDate(validityDate.getDate() + 30);

  doc.setFontSize(10);
  doc.setTextColor(...GRIS);
  doc.text(`Ciudad: ${budget.city}`, marginL, 57);
  doc.text(`Fecha: ${today.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}`, marginL, 64);
  doc.text(`Validez: ${validityDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })} (30 días)`, marginL, 71);
  doc.text(`ID: ${budgetId}`, marginL, 78);

  // ── PRICE RANGE ───────────────────────────────────────────────────────────
  const priceY = 90;
  doc.setFillColor(...VERDE_LIGHT);
  doc.rect(marginL - 1, priceY - 7, marginR - marginL + 2, 18, 'F');

  doc.setFontSize(20);
  doc.setTextColor(...VERDE);
  doc.text(
    `${budget.min.toLocaleString('es-ES')} € — ${budget.max.toLocaleString('es-ES')} €`,
    marginL,
    priceY + 4
  );

  // ── BREAKDOWN ──────────────────────────────────────────────────────────────
  const breakdownY = 112;
  doc.setFontSize(12);
  doc.setTextColor(...GRAFITO);
  doc.text('Desglose orientativo', marginL, breakdownY);

  let y = breakdownY + 9;
  const colLabel = marginL;
  const colAmount = marginL + 80;
  const colPct = marginL + 125;

  // Table header
  doc.setFontSize(9);
  doc.setTextColor(...GRIS);
  doc.text('Partida', colLabel, y);
  doc.text('Importe', colAmount, y);
  doc.text('%', colPct, y);
  y += 2;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(marginL, y, marginR, y);
  y += 5;

  const totalValue = budget.breakdown.reduce((s, i) => s + i.value, 0);
  for (const item of budget.breakdown) {
    const rgb = hexToRgb(item.color);
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(colLabel, y - 3.5, 3.5, 3.5, 'F');

    doc.setFontSize(10);
    doc.setTextColor(...GRAFITO);
    doc.text(item.label, colLabel + 6, y);

    const itemAmount = budget.min + Math.round((budget.max - budget.min) * (item.value / totalValue));
    doc.text(`${itemAmount.toLocaleString('es-ES')} €`, colAmount, y);

    const pct = Math.round((item.value / totalValue) * 100);
    doc.text(`${pct}%`, colPct, y);

    y += 8;
    if (y > pageH - 60) break;
  }

  // ── CITY COMPARISON ────────────────────────────────────────────────────────
  const comparisonY = y + 8;
  doc.setFontSize(12);
  doc.setTextColor(...GRAFITO);
  doc.text('Precio medio en tu ciudad', marginL, comparisonY);

  doc.setFontSize(11);
  doc.setTextColor(...VERDE);
  doc.text(getCityAveragePrice(budget.calculatorType), marginL, comparisonY + 8);

  doc.setFontSize(9);
  doc.setTextColor(...GRIS);
  doc.text(
    '(precio orientativo por m² según datos de mercado 2026)',
    marginL,
    comparisonY + 14
  );

  // ── RECOMMENDATIONS ────────────────────────────────────────────────────────
  const recsY = comparisonY + 24;
  doc.setFontSize(12);
  doc.setTextColor(...GRAFITO);
  doc.text('Recomendaciones personalizadas', marginL, recsY);

  const recs = getRecommendations(budget.calculatorType, budget.min, budget.max);
  let recY = recsY + 8;
  for (let i = 0; i < Math.min(recs.length, 5); i++) {
    const rec = recs[i];
    // Wrap text at ~165mm
    const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, marginR - marginL - 4);
    if (recY + lines.length * 5 > pageH - 30) break;
    doc.setFontSize(9);
    doc.setTextColor(...GRAFITO);
    doc.text(lines, marginL + 2, recY);
    recY += lines.length * 5 + 2;
  }

  // ── FOOTER ────────────────────────────────────────────────────────────────
  const footerY = pageH - 22;
  doc.setDrawColor(...TERRACOTA);
  doc.setLineWidth(0.3);
  doc.line(marginL, footerY - 4, marginR, footerY - 4);

  doc.setFontSize(8);
  doc.setTextColor(...GRIS);
  doc.text('Presupuesto orientativo, no vinculante. Válido 30 días desde la fecha de emisión.', marginL, footerY);
  doc.text('Bilbao Reforma · info@bilbaoreforma.es · +34 642 147 856', marginL, footerY + 5);
  doc.text(
    'RGPD: Tus datos se usan únicamente para enviarte este presupuesto y ofertas relevantes. Puedes darte de baja en cualquier momento.',
    marginL,
    footerY + 10
  );

  // Save
  const dateStr = today.toISOString().split('T')[0];
  const filename = `presupuesto-${budget.calculatorType}-${budget.city}-${dateStr}.pdf`;
  doc.save(filename);
}
