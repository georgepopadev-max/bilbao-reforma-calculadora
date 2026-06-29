/**
 * Calculator Pricing — Calculation engine
 * Part of src/scripts/calculator/ (A3 zone)
 * 
 * Logic sourced from datasetValidated.js + calculator.js
 * All clamps MUST be preserved exactly:
 * - MIN_BATHROOM = 2500
 * - MIN_KITCHEN = 5000
 */

import { CONFIG } from './config.js';
import type {
  ReformTypeKey,
  ReformScopeKey,
  BuildingAgeKey,
  QualityKey,
  ExtraKey,
  CalculationResult,
  BreakdownItem,
  CalculatorData,
} from './types.js';

// ============================================================
// PRICE DATA — mirrors datasetValidated
// ============================================================

export const PRICE_DATA = {
  reformType: {
    painting: {
      label: 'Pintura',
      minPerSqm: 8,
      maxPerSqm: 20,
      unit: 'm²',
      basePerSqm: 14,
    },
    flooring: {
      label: 'Suelo',
      minPerSqm: 25,
      maxPerSqm: 130,
      unit: 'm²',
      basePerSqm: 65,
    },
    bathroom: {
      label: 'Baño completo',
      min: 2500,
      max: 20000,
      unit: 'ud',
      basePerSqm: 0,
    },
    kitchen: {
      label: 'Cocina',
      min: 5000,
      max: 16000,
      unit: 'ud',
      basePerSqm: 0,
    },
  },

  reformScope: {
    basic: {
      label: 'Reforma básica',
      minPerSqm: 550,
      maxPerSqm: 700,
      basePerSqm: 625,
    },
    medium: {
      label: 'Reforma media',
      minPerSqm: 700,
      maxPerSqm: 950,
      basePerSqm: 825,
    },
    integral: {
      label: 'Reforma integral',
      minPerSqm: 900,
      maxPerSqm: 1300,
      basePerSqm: 1100,
    },
    luxury: {
      label: 'Reforma premium',
      minPerSqm: 1300,
      maxPerSqm: 1600,
      basePerSqm: 1450,
    },
  },

  qualityMultiplier: {
    basic: { label: 'Básica', multiplier: 0.8 },
    medium: { label: 'Media', multiplier: 1.0 },
    premium: { label: 'Premium', multiplier: 1.4 },
  },

  ageMultiplier: {
    new: { label: '< 20 años', multiplier: 1.0 },
    moderate: { label: '20–40 años', multiplier: 1.05 },
    old: { label: '40–70 años', multiplier: 1.15 },
    historic: { label: '> 70 años / Casco Viejo', multiplier: 1.30 },
  },

  extras: {
    windows: {
      label: 'Ventanas PVC',
      type: 'per-unit' as const,
      defaultQty: 4,
      min: 350,
      max: 700,
      default: 525,
      unit: 'ventana',
    },
    terrace: {
      label: 'Terraza/Balcón',
      type: 'per-sqm' as const,
      defaultQty: 10,
      min: 250,
      max: 550,
      default: 400,
      unit: 'm²',
    },
    radiantFloor: {
      label: 'Suelo radiante',
      type: 'per-sqm' as const,
      defaultQty: 1,
      min: 70,
      max: 140,
      default: 105,
      unit: 'm²',
    },
    demolition: {
      label: 'Demolición tabiques',
      type: 'per-sqm' as const,
      defaultQty: 0,
      min: 22,
      max: 35,
      default: 28,
      unit: 'm²',
    },
    domotics: {
      label: 'Domótica',
      type: 'flat' as const,
      defaultQty: 1,
      min: 1000,
      max: 3000,
      default: 2000,
      unit: 'ud',
    },
    aerothermia: {
      label: 'Aerotermia',
      type: 'flat' as const,
      defaultQty: 1,
      min: 4500,
      max: 10000,
      default: 7250,
      unit: 'ud',
    },
  },

  roomQualityRanges: {
    bathroom: {
      economic: { min: 2500, max: 7500 },
      medium: { min: 5500, max: 12000 },
      premium: { min: 9000, max: 20000 },
    },
    kitchen: {
      basic: { min: 5000, max: 6000 },
      medium: { min: 8000, max: 10000 },
      premium: { min: 12000, max: 16000 },
    },
  },

  contingencyPercent: CONFIG.CONTINGENCY_PERCENT,
};

