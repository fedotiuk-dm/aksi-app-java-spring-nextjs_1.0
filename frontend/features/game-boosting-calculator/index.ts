// 🎮 Game Boosting Calculator Feature
// Clean architecture implementation following order-wizard pattern

// Main Component
export { GameBoostingCalculator } from './GameBoostingCalculator';

// Store
export { useGameBoostingStore } from './store/game-boosting-store';

// Hooks
export { useGameOperations } from './hooks/useGameOperations';
export { useBoosterOperations } from './hooks/useBoosterOperations';
export { useCalculatorOperations } from './hooks/useCalculatorOperations';

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

// Admin Modals
export { GameCreateModal } from './components/admin/modals/GameCreateModal';
export { GameEditModal } from './components/admin/modals/GameEditModal';
export { GameDeleteModal } from './components/admin/modals/GameDeleteModal';
export { BoosterCreateModal } from './components/admin/modals/BoosterCreateModal';
export { BoosterEditModal } from './components/admin/modals/BoosterEditModal';
export { BoosterDeleteModal } from './components/admin/modals/BoosterDeleteModal';
