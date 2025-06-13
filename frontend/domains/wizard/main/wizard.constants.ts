// Константи для Main Wizard - Координація етапів Order Wizard
// Використовуємо стани з Spring State Machine через Orval

import { OrderWizardResponseDTOCurrentState } from '@/shared/api/generated/main';

// =================== СТАНИ WIZARD (З ORVAL) ===================
export const MAIN_WIZARD_STATES = OrderWizardResponseDTOCurrentState;

export type MainWizardState = keyof typeof MAIN_WIZARD_STATES;

// =================== ПОДІЇ ПЕРЕХОДІВ ===================
export const MAIN_WIZARD_EVENTS = {
  // Початок wizard
  START_WIZARD: 'START_WIZARD',

  // Переходи між етапами
  COMPLETE_STAGE1: 'COMPLETE_STAGE1',
  COMPLETE_STAGE2: 'COMPLETE_STAGE2',
  COMPLETE_STAGE3: 'COMPLETE_STAGE3',
  COMPLETE_ORDER: 'COMPLETE_ORDER',

  // Навігація назад
  GO_BACK: 'GO_BACK',

  // Скасування та помилки
  CANCEL_ORDER: 'CANCEL_ORDER',
  HANDLE_ERROR: 'HANDLE_ERROR',

  // Очищення сесій
  CLEAR_ALL_SESSIONS: 'CLEAR_ALL_SESSIONS',
} as const;

export type MainWizardEvent = (typeof MAIN_WIZARD_EVENTS)[keyof typeof MAIN_WIZARD_EVENTS];

