import { useCallback } from 'react';

import { BranchService } from '../../../services/stage-2-branch-services/branch-service';
import { useWizardStore } from '../../../store';

import type { Branch } from '../../../types';

interface UseBranchSelectionReturn {
  selectedBranch: Branch | null;
  isValidSelection: boolean;
  validationError: string | null;
  selectBranch: (branch: Branch) => Promise<boolean>;
  clearSelection: () => void;
  validateCurrentSelection: () => boolean;
}

/**
 * Хук для управління вибором філії
 * Забезпечує валідацію, збереження у стор та бізнес-правила
 */
export const useBranchSelection = (): UseBranchSelectionReturn => {
  const {
    selectedBranch,
    branchValidationError,
    setSelectedBranch,
    clearSelectedBranch,
    setBranchValidationError,
  } = useWizardStore();
  const branchService = new BranchService();

  const selectBranch = useCallback(
    async (branch: Branch): Promise<boolean> => {
      try {
        // Валідуємо філію для замовлення
        const validationResult = branchService.validateBranchForOrder(branch);

        if (!validationResult.success) {
          console.warn('Валідація філії не пройшла:', validationResult.error);
          setBranchValidationError(validationResult.error || 'Помилка валідації філії');
          return false;
        }

        // Зберігаємо вибір у стор
        setSelectedBranch(branch);

        return true;
      } catch (error) {
        console.error('Помилка при виборі філії:', error);
        setBranchValidationError('Помилка при виборі філії');
        return false;
      }
    },
    [branchService, setSelectedBranch, setBranchValidationError]
  );

  const clearSelection = useCallback(() => {
    clearSelectedBranch();
  }, [clearSelectedBranch]);

  const validateCurrentSelection = useCallback((): boolean => {
    if (!selectedBranch) {
      return false;
    }

    const validationResult = branchService.validateBranchForOrder(selectedBranch);

    if (!validationResult.success) {
      setBranchValidationError(validationResult.error || 'Помилка валідації філії');
      return false;
    }

    setBranchValidationError(null);

    return true;
  }, [selectedBranch, branchService, setBranchValidationError]);

  // Обчислюємо стан валідації
  const isValidSelection = selectedBranch !== null && validateCurrentSelection();

  return {
    selectedBranch,
    isValidSelection,
    validationError: branchValidationError,
    selectBranch,
    clearSelection,
    validateCurrentSelection,
  };
};
