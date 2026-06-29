/**
 * Calculator Core — init, steps router, form management, public API
 * Part of src/scripts/calculator/ (A3 zone)
 * 
 * This module exports the public API (`window.BilbaoCalc`) and
 * manages the global calculator state machine.
 */

import { CONFIG } from './config.js';
import { BARRIO_MULTIPLIERS, BARRIO_TO_AGE, BARRIO_LABELS, presetBarrio, presetAge } from './barrios.js';
import {
  calculate,
  calculateByRooms,
  validateStep,
  formatCurrency,
  setRegion,
} from './pricing.js';
import {
  injectBarrioBadge,
  showStep,
  updateNavigationState,
  updateResultDisplay,
  updateSqmDisplay,
  selectAgeOption,
  selectQualityOption,
  toggleExtraItem,
  toggleReformTypeCard,
  selectScopeCard,
  updateChart,
  generatePDF,
} from './ui.js';
import type {
  CalculatorState,
  CalculatorData,
  ReformTypeKey,
  ReformScopeKey,
  BuildingAgeKey,
  QualityKey,
  ExtraKey,
  BilbaoCalcPublicAPI,
} from './types.js';

// ============================================================
// DEFAULT STATE
// ============================================================

function createDefaultState(): CalculatorState {
  return {
    currentStep: 1,
    totalSteps: 6,
    data: {
      reformTypes: [],
      reformScope: null,
      sqm: 80,
      buildingAge: presetAge ?? 'new',
      quality: 'medium',
      extras: {},
      contingencyEnabled: true,
    },
    ui: {
      isLoading: false,
      errors: {},
      isCalculated: false,
    },
    result: null,
  };
}

// ============================================================
// STATE (singleton)
// ============================================================

let state: CalculatorState = createDefaultState();

// ============================================================
// NAVIGATION
// ============================================================

function doValidateStep(step: number): boolean {
  const errors = validateStep(step, state.data);
  state.ui.errors = errors;
  return Object.keys(errors).length === 0;
}

function nextStep(): void {
  if (!doValidateStep(state.currentStep)) return;

  if (state.currentStep < state.totalSteps) {
    state.currentStep++;
    showStep(state.currentStep, state.totalSteps);
    scrollToStep(state.currentStep);
  }
}

function prevStep(): void {
  if (state.currentStep > 1) {
    state.currentStep--;
    showStep(state.currentStep, state.totalSteps);
    scrollToStep(state.currentStep);
  }
}

function goToStep(step: number): void {
  if (step === 1) {
    state.currentStep = step;
    showStep(state.currentStep, state.totalSteps);
    return;
  }

  if (step < 1 || step > state.totalSteps) return;

  // Validate all previous steps
  for (let i = 1; i < step; i++) {
    if (!doValidateStep(i)) {
      state.currentStep = i;
      showStep(state.currentStep, state.totalSteps);
      return;
    }
  }

  state.currentStep = step;
  showStep(state.currentStep, state.totalSteps);
}

