/**
 * Етап 3.1: Стан кроку "Параметри виконання"
 */

import type { ExpediteType } from '../shared/orval-types';
import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Етап 3.1: Стан кроку "Параметри виконання"
 */
export interface ExecutionParametersStepState extends WizardStepState {
  // Дата виконання
  expectedCompletionDate: Date | null;
  automaticCalculatedDate: Date | null;
  standardTerms: {
    regular: number; // 48 годин
    leather: number; // 14 днів
  };

  // Термінове виконання
  expediteType: ExpediteType;
  expediteOptions: Array<{
    type: ExpediteType;
    name: string;
    surcharge: number; // відсоток
    timeReduction: number; // години
  }>;
  expediteMultiplier: number;
  recalculatedDate: Date | null;
}
