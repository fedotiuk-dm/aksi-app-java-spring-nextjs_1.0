// Substep4 Workflow константи з Orval схем
// Використовуємо готові типи з бекенду для price-calculation

// =================== ORVAL КОНСТАНТИ ===================
// Імпортуємо готові константи з Orval
export {
  SubstepResultDTOCurrentState,
  SubstepResultDTOAvailableEventsItem,
  PriceModifierDTOType,
  PriceCalculationResponseDTOUnitOfMeasure,
} from '@api/substep4';

// Реекспорт типів
export type {
  SubstepResultDTOCurrentState as Substep4State,
  SubstepResultDTOAvailableEventsItem as Substep4Event,
  PriceModifierDTOType as ModifierType,
  PriceCalculationResponseDTOUnitOfMeasure as UnitOfMeasure,
} from '@api/substep4';

// =================== UI WORKFLOW СТАНИ ===================
// Тільки для UI координації (НЕ дублюємо API стани)
export const SUBSTEP4_WORKFLOW_STEPS = {
  BASE_PRICE_CALCULATION: 'base-price-calculation',
  MODIFIER_SELECTION: 'modifier-selection',
  MODIFIER_CONFIGURATION: 'modifier-configuration',
  FINAL_CALCULATION: 'final-calculation',
  VALIDATION: 'validation',
  COMPLETED: 'completed',
} as const;

export type Substep4WorkflowStep =
  (typeof SUBSTEP4_WORKFLOW_STEPS)[keyof typeof SUBSTEP4_WORKFLOW_STEPS];

// Порядок кроків для навігації
export const SUBSTEP4_STEP_ORDER: Substep4WorkflowStep[] = [
  SUBSTEP4_WORKFLOW_STEPS.BASE_PRICE_CALCULATION,
  SUBSTEP4_WORKFLOW_STEPS.MODIFIER_SELECTION,
  SUBSTEP4_WORKFLOW_STEPS.MODIFIER_CONFIGURATION,
  SUBSTEP4_WORKFLOW_STEPS.FINAL_CALCULATION,
  SUBSTEP4_WORKFLOW_STEPS.VALIDATION,
  SUBSTEP4_WORKFLOW_STEPS.COMPLETED,
];

// =================== ВАЛІДАЦІЯ ===================
// Правила переходів між кроками
export const SUBSTEP4_VALIDATION_RULES = {
  canGoToModifierSelection: (basePrice: number | null) => basePrice !== null && basePrice > 0,
  canGoToModifierConfiguration: (selectedModifiers: string[]) => selectedModifiers.length >= 0, // Можна без модифікаторів
  canGoToFinalCalculation: (modifiersConfigured: boolean) => modifiersConfigured,
  canValidate: (finalPrice: number | null, calculationValid: boolean) =>
    finalPrice !== null && finalPrice > 0 && calculationValid,
} as const;

// =================== ЛІМІТИ ===================
// UI ліміти для workflow
export const SUBSTEP4_WORKFLOW_LIMITS = {
  MAX_MODIFIERS: 10,
  MAX_CALCULATION_TIME: 30000, // 30 секунд
  MAX_RETRY_ATTEMPTS: 3,
  MIN_BASE_PRICE: 0.01,
  MAX_BASE_PRICE: 999999.99,
} as const;

// =================== ПРОГРЕС ===================
// Розрахунок прогресу
export const calculateSubstep4Progress = (currentStep: Substep4WorkflowStep): number => {
  const currentIndex = SUBSTEP4_STEP_ORDER.indexOf(currentStep);
  return Math.round(((currentIndex + 1) / SUBSTEP4_STEP_ORDER.length) * 100);
};

// =================== НАВІГАЦІЯ ===================
// Утиліти для навігації
export const getNextSubstep4Step = (
  currentStep: Substep4WorkflowStep
): Substep4WorkflowStep | null => {
  const currentIndex = SUBSTEP4_STEP_ORDER.indexOf(currentStep);
  return currentIndex < SUBSTEP4_STEP_ORDER.length - 1
    ? SUBSTEP4_STEP_ORDER[currentIndex + 1]
    : null;
};

export const getPreviousSubstep4Step = (
  currentStep: Substep4WorkflowStep
): Substep4WorkflowStep | null => {
  const currentIndex = SUBSTEP4_STEP_ORDER.indexOf(currentStep);
  return currentIndex > 0 ? SUBSTEP4_STEP_ORDER[currentIndex - 1] : null;
};

export const isFirstSubstep4Step = (currentStep: Substep4WorkflowStep): boolean => {
  return currentStep === SUBSTEP4_STEP_ORDER[0];
};

export const isLastSubstep4Step = (currentStep: Substep4WorkflowStep): boolean => {
  return currentStep === SUBSTEP4_STEP_ORDER[SUBSTEP4_STEP_ORDER.length - 1];
};
