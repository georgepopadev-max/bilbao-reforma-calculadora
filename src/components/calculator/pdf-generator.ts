/**
 * PDF Generator — jsPDF budget document
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

export function generateBudgetPDF(budget: BudgetInfo): void {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(45, 45, 45);
  doc.text('Bilbao Reforma', 20, 20);

  doc.setFontSize(14);
  doc.text(`Presupuesto de ${budget.calculatorLabel}`, 20, 35);

  doc.setFontSize(11);
  doc.setTextColor(107, 107, 107);
  doc.text(`Ciudad: ${budget.city}`, 20, 45);
  doc.text(
    `Fecha: ${new Date().toLocaleDateString('es-ES')}`,
    20, 52
  );

  // Amount
  doc.setFontSize(16);
  doc.setTextColor(74, 103, 65);
  doc.text(
    `${budget.min.toLocaleString('es-ES')} € — ${budget.max.toLocaleString('es-ES')} €`,
    20, 70
  );

  // Breakdown table
  doc.setFontSize(12);
  doc.setTextColor(45, 45, 45);
  doc.text('Desglose orientativo:', 20, 85);

  let y = 95;
  for (const item of budget.breakdown) {
    const rgb = hexToRgb(item.color);
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(20, y - 4, 4, 4, 'F');

    doc.setFontSize(10);
    doc.setTextColor(45, 45, 45);
    doc.text(item.label, 28, y);

    const pct = Math.round((item.value / budget.max) * 100);
    doc.text(`${item.value.toLocaleString('es-ES')} € (${pct}%)`, 130, y);

    y += 8;
  }

  // Footer disclaimer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Presupuesto orientativo. Solicita cotizaciones personalizadas a empresas locales.',
    20, 280
  );

  // Save
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `presupuesto-${budget.calculatorType}-${budget.city}-${dateStr}.pdf`;
  doc.save(filename);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}
