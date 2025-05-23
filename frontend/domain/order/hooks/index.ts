/**
 * Публічне API для Order hooks
 * Експортує всі React хуки для роботи з доменом замовлень
 */

// === ОСНОВНІ ХУКИ ===
export { useOrder } from './use-order.hook';
export { useOrderSearch } from './use-order-search.hook';
export { useOrderParameters } from './use-order-parameters.hook';
export { useOrderConfirmation } from './use-order-confirmation.hook';

// Хуки для предметів замовлення
export { useOrderItems, useOrderItem } from './use-order-items.hook';
export { useItemWizard } from './use-item-wizard.hook';

// Експорт типів
export type { ItemWizardData, ItemWizardOperationResult } from './use-item-wizard.hook';
export type {
  OrderConfirmationData,
  OrderConfirmationActions,
} from './use-order-confirmation.hook';