// =================== ПЕРЕХОДИ (АДАПТОВАНІ ПІД ORVAL СТАНИ) ===================
export const MAIN_WIZARD_TRANSITIONS = {
  // Початковий стан
  [MAIN_WIZARD_STATES.INITIAL]: {
    [MAIN_WIZARD_EVENTS.START_WIZARD]: MAIN_WIZARD_STATES.CLIENT_SELECTION,
  },

  // Вибір клієнта
  [MAIN_WIZARD_STATES.CLIENT_SELECTION]: {
    [MAIN_WIZARD_EVENTS.COMPLETE_STAGE1]: MAIN_WIZARD_STATES.ORDER_INITIALIZATION,
    [MAIN_WIZARD_EVENTS.CANCEL_ORDER]: MAIN_WIZARD_STATES.CANCELLED,
  },

  // Ініціалізація замовлення
  [MAIN_WIZARD_STATES.ORDER_INITIALIZATION]: {
    [MAIN_WIZARD_EVENTS.COMPLETE_STAGE1]: MAIN_WIZARD_STATES.ITEM_MANAGEMENT,
    [MAIN_WIZARD_EVENTS.GO_BACK]: MAIN_WIZARD_STATES.CLIENT_SELECTION,
  },

  // Менеджер предметів
  [MAIN_WIZARD_STATES.ITEM_MANAGEMENT]: {
    [MAIN_WIZARD_EVENTS.COMPLETE_STAGE2]: MAIN_WIZARD_STATES.EXECUTION_PARAMS,
    [MAIN_WIZARD_EVENTS.GO_BACK]: MAIN_WIZARD_STATES.ORDER_INITIALIZATION,
    [MAIN_WIZARD_EVENTS.CANCEL_ORDER]: MAIN_WIZARD_STATES.CANCELLED,
  },

  // Активний візард предмета
  [MAIN_WIZARD_STATES.ITEM_WIZARD_ACTIVE]: {
    [MAIN_WIZARD_EVENTS.COMPLETE_STAGE2]: MAIN_WIZARD_STATES.ITEM_MANAGEMENT,
    [MAIN_WIZARD_EVENTS.CANCEL_ORDER]: MAIN_WIZARD_STATES.ITEM_MANAGEMENT,
  },

  // Параметри виконання
  [MAIN_WIZARD_STATES.EXECUTION_PARAMS]: {
    [MAIN_WIZARD_EVENTS.COMPLETE_STAGE3]: MAIN_WIZARD_STATES.GLOBAL_DISCOUNTS,
    [MAIN_WIZARD_EVENTS.GO_BACK]: MAIN_WIZARD_STATES.ITEM_MANAGEMENT,
  },

  // Глобальні знижки
  [MAIN_WIZARD_STATES.GLOBAL_DISCOUNTS]: {
    [MAIN_WIZARD_EVENTS.COMPLETE_STAGE3]: MAIN_WIZARD_STATES.PAYMENT_PROCESSING,
    [MAIN_WIZARD_EVENTS.GO_BACK]: MAIN_WIZARD_STATES.EXECUTION_PARAMS,
  },

  // Обробка платежів
  [MAIN_WIZARD_STATES.PAYMENT_PROCESSING]: {
    [MAIN_WIZARD_EVENTS.COMPLETE_STAGE3]: MAIN_WIZARD_STATES.ADDITIONAL_INFO,
    [MAIN_WIZARD_EVENTS.GO_BACK]: MAIN_WIZARD_STATES.GLOBAL_DISCOUNTS,
  },

  // Додаткова інформація
  [MAIN_WIZARD_STATES.ADDITIONAL_INFO]: {
    [MAIN_WIZARD_EVENTS.COMPLETE_STAGE3]: MAIN_WIZARD_STATES.ORDER_CONFIRMATION,
    [MAIN_WIZARD_EVENTS.GO_BACK]: MAIN_WIZARD_STATES.PAYMENT_PROCESSING,
  },

  // Підтвердження замовлення
  [MAIN_WIZARD_STATES.ORDER_CONFIRMATION]: {
    [MAIN_WIZARD_EVENTS.COMPLETE_ORDER]: MAIN_WIZARD_STATES.ORDER_REVIEW,
    [MAIN_WIZARD_EVENTS.GO_BACK]: MAIN_WIZARD_STATES.ADDITIONAL_INFO,
  },

  // Перегляд замовлення
  [MAIN_WIZARD_STATES.ORDER_REVIEW]: {
    [MAIN_WIZARD_EVENTS.COMPLETE_ORDER]: MAIN_WIZARD_STATES.LEGAL_ASPECTS,
    [MAIN_WIZARD_EVENTS.GO_BACK]: MAIN_WIZARD_STATES.ORDER_CONFIRMATION,
  },

  // Юридичні аспекти
  [MAIN_WIZARD_STATES.LEGAL_ASPECTS]: {
    [MAIN_WIZARD_EVENTS.COMPLETE_ORDER]: MAIN_WIZARD_STATES.RECEIPT_GENERATION,
    [MAIN_WIZARD_EVENTS.GO_BACK]: MAIN_WIZARD_STATES.ORDER_REVIEW,
  },

  // Генерація квитанції
  [MAIN_WIZARD_STATES.RECEIPT_GENERATION]: {
    [MAIN_WIZARD_EVENTS.COMPLETE_ORDER]: MAIN_WIZARD_STATES.COMPLETED,
  },

  // Завершено
  [MAIN_WIZARD_STATES.COMPLETED]: {
    [MAIN_WIZARD_EVENTS.START_WIZARD]: MAIN_WIZARD_STATES.INITIAL,
    [MAIN_WIZARD_EVENTS.CLEAR_ALL_SESSIONS]: MAIN_WIZARD_STATES.INITIAL,
  },

  // Скасовано
  [MAIN_WIZARD_STATES.CANCELLED]: {
    [MAIN_WIZARD_EVENTS.START_WIZARD]: MAIN_WIZARD_STATES.INITIAL,
    [MAIN_WIZARD_EVENTS.CLEAR_ALL_SESSIONS]: MAIN_WIZARD_STATES.INITIAL,
  },
} as const;

