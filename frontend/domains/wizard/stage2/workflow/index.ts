// Публічне API для Stage2 Workflow

// Основні компоненти
export { useStage2WorkflowStore, useStage2WorkflowSelectors } from './workflow.store';

// Константи та типи
export {
  STAGE2_WORKFLOW_STATES,
  STAGE2_WORKFLOW_EVENTS,
  STAGE2_PROGRESS_STEPS,
  type Stage2WorkflowState,
  type Stage2WorkflowEvent,
} from './workflow.constants';

// Утиліти
export {
  getProgressPercentage,
  getStateLabel,
  isWorkflowCompleted,
  isWorkflowInError,
  isWorkflowActive,
  getNextState,
  canTransition,
  validateStateData,
  getSubstepFromState,
  getNextSubstep,
  getPreviousSubstep,
} from './workflow.utils';
