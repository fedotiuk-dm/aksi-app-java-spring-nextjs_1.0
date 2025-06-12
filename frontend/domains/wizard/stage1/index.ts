/**
 * @fileoverview Публічне API для Stage1 домену Order Wizard
 *
 * Архітектурний принцип: "DDD inside, FSD outside"
 * Експортує тільки головні хуки та необхідні типи для UI компонентів
 * Приховує внутрішню структуру та деталі реалізації
 *
 * Stage1 включає:
 * - Пошук/створення клієнта
 * - Основну інформацію про замовлення
 * - Вибір філії
 * - Управління workflow
 */

// ===== ГОЛОВНІ КОМПОЗИЦІЙНІ ХУКИ =====

// Пошук клієнта
export { useClientSearch } from './client-search';
export type { UseClientSearchReturn } from './client-search';

// Створення клієнта
export { useClientCreation } from './client-creation';
export type { UseClientCreationReturn } from './client-creation';

// Основна інформація про замовлення
export { useBasicOrderInfo } from './basic-order-info';
export type { UseBasicOrderInfoReturn } from './basic-order-info';

// Workflow управління Stage1
export { useStage1Workflow } from './workflow';
export type { UseStage1WorkflowReturn } from './workflow';

// Інтегровані хуки
export { useStage1Simple } from './use-stage1-simple.hook';
export type { UseStage1SimpleReturn } from './use-stage1-simple.hook';

// ===== СХЕМИ ДЛЯ ВАЛІДАЦІЇ (для UI компонентів) =====

// Client Search схеми
export { searchFormSchema, phoneFormSchema } from './client-search';
export type { SearchFormData, PhoneFormData } from './client-search';

// Client Creation схеми
export { clientCreationUIFormSchema } from './client-creation';
export type { ClientCreationUIFormData } from './client-creation';

// Basic Order Info схеми
export { basicOrderUIFormSchema, branchSelectionUIFormSchema } from './basic-order-info';
export type {
  BasicOrderUIFormData,
  BranchSelectionUIFormData,
  BranchDisplayData,
} from './basic-order-info';

// ===== РОЗДІЛЕНІ ХУКИ (для продвинутого використання) =====

// Basic Order Info - розділені хуки
export {
  useBasicOrderInfoAPI,
  useBasicOrderInfoBusiness,
  useBasicOrderInfoForms,
} from './basic-order-info';
export type {
  UseBasicOrderInfoAPIReturn,
  UseBasicOrderInfoBusinessReturn,
  UseBasicOrderInfoFormsReturn,
} from './basic-order-info';

// Client Creation - розділені хуки
export {
  useClientCreationAPI,
  useClientCreationBusiness,
  useClientCreationForms,
  useClientCreationNavigation,
} from './client-creation';
export type {
  UseClientCreationAPIReturn,
  UseClientCreationBusinessReturn,
  UseClientCreationFormsReturn,
  UseClientCreationNavigationReturn,
} from './client-creation';

// ===== ZUSTAND СТОРИ (рідко потрібні напряму) =====

// Експортуємо тільки якщо дійсно потрібно в UI
export { useClientSearchStore } from './client-search';
export { useClientCreationStore } from './client-creation';
export { useBasicOrderInfoStore } from './basic-order-info';

// ===== ТИПИ ДОМЕНІВ =====

export type DomainClient = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: string;
  isActive: boolean;
};

export type DomainSearchCriteria = {
  searchTerm: string;
  searchBy: 'all' | 'phone' | 'name' | 'email';
  isActive?: boolean;
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
};
