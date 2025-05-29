/**
 * @fileoverview Order Wizard Feature - FSD UI компоненти
 * @module features/order-wizard
 * @author AKSI Team
 * @since 1.0.0
 *
 * Експорт "тонких" UI компонентів згідно архітектури "DDD inside, FSD outside"
 */

// === ГОЛОВНИЙ WIZARD КОМПОНЕНТ ===
export { OrderWizardContainer } from './ui/OrderWizardContainer';

// === ЕТАП 1: КЛІЄНТ ТА ЗАМОВЛЕННЯ ===
export { ClientSelectionStep } from './ui/stage-1/ClientSelectionStep';
export { BranchSelectionStep } from './ui/stage-1/BranchSelectionStep';

// === СПІЛЬНІ UI КОМПОНЕНТИ ===
export { WizardNavigation } from './ui/shared/WizardNavigation';
export { WizardProgress } from './ui/shared/WizardProgress';
