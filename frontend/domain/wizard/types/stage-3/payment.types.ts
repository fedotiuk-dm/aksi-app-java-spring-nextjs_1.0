/**
 * Етап 3.3: Стан кроку "Оплата"
 */

import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Етап 3.3: Стан кроку "Оплата"
 */
export interface PaymentStepState extends WizardStepState {
  // Спосіб оплати
  paymentMethod: 'TERMINAL' | 'CASH' | 'ACCOUNT';

  // Фінансові деталі
  totalAmount: number;
  discountAmount: number;
  expediteAmount: number;
  finalAmount: number;
  prepaymentAmount: number;
  balanceAmount: number; // розраховується автоматично

  // Валідація платежу
  isPaymentValid: boolean;
  paymentErrors: string[];
}
