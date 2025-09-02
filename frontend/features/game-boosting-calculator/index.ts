// 🎮 Game Boosting Calculator Feature
// Clean architecture implementation following order-wizard pattern

// Main Component
export { GameBoostingCalculator } from './GameBoostingCalculator';

// Store - all stores in one place
export * from './store';

// Alternative: individual exports
// export { useGameBoostingStore } from './store/game-boosting-store';
// export { useGameManagementStore } from './store/game-management-store';
// export { useBoosterManagementStore } from './store/booster-management-store';
// export { useDifficultyLevelManagementStore } from './store/difficulty-level-management-store';
// export { useServiceTypeManagementStore } from './store/service-type-management-store';
// export { usePriceConfigurationManagementStore } from './store/price-configuration-management-store';
// export { useModifiersManagementStore } from './store/modifiers-management-store';

// Hooks - all hooks in one place
export * from './hooks';

// Alternative: individual exports
// export { useGameOperations } from './hooks/useGameOperations';
// export { useBoosterOperations } from './hooks/useBoosterOperations';
// export { useCalculatorOperations } from './hooks/useCalculatorOperations';

// Components
export { GameSection } from './components/games/GameSection';
export { GameSearch } from './components/games/GameSearch';

export { BoosterSection } from './components/boosters/BoosterSection';
export { BoosterSelector } from './components/boosters/BoosterSelector';

export { CalculatorSection } from './components/calculator/CalculatorSection';

export { SummarySection } from './components/summary/SummarySection';

// Admin Components
export { GameBoostingAdmin } from './components/admin/GameBoostingAdmin';
export { GameManagement } from './components/admin/games/GameManagement';
export { BoosterManagement } from './components/admin/boosters/BoosterManagement';
export { ModifiersManagement } from './components/admin/modifiers/ModifiersManagement';

// Admin Components
export { DifficultyLevelManagement } from './components/admin/difficulty-levels/DifficultyLevelManagement';
export { ServiceTypeManagement } from './components/admin/service-types/ServiceTypeManagement';
export { PriceConfigurationManagement } from './components/admin/price-configurations/PriceConfigurationManagement';

// Admin Modals
export { GameCreateModal } from './components/admin/modals/GameCreateModal';
export { GameEditModal } from './components/admin/modals/GameEditModal';
export { GameDeleteModal } from './components/admin/modals/GameDeleteModal';
export { BoosterCreateModal } from './components/admin/modals/BoosterCreateModal';
export { BoosterEditModal } from './components/admin/modals/BoosterEditModal';
export { BoosterDeleteModal } from './components/admin/modals/BoosterDeleteModal';
export { DifficultyLevelCreateModal } from './components/admin/modals/DifficultyLevelCreateModal';
export { DifficultyLevelEditModal } from './components/admin/modals/DifficultyLevelEditModal';
export { DifficultyLevelDeleteModal } from './components/admin/modals/DifficultyLevelDeleteModal';
export { ServiceTypeCreateModal } from './components/admin/modals/ServiceTypeCreateModal';
export { ServiceTypeEditModal } from './components/admin/modals/ServiceTypeEditModal';
export { ServiceTypeDeleteModal } from './components/admin/modals/ServiceTypeDeleteModal';
export { PriceConfigurationCreateModal } from './components/admin/modals/PriceConfigurationCreateModal';
export { PriceConfigurationEditModal } from './components/admin/modals/PriceConfigurationEditModal';
export { PriceConfigurationDeleteModal } from './components/admin/modals/PriceConfigurationDeleteModal';
export { ModifierCreateModal } from './components/admin/modals/ModifierCreateModal';
export { ModifierEditModal } from './components/admin/modals/ModifierEditModal';
export { ModifierDeleteModal } from './components/admin/modals/ModifierDeleteModal';

// Barrel exports for convenience
// export * from './components'; // All components
// export * from './store';       // All stores
// export * from './hooks';       // All hooks
