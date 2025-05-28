/**
 * Етап 4.3: Стан кроку "Формування та друк квитанції"
 */

import type { ReceiptData } from '../shared/receipt.types';
import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Етап 4.3: Стан кроку "Формування та друк квитанції"
 */
export interface ReceiptGenerationStepState extends WizardStepState {
  // Генерування квитанції
  receiptGenerated: boolean;
  receiptData: ReceiptData | null;
  isGenerating: boolean;
  generationError?: string;

  // Друк та відправка
  printRequested: boolean;
  printCopies: number; // 2 примірники
  receiptSent: boolean;
  receiptEmailed: boolean;
  emailAddress?: string;

  // Опції видачі
  printOptions: {
    autoPrint: boolean;
    doublesided: boolean;
    copiesCount: number;
  };

  deliveryOptions: {
    printPhysical: boolean;
    sendEmail: boolean;
    emailAddress?: string;
  };
}
