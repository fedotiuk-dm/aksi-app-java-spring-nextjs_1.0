/**
 * Базовий сервіс для всіх Wizard сервісів
 * Містить спільну функціональність: валідація, логування, обробка помилок
 */

import { z } from 'zod';

export abstract class BaseWizardService {
  /**
   * Ім'я сервісу для логування
   */
  protected abstract readonly serviceName: string;

  /**
   * Валідація даних через Zod схему
   */
  protected validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      this.logError('Validation failed', { error, data });
      throw new Error(`${this.serviceName}: Невалідні дані - ${error}`);
    }
  }

  /**
   * Безпечна валідація даних (повертає результат з помилкою)
   */
  protected safeValidateData<T>(
    schema: z.ZodSchema<T>,
    data: unknown
  ): {
    success: boolean;
    data?: T;
    error?: string;
  } {
    const result = schema.safeParse(data);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      this.logError('Safe validation failed', { error: result.error, data });
      return {
        success: false,
        error: `${this.serviceName}: ${result.error.message}`,
      };
    }
  }

  /**
   * Обробка помилок з логуванням
   */
  protected handleError(operation: string, error: unknown): never {
    this.logError(operation, error);

    if (error instanceof Error) {
      throw new Error(`${this.serviceName}.${operation}: ${error.message}`);
    }

    throw new Error(`${this.serviceName}.${operation}: Невідома помилка`);
  }

  /**
   * Логування інформації
   */
  protected logInfo(message: string, data?: any): void {
    console.log(`[${this.serviceName}] ${message}`, data || '');
  }

  /**
   * Логування помилок
   */
  protected logError(message: string, error?: any): void {
    console.error(`[${this.serviceName}] ${message}`, error || '');
  }

  /**
   * Логування попереджень
   */
  protected logWarning(message: string, data?: any): void {
    console.warn(`[${this.serviceName}] ${message}`, data || '');
  }

  /**
   * Перевірка наявності обов'язкових полів
   */
  protected requireFields<T>(obj: Partial<T>, fields: (keyof T)[]): void {
    const missingFields = fields.filter((field) => !obj[field]);

    if (missingFields.length > 0) {
      throw new Error(
        `${this.serviceName}: Відсутні обов'язкові поля: ${missingFields.join(', ')}`
      );
    }
  }

  /**
   * Нормалізація рядків (trim, lowercase)
   */
  protected normalizeString(value: string | undefined | null): string {
    return (value || '').toString().trim().toLowerCase();
  }

  /**
   * Нормалізація телефону
   */
  protected normalizePhone(phone: string | undefined | null): string {
    if (!phone) return '';

    // Видаляємо все крім цифр
    const digits = phone.replace(/\D/g, '');

    // Якщо починається з 380, залишаємо як є
    if (digits.startsWith('380')) {
      return `+${digits}`;
    }

    // Якщо починається з 0, замінюємо на +380
    if (digits.startsWith('0')) {
      return `+380${digits.slice(1)}`;
    }

    // Інакше додаємо +380
    return `+380${digits}`;
  }

  /**
   * Перевірка чи є значення порожнім
   */
  protected isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  /**
   * Глибоке клонування об'єкта
   */
  protected deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
