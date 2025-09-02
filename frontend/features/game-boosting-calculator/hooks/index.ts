// Hooks barrel exports for Game Boosting Calculator
// Clean architecture - all hooks in one place

// Main calculator hooks
export { useGameOperations } from './useGameOperations';
export { useBoosterOperations } from './useBoosterOperations';
export { useCalculatorOperations } from './useCalculatorOperations';

// Admin management hooks
export { useGameManagement } from '../components/admin/games/useGameManagement.hook';
export { useBoosterManagement } from '../components/admin/boosters/useBoosterManagement.hook';
export { useDifficultyLevelManagement } from '../components/admin/difficulty-levels/useDifficultyLevelManagement.hook';
export { useServiceTypeManagement } from '../components/admin/service-types/useServiceTypeManagement.hook';
export { usePriceConfigurationManagement } from '../components/admin/price-configurations/usePriceConfigurationManagement.hook';
export { useModifiersManagement } from '../components/admin/modifiers/useModifiersManagement.hook';
