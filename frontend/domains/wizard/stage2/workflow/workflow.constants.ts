// Константи для Stage2 Workflow - Координація підетапів додавання предметів
// Використовуємо стани з Spring State Machine через Orval

import { Stage2GetCurrentState200 } from '@/shared/api/generated/stage2';

// =================== СТАНИ WORKFLOW (З ORVAL) ===================
export const STAGE2_WORKFLOW_STATES = Stage2GetCurrentState200;

export type Stage2WorkflowState = keyof typeof STAGE2_WORKFLOW_STATES;

// =================== ПОДІЇ ПЕРЕХОДІВ ===================
export const STAGE2_WORKFLOW_EVENTS = {
  // Початок роботи з предметами
  START_NEW_ITEM: 'START_NEW_ITEM',
  START_EDIT_ITEM: 'START_EDIT_ITEM',

  // Навігація між підетапами
  PROCEED_TO_CHARACTERISTICS: 'PROCEED_TO_CHARACTERISTICS',
  PROCEED_TO_STAINS_DEFECTS: 'PROCEED_TO_STAINS_DEFECTS',
  PROCEED_TO_PRICE_CALCULATION: 'PROCEED_TO_PRICE_CALCULATION',
  PROCEED_TO_PHOTO_DOCUMENTATION: 'PROCEED_TO_PHOTO_DOCUMENTATION',
  PROCEED_TO_REVIEW: 'PROCEED_TO_REVIEW',

  // Повернення назад
  GO_BACK_TO_BASIC_INFO: 'GO_BACK_TO_BASIC_INFO',
  GO_BACK_TO_CHARACTERISTICS: 'GO_BACK_TO_CHARACTERISTICS',
  GO_BACK_TO_STAINS_DEFECTS: 'GO_BACK_TO_STAINS_DEFECTS',
  GO_BACK_TO_PRICE_CALCULATION: 'GO_BACK_TO_PRICE_CALCULATION',
  GO_BACK_TO_PHOTO_DOCUMENTATION: 'GO_BACK_TO_PHOTO_DOCUMENTATION',

  // Завершення роботи з предметом
  CONFIRM_ITEM: 'CONFIRM_ITEM',
  CANCEL_ITEM: 'CANCEL_ITEM',

  // Повернення до менеджера
  RETURN_TO_MANAGER: 'RETURN_TO_MANAGER',

  // Завершення етапу
  COMPLETE_STAGE: 'COMPLETE_STAGE',
} as const;

export type Stage2WorkflowEvent =
  (typeof STAGE2_WORKFLOW_EVENTS)[keyof typeof STAGE2_WORKFLOW_EVENTS];

