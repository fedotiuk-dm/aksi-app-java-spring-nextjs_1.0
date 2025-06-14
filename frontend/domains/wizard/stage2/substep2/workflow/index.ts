// 📋 SUBSTEP2 WORKFLOW: Публічне API для координації характеристик предмета
// Експортуємо хук, константи, стор та схеми

// =================== ГОЛОВНИЙ ХУК ===================
export { useSubstep2Workflow } from './use-substep2-workflow.hook';
export type { UseSubstep2WorkflowReturn } from './use-substep2-workflow.hook';

// =================== КОНСТАНТИ ===================
export {
  SUBSTEP2_UI_STEPS,
  SUBSTEP2_STEP_ORDER,
  SUBSTEP2_VALIDATION_RULES,
  SUBSTEP2_LIMITS,
  calculateSubstep2Progress,
  getNextSubstep2Step,
  getPreviousSubstep2Step,
  isFirstSubstep2Step,
  isLastSubstep2Step,
  type Substep2UIStep,
} from './workflow.constants';

// =================== СТОР ===================
export { useSubstep2WorkflowStore, useSubstep2WorkflowSelectors } from './workflow.store';

// =================== ТИПИ ===================
export type {
  Substep2WorkflowUIState,
  Substep2WorkflowUIActions,
  Substep2WorkflowStore,
} from './workflow.store';

// =================== ORVAL СХЕМИ (якщо потрібні в UI) ===================
export type { OrderItemDTO, AdditionalInfoDTO, SubstepResultDTO, ErrorResponse } from './schemas';

// =================== UI ФОРМИ (якщо потрібні в UI) ===================
export {
  initializationFormSchema,
  navigationFormSchema,
  completionFormSchema,
  type InitializationFormData,
  type NavigationFormData,
  type CompletionFormData,
} from './schemas';
