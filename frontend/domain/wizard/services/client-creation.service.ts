/**
 * @fileoverview Доменний сервіс створення клієнтів
 * @module domain/wizard/services
 */

import { ClientAdapter } from '../adapters';
import { ClientSearchService } from './client-search.service';

import type { ClientSearchResult } from '../types';

/**
 * Дані для створення нового клієнта
 */
export interface CreateClientData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: string;
  communicationChannels?: Array<'PHONE' | 'SMS' | 'VIBER'>;
  source?: 'INSTAGRAM' | 'GOOGLE' | 'RECOMMENDATION' | 'OTHER';
  sourceDetails?: string;
}

/**
 * Результат перевірки дублікатів
 */
export interface DuplicateCheckResult {
  hasDuplicates: boolean;
  duplicatesByPhone: ClientSearchResult[];
  duplicatesByEmail: ClientSearchResult[];
  duplicatesByFullName: ClientSearchResult[];
  recommendedAction: 'create' | 'merge' | 'review';
}

/**
 * Результат створення клієнта
 */
export interface ClientCreationResult {
  success: boolean;
  client?: ClientSearchResult;
  duplicateCheck?: DuplicateCheckResult;
  error?: string;
  warnings?: string[];
}

/**
 * Доменний сервіс для створення клієнтів
 *
 * Відповідальність:
 * - Бізнес-логіка створення клієнтів
 * - Перевірка дублікатів
 * - Нормалізація даних клієнта
 * - Бізнес-правила для нових клієнтів
 *
 * НЕ відповідає за:
 * - Валідацію форм (робить Zod в хуках)
 * - React стан (робить хук)
 * - API виклики (робить адаптер)
 */
export class ClientCreationService {
  private static readonly DEFAULT_COMMUNICATION_CHANNELS: Array<'PHONE' | 'SMS' | 'VIBER'> = [
    'PHONE',
  ];
  private static readonly DUPLICATE_THRESHOLD_SCORE = 0.8;

  /**
   * Створення нового клієнта з перевіркою дублікатів
   */
  static async createClient(data: CreateClientData): Promise<ClientCreationResult> {
    try {
      // Нормалізація даних
      const normalizedData = this.normalizeClientData(data);

      // Перевірка дублікатів
      const duplicateCheck = await this.checkForDuplicates(normalizedData);

      // Якщо знайдені дублікати, повертаємо результат для розгляду
      if (duplicateCheck.hasDuplicates && duplicateCheck.recommendedAction !== 'create') {
        return {
          success: false,
          duplicateCheck,
          warnings: ['Знайдені можливі дублікати. Перевірте існуючих клієнтів.'],
        };
      }

      // Створення клієнта через адаптер
      const client = await ClientAdapter.createClient(normalizedData);

      return {
        success: true,
        client,
        duplicateCheck,
        warnings: duplicateCheck.hasDuplicates
          ? ['Створено незважаючи на можливі дублікати']
          : undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Помилка створення клієнта',
      };
    }
  }

  /**
   * Перевірка дублікатів за телефоном
   */
  static async checkDuplicatePhone(phone: string): Promise<ClientSearchResult[]> {
    if (!phone.trim()) {
      return [];
    }

    const normalizedPhone = this.normalizePhone(phone);

    try {
      const results = await ClientSearchService.quickSearch(normalizedPhone, 10);
      return results.filter((client) => this.normalizePhone(client.phone) === normalizedPhone);
    } catch (error) {
      console.warn('Помилка перевірки дублікатів за телефоном:', error);
      return [];
    }
  }

  /**
   * Перевірка дублікатів за email
   */
  static async checkDuplicateEmail(email: string): Promise<ClientSearchResult[]> {
    if (!email.trim()) {
      return [];
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      const results = await ClientSearchService.quickSearch(normalizedEmail, 10);
      return results.filter((client) => client.email?.toLowerCase().trim() === normalizedEmail);
    } catch (error) {
      console.warn('Помилка перевірки дублікатів за email:', error);
      return [];
    }
  }

