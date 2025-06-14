// Substep3 Workflow - Публічне API
// Забруднення та дефекти (плями, дефекти, примітки)

// =================== КОНСТАНТИ ===================
export {
  SUBSTEP3_WORKFLOW_STEPS,
  SUBSTEP3_STEP_ORDER,
  SUBSTEP3_VALIDATION_RULES,
  SUBSTEP3_WORKFLOW_LIMITS,
  calculateSubstep3Progress,
  getNextSubstep3Step,
  getPreviousSubstep3Step,
  isFirstSubstep3Step,
  isLastSubstep3Step,
  type Substep3WorkflowStep,
} from './workflow.constants';

// =================== СХЕМИ ===================
export type {
  WorkflowInitializationFormData,
  WorkflowNavigationFormData,
  WorkflowCompletionFormData,
  StainsDefectsResponse,
  StainsDefectsContextResponse,
  StainTypeResponse,
  DefectTypeResponse,
  SubstepResultResponse,
} from './schemas';

// =================== СТОР ===================
export { useSubstep3WorkflowStore, useSubstep3WorkflowSelectors } from './workflow.store';

// =================== ТИПИ ===================
export type {
  Substep3WorkflowUIState,
  Substep3WorkflowUIActions,
  Substep3WorkflowStore,
} from './workflow.store';

// =================== ГОЛОВНИЙ ХУК ===================
export { useSubstep3Workflow } from './use-substep3-workflow.hook';
export type { UseSubstep3WorkflowReturn } from './use-substep3-workflow.hook';
