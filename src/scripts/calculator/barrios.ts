/**
 * Calculator Barrios — Multipliers, presets, labels
 * Part of src/scripts/calculator/ (A3 zone)
 * 
 * These values are critical and MUST be preserved exactly:
 * - casco-viejo: 1.30
 * - indautxu: 1.15
 * - deusto: 1.10
 * - getxo: 1.10
 */

import type { BarrioKey, BarrioPreset, BuildingAgeKey } from './types.js';

/**
 * Mapping from barrio slug to building age preset.
 * Used when a barrio is pre-selected via ?barrio= URL param.
 * MUST preserve these exact values.
 */
export const BARRIO_TO_AGE: Record<BarrioKey, BuildingAgeKey> = {
  'casco-viejo': 'historic',
  'indautxu': 'old',
  'deusto': 'moderate',
  'getxo': 'moderate',
};

/**
 * Display labels for barrio slugs.
 * Used in UI badges and dropdowns.
 */
export const BARRIO_LABELS: Record<BarrioKey, string> = {
  'casco-viejo': 'Casco Viejo',
  'indautxu': 'Indautxu',
  'deusto': 'Deusto',
  'getxo': 'Getxo',
};

/**
 * Multipliers applied to base price per barrio.
 * MUST preserve these exact values.
 * 
 * Reasoning:
 * - Casco Viejo (1.30): Historic buildings, difficult access, heritage restrictions
 * - Indautxu (1.15): Prime residential area, higher construction costs
 * - Deusto (1.10): University area, moderate pricing
 * - Getxo (1.10): Affluent residential, slightly elevated costs
 */
export const BARRIO_MULTIPLIERS: Record<BarrioKey, number> = {
  'casco-viejo': 1.30,
  'indautxu': 1.15,
  'deusto': 1.10,
  'getxo': 1.10,
};

// URL params read at module level (browser only)
let _presetBarrio: BarrioKey | null = null;
let _presetAge: BuildingAgeKey | null = null;

if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search);
  const barrio = urlParams.get('barrio');
  if (barrio && Object.keys(BARRIO_MULTIPLIERS).includes(barrio)) {
    _presetBarrio = barrio as BarrioKey;
  }
  const age = urlParams.get('age');
  if (age && Object.keys(BARRIO_TO_AGE).includes(age)) {
    _presetAge = age as BuildingAgeKey;
  }
}

/** Effective barrio from URL param (null if not set) */
export const presetBarrio: BarrioKey | null = _presetBarrio;

/** Effective age from URL param (null if not set) */
export const presetAge: BuildingAgeKey | null = _presetAge;

/**
 * All barrio presets for dropdown generation.
 */
export const BARRIO_PRESETS: BarrioPreset[] = [
  { slug: 'casco-viejo', label: 'Casco Viejo', multiplicador: 1.30, agePreset: 'historic' },
  { slug: 'indautxu', label: 'Indautxu', multiplicador: 1.15, agePreset: 'old' },
  { slug: 'deusto', label: 'Deusto', multiplicador: 1.10, agePreset: 'moderate' },
  { slug: 'getxo', label: 'Getxo', multiplicador: 1.10, agePreset: 'moderate' },
];

/**
 * Get the multiplier for a given barrio slug.
 * Returns 1.0 if barrio not found.
 */
export function getBarrioMultiplier(slug: string): number {
  return BARRIO_MULTIPLIERS[slug as BarrioKey] ?? 1.0;
}

/**
 * Get the age preset for a given barrio slug.
 * Returns 'moderate' as default.
 */
export function getBarrioAgePreset(slug: string): BuildingAgeKey {
  return BARRIO_TO_AGE[slug as keyof typeof BARRIO_TO_AGE] ?? 'moderate';
}

/**
 * Get the display label for a given barrio slug.
 */
export function getBarrioLabel(slug: string): string {
  return BARRIO_LABELS[slug as BarrioKey] ?? slug;
}

/**
 * Apply barrio multiplier to a price (low and high).
 */
export function applyBarrioMultiplier(
  low: number,
  high: number,
  slug: string
): { low: number; high: number } {
  const mult = getBarrioMultiplier(slug);
  return {
    low: Math.round(low * mult),
    high: Math.round(high * mult),
  };
}