function scrollToStep(step: number): void {
  const el = document.getElementById('step' + step);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// DATA UPDATES
// ============================================================

function doUpdateSqm(sqm: number | string): void {
  const val = parseInt(String(sqm), 10);
  if (!isNaN(val) && val >= CONFIG.MIN_SQM && val <= CONFIG.MAX_SQM) {
    state.data.sqm = val;
    state.ui.errors.sqm = undefined;
    updateSqmDisplay(val);
    recalculate();
  }
}

function doUpdateBuildingAge(age: BuildingAgeKey): void {
  state.data.buildingAge = age;
  state.ui.errors.buildingAge = undefined;
  selectAgeOption(age);
  recalculate();
}

function doUpdateQuality(quality: QualityKey): void {
  state.data.quality = quality;
  state.ui.errors.quality = undefined;
  selectQualityOption(quality);
  recalculate();
}

function doToggleReformType(type: ReformTypeKey): void {
  const types = state.data.reformTypes;
  const idx = types.indexOf(type);
  if (idx === -1) {
    types.push(type);
  } else {
    types.splice(idx, 1);
  }
  state.data.reformScope = null;
  state.ui.isCalculated = false;

  const isSelected = types.indexOf(type) !== -1;
  toggleReformTypeCard(type, isSelected);

  // Deselect scope cards
  document.querySelectorAll('[data-scope]').forEach((el) => {
    el.classList.remove('selected');
    el.setAttribute('aria-pressed', 'false');
  });

  updateNavigationState(!!state.data.reformScope, state.data.reformTypes.length > 0);
  recalculate();
}

function doSelectScope(scope: ReformScopeKey): void {
  state.data.reformTypes = [];
  state.data.reformScope = scope;
  state.ui.isCalculated = false;

  selectScopeCard(scope, true);
  updateNavigationState(true, false);
  recalculate();
}

function doToggleExtra(key: string): void {
  const current = state.data.extras[key as ExtraKey];
  const isChecked = !current?.checked;

  if (!state.data.extras[key as ExtraKey]) {
    state.data.extras[key as ExtraKey] = { checked: false, qty: 0 };
  }
  state.data.extras[key as ExtraKey]!.checked = isChecked;

  toggleExtraItem(key, isChecked);
  recalculate();
}

function doUpdateExtra(key: string, checked: boolean, qty?: number): void {
  if (!state.data.extras[key as ExtraKey]) {
    state.data.extras[key as ExtraKey] = { checked: false, qty: 0 };
  }
  state.data.extras[key as ExtraKey]!.checked = checked;
  state.data.extras[key as ExtraKey]!.qty = qty ?? state.data.extras[key as ExtraKey]!.qty;
  recalculate();
}

function recalculate(): void {
  state.ui.isLoading = true;

  setTimeout(() => {
    state.result = calculate(state.data);
    state.ui.isCalculated = true;
    state.ui.isLoading = false;

    if (state.currentStep === state.totalSteps) {
      updateResultDisplay(state.result, state.data);
    }
  }, 150);
}

// ============================================================
// RESULT
// ============================================================

function calculateAndShowResult(): void {
  state.result = calculate(state.data);
  state.ui.isCalculated = true;
  state.currentStep = state.totalSteps;
  showStep(state.currentStep, state.totalSteps);
  updateResultDisplay(state.result, state.data);

  if (state.result.breakdown) {
    updateChart(state.result.breakdown);
  }
}

function restart(): void {
  state = createDefaultState();
  showStep(1, state.totalSteps);
}

// ============================================================
// PDF
// ============================================================

function downloadPDF(): void {
  if (!state.result) {
    alert('Calcula tu presupuesto primero.');
    return;
  }
  generatePDF(state.result, state.data);
}

function requestQuotes(): void {
  const leadForm = document.getElementById('leadFormHidden');
  if (leadForm) {
    (leadForm as HTMLElement).style.display = 'block';
    leadForm.scrollIntoView({ behavior: 'smooth' });
  }
}

// ============================================================
// INIT
// ============================================================

function init(): void {
  // Apply barrio preset if present in URL
  if (presetBarrio) {
    // Pre-select the barrio's age
    const agePreset = BARRIO_TO_AGE[presetBarrio as keyof typeof BARRIO_TO_AGE];
    if (agePreset) {
      state.data.buildingAge = agePreset;
    }
    // Inject badge
    injectBarrioBadge();
  }

  // Show step 1
  showStep(state.currentStep, state.totalSteps);

  // Bind button events
  bindNavButtons();
}

function bindNavButtons(): void {
  const nextBtn = document.getElementById('btn-next');
  const prevBtn = document.getElementById('btn-prev');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (state.currentStep === state.totalSteps) return;
      nextStep();
    });

    // Update button text based on step
    if (state.currentStep === state.totalSteps - 1) {
      nextBtn.textContent = 'Calcular Presupuesto →';
      nextBtn.classList.add('btn-calculate');
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', prevStep);
    prevBtn.style.visibility = state.currentStep === 1 ? 'hidden' : 'visible';
  }
}

// ============================================================
// PUBLIC API
// ============================================================

const BilbaoCalc: BilbaoCalcPublicAPI = {
  nextStep,
  prevStep,
  goToStep,
  updateSqm: doUpdateSqm,
  updateBuildingAge: doUpdateBuildingAge,
  updateQuality: doUpdateQuality,
  toggleReformType: doToggleReformType,
  selectScope: doSelectScope,
  updateReformTypes: (types: ReformTypeKey[]) => {
    types.forEach((type) => {
      if (!state.data.reformTypes.includes(type)) {
        state.data.reformTypes.push(type);
      }
    });
    state.data.reformScope = null;
    state.ui.isCalculated = false;
    recalculate();
  },
  updateReformScope: (scope: ReformScopeKey) => {
    state.data.reformTypes = [];
    state.data.reformScope = scope;
    state.ui.isCalculated = false;
    recalculate();
  },
  toggleExtra: doToggleExtra,
  updateExtra: doUpdateExtra,
  calculateAndShowResult,
  restart,
  downloadPDF,
  requestQuotes,
  init,
};

// Expose globally
if (typeof window !== 'undefined') {
  (window as any).BilbaoCalc = BilbaoCalc;
}

export default BilbaoCalc;
export {
  state,
  nextStep,
  prevStep,
  goToStep,
  doUpdateSqm,
  doUpdateBuildingAge,
  doUpdateQuality,
  doToggleReformType,
  doSelectScope,
  doToggleExtra,
  calculateAndShowResult,
  restart,
  downloadPDF,
  requestQuotes,
  init,
  setRegion,
};