// ============================================================
// EXTRAS CALCULATION
// ============================================================

export interface ExtrasResult {
  low: number;
  high: number;
  breakdown: BreakdownItem[];
}

export function calculateExtras(
  extras: CalculatorData['extras'],
  sqm: number
): ExtrasResult {
  const breakdown: BreakdownItem[] = [];
  let low = 0;
  let high = 0;

  for (const [key, extra] of Object.entries(extras)) {
    if (!extra.checked) continue;
    const extraData = PRICE_DATA.extras[key as ExtraKey];
    if (!extraData) continue;

    const qty = extra.qty ?? extraData.defaultQty;
    if (qty <= 0) continue;

    let itemLow: number;
    let itemHigh: number;

    if (extraData.type === 'per-sqm') {
      itemLow = qty * extraData.min;
      itemHigh = qty * extraData.max;
    } else if (extraData.type === 'per-unit') {
      itemLow = qty * extraData.min;
      itemHigh = qty * extraData.max;
    } else {
      itemLow = extraData.min;
      itemHigh = extraData.max;
    }

    low += itemLow;
    high += itemHigh;

    breakdown.push({
      item: extraData.label,
      qty,
      unit: extraData.unit,
      lowRate: Math.round(itemLow / qty),
      highRate: Math.round(itemHigh / qty),
      lowTotal: Math.round(itemLow),
      highTotal: Math.round(itemHigh),
    });
  }

  return { low, high, breakdown };
}

// ============================================================
// ROOM-BASED CALCULATION
// ============================================================

