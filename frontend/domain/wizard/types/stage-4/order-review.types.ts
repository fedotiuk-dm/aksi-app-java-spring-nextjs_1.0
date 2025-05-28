/**
 * Етап 4.1: Стан кроку "Перегляд замовлення з детальним розрахунком"
 */

import type { OrderSummaryData } from '../shared/order-summary.types';
import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Етап 4.1: Стан кроку "Перегляд замовлення з детальним розрахунком"
 */
export interface OrderReviewStepState extends WizardStepState {
  // Повний підсумок замовлення
  orderSummary: OrderSummaryData;

  // Деталізація розрахунків
  detailedCalculation: {
    itemsBreakdown: Array<{
      itemId: string;
      name: string;
      basePrice: number;
      modifiers: Array<{
        name: string;
        percentage: number;
        amount: number;
      }>;
      finalPrice: number;
    }>;
    totalBeforeDiscounts: number;
    globalDiscounts: Array<{
      type: string;
      percentage: number;
      amount: number;
    }>;
    expediteCharges: Array<{
      type: string;
      percentage: number;
      amount: number;
    }>;
    finalTotal: number;
  };

  isCalculating: boolean;
  calculationError?: string;
}
