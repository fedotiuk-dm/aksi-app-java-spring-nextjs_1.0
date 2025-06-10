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

// ==================== СТОРІ ====================
export { useWizardNavigationStore } from './store/wizard-navigation.store';

// ==================== ТИПИ ====================
export type { OrderWizardContext } from './hooks/use-order-wizard.hook';
export type { OrderWizardCoordinator } from './hooks/use-order-wizard-coordinator.hook';
export type { Stage1Operations, Stage1OperationsState } from './hooks/use-stage1-operations.hook';
export type {
  WizardNavigationState,
  WizardNavigationActions,
  WizardNavigationStore,
} from './store/wizard-navigation.store';
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
