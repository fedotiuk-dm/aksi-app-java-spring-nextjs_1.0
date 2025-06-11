/**
 * @fileoverview Публічне API домену Order Wizard
 *
 * Єдина точка експорту для всієї функціональності Order Wizard домену.
 * Дотримується принципу "DDD inside, FSD outside".
 */

// ==================== ОСНОВНІ ХУКИ ====================
export { useOrderWizard } from './hooks/use-order-wizard.hook';
export { useOrderWizardCoordinator } from './hooks/use-order-wizard-coordinator.hook';
export { useStage1Operations } from './hooks/use-stage1-operations.hook';
export { useErrorHandling } from './hooks/use-error-handling.hook';

// ==================== STAGE 2 ХУКИ ====================
export { useStage2Manager } from './hooks/use-stage2-manager.hook';
export { useItemWizard } from './hooks/use-item-wizard.hook';
export { useStage2ItemWizard } from './hooks/use-stage2-item-wizard.hook';

// ==================== СТОРІ ====================
export { useWizardNavigationStore } from './store/wizard-navigation.store';
export type {
  WizardNavigationState,
  WizardNavigationActions,
} from './store/wizard-navigation.store';

// ==================== STAGE 2 СТОРІ ====================
export { useStage2Store } from './store/stage2.store';

// ==================== ТИПИ ====================
export type { OrderWizardContext } from './hooks/use-order-wizard.hook';
export type { OrderWizardCoordinator } from './hooks/use-order-wizard-coordinator.hook';
export type { Stage1Operations, Stage1OperationsState } from './hooks/use-stage1-operations.hook';

// ==================== STAGE 2 ТИПИ ====================
export type {
  Stage2Store,
  Stage2State,
  WizardMode,
  UseStage2ManagerReturn,
  UseItemWizardReturn,
  ItemSummary,
  ManagerStatistics,
  ItemsFilter,
  ItemsSorting,
  SortField,
  SortDirection,
} from './types/stage2.types';

export type {
  ItemWizardData,
  ItemCharacteristicsData,
  StainsAndDefectsData,
  PriceCalculatorData,
  PhotoDocumentationData,
  ItemWizardSubstep,
  ItemWizardErrors,
  Stage2ItemWizardOperations,
} from './hooks/use-stage2-item-wizard.hook';
export type { WizardNavigationStore } from './store/wizard-navigation.store';
export type {
  WizardError,
  ErrorHandling,
  ErrorHandlingState,
  ErrorHandlingActions,
} from './hooks/use-error-handling.hook';

// ==================== ВАЛІДАЦІЯ ====================
export {
  // Схеми
  clientSearchSchema,
  newClientSchema,
  basicOrderInfoSchema,
  stage1Schema,
  orderItemSchema,
  stage2Schema,
  orderParametersSchema,
  stage3Schema,
  orderFinalizationSchema,
  stage4Schema,
  completeOrderSchema,

  // Утиліти
  validateData,
  getFieldError,
  hasFieldError,
} from './utils/validation.util';

export type {
  ValidationResult,
  ClientSearchData,
  NewClientData,
  BasicOrderInfoData,
  Stage1Data,
  OrderItemData,
  Stage2Data,
  OrderParametersData,
  Stage3Data,
  OrderFinalizationData,
  Stage4Data,
  CompleteOrderData,
} from './utils/validation.util';

// ==================== КОНСТАНТИ ====================
export const WIZARD_STAGES = {
  CLIENT_SELECTION: 1,
  ITEMS_MANAGEMENT: 2,
  ORDER_PARAMETERS: 3,
  FINALIZATION: 4,
} as const;

export const WIZARD_STAGE_NAMES = {
  [WIZARD_STAGES.CLIENT_SELECTION]: 'Клієнт та базова інформація',
  [WIZARD_STAGES.ITEMS_MANAGEMENT]: 'Менеджер предметів',
  [WIZARD_STAGES.ORDER_PARAMETERS]: 'Загальні параметри замовлення',
  [WIZARD_STAGES.FINALIZATION]: 'Підтвердження та завершення',
} as const;

export type WizardStage = (typeof WIZARD_STAGES)[keyof typeof WIZARD_STAGES];

// ==================== STAGE 2 УТИЛІТИ ====================
export {
  transformToItemSummary,
  transformItemsToSummaries,
  calculateManagerStatistics,
  filterItems,
  sortItems,
  validateItemForAdd,
  canDeleteItem,
  formatPrice,
  formatQuantity,
  getItemShortDescription,
  getUniqueCategories,
  getPriceRange,
} from './utils/item-utils';
