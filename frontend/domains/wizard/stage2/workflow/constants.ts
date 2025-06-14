// Stage2 Workflow константи з Orval схем
// Використовуємо готові типи з бекенду для координації підетапів

// =================== ORVAL КОНСТАНТИ ===================
// Імпортуємо готові константи з Orval
export { Stage2GetCurrentState200 } from '@/shared/api/generated/stage2';

// Реекспорт типів з читабельними назвами
export type {
  Stage2GetCurrentState200 as Stage2WorkflowApiState,
  ItemManagerDTO,
} from '@/shared/api/generated/stage2';

// =================== UI КОНСТАНТИ ===================
// UI стани для workflow координації
export const STAGE2_WORKFLOW_UI_STATES = {
  INITIALIZING: 'initializing',
  READY: 'ready',
  ITEM_WIZARD_ACTIVE: 'item-wizard-active',
  LOADING: 'loading',
  SAVING: 'saving',
  ERROR: 'error',
} as const;

export type Stage2WorkflowUIState =
  (typeof STAGE2_WORKFLOW_UI_STATES)[keyof typeof STAGE2_WORKFLOW_UI_STATES];

// Операції workflow
export const STAGE2_WORKFLOW_OPERATIONS = {
  INITIALIZE: 'initialize',
  START_NEW_ITEM: 'start-new-item',
  START_EDIT_ITEM: 'start-edit-item',
  CLOSE_WIZARD: 'close-wizard',
  COMPLETE_STAGE: 'complete-stage',
  SYNCHRONIZE: 'synchronize',
} as const;

export type Stage2WorkflowOperation =
  (typeof STAGE2_WORKFLOW_OPERATIONS)[keyof typeof STAGE2_WORKFLOW_OPERATIONS];

// Підетапи візарда предметів
export const STAGE2_SUBSTEPS = {
  SUBSTEP1: 'substep1',
  SUBSTEP2: 'substep2',
  SUBSTEP3: 'substep3',
  SUBSTEP4: 'substep4',
  SUBSTEP5: 'substep5',
} as const;

export type Stage2Substep = (typeof STAGE2_SUBSTEPS)[keyof typeof STAGE2_SUBSTEPS];

// Порядок підетапів
export const STAGE2_SUBSTEP_ORDER: Stage2Substep[] = [
  STAGE2_SUBSTEPS.SUBSTEP1,
  STAGE2_SUBSTEPS.SUBSTEP2,
  STAGE2_SUBSTEPS.SUBSTEP3,
  STAGE2_SUBSTEPS.SUBSTEP4,
  STAGE2_SUBSTEPS.SUBSTEP5,
];

// =================== ВАЛІДАЦІЯ ===================
// Правила валідації для workflow переходів
export const STAGE2_WORKFLOW_VALIDATION_RULES = {
  canInitialize: (sessionId: string | null) => sessionId !== null,
  canStartNewItem: (sessionId: string | null) => sessionId !== null,
  canStartEditItem: (sessionId: string | null, itemId: string | null) =>
    sessionId !== null && itemId !== null,
  canCloseWizard: (sessionId: string | null) => sessionId !== null,
  canCompleteStage: (sessionId: string | null, itemsCount: number) =>
    sessionId !== null && itemsCount > 0,
  canSynchronize: (sessionId: string | null) => sessionId !== null,
} as const;

// =================== НАВІГАЦІЯ ===================
// Утиліти для навігації між підетапами
export const getNextStage2Substep = (currentSubstep: Stage2Substep): Stage2Substep | null => {
  const currentIndex = STAGE2_SUBSTEP_ORDER.indexOf(currentSubstep);
  return currentIndex < STAGE2_SUBSTEP_ORDER.length - 1
    ? STAGE2_SUBSTEP_ORDER[currentIndex + 1]
    : null;
};

export const getPreviousStage2Substep = (currentSubstep: Stage2Substep): Stage2Substep | null => {
  const currentIndex = STAGE2_SUBSTEP_ORDER.indexOf(currentSubstep);
  return currentIndex > 0 ? STAGE2_SUBSTEP_ORDER[currentIndex - 1] : null;
};

// Розрахунок прогресу workflow
export const calculateStage2WorkflowProgress = (currentSubstep: Stage2Substep): number => {
  const currentIndex = STAGE2_SUBSTEP_ORDER.indexOf(currentSubstep);
  return Math.round(((currentIndex + 1) / STAGE2_SUBSTEP_ORDER.length) * 100);
};

// =================== МІНІМАЛЬНІ ЗНАЧЕННЯ ===================
// Мінімальні значення для валідації workflow
export const STAGE2_WORKFLOW_LIMITS = {
  MIN_ITEMS_COUNT: 1,
  MAX_ITEMS_COUNT: 50,
  MAX_CONCURRENT_WIZARDS: 1,
} as const;
