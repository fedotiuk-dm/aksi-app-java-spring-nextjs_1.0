/**
 * @fileoverview Спрощений сервіс для трансформації даних клієнтів (поточна реалізація)
 * @module domain/wizard/services/stage-1/client-management/services
 */

import { ContactMethod, InformationSource } from '../types/client-domain.types';

import type { OperationResult } from '../interfaces/client-management.interfaces';
import type { ClientData, ClientSearchResult } from '../types/client-domain.types';

/**
 * Спрощений сервіс для трансформації даних клієнтів
 * Поки що без складних трансформацій між wizard та доменними типами
 */
export class ClientTransformationSimpleService {
  private readonly UNKNOWN_ERROR = 'Невідома помилка';

  /**
   * Створення повного імені клієнта
   */
  createFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
  }

  /**
   * Форматування телефону для відображення
   */
  formatPhoneForDisplay(phone: string): string {
    if (!phone) return '';

    // Прибираємо всі нецифрові символи
    const cleanPhone = phone.replace(/\D/g, '');

    // Форматуємо згідно з українським стандартом
    if (cleanPhone.startsWith('380')) {
      return `+${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 5)} ${cleanPhone.slice(5, 8)} ${cleanPhone.slice(8, 10)} ${cleanPhone.slice(10)}`;
    } else if (cleanPhone.startsWith('0')) {
      return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 8)} ${cleanPhone.slice(8)}`;
    }

    return phone; // Повертаємо як є, якщо не вдалося розпізнати формат
  }

  /**
   * Нормалізація номера телефону для зберігання
   */
  normalizePhoneForStorage(phone: string): OperationResult<string> {
    try {
      if (!phone) {
        return {
          success: false,
          error: 'Телефон не може бути порожнім',
        };
      }

      const cleanPhone = phone.replace(/\D/g, '');

      if (cleanPhone.length < 10) {
        return {
          success: false,
          error: 'Телефон занадто короткий',
        };
      }

      // Додаємо код країни, якщо його немає
      if (cleanPhone.startsWith('0')) {
        return {
          success: true,
          data: `+38${cleanPhone}`,
        };
      } else if (cleanPhone.startsWith('380')) {
        return {
          success: true,
          data: `+${cleanPhone}`,
        };
      }

      return {
        success: true,
        data: `+${cleanPhone}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Перетворення способів зв'язку для відображення
   */
  formatContactMethodsForDisplay(methods: ContactMethod[]): string[] {
    return methods.map((method) => {
      switch (method) {
        case ContactMethod.PHONE:
          return 'Номер телефону';
        case ContactMethod.SMS:
          return 'SMS';
        case ContactMethod.VIBER:
          return 'Viber';
        default:
          return 'Невідомий';
      }
    });
  }

  /**
   * Перетворення джерела інформації для відображення
   */
  formatInformationSourceForDisplay(source: InformationSource, sourceDetails?: string): string {
    switch (source) {
      case InformationSource.INSTAGRAM:
        return 'Інстаграм';
      case InformationSource.GOOGLE:
        return 'Google';
      case InformationSource.RECOMMENDATIONS:
        return 'Рекомендації';
      case InformationSource.OTHER:
        return sourceDetails ? `Інше: ${sourceDetails}` : 'Інше';
      default:
        return 'Невідоме джерело';
    }
  }

  /**
   * Валідація та очищення даних клієнта перед відправкою
   */
  sanitizeClientData(clientData: Partial<ClientData>): OperationResult<Partial<ClientData>> {
    try {
      const sanitized: Partial<ClientData> = {
        ...clientData,
        firstName: clientData.firstName?.trim(),
        lastName: clientData.lastName?.trim(),
        phone: clientData.phone?.trim(),
        email: clientData.email?.trim() || undefined,
        address: clientData.address?.trim() || undefined,
        informationSourceOther: clientData.informationSourceOther?.trim() || undefined,
      };

      // Видаляємо порожні поля
      Object.keys(sanitized).forEach((key) => {
        const value = sanitized[key as keyof ClientData];
        if (value === '' || value === null) {
          delete sanitized[key as keyof ClientData];
        }
      });

      return {
        success: true,
        data: sanitized,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Створення короткого опису клієнта для списку
   */
  createClientSummary(client: ClientSearchResult): string {
    const parts = [client.fullName || `${client.firstName} ${client.lastName}`, client.phone];

    if (client.email) {
      parts.push(client.email);
    }

    return parts.join(' • ');
  }

  /**
   * Перевірка чи клієнт має всі необхідні дані
   */
  validateClientCompleteness(client: Partial<ClientData>): OperationResult<{
    isComplete: boolean;
    missingFields: string[];
  }> {
    try {
      const missingFields: string[] = [];

      if (!client.firstName?.trim()) {
        missingFields.push("Ім'я");
      }
      if (!client.lastName?.trim()) {
        missingFields.push('Прізвище');
      }
      if (!client.phone?.trim()) {
        missingFields.push('Телефон');
      }
      if (!client.contactMethods || client.contactMethods.length === 0) {
        missingFields.push("Способи зв'язку");
      }

      return {
        success: true,
        data: {
          isComplete: missingFields.length === 0,
          missingFields,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const clientTransformationSimpleService = new ClientTransformationSimpleService();
