/**
 * Bilbao Reforma Calculadora — Calculator Logic
 * Pure vanilla JavaScript, no frameworks
 *
 * Data sourced from SPEC.md — Bilbao 2025 prices
 */

import { DATASET_VALIDATED } from './datasetValidated.js';

(function() {
  'use strict';

  // ============================================================
  // HELPERS — datasetValidated compatibility
  // ============================================================

  // Helper: extraer rango de bathroom/kitchen desde datasetValidated
  // datasetValidated tiene variants{} anidados, calculator.js espera min/max planos
  function getRoomRangeFromDataset(typeKey) {
    const typeData = DATASET_VALIDATED.reformType[typeKey];
    if (!typeData) return null;
    // Si ya tiene min/max directo (legacy), usar esos
    if (typeData.min !== undefined && typeData.max !== undefined) {
      return { min: typeData.min, max: typeData.max };
    }
    // Si tiene variants, promediar el rango global
    if (typeData.variants) {
      const variantKeys = Object.keys(typeData.variants);
      let min = Infinity, max = 0;
      variantKeys.forEach(k => {
        const v = typeData.variants[k];
        if (v.min !== undefined && v.min < min) min = v.min;
        if (v.max !== undefined && v.max > max) max = v.max;
        // variants con minTotal/maxTotal (bathroom)
        if (v.minTotal !== undefined && v.minTotal < min) min = v.minTotal;
        if (v.maxTotal !== undefined && v.maxTotal > max) max = v.maxTotal;
      });
      if (min !== Infinity && max > 0) return { min, max };
    }
    return null;
  }

  // ============================================================
  // CONSTANTS — Bilbao 2025 Price Data
  // ============================================================

  const bathroomRange = getRoomRangeFromDataset('bathroom') || { min: 3000, max: 12000 };
  const kitchenRange = getRoomRangeFromDataset('kitchen') || { min: 5000, max: 16000 };

  const PRICE_DATA = {
    // €/m² ranges by reform type — sourced from datasetValidated
    reformType: {
      painting:   { label: 'Pintura',         minPerSqm: 8,   maxPerSqm: 20,  unit: 'm²',  basePerSqm: 14 },
      flooring:   { label: 'Suelo',           minPerSqm: 25,  maxPerSqm: 130, unit: 'm²',  basePerSqm: 65 },
      bathroom:   { label: 'Baño completo',   min: 2500,      max: 20000,     unit: 'ud',   basePerSqm: 0 },
      kitchen:    { label: 'Cocina',          min: 5000,      max: 16000,     unit: 'ud',   basePerSqm: 0 }
    },

    // €/m² by reform scope (full reform) — sourced from DATASET_VALIDATED
    reformScope: DATASET_VALIDATED.reformScope,

    // Quality multipliers — sourced from DATASET_VALIDATED
    qualityMultiplier: DATASET_VALIDATED.qualityMultiplier,

    // Building age multipliers — sourced from DATASET_VALIDATED
    ageMultiplier: DATASET_VALIDATED.ageMultiplier,

    // Extra costs — sourced from datasetValidated (averages)
    extras: {
      windows:        { label: 'Ventanas PVC',        type: 'per-unit', defaultQty: 4,  min: 350, max: 700, default: 525, unit: 'ventana' },
      terrace:        { label: 'Terraza/Balcón',      type: 'per-sqm',  defaultQty: 10, min: 250, max: 550, default: 400, unit: 'm²' },
      radiantFloor:   { label: 'Suelo radiante',      type: 'per-sqm',  defaultQty: 1,  min: 70,  max: 140, default: 105, unit: 'm²' },
      demolition:     { label: 'Demolición tabiques', type: 'per-sqm',  defaultQty: 0,  min: 22,  max: 35,  default: 28,  unit: 'm²' },
      domotics:       { label: 'Domótica',            type: 'flat',     defaultQty: 1,  min: 1000,max: 3000, default: 2000, unit: 'ud' },
      aerothermia:    { label: 'Aerotermia',          type: 'flat',     defaultQty: 1,  min: 4500,max: 10000, default: 7250, unit: 'ud' }
    },

    // Quality-based ranges for room calculations (economic/medium/premium)
    roomQualityRanges: {
      bathroom: {
        economic: { min: 2500, max: 7500 },
        medium:   { min: 5500, max: 12000 },
        premium:  { min: 9000, max: 20000 }
      },
      kitchen: {
        basic:    { min: 5000, max: 6000 },
        medium:   { min: 8000, max: 10000 },
        premium:  { min: 12000, max: 16000 }
      }
    },

    // Contingency
    contingencyPercent: 0.15
  };

  // Preset m² values
  const SQM_PRESETS = [
    { label: 'Estudio (~45m²)', value: 45 },
    { label: 'Piso 2 hab (~70m²)', value: 70 },
    { label: 'Piso 3 hab (~90m²)', value: 90 },
    { label: 'Piso 4 hab (~110m²)', value: 110 },
    { label: 'Ático (~120m²)', value: 120 }
  ];

  // ============================================================
  // STATE
  // ============================================================

  const state = {
    currentStep: 1,
    totalSteps: 6,
    
    // Form data
    data: {
      // Step 1: Reform type(s)
      reformTypes: [], // ['painting', 'flooring'] etc.
      reformScope: null, // 'basic', 'medium', 'integral', 'luxury'
      
      // Step 2: Surface area
      sqm: 80,
      
      // Step 3: Building age
      buildingAge: 'new', // 'new', 'moderate', 'old', 'historic'
      
      // Step 4: Quality level
      quality: 'medium', // 'basic', 'medium', 'premium'
      
      // Step 5: Extras
      extras: {}, // { windows: { qty: 4, checked: true }, ... }
      
      // Step 5: Contingency toggle
      contingencyEnabled: true
    },
    
    // UI state
    ui: {
      isLoading: false,
      errors: {},
      isCalculated: false
    },
    
    // Result cache
    result: null
  };

  // ============================================================
  // CALCULATION ENGINE
  // ============================================================

  function calculate() {
    const { data } = state;
    
    // If individual rooms selected (not a full scope reform)
    if (data.reformTypes.length > 0 && !data.reformScope) {
      return calculateByRooms(data);
    }
    
    // If full reform scope selected
    if (data.reformScope) {
      return calculateByScope(data);
    }
    
    return null;
  }

  function calculateByRooms(data) {
    const { reformTypes, sqm, quality, buildingAge, extras } = data;
    const qualityMult = PRICE_DATA.qualityMultiplier[quality]?.multiplier || 1;
    const ageMult = PRICE_DATA.ageMultiplier[buildingAge]?.multiplier || 1;
    
    const breakdown = [];
    let subtotalLow = 0;
    let subtotalHigh = 0;
    
    // Calculate each selected room type
    if (reformTypes.includes('painting')) {
      const base = PRICE_DATA.reformType.painting;
      const minRate = Math.max(base.minPerSqm * qualityMult, 8); // clamp min to 8
      const maxRate = base.maxPerSqm * qualityMult;
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
        highTotal: Math.round(high)
      });
    }
    
    if (reformTypes.includes('flooring')) {
      const base = PRICE_DATA.reformType.flooring;
      // Use quality to determine flooring type pricing
      const qualityKey = quality || 'medium';
      let floorLow, floorHigh;

      if (qualityKey === 'basic') {
        const minRate = Math.max(25, 25 * qualityMult); // clamp min to 25
        floorLow = sqm * minRate;
        floorHigh = sqm * 35 * qualityMult;
      } else if (qualityKey === 'medium') {
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
        highTotal: Math.round(floorHigh)
      });
    }
    
    if (reformTypes.includes('bathroom')) {
      const base = PRICE_DATA.reformType.bathroom;
      const ranges = PRICE_DATA.roomQualityRanges.bathroom;
      let roomRange;
      if (quality === 'basic') {
        roomRange = ranges.economic;
      } else if (quality === 'premium') {
        roomRange = ranges.premium;
      } else {
        roomRange = ranges.medium;
      }
      const low = roomRange.min;
      const high = roomRange.max;
      subtotalLow += low;
      subtotalHigh += high;
      breakdown.push({
        item: base.label,
        qty: 1,
        unit: 'ud',
        lowRate: Math.round(low),
        highRate: Math.round(high),
        lowTotal: Math.round(low),
        highTotal: Math.round(high)
      });
    }
    
    if (reformTypes.includes('kitchen')) {
      const base = PRICE_DATA.reformType.kitchen;
      const ranges = PRICE_DATA.roomQualityRanges.kitchen;
      let roomRange;
      if (quality === 'basic') {
        roomRange = ranges.basic;
      } else if (quality === 'premium') {
        roomRange = ranges.premium;
      } else {
        roomRange = ranges.medium;
      }
      const low = roomRange.min;
      const high = roomRange.max;
      subtotalLow += low;
      subtotalHigh += high;
      breakdown.push({
        item: base.label,
        qty: 1,
        unit: 'ud',
        lowRate: Math.round(low),
        highRate: Math.round(high),
        lowTotal: Math.round(low),
        highTotal: Math.round(high)
      });
    }
    
    // Apply building age multiplier
    subtotalLow *= ageMult;
    subtotalHigh *= ageMult;
    
    // Add extras
    const extrasResult = calculateExtras(extras, sqm);
    subtotalLow += extrasResult.low;
    subtotalHigh += extrasResult.high;
    breakdown.push(...extrasResult.breakdown);
    
    // Apply contingency (only if enabled)
    if (state.data.contingencyEnabled) {
      const contingencyLow = subtotalLow * PRICE_DATA.contingencyPercent;
      const contingencyHigh = subtotalHigh * PRICE_DATA.contingencyPercent;
      breakdown.push({
        item: 'Imprevistos (15%)',
        qty: 1,
        unit: 'ud',
        lowRate: Math.round(contingencyLow),
        highRate: Math.round(contingencyHigh),
        lowTotal: Math.round(contingencyLow),
        highTotal: Math.round(contingencyHigh)
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
      type: 'rooms'
    };
  }

  function calculateByScope(data) {
    const { reformScope, sqm, quality, buildingAge, extras } = data;
    const scopeData = PRICE_DATA.reformScope[reformScope];
    const qualityMult = PRICE_DATA.qualityMultiplier[quality]?.multiplier || 1;
    const ageMult = PRICE_DATA.ageMultiplier[buildingAge]?.multiplier || 1;
    
    const breakdown = [];
    
    // Base calculation €/m²
    const baseLowPerSqm = scopeData.minPerSqm * qualityMult;
    const baseHighPerSqm = scopeData.maxPerSqm * qualityMult;
    const baseLow = sqm * baseLowPerSqm;
    const baseHigh = sqm * baseHighPerSqm;
    
    // Apply age multiplier to base
    const baseLowAge = baseLow * ageMult;
    const baseHighAge = baseHigh * ageMult;
    
    breakdown.push({
      item: scopeData.label,
      qty: sqm,
      unit: 'm²',
      lowRate: Math.round(baseLowPerSqm),
      highRate: Math.round(baseHighPerSqm),
      lowTotal: Math.round(baseLowAge),
      highTotal: Math.round(baseHighAge)
    });
    
    let subtotalLow = baseLowAge;
    let subtotalHigh = baseHighAge;
    
    // Add extras
    const extrasResult = calculateExtras(extras, sqm);
    subtotalLow += extrasResult.low;
    subtotalHigh += extrasResult.high;
    breakdown.push(...extrasResult.breakdown);
    
    // Apply contingency (only if enabled)
    if (state.data.contingencyEnabled) {
      const contingencyLow = subtotalLow * PRICE_DATA.contingencyPercent;
      const contingencyHigh = subtotalHigh * PRICE_DATA.contingencyPercent;
      breakdown.push({
        item: 'Imprevistos (15%)',
        qty: 1,
        unit: 'ud',
        lowRate: Math.round(contingencyLow),
        highRate: Math.round(contingencyHigh),
        lowTotal: Math.round(contingencyLow),
        highTotal: Math.round(contingencyHigh)
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
      type: 'scope'
    };
  }

  function calculateExtras(extras, sqm) {
    const breakdown = [];
    let low = 0;
    let high = 0;
    
    for (const [key, extra] of Object.entries(extras)) {
      if (!extra.checked) continue;
      
      const extraData = PRICE_DATA.extras[key];
      if (!extraData) continue;
      
      const qty = extra.qty || extraData.defaultQty;
      
      // Skip extras with no valid quantity
      if (qty <= 0) {
        continue;
      }
      
      let itemLow, itemHigh;
      
      if (extraData.type === 'per-sqm') {
        itemLow = qty * extraData.min;
        itemHigh = qty * extraData.max;
      } else if (extraData.type === 'per-unit') {
        itemLow = qty * extraData.min;
        itemHigh = qty * extraData.max;
      } else { // flat
        itemLow = extraData.min;
        itemHigh = extraData.max;
      }
      
      low += itemLow;
      high += itemHigh;
      
      breakdown.push({
        item: extraData.label,
        qty: qty,
        unit: extraData.unit,
        lowRate: Math.round(itemLow / qty),
        highRate: Math.round(itemHigh / qty),
        lowTotal: Math.round(itemLow),
        highTotal: Math.round(itemHigh)
      });
    }
    
    return { low, high, breakdown };
  }

  // ============================================================
  // VALIDATION
  // ============================================================

  function validateStep(step) {
    const errors = {};
    const { data } = state;
    
    switch (step) {
      case 1:
        if (data.reformTypes.length === 0 && !data.reformScope) {
          errors.reformType = 'Selecciona al menos un tipo de reforma';
        }
        break;
      case 2:
        if (!data.sqm || data.sqm < 20 || data.sqm > 500) {
          errors.sqm = 'Introduce una superficie válida (20-500 m²)';
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
      // Step 5 (extras) is optional, no validation needed
    }
    
    state.ui.errors = errors;
    return Object.keys(errors).length === 0;
  }

  // ============================================================
  // WIZARD NAVIGATION
  // ============================================================

  function nextStep() {
    // console.log('nextStep called, currentStep:', state.currentStep, 'state:', JSON.stringify(state.data));
    if (!validateStep(state.currentStep)) {
      // console.log('validation failed');
      return false;
    }
    
    if (state.currentStep < state.totalSteps) {
      state.currentStep++;
      // console.log('advancing to step', state.currentStep);
      showStep(state.currentStep);
      document.getElementById('step' + state.currentStep).scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    }
    return false;
  }

  function prevStep() {
    if (state.currentStep > 1) {
      state.currentStep--;
      showStep(state.currentStep);
      document.getElementById('step' + state.currentStep).scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    }
    return false;
  }

  function goToStep(step) {
    // Step 1 is always accessible without validation (no data required)
    if (step === 1) {
      state.currentStep = step;
      showStep(state.currentStep);
      return true;
    }
    if (step >= 1 && step <= state.totalSteps) {
      // Validate all previous steps
      for (let i = 1; i < step; i++) {
        if (!validateStep(i)) {
          state.currentStep = i;
          // Error display not implemented for static HTML
          showStep(state.currentStep);
          return false;
        }
      }
      state.currentStep = step;
      showStep(state.currentStep);
      return true;
    }
    return false;
  }

  // ============================================================
  // DATA UPDATES
  // ============================================================

  function updateReformTypes(types) {
    state.data.reformTypes = types;
    state.ui.isCalculated = false;
    recalculate();
  }

  function updateReformScope(scope) {
    state.data.reformScope = scope;
    state.ui.isCalculated = false;
    recalculate();
  }

  function updateSqm(sqm) {
    const val = parseInt(sqm, 10);
    if (!isNaN(val) && val >= 20 && val <= 500) {
      state.data.sqm = val;
      state.ui.errors.sqm = null;
      // Update slider and display to match
      const slider = document.getElementById('metersSlider');
      const display = document.getElementById('metersDisplayValue');
      const input = document.getElementById('metersInput');
      if (slider) slider.value = val;
      if (display) display.textContent = val;
      if (input) input.value = val;
      recalculate();
    }
  }

  function updateBuildingAge(age) {
    state.data.buildingAge = age;
    state.ui.errors.buildingAge = null;
    // Update visual selection for age options (step 3)
    document.querySelectorAll('.age-option').forEach(function(el) {
      const elAge = el.getAttribute('data-age');
      if (elAge === age) {
        el.classList.add('selected');
        el.setAttribute('aria-pressed', 'true');
      } else {
        el.classList.remove('selected');
        el.setAttribute('aria-pressed', 'false');
      }
    });
    recalculate();
  }

  function updateQuality(quality) {
    state.data.quality = quality;
    state.ui.errors.quality = null;
    // Update visual selection for quality cards
    document.querySelectorAll('.quality-card').forEach(function(el) {
      const elQuality = el.getAttribute('data-quality');
      // elQuality is already API key: 'basic', 'medium', 'premium' (from JS rendering)
      // or Spanish: 'basica', 'media', 'premium' (from HTML static)
      // Map Spanish to API if needed
      const qualityMap = { 'basica': 'basic', 'media': 'medium', 'premium': 'premium' };
      const apiQuality = qualityMap[elQuality] || elQuality;
      if (apiQuality === quality) {
        el.classList.add('selected');
        el.setAttribute('aria-pressed', 'true');
      } else {
        el.classList.remove('selected');
        el.setAttribute('aria-pressed', 'false');
      }
    });
    recalculate();
  }

  function updateExtra(key, checked, qty) {
    // Guard: if key not in PRICE_DATA.extras, create a safe default object without crashing
    if (!PRICE_DATA.extras[key]) {
      state.data.extras[key] = { checked: checked, qty: qty !== undefined ? qty : 0 };
      return;
    }
    if (!state.data.extras[key]) {
      state.data.extras[key] = { checked: false, qty: 0 };
    }
    state.data.extras[key].checked = checked;
    state.data.extras[key].qty = qty !== undefined ? qty : PRICE_DATA.extras[key].defaultQty;
    recalculate();
  }

  function recalculate() {
    state.ui.isLoading = true;
    showStep(state.currentStep); // Show current step (loading state handled by step 6)
    
    // Simulate async calculation for UX
    setTimeout(() => {
      state.result = calculate();
      state.ui.isCalculated = true;
      state.ui.isLoading = false;
      showStep(state.currentStep);
    }, 150);
  }

  // ============================================================
  // NAVIGATION — Static HTML version
  // ============================================================

  function updateNavigationState() {
    // Step 1: enable Next only when reform is selected
    const step1Next = document.getElementById('step1Next');
    if (step1Next) {
      const hasSelection = state.data.reformScope || state.data.reformTypes.length > 0;
      step1Next.disabled = !hasSelection;
    }
  }

  function updateResultDisplay() {
    const result = state.result;
    if (!result) return;
    const data = state.data;
    
    // Update price range
    const lowEl = document.querySelector('.result-range-low');
    const highEl = document.querySelector('.result-range-high');
    const titlePriceEl = document.querySelector('.result-title-price');
    if (lowEl) lowEl.textContent = result.low.toLocaleString('es-ES') + ' €';
    if (highEl) highEl.textContent = result.high.toLocaleString('es-ES') + ' €';
    if (titlePriceEl) titlePriceEl.textContent = result.low.toLocaleString('es-ES') + ' € y ' + result.high.toLocaleString('es-ES') + ' €';
    
    // Update comparison
    const compValueEl = document.querySelector('.result-comparison-value');
    if (compValueEl) compValueEl.textContent = result.avgPerSqm + ' €/m²';

    // Texto dinámico para la etiqueta de comparación Bilbao
    const reformTypeLabel = data.reformScope
      ? PRICE_DATA.reformScope[data.reformScope].label.toLowerCase()
      : (data.reformTypes.length === 1
        ? PRICE_DATA.reformType[data.reformTypes[0]]?.label.toLowerCase()
        : 'múltiples estancias');
    const ageLabelText = PRICE_DATA.ageMultiplier[data.buildingAge]?.label || '';
    const comparisonLabelEl = document.querySelector('.result-comparison-label');
    if (comparisonLabelEl) {
      comparisonLabelEl.textContent = `para ${reformTypeLabel} en edificio ${ageLabelText}`;
    }

    // Update subtitle with reform type and sqm
    const subtitleEl = document.querySelector('.result-subtitle');
    if (subtitleEl) {
      const typeLabel = data.reformScope ? PRICE_DATA.reformScope[data.reformScope].label : data.reformTypes.map(t => PRICE_DATA.reformType[t]?.label).join(', ');
      subtitleEl.textContent = 'Estimación para un piso de ' + data.sqm + 'm² con ' + (typeLabel || 'reforma');
    }
    
    // Update breakdown bars — percentage relative to TOTAL (sum of all items)
    const breakdownContainer = document.getElementById('resultBreakdownBars');
    if (breakdownContainer && result.breakdown) {
      const totalHigh = result.breakdown.reduce(function(sum, item) { return sum + item.highTotal; }, 0);
      let barsHTML = '';
      result.breakdown.forEach(function(item) {
        const pct = totalHigh > 0 ? Math.round((item.highTotal / totalHigh) * 100) : 0;
        const itemAvg = Math.round((item.lowTotal + item.highTotal) / 2);
        barsHTML += '<div class="breakdown-bar">';
        barsHTML += '<div class="breakdown-bar-header">';
        barsHTML += '<span class="breakdown-bar-label">' + item.item + '</span>';
        barsHTML += '<span class="breakdown-bar-value">' + pct + '% · ~' + itemAvg.toLocaleString('es-ES') + ' €</span>';
        barsHTML += '</div>';
        barsHTML += '<div class="breakdown-bar-track">';
        barsHTML += '<div class="breakdown-bar-fill" style="width: ' + pct + '%"></div>';
        barsHTML += '</div>';
        barsHTML += '</div>';
      });
      breakdownContainer.innerHTML = barsHTML;
    }

    // Update Chart.js doughnut chart
    updateBreakdownChart(result.breakdown);
  }

  function updateBreakdownChart(breakdown) {
    const canvas = document.getElementById('breakdownChart');
    if (!canvas) return;

    // Destroy existing chart if any
    if (window.breakdownChartInstance) {
      window.breakdownChartInstance.destroy();
    }

    // Prepare data — filter out contingency for cleaner chart
    const chartData = breakdown.filter(item => !item.item.includes('Imprevistos'));
    const total = chartData.reduce((sum, item) => sum + item.highTotal, 0);

    if (chartData.length === 0 || total === 0) return;

    // Color palette matching CSS breakdown-bar-fill colors
    const colors = [
      '#C45C3E', // terracota - bathroom
      '#7D8B6A', // verde-montana - kitchen
      '#C4B8A8', // beige/suelo
      '#E8D5C4', // pintura
      '#A8B8A4', // instalaciones
      '#8B7355'  // other extras
    ];

    const labels = chartData.map(item => item.item);
    const values = chartData.map(item => item.highTotal);
    const percentages = chartData.map(item => Math.round((item.highTotal / total) * 100));

    // Update bars with color classes and percentage labels
    const breakdownContainer = document.getElementById('resultBreakdownBars');
    if (breakdownContainer) {
      let barsHTML = '';
      chartData.forEach(function(item, idx) {
        const pct = percentages[idx];
        const itemAvg = Math.round((item.lowTotal + item.highTotal) / 2);
        const colorClass = ['bano', 'cocina', 'suelo', 'pintura', 'instalaciones', 'imprevistos'][idx % 6];
        barsHTML += '<div class="breakdown-bar">';
        barsHTML += '<div class="breakdown-bar-header">';
        barsHTML += '<span class="breakdown-bar-label">' + item.item + '</span>';
        barsHTML += '<span class="breakdown-bar-value">' + pct + '% · ~' + itemAvg.toLocaleString('es-ES') + ' €</span>';
        barsHTML += '</div>';
        barsHTML += '<div class="breakdown-bar-track">';
        barsHTML += '<div class="breakdown-bar-fill ' + colorClass + '" style="width: ' + pct + '%"></div>';
        barsHTML += '</div>';
        barsHTML += '</div>';
      });
      // Add contingency back to bars if present
      const contingency = breakdown.find(item => item.item.includes('Imprevistos'));
      if (contingency) {
        const pct = Math.round((contingency.highTotal / total) * 100);
        const itemAvg = Math.round((contingency.lowTotal + contingency.highTotal) / 2);
        barsHTML += '<div class="breakdown-bar">';
        barsHTML += '<div class="breakdown-bar-header">';
        barsHTML += '<span class="breakdown-bar-label">Imprevistos (15%)</span>';
        barsHTML += '<span class="breakdown-bar-value">' + pct + '% · ~' + itemAvg.toLocaleString('es-ES') + ' €</span>';
        barsHTML += '</div>';
        barsHTML += '<div class="breakdown-bar-track">';
        barsHTML += '<div class="breakdown-bar-fill imprevistos" style="width: ' + pct + '%"></div>';
        barsHTML += '</div>';
        barsHTML += '</div>';
      }
      breakdownContainer.innerHTML = barsHTML;
    }

    // Create doughnut chart
    window.breakdownChartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, chartData.length),
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '60%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const idx = context.dataIndex;
                const pct = percentages[idx];
                const value = values[idx].toLocaleString('es-ES');
                return context.label + ': ' + value + ' € (' + pct + '%)';
              }
            }
          }
        }
      }
    });
  }

  function showStep(step) {
    // Hide all wizard steps
    document.querySelectorAll('.wizard-step').forEach(function(el) {
      el.classList.remove('active');
    });
    // Show target step
    const stepEl = document.getElementById('step' + step);
    if (stepEl) {
      stepEl.classList.add('active');
    }
    // Update progress bar fill width
    const fill = document.getElementById('progressBarFill');
    if (fill) {
      fill.style.width = ((step - 1) / (state.totalSteps - 1) * 100) + '%';
    }
    // Update progress step indicators (active class)
    document.querySelectorAll('.progress-step').forEach(function(el) {
      const elStep = parseInt(el.getAttribute('data-step'), 10);
      if (elStep === step) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    // If showing result step, update with calculated values
    if (step === 6) {
      // Ensure result is calculated
      if (!state.result) {
        state.result = calculate();
      }
      updateResultDisplay();
    }
    // Update button states
    updateNavigationState();
  }

  // ============================================================
  // HELPERS
  // ============================================================

  function formatCurrency(num) {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }

  function getScopeIcon(key) {
    const icons = {
      basic: '🏠',
      medium: '🏡',
      integral: '🏗️',
      luxury: '✨'
    };
    return icons[key] || '📋';
  }

  function getRoomIcon(key) {
    const icons = {
      painting: '🎨',
      flooring: '🪵',
      bathroom: '🚿',
      kitchen: '🍳'
    };
    return icons[key] || '📋';
  }

  // ============================================================
  // EVENT BINDINGS
  // ============================================================

  function bindNavigationEvents() {
    const nextBtn = document.getElementById('btn-next');
    const prevBtn = document.getElementById('btn-prev');
    
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (state.currentStep === state.totalSteps) {
          // On final step, just stay (result is shown)
          return;
        }
        nextStep();
      };
      
      // Update button text based on step
      if (state.currentStep === state.totalSteps - 1) {
        nextBtn.textContent = 'Calcular Presupuesto →';
        nextBtn.classList.add('btn-calculate');
      } else {
        nextBtn.textContent = 'Siguiente →';
        nextBtn.classList.remove('btn-calculate');
      }
    }
    
    if (prevBtn) {
      prevBtn.style.visibility = state.currentStep === 1 ? 'hidden' : 'visible';
      prevBtn.onclick = prevStep;
    }
  }

  // ============================================================
  // CALLBACKS (to be implemented externally or as placeholders)
  // ============================================================

  function generatePDF() {
    const result = state.result;
    if (!result) {
      alert('Calcula tu presupuesto primero.');
      return;
    }

    const data = state.data;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Collect client name from lead form if present in DOM
    let clientName = '';
    var nameInput = document.getElementById('leadName');
    if (nameInput && nameInput.value && nameInput.value.trim()) {
      clientName = nameInput.value.trim();
    }

    // Format today's date
    const today = new Date();
    const dateStr = today.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Generate budget number
    const budgetNum = 'BR-' + today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0') + '-' +
      String(Math.floor(Math.random() * 900) + 100);

    const qualityLabel = PRICE_DATA.qualityMultiplier[data.quality]?.label || 'No especificada';
    const ageLabel = PRICE_DATA.ageMultiplier[data.buildingAge]?.label || 'No especificada';
    const reformLabel = data.reformScope
      ? PRICE_DATA.reformScope[data.reformScope].label
      : data.reformTypes.map(t => PRICE_DATA.reformType[t]?.label).join(', ');

    // Colors
    const TERRACOTA = [196, 92, 62];
    const DARK = [45, 45, 45];
    const GRAY = [100, 100, 100];
    const LIGHT_GRAY = [245, 245, 245];

    // Margins and layout
    const margin = 20;
    const pageW = 210;
    const contentW = pageW - margin * 2;
    let y = margin;

    // ===== HEADER =====
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

    // Budget info (right side)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.text(budgetNum, pageW - margin, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text('Fecha: ' + dateStr, margin, y + 11);
    doc.text('Validez: 30 días', margin, y + 16);

    y += 22;

    // ===== TITLE =====
    doc.setFont('helvetica', 'light');
    doc.setFontSize(20);
    doc.setTextColor(...TERRACOTA);
    doc.text('PRESUPUESTO DE REFORMA', pageW / 2, y, { align: 'center' });
    y += 14;

    // ===== META GRID =====
    const metaH = 28;
    const halfW = contentW / 2 - 4;

    // Left box - client/project
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

    // Right box - project data
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

    // ===== TABLE HEADER =====
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

    // ===== TABLE BODY =====
    const tableStartY = y;
    let subtotalLow = 0;
    let subtotalHigh = 0;

    result.breakdown.forEach(function(item, idx) {
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

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(item.qty + ' ' + item.unit, colCantidad + 3, y + 5);

      doc.text(avgRate.toLocaleString('es-ES') + ' €', colEurUd + 3, y + 5);

      doc.setTextColor(...DARK);
      doc.text(avgTotal.toLocaleString('es-ES') + ' €', colTotal + 3, y + 5);

      y += 7;
    });

    tableStartY && tableStartY; // suppress unused warning

    // ===== TOTALS BOX =====
    y += 4;
    const totalsX = pageW - margin - 80;
    const totalsW = 80;

    const subtotal = Math.round((result.low + result.high) / 2);
    const iva = Math.round(subtotal * 0.10);
    const total = subtotal + iva;

    const fmt = function(n) { return n.toLocaleString('es-ES') + ' €'; };

    function drawTotalsRow(label, value, bgColor, fontSize, textColor) {
      doc.setFillColor(...(bgColor || LIGHT_GRAY));
      doc.rect(totalsX, y, totalsW, 7, 'F');
      doc.setFont('helvetica', fontSize === 11 ? 'bold' : 'normal');
      doc.setFontSize(fontSize || 9);
      doc.setTextColor(...(textColor || GRAY));
      doc.text(label, totalsX + 4, y + 5);
      doc.setTextColor(...(textColor || DARK));
      doc.text(value, totalsX + totalsW - 4, y + 5, { align: 'right' });
      y += 7;
    }

    drawTotalsRow('Subtotal (sin IVA)', fmt(subtotal), LIGHT_GRAY, 9, GRAY);
    drawTotalsRow('IVA (10%)', fmt(iva), LIGHT_GRAY, 9, GRAY);
    drawTotalsRow('TOTAL', fmt(total), TERRACOTA, 12, [255, 255, 255]);

    y += 8;

    // ===== NOTE BOX =====
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

    // ===== CONDITIONS =====
    const condY = y;
    const condItems = [
      'Precios/m² orientativos',
      'Plazo a confirmar',
      'Sin compromiso',
      'Bilbao y provincia'
    ];

    doc.setFontSize(8);
    let condX = margin;
    condItems.forEach(function(item) {
      doc.setFillColor(244, 244, 244);
      const itemW = doc.getTextWidth(item) + 8;
      doc.roundedRect(condX, condY, itemW, 7, 1, 1, 'F');
      doc.setTextColor(...GRAY);
      doc.text(item, condX + 4, condY + 4.5);
      condX += itemW + 3;
    });

    y = condY + 14;

    // ===== FOOTER =====
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text('bilbaoreforma.es · bilbaoreforma@gmail.com', pageW / 2, y, { align: 'center' });
    y += 3.5;
    doc.setFontSize(7);
    doc.text('Este documento es una estimación orientativa y no constituye una oferta contractual.', pageW / 2, y, { align: 'center' });
    y += 3.5;
    doc.text('Presupuesto generado automáticamente · ' + dateStr, pageW / 2, y, { align: 'center' });

    // ===== SAVE =====
    doc.save('presupuesto-' + budgetNum + '.pdf');
  }

  function showLeadForm() {
    const leadForm = document.getElementById('leadFormHidden');
    if (leadForm) {
      leadForm.style.display = 'block';
      leadForm.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ============================================================
  // PUBLIC API
  // ============================================================

  window.BilbaoCalc = {
    // Navigation
    nextStep,
    prevStep,
    goToStep,
    
    // Data updates
    updateSqm,
    updateBuildingAge,
    updateQuality,
    toggleReformType: function(type) {
      const types = state.data.reformTypes;
      const idx = types.indexOf(type);
      if (idx === -1) {
        types.push(type);
      } else {
        types.splice(idx, 1);
      }
      // Clear scope when selecting individual types
      state.data.reformScope = null;
      state.ui.isCalculated = false;
      // Update visual — handle both HTML static (data-reform) and JS rendering (data-type)
      document.querySelectorAll('.card[data-type], [data-reform]').forEach(function(el) {
        const elType = el.getAttribute('data-type') || el.getAttribute('data-reform');
        // Map Spanish HTML labels to API types for HTML static cards
        const typeMap = { 'pintura': 'painting', 'suelo': 'flooring', 'bano': 'bathroom', 'cocina': 'kitchen' };
        const apiType = typeMap[elType] || elType; // use elType directly if already API key
        if (types.indexOf(apiType) !== -1) {
          el.classList.add('selected');
          el.setAttribute('aria-pressed', 'true');
        } else {
          el.classList.remove('selected');
          el.setAttribute('aria-pressed', 'false');
        }
      });
      // Deselect scope cards when individual types are selected
      document.querySelectorAll('[data-scope]').forEach(function(el) {
        el.classList.remove('selected');
        el.setAttribute('aria-pressed', 'false');
      });
      recalculate();
    },
    selectScope: function(scope) {
      state.data.reformTypes = [];
      state.data.reformScope = scope;
      state.ui.isCalculated = false;
      // Update visual: select scope card, deselect individual type cards
      document.querySelectorAll('[data-scope]').forEach(function(el) {
        const elScope = el.getAttribute('data-scope');
        if (elScope === scope) {
          el.classList.add('selected');
          el.setAttribute('aria-pressed', 'true');
        } else {
          el.classList.remove('selected');
          el.setAttribute('aria-pressed', 'false');
        }
      });
      // Deselect individual reform type cards when scope is selected
      document.querySelectorAll('.type-card[data-reform]').forEach(function(el) {
        el.classList.remove('selected');
        el.setAttribute('aria-pressed', 'false');
      });
      recalculate();
    },
    updateReformTypes: function(types) {
      // Set reform types directly (replaces any existing)
      types.forEach(function(type) {
        if (state.data.reformTypes.indexOf(type) === -1) {
          state.data.reformTypes.push(type);
        }
      });
      state.data.reformScope = null;
      state.ui.isCalculated = false;
      recalculate();
    },
    updateReformScope: function(scope) {
      state.data.reformTypes = [];
      state.data.reformScope = scope;
      state.ui.isCalculated = false;
      recalculate();
    },
    toggleExtra: function(key) {
      const current = state.data.extras[key];
      const isChecked = current && current.checked;
      // Use existing qty from state, or defaultQty from PRICE_DATA
      const qty = current && current.qty ? current.qty : (PRICE_DATA.extras[key] ? PRICE_DATA.extras[key].defaultQty : 1);
      updateExtra(key, !isChecked, qty);
      // Update DOM: toggle aria-pressed and selected class on the checkbox item
      const el = document.querySelector('.extra-checkbox-item[data-extra="' + key + '"]');
      if (el) {
        el.classList.toggle('selected', !isChecked);
        el.setAttribute('aria-pressed', !isChecked ? 'true' : 'false');
      }
    },
    toggleContingency: function(el) {
      // Toggle contingency on/off
      state.data.contingencyEnabled = !state.data.contingencyEnabled;
      if (el) {
        el.classList.toggle('active', state.data.contingencyEnabled);
        el.setAttribute('aria-checked', state.data.contingencyEnabled ? 'true' : 'false');
      }
      recalculate();
    },
    toggleExtraOnly: function(key) {
      // Toggle by key only (reads from state)
      const current = state.data.extras[key];
      const isChecked = current && current.checked;
      const qty = current && current.qty ? current.qty : (PRICE_DATA.extras[key] ? PRICE_DATA.extras[key].defaultQty : 1);
      updateExtra(key, !isChecked, qty);
      // Update DOM: toggle aria-pressed and selected class on the checkbox item
      const el = document.querySelector('.extra-checkbox-item[data-extra="' + key + '"]');
      if (el) {
        el.classList.toggle('selected', !isChecked);
        el.setAttribute('aria-pressed', !isChecked ? 'true' : 'false');
      }
    },
    updateExtraQty: function(key, qty) {
      if (!PRICE_DATA.extras[key]) { return; } // Unknown extra, don't crash
      const val = parseInt(qty, 10);
      if (!state.data.extras[key]) {
        state.data.extras[key] = { checked: false, qty: 0 };
      }
      state.data.extras[key].qty = val;
      recalculate();
    },
    
    // Calculation
    recalculate,
    
    // Callbacks
    downloadPDF: generatePDF,
    requestQuotes: showLeadForm,
    showLeadForm,
    submitLead: function() {
      var nameInput = document.getElementById('leadName');
      var emailInput = document.getElementById('leadEmail');
      var phoneInput = document.getElementById('leadPhone');
      var name = nameInput ? nameInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var phone = phoneInput ? phoneInput.value.trim() : '';

      if (!name) {
        alert('Por favor, introduce tu nombre.');
        if (nameInput) nameInput.focus();
        return false;
      }
      if (!email) {
        alert('Por favor, introduce tu email.');
        if (emailInput) emailInput.focus();
        return false;
      }
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Por favor, introduce un email válido.');
        if (emailInput) emailInput.focus();
        return false;
      }

      var result = state.result;
      var data = state.data;

      var qualityLabel = PRICE_DATA.qualityMultiplier[data.quality]?.label || data.quality || 'No especificada';
      var ageLabel = PRICE_DATA.ageMultiplier[data.buildingAge]?.label || data.buildingAge || 'No especificada';

      var reformTypeLabels = [];
      if (data.reformScope) {
        reformTypeLabels.push(PRICE_DATA.reformScope[data.reformScope]?.label || data.reformScope);
      } else if (data.reformTypes && data.reformTypes.length > 0) {
        reformTypeLabels = data.reformTypes.map(function(t) { return PRICE_DATA.reformType[t]?.label || t; });
      }

      var reformTypeStr = reformTypeLabels.join(', ') || 'No especificado';

      var subtotalLow = result ? result.low : 0;
      var subtotalHigh = result ? result.high : 0;

      var extrasStr = '';
      if (data.extras) {
        var checkedExtras = Object.keys(data.extras).filter(function(k) { return data.extras[k].checked; });
        if (checkedExtras.length > 0) {
          extrasStr = '\n\n📦 EXTRAS SELECCIONADOS:\n';
          checkedExtras.forEach(function(key) {
            var extraData = PRICE_DATA.extras[key];
            var qty = data.extras[key].qty || extraData.defaultQty;
            extrasStr += '- ' + extraData.label + ': ' + qty + ' ud\n';
          });
        }
      }

      var today = new Date();
      var dateStr = today.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

      var subject = encodeURIComponent('Solicitud de Presupuesto - Reforma en Bilbao');

      var body = 'Hola Bilbao Reforma,\n\n';
      body += 'Me gustaría recibir presupuesto para mi reforma:\n\n';
      body += '📋 PROYECTO\n';
      body += 'Tipo: ' + reformTypeStr + '\n';
      body += 'Superficie: ' + data.sqm + ' m²\n';
      body += 'Antigüedad edificio: ' + ageLabel + '\n';
      body += 'Calidad: ' + qualityLabel + '\n\n';
      body += '💰 PRESUPUESTO ORIENTATIVO\n';
      body += subtotalLow.toLocaleString('es-ES') + ' € - ' + subtotalHigh.toLocaleString('es-ES') + ' € (sin IVA)\n';
      body += extrasStr + '\n';
      body += '📎 He descargado el PDF con el desglose detallado y lo adjunto a este email para mayor referencia.\n\n';
      body += 'Quedo pendiente de su contacto.\n\n';
      body += 'Un saludo\n';
      body += name + '\n';
      if (phone) body += 'Teléfono: ' + phone + '\n';
      body += 'Email: ' + email + '\n';
      body += 'Fecha solicitud: ' + dateStr + '\n';

      body = encodeURIComponent(body);

      window.location.href = 'mailto:bilbaoreforma@gmail.com?subject=' + subject + '&body=' + body;
      return true;
    },
    
    // State access (for debugging)
    getState: () => ({ ...state }),
    getResult: () => ({ ...state.result }),
    
    // Restart
    restart: function() {
      state.currentStep = 1;
      state.data = {
        reformTypes: [],
        reformScope: null,
        sqm: 80,
        buildingAge: 'new',
        quality: 'medium',
        extras: {},
        contingencyEnabled: true
      };
      state.ui = {
        isLoading: false,
        errors: {},
        isCalculated: false
      };
      state.result = null;
      showStep(1);
    }
  };

  // ============================================================
  // INITIALIZATION
  // ============================================================

  function init() {
  // Pre-seleccionar desde query params si existen
  const params = new URLSearchParams(window.location.search);
  const preset = params.get('preset');

  if (preset) {
    // Mapeo de preset → reformScope o reformTypes
    var scopePresets = { 'basic': 'basic', 'media': 'medium', 'integral': 'integral', 'premium': 'luxury' };
    var typePresets = { 'cocina': 'kitchen', 'bano': 'bathroom', 'pintura': 'painting', 'suelo': 'flooring' };

    if (scopePresets[preset]) {
      BilbaoCalc.updateReformScope(scopePresets[preset]);
    } else if (typePresets[preset]) {
      BilbaoCalc.updateReformTypes([typePresets[preset]]);
    }
  }

  // Initialize with first step visible (static HTML)
  showStep(1);
  // Bind navigation button events
  bindNavigationEvents();
  // console.log('Bilbao Calculadora initialized');
}

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
