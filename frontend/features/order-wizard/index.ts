/**
 * Головний експортний файл фічі OrderWizard
 * Використовується для експорту компонентів, хуків та типів
 */

// Головний компонент візарда
export { OrderWizard } from './OrderWizard';

// Хуки для роботи зі станом візарда
export { useOrderWizardMachine } from './hooks/state/useOrderWizardMachine';

// Типи даних для використання в інших модулях
export * from './model/types/wizard.types';

// API хуки для взаємодії з бекендом
export * from './api/hooks/useClients';
export * from './api/hooks/useOrders';
export * from './api/hooks/useOrderItems';
