/**
 * Етап 3.4: Стан кроку "Додаткова інформація"
 */

import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Етап 3.4: Стан кроку "Додаткова інформація"
 */
export interface AdditionalInfoStepState extends WizardStepState {
  // Примітки до замовлення
  orderNotes: string;
  orderNotesLength: number;
  maxNotesLength: number; // 1000

  // Додаткові вимоги клієнта
  customerRequirements: string;
  requirementsLength: number;
  maxRequirementsLength: number; // 1000

  // Валідація
  notesValid: boolean;
  requirementsValid: boolean;
}
