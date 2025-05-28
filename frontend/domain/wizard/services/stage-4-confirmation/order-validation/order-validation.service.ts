import {
  getOrderDetailedSummary,
  type WizardOrderDetailedSummary,
} from '@/domain/wizard/adapters/order';
import { type ValidationResult } from '@/domain/wizard/schemas/wizard-result.schemas';
import {
  completeOrderSchema,
  type CompleteOrder,
} from '@/domain/wizard/schemas/wizard-stage-4.schemas';

import { BaseWizardService } from '../../base.service';

/**
 * Мінімалістський сервіс для валідації замовлення (Етап 4.3)
 * Розмір: ~80 рядків (дотримання ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція order адаптерів для підсумку
 * - Комплексна валідація через централізовану Zod схему
 * - Мінімальні бізнес-правила консистентності
 *
 * НЕ дублює:
 * - Отримання даних (роль order адаптерів)
 * - Схеми валідації (роль централізованих schemas)
 * - Типи (генеруються з централізованих schemas)
 */

export class OrderValidationService extends BaseWizardService {
  protected readonly serviceName = 'OrderValidationService';

  /**
   * Композиція: отримання детального підсумку через адаптер
   */
  async getOrderSummary(orderId: string): Promise<WizardOrderDetailedSummary | null> {
    const result = await getOrderDetailedSummary(orderId);
    return result.success ? result.data || null : null;
  }

  /**
   * Комплексна валідація замовлення через централізовану схему
   */
  validateCompleteOrder(orderData: unknown): ValidationResult {
    const validation = completeOrderSchema.safeParse(orderData);
    return {
      isValid: validation.success,
      errors: validation.success ? [] : validation.error.errors.map((err) => err.message),
      warnings: [],
    };
  }

  /**
   * Перевірка консистентності даних
   */
  validateConsistency(orderData: CompleteOrder): ValidationResult {
    const warnings: string[] = [];

    if (orderData.paidAmount > orderData.totalAmount) {
      warnings.push('Сплачено більше ніж загальна сума');
    }

    const executionDate = new Date(orderData.executionDate);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);

    if (executionDate < minDate) {
      warnings.push('Дата виконання може бути занадто рання');
    }

    return {
      isValid: warnings.length === 0,
      errors: [],
      warnings,
    };
  }

  /**
   * Фінальна перевірка готовності
   */
  isReadyForConfirmation(orderData: CompleteOrder): boolean {
    const validation = this.validateCompleteOrder(orderData);
    const consistency = this.validateConsistency(orderData);
    return validation.isValid && consistency.isValid;
  }
}
