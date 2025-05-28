/**
 * Підетап 2.3: Стан кроку "Забруднення, дефекти та ризики"
 */

import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Підетап 2.3: Стан кроку "Забруднення, дефекти та ризики"
 */
export interface ItemDefectsStepState extends WizardStepState {
  // Плями
  selectedStains: Array<{
    type: 'FAT' | 'BLOOD' | 'PROTEIN' | 'WINE' | 'COFFEE' | 'GRASS' | 'INK' | 'COSMETICS' | 'OTHER';
    customDescription?: string;
  }>;
  availableStains: Array<{
    type: string;
    name: string;
    description: string;
  }>;

  // Дефекти та ризики
  selectedDefects: Array<{
    type:
      | 'WEAR'
      | 'TORN'
      | 'MISSING_HARDWARE'
      | 'DAMAGED_HARDWARE'
      | 'COLOR_RISK'
      | 'DEFORMATION_RISK'
      | 'NO_WARRANTY';
    description?: string;
  }>;
  availableDefects: Array<{
    type: string;
    name: string;
    requiresExplanation: boolean;
  }>;

  // Примітки щодо дефектів
  defectNotes: string;
  hasNoWarranty: boolean;
  noWarrantyReason: string;
}
