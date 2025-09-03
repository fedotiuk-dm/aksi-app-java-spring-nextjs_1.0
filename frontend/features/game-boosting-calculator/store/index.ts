// Store barrel exports for Game Boosting Calculator
// Clean architecture - all stores in one place

// Main calculator store
export { useGameBoostingStore } from './game-boosting-store';

// Admin management stores
export { useGameManagementStore } from './game-management-store';
export { useBoosterManagementStore } from './booster-management-store';
export { useDifficultyLevelManagementStore } from './difficulty-level-management-store';
export { useServiceTypeManagementStore } from './service-type-management-store';
export { usePriceConfigurationManagementStore } from './price-configuration-management-store';
export { useGameModifiersManagementStore } from './modifiers-management-store';

// Type exports for convenience
export type { GameBoostingStore } from './game-boosting-store';
export type { GameManagementStore } from './game-management-store';
export type { BoosterManagementStore } from './booster-management-store';
export type { DifficultyLevelManagementStore } from './difficulty-level-management-store';
export type { ServiceTypeManagementStore } from './service-type-management-store';
export type { PriceConfigurationManagementStore } from './price-configuration-management-store';
export type { GameModifiersManagementStore } from './modifiers-management-store';
