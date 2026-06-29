/**
 * Calculator Types — TypeScript interfaces
 * Part of src/scripts/calculator/ (A3 zone)
 */

// Reform type keys
export type ReformTypeKey = 'painting' | 'flooring' | 'bathroom' | 'kitchen';

// Reform scope keys
export type ReformScopeKey = 'basic' | 'medium' | 'integral' | 'luxury';

// Building age keys
export type BuildingAgeKey = 'new' | 'moderate' | 'old' | 'historic';

// Quality level keys
export type QualityKey = 'basic' | 'medium' | 'premium';

// Barrio slug keys
export type BarrioKey = 'casco-viejo' | 'indautxu' | 'deusto' | 'getxo';

// Extra keys
export type ExtraKey =
  | 'windows'
  | 'terrace'
  | 'radiantFloor'
  | 'demolition'
  | 'domotics'
  | 'aerothermia';

// Calculator type for rooms vs scope
export type CalculationType = 'rooms' | 'scope';

// Reform type data (from datasetValidated)
export interface ReformTypeData {
  label: string;
  minPerSqm?: number;
  maxPerSqm?: number;
  min?: number;
  max?: number;
  unit: string;
  basePerSqm?: number;
}

// Reform scope data
export interface ReformScopeData {
  label: string;
  minPerSqm: number;
  maxPerSqm: number;
  basePerSqm: number;
  source?: string;
  confidence?: string;
  notes?: string;
}

// Quality multiplier data
export interface QualityMultiplierData {
  label: string;
  multiplier: number;
  desc?: string;
}

// Age multiplier data
export interface AgeMultiplierData {
  label: string;
  multiplier: number;
  note?: string;
}

// Extra item data
export interface ExtraItemData {
  label: string;
  type: 'per-unit' | 'per-sqm' | 'flat';
  defaultQty: number;
  min: number;
  max: number;
  default: number;
  unit: string;
}

// Room quality ranges
export interface RoomQualityRange {
  min: number;
  max: number;
}

export interface RoomQualityRanges {
  economic: RoomQualityRange;
  medium: RoomQualityRange;
  premium: RoomQualityRange;
  basic?: RoomQualityRange; // kitchen has basic instead of economic
}

// Price data structure (mirrors datasetValidated)
export interface PriceData {
  reformType: Partial<Record<ReformTypeKey, ReformTypeData>>;
  reformScope: Partial<Record<ReformScopeKey, ReformScopeData>>;
  qualityMultiplier: Partial<Record<QualityKey, QualityMultiplierData>>;
  ageMultiplier: Partial<Record<BuildingAgeKey, AgeMultiplierData>>;
  extras: Partial<Record<ExtraKey, ExtraItemData>>;
  roomQualityRanges: {
    bathroom: RoomQualityRanges;
    kitchen: RoomQualityRanges;
  };
  contingencyPercent: number;
}

// Breakdown item
export interface BreakdownItem {
  item: string;
  qty: number;
  unit: string;
  lowRate: number;
  highRate: number;
  lowTotal: number;
  highTotal: number;
}

// Calculation result
export interface CalculationResult {
  low: number;
  high: number;
  avgPerSqm: number;
  breakdown: BreakdownItem[];
  type: CalculationType;
}

// Calculator state
export interface CalculatorState {
  currentStep: number;
  totalSteps: number;
  data: CalculatorData;
  ui: CalculatorUI;
  result: CalculationResult | null;
}

// Calculator form data
export interface CalculatorData {
  reformTypes: ReformTypeKey[];
  reformScope: ReformScopeKey | null;
  sqm: number;
  buildingAge: BuildingAgeKey;
  quality: QualityKey;
  extras: Partial<Record<ExtraKey, { checked: boolean; qty: number }>>;
  contingencyEnabled: boolean;
}

// Calculator UI state
export interface CalculatorUI {
  isLoading: boolean;
  errors: Partial<Record<string, string>>;
  isCalculated: boolean;
}

// Bathroom-specific state
export interface BathroomCalculatorData {
  metros: number;
  mainElement: 'ducha' | 'banera' | 'ducha_banera' | 'sanitarios' | null;
  duchaType: string | null;
  revestimiento: string | null;
  suelo: string | null;
  sanitarios: string[];
  extras: string[];
  edificio: number;
}

// Bathroom calculator state
export interface BathroomCalculatorState {
  currentStep: number;
  totalSteps: number;
  data: BathroomCalculatorData;
}

// Barrial preset
export interface BarrioPreset {
  slug: BarrioKey;
  label: string;
  multiplicador: number;
  agePreset: BuildingAgeKey;
}

// Preset m² values
export interface SqmPreset {
  label: string;
  value: number;
}

// Public API shape
export interface BilbaoCalcPublicAPI {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateSqm: (sqm: number | string) => void;
  updateBuildingAge: (age: BuildingAgeKey) => void;
  updateQuality: (quality: QualityKey) => void;
  toggleReformType: (type: ReformTypeKey) => void;
  selectScope: (scope: ReformScopeKey) => void;
  setTotalSteps: (steps: number) => void;
  updateReformTypes: (types: ReformTypeKey[]) => void;
  updateReformScope: (scope: ReformScopeKey) => void;
  toggleExtra: (key: string) => void;
  updateExtra: (key: string, checked: boolean, qty?: number) => void;
  calculateAndShowResult: () => void;
  restart: () => void;
  downloadPDF: () => void;
  requestQuotes: () => void;
  init: () => void;
}
