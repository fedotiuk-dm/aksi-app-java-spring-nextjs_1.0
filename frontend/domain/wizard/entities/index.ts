/**
 * Wizard Domain Entities - Public API
 * Консолідований експорт всіх wizard entities згідно SOLID принципів
 *
 * SOLID принципи:
 * - Single Responsibility: кожна entity має окрему відповідальність
 * - Interface Segregation: спеціалізовані entities для конкретних потреб
 * - Open/Closed: легко додавати нові entities
 */

// Спеціалізовані entities
export * from './wizard-state.entity';
export * from './wizard-navigation.entity';
export * from './wizard-item.entity';

// Головна композиційна entity
export * from './wizard.entity';
