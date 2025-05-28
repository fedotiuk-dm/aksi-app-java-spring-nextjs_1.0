import {
  finalizeOrder,
  getOrderReceipt,
  emailReceipt,
  type WizardOrderFinalizationData,
  type WizardEmailReceiptData,
  type WizardOrder,
} from '@/domain/wizard/adapters/order';
import {
  navigateToNewOrder,
  navigateToOrdersList,
  getCompletionInfo,
  type NewOrderNavigationResult,
  type OrdersListNavigationResult,
  type CompletionConfirmationData,
  type CompletionInfoResult,
} from '@/domain/wizard/adapters/shared';
import { completionSchema } from '@/domain/wizard/schemas';

import { BaseWizardService } from '../../base.service';

/**
 * Мінімалістський сервіс для завершення замовлення (Етап 4.4)
 * Розмір: ~95 рядків (дотримання ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція order адаптерів для завершення
 * - Композиція navigation адаптерів для переходів
 * - Валідація фінальних даних через централізовану Zod схему
 * - Підготовка повідомлень про завершення
 *
 * НЕ дублює:
 * - Фіналізацію замовлення (роль order адаптерів)
 * - Генерацію PDF (роль order адаптерів)
 * - Відправку email (роль order адаптерів)
 * - Навігацію (роль navigation адаптерів)
 * - Збереження стану (роль Zustand)
 * - Схеми валідації (роль централізованих schemas)
 */

export class CompletionService extends BaseWizardService {
  protected readonly serviceName = 'CompletionService';

  /**
   * Композиція: фіналізація замовлення через адаптер
   */
  async finalizeOrder(finalizationData: WizardOrderFinalizationData): Promise<WizardOrder | null> {
    const result = await finalizeOrder(finalizationData);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: отримання PDF чека через адаптер
   */
  async getReceiptPdf(orderId: string, includeSignature: boolean = true): Promise<Blob | null> {
    const result = await getOrderReceipt(orderId, includeSignature);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: відправка чека на email через адаптер
   */
  async sendReceiptByEmail(emailData: WizardEmailReceiptData): Promise<boolean> {
    const result = await emailReceipt(emailData);
    return result.success;
  }

  /**
   * Композиція: отримання інформації про завершення (етап 4.4)
   */
  async getCompletionInfo(
    confirmationData: CompletionConfirmationData
  ): Promise<CompletionInfoResult | null> {
    const result = await getCompletionInfo(confirmationData);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: перехід до нового замовлення (етап 4.4)
   */
  async navigateToNewOrder(): Promise<NewOrderNavigationResult | null> {
    const result = await navigateToNewOrder();
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: повернення до списку замовлень (етап 4.4)
   */
  async navigateToOrdersList(): Promise<OrdersListNavigationResult | null> {
    const result = await navigateToOrdersList();
    return result.success ? result.data || null : null;
  }

  /**
   * Валідація даних завершення через централізовану схему
   */
  validateCompletion(data: unknown) {
    return completionSchema.safeParse(data);
  }
}
