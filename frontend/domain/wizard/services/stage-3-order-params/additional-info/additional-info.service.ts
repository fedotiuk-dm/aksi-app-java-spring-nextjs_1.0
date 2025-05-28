import {
  updateOrderRequirements,
  getOrderRequirements,
  type WizardAdditionalRequirementsData,
  type WizardAdditionalRequirementsResult,
} from '@/domain/wizard/adapters/order';
import {
  additionalInfoSchema,
  additionalInfoFormSchema,
} from '@/domain/wizard/schemas/wizard-stage-3.schemas';

// Імпорти адаптерів з wizard domain

import { BaseWizardService } from '../../base.service';

/**
 * ✅ МІНІМАЛІСТСЬКИЙ СЕРВІС ДЛЯ 3.4: ДОДАТКОВА ІНФОРМАЦІЯ
 * ✅ На основі: OrderWizard instruction_structure logic.md
 * Розмір: ~60 рядків (дотримання ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція order адаптерів для збереження приміток
 * - Валідація додаткової інформації через централізовані Zod схеми
 * - Мінімальне форматування тексту відповідно до документу
 *
 * НЕ дублює:
 * - Збереження приміток (роль order адаптерів)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 */

export class AdditionalInfoService extends BaseWizardService {
  protected readonly serviceName = 'AdditionalInfoService';

  /**
   * Валідація додаткової інформації (через централізовані схеми)
   */
  validateAdditionalInfo(data: unknown) {
    return additionalInfoSchema.safeParse(data);
  }

  /**
   * Валідація форми додаткової інформації
   */
  validateAdditionalInfoForm(data: unknown) {
    return additionalInfoFormSchema.safeParse(data);
  }

  /**
   * Композиція: збереження додаткової інформації через адаптер
   */
  async saveOrderAdditionalInfo(
    requirementsData: WizardAdditionalRequirementsData
  ): Promise<WizardAdditionalRequirementsResult | null> {
    const result = await updateOrderRequirements(requirementsData);
    return result.success ? result.data || null : null;
  }

  /**
   * Отримання додаткової інформації замовлення
   */
  async getOrderAdditionalInfo(
    orderId: string
  ): Promise<WizardAdditionalRequirementsResult | null> {
    const result = await getOrderRequirements(orderId);
    return result.success ? result.data || null : null;
  }

  /**
   * Валідація довжини тексту приміток (з документу)
   * Максимальна довжина приміток
   */
  validateNotesLength(notes: string, maxLength: number = 500): boolean {
    return notes.length <= maxLength;
  }

  /**
   * Очищення та форматування приміток
   * Видалення зайвих пробілів та символів
   */
  formatNotes(notes: string): string {
    return notes.trim().replace(/\s+/g, ' ');
  }

  /**
   * Підрахунок символів в примітках
   */
  getNotesCharacterCount(notes: string): { current: number; max: number } {
    return {
      current: notes.length,
      max: 500, // З документу - ліміт приміток
    };
  }

  /**
   * Перевірка чи є додаткові вимоги
   */
  hasAdditionalRequirements(data: WizardAdditionalRequirementsResult): boolean {
    return !!(data.additionalRequirements || data.customerNotes);
  }
}
