// Substep4 Price Calculation константи з Orval схем
// Використовуємо готові типи з бекенду для розрахунку ціни

// =================== ORVAL КОНСТАНТИ ===================
// Імпортуємо готові константи з Orval
export {
  PriceCalculationResponseDTOUnitOfMeasure,
  PriceModifierDTOType,
  ModifierRecommendationDTOPriority,
  Substep4GetAvailableEvents200Item,
} from '@api/substep4';

// Реекспорт типів з читабельними назвами
export type {
  Substep4GetAvailableModifiersParams,
  Substep4GetRecommendedModifiersParams,
  PriceCalculationResponseDTOUnitOfMeasure as Substep4UnitOfMeasure,
  PriceModifierDTOType as Substep4ModifierType,
  ModifierRecommendationDTOPriority as Substep4ModifierPriority,
  Substep4GetAvailableEvents200Item as Substep4ApiEvent,
  PriceCalculationRequestDTO,
  PriceCalculationResponseDTO,
  PriceModifierDTO,
  ModifierRecommendationDTO,
  CalculationDetailsDTO,
  RangeModifierValueDTO,
  FixedModifierQuantityDTO,
  AddModifierRequest,
  PriceDiscountDTO,
} from '@api/substep4';

// =================== UI КОНСТАНТИ ===================
// Тільки для UI координації (НЕ дублюємо API логіку)

export const SUBSTEP4_UI_STEPS = {
  MODIFIER_SELECTION: 'modifier-selection',
  PRICE_CALCULATION: 'price-calculation',
  CALCULATION_REVIEW: 'calculation-review',
  CONFIRMATION: 'confirmation',
} as const;

export type Substep4UIStep = (typeof SUBSTEP4_UI_STEPS)[keyof typeof SUBSTEP4_UI_STEPS];

// Порядок кроків для навігації
export const SUBSTEP4_STEP_ORDER: Substep4UIStep[] = [
  SUBSTEP4_UI_STEPS.MODIFIER_SELECTION,
  SUBSTEP4_UI_STEPS.PRICE_CALCULATION,
  SUBSTEP4_UI_STEPS.CALCULATION_REVIEW,
  SUBSTEP4_UI_STEPS.CONFIRMATION,
];

// Валідаційні правила для UI
export const SUBSTEP4_VALIDATION_RULES = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 1000,
  MIN_PRICE: 0,
  MAX_MODIFIERS: 20,
  MAX_RANGE_MODIFIERS: 10,
  MAX_FIXED_MODIFIERS: 10,
  MIN_PERCENTAGE: 0,
  MAX_PERCENTAGE: 200,
  MIN_DISCOUNT: 0,
  MAX_DISCOUNT: 50,
  MIN_EXPEDITE: 0,
  MAX_EXPEDITE: 200,
} as const;

// Ліміти для UI компонентів
export const SUBSTEP4_UI_LIMITS = {
  MAX_MODIFIER_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_NOTES_LENGTH: 1000,
  CALCULATION_TIMEOUT_MS: 30000,
  DEBOUNCE_DELAY_MS: 500,
} as const;

// =================== УТИЛІТИ ===================

/**
 * Розрахунок прогресу substep4 (0-100%)
 */
export const calculateSubstep4Progress = (currentStep: Substep4UIStep): number => {
  const stepIndex = SUBSTEP4_STEP_ORDER.indexOf(currentStep);
  return stepIndex >= 0 ? Math.round(((stepIndex + 1) / SUBSTEP4_STEP_ORDER.length) * 100) : 0;
};

/**
 * Отримання наступного кроку
 */
export const getNextSubstep4Step = (currentStep: Substep4UIStep): Substep4UIStep | null => {
  const currentIndex = SUBSTEP4_STEP_ORDER.indexOf(currentStep);
  return currentIndex >= 0 && currentIndex < SUBSTEP4_STEP_ORDER.length - 1
    ? SUBSTEP4_STEP_ORDER[currentIndex + 1]
    : null;
};

/**
 * Отримання попереднього кроку
 */
export const getPreviousSubstep4Step = (currentStep: Substep4UIStep): Substep4UIStep | null => {
  const currentIndex = SUBSTEP4_STEP_ORDER.indexOf(currentStep);
  return currentIndex > 0 ? SUBSTEP4_STEP_ORDER[currentIndex - 1] : null;
};

/**
 * Перевірка чи це перший крок
 */
export const isFirstSubstep4Step = (step: Substep4UIStep): boolean => {
  return step === SUBSTEP4_STEP_ORDER[0];
};

/**
 * Перевірка чи це останній крок
 */
export const isLastSubstep4Step = (step: Substep4UIStep): boolean => {
  return step === SUBSTEP4_STEP_ORDER[SUBSTEP4_STEP_ORDER.length - 1];
};
