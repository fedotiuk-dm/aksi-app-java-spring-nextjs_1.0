// 📋 STAGE2 WORKFLOW: Публічне API домену
// Експорт тільки необхідних компонентів для UI

// =================== ГОЛОВНИЙ ХУК ===================
export { useStage2Workflow } from './use-stage2-workflow.hook';

// =================== СТОР ТА СЕЛЕКТОРИ ===================
export {
  useStage2WorkflowStore,
  useStage2WorkflowSelectors,
  type Stage2WorkflowStore,
} from './store';

// =================== КОНСТАНТИ ===================
export {
  STAGE2_SUBSTEPS,
  STAGE2_SUBSTEP_ORDER,
  STAGE2_WORKFLOW_UI_STATES,
  STAGE2_WORKFLOW_OPERATIONS,
  STAGE2_WORKFLOW_LIMITS,
  type Stage2Substep,
  type Stage2WorkflowUIState,
  type Stage2WorkflowOperation,
} from './constants';

// =================== СХЕМИ ДЛЯ UI ФОРМ ===================
export {
  substepNavigationFormSchema,
  completeStageFormSchema,
  closeWizardFormSchema,
  type SubstepNavigationFormData,
  type CompleteStageFormData,
  type CloseWizardFormData,
} from './schemas';

// =================== ТИПИ ===================
export type { UseStage2WorkflowReturn } from './use-stage2-workflow.hook';
