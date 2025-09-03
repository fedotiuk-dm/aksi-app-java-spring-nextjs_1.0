// Components barrel exports for Game Boosting Calculator
// Clean architecture - all components in one place

// Main sections
export { GameSection } from './games/GameSection';
export { GameSearch } from './games/GameSearch';
//export { GameSelector } from './games/GameSelector';

export { BoosterSection } from './boosters/BoosterSection';
export { BoosterSelector } from './boosters/BoosterSelector';
//export { BoosterTable } from './boosters/BoosterTable';

export { CalculatorSection } from './calculator/CalculatorSection';
export { ModifiersPanel } from './calculator/ModifiersPanel/ModifiersPanel';
//export { PricingCalculator } from './calculator/PricingCalculator';

export { SummarySection } from './summary/SummarySection';

// Admin components
export { GameBoostingAdmin } from './admin/GameBoostingAdmin';

export { GameManagement } from './admin/games/GameManagement';
export { BoosterManagement } from './admin/boosters/BoosterManagement';
export { DifficultyLevelManagement } from './admin/difficulty-levels/DifficultyLevelManagement';
export { ServiceTypeManagement } from './admin/service-types/ServiceTypeManagement';
export { PriceConfigurationManagement } from './admin/price-configurations/PriceConfigurationManagement';
export { ModifiersManagement } from './admin/modifiers/ModifiersManagement';

// Admin modals
export { GameCreateModal } from './admin/modals/GameCreateModal';
export { GameEditModal } from './admin/modals/GameEditModal';
export { GameDeleteModal } from './admin/modals/GameDeleteModal';

export { BoosterCreateModal } from './admin/modals/BoosterCreateModal';
export { BoosterEditModal } from './admin/modals/BoosterEditModal';
export { BoosterDeleteModal } from './admin/modals/BoosterDeleteModal';

export { DifficultyLevelCreateModal } from './admin/modals/DifficultyLevelCreateModal';
export { DifficultyLevelEditModal } from './admin/modals/DifficultyLevelEditModal';
export { DifficultyLevelDeleteModal } from './admin/modals/DifficultyLevelDeleteModal';

export { ServiceTypeCreateModal } from './admin/modals/ServiceTypeCreateModal';
export { ServiceTypeEditModal } from './admin/modals/ServiceTypeEditModal';
export { ServiceTypeDeleteModal } from './admin/modals/ServiceTypeDeleteModal';

export { PriceConfigurationCreateModal } from './admin/modals/PriceConfigurationCreateModal';
export { PriceConfigurationEditModal } from './admin/modals/PriceConfigurationEditModal';
export { PriceConfigurationDeleteModal } from './admin/modals/PriceConfigurationDeleteModal';

export { ModifierCreateModal } from './admin/modals/ModifierCreateModal';
export { ModifierEditModal } from './admin/modals/ModifierEditModal';
export { ModifierDeleteModal } from './admin/modals/ModifierDeleteModal';