export function calculateByRooms(data: CalculatorData): CalculationResult {
  const { reformTypes, sqm, quality, buildingAge, extras } = data;

  const qualityMult = PRICE_DATA.qualityMultiplier[quality]?.multiplier ?? 1;
  const ageMult = PRICE_DATA.ageMultiplier[buildingAge]?.multiplier ?? 1;

  const breakdown: BreakdownItem[] = [];
  let subtotalLow = 0;
  let subtotalHigh = 0;

  if (reformTypes.includes('painting')) {
    const base = PRICE_DATA.reformType.painting;
    const minRate = Math.max(base.minPerSqm! * qualityMult, CONFIG.PAINT_MIN_RATE_PER_SQM);
    const maxRate = base.maxPerSqm! * qualityMult;
    const low = sqm * minRate;
    const high = sqm * maxRate;
    subtotalLow += low;
    subtotalHigh += high;
    breakdown.push({
      item: base.label,
      qty: sqm,
      unit: 'm²',
      lowRate: Math.round(minRate),
      highRate: Math.round(maxRate),
      lowTotal: Math.round(low),
      highTotal: Math.round(high),
    });
  }

  if (reformTypes.includes('flooring')) {
    const base = PRICE_DATA.reformType.flooring;
    let floorLow: number;
    let floorHigh: number;

    if (quality === 'basic') {
      const minRate = Math.max(25, 25 * qualityMult);
      floorLow = sqm * minRate;
      floorHigh = sqm * 35 * qualityMult;
    } else if (quality === 'medium') {
      floorLow = sqm * 45 * qualityMult;
      floorHigh = sqm * 65 * qualityMult;
    } else {
      floorLow = sqm * 65 * qualityMult;
      floorHigh = sqm * 100 * qualityMult;
    }

    subtotalLow += floorLow;
    subtotalHigh += floorHigh;
    breakdown.push({
      item: base.label,
      qty: sqm,
      unit: 'm²',
      lowRate: Math.round(floorLow / sqm),
      highRate: Math.round(floorHigh / sqm),
      lowTotal: Math.round(floorLow),
      highTotal: Math.round(floorHigh),
    });
  }

  if (reformTypes.includes('bathroom')) {
    const ranges = PRICE_DATA.roomQualityRanges.bathroom;
    let roomRange;
    if (quality === 'basic') {
      roomRange = ranges.economic;
    } else if (quality === 'premium') {
      roomRange = ranges.premium;
    } else {
      roomRange = ranges.medium;
    }
    // CRITICAL CLAMP: MIN_BATHROOM = 2500
    const low = Math.max(roomRange.min, CONFIG.MIN_BATHROOM);
    const high = roomRange.max;
    subtotalLow += low;
    subtotalHigh += high;
    breakdown.push({
      item: 'Baño completo',
      qty: 1,
      unit: 'ud',
      lowRate: Math.round(low),
      highRate: Math.round(high),
      lowTotal: Math.round(low),
      highTotal: Math.round(high),
    });
  }

  if (reformTypes.includes('kitchen')) {
    const ranges = PRICE_DATA.roomQualityRanges.kitchen;
    let roomRange;
    if (quality === 'basic') {
      roomRange = ranges.basic!;
    } else if (quality === 'premium') {
      roomRange = ranges.premium;
    } else {
      roomRange = ranges.medium;
    }
    // CRITICAL CLAMP: MIN_KITCHEN = 5000
    const low = Math.max(roomRange.min, CONFIG.MIN_KITCHEN);
    const high = roomRange.max;
    subtotalLow += low;
    subtotalHigh += high;
    breakdown.push({
      item: 'Cocina',
      qty: 1,
      unit: 'ud',
      lowRate: Math.round(low),
      highRate: Math.round(high),
      lowTotal: Math.round(low),
      highTotal: Math.round(high),
    });
  }

  // Apply age multiplier
  subtotalLow *= ageMult;
  subtotalHigh *= ageMult;

  // Add extras
  const extrasResult = calculateExtras(extras, sqm);
  subtotalLow += extrasResult.low;
  subtotalHigh += extrasResult.high;
  breakdown.push(...extrasResult.breakdown);

  // Apply contingency
  if (data.contingencyEnabled) {
    const contingencyLow = subtotalLow * PRICE_DATA.contingencyPercent;
    const contingencyHigh = subtotalHigh * PRICE_DATA.contingencyPercent;
    breakdown.push({
      item: 'Imprevistos (15%)',
      qty: 1,
      unit: 'ud',
      lowRate: Math.round(contingencyLow),
      highRate: Math.round(contingencyHigh),
      lowTotal: Math.round(contingencyLow),
      highTotal: Math.round(contingencyHigh),
    });
    subtotalLow += contingencyLow;
    subtotalHigh += contingencyHigh;
  }

  const avgPerSqm = Math.round((subtotalLow + subtotalHigh) / 2 / sqm);

  return {
    low: Math.round(subtotalLow),
    high: Math.round(subtotalHigh),
    avgPerSqm,
    breakdown,
    type: 'rooms',
  };
}

// ============================================================
// SCOPE-BASED CALCULATION
// ============================================================

