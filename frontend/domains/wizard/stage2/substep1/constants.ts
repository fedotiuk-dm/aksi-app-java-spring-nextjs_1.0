// Substep1 Item Basic Info константи з Orval схем
// Використовуємо готові типи з бекенду для базової інформації предмета

// =================== ORVAL КОНСТАНТИ ===================
// Імпортуємо готові константи з Orval
export {
  SubstepResultDTOCurrentState,
  SubstepResultDTOAvailableEventsItem,
  PriceCalculationResponseDTOUnitOfMeasure,
} from '@/shared/api/generated/substep1';

// Реекспорт типів з читабельними назвами
export type {
  SubstepResultDTOCurrentState as Substep1ApiState,
  SubstepResultDTOAvailableEventsItem as Substep1ApiEvent,
  PriceCalculationResponseDTOUnitOfMeasure as UnitOfMeasure,
  Substep1SelectServiceCategoryParams,
  Substep1SelectPriceListItemParams,
  Substep1EnterQuantityParams,
  ServiceCategoryDTO,
  PriceListItemDTO,
  ItemBasicInfoDTO,
} from '@/shared/api/generated/substep1';

// =================== UI КОНСТАНТИ ===================
// UI кроки для базової інформації предмета
export const SUBSTEP1_UI_STEPS = {
  CATEGORY_SELECTION: 'category-selection',
  ITEM_SELECTION: 'item-selection',
  QUANTITY_ENTRY: 'quantity-entry',
  VALIDATION: 'validation',
  COMPLETED: 'completed',
} as const;

export type Substep1UIStep = (typeof SUBSTEP1_UI_STEPS)[keyof typeof SUBSTEP1_UI_STEPS];

// Порядок кроків
export const SUBSTEP1_STEP_ORDER: Substep1UIStep[] = [
  SUBSTEP1_UI_STEPS.CATEGORY_SELECTION,
  SUBSTEP1_UI_STEPS.ITEM_SELECTION,
  SUBSTEP1_UI_STEPS.QUANTITY_ENTRY,
  SUBSTEP1_UI_STEPS.VALIDATION,
  SUBSTEP1_UI_STEPS.COMPLETED,
];

// =================== ВАЛІДАЦІЯ ===================
// Правила валідації для переходів між кроками
export const SUBSTEP1_VALIDATION_RULES = {
  canGoToItemSelection: (categoryId: string | null) => categoryId !== null,
  canGoToQuantityEntry: (itemId: string | null) => itemId !== null,
  canValidate: (quantity: number | null) => quantity !== null && quantity > 0,
  canComplete: (categoryId: string | null, itemId: string | null, quantity: number | null) =>
    categoryId !== null && itemId !== null && quantity !== null && quantity > 0,
} as const;

// =================== НАВІГАЦІЯ ===================
// Утиліти для навігації між кроками
export const getNextSubstep1Step = (currentStep: Substep1UIStep): Substep1UIStep | null => {
  const currentIndex = SUBSTEP1_STEP_ORDER.indexOf(currentStep);
  return currentIndex < SUBSTEP1_STEP_ORDER.length - 1
    ? SUBSTEP1_STEP_ORDER[currentIndex + 1]
    : null;
};

export const getPreviousSubstep1Step = (currentStep: Substep1UIStep): Substep1UIStep | null => {
  const currentIndex = SUBSTEP1_STEP_ORDER.indexOf(currentStep);
  return currentIndex > 0 ? SUBSTEP1_STEP_ORDER[currentIndex - 1] : null;
};

// Розрахунок прогресу
export const calculateSubstep1Progress = (currentStep: Substep1UIStep): number => {
  const currentIndex = SUBSTEP1_STEP_ORDER.indexOf(currentStep);
  return Math.round(((currentIndex + 1) / SUBSTEP1_STEP_ORDER.length) * 100);
};

// =================== МІНІМАЛЬНІ ЗНАЧЕННЯ ===================
// Мінімальні значення для валідації
export const SUBSTEP1_LIMITS = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 1000,
  MIN_SEARCH_LENGTH: 2,
} as const;
