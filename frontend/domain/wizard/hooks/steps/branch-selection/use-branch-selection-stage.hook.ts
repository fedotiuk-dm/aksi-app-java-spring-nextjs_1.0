import { useCallback, useEffect } from 'react';

import { useBranchLoading } from './use-branch-loading.hook';
import { useBranchSearch } from './use-branch-search.hook';
import { useBranchSelection } from './use-branch-selection.hook';
import { useWizardNavigation } from '../../shared/use-wizard-navigation.hook';

import type { Branch } from '../../../types';

interface UseBranchSelectionStageReturn {
  // Завантаження філій
  branches: Branch[];
  isLoadingBranches: boolean;
  branchLoadError: string | null;
  refreshBranches: () => Promise<void>;

  // Пошук філій
  searchTerm: string;
  searchResults: Branch[];
  isSearching: boolean;
  searchError: string | null;
  hasSearched: boolean;
  setSearchTerm: (term: string) => void;
  performSearch: () => Promise<void>;
  clearSearch: () => void;

  // Вибір філії
  selectedBranch: Branch | null;
  isValidSelection: boolean;
  validationError: string | null;
  selectBranch: (branch: Branch) => Promise<boolean>;
  clearSelection: () => void;

  // Навігація
  canProceedToNext: boolean;
  proceedToNext: () => void;
  goToPrevious: () => void;

  // Стан етапу
  isStageComplete: boolean;
  stageProgress: number;
}

/**
 * Композиційний хук для Stage 2: Branch Selection
 * Координує всю функціональність вибору філії
 */
export const useBranchSelectionStage = (): UseBranchSelectionStageReturn => {
  // Підключаємо функціональні хуки
  const {
    branches,
    isLoading: isLoadingBranches,
    error: branchLoadError,
    refreshBranches,
  } = useBranchLoading();

  const {
    searchTerm,
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    setSearchTerm,
    performSearch,
    clearSearch,
  } = useBranchSearch();

  const {
    selectedBranch,
    isValidSelection,
    validationError,
    selectBranch,
    clearSelection,
    validateCurrentSelection,
  } = useBranchSelection();

  const { canNavigateForward, navigateForward, navigateBack } = useWizardNavigation();

  // Обчислюємо можливість переходу до наступного етапу
  const canProceedToNext = isValidSelection && canNavigateForward();

  // Обчислюємо завершеність етапу
  const isStageComplete = selectedBranch !== null && isValidSelection;

  // Обчислюємо прогрес етапу (0-100%)
  const stageProgress = isStageComplete ? 100 : selectedBranch ? 50 : 0;

  // Обробники навігації
  const proceedToNext = useCallback(() => {
    if (canProceedToNext) {
      navigateForward();
    }
  }, [canProceedToNext, navigateForward]);

  const goToPrevious = useCallback(() => {
    navigateBack();
  }, [navigateBack]);

  // Автоматична валідація при зміні вибраної філії
  useEffect(() => {
    if (selectedBranch) {
      validateCurrentSelection();
    }
  }, [selectedBranch, validateCurrentSelection]);

  // Логування для дебагу
  useEffect(() => {
    console.log('Branch Selection Stage State:', {
      selectedBranch: selectedBranch?.name,
      isValidSelection,
      canProceedToNext,
      stageProgress,
    });
  }, [selectedBranch, isValidSelection, canProceedToNext, stageProgress]);

  return {
    // Завантаження філій
    branches,
    isLoadingBranches,
    branchLoadError,
    refreshBranches,

    // Пошук філій
    searchTerm,
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    setSearchTerm,
    performSearch,
    clearSearch,

    // Вибір філії
    selectedBranch,
    isValidSelection,
    validationError,
    selectBranch,
    clearSelection,

    // Навігація
    canProceedToNext,
    proceedToNext,
    goToPrevious,

    // Стан етапу
    isStageComplete,
    stageProgress,
  };
};
