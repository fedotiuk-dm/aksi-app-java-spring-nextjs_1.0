// Substep1 Workflow константи з Orval схем
// Використовуємо готові типи з бекенду для item-basic-info

// =================== ORVAL КОНСТАНТИ ===================
// Імпортуємо готові константи з Orval
export {
  SubstepResultDTOCurrentState,
  SubstepResultDTOAvailableEventsItem,
  PriceCalculationResponseDTOUnitOfMeasure,
} from '@api/substep1';

// Реекспорт типів
export type {
  SubstepResultDTOCurrentState as Substep1State,
  SubstepResultDTOAvailableEventsItem as Substep1Event,
  PriceCalculationResponseDTOUnitOfMeasure as UnitOfMeasure,
} from '@api/substep1';

// =================== UI WORKFLOW СТАНИ ===================
// Базові стани для UI координації (НЕ дублюємо API стани)
export const SUBSTEP1_WORKFLOW_STEPS = {
  CATEGORY_SELECTION: 'category-selection',
  ITEM_SELECTION: 'item-selection',
  QUANTITY_ENTRY: 'quantity-entry',
  VALIDATION: 'validation',
  COMPLETED: 'completed',
} as const;

export type Substep1WorkflowStep =
  (typeof SUBSTEP1_WORKFLOW_STEPS)[keyof typeof SUBSTEP1_WORKFLOW_STEPS];

// Порядок кроків для навігації
export const SUBSTEP1_STEP_ORDER: Substep1WorkflowStep[] = [
  SUBSTEP1_WORKFLOW_STEPS.CATEGORY_SELECTION,
  SUBSTEP1_WORKFLOW_STEPS.ITEM_SELECTION,
  SUBSTEP1_WORKFLOW_STEPS.QUANTITY_ENTRY,
  SUBSTEP1_WORKFLOW_STEPS.VALIDATION,
  SUBSTEP1_WORKFLOW_STEPS.COMPLETED,
];

// =================== ВАЛІДАЦІЯ ===================
// Правила переходів між кроками
export const SUBSTEP1_VALIDATION_RULES = {
  canGoToItemSelection: (selectedCategoryId: string | null) => selectedCategoryId !== null,
  canGoToQuantityEntry: (selectedCategoryId: string | null, selectedItemId: string | null) =>
    selectedCategoryId !== null && selectedItemId !== null,
  canValidate: (
    selectedCategoryId: string | null,
    selectedItemId: string | null,
    quantity: number | null
  ) => selectedCategoryId !== null && selectedItemId !== null && quantity !== null && quantity > 0,
  canComplete: (
    selectedCategoryId: string | null,
    selectedItemId: string | null,
    quantity: number | null
  ) => selectedCategoryId !== null && selectedItemId !== null && quantity !== null && quantity > 0,
} as const;

// =================== ЛІМІТИ ===================
// Мінімальні та максимальні значення
export const SUBSTEP1_WORKFLOW_LIMITS = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 1000,
  MIN_SEARCH_LENGTH: 2,
  MAX_STEPS: SUBSTEP1_STEP_ORDER.length,
} as const;

// =================== ПРОГРЕС ===================
// Розрахунок прогресу
export const calculateSubstep1Progress = (currentStep: Substep1WorkflowStep): number => {
  const currentIndex = SUBSTEP1_STEP_ORDER.indexOf(currentStep);
  return Math.round(((currentIndex + 1) / SUBSTEP1_STEP_ORDER.length) * 100);
};

// =================== НАВІГАЦІЯ ===================
// Утиліти для навігації
export const getNextSubstep1Step = (
  currentStep: Substep1WorkflowStep
): Substep1WorkflowStep | null => {
  const currentIndex = SUBSTEP1_STEP_ORDER.indexOf(currentStep);
  return currentIndex < SUBSTEP1_STEP_ORDER.length - 1
    ? SUBSTEP1_STEP_ORDER[currentIndex + 1]
    : null;
};

export const getPreviousSubstep1Step = (
  currentStep: Substep1WorkflowStep
): Substep1WorkflowStep | null => {
  const currentIndex = SUBSTEP1_STEP_ORDER.indexOf(currentStep);
  return currentIndex > 0 ? SUBSTEP1_STEP_ORDER[currentIndex - 1] : null;
};

// Перевірка чи це перший/останній крок
export const isFirstSubstep1Step = (currentStep: Substep1WorkflowStep): boolean => {
  return currentStep === SUBSTEP1_WORKFLOW_STEPS.CATEGORY_SELECTION;
};

export const isLastSubstep1Step = (currentStep: Substep1WorkflowStep): boolean => {
  return currentStep === SUBSTEP1_WORKFLOW_STEPS.COMPLETED;
};
