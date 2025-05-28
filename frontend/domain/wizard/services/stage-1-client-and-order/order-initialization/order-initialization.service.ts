import { z } from 'zod';

import {
  createOrderBody,
  createOrder201Response,
  safeValidate,
  validateOrThrow,
} from '@/shared/api/generated/order/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс для ініціалізації замовлення з orval + zod інтеграцією
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація даних створення замовлення через orval Zod схеми
 * - Композиція та підготовка даних для API
 * - Генерація та валідація унікальних міток
 * - Бізнес-правила ініціалізації замовлення
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 */

// Використовуємо orval схеми напряму
export type CreateOrderRequest = z.infer<typeof createOrderBody>;
export type OrderResponse = z.infer<typeof createOrder201Response>;

// Локальні композитні схеми для ініціалізації
const orderInitDataSchema = z.object({
  clientId: z.string().uuid('Невірний формат ID клієнта'),
  branchLocationId: z.string().uuid('Невірний формат ID філії'),
  tagNumber: z.string().min(1, "Унікальна мітка обов'язкова").optional(),
});

const uniqueTagValidationSchema = z.object({
  tag: z.string().min(1, 'Мітка не може бути порожньою'),
  excludeOrderId: z.string().uuid().optional(),
});

const receiptNumberGenerationSchema = z.object({
  branchCode: z.string().min(1, "Код філії обов'язковий"),
  timestamp: z.number().min(0).optional(),
  randomSuffix: z.string().length(3).optional(),
});

// Експортуємо типи на основі локальних схем
export type OrderInitData = z.infer<typeof orderInitDataSchema>;
export type UniqueTagValidation = z.infer<typeof uniqueTagValidationSchema>;
export type ReceiptNumberData = z.infer<typeof receiptNumberGenerationSchema>;

export interface OrderInitializationResult {
  isValid: boolean;
  errors: string[];
  orderData?: CreateOrderRequest;
}

export class OrderInitializationService extends BaseWizardService {
  protected readonly serviceName = 'OrderInitializationService';

  /**
   * Валідація даних ініціалізації замовлення через orval схему
   */
  validateOrderInitData(data: unknown): {
    isValid: boolean;
    errors: string[];
    validatedData?: OrderInitData;
  } {
    const localValidation = safeValidate(orderInitDataSchema, data);
    if (!localValidation.success) {
      return {
        isValid: false,
        errors: localValidation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: localValidation.data,
    };
  }

  /**
   * Створення базового об'єкта замовлення для API
   */
  createOrderData(initData: OrderInitData): OrderInitializationResult {
    // Валідація вхідних даних
    const validation = this.validateOrderInitData(initData);
    if (!validation.isValid || !validation.validatedData) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    const validatedData = validation.validatedData;

    // Створення об'єкта відповідно до orval схеми
    const orderData: CreateOrderRequest = {
      clientId: validatedData.clientId,
      branchLocationId: validatedData.branchLocationId,
      tagNumber: validatedData.tagNumber,
      draft: true, // Завжди створюємо як чернетку
      items: [], // Предмети будуть додані пізніше в Item Manager
      expediteType: 'STANDARD',
    };

    // Валідація через orval схему
    const apiValidation = safeValidate(createOrderBody, orderData);
    if (!apiValidation.success) {
      return {
        isValid: false,
        errors: apiValidation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      orderData: apiValidation.data,
    };
  }

  /**
   * Валідація унікальної мітки
   */
  validateUniqueTag(validationData: UniqueTagValidation): {
    isValid: boolean;
    errors: string[];
    normalizedTag?: string;
  } {
    const validation = safeValidate(uniqueTagValidationSchema, validationData);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    const normalizedTag = this.normalizeUniqueTag(validation.data.tag);

    // Базова валідація формату тега
    if (!this.isValidTagFormat(normalizedTag)) {
      return {
        isValid: false,
        errors: ['Невірний формат унікальної мітки'],
      };
    }

    return {
      isValid: true,
      errors: [],
      normalizedTag,
    };
  }

  /**
   * Генерація номеру квитанції з валідацією
   */
  generateReceiptNumber(branchCode: string): string {
    const generationData: ReceiptNumberData = {
      branchCode,
      timestamp: Date.now(),
      randomSuffix: Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0'),
    };

    // Валідація даних генерації
    try {
      validateOrThrow(receiptNumberGenerationSchema, generationData);
    } catch (error) {
      throw new Error(`Помилка генерації номеру квитанції: ${error}`);
    }

    // Генерація номеру
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
   * Генерація випадкової унікальної мітки
   */
  generateRandomUniqueTag(): string {
    const timestamp = Date.now().toString().slice(-6);
    const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `TAG-${timestamp}-${suffix}`;
  }

  /**
   * Нормалізація унікальної мітки
   */
  normalizeUniqueTag(tag: string): string {
    return tag.trim().toUpperCase();
  }

  /**
   * Перевірка формату унікальної мітки
   */
  isValidTagFormat(tag: string): boolean {
    // Допускаємо букви, цифри, дефіси, підкреслення
    const pattern = /^[A-Z0-9\-_]{3,20}$/;
    return pattern.test(tag);
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
   * Підготовка мінімальних даних замовлення для чернетки
   */
  createDraftOrderData(
    clientId: string,
    branchLocationId: string,
    tagNumber?: string
  ): CreateOrderRequest {
    const orderData: CreateOrderRequest = {
      clientId,
      branchLocationId,
      tagNumber: tagNumber || this.generateRandomUniqueTag(),
      draft: true,
      expediteType: 'STANDARD',
      items: [],
    };

    // Валідація через orval схему
    try {
      return validateOrThrow(createOrderBody, orderData);
    } catch (error) {
      throw new Error(`Помилка створення чернетки замовлення: ${error}`);
    }
  }

  /**
   * Перевірка готовності даних для створення замовлення
   */
  isReadyForCreation(orderData: CreateOrderRequest): {
    isReady: boolean;
    missingFields: string[];
  } {
    const missingFields: string[] = [];

    if (!orderData.clientId) {
      missingFields.push('ID клієнта');
    }

    if (!orderData.branchLocationId) {
      missingFields.push('ID філії');
    }

    if (!orderData.tagNumber?.trim()) {
      missingFields.push('Унікальна мітка');
    }

    // Для фінального замовлення потрібен хоча б один предмет
    if (!orderData.draft && (!orderData.items || orderData.items.length === 0)) {
      missingFields.push('Предмети замовлення');
    }

    return {
      isReady: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Трансформація даних замовлення з чернетки у фінальне
   */
  transformDraftToFinal(draftData: CreateOrderRequest): CreateOrderRequest {
    const validation = safeValidate(createOrderBody, draftData);
    if (!validation.success) {
      throw new Error(`Невірні дані чернетки: ${validation.errors.join(', ')}`);
    }

    return {
      ...validation.data,
      draft: false,
    };
  }
}
