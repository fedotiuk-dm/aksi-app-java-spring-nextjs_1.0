import { useCallback } from 'react';

import { BranchService } from '../../../services/stage-1-client-and-order/branch-selection/branch.service';
import { useBranchSelectionStore } from '../../../store/stage-1-client-and-order/branch-selection.store';

import type { BranchLocationDTO } from '@/shared/api/generated/client/aksiApi.schemas';

const branchService = new BranchService();

/**
 * Хук для вибору філії
 * Відповідальність: логіка вибору та валідації
 */
export const useBranchSelection = () => {
  const {
    selectedBranchId,
    selectedBranch,
    setSelectedBranch,
    clearSelection,
    validationError,
    setValidationError,
  } = useBranchSelectionStore();

  const selectBranch = useCallback(
    (branch: BranchLocationDTO) => {
      const validation = branchService.validateBranchSelection(branch.id || '');

      if (!validation.isValid) {
        setValidationError(validation.error || 'Некоректний вибір філії');
        return;
      }

      if (!branchService.isBranchActive(branch)) {
        setValidationError('Обрана філія неактивна');
        return;
      }

      setSelectedBranch(branch);
      setValidationError(null);
    },
    [setSelectedBranch, setValidationError]
  );

  const clearBranchSelection = useCallback(() => {
    clearSelection();
    setValidationError(null);
  }, [clearSelection, setValidationError]);

  return {
    selectedBranchId,
    selectedBranch,
    validationError,
    isSelected: !!selectedBranch,
    selectBranch,
    clearSelection: clearBranchSelection,
  };
};
