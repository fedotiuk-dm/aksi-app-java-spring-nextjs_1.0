/**
 * @fileoverview Публічне API домену "Основна інформація про замовлення"
 *
 * Експортує тільки головний хук та необхідні типи
 * Приховує внутрішню структуру домену
 */

// Головний композиційний хук
export { useBasicOrderInfo } from './use-basic-order-info.hook';

// Розділені хуки (для продвинутого використання)
export { useBasicOrderInfoAPI } from './use-basic-order-info-api.hook';
export { useBasicOrderInfoBusiness } from './use-basic-order-info-business.hook';
export { useBasicOrderInfoForms } from './use-basic-order-info-forms.hook';

// Zustand стор
export { useBasicOrderInfoStore } from './basic-order-info.store';

// Типи для зовнішнього використання
export type { UseBasicOrderInfoReturn } from './use-basic-order-info.hook';
export type { UseBasicOrderInfoAPIReturn } from './use-basic-order-info-api.hook';
export type { UseBasicOrderInfoBusinessReturn } from './use-basic-order-info-business.hook';
export type { UseBasicOrderInfoFormsReturn } from './use-basic-order-info-forms.hook';

// Схеми та типи форм (для UI компонентів)
export { basicOrderUIFormSchema, branchSelectionUIFormSchema } from './basic-order-info.schemas';

export type {
  BasicOrderUIFormData,
  BranchSelectionUIFormData,
  BranchDisplayData,
} from './basic-order-info.schemas';
