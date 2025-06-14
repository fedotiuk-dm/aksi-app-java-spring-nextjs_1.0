// Substep5 Workflow константи з Orval схем
// Використовуємо готові типи з бекенду для photo-documentation

// =================== ORVAL КОНСТАНТИ ===================
// Імпортуємо готові константи з Orval
export {
  SubstepResultDTOCurrentState,
  SubstepResultDTOPreviousState,
  SubstepResultDTOAvailableEventsItem,
} from '@/shared/api/generated/substep5/aksiApi.schemas';

// Реекспорт типів
export type {
  SubstepResultDTOCurrentState as Substep5State,
  SubstepResultDTOPreviousState as Substep5PreviousState,
  SubstepResultDTOAvailableEventsItem as Substep5Event,
} from '@/shared/api/generated/substep5/aksiApi.schemas';

// =================== UI WORKFLOW СТАНИ ===================
// Базові стани для UI координації (НЕ дублюємо API стани)
export const SUBSTEP5_WORKFLOW_STEPS = {
  INITIALIZATION: 'initialization',
  PHOTO_UPLOAD: 'photo-upload',
  PHOTO_REVIEW: 'photo-review',
  ANNOTATIONS: 'annotations',
  COMPLETION: 'completion',
  FINALIZATION: 'finalization',
} as const;

export type Substep5WorkflowStep =
  (typeof SUBSTEP5_WORKFLOW_STEPS)[keyof typeof SUBSTEP5_WORKFLOW_STEPS];

// Порядок кроків для навігації
export const SUBSTEP5_STEP_ORDER: Substep5WorkflowStep[] = [
  SUBSTEP5_WORKFLOW_STEPS.INITIALIZATION,
  SUBSTEP5_WORKFLOW_STEPS.PHOTO_UPLOAD,
  SUBSTEP5_WORKFLOW_STEPS.PHOTO_REVIEW,
  SUBSTEP5_WORKFLOW_STEPS.ANNOTATIONS,
  SUBSTEP5_WORKFLOW_STEPS.COMPLETION,
  SUBSTEP5_WORKFLOW_STEPS.FINALIZATION,
];

// =================== ВАЛІДАЦІЯ ===================
// Правила переходів між кроками
export const SUBSTEP5_VALIDATION_RULES = {
  canGoToPhotoUpload: (sessionId: string | null, itemId: string | null) =>
    sessionId !== null && itemId !== null,
  canGoToPhotoReview: (uploadedPhotosCount: number) => uploadedPhotosCount > 0,
  canGoToAnnotations: (uploadedPhotosCount: number) => uploadedPhotosCount > 0,
  canGoToCompletion: (uploadedPhotosCount: number, minPhotosRequired: number) =>
    uploadedPhotosCount >= minPhotosRequired,
  canFinalize: (
    uploadedPhotosCount: number,
    minPhotosRequired: number,
    documentationCompleted: boolean
  ) => uploadedPhotosCount >= minPhotosRequired && documentationCompleted,
} as const;

// =================== ЛІМІТИ ===================
// Мінімальні та максимальні значення
export const SUBSTEP5_WORKFLOW_LIMITS = {
  MIN_PHOTOS: 1,
  MAX_PHOTOS: 10,
  MAX_FILE_SIZE_MB: 10,
  MIN_ANNOTATION_LENGTH: 0,
  MAX_ANNOTATION_LENGTH: 500,
  MAX_STEPS: SUBSTEP5_STEP_ORDER.length,
  UPLOAD_TIMEOUT_MS: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// =================== ПРОГРЕС ===================
// Розрахунок прогресу
export const calculateSubstep5Progress = (currentStep: Substep5WorkflowStep): number => {
  const currentIndex = SUBSTEP5_STEP_ORDER.indexOf(currentStep);
  return Math.round(((currentIndex + 1) / SUBSTEP5_STEP_ORDER.length) * 100);
};

// =================== НАВІГАЦІЯ ===================
// Утиліти для навігації
export const getNextSubstep5Step = (
  currentStep: Substep5WorkflowStep
): Substep5WorkflowStep | null => {
  const currentIndex = SUBSTEP5_STEP_ORDER.indexOf(currentStep);
  return currentIndex < SUBSTEP5_STEP_ORDER.length - 1
    ? SUBSTEP5_STEP_ORDER[currentIndex + 1]
    : null;
};

export const getPreviousSubstep5Step = (
  currentStep: Substep5WorkflowStep
): Substep5WorkflowStep | null => {
  const currentIndex = SUBSTEP5_STEP_ORDER.indexOf(currentStep);
  return currentIndex > 0 ? SUBSTEP5_STEP_ORDER[currentIndex - 1] : null;
};

// Перевірка чи це перший/останній крок
export const isFirstSubstep5Step = (currentStep: Substep5WorkflowStep): boolean => {
  return currentStep === SUBSTEP5_WORKFLOW_STEPS.INITIALIZATION;
};

export const isLastSubstep5Step = (currentStep: Substep5WorkflowStep): boolean => {
  return currentStep === SUBSTEP5_WORKFLOW_STEPS.FINALIZATION;
};

// =================== СТАНИ ДОКУМЕНТАЦІЇ ===================
// Маппінг між API станами та UI станами
export const mapApiStateToWorkflowStep = (apiState: string): Substep5WorkflowStep => {
  switch (apiState) {
    case 'SUBSTEP5_INITIALIZING':
      return SUBSTEP5_WORKFLOW_STEPS.INITIALIZATION;
    case 'SUBSTEP5_UPLOADING_PHOTOS':
      return SUBSTEP5_WORKFLOW_STEPS.PHOTO_UPLOAD;
    case 'SUBSTEP5_REVIEWING_PHOTOS':
      return SUBSTEP5_WORKFLOW_STEPS.PHOTO_REVIEW;
    case 'SUBSTEP5_ADDING_ANNOTATIONS':
      return SUBSTEP5_WORKFLOW_STEPS.ANNOTATIONS;
    case 'SUBSTEP5_COMPLETING':
      return SUBSTEP5_WORKFLOW_STEPS.COMPLETION;
    case 'SUBSTEP5_COMPLETED':
      return SUBSTEP5_WORKFLOW_STEPS.FINALIZATION;
    default:
      return SUBSTEP5_WORKFLOW_STEPS.INITIALIZATION;
  }
};

// =================== ВАЛІДАЦІЯ ФАЙЛІВ ===================
// Утиліти для валідації фото файлів
export const SUBSTEP5_FILE_VALIDATION = {
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const,
  validateFileType: (file: File): boolean => {
    return (SUBSTEP5_FILE_VALIDATION.ALLOWED_TYPES as readonly string[]).includes(file.type);
  },
  validateFileSize: (file: File): boolean => {
    return file.size <= SUBSTEP5_WORKFLOW_LIMITS.MAX_FILE_SIZE_MB * 1024 * 1024;
  },
  validateFilesCount: (filesCount: number): boolean => {
    return (
      filesCount >= SUBSTEP5_WORKFLOW_LIMITS.MIN_PHOTOS &&
      filesCount <= SUBSTEP5_WORKFLOW_LIMITS.MAX_PHOTOS
    );
  },
} as const;
