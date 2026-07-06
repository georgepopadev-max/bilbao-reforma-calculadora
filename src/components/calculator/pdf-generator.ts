/**
 * PDF Generator — Premium budget document for BilbaoReforma.es
 * All text in clean Spanish. ID format: BR-YYYY-MM-DD-NNN
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
const GRAFITO  = [45, 45, 45];
const GRIS     = [107, 107, 107];
const VERDE    = [74, 103, 65];
const CREMA    = [250, 247, 242];
const BLANCO   = [255, 255, 255];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

/** Generate sequential-ish ID using date + random. Replace with DB counter in production. */
function generateBudgetId(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const dd   = String(now.getDate()).padStart(2, '0');
  const seq  = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `BR-${yyyy}-${mm}-${dd}-${seq}`;
}

function getCityAveragePrice(calcType: BudgetInfo['calculatorType']): string {
  const prices: Record<string, string> = {
    bano:     '750-1.200 EUR/m2',
    cocina:   '800-1.500 EUR/m2',
    integral: '750-1.400 EUR/m2',
    pintura:  '8-18 EUR/m2',
    suelo:    '35-140 EUR/m2',
  };
  return prices[calcType] || '750-1.200 EUR/m2';
}

function getRecommendations(
  calcType: BudgetInfo['calculatorType'],
  _min: number,
  _max: number
): string[] {
  const all: Record<string, string[]> = {
    bano: [
      'Prioriza la impermeabilizacion de la ducha o banera para evitar humedades futuras.',
      'Si el bano tiene mas de 20 anos, valora cambiar las tuberias de agua (EUR 400-800 extra).',
      'Un plato de ducha a ras de suelo (walk-in) mejora la accesibilidad y el valor de la vivienda.',
      'Elige platos de ducha de resina o stone resin: mas silenciosos y calidos que el acero.',
    ],
    cocina: [
      'La encimera de Porcelanosa o Dekton aporta gran diferencia visual con coste razonable.',
      'Si cambias la imagen de la cocina, valora mover puntos de luz (EUR 150-300).',
      'Un fregadero de un seno + escurridor es mas funcional que dos senos pequenos.',
      'Instala tomas USB en el mosaico: minimo 4, idealmente 6+ cerca de la zona de cafe.',
    ],
    integral: [
      'Planifica el cambio de electricidad completo: cableado antiguo es riesgo real en edificios de mas de 40 anos.',
      'El aislamiento termico de fachada (SATE) tiene amortizacion en unos 8 anos y sube el valor del inmueble.',
      'Valvulas termostaticas en cada radiador: inversion de unos EUR 120 que se amortiza en 1-2 inviernos.',
      'Aprovecha las ayudas Next Generation para reformas de eficiencia energetica en el Pais Vasco.',
    ],
    pintura: [
      'La pintura ecologica de mineral al silicico es mas transpirable y dura 15+ anhos en fachadas.',
      'Para interiores, la pintura lavable clase I es casi obligatoria con ninos o animales.',
      'El gotele eliminable (proyeccion + plaste) cuesta unos EUR 6-8/m2 extra pero mejora mucho el aspecto.',
      'Un buen prepintado (limpieza, tapar grietas) puede duplicar la vida util de la pintura.',
    ],
    suelo: [
      'El porcelanico efecto madera es el mejor equilibrio precio/durabilidad: no se hincha con la humedad.',
      'Si instalas suelo nuevo sobre el existente, asegurate de que el suelo actual este bien nivelado.',
      'El vinilo de alta gama: inversion inicial alta (hasta EUR 120/m2) pero el valor de vivienda sube proporcionalmente.',
    ],
  };
  return all[calcType] || all['integral'];
}

