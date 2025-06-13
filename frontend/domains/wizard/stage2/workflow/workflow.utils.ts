// Утиліти для Stage2 Workflow - ТОНКА ОБГОРТКА
// Мінімальні допоміжні функції БЕЗ дублювання бізнес-логіки

import {
  Stage2WorkflowState,
  Stage2WorkflowEvent,
  STAGE2_WORKFLOW_TRANSITIONS,
  STAGE2_VALIDATION_RULES,
  STAGE2_PROGRESS_STEPS,
} from './workflow.constants';

// =================== ПРОСТИЙ МАППІНГ СТАНУ ===================
export const getProgressPercentage = (currentState: Stage2WorkflowState): number => {
  const currentIndex = STAGE2_PROGRESS_STEPS.findIndex((step) => step.state === currentState);
  return currentIndex === -1
    ? 0
    : Math.round(((currentIndex + 1) / STAGE2_PROGRESS_STEPS.length) * 100);
};

export const getStateLabel = (state: Stage2WorkflowState): string => {
  const step = STAGE2_PROGRESS_STEPS.find((step) => step.state === state);
  return step?.label || state;
};

// =================== ПРОСТІ ПЕРЕВІРКИ СТАНУ ===================
export const isWorkflowCompleted = (state: Stage2WorkflowState): boolean => state === 'COMPLETED';
export const isWorkflowInError = (state: Stage2WorkflowState): boolean => state === 'ERROR';
export const isWorkflowActive = (state: Stage2WorkflowState): boolean =>
  !isWorkflowCompleted(state) && !isWorkflowInError(state);

// =================== МАППІНГ ПІДЕТАПІВ ===================
export const getSubstepFromState = (state: Stage2WorkflowState): string | null => {
  // Простий маппінг без складної логіки
  if (state === 'ITEM_WIZARD_ACTIVE') return 'substep1'; // За замовчуванням
  return null;
};

export const getNextSubstep = (current: string): string | null => {
  const substeps = ['substep1', 'substep2', 'substep3', 'substep4', 'substep5'];
  const currentIndex = substeps.indexOf(current);
  return currentIndex !== -1 && currentIndex < substeps.length - 1
    ? substeps[currentIndex + 1]
    : null;
};

export const getPreviousSubstep = (current: string): string | null => {
  const substeps = ['substep1', 'substep2', 'substep3', 'substep4', 'substep5'];
  const currentIndex = substeps.indexOf(current);
  return currentIndex > 0 ? substeps[currentIndex - 1] : null;
};

// =================== УТИЛІТИ ПЕРЕХОДІВ ===================
export const getNextState = (
  currentState: Stage2WorkflowState,
  event: Stage2WorkflowEvent
): Stage2WorkflowState | null => {
  const transitions = STAGE2_WORKFLOW_TRANSITIONS[currentState] as Record<
    string,
    Stage2WorkflowState
  >;
  return transitions?.[event] || null;
};

export const canTransition = (
  currentState: Stage2WorkflowState,
  event: Stage2WorkflowEvent
): boolean => {
  return getNextState(currentState, event) !== null;
};

// =================== УТИЛІТИ ВАЛІДАЦІЇ ===================
export const validateStateData = (
  state: Stage2WorkflowState,
  data?: { items?: unknown[] }
): boolean => {
  const rules = STAGE2_VALIDATION_RULES[state];
  if (!rules) return true;

  // Перевіряємо чи є canCompleteStage для цього стану
  if ('canCompleteStage' in rules && typeof rules.canCompleteStage === 'function') {
    return rules.canCompleteStage(data || {});
  }

  // Інакше використовуємо canProceed
  return rules.canProceed();
};
