// Stage1 Workflow константи з Orval схем
// Використовуємо готові типи з бекенду

import {
  Stage1GetClientFormState200,
  Stage1GetClientSearchState200,
  Stage1GetBasicOrderState200,
} from '@/shared/api/generated/stage1';

// =================== СТАНИ З ORVAL ===================
export const STAGE1_CLIENT_FORM_STATES = Stage1GetClientFormState200;
export const STAGE1_CLIENT_SEARCH_STATES = Stage1GetClientSearchState200;
export const STAGE1_BASIC_ORDER_STATES = Stage1GetBasicOrderState200;

// Типи станів
export type Stage1ClientFormState = keyof typeof Stage1GetClientFormState200;
export type Stage1ClientSearchState = keyof typeof Stage1GetClientSearchState200;
export type Stage1BasicOrderState = keyof typeof Stage1GetBasicOrderState200;

// =================== ЗАГАЛЬНІ СТАНИ WORKFLOW ===================
export const STAGE1_WORKFLOW_STATES = {
  IDLE: 'idle',
  INITIALIZING: 'initializing',
  CLIENT_SEARCH: 'client-search',
  CLIENT_CREATION: 'client-creation',
  BASIC_ORDER_INFO: 'basic-order-info',
  COMPLETING: 'completing',
  COMPLETED: 'completed',
  ERROR: 'error',
} as const;

export type Stage1WorkflowState =
  (typeof STAGE1_WORKFLOW_STATES)[keyof typeof STAGE1_WORKFLOW_STATES];

// =================== ПОРЯДОК SUBSTEPS ===================
export const STAGE1_SUBSTEP_ORDER = [
  STAGE1_WORKFLOW_STATES.CLIENT_SEARCH,
  STAGE1_WORKFLOW_STATES.CLIENT_CREATION,
  STAGE1_WORKFLOW_STATES.BASIC_ORDER_INFO,
] as const;

// =================== НАЗВИ SUBSTEPS ДЛЯ UI ===================
export const STAGE1_SUBSTEP_LABELS = {
  [STAGE1_WORKFLOW_STATES.CLIENT_SEARCH]: 'Пошук клієнта',
  [STAGE1_WORKFLOW_STATES.CLIENT_CREATION]: 'Створення клієнта',
  [STAGE1_WORKFLOW_STATES.BASIC_ORDER_INFO]: 'Базова інформація замовлення',
} as const;

// =================== HELPER ФУНКЦІЇ ===================
export const getNextSubstep = (currentSubstep: Stage1WorkflowState): Stage1WorkflowState | null => {
  const substepIndex = STAGE1_SUBSTEP_ORDER.findIndex((step) => step === currentSubstep);
  if (substepIndex === -1 || substepIndex === STAGE1_SUBSTEP_ORDER.length - 1) {
    return null;
  }
  return STAGE1_SUBSTEP_ORDER[substepIndex + 1];
};

export const getPreviousSubstep = (
  currentSubstep: Stage1WorkflowState
): Stage1WorkflowState | null => {
  const substepIndex = STAGE1_SUBSTEP_ORDER.findIndex((step) => step === currentSubstep);
  if (substepIndex <= 0) {
    return null;
  }
  return STAGE1_SUBSTEP_ORDER[substepIndex - 1];
};

export const getSubstepProgress = (currentSubstep: Stage1WorkflowState): number => {
  const substepIndex = STAGE1_SUBSTEP_ORDER.findIndex((step) => step === currentSubstep);
  if (substepIndex === -1) return 0;
  return Math.round(((substepIndex + 1) / STAGE1_SUBSTEP_ORDER.length) * 100);
};
