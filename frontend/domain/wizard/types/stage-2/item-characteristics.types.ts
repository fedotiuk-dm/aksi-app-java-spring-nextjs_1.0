/**
 * Підетап 2.2: Стан кроку "Характеристики предмета"
 */

import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Підетап 2.2: Стан кроку "Характеристики предмета"
 */
export interface ItemCharacteristicsStepState extends WizardStepState {
  // Матеріал
  selectedMaterial: string | null;
  availableMaterials: Array<{
    code: string;
    name: string;
    categorySpecific: boolean;
  }>;

  // Колір
  selectedColor: string;
  quickColors: string[];
  isCustomColor: boolean;

  // Наповнювач
  selectedFilling: string | null;
  availableFillings: Array<{
    code: string;
    name: string;
  }>;
  hasDamagedFilling: boolean;

  // Ступінь зносу
  wearLevel: '10' | '30' | '50' | '75' | null;
}
