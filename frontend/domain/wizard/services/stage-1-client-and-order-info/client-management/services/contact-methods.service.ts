/**
 * @fileoverview Сервіс для роботи з способами зв'язку клієнтів
 * @module domain/wizard/services/stage-1/client-management/services
 */

import { ContactMethod } from '../types/client-domain.types';

import type { OperationResult } from '../interfaces/client-management.interfaces';

/**
 * Сервіс для управління способами зв'язку
 */
export class ContactMethodsService {
  private readonly UNKNOWN_ERROR = 'Невідома помилка';

  /**
   * Отримання всіх доступних способів зв'язку
   */
  getAvailableContactMethods(): OperationResult<Array<{ value: ContactMethod; label: string }>> {
    try {
      const methods = [
        { value: ContactMethod.PHONE, label: 'Номер телефону' },
        { value: ContactMethod.SMS, label: 'SMS' },
        { value: ContactMethod.VIBER, label: 'Viber' },
      ];

      return {
        success: true,
        data: methods,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Валідація вибраних способів зв'язку
   */
  validateContactMethods(methods: ContactMethod[]): OperationResult<ContactMethod[]> {
    try {
      if (!methods || methods.length === 0) {
        return {
          success: false,
          error: "Необхідно вибрати хоча б один спосіб зв'язку",
        };
      }

      // Перевіряємо, що всі методи валідні
      const validMethods = Object.values(ContactMethod);
      const invalidMethods = methods.filter((method) => !validMethods.includes(method));

      if (invalidMethods.length > 0) {
        return {
          success: false,
          error: `Неправильні способи зв'язку: ${invalidMethods.join(', ')}`,
        };
      }

      // Видаляємо дублікати
      const uniqueMethods = Array.from(new Set(methods));

      return {
        success: true,
        data: uniqueMethods,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Перетворення способів зв'язку для API
   */
  transformContactMethodsForAPI(
    methods: ContactMethod[]
  ): OperationResult<Array<'PHONE' | 'SMS' | 'VIBER'>> {
    try {
      const apiMethods: Array<'PHONE' | 'SMS' | 'VIBER'> = methods.map((method) => {
        switch (method) {
          case ContactMethod.PHONE:
            return 'PHONE';
          case ContactMethod.SMS:
            return 'SMS';
          case ContactMethod.VIBER:
            return 'VIBER';
          default:
            throw new Error(`Непідтримуваний спосіб зв'язку: ${method}`);
        }
      });

      return {
        success: true,
        data: apiMethods,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Перетворення способів зв'язку з API
   */
  transformContactMethodsFromAPI(
    apiMethods: Array<'PHONE' | 'SMS' | 'VIBER'>
  ): OperationResult<ContactMethod[]> {
    try {
      const domainMethods: ContactMethod[] = apiMethods.map((method) => {
        switch (method) {
          case 'PHONE':
            return ContactMethod.PHONE;
          case 'SMS':
            return ContactMethod.SMS;
          case 'VIBER':
            return ContactMethod.VIBER;
          default:
            throw new Error(`Непідтримуваний API спосіб зв'язку: ${method}`);
        }
      });

      return {
        success: true,
        data: domainMethods,
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
export const contactMethodsService = new ContactMethodsService();
