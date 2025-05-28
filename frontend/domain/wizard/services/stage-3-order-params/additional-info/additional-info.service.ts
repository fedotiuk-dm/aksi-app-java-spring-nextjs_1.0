import { z } from 'zod';

import {
  getRequirementsParams,
  getRequirements200Response,
  updateRequirementsParams,
  updateRequirementsBody,
  updateRequirements200Response,
  safeValidate,
  validateOrThrow,
} from '@/shared/api/generated/order/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс для додаткової інформації замовлення з orval + zod інтеграцією
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація додаткових вимог та приміток через orval Zod схеми
 * - Бізнес-правила для форматування та обмежень тексту
 * - Валідація параметрів запитів та відповідей API
 * - Композиція даних для оновлення замовлення
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Навігацію (роль XState)
 *
 * ✅ ORVAL READY: повністю інтегровано з orval + zod схемами
 */

// Використовуємо orval схеми напряму
export type OrderRequirementsParams = z.infer<typeof getRequirementsParams>;
export type UpdateOrderRequirementsParams = z.infer<typeof updateRequirementsParams>;
export type OrderRequirementsResponse = z.infer<typeof getRequirements200Response>;
export type UpdateOrderRequirementsResponse = z.infer<typeof updateRequirements200Response>;
export type UpdateOrderRequirementsRequest = z.infer<typeof updateRequirementsBody>;

export interface AdditionalInfoValidationResult {
  isValid: boolean;
  errors: string[];
  validatedData?: UpdateOrderRequirementsRequest;
}

export class AdditionalInfoService extends BaseWizardService {
  protected readonly serviceName = 'AdditionalInfoService';

  /**
   * Валідація параметрів для отримання вимог замовлення
   */
  validateGetRequirementsParams(orderId: string): {
    isValid: boolean;
    errors: string[];
    validatedParams?: OrderRequirementsParams;
  } {
    const params = { orderId };
    const validation = safeValidate(getRequirementsParams, params);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedParams: validation.data,
    };
  }

  /**
   * Валідація параметрів для оновлення вимог замовлення
   */
  validateUpdateRequirementsParams(orderId: string): {
    isValid: boolean;
    errors: string[];
    validatedParams?: UpdateOrderRequirementsParams;
  } {
    const params = { orderId };
    const validation = safeValidate(updateRequirementsParams, params);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedParams: validation.data,
    };
  }

  /**
   * Валідація додаткової інформації через orval схему
   */
  validateAdditionalInfo(data: unknown): AdditionalInfoValidationResult {
    const validation = safeValidate(updateRequirementsBody, data);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: validation.data as UpdateOrderRequirementsRequest,
    };
  }

  /**
   * Створення даних для оновлення вимог замовлення
   */
  createUpdateRequirementsData(
    orderId: string,
    additionalRequirements?: string,
    customerNotes?: string
  ): {
    isValid: boolean;
    errors: string[];
    requestData?: UpdateOrderRequirementsRequest;
  } {
    // Створення об'єкта для валідації через orval схему
    const requestData: unknown = {
      orderId,
      additionalRequirements: additionalRequirements?.trim(),
      customerNotes: customerNotes?.trim(),
    };

    // Валідація через orval схему
    const validation = safeValidate(updateRequirementsBody, requestData);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      requestData: validation.data as UpdateOrderRequirementsRequest,
    };
  }

  /**
   * Валідація довжини тексту приміток
   */
  validateNotesLength(notes: string, maxLength: number = 1000): boolean {
    return notes.length <= maxLength;
  }

  /**
   * Очищення та форматування приміток
   */
  formatNotes(notes: string): string {
    return notes.trim().replace(/\s+/g, ' ');
  }

  /**
   * Валідація додаткових вимог
   */
  validateAdditionalRequirements(requirements: string, maxLength: number = 1000): boolean {
    return requirements.length <= maxLength;
  }

  /**
   * Очищення та форматування додаткових вимог
   */
  formatAdditionalRequirements(requirements: string): string {
    return requirements.trim().replace(/\s+/g, ' ');
  }

  /**
   * Підрахунок символів в примітках
   */
  getNotesCharacterCount(notes: string): { current: number; max: number; remaining: number } {
    const current = notes.length;
    const max = 1000;
    return {
      current,
      max,
      remaining: Math.max(0, max - current),
    };
  }

  /**
   * Підрахунок символів в додаткових вимогах
   */
  getRequirementsCharacterCount(requirements: string): {
    current: number;
    max: number;
    remaining: number;
  } {
    const current = requirements.length;
    const max = 1000;
    return {
      current,
      max,
      remaining: Math.max(0, max - current),
    };
  }

  /**
   * Перевірка чи є додаткові вимоги або примітки
   */
  hasAdditionalInfo(data: { additionalRequirements?: string; customerNotes?: string }): boolean {
    return !!(data.additionalRequirements?.trim() || data.customerNotes?.trim());
  }

  /**
   * Очищення порожніх полів додаткової інформації
   */
  cleanupAdditionalInfo(data: UpdateOrderRequirementsRequest): UpdateOrderRequirementsRequest {
    return {
      orderId: data.orderId,
      additionalRequirements: data.additionalRequirements?.trim() || undefined,
      customerNotes: data.customerNotes?.trim() || undefined,
    };
  }

  /**
   * Валідація готовності додаткової інформації для збереження
   */
  isAdditionalInfoValid(data: UpdateOrderRequirementsRequest): {
    isValid: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];

    if (data.additionalRequirements && data.additionalRequirements.length > 1000) {
      warnings.push('Додаткові вимоги перевищують максимальну довжину');
    }

    if (data.customerNotes && data.customerNotes.length > 1000) {
      warnings.push('Примітки клієнта перевищують максимальну довжину');
    }

    return {
      isValid: warnings.length === 0,
      warnings,
    };
  }

  /**
   * Генерація опису додаткової інформації для відображення
   */
  generateAdditionalInfoSummary(data: UpdateOrderRequirementsRequest): string {
    const parts: string[] = [];

    if (data.additionalRequirements?.trim()) {
      parts.push(`Додаткові вимоги: ${data.additionalRequirements.trim()}`);
    }

    if (data.customerNotes?.trim()) {
      parts.push(`Примітки клієнта: ${data.customerNotes.trim()}`);
    }

    return parts.join('\n') || 'Додаткова інформація відсутня';
  }
}
