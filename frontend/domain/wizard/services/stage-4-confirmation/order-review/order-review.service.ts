import {
  getOrderDetailedSummary,
  type WizardOrderDetailedSummary,
  type WizardOrderClientInfo,
  type WizardOrderBranchInfo,
} from '@/domain/wizard/adapters/order';
import {
  orderReviewSchema,
  type OrderReviewOptions,
} from '@/domain/wizard/schemas/wizard-stage-4.schemas';

import { BaseWizardService } from '../../base.service';

/**
 * Мінімалістський сервіс для перегляду замовлення (Етап 4.1)
 * Розмір: ~110 рядків (дотримання ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція order адаптерів для підсумку
 * - Валідація даних перегляду через централізовану Zod схему
 * - Структурування детального розрахунку (згідно документації 4.1)
 *
 * НЕ дублює:
 * - Отримання даних (роль order адаптерів)
 * - Обчислення цін (роль pricing адаптерів)
 * - Збереження стану (роль Zustand)
 * - Схеми валідації (роль централізованих schemas)
 */

// Структуровані типи для детального перегляду (згідно документації 4.1)
export interface DetailedOrderInfo {
  id: string;
  receiptNumber: string;
  tagNumber?: string;
  createdDate: string;
  expectedCompletionDate?: string;
}

export interface DetailedCalculationItem {
  id: string;
  itemName: string;
  categoryName: string;
  quantity: number;
  unit: string;
  basePrice: number;
  modifierBreakdown: {
    modifierName: string;
    type: string;
    value: number;
    amount: number;
  }[];
  subtotal: number;
  finalPrice: number;
}

export interface DetailedPaymentSummary {
  totalBeforeDiscounts: number;
  discountAmount?: number;
  expediteSurchargeAmount?: number;
  finalAmount: number;
  prepaymentAmount?: number;
  balanceAmount: number;
}

export interface DetailedOrderSummary {
  orderInfo: DetailedOrderInfo;
  clientInfo?: WizardOrderClientInfo;
  branchInfo?: WizardOrderBranchInfo;
  items: DetailedCalculationItem[];
  calculationDetails?: DetailedPaymentSummary;
  paymentSummary?: DetailedPaymentSummary;
}

export class OrderReviewService extends BaseWizardService {
  protected readonly serviceName = 'OrderReviewService';

  /**
   * Композиція: отримання детального підсумку через адаптер
   */
  async getDetailedSummary(orderId: string): Promise<WizardOrderDetailedSummary | null> {
    const result = await getOrderDetailedSummary(orderId);
    return result.success ? result.data || null : null;
  }

  /**
   * Валідація опцій перегляду
   */
  validateReviewOptions(data: unknown) {
    return orderReviewSchema.safeParse(data);
  }

  /**
   * Структурування детального перегляду з деталізацією розрахунків (згідно документації 4.1)
   */
  async getStructuredReview(options: OrderReviewOptions): Promise<DetailedOrderSummary | null> {
    const detailedSummary = await this.getDetailedSummary(options.orderId);

    if (!detailedSummary) return null;

    // Структурування предметів з детальною деталізацією розрахунків
    const detailedItems: DetailedCalculationItem[] = detailedSummary.items.map((item) => ({
      id: item.id || '',
      itemName: item.itemName,
      categoryName: item.categoryName,
      quantity: item.quantity,
      unit: item.unit,
      basePrice: item.priceCalculation.basePrice,
      modifierBreakdown: item.priceCalculation.modifiers.map((mod) => ({
        modifierName: mod.name,
        type: mod.type.toString(),
        value: mod.value,
        amount: mod.amount,
      })),
      subtotal: item.priceCalculation.subtotal,
      finalPrice: item.priceCalculation.finalPrice,
    }));

    // Структурування платіжного підсумку
    const paymentSummary: DetailedPaymentSummary = {
      totalBeforeDiscounts: detailedSummary.totalAmount,
      discountAmount: detailedSummary.discountAmount,
      expediteSurchargeAmount: detailedSummary.expediteSurchargeAmount,
      finalAmount: detailedSummary.finalAmount,
      prepaymentAmount: detailedSummary.prepaymentAmount,
      balanceAmount: detailedSummary.balanceAmount,
    };

    return {
      orderInfo: {
        id: detailedSummary.id,
        receiptNumber: detailedSummary.receiptNumber,
        tagNumber: detailedSummary.tagNumber,
        createdDate: detailedSummary.createdDate,
        expectedCompletionDate: detailedSummary.expectedCompletionDate,
      },
      clientInfo: detailedSummary.clientInfo,
      branchInfo: detailedSummary.branchInfo,
      items: detailedItems,
      calculationDetails: options.includeCalculationDetails ? paymentSummary : undefined,
      paymentSummary: options.includePaymentSummary ? paymentSummary : undefined,
    };
  }
}
