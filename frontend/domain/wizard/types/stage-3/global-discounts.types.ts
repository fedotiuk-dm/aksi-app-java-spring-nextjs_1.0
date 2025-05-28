/**
 * Етап 3.2: Стан кроку "Глобальні знижки"
 */

import type { DiscountType } from '../shared/orval-types';
import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Етап 3.2: Стан кроку "Глобальні знижки"
 */
export interface GlobalDiscountsStepState extends WizardStepState {
  // Тип знижки
  discountType: DiscountType;
  discountPercent: number;
  customDiscountPercent?: number;

  // Обмеження знижок
  excludedCategories: string[]; // прасування, прання, фарбування
  applicableItems: string[];
  warningMessage?: string;

  // Розрахунки
  discountAmount: number;
  itemsWithDiscount: Array<{
    itemId: string;
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
  }>;
  itemsWithoutDiscount: Array<{
    itemId: string;
    price: number;
    reason: string;
  }>;
}
