// Substep4 Workflow - Публічне API
// Розрахунок ціни (базова ціна, модифікатори, фінальна ціна)

// =================== КОНСТАНТИ ===================
export {
  SUBSTEP4_WORKFLOW_STEPS,
  SUBSTEP4_STEP_ORDER,
  SUBSTEP4_VALIDATION_RULES,
  SUBSTEP4_WORKFLOW_LIMITS,
  calculateSubstep4Progress,
  getNextSubstep4Step,
  getPreviousSubstep4Step,
  isFirstSubstep4Step,
  isLastSubstep4Step,
  type Substep4WorkflowStep,
} from './workflow.constants';

// =================== СХЕМИ ===================
export type {
  WorkflowInitializationFormData,
  WorkflowNavigationFormData,
  WorkflowCompletionFormData,
  PriceDiscountResponse,
  PriceCalculationRequestResponse,
  PriceCalculationResponseResponse,
  PriceModifierResponse,
  SubstepResultResponse,
} from './schemas';

// =================== СТОР ===================
export {
  useSubstep4WorkflowStore,
  useSubstep4WorkflowSelectors,
  type Substep4WorkflowUIState,
  type Substep4WorkflowUIActions,
  type Substep4WorkflowStore,
} from './workflow.store';

// =================== ГОЛОВНИЙ ХУК ===================
export { useSubstep4Workflow, type UseSubstep4WorkflowReturn } from './use-substep4-workflow.hook';