export function calculateByScope(data: CalculatorData): CalculationResult {
  const { reformScope, sqm, quality, buildingAge, extras } = data;

  const scopeData = reformScope ? PRICE_DATA.reformScope[reformScope] : undefined;
  if (!scopeData) {
    return { low: 0, high: 0, avgPerSqm: 0, breakdown: [], type: 'scope' };
  }

  const qualityMult = PRICE_DATA.qualityMultiplier[quality]?.multiplier ?? 1;
  const ageMult = PRICE_DATA.ageMultiplier[buildingAge]?.multiplier ?? 1;

  const breakdown: BreakdownItem[] = [];

  const baseLowPerSqm = scopeData.minPerSqm * qualityMult;
  const baseHighPerSqm = scopeData.maxPerSqm * qualityMult;
  const baseLow = sqm * baseLowPerSqm;
  const baseHigh = sqm * baseHighPerSqm;

  const baseLowAge = baseLow * ageMult;
  const baseHighAge = baseHigh * ageMult;

  breakdown.push({
    item: scopeData.label,
    qty: sqm,
    unit: 'm²',
    lowRate: Math.round(baseLowPerSqm),
    highRate: Math.round(baseHighPerSqm),
    lowTotal: Math.round(baseLowAge),
    highTotal: Math.round(baseHighAge),
  });

  let subtotalLow = baseLowAge;
  let subtotalHigh = baseHighAge;

  // Add extras
  const extrasResult = calculateExtras(extras, sqm);
  subtotalLow += extrasResult.low;
  subtotalHigh += extrasResult.high;
  breakdown.push(...extrasResult.breakdown);

  // Apply contingency
  if (data.contingencyEnabled) {
    const contingencyLow = subtotalLow * PRICE_DATA.contingencyPercent;
    const contingencyHigh = subtotalHigh * PRICE_DATA.contingencyPercent;
    breakdown.push({
      item: 'Imprevistos (15%)',
      qty: 1,
      unit: 'ud',
      lowRate: Math.round(contingencyLow),
      highRate: Math.round(contingencyHigh),
      lowTotal: Math.round(contingencyLow),
      highTotal: Math.round(contingencyHigh),
    });
    subtotalLow += contingencyLow;
    subtotalHigh += contingencyHigh;
  }

  const avgPerSqm = Math.round((subtotalLow + subtotalHigh) / 2 / sqm);

  return {
    low: Math.round(subtotalLow),
    high: Math.round(subtotalHigh),
    avgPerSqm,
    breakdown,
    type: 'scope',
  };
}

// ============================================================
// MAIN CALCULATION
// ============================================================

export function calculate(data: CalculatorData): CalculationResult {
  if (data.reformTypes.length > 0 && !data.reformScope) {
    return calculateByRooms(data);
  }
  if (data.reformScope) {
    return calculateByScope(data);
  }
  return { low: 0, high: 0, avgPerSqm: 0, breakdown: [], type: 'rooms' };
}

// ============================================================
// VALIDATION
// ============================================================

export function validateStep(
  step: number,
  data: CalculatorData
): Record<string, string> {
  const errors: Record<string, string> = {};

  switch (step) {
    case 1:
      if (data.reformTypes.length === 0 && !data.reformScope) {
        errors.reformType = 'Selecciona al menos un tipo de reforma';
      }
      break;
    case 2:
      if (!data.sqm || data.sqm < CONFIG.MIN_SQM || data.sqm > CONFIG.MAX_SQM) {
        errors.sqm = `Introduce una superficie válida (${CONFIG.MIN_SQM}-${CONFIG.MAX_SQM} m²)`;
      }
      break;
    case 3:
      if (!data.buildingAge) {
        errors.buildingAge = 'Selecciona la antigüedad del edificio';
      }
      break;
    case 4:
      if (!data.quality) {
        errors.quality = 'Selecciona un nivel de calidad';
      }
      break;
    // Step 5 (extras) is optional
  }

  return errors;
}

// ============================================================
// HELPERS
// ============================================================

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function getScopeIcon(key: ReformScopeKey): string {
  const icons: Record<ReformScopeKey, string> = {
    basic: '🏠',
    medium: '🏡',
    integral: '🏗️',
    luxury: '✨',
  };
  return icons[key] ?? '📋';
}

export function getRoomIcon(key: ReformTypeKey): string {
  const icons: Record<ReformTypeKey, string> = {
    painting: '🎨',
    flooring: '🪵',
    bathroom: '🚿',
    kitchen: '🍳',
  };
  return icons[key] ?? '📋';
}
