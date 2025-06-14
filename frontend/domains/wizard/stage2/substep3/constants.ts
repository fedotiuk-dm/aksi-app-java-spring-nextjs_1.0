// Substep3 Stains & Defects константи з Orval схем
// Використовуємо готові типи з бекенду для забруднень та дефектів

// =================== ORVAL КОНСТАНТИ ===================
// Імпортуємо готові константи з Orval
export {
  StainsDefectsContextCurrentState,
  StainTypeDTORiskLevel,
  DefectTypeDTORiskLevel,
  Substep3GoBackTargetState,
} from '@/shared/api/generated/substep3';

// Реекспорт типів з читабельними назвами
export type {
  StainsDefectsContextCurrentState as Substep3ApiState,
  Substep3ProcessStainSelectionParams,
  Substep3ProcessDefectSelectionParams,
  Substep3ProcessDefectNotesParams,
  Substep3GoBackParams,
  StainTypeDTO,
  DefectTypeDTO,
  StainsDefectsDTO,
  StainsDefectsContext,
  OrderItemAddRequest,
} from '@/shared/api/generated/substep3';

// =================== UI КОНСТАНТИ ===================
// Базові кроки UI для substep3
export const SUBSTEP3_UI_STEPS = {
  STAIN_SELECTION: 'STAIN_SELECTION',
  DEFECT_SELECTION: 'DEFECT_SELECTION',
  DEFECT_NOTES: 'DEFECT_NOTES',
  VALIDATION: 'VALIDATION',
  COMPLETED: 'COMPLETED',
} as const;

export type Substep3UIStep = (typeof SUBSTEP3_UI_STEPS)[keyof typeof SUBSTEP3_UI_STEPS];

// Порядок кроків
export const SUBSTEP3_STEP_ORDER: Substep3UIStep[] = [
  SUBSTEP3_UI_STEPS.STAIN_SELECTION,
  SUBSTEP3_UI_STEPS.DEFECT_SELECTION,
  SUBSTEP3_UI_STEPS.DEFECT_NOTES,
  SUBSTEP3_UI_STEPS.VALIDATION,
  SUBSTEP3_UI_STEPS.COMPLETED,
];

// Маппінг API станів до UI кроків (використовуємо строкові ключі)
export const API_STATE_TO_UI_STEP = {
  NOT_STARTED: SUBSTEP3_UI_STEPS.STAIN_SELECTION,
  SELECTING_STAINS: SUBSTEP3_UI_STEPS.STAIN_SELECTION,
  SELECTING_DEFECTS: SUBSTEP3_UI_STEPS.DEFECT_SELECTION,
  ENTERING_NOTES: SUBSTEP3_UI_STEPS.DEFECT_NOTES,
  VALIDATING_DATA: SUBSTEP3_UI_STEPS.VALIDATION,
  COMPLETED: SUBSTEP3_UI_STEPS.COMPLETED,
  ERROR: SUBSTEP3_UI_STEPS.STAIN_SELECTION, // Повертаємось на початок при помилці
} as const;

// =================== ВАЛІДАЦІЯ ===================
// Правила валідації для переходів між кроками
export const SUBSTEP3_VALIDATION_RULES = {
  canProceedFromStainSelection: (selectedStains: string[]) => selectedStains.length > 0,
  canProceedFromDefectSelection: (selectedDefects: string[], noGuaranteeReason?: string) =>
    selectedDefects.length > 0 || !!noGuaranteeReason,
  canProceedFromDefectNotes: (defectNotes: string) => defectNotes.trim().length >= 10,
  canCompleteSubstep: (stains: string[], defects: string[], notes: string) =>
    stains.length > 0 && (defects.length > 0 || notes.trim().length >= 10),
} as const;

// =================== НАВІГАЦІЯ ===================
// Утиліти для навігації між кроками
export const getNextSubstep3Step = (currentStep: Substep3UIStep): Substep3UIStep | null => {
  const currentIndex = SUBSTEP3_STEP_ORDER.indexOf(currentStep);
  return currentIndex < SUBSTEP3_STEP_ORDER.length - 1
    ? SUBSTEP3_STEP_ORDER[currentIndex + 1]
    : null;
};

export const getPreviousSubstep3Step = (currentStep: Substep3UIStep): Substep3UIStep | null => {
  const currentIndex = SUBSTEP3_STEP_ORDER.indexOf(currentStep);
  return currentIndex > 0 ? SUBSTEP3_STEP_ORDER[currentIndex - 1] : null;
};

export const calculateSubstep3Progress = (currentStep: Substep3UIStep): number => {
  const currentIndex = SUBSTEP3_STEP_ORDER.indexOf(currentStep);
  return Math.round(((currentIndex + 1) / SUBSTEP3_STEP_ORDER.length) * 100);
};

export const isSubstep3StepCompleted = (
  step: Substep3UIStep,
  currentStep: Substep3UIStep
): boolean => {
  const stepIndex = SUBSTEP3_STEP_ORDER.indexOf(step);
  const currentIndex = SUBSTEP3_STEP_ORDER.indexOf(currentStep);
  return stepIndex < currentIndex;
};

// =================== ЛІМІТИ ===================
// Мінімальні та максимальні значення
export const SUBSTEP3_LIMITS = {
  MIN_STAIN_SELECTION: 1,
  MAX_STAIN_SELECTION: 10,
  MIN_DEFECT_SELECTION: 0, // Може бути 0 якщо є noGuaranteeReason
  MAX_DEFECT_SELECTION: 15,
  MIN_DEFECT_NOTES_LENGTH: 10,
  MAX_DEFECT_NOTES_LENGTH: 1000,
  MAX_STEPS: SUBSTEP3_STEP_ORDER.length,
  DEBOUNCE_DELAY: 300, // мс для debounce
} as const;

// =================== ЛЕЙБЛИ ===================
// Читабельні назви для UI
export const SUBSTEP3_STEP_LABELS: Record<Substep3UIStep, string> = {
  [SUBSTEP3_UI_STEPS.STAIN_SELECTION]: 'Вибір забруднень',
  [SUBSTEP3_UI_STEPS.DEFECT_SELECTION]: 'Вибір дефектів',
  [SUBSTEP3_UI_STEPS.DEFECT_NOTES]: 'Примітки до дефектів',
  [SUBSTEP3_UI_STEPS.VALIDATION]: 'Валідація даних',
  [SUBSTEP3_UI_STEPS.COMPLETED]: 'Завершено',
} as const;

export const SUBSTEP3_API_STATE_LABELS = {
  NOT_STARTED: 'Не розпочато',
  SELECTING_STAINS: 'Вибір забруднень',
  SELECTING_DEFECTS: 'Вибір дефектів',
  ENTERING_NOTES: 'Введення приміток',
  VALIDATING_DATA: 'Валідація даних',
  COMPLETED: 'Завершено',
  ERROR: 'Помилка',
} as const;
