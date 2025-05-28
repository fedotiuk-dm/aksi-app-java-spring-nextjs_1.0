import {
  applyOrderPayment,
  calculateOrderPayment,
  getOrderPayment,
  type WizardPaymentCalculationData,
  type WizardPaymentCalculationResult,
} from '@/domain/wizard/adapters/order';
import {
  paymentProcessingSchema,
  paymentProcessingFormSchema,
  type PaymentMethod,
} from '@/domain/wizard/schemas/wizard-stage-3.schemas';

import { BaseWizardService } from '../../base.service';

/**
 * ✅ МІНІМАЛІСТСЬКИЙ СЕРВІС ДЛЯ 3.3: ОПЛАТА
 * ✅ На основі: OrderWizard instruction_structure logic.md
 * Розмір: ~70 рядків (дотримання ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція order адаптерів для обробки платежів
 * - Валідація оплати через централізовані Zod схеми
 * - Розрахунок боргу відповідно до документу
 *
 * НЕ дублює:
 * - Обробку платежів (роль order адаптерів)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 */

export class PaymentProcessingService extends BaseWizardService {
  protected readonly serviceName = 'PaymentProcessingService';

  /**
   * Валідація обробки платежів (через централізовані схеми)
   */
  validatePaymentProcessing(data: unknown) {
    return paymentProcessingSchema.safeParse(data);
  }

  /**
   * Валідація форми обробки платежів
   */
  validatePaymentProcessingForm(data: unknown) {
    return paymentProcessingFormSchema.safeParse(data);
  }

  /**
   * Отримання способів оплати відповідно до документу
   * Спосіб оплати (вибір один):
   * - Термінал, Готівка, На рахунок
   */
  getPaymentMethodOptions(): Array<{ value: PaymentMethod; label: string }> {
    return [
      { value: 'термінал', label: 'Термінал' },
      { value: 'готівка', label: 'Готівка' },
      { value: 'на_рахунок', label: 'На рахунок' },
    ];
  }

  /**
   * Композиція: обробка платежу через адаптер
   */
  async processPayment(
    orderId: string,
    paymentData: WizardPaymentCalculationData
  ): Promise<WizardPaymentCalculationResult | null> {
    const result = await applyOrderPayment(paymentData, orderId);
    return result.success ? result.data || null : null;
  }

  /**
   * Розрахунок платежу через адаптер
   */
  async calculatePayment(
    orderId: string,
    paymentData: WizardPaymentCalculationData
  ): Promise<WizardPaymentCalculationResult | null> {
    const result = await calculateOrderPayment(paymentData, orderId);
    return result.success ? result.data || null : null;
  }

  /**
   * Отримання інформації про платіж
   */
  async getPaymentInfo(orderId: string): Promise<WizardPaymentCalculationResult | null> {
    const result = await getOrderPayment(orderId);
    return result.success ? result.data || null : null;
  }

  /**
   * Перевірка чи платіж повністю оплачений
   */
  isPaymentComplete(totalAmount: number, paidAmount: number): boolean {
    return paidAmount >= totalAmount;
  }

  /**
   * Розрахунок суми боргу (з документу)
   * Борг (розраховується автоматично як різниця)
   */
  calculateDebtAmount(totalAmount: number, paidAmount: number): number {
    return Math.max(0, totalAmount - paidAmount);
  }

  /**
   * Форматування фінансових сум для відображення
   */
  formatFinancialAmount(amount: number): string {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 2,
    }).format(amount);
  }
}
