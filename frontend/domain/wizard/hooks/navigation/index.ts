/**
 * @fileoverview Навігаційні хуки wizard домену
 * @module domain/wizard/hooks/navigation
 */

// === ОСНОВНІ НАВІГАЦІЙНІ ХУКИ ===
export { useWizardNavigation } from './use-wizard-navigation.hook';
export { useWizardProgress } from './use-wizard-progress.hook';

// === ТИПИ ===
export type { NavigationResult } from '../../machines';
