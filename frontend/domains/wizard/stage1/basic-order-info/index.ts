// Публічне API для Stage1 Basic Order Info домену
// Експортуємо тільки головний хук та необхідні типи

// Головний хук
export { useBasicOrderInfo } from './use-basic-order-info.hook';
export type { UseBasicOrderInfoReturn } from './use-basic-order-info.hook';

// Схеми тільки якщо потрібні в UI компонентах
export { branchSelectionFormSchema, uniqueTagFormSchema, orderSettingsFormSchema } from './schemas';

export type { BranchSelectionFormData, UniqueTagFormData, OrderSettingsFormData } from './schemas';

// Селектори для зручності
export { useCanProceed, useBasicOrderData } from './basic-order-info.store';
