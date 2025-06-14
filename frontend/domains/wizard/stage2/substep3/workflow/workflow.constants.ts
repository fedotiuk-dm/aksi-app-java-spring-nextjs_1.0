// Substep3 Workflow константи з Orval схем
// Використовуємо готові типи з бекенду для stains-defects

// =================== ORVAL КОНСТАНТИ ===================
// Імпортуємо готові константи з Orval
export {
  SubstepResultDTOCurrentState,
  SubstepResultDTOAvailableEventsItem,
  StainTypeDTORiskLevel,
  DefectTypeDTORiskLevel,
} from '@/shared/api/generated/substep3';

// Реекспорт типів
export type {
  SubstepResultDTOCurrentState as Substep3State,
  SubstepResultDTOAvailableEventsItem as Substep3Event,
  StainTypeDTORiskLevel as StainRiskLevel,
  DefectTypeDTORiskLevel as DefectRiskLevel,
} from '@/shared/api/generated/substep3';

// =================== UI WORKFLOW СТАНИ ===================
// Тільки для UI координації (НЕ дублюємо API стани)
export const SUBSTEP3_WORKFLOW_STEPS = {
  STAIN_SELECTION: 'stain-selection',
  DEFECT_SELECTION: 'defect-selection',
  DEFECT_NOTES: 'defect-notes',
  VALIDATION: 'validation',
  COMPLETED: 'completed',
} as const;

export type Substep3WorkflowStep =
  (typeof SUBSTEP3_WORKFLOW_STEPS)[keyof typeof SUBSTEP3_WORKFLOW_STEPS];

// Порядок кроків для навігації
export const SUBSTEP3_STEP_ORDER: Substep3WorkflowStep[] = [
  SUBSTEP3_WORKFLOW_STEPS.STAIN_SELECTION,
  SUBSTEP3_WORKFLOW_STEPS.DEFECT_SELECTION,
  SUBSTEP3_WORKFLOW_STEPS.DEFECT_NOTES,
  SUBSTEP3_WORKFLOW_STEPS.VALIDATION,
  SUBSTEP3_WORKFLOW_STEPS.COMPLETED,
];

// =================== ВАЛІДАЦІЯ ===================
// Правила переходів між кроками
export const SUBSTEP3_VALIDATION_RULES = {
  canGoToDefectSelection: (selectedStains: string[]) => selectedStains.length >= 0, // Можна без плям
  canGoToDefectNotes: (selectedDefects: string[]) => selectedDefects.length >= 0, // Можна без дефектів
  canValidate: (selectedStains: string[], selectedDefects: string[], notes: string) => {
    // Якщо є дефекти високого ризику, потрібні примітки
    const hasHighRiskDefects = selectedDefects.length > 0; // Спрощено для UI
    return !hasHighRiskDefects || (hasHighRiskDefects && notes.trim().length > 0);
  },
  canComplete: (selectedStains: string[], selectedDefects: string[], notes: string) => {
    // Можна завершити якщо пройшли валідацію
    return SUBSTEP3_VALIDATION_RULES.canValidate(selectedStains, selectedDefects, notes);
  },
} as const;

// =================== ЛІМІТИ ===================
// Мінімальні та максимальні значення
export const SUBSTEP3_WORKFLOW_LIMITS = {
  MAX_STAINS: 20,
  MAX_DEFECTS: 20,
  MIN_NOTES_LENGTH: 0,
  MAX_NOTES_LENGTH: 1000,
  MAX_STEPS: SUBSTEP3_STEP_ORDER.length,
} as const;

// =================== ПРОГРЕС ===================
// Розрахунок прогресу
export const calculateSubstep3Progress = (currentStep: Substep3WorkflowStep): number => {
  const currentIndex = SUBSTEP3_STEP_ORDER.indexOf(currentStep);
  return Math.round(((currentIndex + 1) / SUBSTEP3_STEP_ORDER.length) * 100);
};

// =================== НАВІГАЦІЯ ===================
// Утиліти для навігації
export const getNextSubstep3Step = (
  currentStep: Substep3WorkflowStep
): Substep3WorkflowStep | null => {
  const currentIndex = SUBSTEP3_STEP_ORDER.indexOf(currentStep);
  return currentIndex < SUBSTEP3_STEP_ORDER.length - 1
    ? SUBSTEP3_STEP_ORDER[currentIndex + 1]
    : null;
};

export const getPreviousSubstep3Step = (
  currentStep: Substep3WorkflowStep
): Substep3WorkflowStep | null => {
  const currentIndex = SUBSTEP3_STEP_ORDER.indexOf(currentStep);
  return currentIndex > 0 ? SUBSTEP3_STEP_ORDER[currentIndex - 1] : null;
};

// Перевірка чи це перший/останній крок
export const isFirstSubstep3Step = (currentStep: Substep3WorkflowStep): boolean => {
  return currentStep === SUBSTEP3_WORKFLOW_STEPS.STAIN_SELECTION;
};

export const isLastSubstep3Step = (currentStep: Substep3WorkflowStep): boolean => {
  return currentStep === SUBSTEP3_WORKFLOW_STEPS.COMPLETED;
};