// =================== ВАЛІДАЦІЯ ПЕРЕХОДІВ ===================
export const MAIN_WIZARD_VALIDATION_RULES = {
  [MAIN_WIZARD_STATES.INITIAL]: {
    requiredFields: [],
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.CLIENT_SELECTION]: {
    requiredFields: ['clientId'],
    canCompleteStage: (data: { clientId?: string }) => {
      return !!data?.clientId;
    },
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.ORDER_INITIALIZATION]: {
    requiredFields: ['orderId', 'branchId'],
    canCompleteStage: (data: { orderId?: string; branchId?: string }) => {
      return !!(data?.orderId && data?.branchId);
    },
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.ITEM_MANAGEMENT]: {
    requiredFields: ['items'],
    canCompleteStage: (data: { items?: unknown[] }) => {
      return !!(data?.items && data?.items.length > 0);
    },
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.ITEM_WIZARD_ACTIVE]: {
    requiredFields: [], // Валідація відбувається в підетапах
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.EXECUTION_PARAMS]: {
    requiredFields: ['executionDate'],
    canCompleteStage: (data: { executionDate?: string }) => {
      return !!data?.executionDate;
    },
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.GLOBAL_DISCOUNTS]: {
    requiredFields: [],
    canCompleteStage: () => true, // Знижки опціональні
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.PAYMENT_PROCESSING]: {
    requiredFields: ['paymentMethod'],
    canCompleteStage: (data: { paymentMethod?: string }) => {
      return !!data?.paymentMethod;
    },
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.ADDITIONAL_INFO]: {
    requiredFields: [],
    canCompleteStage: () => true, // Додаткова інформація опціональна
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.ORDER_CONFIRMATION]: {
    requiredFields: ['confirmed'],
    canCompleteOrder: (data: { confirmed?: boolean }) => {
      return !!data?.confirmed;
    },
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.ORDER_REVIEW]: {
    requiredFields: ['reviewed'],
    canCompleteOrder: (data: { reviewed?: boolean }) => {
      return !!data?.reviewed;
    },
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.LEGAL_ASPECTS]: {
    requiredFields: ['termsAccepted', 'signature'],
    canCompleteOrder: (data: { termsAccepted?: boolean; signature?: string }) => {
      return !!(data?.termsAccepted && data?.signature);
    },
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.RECEIPT_GENERATION]: {
    requiredFields: [],
    canCompleteOrder: () => true,
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.COMPLETED]: {
    requiredFields: [],
    canProceed: () => true,
  },

  [MAIN_WIZARD_STATES.CANCELLED]: {
    requiredFields: [],
    canProceed: () => true,
  },
} as const;

// =================== ПРОГРЕС WIZARD ===================
export const MAIN_WIZARD_PROGRESS_STEPS = [
  {
    key: 'initial',
    label: 'Початок',
    state: MAIN_WIZARD_STATES.INITIAL,
    stageNumber: 0,
  },
  {
    key: 'client_selection',
    label: 'Вибір клієнта',
    state: MAIN_WIZARD_STATES.CLIENT_SELECTION,
    stageNumber: 1,
  },
  {
    key: 'order_initialization',
    label: 'Ініціалізація замовлення',
    state: MAIN_WIZARD_STATES.ORDER_INITIALIZATION,
    stageNumber: 1,
  },
  {
    key: 'item_management',
    label: 'Менеджер предметів',
    state: MAIN_WIZARD_STATES.ITEM_MANAGEMENT,
    stageNumber: 2,
  },
  {
    key: 'execution_params',
    label: 'Параметри виконання',
    state: MAIN_WIZARD_STATES.EXECUTION_PARAMS,
    stageNumber: 3,
  },
  {
    key: 'global_discounts',
    label: 'Знижки',
    state: MAIN_WIZARD_STATES.GLOBAL_DISCOUNTS,
    stageNumber: 3,
  },
  {
    key: 'payment_processing',
    label: 'Оплата',
    state: MAIN_WIZARD_STATES.PAYMENT_PROCESSING,
    stageNumber: 3,
  },
  {
    key: 'additional_info',
    label: 'Додаткова інформація',
    state: MAIN_WIZARD_STATES.ADDITIONAL_INFO,
    stageNumber: 3,
  },
  {
    key: 'order_confirmation',
    label: 'Підтвердження замовлення',
    state: MAIN_WIZARD_STATES.ORDER_CONFIRMATION,
    stageNumber: 4,
  },
  {
    key: 'order_review',
    label: 'Перегляд замовлення',
    state: MAIN_WIZARD_STATES.ORDER_REVIEW,
    stageNumber: 4,
  },
  {
    key: 'legal_aspects',
    label: 'Юридичні аспекти',
    state: MAIN_WIZARD_STATES.LEGAL_ASPECTS,
    stageNumber: 4,
  },
  {
    key: 'receipt_generation',
    label: 'Генерація квитанції',
    state: MAIN_WIZARD_STATES.RECEIPT_GENERATION,
    stageNumber: 4,
  },
  {
    key: 'completed',
    label: 'Завершено',
    state: MAIN_WIZARD_STATES.COMPLETED,
    stageNumber: 5,
  },
] as const;
