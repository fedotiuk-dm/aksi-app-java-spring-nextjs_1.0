/**
 * @fileoverview Доменний сервіс вибору клієнта в wizard
 * @module domain/wizard/services
 */

import type { ClientSearchResult } from '../types';

/**
 * Результат вибору клієнта
 */
export interface ClientSelectionResult {
  success: boolean;
  client?: ClientSearchResult;
  error?: string;
  warnings?: string[];
}

/**
 * Результат валідації клієнта для замовлення
 */
export interface ClientValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  canProceed: boolean;
}

/**
 * Доменний сервіс для вибору клієнта в контексті wizard
 *
 * Відповідальність:
 * - Логіка вибору клієнта в wizard
 * - Валідація клієнта для створення замовлення
 * - Бізнес-правила для переходу до наступного кроку
 * - Управління станом вибраного клієнта
 *
 * НЕ відповідає за:
 * - React стан (робить хук)
 * - Zustand Store операції (робить хук)
 * - API виклики (робить адаптер)
 */
export class ClientSelectionService {
  private static readonly REQUIRED_FIELDS: Array<keyof ClientSearchResult> = [
    'firstName',
    'lastName',
    'phone',
  ];

  private static readonly RECOMMENDED_FIELDS: Array<keyof ClientSearchResult> = [
    'email',
    'address',
    'communicationChannels',
  ];

  /**
   * Вибір клієнта для wizard
   */
  static selectClient(client: ClientSearchResult): ClientSelectionResult {
    try {
      // Валідація клієнта
      const validation = this.validateClientForOrder(client);

      if (!validation.canProceed) {
        return {
          success: false,
          error: 'Клієнт не може бути вибраний для замовлення',
          warnings: validation.errors,
        };
      }

      return {
        success: true,
        client,
        warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Помилка вибору клієнта',
      };
    }
  }

  /**
   * Очищення вибору клієнта
   */
  static clearSelection(): ClientSelectionResult {
    return {
      success: true,
      client: undefined,
    };
  }

  /**
   * Валідація клієнта для створення замовлення
   */
  static validateClientForOrder(client: ClientSearchResult): ClientValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Перевірка обов'язкових полів
    for (const field of this.REQUIRED_FIELDS) {
      const value = client[field];
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.push(this.getFieldErrorMessage(field));
      }
    }

    // Перевірка рекомендованих полів
    for (const field of this.RECOMMENDED_FIELDS) {
      const value = client[field];
      if (
        !value ||
        (typeof value === 'string' && !value.trim()) ||
        (Array.isArray(value) && value.length === 0)
      ) {
        warnings.push(this.getFieldWarningMessage(field));
      }
    }

    // Спеціальні бізнес-правила
    this.validatePhoneNumber(client.phone, errors, warnings);
    this.validateEmailAddress(client.email, errors, warnings);
    this.validateCommunicationChannels(client.communicationChannels, errors, warnings);

    const isValid = errors.length === 0;
    const canProceed = isValid; // Можна розширити логіку

    return {
      isValid,
      errors,
      warnings,
      canProceed,
    };
  }

  /**
   * Перевірка чи клієнт валідний для замовлення
   */
  static isValidForOrder(client: ClientSearchResult | null): boolean {
    if (!client) {
      return false;
    }

    const validation = this.validateClientForOrder(client);
    return validation.canProceed;
  }

  /**
   * Перевірка чи можна перейти до наступного кроку
   */
  static canProceedToNextStep(client: ClientSearchResult | null): boolean {
    return this.isValidForOrder(client);
  }

  /**
   * Отримання списку відсутніх обов'язкових полів
   */
  static getMissingRequiredFields(client: ClientSearchResult): string[] {
    const missing: string[] = [];

    for (const field of this.REQUIRED_FIELDS) {
      const value = client[field];
      if (!value || (typeof value === 'string' && !value.trim())) {
        missing.push(field);
      }
    }

    return missing;
  }

  /**
   * Отримання списку відсутніх рекомендованих полів
   */
  static getMissingRecommendedFields(client: ClientSearchResult): string[] {
    const missing: string[] = [];

    for (const field of this.RECOMMENDED_FIELDS) {
      const value = client[field];
      if (
        !value ||
        (typeof value === 'string' && !value.trim()) ||
        (Array.isArray(value) && value.length === 0)
      ) {
        missing.push(field);
      }
    }

    return missing;
  }

  /**
   * Форматування клієнта для відображення в wizard
   */
  static formatClientForDisplay(client: ClientSearchResult): {
    displayName: string;
    subtitle: string;
    details: Array<{ label: string; value: string }>;
    completeness: number;
  } {
    const displayName = client.fullName || `${client.firstName} ${client.lastName}`.trim();
    const subtitle = client.phone;

    const details = [
      { label: 'Телефон', value: client.phone },
      { label: 'Email', value: client.email || 'Не вказано' },
      { label: 'Адреса', value: client.address || 'Не вказана' },
      { label: 'Замовлень', value: client.orderCount?.toString() || '0' },
    ];

    // Обчислення повноти профілю
    const totalFields = this.REQUIRED_FIELDS.length + this.RECOMMENDED_FIELDS.length;
    const filledFields = [...this.REQUIRED_FIELDS, ...this.RECOMMENDED_FIELDS].filter((field) => {
      const value = client[field];
      return (
        value &&
        (typeof value !== 'string' || value.trim()) &&
        (!Array.isArray(value) || value.length > 0)
      );
    }).length;

    const completeness = Math.round((filledFields / totalFields) * 100);

    return {
      displayName,
      subtitle,
      details,
      completeness,
    };
  }

  /**
   * Валідація номера телефону
   */
  private static validatePhoneNumber(phone: string, errors: string[], warnings: string[]): void {
    if (!phone) return;

    // Базова перевірка формату українського номера
    const phoneRegex = /^\+380\d{9}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      warnings.push('Номер телефону може мати неправильний формат');
    }
  }

  /**
   * Валідація email адреси
   */
  private static validateEmailAddress(
    email: string | undefined,
    errors: string[],
    warnings: string[]
  ): void {
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      warnings.push('Email адреса має неправильний формат');
    }
  }

  /**
   * Валідація каналів комунікації
   */
  private static validateCommunicationChannels(
    channels: Array<'PHONE' | 'SMS' | 'VIBER'> | undefined,
    errors: string[],
    warnings: string[]
  ): void {
    if (!channels || channels.length === 0) {
      warnings.push('Не вказані канали комунікації');
      return;
    }

    // Перевірка чи є хоча б один основний канал
    const hasMainChannel = channels.includes('PHONE') || channels.includes('SMS');
    if (!hasMainChannel) {
      warnings.push('Рекомендується вказати телефон або SMS як канал комунікації');
    }
  }

  /**
   * Отримання повідомлення про помилку поля
   */
  private static getFieldErrorMessage(field: keyof ClientSearchResult): string {
    const messages: Record<string, string> = {
      firstName: "Ім'я є обов'язковим",
      lastName: "Прізвище є обов'язковим",
      phone: "Номер телефону є обов'язковим",
    };

    return messages[field] || `Поле ${field} є обов'язковим`;
  }

  /**
   * Отримання повідомлення про попередження поля
   */
  private static getFieldWarningMessage(field: keyof ClientSearchResult): string {
    const messages: Record<string, string> = {
      email: "Рекомендується вказати email для зв'язку",
      address: 'Рекомендується вказати адресу для доставки',
      communicationChannels: 'Рекомендується вказати канали комунікації',
    };

    return messages[field] || `Рекомендується заповнити поле ${field}`;
  }
}
