/**
 * Wizard Domain Hooks
 * Публічне API для wizard hooks
 *
 * SOLID принципи:
 * - Interface Segregation: спеціалізовані хуки для різних потреб
 * - Single Responsibility: кожен хук має одну відповідальність
 */

// Головний композиційний хук (найчастіше використовується)
export * from './use-wizard.hook';

// Спеціалізовані хуки (для специфічних потреб)
export * from './use-wizard-state.hook';
export * from './use-wizard-navigation.hook';

// Примітка: UI компоненти зазвичай використовують useWizard,
// але можуть використовувати спеціалізовані хуки для оптимізації
