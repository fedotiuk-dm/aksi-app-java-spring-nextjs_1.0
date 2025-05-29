import { create } from 'zustand';

import type { BranchLocationDTO } from '@/shared/api/generated/client/aksiApi.schemas';

interface BranchSelectionState {
  selectedBranchId?: string;
  selectedBranch?: BranchLocationDTO;
  validationError?: string | null;
}

interface BranchSelectionActions {
  setSelectedBranch: (branch: BranchLocationDTO) => void;
  clearSelection: () => void;
  setValidationError: (error: string | null) => void;
}

/**
 * Мінімалістичний стор для вибору філії
 * Відповідальність: тільки збереження стану вибору
 */
export const useBranchSelectionStore = create<BranchSelectionState & BranchSelectionActions>(
  (set) => ({
    // Стан
    selectedBranchId: undefined,
    selectedBranch: undefined,
    validationError: null,

    // Дії
    setSelectedBranch: (branch) =>
      set({
        selectedBranchId: branch.id,
        selectedBranch: branch,
        validationError: null,
      }),

    clearSelection: () =>
      set({
        selectedBranchId: undefined,
        selectedBranch: undefined,
        validationError: null,
      }),

    setValidationError: (error) =>
      set({
        validationError: error,
      }),
  })
);
