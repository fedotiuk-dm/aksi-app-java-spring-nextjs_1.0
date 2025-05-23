/**
 * Wizard Domain Stores - Public API
 * Консолідований експорт всіх wizard stores згідно SOLID принципів
 *
 * SOLID принципи:
 * - Single Responsibility: кожен store має окрему відповідальність
 * - Interface Segregation: спеціалізовані stores для конкретних потреб
 * - Open/Closed: легко додавати нові stores
 */

// Спеціалізовані store модулі
export * from './wizard-state.store';
export * from './wizard-navigation.store';
export * from './wizard-item.store';
export * from './wizard-management.store';

// Головний композиційний store
export * from './wizard.store';
