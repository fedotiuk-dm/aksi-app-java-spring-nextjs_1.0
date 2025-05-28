import {
  saveCustomerSignature,
  saveClientSignature,
  getSignatureById,
  getTermsOfService,
  validateSignature,
  type WizardCustomerSignatureCreateData,
  type WizardCustomerSignature,
  type WizardSignatureData,
  type WizardSignatureResult,
  type WizardTermsData,
} from '@/domain/wizard/adapters/order';
import { legalDataSchema } from '@/domain/wizard/schemas';

import { BaseWizardService } from '../../base.service';

/**
 * Мінімалістський сервіс для юридичних аспектів (Етап 4.2)
 * Розмір: ~120 рядків (дотримання ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція order адаптерів для підпису та юридичних документів
 * - Валідація юридичних даних через централізовану Zod схему
 * - Обробка цифрового підпису
 * - Управління умовами надання послуг
 *
 * НЕ дублює:
 * - Отримання документів (роль order адаптерів)
 * - Збереження підпису (роль order адаптерів)
 * - Схеми валідації (роль централізованих schemas)
 */

// Типи результатів валідації підпису
export interface SignatureValidation {
  isValid: boolean;
  reason?: string;
}

export interface LegalDocument {
  title: string;
  url: string;
  type: 'law' | 'regulation' | 'standard';
}

export class LegalAspectsService extends BaseWizardService {
  protected readonly serviceName = 'LegalAspectsService';

  /**
   * Композиція: збереження підпису клієнта (новий API)
   */
  async saveClientSignature(
    signatureData: WizardSignatureData,
    termsAccepted: boolean = true
  ): Promise<WizardSignatureResult | null> {
    const result = await saveClientSignature(signatureData, termsAccepted);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: збереження підпису через стандартний адаптер
   */
  async saveCustomerSignature(
    signatureData: WizardCustomerSignatureCreateData,
    termsAccepted: boolean = true
  ): Promise<WizardCustomerSignature | null> {
    const result = await saveCustomerSignature(signatureData, termsAccepted);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: отримання підпису через адаптер
   */
  async getSignature(signatureId: string): Promise<WizardCustomerSignature | null> {
    const result = await getSignatureById(signatureId);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: валідація підпису через адаптер
   */
  async validateSignature(signatureData: string): Promise<SignatureValidation> {
    const result = await validateSignature(signatureData);
    if (result.success && result.data) {
      return result.data;
    }
    return { isValid: false, reason: result.error || 'Помилка валідації' };
  }

  /**
   * Композиція: отримання умов послуг через адаптер
   */
  async getTermsOfService(): Promise<WizardTermsData | null> {
    const result = await getTermsOfService();
    return result.success ? result.data || null : null;
  }

  /**
   * Валідація юридичних даних через централізовану схему
   */
  validateLegalData(data: unknown) {
    return legalDataSchema.safeParse(data);
  }

  /**
   * Отримання стандартних умов послуг
   */
  getStandardTerms(): string[] {
    return [
      'Термін виконання замовлення вказаний орієнтовно',
      'Хімчистка не несе відповідальності за ризики вказані у квитанції',
      'Вироби видаються тільки при наявності квитанції',
      'Претензії приймаються протягом 3 днів після видачі',
    ];
  }

  /**
   * Отримання посилань на нормативні документи
   */
  getLegalDocuments(): LegalDocument[] {
    return [
      {
        title: 'Закон України "Про захист прав споживачів"',
        url: 'https://zakon.rada.gov.ua/laws/show/1023-12',
        type: 'law',
      },
      {
        title: 'ДСТУ 7946:2015 "Послуги хімічної чистки"',
        url: 'https://dstu.gov.ua/ua/catalog/std?id=36895',
        type: 'standard',
      },
    ];
  }
}
