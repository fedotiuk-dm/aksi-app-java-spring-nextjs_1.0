/**
 * @fileoverview Публічне API для хуків Stage 1 - Client and Order
 *
 * Простий підхід: все через Spring State Machine
 */

// === ORDER WIZARD HOOK ===
export { useOrderWizard, type OrderWizardHook } from './use-order-wizard.hook';

// === BRANCH LOCATIONS HOOK ===
export { useBranchLocations, type BranchLocationsHook } from './use-branch-locations.hook';
