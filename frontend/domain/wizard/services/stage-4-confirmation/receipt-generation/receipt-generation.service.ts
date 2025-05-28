import {
  generateOrderPdfReceipt,
  sendOrderReceiptByEmail,
  getOrderReceiptData,
  type WizardReceiptGenerationData,
  type WizardReceiptGenerationResult,
  type WizardEmailReceiptData,
  type WizardEmailReceiptResult,
  type WizardReceiptData,
} from '@/domain/wizard/adapters/order';
import {
  receiptStructureSchema,
  pdfGenerationDataSchema,
  emailReceiptDataSchema,
} from '@/domain/wizard/schemas';

import { BaseWizardService } from '../../base.service';

/**
 * Мінімалістський сервіс для генерації квитанції (Етап 4.4)
 * Розмір: ~80 рядків (дотримання ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція order адаптерів для квитанцій
 * - Валідація структури через централізовану Zod схему
 * - Валідація даних PDF та email через централізовані схеми
 * - Генерація PDF та відправка email
 *
 * НЕ дублює:
 * - Отримання даних (роль order адаптерів)
 * - Схеми валідації (роль централізованих schemas)
 * - Типи (генеруються з централізованих schemas)
 */

export class ReceiptGenerationService extends BaseWizardService {
  protected readonly serviceName = 'ReceiptGenerationService';

  /**
   * Композиція: генерація PDF через адаптер
   */
  async generatePdfReceipt(
    receiptData: WizardReceiptGenerationData
  ): Promise<WizardReceiptGenerationResult | null> {
    const result = await generateOrderPdfReceipt(receiptData);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: відправка на email через адаптер
   */
  async sendReceiptByEmail(
    emailData: WizardEmailReceiptData
  ): Promise<WizardEmailReceiptResult | null> {
    const result = await sendOrderReceiptByEmail(emailData);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: отримання даних для квитанції
   */
  async getReceiptData(orderId: string): Promise<WizardReceiptData | null> {
    const result = await getOrderReceiptData(orderId);
    return result.success ? result.data || null : null;
  }

  /**
   * Валідація структури квитанції через централізовану схему
   */
  validateReceiptStructure(data: unknown) {
    return receiptStructureSchema.safeParse(data);
  }

  /**
   * Валідація даних генерації PDF через централізовану схему
   */
  validatePdfGenerationData(data: unknown) {
    return pdfGenerationDataSchema.safeParse(data);
  }

  /**
   * Валідація даних відправки email через централізовану схему
   */
  validateEmailReceiptData(data: unknown) {
    return emailReceiptDataSchema.safeParse(data);
  }
}
