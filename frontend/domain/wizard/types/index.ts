/**
 * Wizard Domain Types - Public API
 * Консолідований експорт всіх wizard типів згідно SOLID принципів
 *
 * SOLID принципи:
 * - Single Responsibility: кожен файл має окрему відповідальність
 * - Interface Segregation: спеціалізовані типи для конкретних потреб
 * - Open/Closed: легко додавати нові категорії типів
 */

// Типи кроків та навігації
export * from './wizard-steps.types';

// Типи стану та режимів
export * from './wizard-state.types';

// Типи валідації
export * from './wizard-validation.types';

// Типи подій
export * from './wizard-events.types';

// Типи persistence
export * from './wizard-persistence.types';
