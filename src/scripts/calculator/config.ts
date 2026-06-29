/**
 * Calculator Config — Constants, magic numbers, clamps
 * Part of src/scripts/calculator/ (A3 zone)
 */

export const CONFIG = {
  // Minimum prices (clamp floors)
  MIN_BATHROOM: 2500,
  MIN_KITCHEN: 5000,

  // Bathroom-specific
  BATHROOM_MIN_SQM: 3,
  BATHROOM_MAX_SQM: 20,

  // Kitchen-specific
  KITCHEN_MIN_SQM: 6,
  KITCHEN_MAX_SQM: 25,

  // General
  MIN_SQM: 20,
  MAX_SQM: 500,

  // Percentage
  CONTINGENCY_PERCENT: 0.15,

  // Paint min rate clamp
  PAINT_MIN_RATE_PER_SQM: 8,
  FLOORING_MIN_RATE_PER_SQM: 25,

  // Chart colors
  CHART_COLORS: [
    '#C45C3E', // terracota - bathroom
    '#7D8B6A', // verde-montana - kitchen
    '#C4B8A8', // beige/suelo
    '#E8D5C4', // pintura
    '#A8B8A4', // instalaciones
    '#8B7355', // other extras
  ],

  // Chart cutout
  CHART_CUTOUT: '60%',

  // PDF colors (RGB arrays)
  PDF_COLORS: {
    TERRACOTA: [196, 92, 62],
    DARK: [45, 45, 45],
    GRAY: [100, 100, 100],
    LIGHT_GRAY: [245, 245, 245],
  },

  // PDF budget ID prefix
  PDF_BUDGET_PREFIX: 'BR',

  // PDF validity days
  PDF_VALIDITY_DAYS: 30,

  // IVA rate
  IVA_RATE: 0.10,
} as const;

export type ConfigKey = keyof typeof CONFIG;