// =================== ПЕРЕХОДИ (АДАПТОВАНІ ПІД ORVAL СТАНИ) ===================
export const STAGE2_WORKFLOW_TRANSITIONS = {
  // Початковий стан
  [STAGE2_WORKFLOW_STATES.NOT_STARTED]: {
    [STAGE2_WORKFLOW_EVENTS.START_NEW_ITEM]: STAGE2_WORKFLOW_STATES.INITIALIZING,
  },

  // Ініціалізація
  [STAGE2_WORKFLOW_STATES.INITIALIZING]: {
    [STAGE2_WORKFLOW_EVENTS.START_NEW_ITEM]: STAGE2_WORKFLOW_STATES.ITEMS_MANAGER_SCREEN,
  },

  // Головний екран менеджера предметів
  [STAGE2_WORKFLOW_STATES.ITEMS_MANAGER_SCREEN]: {
    [STAGE2_WORKFLOW_EVENTS.START_NEW_ITEM]: STAGE2_WORKFLOW_STATES.ITEM_WIZARD_ACTIVE,
    [STAGE2_WORKFLOW_EVENTS.START_EDIT_ITEM]: STAGE2_WORKFLOW_STATES.ITEM_WIZARD_ACTIVE,
    [STAGE2_WORKFLOW_EVENTS.COMPLETE_STAGE]: STAGE2_WORKFLOW_STATES.READY_TO_PROCEED,
  },

  // Активний візард предмета (підетапи)
  [STAGE2_WORKFLOW_STATES.ITEM_WIZARD_ACTIVE]: {
    [STAGE2_WORKFLOW_EVENTS.CONFIRM_ITEM]: STAGE2_WORKFLOW_STATES.ITEMS_MANAGER_SCREEN,
    [STAGE2_WORKFLOW_EVENTS.CANCEL_ITEM]: STAGE2_WORKFLOW_STATES.ITEMS_MANAGER_SCREEN,
  },

  // Готовність до переходу
  [STAGE2_WORKFLOW_STATES.READY_TO_PROCEED]: {
    [STAGE2_WORKFLOW_EVENTS.COMPLETE_STAGE]: STAGE2_WORKFLOW_STATES.COMPLETED,
  },

  // Завершено
  [STAGE2_WORKFLOW_STATES.COMPLETED]: {
    // Перехід до Stage3 буде керуватися головним wizard workflow
  },

  // Помилка
  [STAGE2_WORKFLOW_STATES.ERROR]: {
    [STAGE2_WORKFLOW_EVENTS.RETURN_TO_MANAGER]: STAGE2_WORKFLOW_STATES.ITEMS_MANAGER_SCREEN,
  },
} as const;

// =================== ВАЛІДАЦІЯ ПЕРЕХОДІВ ===================
export const STAGE2_VALIDATION_RULES = {
  [STAGE2_WORKFLOW_STATES.NOT_STARTED]: {
    requiredFields: [],
    canProceed: () => true,
  },

  [STAGE2_WORKFLOW_STATES.INITIALIZING]: {
    requiredFields: [],
    canProceed: () => true,
  },

  [STAGE2_WORKFLOW_STATES.ITEMS_MANAGER_SCREEN]: {
    requiredFields: ['items'],
    canCompleteStage: (data: { items?: unknown[] }) => {
      return !!(data?.items && data?.items.length > 0);
    },
    canProceed: () => true,
  },

  [STAGE2_WORKFLOW_STATES.ITEM_WIZARD_ACTIVE]: {
    requiredFields: [], // Валідація відбувається в підетапах
    canProceed: () => true,
  },

  [STAGE2_WORKFLOW_STATES.READY_TO_PROCEED]: {
    requiredFields: ['items'],
    canCompleteStage: (data: { items?: unknown[] }) => {
      return !!(data?.items && data?.items.length > 0);
    },
    canProceed: () => true,
  },

  [STAGE2_WORKFLOW_STATES.COMPLETED]: {
    requiredFields: [],
    canProceed: () => true,
  },

  [STAGE2_WORKFLOW_STATES.ERROR]: {
    requiredFields: [],
    canProceed: () => true,
  },
} as const;

// =================== ПРОГРЕС ЕТАПУ ===================
export const STAGE2_PROGRESS_STEPS = [
  {
    key: 'not_started',
    label: 'Не розпочато',
    state: STAGE2_WORKFLOW_STATES.NOT_STARTED,
  },
  {
    key: 'initializing',
    label: 'Ініціалізація',
    state: STAGE2_WORKFLOW_STATES.INITIALIZING,
  },
  {
    key: 'items_manager',
    label: 'Менеджер предметів',
    state: STAGE2_WORKFLOW_STATES.ITEMS_MANAGER_SCREEN,
  },
  {
    key: 'item_wizard',
    label: 'Додавання предмета',
    state: STAGE2_WORKFLOW_STATES.ITEM_WIZARD_ACTIVE,
  },
  {
    key: 'ready_to_proceed',
    label: 'Готово до переходу',
    state: STAGE2_WORKFLOW_STATES.READY_TO_PROCEED,
  },
  {
    key: 'completed',
    label: 'Завершено',
    state: STAGE2_WORKFLOW_STATES.COMPLETED,
  },
] as const;
