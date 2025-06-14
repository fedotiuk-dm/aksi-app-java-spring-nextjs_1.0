// 📋 ПІДЕТАП 2.5: Публічне API домену - фотодокументація
// Експорт тільки необхідних елементів для використання в UI компонентах

// =================== ГОЛОВНІ ХУКИ ===================
// ✅ Основний хук домену - єдина точка входу
export { useSubstep5PhotoDocumentation } from './use-substep5-photo-documentation.hook';
export type { UseSubstep5PhotoDocumentationReturn } from './use-substep5-photo-documentation.hook';

// ✅ Workflow хук - координація між кроками
export { useSubstep5Workflow } from './workflow';
export type { UseSubstep5WorkflowReturn } from './workflow';

// =================== СТОР ТА СЕЛЕКТОРИ ===================
// Основний стор домену
export {
  usePhotoDocumentationStore,
  usePhotoDocumentationSelectors,
} from './photo-documentation.store';

// Workflow стор
export { useSubstep5WorkflowStore, useSubstep5WorkflowSelectors } from './workflow';

// =================== КОНСТАНТИ ===================
// Основні константи домену
export {
  SUBSTEP5_UI_STEPS,
  SUBSTEP5_VALIDATION_RULES,
  SUBSTEP5_LIMITS,
  getNextSubstep5Step,
  getPreviousSubstep5Step,
  isFirstSubstep5Step,
  isLastSubstep5Step,
} from './constants';
export type { Substep5UIStep, Substep5ValidationRules, Substep5Limits } from './constants';

// Workflow константи
export {
  SUBSTEP5_WORKFLOW_STEPS,
  SUBSTEP5_WORKFLOW_LIMITS,
  SUBSTEP5_STEP_ORDER,
  SUBSTEP5_VALIDATION_RULES as WORKFLOW_VALIDATION_RULES,
  SUBSTEP5_FILE_VALIDATION,
} from './workflow';

// =================== СХЕМИ ТА ТИПИ ===================
// Основні схеми домену
export {
  // Zod схеми
  photoUploadFormSchema,
  photoAnnotationFormSchema,
  stepNavigationFormSchema,
  completionFormSchema,
} from './schemas';
export type {
  // TypeScript типи
  PhotoDocumentationSchema,
  OrderItemPhotoSchema,
  SubstepResultSchema,
  ErrorResponseSchema,

  // Params схеми
  InitializePhotoDocumentationParamsSchema,
  AddPhotoParamsSchema,
  RemovePhotoParamsSchema,
  CompletePhotoDocumentationParamsSchema,
  GetDocumentationStatusParamsSchema,
  GetDocumentationDataParamsSchema,

  // Body схеми
  AddPhotoBodySchema,

  // Response схеми
  InitializePhotoDocumentationResponseSchema,
  AddPhotoResponseSchema,
  RemovePhotoResponseSchema,
  CompletePhotoDocumentationResponseSchema,
  GetDocumentationStatusResponseSchema,
  GetDocumentationDataResponseSchema,

  // UI форми типи
  PhotoUploadFormData,
  PhotoAnnotationFormData,
  StepNavigationFormData,
  CompletionFormData,
} from './schemas';

// Workflow схеми
export {
  workflowInitializationFormSchema,
  workflowNavigationFormSchema,
  workflowCompletionFormSchema,
  photoValidationFormSchema,
} from './workflow';
export type {
  WorkflowInitializationFormData,
  WorkflowNavigationFormData,
  WorkflowCompletionFormData,
  PhotoValidationFormData,
  Substep5WorkflowStep,
  PhotoUploadInfo,
} from './workflow';

// =================== УТИЛІТИ ===================
// Утиліти доступні через константи та workflow
// Валідація файлів: SUBSTEP5_VALIDATION_RULES, SUBSTEP5_FILE_VALIDATION
// Навігація: getNextSubstep5Step, getPreviousSubstep5Step
