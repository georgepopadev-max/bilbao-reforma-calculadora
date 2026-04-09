/**
 * Bilbao Reforma Calculadora — Calculator Logic
 * Pure vanilla JavaScript, no frameworks
 * 
 * Data sourced from SPEC.md — Bilbao 2025 prices
 */

(function() {
  'use strict';

  // ============================================================
  // CONSTANTS — Bilbao 2025 Price Data
  // ============================================================

  const PRICE_DATA = {
    // €/m² ranges by reform type
    reformType: {
      painting:   { label: 'Pintura',         minPerSqm: 8,   maxPerSqm: 15,  unit: 'm²',  basePerSqm: 10 },
      flooring:   { label: 'Suelo',           minPerSqm: 25,  maxPerSqm: 100, unit: 'm²',  basePerSqm: 55 },
      bathroom:   { label: 'Baño completo',   min: 3000,      max: 12000,     unit: 'ud',   basePerSqm: 0 },
      kitchen:    { label: 'Cocina',          min: 5000,      max: 16000,     unit: 'ud',   basePerSqm: 0 }
    },

    // €/m² by reform scope (full reform)
    reformScope: {
      basic:     { label: 'Reforma básica',     minPerSqm: 200, maxPerSqm: 300, basePerSqm: 250 },
      medium:    { label: 'Reforma media',       minPerSqm: 400, maxPerSqm: 500, basePerSqm: 450 },
      integral:  { label: 'Reforma integral',   minPerSqm: 600, maxPerSqm: 800, basePerSqm: 700 },
      luxury:    { label: 'Reforma lujo',       minPerSqm: 900, maxPerSqm: 1400, basePerSqm: 1150 }
    },

    // Quality multipliers
    qualityMultiplier: {
      basic:    { label: 'Básica',  multiplier: 0.8,  desc: 'Leroy Merlin, marca blanca' },
      medium:   { label: 'Media',   multiplier: 1.0,  desc: 'Cosentino, Porcelanosa gama media, Roca, Grohe' },
      premium:  { label: 'Premium', multiplier: 1.4,  desc: 'Dekton, Saloni alta gama, Villeroy & Boch, Hansgrohe' }
    },

    // Building age multipliers
    ageMultiplier: {
      new:       { label: '< 20 años',      multiplier: 1.0,  note: 'Instalaciones modernas' },
      moderate:  { label: '20–40 años',     multiplier: 1.05, note: 'Renovación parcial recomendada' },
      old:       { label: '40–70 años',      multiplier: 1.15, note: 'Tuberías y electricidad pueden necesitarse' },
      historic:  { label: '> 70 años / Casco Viejo', multiplier: 1.25, note: 'Mayor complejidad + licencias' }
    },

    // Extra costs
    extras: {
      windows:        { label: 'Ventanas PVC',        type: 'per-unit', defaultQty: 4,  min: 150, max: 300, default: 200, unit: 'ventana' },
      terrace:        { label: 'Terraza/Balcón',      type: 'per-sqm',  defaultQty: 10, min: 200, max: 500, default: 300, unit: 'm²' },
      radiantFloor:   { label: 'Suelo radiante',      type: 'per-sqm',  defaultQty: 0,  min: 60,  max: 90,  default: 75,  unit: 'm²' },
      demolition:     { label: 'Demolición tabiques', type: 'per-sqm',  defaultQty: 0,  min: 16,  max: 27,  default: 20,  unit: 'm²' },
      domotics:       { label: 'Domótica',            type: 'flat',     defaultQty: 1,  min: 1500,max: 3000, default: 2000, unit: 'ud' },
      aerothermia:    { label: 'Aerotermia',          type: 'flat',     defaultQty: 1,  min: 3000,max: 6000, default: 4000, unit: 'ud' }
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
      const low = sqm * base.minPerSqm * qualityMult;
      const high = sqm * base.maxPerSqm * qualityMult;
      subtotalLow += low;
      subtotalHigh += high;
      breakdown.push({
        item: base.label,
        qty: sqm,
        unit: 'm²',
        lowRate: Math.round(base.minPerSqm * qualityMult),
        highRate: Math.round(base.maxPerSqm * qualityMult),
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
        floorLow = sqm * 25;
        floorHigh = sqm * 35;
      } else if (qualityKey === 'medium') {
        floorLow = sqm * 45;
        floorHigh = sqm * 65;
      } else {
        floorLow = sqm * 65;
        floorHigh = sqm * 100;
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
      const low = base.min * qualityMult;
      const high = base.max * qualityMult;
      subtotalLow += low;
      subtotalHigh += high;
      breakdown.push({
        item: base.label,
        qty: 1,
        unit: 'ud',
        lowRate: Math.round(base.min * qualityMult),
        highRate: Math.round(base.max * qualityMult),
        lowTotal: Math.round(low),
        highTotal: Math.round(high)
      });
    }
    
    if (reformTypes.includes('kitchen')) {
      const base = PRICE_DATA.reformType.kitchen;
      const low = base.min * qualityMult;
      const high = base.max * qualityMult;
      subtotalLow += low;
      subtotalHigh += high;
      breakdown.push({
        item: base.label,
        qty: 1,
        unit: 'ud',
        lowRate: Math.round(base.min * qualityMult),
        highRate: Math.round(base.max * qualityMult),
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
      lowRate: Math.round(baseLowPerSqm * ageMult),
      highRate: Math.round(baseHighPerSqm * ageMult),
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
    console.log('nextStep called, currentStep:', state.currentStep, 'state:', JSON.stringify(state.data));
    if (!validateStep(state.currentStep)) {
      console.log('validation failed');
      renderErrors();
      return false;
    }
    
    if (state.currentStep < state.totalSteps) {
      state.currentStep++;
      console.log('advancing to step', state.currentStep);
      render();
      return true;
    }
    return false;
  }

  function prevStep() {
    if (state.currentStep > 1) {
      state.currentStep--;
      render();
      return true;
    }
    return false;
  }

  function goToStep(step) {
    if (step >= 1 && step <= state.totalSteps) {
      // Validate all previous steps
      for (let i = 1; i < step; i++) {
        if (!validateStep(i)) {
          state.currentStep = i;
          renderErrors();
          render();
          return false;
        }
      }
      state.currentStep = step;
      render();
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
    // Update visual selection for quality cards (step 4)
    document.querySelectorAll('.quality-card').forEach(function(el) {
      const elQuality = el.getAttribute('data-quality');
      // Map data-quality to API quality
      const qualityMap = { 'basica': 'basic', 'media': 'medium', 'premium': 'premium' };
      const apiQuality = qualityMap[elQuality];
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
    if (!state.data.extras[key]) {
      state.data.extras[key] = { checked: false, qty: 0 };
    }
    state.data.extras[key].checked = checked;
    state.data.extras[key].qty = qty !== undefined ? qty : PRICE_DATA.extras[key].defaultQty;
    recalculate();
  }

  function recalculate() {
    state.ui.isLoading = true;
    render(); // Show loading state
    
    // Simulate async calculation for UX
    setTimeout(() => {
      state.result = calculate();
      state.ui.isCalculated = true;
      state.ui.isLoading = false;
      render();
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
    
    // Update subtitle with reform type and sqm
    const subtitleEl = document.querySelector('.result-subtitle');
    if (subtitleEl) {
      const typeLabel = data.reformScope ? PRICE_DATA.reformScope[data.reformScope].label : data.reformTypes.map(t => PRICE_DATA.reformType[t]?.label).join(', ');
      subtitleEl.textContent = 'Estimación para un piso de ' + data.sqm + 'm² con ' + (typeLabel || 'reforma');
    }
    
    // Update breakdown bars — percentage relative to TOTAL (sum of all items)
    const breakdownBars = document.querySelectorAll('.breakdown-bar');
    const totalHigh = result.breakdown.reduce(function(sum, item) { return sum + item.highTotal; }, 0);
    result.breakdown.forEach(function(item, idx) {
      if (breakdownBars[idx]) {
        const bar = breakdownBars[idx];
        const pct = totalHigh > 0 ? Math.round((item.highTotal / totalHigh) * 100) : 0;
        const fill = bar.querySelector('.breakdown-bar-fill');
        if (fill) fill.style.width = pct + '%';
        const valueEl = bar.querySelector('.breakdown-bar-value');
        if (valueEl) valueEl.textContent = pct + '% · ~' + Math.round((item.lowTotal + item.highTotal) / 2).toLocaleString('es-ES') + ' €';
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

  function render() {
    // Legacy: only update step visibility for static HTML
    showStep(state.currentStep);
  }

  function renderCurrentStep() {
    const container = document.getElementById('step-container');
    if (!container) return;
    
    // Add transition class
    container.classList.add('step-transition');
    
    switch (state.currentStep) {
      case 1: renderStep1(container); break;
      case 2: renderStep2(container); break;
      case 3: renderStep3(container); break;
      case 4: renderStep4(container); break;
      case 5: renderStep5(container); break;
      case 6: renderStep6(container); break;
    }
    
    // Remove transition class after animation
    setTimeout(() => container.classList.remove('step-transition'), 300);
  }

  function renderStep1(container) {
    const selectedScope = state.data.reformScope;
    const selectedTypes = state.data.reformTypes;
    
    container.innerHTML = `
      <div class="step-content">
        <h2 class="step-title">¿Qué quieres reformar?</h2>
        <p class="step-subtitle">Selecciona el tipo de reforma o combina varias estancias</p>
        
        <!-- Reform Scope Cards (Full reforms) -->
        <div class="section-label">Reforma completa</div>
        <div class="card-grid scope-grid">
          ${Object.entries(PRICE_DATA.reformScope).map(([key, scope]) => `
            <div class="card ${selectedScope === key ? 'selected' : ''}" 
                 data-scope="${key}"
                 onclick="window.BilbaoCalc.selectScope('${key}')">
              <div class="card-icon">
                ${getScopeIcon(key)}
              </div>
              <div class="card-title">${scope.label}</div>
              <div class="card-price">${scope.minPerSqm}–${scope.maxPerSqm} €/m²</div>
            </div>
          `).join('')}
        </div>
        
        <!-- Individual Room Cards -->
        <div class="section-label">O selecciona estancias individuales</div>
        <div class="card-grid room-grid">
          ${Object.entries(PRICE_DATA.reformType).map(([key, type]) => `
            <div class="card ${selectedTypes.includes(key) ? 'selected' : ''}"
                 data-type="${key}"
                 onclick="window.BilbaoCalc.toggleReformType('${key}')">
              <div class="card-icon">
                ${getRoomIcon(key)}
              </div>
              <div class="card-title">${type.label}</div>
              <div class="card-price">
                ${type.unit === 'm²' ? `${type.minPerSqm}–${type.maxPerSqm} €/m²` : `${formatCurrency(type.min)}–${formatCurrency(type.max)}`}
              </div>
            </div>
          `).join('')}
        </div>
        
        ${state.ui.errors.reformType ? `<div class="error-message">${state.ui.errors.reformType}</div>` : ''}
      </div>
    `;
  }

  function renderStep2(container) {
    container.innerHTML = `
      <div class="step-content">
        <h2 class="step-title">¿Cuántos metros tiene tu vivienda?</h2>
        <p class="step-subtitle">Introduce la superficie total a reformar</p>
        
        <div class="sqm-input-group">
          <div class="sqm-display">
            <input type="number" 
                   id="sqm-input" 
                   class="sqm-input"
                   value="${state.data.sqm}"
                   min="20"
                   max="500"
                   onchange="window.BilbaoCalc.updateSqm(this.value)"
                   oninput="window.BilbaoCalc.updateSqm(this.value)">
            <span class="sqm-unit">m²</span>
          </div>
          
          <input type="range" 
                 id="sqm-slider"
                 class="sqm-slider"
                 min="20"
                 max="300"
                 value="${state.data.sqm}"
                 oninput="window.BilbaoCalc.updateSqm(this.value)">
          
          <div class="sqm-range-labels">
            <span>20 m²</span>
            <span>300 m²</span>
          </div>
        </div>
        
        <div class="presets">
          <div class="section-label">O elige un preset</div>
          <div class="preset-buttons">
            ${SQM_PRESETS.map(preset => `
              <button class="preset-btn ${state.data.sqm === preset.value ? 'active' : ''}"
                      onclick="window.BilbaoCalc.updateSqm(${preset.value})">
                ${preset.label}
              </button>
            `).join('')}
          </div>
        </div>
        
        ${state.ui.errors.sqm ? `<div class="error-message">${state.ui.errors.sqm}</div>` : ''}
      </div>
    `;
  }

  function renderStep3(container) {
    container.innerHTML = `
      <div class="step-content">
        <h2 class="step-title">¿Qué antigüedad tiene el edificio?</h2>
        <p class="step-subtitle">La edad del edificio afecta al coste por posibles instalaciones adicionales</p>
        
        <div class="radio-cards">
          ${Object.entries(PRICE_DATA.ageMultiplier).map(([key, age]) => `
            <div class="radio-card ${state.data.buildingAge === key ? 'selected' : ''}"
                 onclick="window.BilbaoCalc.updateBuildingAge('${key}')">
              <input type="radio" 
                     name="building-age" 
                     value="${key}"
                     ${state.data.buildingAge === key ? 'checked' : ''}>
              <div class="radio-content">
                <div class="radio-title">${age.label}</div>
                <div class="radio-note">${age.note}</div>
                ${age.multiplier > 1 ? `<div class="radio-impact">+${Math.round((age.multiplier - 1) * 100)}% sobre presupuesto base</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        
        ${state.ui.errors.buildingAge ? `<div class="error-message">${state.ui.errors.buildingAge}</div>` : ''}
      </div>
    `;
  }

  function renderStep4(container) {
    container.innerHTML = `
      <div class="step-content">
        <h2 class="step-title">¿Qué calidad de materiales prefieres?</h2>
        <p class="step-subtitle">La calidad influye directamente en el presupuesto final</p>
        
        <div class="quality-cards">
          ${Object.entries(PRICE_DATA.qualityMultiplier).map(([key, quality]) => `
            <div class="quality-card ${state.data.quality === key ? 'selected' : ''}"
                 onclick="window.BilbaoCalc.updateQuality('${key}')">
              <div class="quality-header">
                <div class="quality-name">${quality.label}</div>
                <div class="quality-multiplier">${key === 'basic' ? '-20%' : key === 'premium' ? '+40%' : 'Base'}</div>
              </div>
              <div class="quality-desc">${quality.desc}</div>
            </div>
          `).join('')}
        </div>
        
        ${state.ui.errors.quality ? `<div class="error-message">${state.ui.errors.quality}</div>` : ''}
      </div>
    `;
  }

  function renderStep5(container) {
    const extras = state.data.extras;
    
    container.innerHTML = `
      <div class="step-content">
        <h2 class="step-title">¿Necesitas algo adicional?</h2>
        <p class="step-subtitle">Selecciona los extras opcionales (pueden incrementar el presupuesto)</p>
        
        <div class="extras-list">
          ${Object.entries(PRICE_DATA.extras).map(([key, extra]) => {
            const isChecked = extras[key]?.checked || false;
            const qty = extras[key]?.qty ?? extra.defaultQty;
            
            return `
              <div class="extra-item ${isChecked ? 'checked' : ''}">
                <label class="extra-checkbox">
                  <input type="checkbox"
                         ${isChecked ? 'checked' : ''}
                         onchange="window.BilbaoCalc.toggleExtra('${key}', this.checked, ${qty})">
                  <span class="checkmark"></span>
                </label>
                <div class="extra-info" onclick="window.BilbaoCalc.toggleExtra('${key}', ${!isChecked}, ${qty})">
                  <div class="extra-name">${extra.label}</div>
                  <div class="extra-price">${extra.type === 'flat' ? formatCurrency(extra.min) + '–' + formatCurrency(extra.max) : formatCurrency(extra.min) + '–' + formatCurrency(extra.max) + ' €/' + extra.unit}</div>
                </div>
                ${extra.type !== 'flat' ? `
                  <div class="extra-qty" onclick="event.stopPropagation()">
                    <label>Cantidad:</label>
                    <input type="number" 
                           value="${qty}" 
                           min="0"
                           max="50"
                           onchange="window.BilbaoCalc.updateExtraQty('${key}', this.value)">
                    <span class="qty-unit">${extra.unit}</span>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="contingency-note">
          <span class="icon">ℹ️</span>
          <span>Se añade un 15% para imprevistos por defecto</span>
        </div>
      </div>
    `;
  }

  function renderStep6(container) {
    if (state.ui.isLoading) {
      container.innerHTML = `
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Calculando tu presupuesto...</p>
        </div>
      `;
      return;
    }
    
    const result = state.result;
    
    if (!result) {
      container.innerHTML = `
        <div class="error-state">
          <p>No se ha podido calcular el presupuesto. Por favor, vuelve atrás e intenta de nuevo.</p>
          <button class="btn btn-secondary" onclick="window.BilbaoCalc.goToStep(1)">Volver al inicio</button>
        </div>
      `;
      return;
    }
    
    const { data } = state;
    const scopeLabel = data.reformScope 
      ? PRICE_DATA.reformScope[data.reformScope].label
      : data.reformTypes.map(t => PRICE_DATA.reformType[t].label).join(' + ');
    
    container.innerHTML = `
      <div class="result-content">
        <div class="result-header">
          <h2 class="result-title">Tu reforma en Bilbao</h2>
          <p class="result-subtitle">Estimación para ${scopeLabel.toLowerCase()} en un piso de ${data.sqm}m²</p>
        </div>
        
        <div class="result-range">
          <div class="range-label">Presupuesto estimado</div>
          <div class="range-values">
            <span class="range-low">${formatCurrency(result.low)}</span>
            <span class="range-separator">—</span>
            <span class="range-high">${formatCurrency(result.high)}</span>
          </div>
        </div>
        
        <div class="result-comparator">
          <div class="comparator-icon">📊</div>
          <div class="comparator-text">
            <strong>${formatCurrency(result.avgPerSqm)} €/m²</strong> — 
            El precio medio en Bilbao para tu reforma es de ${formatCurrency(result.avgPerSqm)} por metro cuadrado
          </div>
        </div>
        
        <div class="result-breakdown">
          <h3 class="breakdown-title">Desglose por partidas</h3>
          <div class="breakdown-bars">
            ${renderBreakdownBars(result.breakdown, result.high)}
          </div>
          <div class="breakdown-table">
            ${renderBreakdownTable(result.breakdown)}
          </div>
        </div>
        
        <div class="result-disclaimer">
          * Este presupuesto es orientativo. Solicita presupuestos personalizados a empresas locales para una estimación precisa.
        </div>
        
        <div class="result-ctas">
          <button class="btn btn-primary btn-large" onclick="window.BilbaoCalc.downloadPDF()">
            <span class="btn-icon">📄</span>
            Descargar Presupuesto PDF
          </button>
          <button class="btn btn-secondary btn-large" onclick="window.BilbaoCalc.requestQuotes()">
            <span class="btn-icon">📞</span>
            Recibir 3 Presupuestos de Empresas Locales
          </button>
        </div>
        
        <div class="result-share">
          <button class="btn btn-text" onclick="window.BilbaoCalc.restart()">
            ← Hacer otro cálculo
          </button>
        </div>
      </div>
    `;
  }

  function renderBreakdownBars(breakdown, total) {
    // Filter out contingency for cleaner visualization
    const items = breakdown.filter(item => !item.item.includes('Imprevistos'));
    
    return items.map(item => {
      const maxTotal = Math.max(...items.map(i => i.highTotal));
      const widthPercent = (item.highTotal / maxTotal) * 100;
      const totalPercent = (item.highTotal / total) * 100;
      
      return `
        <div class="bar-item">
          <div class="bar-label">
            <span class="bar-name">${item.item}</span>
            <span class="bar-percent">${totalPercent.toFixed(0)}%</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${widthPercent}%"></div>
          </div>
          <div class="bar-values">
            <span>${formatCurrency(item.lowTotal)} — ${formatCurrency(item.highTotal)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderBreakdownTable(breakdown) {
    return `
      <table class="breakdown-table-el">
        <thead>
          <tr>
            <th>Partida</th>
            <th>Cantidad</th>
            <th>€/m² (bajo–alto)</th>
            <th>Total (bajo–alto)</th>
          </tr>
        </thead>
        <tbody>
          ${breakdown.map(item => `
            <tr>
              <td>${item.item}</td>
              <td>${item.qty} ${item.unit}</td>
              <td>${formatCurrency(item.lowRate)}–${formatCurrency(item.highRate)}</td>
              <td>${formatCurrency(item.lowTotal)}–${formatCurrency(item.highTotal)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function renderErrors() {
    // Re-render current step to show errors
    renderCurrentStep();
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
    console.log('downloadPDF called');
    const result = state.result;
    if (!result) {
      alert('Calcula tu presupuesto primero.');
      return;
    }
    // Generate a simple text file with the budget
    const data = state.data;
    const qualityLabel = PRICE_DATA.qualityMultiplier[data.quality]?.label || 'No especificada';
    const ageLabel = PRICE_DATA.ageMultiplier[data.buildingAge]?.label || 'No especificada';
    
    let text = 'PRESUPUESTO ORIENTATIVO - REFORMA BILBAO\n';
    text += '==========================================\n\n';
    text += `Tipo de reforma: ${data.reformScope ? PRICE_DATA.reformScope[data.reformScope].label : data.reformTypes.map(t => PRICE_DATA.reformType[t]?.label).join(', ')}\n`;
    text += `Metros cuadrados: ${data.sqm} m²\n`;
    text += `Antigüedad edificio: ${ageLabel}\n`;
    text += `Calidad materiales: ${qualityLabel}\n`;
    text += `\nPRESUPUESTO ESTIMADO:\n`;
    text += `Desde: ${result.low.toLocaleString('es-ES')} €\n`;
    text += `Hasta: ${result.high.toLocaleString('es-ES')} €\n`;
    text += `Precio medio por m²: ${result.avgPerSqm} €/m²\n\n`;
    text += `Desglose:\n`;
    if (result.breakdown) {
      result.breakdown.forEach(function(item) {
        text += `  - ${item.item}: ${item.lowTotal.toLocaleString('es-ES')} – ${item.highTotal.toLocaleString('es-ES')} €\n`;
      });
    }
    text += '\n----------------------------------------\n';
    text += 'Este presupuesto es orientativo (±15%).\n';
    text += 'Solicita presupuestos personalizados a empresas locales.\n';
    text += 'Generado por BilbaoReforma.es\n';
    
    // Download as text file
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presupuesto-reforma-bilbao.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function showLeadForm() {
    // Scroll to lead form
    const leadForm = document.querySelector('.lead-form');
    if (leadForm) {
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
      // Update visual selected state for reform type cards
      document.querySelectorAll('.reform-type-card').forEach(function(el) {
        const elType = el.getAttribute('data-reform');
        // Map data-reform to API type
        const typeMap = { 'pintura': 'painting', 'suelo': 'flooring', 'bano': 'bathroom', 'cocina': 'kitchen' };
        const apiType = typeMap[elType];
        if (apiType && types.indexOf(apiType) !== -1) {
          el.classList.add('selected');
          el.setAttribute('aria-pressed', 'true');
        } else {
          el.classList.remove('selected');
          el.setAttribute('aria-pressed', 'false');
        }
      });
      recalculate();
    },
    selectScope: function(scope) {
      // Clear individual types when selecting a scope
      state.data.reformTypes = [];
      state.data.reformScope = scope;
      state.ui.isCalculated = false;
      // Update visual: select integral card, deselect others
      document.querySelectorAll('.reform-type-card').forEach(function(el) {
        const elScope = el.getAttribute('data-reform');
        if (elScope === 'integral') {
          el.classList.add('selected');
          el.setAttribute('aria-pressed', 'true');
        } else {
          el.classList.remove('selected');
          el.setAttribute('aria-pressed', 'false');
        }
      });
      recalculate();
    },
    toggleExtra: function(key, el) {
      // el is the DOM element clicked (for static HTML)
      // Determine current checked state from element
      const isChecked = el && el.getAttribute('aria-pressed') === 'true';
      const qty = PRICE_DATA.extras[key] ? PRICE_DATA.extras[key].defaultQty : 1;
      updateExtra(key, !isChecked, qty);
      // Toggle aria-pressed and 'selected' class visually
      if (el) {
        el.setAttribute('aria-pressed', !isChecked ? 'true' : 'false');
        el.classList.toggle('selected', !isChecked);
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
    },
    updateExtraQty: function(key, qty) {
      const val = parseInt(qty, 10);
      if (state.data.extras[key]) {
        state.data.extras[key].qty = val;
        recalculate();
      }
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
        return;
      }
      if (!email) {
        alert('Por favor, introduce tu email.');
        if (emailInput) emailInput.focus();
        return;
      }
      // Collect data
      var leadData = {
        name: name,
        email: email,
        phone: phone,
        data: state.data,
        result: state.result
      };
      console.log('Lead submitted:', leadData);
      alert('¡Gracias ' + name + '! Te contactaremos pronto con presupuestos personalizados.');
      // In production: send to backend
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
      render();
    }
  };

  // ============================================================
  // INITIALIZATION
  // ============================================================

  function init() {
    // Initialize with first step visible (static HTML)
    showStep(1);
    console.log('Bilbao Calculadora initialized');
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
