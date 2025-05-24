/**
 * Публічне API для Order hooks
 * Експортує всі React хуки для роботи з доменом замовлень
 */

// === ОСНОВНІ ХУКИ ===
export { useOrder } from './use-order.hook';
export { useOrderSearch } from './use-order-search.hook';
export { useOrderParameters } from './use-order-parameters.hook';
export { useOrderConfirmation } from './use-order-confirmation.hook';
export { useOrderCreation } from './use-order-creation.hook';

// Хуки для предметів замовлення
export { useOrderItems, useOrderItem } from './use-order-items.hook';
export { useItemWizard } from './use-item-wizard.hook';
export { useItemBasicInfo } from './use-item-basic-info.hook';
export { useDefectsStains } from './use-defects-stains.hook';
export { useItemProperties } from './use-item-properties.hook';
export { usePhotoDocumentation } from './use-photo-documentation.hook';
export { usePriceCalculator } from './use-price-calculator.hook';

// Експорт типів
export type { ItemWizardData, ItemWizardOperationResult } from './use-item-wizard.hook';
export type {
  OrderConfirmationData,
  OrderConfirmationActions,
} from './use-order-confirmation.hook';
export type { DefectOption, StainOption } from './use-defects-stains.hook';
export type { MaterialOption, FillerOption, WearLevelOption } from './use-item-properties.hook';
export type { PhotoDocumentationConstants, PhotoItem } from './use-photo-documentation.hook';
export type {
  PriceModifier,
  ModifierCategory,
  PriceCalculationData,
} from './use-price-calculator.hook';
