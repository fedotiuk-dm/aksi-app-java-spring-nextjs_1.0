/**
 * Етап 4.4: Стан кроку "Завершення процесу"
 */

import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Етап 4.4: Стан кроку "Завершення процесу"
 */
export interface ProcessCompletionStepState extends WizardStepState {
  // Підтвердження завершення
  orderCompleted: boolean;
  completionMessage: string;
  readinessDate: Date | null;

  // Інформація про копії
  copiesSent: Array<{
    type: 'PRINT' | 'EMAIL';
    status: 'SUCCESS' | 'FAILED';
    details?: string;
  }>;

  // Додаткові дії
  nextActions: Array<{
    action: 'NEW_ORDER' | 'ORDER_LIST' | 'DASHBOARD';
    label: string;
    available: boolean;
  }>;

  // Прогрес завершення
  isCompleting: boolean;
  completionProgress: number;
  completionErrors: string[];
  finalizedAt?: string;
}
