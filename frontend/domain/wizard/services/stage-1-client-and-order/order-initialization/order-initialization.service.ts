import {
  initializeOrder,
  checkUniqueLabelExists,
  validateUniqueLabel,
  type WizardOrderInitializationResult,
} from '@/domain/wizard/adapters/order';
import {
  orderInitializationSchema,
  uniqueTagValidationSchema,
  orderBasicInfoSchema,
  receiptNumberGenerationSchema,
  type OrderInitializationData,
  type UniqueTagValidationData,
  type OrderBasicInfoData,
  type ReceiptNumberGenerationData,
} from '@/domain/wizard/schemas';
import { generateReceiptNumber } from '@/domain/wizard/utils';

// Імпорти централізованих схем та типів

import { BaseWizardService } from '../../base.service';

/**
 * Мінімалістський сервіс для ініціалізації замовлення
 * Розмір: ~90 рядків (дотримання ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція order адаптерів для ініціалізації
 * - Валідація через централізовані Zod схеми
 * - Мінімальні перевірки унікальності
 * - Генерація номерів через схеми валідації
 *
 * НЕ дублює:
 * - API виклики (роль order адаптерів)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Схеми валідації (роль централізованих schemas)
 */

export class OrderInitializationService extends BaseWizardService {
  protected readonly serviceName = 'OrderInitializationService';

  /**
   * Композиція: ініціалізація замовлення через адаптер з валідацією
   */
  async initializeOrder(
    initData: OrderInitializationData
  ): Promise<WizardOrderInitializationResult | null> {
    // Валідація через централізовану схему
    const validation = this.validateOrderInit(initData);
    if (!validation.success) {
      throw new Error(validation.error.errors[0].message);
    }

    const result = await initializeOrder(initData.uniqueTag, initData.branchId, initData.clientId);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: перевірка унікальності мітки через адаптер з типізацією
   */
  async checkUniqueTagExists(validationData: UniqueTagValidationData): Promise<boolean> {
    const validation = this.validateUniqueTagData(validationData);
    if (!validation.success) {
      return false;
    }

    const result = await checkUniqueLabelExists(validationData.tag, validationData.excludeOrderId);
    return result.success ? result.data || false : false;
  }

  /**
   * Валідація унікальної мітки через адаптер
   */
  validateUniqueTag(tag: string): { isValid: boolean; error?: string } {
    return validateUniqueLabel(tag);
  }

  /**
   * Валідація даних ініціалізації через централізовану схему
   */
  validateOrderInit(data: unknown) {
    return orderInitializationSchema.safeParse(data);
  }

  /**
   * Валідація унікальної мітки через централізовану схему
   */
  validateUniqueTagData(data: unknown) {
    return uniqueTagValidationSchema.safeParse(data);
  }

  /**
   * Валідація базової інформації через централізовану схему
   */
  validateBasicInfo(data: unknown) {
    return orderBasicInfoSchema.safeParse(data);
  }

  /**
   * Валідація даних для генерації номеру квитанції
   */
  validateReceiptGeneration(data: unknown) {
    return receiptNumberGenerationSchema.safeParse(data);
  }

  /**
   * Створення базової структури замовлення
   */
  createOrderBasicInfo(initData: OrderInitializationData, branchCode: string): OrderBasicInfoData {
    // Валідація через централізовану схему
    const validation = this.validateOrderInit(initData);
    if (!validation.success) {
      throw new Error(validation.error.errors[0].message);
    }

    // Створення базової структури
    return {
      receiptNumber: this.generateReceiptNumberWithValidation(branchCode),
      uniqueTag: initData.uniqueTag.trim(),
      branchId: initData.branchId,
      clientId: initData.clientId,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Генерація номеру квитанції з валідацією через схему
   */
  generateReceiptNumberWithValidation(branchCode: string): string {
    const generationData: ReceiptNumberGenerationData = {
      branchCode,
      timestamp: Date.now(),
      randomSuffix: Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0'),
    };

    // Валідація через централізовану схему
    const validation = this.validateReceiptGeneration(generationData);
    if (!validation.success) {
      throw new Error(validation.error.errors[0].message);
    }

    // Генерація номеру на основі валідованих даних
    const timestamp =
      generationData.timestamp?.toString().slice(-6) || Date.now().toString().slice(-6);
    const randomSuffix =
      generationData.randomSuffix ||
      Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');

    return `${branchCode}-${timestamp}-${randomSuffix}`;
  }

  /**
   * Генерація випадкової унікальної мітки (для автозаповнення)
   */
  generateRandomUniqueTag(): string {
    const baseNumber = generateReceiptNumber();
    const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `TAG-${baseNumber.slice(-6)}-${suffix}`;
  }

  /**
   * Нормалізація унікальної мітки
   */
  normalizeUniqueTag(tag: string): string {
    return tag.trim().toUpperCase();
  }

  /**
   * Перевірка формату номеру квитанції
   */
  isValidReceiptNumber(receiptNumber: string): boolean {
    // Формат: BRANCH-123456-123
    const pattern = /^[A-Z0-9]+-\d{6}-\d{3}$/;
    return pattern.test(receiptNumber);
  }

  /**
   * Валідація та нормалізація унікальної мітки з типізацією
   */
  processUniqueTag(validationData: UniqueTagValidationData): {
    isValid: boolean;
    normalizedTag?: string;
    error?: string;
  } {
    const validation = this.validateUniqueTagData(validationData);
    if (!validation.success) {
      return {
        isValid: false,
        error: validation.error.errors[0].message,
      };
    }

    const normalizedTag = this.normalizeUniqueTag(validationData.tag);
    const tagValidation = this.validateUniqueTag(normalizedTag);

    return {
      isValid: tagValidation.isValid,
      normalizedTag: tagValidation.isValid ? normalizedTag : undefined,
      error: tagValidation.error,
    };
  }
}
