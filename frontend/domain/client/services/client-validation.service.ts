import { CreateClientFormData, UpdateClientFormData } from '../types';
import { PhoneVO, EmailVO } from '../value-objects';

/**
 * Сервіс для валідації клієнтських даних
 * Реалізує Single Responsibility Principle - відповідає тільки за валідацію
 */
export class ClientValidationService {
  /**
   * Валідує дані для створення клієнта
   */
  validateCreateData(data: CreateClientFormData): ValidationResult {
    const errors: ValidationError[] = [];

    // Валідація імені
    if (!data.firstName?.trim()) {
      errors.push({ field: 'firstName', message: "Ім'я є обов'язковим" });
    } else if (data.firstName.trim().length < 2) {
      errors.push({ field: 'firstName', message: "Ім'я повинно містити мінімум 2 символи" });
    }

    // Валідація прізвища
    if (!data.lastName?.trim()) {
      errors.push({ field: 'lastName', message: "Прізвище є обов'язковим" });
    } else if (data.lastName.trim().length < 2) {
      errors.push({ field: 'lastName', message: 'Прізвище повинно містити мінімум 2 символи' });
    }

    // Валідація телефону
    try {
      new PhoneVO(data.phone);
    } catch (error) {
      errors.push({
        field: 'phone',
        message: error instanceof Error ? error.message : 'Невірний номер телефону',
      });
    }

    // Валідація email (якщо вказано)
    if (data.email?.trim()) {
      try {
        new EmailVO(data.email);
      } catch (error) {
        errors.push({
          field: 'email',
          message: error instanceof Error ? error.message : 'Невірний email',
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валідує дані для оновлення клієнта
   */
  validateUpdateData(data: UpdateClientFormData): ValidationResult {
    const errors: ValidationError[] = [];

    // ID є обов'язковим для оновлення
    if (!data.id?.trim()) {
      errors.push({ field: 'id', message: "ID клієнта є обов'язковим для оновлення" });
    }

    // Валідуємо решту даних як для створення
    const createValidation = this.validateCreateData(data);
    errors.push(...createValidation.errors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валідує пошуковий запит
   */
  validateSearchQuery(query: string): ValidationResult {
    const errors: ValidationError[] = [];

    if (!query?.trim()) {
      errors.push({ field: 'query', message: 'Пошуковий запит не може бути порожнім' });
    } else if (query.trim().length < 2) {
      errors.push({ field: 'query', message: 'Пошуковий запит повинен містити мінімум 2 символи' });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Перевіряє, чи є номер телефону валідним українським номером
   */
  isValidUkrainianPhone(phone: string): boolean {
    try {
      new PhoneVO(phone);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Перевіряє, чи є email валідним
   */
  isValidEmail(email: string): boolean {
    try {
      new EmailVO(email);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Інтерфейси для результатів валідації
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}
