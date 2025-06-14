// 📋 SUBSTEP2 WORKFLOW: Константи для координації характеристик предмета
// Використовуємо готові Orval константи + мінімальні UI утиліти

// =================== ORVAL КОНСТАНТИ ===================
// Імпортуємо готові константи з Orval
export {
  SubstepResultDTOCurrentState,
  SubstepResultDTOAvailableEventsItem,
} from '@api/substep2';

// Реекспорт типів
export type {
  SubstepResultDTOCurrentState as Substep2State,
  SubstepResultDTOAvailableEventsItem as Substep2Event,
} from '@api/substep2';

// =================== UI WORKFLOW КРОКИ ===================
// Тільки для UI координації (НЕ дублюємо API стани)
export const SUBSTEP2_UI_STEPS = {
  MATERIAL_SELECTION: 'material-selection',
  COLOR_SELECTION: 'color-selection',
  FILLER_SELECTION: 'filler-selection',
  WEAR_LEVEL_SELECTION: 'wear-level-selection',
  VALIDATION: 'validation',
  COMPLETED: 'completed',
} as const;

export type Substep2UIStep = (typeof SUBSTEP2_UI_STEPS)[keyof typeof SUBSTEP2_UI_STEPS];

// Порядок кроків для навігації
export const SUBSTEP2_STEP_ORDER: Substep2UIStep[] = [
  SUBSTEP2_UI_STEPS.MATERIAL_SELECTION,
  SUBSTEP2_UI_STEPS.COLOR_SELECTION,
  SUBSTEP2_UI_STEPS.FILLER_SELECTION,
  SUBSTEP2_UI_STEPS.WEAR_LEVEL_SELECTION,
  SUBSTEP2_UI_STEPS.VALIDATION,
  SUBSTEP2_UI_STEPS.COMPLETED,
];

// =================== ВАЛІДАЦІЯ ===================
// Правила переходів між кроками
export const SUBSTEP2_VALIDATION_RULES = {
  canGoToColorSelection: (materialId: string | null) => !!materialId,
  canGoToFillerSelection: (materialId: string | null, colorId: string | null) =>
    !!materialId && !!colorId,
  canGoToWearLevelSelection: (
    materialId: string | null,
    colorId: string | null,
    fillerId: string | null
  ) => !!materialId && !!colorId && !!fillerId,
  canValidate: (
    materialId: string | null,
    colorId: string | null,
    fillerId: string | null,
    wearLevelId: string | null
  ) => !!materialId && !!colorId && !!fillerId && !!wearLevelId,
  canComplete: (
    materialId: string | null,
    colorId: string | null,
    fillerId: string | null,
    wearLevelId: string | null
  ) => !!materialId && !!colorId && !!fillerId && !!wearLevelId,
} as const;

// =================== ЛІМІТИ ===================
export const SUBSTEP2_LIMITS = {
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 50,
  DEBOUNCE_DELAY: 300,
} as const;

// =================== УТИЛІТИ ===================
// Розрахунок прогресу
export const calculateSubstep2Progress = (currentStep: Substep2UIStep): number => {
  const currentIndex = SUBSTEP2_STEP_ORDER.indexOf(currentStep);
  return Math.round(((currentIndex + 1) / SUBSTEP2_STEP_ORDER.length) * 100);
};

// =================== НАВІГАЦІЯ ===================
// Утиліти для навігації
export const getNextSubstep2Step = (currentStep: Substep2UIStep): Substep2UIStep | null => {
  const currentIndex = SUBSTEP2_STEP_ORDER.indexOf(currentStep);
  return currentIndex < SUBSTEP2_STEP_ORDER.length - 1
    ? SUBSTEP2_STEP_ORDER[currentIndex + 1]
    : null;
};

export const getPreviousSubstep2Step = (currentStep: Substep2UIStep): Substep2UIStep | null => {
  const currentIndex = SUBSTEP2_STEP_ORDER.indexOf(currentStep);
  return currentIndex > 0 ? SUBSTEP2_STEP_ORDER[currentIndex - 1] : null;
};

export const isFirstSubstep2Step = (step: Substep2UIStep): boolean =>
  step === SUBSTEP2_STEP_ORDER[0];

export const isLastSubstep2Step = (step: Substep2UIStep): boolean =>
  step === SUBSTEP2_STEP_ORDER[SUBSTEP2_STEP_ORDER.length - 1];
