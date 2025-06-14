// Публічне API для Substep1 Workflow домену

// =================== ГОЛОВНИЙ ХУК ===================
export { useSubstep1Workflow } from './use-substep1-workflow.hook';
export type { UseSubstep1WorkflowReturn } from './use-substep1-workflow.hook';

// =================== КОНСТАНТИ ===================
export {
  SUBSTEP1_WORKFLOW_STEPS,
  SUBSTEP1_STEP_ORDER,
  SUBSTEP1_VALIDATION_RULES,
  SUBSTEP1_WORKFLOW_LIMITS,
  calculateSubstep1Progress,
  getNextSubstep1Step,
  getPreviousSubstep1Step,
  isFirstSubstep1Step,
  isLastSubstep1Step,
  type Substep1WorkflowStep,
} from './workflow.constants';

// =================== СТОР (якщо потрібен прямий доступ) ===================
export { useSubstep1WorkflowStore, useSubstep1WorkflowSelectors } from './workflow.store';

// =================== СХЕМИ ТА ФОРМИ ===================
// Orval схеми
export type {
  ItemBasicInfoResponse,
  ServiceCategoryResponse,
  PriceListItemResponse,
  SubstepResultResponse,
} from './schemas';

// UI форми (якщо потрібні в UI)
export {
  workflowInitializationFormSchema,
  workflowNavigationFormSchema,
  workflowCompletionFormSchema,
  type WorkflowInitializationFormData,
  type WorkflowNavigationFormData,
  type WorkflowCompletionFormData,
} from './schemas';