  /**
   * Перевірка дублікатів за повним ім'ям
   */
  static async checkDuplicateFullName(
    firstName: string,
    lastName: string
  ): Promise<ClientSearchResult[]> {
    if (!firstName.trim() || !lastName.trim()) {
      return [];
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    try {
      const results = await ClientSearchService.quickSearch(fullName, 10);
      return results.filter((client) => {
        const clientFullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        return clientFullName === fullName.toLowerCase();
      });
    } catch (error) {
      console.warn("Помилка перевірки дублікатів за ім'ям:", error);
      return [];
    }
  }

  /**
   * Комплексна перевірка дублікатів
   */
  static async checkForDuplicates(data: CreateClientData): Promise<DuplicateCheckResult> {
    const [duplicatesByPhone, duplicatesByEmail, duplicatesByFullName] = await Promise.all([
      this.checkDuplicatePhone(data.phone),
      data.email ? this.checkDuplicateEmail(data.email) : Promise.resolve([]),
      this.checkDuplicateFullName(data.firstName, data.lastName),
    ]);

    const hasDuplicates =
      duplicatesByPhone.length > 0 ||
      duplicatesByEmail.length > 0 ||
      duplicatesByFullName.length > 0;

    const recommendedAction = this.determineRecommendedAction(
      duplicatesByPhone,
      duplicatesByEmail,
      duplicatesByFullName
    );

    return {
      hasDuplicates,
      duplicatesByPhone,
      duplicatesByEmail,
      duplicatesByFullName,
      recommendedAction,
    };
  }

  /**
   * Нормалізація даних клієнта
   */
  private static normalizeClientData(data: CreateClientData): CreateClientData {
    return {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: this.normalizePhone(data.phone),
      email: data.email?.toLowerCase().trim() || undefined,
      address: data.address?.trim() || undefined,
      communicationChannels: data.communicationChannels?.length
        ? data.communicationChannels
        : this.DEFAULT_COMMUNICATION_CHANNELS,
      source: data.source,
      sourceDetails: data.sourceDetails?.trim() || undefined,
    };
  }

  /**
   * Нормалізація номера телефону
   */
  private static normalizePhone(phone: string): string {
    // Видаляємо всі символи крім цифр та +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Якщо номер починається з 0, замінюємо на +380
    if (cleaned.startsWith('0')) {
      return '+38' + cleaned;
    }

    // Якщо номер починається з 380, додаємо +
    if (cleaned.startsWith('380')) {
      return '+' + cleaned;
    }

    // Якщо номер вже має +, залишаємо як є
    if (cleaned.startsWith('+')) {
      return cleaned;
    }

    // Інакше додаємо +380
    return '+380' + cleaned;
  }

  /**
   * Визначення рекомендованої дії на основі дублікатів
   */
  private static determineRecommendedAction(
    phoneMatches: ClientSearchResult[],
    emailMatches: ClientSearchResult[],
    nameMatches: ClientSearchResult[]
  ): 'create' | 'merge' | 'review' {
    // Якщо є точний збіг за телефоном - потрібен розгляд
    if (phoneMatches.length > 0) {
      return 'review';
    }

    // Якщо є точний збіг за email - потрібен розгляд
    if (emailMatches.length > 0) {
      return 'review';
    }

    // Якщо є збіг за ім'ям - можна створювати, але з попередженням
    if (nameMatches.length > 0) {
      return 'create';
    }

    // Немає дублікатів - можна створювати
    return 'create';
  }

  /**
   * Перевірка чи можна автоматично створити клієнта
   */
  static canAutoCreate(duplicateCheck: DuplicateCheckResult): boolean {
    return duplicateCheck.recommendedAction === 'create';
  }

  /**
   * Отримання повідомлення про дублікати для користувача
   */
  static getDuplicateMessage(duplicateCheck: DuplicateCheckResult): string {
    if (!duplicateCheck.hasDuplicates) {
      return '';
    }

    const messages: string[] = [];

    if (duplicateCheck.duplicatesByPhone.length > 0) {
      messages.push(
        `Знайдено ${duplicateCheck.duplicatesByPhone.length} клієнт(ів) з таким телефоном`
      );
    }

    if (duplicateCheck.duplicatesByEmail.length > 0) {
      messages.push(`Знайдено ${duplicateCheck.duplicatesByEmail.length} клієнт(ів) з таким email`);
    }

    if (duplicateCheck.duplicatesByFullName.length > 0) {
      messages.push(
        `Знайдено ${duplicateCheck.duplicatesByFullName.length} клієнт(ів) з таким ім'ям`
      );
    }

    return messages.join('. ');
  }
}
