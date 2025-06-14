// Substep2 Item Characteristics константи з Orval схем
// Використовуємо готові типи з бекенду для характеристик предмета

// =================== ORVAL КОНСТАНТИ ===================
// Імпортуємо готові константи з Orval
export {
  SubstepResultDTOCurrentState,
  SubstepResultDTOAvailableEventsItem,
} from '@/shared/api/generated/substep2';

// Реекспорт типів з читабельними назвами
export type {
  SubstepResultDTOCurrentState as Substep2ApiState,
  SubstepResultDTOAvailableEventsItem as Substep2ApiEvent,
  Substep2SelectMaterialParams,
  Substep2SelectColorParams,
  Substep2SelectFillerParams,
  Substep2SelectWearLevelParams,
  OrderItemDTO,
  AdditionalInfoDTO,
} from '@/shared/api/generated/substep2';

// =================== UI КОНСТАНТИ ===================
// Базові кроки для UI координації (НЕ дублюємо API стани)
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
  canGoToColorSelection: (selectedMaterialId: string | null) => selectedMaterialId !== null,
  canGoToFillerSelection: (selectedMaterialId: string | null, selectedColorId: string | null) =>
    selectedMaterialId !== null && selectedColorId !== null,
  canGoToWearLevelSelection: (
    selectedMaterialId: string | null,
    selectedColorId: string | null,
    selectedFillerId: string | null
  ) => selectedMaterialId !== null && selectedColorId !== null && selectedFillerId !== null,
  canValidate: (
    selectedMaterialId: string | null,
    selectedColorId: string | null,
    selectedFillerId: string | null,
    selectedWearLevelId: string | null
  ) =>
    selectedMaterialId !== null &&
    selectedColorId !== null &&
    selectedFillerId !== null &&
    selectedWearLevelId !== null,
  canComplete: (
    selectedMaterialId: string | null,
    selectedColorId: string | null,
    selectedFillerId: string | null,
    selectedWearLevelId: string | null
  ) =>
    selectedMaterialId !== null &&
    selectedColorId !== null &&
    selectedFillerId !== null &&
    selectedWearLevelId !== null,
} as const;

// =================== ЛІМІТИ ===================
// Мінімальні та максимальні значення
export const SUBSTEP2_LIMITS = {
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 50,
  MAX_STEPS: SUBSTEP2_STEP_ORDER.length,
  MAX_SELECTIONS_PER_TYPE: 1, // Тільки один вибір кожного типу
  DEBOUNCE_DELAY: 300, // мс для debounce пошуку
} as const;

// =================== ПРОГРЕС ===================
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

// Перевірка чи це перший/останній крок
export const isFirstSubstep2Step = (currentStep: Substep2UIStep): boolean => {
  return currentStep === SUBSTEP2_UI_STEPS.MATERIAL_SELECTION;
};

export const isLastSubstep2Step = (currentStep: Substep2UIStep): boolean => {
  return currentStep === SUBSTEP2_UI_STEPS.COMPLETED;
};
