// Substep5 Workflow - Публічне API
// Експорт тільки необхідних компонентів для UI

// =================== ГОЛОВНИЙ ХУК ===================
export { useSubstep5Workflow } from './use-substep5-workflow.hook';
export type { UseSubstep5WorkflowReturn } from './use-substep5-workflow.hook';

// =================== СТОР ТА СЕЛЕКТОРИ ===================
export { useSubstep5WorkflowStore, useSubstep5WorkflowSelectors } from './workflow.store';
export type {
  Substep5WorkflowStore,
  Substep5WorkflowUIState,
  Substep5WorkflowUIActions,
  PhotoUploadInfo,
} from './workflow.store';

// =================== КОНСТАНТИ ===================
export {
  SUBSTEP5_WORKFLOW_STEPS,
  SUBSTEP5_WORKFLOW_LIMITS,
  SUBSTEP5_STEP_ORDER,
  SUBSTEP5_VALIDATION_RULES,
  SUBSTEP5_FILE_VALIDATION,
  calculateSubstep5Progress,
  getNextSubstep5Step,
  getPreviousSubstep5Step,
  isFirstSubstep5Step,
  isLastSubstep5Step,
  mapApiStateToWorkflowStep,
} from './workflow.constants';
export type { Substep5WorkflowStep, Substep5State, Substep5Event } from './workflow.constants';

// =================== СХЕМИ ТА ТИПИ ===================
export {
  workflowInitializationFormSchema,
  workflowNavigationFormSchema,
  workflowCompletionFormSchema,
  photoValidationFormSchema,
} from './schemas';
export type {
  WorkflowInitializationFormData,
  WorkflowNavigationFormData,
  WorkflowCompletionFormData,
  PhotoValidationFormData,
  InitializePhotoDocumentationParams,
  AddPhotoParams,
  RemovePhotoParams,
  CompletePhotoDocumentationParams,
  PhotoDocumentationResponse,
  OrderItemPhotoResponse,
  SubstepResultResponse,
} from './schemas';
