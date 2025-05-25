/**
 * @fileoverview Хуки Order Wizard (DDD архітектура)
 * @module domain/wizard/hooks
 *
 * Централізований експорт всіх хуків wizard з чіткою DDD архітектурою:
 * - Спільні хуки (навігація, стан, форми)
 * - Хуки етапів (client-selection, branch-selection, items-manager, etc.)
 */

// === СПІЛЬНІ ХУКИ ===
export { useWizardState } from './shared/use-wizard-state.hook';
export { useWizardNavigation } from './shared/use-wizard-navigation.hook';
export { useWizardForm } from './shared/use-wizard-form.hook';

// === ХУКИ ЕТАПІВ ===

// Етап 1: Вибір клієнта (ЗАВЕРШЕНО)
export { useClientSearch, useClientForm, useClientSelection } from './steps/client-selection';

// Етап 2: Вибір філії (TODO: КРОК 5)
// export {
//   useBranchSelection,
//   useOrderInitiation,
// } from './steps/branch-selection';

// Етап 3: Менеджер предметів (TODO: КРОК 7)
// export {
//   useItemManager,
//   useItemWizard,
//   usePricingCalculator,
// } from './steps/items-manager';

// Етап 4: Параметри замовлення (TODO: КРОК 8)
// export {
//   useOrderParameters,
//   useExpediteCalculation,
// } from './steps/order-parameters';

// Етап 5: Підтвердження замовлення (TODO: КРОК 8)
// export {
//   useOrderConfirmation,
//   useDigitalSignature,
// } from './steps/order-confirmation';

// === ЕКСПОРТ ТИПІВ ===
export type {
  ClientSearchResult,
  ClientSearchPageResult,
  CreateClientData,
  DuplicateCheckResult,
  ClientCreationResult,
  ClientSelectionResult,
  ClientValidationResult,
} from './steps/client-selection';
