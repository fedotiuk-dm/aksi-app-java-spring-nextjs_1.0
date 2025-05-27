/**
 * @fileoverview Сервіс для перевірки унікальності даних клієнтів
 * @module domain/wizard/services/stage-1/client-management/services
 */

import {
  checkPhoneUniqueness,
  checkEmailUniqueness,
} from '@/domain/wizard/adapters/client/api/client.api';

import type { OperationResult } from '../interfaces/client-management.interfaces';

/**
 * Результат перевірки унікальності з деталізацією
 */
export interface UniquenessCheckResult {
  isUnique: boolean;
  conflictingClientId?: string;
  conflictingClientName?: string;
}

/**
 * Сервіс для перевірки унікальності даних клієнтів
 */
export class ClientUniquenessCheckService {
  private readonly UNKNOWN_ERROR = 'Невідома помилка';

  /**
   * Перевірка унікальності телефону
   */
  async checkPhoneUniqueness(
    phone: string,
    excludeClientId?: string
  ): Promise<OperationResult<UniquenessCheckResult>> {
    try {
      if (!phone || phone.trim().length === 0) {
        return {
          success: false,
          error: 'Телефон не може бути порожнім',
        };
      }

      const result = await checkPhoneUniqueness(phone.trim(), excludeClientId);

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Не вдалося перевірити унікальність телефону',
        };
      }

      const uniquenessResult: UniquenessCheckResult = {
        isUnique: result.data === true,
        // TODO: Додати інформацію про конфліктного клієнта, коли API буде підтримувати це
      };

      return {
        success: true,
        data: uniquenessResult,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Перевірка унікальності email
   */
  async checkEmailUniqueness(
    email: string,
    excludeClientId?: string
  ): Promise<OperationResult<UniquenessCheckResult>> {
    try {
      if (!email || email.trim().length === 0) {
        return {
          success: true,
          data: { isUnique: true }, // Порожній email завжди унікальний
        };
      }

      // Базова валідація email формату
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return {
          success: false,
          error: 'Некоректний формат email',
        };
      }

      const result = await checkEmailUniqueness(email.trim(), excludeClientId);

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Не вдалося перевірити унікальність email',
        };
      }

      const uniquenessResult: UniquenessCheckResult = {
        isUnique: result.data === true,
        // TODO: Додати інформацію про конфліктного клієнта, коли API буде підтримувати це
      };

      return {
        success: true,
        data: uniquenessResult,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Комплексна перевірка унікальності всіх полів
   */
  async checkClientDataUniqueness(
    phone: string,
    email?: string,
    excludeClientId?: string
  ): Promise<
    OperationResult<{
      phone: UniquenessCheckResult;
      email?: UniquenessCheckResult;
      hasConflicts: boolean;
    }>
  > {
    try {
      const phoneCheck = await this.checkPhoneUniqueness(phone, excludeClientId);

      if (!phoneCheck.success) {
        return {
          success: false,
          error: phoneCheck.error,
        };
      }

      let emailCheck: OperationResult<UniquenessCheckResult> | undefined;
      if (email && email.trim().length > 0) {
        emailCheck = await this.checkEmailUniqueness(email, excludeClientId);

        if (!emailCheck.success) {
          return {
            success: false,
            error: emailCheck.error,
          };
        }
      }

      const hasConflicts =
        (phoneCheck.data ? !phoneCheck.data.isUnique : true) ||
        (emailCheck?.data ? !emailCheck.data.isUnique : false);

      return {
        success: true,
        data: {
          phone: phoneCheck.data || { isUnique: false },
          email: emailCheck?.data,
          hasConflicts,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Отримання детального повідомлення про конфлікт унікальності
   */
  getUniquenessConflictMessage(
    field: 'phone' | 'email',
    value: string,
    conflictResult: UniquenessCheckResult
  ): string {
    if (conflictResult.isUnique) {
      return `${field === 'phone' ? 'Телефон' : 'Email'} доступний`;
    }

    const fieldLabel = field === 'phone' ? 'Телефон' : 'Email';
    let message = `${fieldLabel} "${value}" вже використовується`;

    if (conflictResult.conflictingClientName) {
      message += ` клієнтом "${conflictResult.conflictingClientName}"`;
    } else {
      message += ' іншим клієнтом';
    }

    return message;
  }

  /**
   * Перевірка формату телефону (основна валідація)
   */
  validatePhoneFormat(phone: string): OperationResult<string> {
    try {
      if (!phone || phone.trim().length === 0) {
        return {
          success: false,
          error: "Телефон обов'язковий",
        };
      }

      const cleanPhone = phone.trim();

      // Базова перевірка довжини
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        return {
          success: false,
          error: 'Телефон повинен містити від 10 до 15 символів',
        };
      }

      // Перевірка формату (дозволяємо +, цифри, дужки, дефіси, пробіли)
      const phoneRegex = /^[\+]?[0-9\(\)\-\s]+$/;
      if (!phoneRegex.test(cleanPhone)) {
        return {
          success: false,
          error: 'Некоректний формат телефону',
        };
      }

      return {
        success: true,
        data: cleanPhone,
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
export const clientUniquenessCheckService = new ClientUniquenessCheckService();
