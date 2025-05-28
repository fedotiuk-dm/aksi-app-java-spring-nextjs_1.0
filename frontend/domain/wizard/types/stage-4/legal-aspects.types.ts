/**
 * Етап 4.2: Стан кроку "Юридичні аспекти"
 */

import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Етап 4.2: Стан кроку "Юридичні аспекти"
 */
export interface LegalAspectsStepState extends WizardStepState {
  // Умови надання послуг
  termsAccepted: boolean;
  termsDocumentUrl: string;
  legalDocuments: Array<{
    type: string;
    name: string;
    url: string;
  }>;

  // Цифровий підпис клієнта
  signatureData: string | null;
  isSignaturePad: boolean;
  signatureValid: boolean;
  signatureCleared: boolean;
}
