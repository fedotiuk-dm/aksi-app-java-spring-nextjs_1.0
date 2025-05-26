/**
 * @fileoverview Публічне API для wizard хуків
 * @module domain/wizard/hooks
 *
 * Архітектура "DDD inside, FSD outside":
 * - Хуки організовані за етапами Order Wizard
 * - Кожен етап має свої специфічні хуки
 * - Спільні хуки винесені в окрему папку
 * - Композиційні хуки об'єднують функціональність етапів
 */

// === Спільні хуки (навігація, стан, форми) ===
export { useWizardNavigation, useWizardState, useWizardForm } from './shared';

// === ЕТАП 1: Клієнт та базова інформація (ЗАВЕРШЕНО) ===
export { useClientSearch, useClientForm, useClientSelection } from './steps/client-selection';

// === ЕТАП 2: Вибір філії та ініціація замовлення ===
export {
  useBranchLoading,
  useBranchSearch,
  useBranchSelection,
  useBranchSelectionStage,
} from './steps/branch-selection';

// === ЕТАП 3: Менеджер предметів (циклічний процес) ===
// export {
//   useItemManager,
//   useItemWizard,
//   useItemBasicInfo,
//   useItemCharacteristics,
//   useItemDefectsAndStains,
//   useItemPricingCalculator,
//   useItemPhotos,
//   useItemManagementStep
// } from './steps/item-management';

// === ЕТАП 4: Загальні параметри замовлення ===
// export {
//   useOrderExecution,
//   useOrderDiscounts,
//   useOrderPayment,
//   useOrderAdditionalInfo,
//   useOrderParametersStep
// } from './steps/order-parameters';

// === ЕТАП 5: Підтвердження та завершення ===
// export {
//   useOrderReview,
//   useOrderLegalAspects,
//   useReceiptGeneration,
//   useOrderFinalization,
//   useOrderCompletionStep
// } from './steps/order-completion';
