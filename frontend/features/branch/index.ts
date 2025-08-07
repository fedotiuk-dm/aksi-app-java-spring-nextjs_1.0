/**
 * @fileoverview Branch Feature Module
 * 
 * Модуль для управління філіями системи
 */

// Components
export { BranchList } from './components/BranchList';
export { BranchForm } from './components/BranchForm';
export { BranchCard } from './components/BranchCard';
export { BranchSelector } from './components/BranchSelector';
export { BranchDetails } from './components/BranchDetails';

// Store
export { useBranchStore } from './store/branch-store';

// Types
export type { BranchUIState } from './store/branch-store';