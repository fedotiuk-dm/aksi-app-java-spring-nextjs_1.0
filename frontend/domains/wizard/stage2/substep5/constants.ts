// Substep5 Constants - ТІЛЬКИ Orval константи + UI кроки
// Використовуємо готові константи з @/shared/api/generated/substep5

// =================== ORVAL КОНСТАНТИ ===================
// Реекспорт готових констант з читабельними назвами
export {
  SubstepResultDTOCurrentState as SUBSTEP5_STATES,
  SubstepResultDTOPreviousState as SUBSTEP5_PREVIOUS_STATES,
  SubstepResultDTOAvailableEventsItem as SUBSTEP5_EVENTS,
} from '@/shared/api/generated/substep5/aksiApi.schemas';

// =================== UI КРОКИ ===================
// Кроки для UI навігації (НЕ дублюють API стани)
export const SUBSTEP5_UI_STEPS = {
  PHOTO_UPLOAD: 'photo_upload',
  PHOTO_REVIEW: 'photo_review',
  ANNOTATIONS: 'annotations',
  COMPLETION: 'completion',
} as const;

export type Substep5UIStep = (typeof SUBSTEP5_UI_STEPS)[keyof typeof SUBSTEP5_UI_STEPS];

// =================== ВАЛІДАЦІЯ ===================
// Правила валідації для фото документації
export const SUBSTEP5_VALIDATION_RULES = {
  MAX_PHOTOS: 10,
  MAX_FILE_SIZE_MB: 10,
  MIN_PHOTOS: 1,
  ALLOWED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_ANNOTATION_LENGTH: 500,
  MIN_ANNOTATION_LENGTH: 0,
} as const;

// =================== НАВІГАЦІЯ ===================
// Утиліти для навігації між кроками
export const getNextSubstep5Step = (currentStep: Substep5UIStep): Substep5UIStep | null => {
  const steps = Object.values(SUBSTEP5_UI_STEPS);
  const currentIndex = steps.indexOf(currentStep);
  return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
};

export const getPreviousSubstep5Step = (currentStep: Substep5UIStep): Substep5UIStep | null => {
  const steps = Object.values(SUBSTEP5_UI_STEPS);
  const currentIndex = steps.indexOf(currentStep);
  return currentIndex > 0 ? steps[currentIndex - 1] : null;
};

export const isFirstSubstep5Step = (step: Substep5UIStep): boolean => {
  return step === SUBSTEP5_UI_STEPS.PHOTO_UPLOAD;
};

export const isLastSubstep5Step = (step: Substep5UIStep): boolean => {
  return step === SUBSTEP5_UI_STEPS.COMPLETION;
};

// =================== ЛІМІТИ ТА НАЛАШТУВАННЯ ===================
// Технічні ліміти для фото документації
export const SUBSTEP5_LIMITS = {
  UPLOAD_TIMEOUT_MS: 30000,
  RETRY_ATTEMPTS: 3,
  THUMBNAIL_SIZE: 150,
  PREVIEW_SIZE: 800,
  COMPRESSION_QUALITY: 0.8,
} as const;

// =================== ТИПИ ===================
export type Substep5ValidationRules = typeof SUBSTEP5_VALIDATION_RULES;
export type Substep5Limits = typeof SUBSTEP5_LIMITS;
