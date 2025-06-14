// Stage2 Item Manager константи з Orval схем
// Використовуємо готові типи з бекенду для управління предметами замовлення

// =================== ORVAL КОНСТАНТИ ===================
// Імпортуємо готові константи з Orval
export { Stage2GetCurrentState200 } from '@/shared/api/generated/stage2';

// Реекспорт типів з читабельними назвами
export type {
  Stage2GetCurrentState200 as ItemManagerApiState,
  ItemManagerDTO,
  OrderItemDTO,
} from '@/shared/api/generated/stage2';

// =================== UI КОНСТАНТИ ===================
// UI операції для управління предметами
export const ITEM_MANAGER_OPERATIONS = {
  INITIALIZE: 'initialize',
  ADD_ITEM: 'add-item',
  EDIT_ITEM: 'edit-item',
  DELETE_ITEM: 'delete-item',
  SYNCHRONIZE: 'synchronize',
  COMPLETE_STAGE: 'complete-stage',
  RESET_SESSION: 'reset-session',
  TERMINATE_SESSION: 'terminate-session',
} as const;

export type ItemManagerOperation =
  (typeof ITEM_MANAGER_OPERATIONS)[keyof typeof ITEM_MANAGER_OPERATIONS];

// Порядок операцій
export const ITEM_MANAGER_OPERATION_ORDER: ItemManagerOperation[] = [
  ITEM_MANAGER_OPERATIONS.INITIALIZE,
  ITEM_MANAGER_OPERATIONS.ADD_ITEM,
  ITEM_MANAGER_OPERATIONS.EDIT_ITEM,
  ITEM_MANAGER_OPERATIONS.DELETE_ITEM,
  ITEM_MANAGER_OPERATIONS.SYNCHRONIZE,
  ITEM_MANAGER_OPERATIONS.COMPLETE_STAGE,
];

// UI стани для менеджера предметів
export const ITEM_MANAGER_UI_STATES = {
  INITIALIZING: 'initializing',
  READY: 'ready',
  LOADING: 'loading',
  SAVING: 'saving',
  ERROR: 'error',
} as const;

export type ItemManagerUIState =
  (typeof ITEM_MANAGER_UI_STATES)[keyof typeof ITEM_MANAGER_UI_STATES];

// Режими перегляду таблиці
export const VIEW_MODES = {
  TABLE: 'table',
  CARDS: 'cards',
  COMPACT: 'compact',
} as const;

export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];

// =================== ВАЛІДАЦІЯ ===================
// Правила валідації для операцій
export const ITEM_MANAGER_VALIDATION_RULES = {
  canAddItem: (sessionId: string | null) => sessionId !== null,
  canEditItem: (itemId: string | null, sessionId: string | null) =>
    itemId !== null && sessionId !== null,
  canDeleteItem: (itemId: string | null, sessionId: string | null) =>
    itemId !== null && sessionId !== null,
  canCompleteStage: (itemsCount: number) => itemsCount > 0,
  canSynchronize: (sessionId: string | null) => sessionId !== null,
} as const;

// =================== НАВІГАЦІЯ ===================
// Утиліти для навігації між операціями
export const getNextItemManagerOperation = (
  currentOperation: ItemManagerOperation
): ItemManagerOperation | null => {
  const currentIndex = ITEM_MANAGER_OPERATION_ORDER.indexOf(currentOperation);
  return currentIndex < ITEM_MANAGER_OPERATION_ORDER.length - 1
    ? ITEM_MANAGER_OPERATION_ORDER[currentIndex + 1]
    : null;
};

export const getPreviousItemManagerOperation = (
  currentOperation: ItemManagerOperation
): ItemManagerOperation | null => {
  const currentIndex = ITEM_MANAGER_OPERATION_ORDER.indexOf(currentOperation);
  return currentIndex > 0 ? ITEM_MANAGER_OPERATION_ORDER[currentIndex - 1] : null;
};

// Розрахунок прогресу операцій
export const calculateItemManagerProgress = (currentOperation: ItemManagerOperation): number => {
  const currentIndex = ITEM_MANAGER_OPERATION_ORDER.indexOf(currentOperation);
  return Math.round(((currentIndex + 1) / ITEM_MANAGER_OPERATION_ORDER.length) * 100);
};

// =================== КОНФІГУРАЦІЯ ТАБЛИЦІ ===================
// Налаштування таблиці предметів
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  DEFAULT_SORT_BY: 'name',
  SORT_OPTIONS: ['name', 'category', 'quantity', 'totalPrice', 'createdAt'],
  MAX_ITEMS_PER_ORDER: 100,
} as const;

// =================== ЛІМІТИ ===================
// Мінімальні значення для валідації (з Orval схем)
export const ITEM_MANAGER_LIMITS = {
  MIN_ITEMS_COUNT: 1,
  MAX_ITEMS_COUNT: TABLE_CONFIG.MAX_ITEMS_PER_ORDER,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
  // З Orval схем stage2InitializeItemManager200Response
  MAX_ITEM_NAME_LENGTH: 255,
  MAX_ITEM_DESCRIPTION_LENGTH: 1000,
  MAX_SPECIAL_INSTRUCTIONS_LENGTH: 500,
  MAX_DEFECTS_NOTES_LENGTH: 1000,
} as const;