export function generateBudgetPDF(budget: BudgetInfo): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const ML = 20;   // margin left
  const MR = pageW - 20;

  // ── PALETTE HELPERS ───────────────────────────────────────────────────────
  const setFill = (c: number[]) => doc.setFillColor(...c);
  const setDraw = (c: number[]) => doc.setDrawColor(...c);
  const setText = (c: number[]) => doc.setTextColor(...c);

  // ── HEADER BAND ───────────────────────────────────────────────────────────
  setFill(TERRACOTA);
  doc.rect(ML, 0, MR - ML, 38, 'F');

  setText(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Bilbao Reforma', ML + 4, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(255, 215, 195);
  doc.text('Calculadora de presupuestos  |  bilbaoreforma.es', ML + 4, 27);

  // Logo placeholder mark (right side of header)
  setText(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('BR', MR, 22, { align: 'right' });

  // ── TITLE BLOCK ────────────────────────────────────────────────────────────
  const titleY = 50;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  setText(...GRAFITO);
  doc.text('Presupuesto orientativo de reforma', ML, titleY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  setText(...GRIS);
  doc.text(budget.calculatorLabel + ' — ' + budget.city, ML, titleY + 7);

  // ── METADATA CARD ─────────────────────────────────────────────────────────
  const cardY = titleY + 15;
  const cardH = 28;
  const halfW = (MR - ML) / 2 - 3;

  setFill(CREMA);
  doc.roundedRect(ML, cardY, halfW, cardH, 2, 2, 'F');
  doc.roundedRect(ML + halfW + 6, cardY, halfW, cardH, 2, 2, 'F');

  const budgetId = generateBudgetId();
  const today = new Date();
  const validityDate = new Date(today);
  validityDate.setDate(validityDate.getDate() + 30);

  const dateStr = today.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  const validStr = validityDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

  // Card 1 — Project data
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  setText(...GRIS);
  doc.text('DATOS DEL PROYECTO', ML + 4, cardY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setText(...GRAFITO);
  doc.text(budget.calculatorLabel, ML + 4, cardY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setText(...GRIS);
  doc.text('Ciudad: ' + budget.city, ML + 4, cardY + 21);
  doc.text('Superficie variable', ML + 4, cardY + 26);

  // Card 2 — Document data
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  setText(...GRIS);
  doc.text('DATOS DEL DOCUMENTO', ML + halfW + 10, cardY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setText(...GRAFITO);
  doc.text('ID: ' + budgetId, ML + halfW + 10, cardY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setText(...GRIS);
  doc.text('Fecha: ' + dateStr, ML + halfW + 10, cardY + 21);
  doc.text('Validez: ' + validStr + ' (30 dias)', ML + halfW + 10, cardY + 26);

  // ── PRICE RANGE BAND ───────────────────────────────────────────────────────
  const priceY = cardY + cardH + 10;
  setFill(VERDE);
  doc.roundedRect(ML, priceY, MR - ML, 20, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  setText(255, 255, 255);
  doc.text(
    budget.min.toLocaleString('es-ES') + ' EUR  —  ' + budget.max.toLocaleString('es-ES') + ' EUR',
    ML + 4,
    priceY + 13
  );

  const priceNoteY = priceY + 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setText(...GRIS);
  doc.text(
    'Rango orientativo +/-15%. Precio final segun medicion in situ y caracteristicas del edificio.',
    ML,
    priceNoteY
  );

  // ── BREAKDOWN TABLE ────────────────────────────────────────────────────────
  const tableY = priceNoteY + 10;
  const colLabel = ML;
  const colAmount = ML + 100;
  const colPct   = ML + 145;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setText(...GRAFITO);
  doc.text('Desglose orientativo', ML, tableY);

  let y = tableY + 7;

  // Table header
  setFill(TERRACOTA);
  doc.rect(ML, y, MR - ML, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  setText(255, 255, 255);
  doc.text('PARTIDA', colLabel + 3, y + 5.5);
  doc.text('IMPORTE', colAmount, y + 5.5);
  doc.text('%', colPct, y + 5.5);
  y += 8;

  // Table rows
  const totalValue = budget.breakdown.reduce((s, i) => s + i.value, 0);

  budget.breakdown.forEach((item, idx) => {
    // Alternating row background
    if (idx % 2 === 1) {
      setFill(CREMA);
      doc.rect(ML, y, MR - ML, 8, 'F');
    }

    // Color dot
    const rgb = hexToRgb(item.color);
    setFill([rgb.r, rgb.g, rgb.b]);
    doc.rect(colLabel, y + 2, 3.5, 3.5, 'F');

    // Label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    setText(...GRAFITO);
    doc.text(item.label, colLabel + 6, y + 5.5);

    // Amount (proportional within range)
    const itemAmount = budget.min + Math.round((budget.max - budget.min) * (item.value / totalValue));
    doc.text(itemAmount.toLocaleString('es-ES') + ' EUR', colAmount, y + 5.5);

    // Percentage
    const pct = Math.round((item.value / totalValue) * 100);
    doc.text(pct + '%', colPct, y + 5.5);

    y += 8;
    if (y > pageH - 55) return; // stop before footer
  });

  // ── CITY COMPARISON ────────────────────────────────────────────────────────
  y += 6;
  setFill(VERDE);
  doc.roundedRect(ML, y, MR - ML, 22, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setText(255, 255, 255);
  doc.text('Precio medio en el mercado Vasco (EUR/m2)', ML + 4, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(getCityAveragePrice(budget.calculatorType), ML + 4, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  setText(210, 235, 210);
  doc.text('Datos orientativos de mercado 2026. El precio real depende de calidades y condiciones.', ML + 4, y + 21);

  y += 28;

  // ── RECOMMENDATIONS ────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setText(...GRAFITO);
  doc.text('Recomendaciones personalizadas', ML, y);
  y += 7;

  const recs = getRecommendations(budget.calculatorType, budget.min, budget.max);
  recs.slice(0, 5).forEach((rec) => {
    if (y > pageH - 38) return;
    const lines = doc.splitTextToSize(rec, MR - ML - 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    setText(...GRAFITO);
    doc.text(lines, ML + 3, y);
    y += lines.length * 4.5 + 2;
  });

  // ── FOOTER ────────────────────────────────────────────────────────────────
  const footerY = pageH - 20;

  setDraw(TERRACOTA);
  doc.setLineWidth(0.5);
  doc.line(ML, footerY - 4, MR, footerY - 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  setText(...GRIS);
  doc.text('Presupuesto orientativo, no vinculante. Valido 30 dias desde la fecha de emision.', ML, footerY);
  doc.text('Bilbao Reforma  |  info@bilbaoreforma.es  |  +34 642 147 856', ML, footerY + 4.5);

  doc.setFontSize(6.5);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'RGPD: tus datos se usan unicamente para enviarte este presupuesto y ofertas relevantes. Puedes darte de baja en cualquier momento.',
    ML,
    footerY + 9
  );

  // Save
  const dateFile = today.toISOString().split('T')[0];
  const filename = `presupuesto-${budget.calculatorType}-${budget.city}-${dateFile}.pdf`;
  doc.save(filename);
}
