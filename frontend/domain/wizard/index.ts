/**
 * Wizard Domain - Public API
 * Консолідований експорт для wizard domain згідно SOLID принципів
 *
 * SOLID principi:
 * - Single Responsibility: чіткий розподіл функціональності
 * - Interface Segregation: спеціалізовані інтерфейси
 * - Open/Closed: легко розширюється
 * - Dependency Inversion: залежність від абстракцій
 */

// Core Types та Enum Values - для типів та значень
export { WizardStep, WizardMode, WizardStatus } from './types';
export type { WizardContext, NavigationResult, StepValidationResult } from './types';

// Entities - доменні сутності
export { WizardEntity } from './entities';

// Stores - композиційні сторі
export { useWizardStore } from './store';

// Hooks - публічні хуки для UI компонентів
export { useWizard, useWizardState, useWizardNavigation } from './hooks';

// Services - доменні сервіси (за потребою)
export { WizardNavigationService } from './services/wizard-navigation.service';
