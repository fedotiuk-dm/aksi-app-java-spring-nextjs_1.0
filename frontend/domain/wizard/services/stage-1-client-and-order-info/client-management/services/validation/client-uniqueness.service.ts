/**
 * @fileoverview Сервіс перевірки унікальності даних клієнта
 * @module domain/wizard/services/stage-1/client-management/services/validation
 */

import { searchClientsWithPagination } from '@/domain/wizard/adapters/client/api/client.api';

import type { OperationResult } from '../../interfaces/client-management.interfaces';

/**
 * Сервіс для перевірки унікальності даних клієнта
 */
export class ClientUniquenessService {
  /**
   * Перевірка унікальності телефону
   * @param phone Телефон для перевірки
   * @param currentClientId ID поточного клієнта (якщо редагуємо)
   */
  static async checkPhoneUniqueness(
    phone: string,
    currentClientId?: string
  ): Promise<OperationResult<boolean>> {
    try {
      if (!phone) {
        return { 
          success: false,
          error: 'Телефон не вказано для перевірки унікальності'
        };
      }

      // Шукаємо клієнтів з таким телефоном
      const result = await searchClientsWithPagination({ 
        query: phone, 
        page: 0, 
        size: 1 
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Помилка при перевірці унікальності телефону'
        };
      }

      // Перевіряємо, чи знайдено клієнтів з таким телефоном
      const clients = result.data?.clients || [];
      
      // Фільтруємо, виключаючи поточного клієнта, якщо він вказаний
      const existingClients = clients.filter(client => 
        client.phone === phone && 
        (!currentClientId || client.id !== currentClientId)
      );

      if (existingClients.length > 0) {
        return {
          success: true,
          data: false,
          warnings: ['Клієнт з таким телефоном вже існує']
        };
      }

      return {
        success: true,
        data: true
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Помилка при перевірці унікальності телефону: ${errorMessage}`
      };
    }
  }

  /**
   * Перевірка унікальності email
   * @param email Email для перевірки
   * @param currentClientId ID поточного клієнта (якщо редагуємо)
   */
  static async checkEmailUniqueness(
    email: string,
    currentClientId?: string
  ): Promise<OperationResult<boolean>> {
    try {
      if (!email) {
        // Email не обов'язковий, тому повертаємо успіх
        return { 
          success: true,
          data: true
        };
      }

      // Шукаємо клієнтів з таким email
      const result = await searchClientsWithPagination({ 
        query: email, 
        page: 0, 
        size: 1 
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Помилка при перевірці унікальності email'
        };
      }

      // Перевіряємо, чи знайдено клієнтів з таким email
      const clients = result.data?.clients || [];
      
      // Фільтруємо, виключаючи поточного клієнта, якщо він вказаний
      const existingClients = clients.filter(client => 
        client.email === email && 
        (!currentClientId || client.id !== currentClientId)
      );

      if (existingClients.length > 0) {
        return {
          success: true,
          data: false,
          warnings: ['Клієнт з таким email вже існує']
        };
      }

      return {
        success: true,
        data: true
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Помилка при перевірці унікальності email: ${errorMessage}`
      };
    }
  }

  /**
   * Комплексна перевірка унікальності даних клієнта
   * @param phone Телефон для перевірки
   * @param email Email для перевірки (опційний)
   * @param currentClientId ID поточного клієнта (якщо редагуємо)
   */
  static async checkClientDataUniqueness(
    phone: string,
    email?: string,
    currentClientId?: string
  ): Promise<OperationResult<boolean>> {
    try {
      // Перевірка унікальності телефону
      const phoneResult = await this.checkPhoneUniqueness(phone, currentClientId);
      if (!phoneResult.success) {
        return phoneResult;
      }
      
      if (phoneResult.data === false) {
        return {
          success: true, 
          data: false,
          warnings: phoneResult.warnings
        };
      }

      // Перевірка унікальності email якщо він є
      if (email) {
        const emailResult = await this.checkEmailUniqueness(email, currentClientId);
        if (!emailResult.success) {
          return emailResult;
        }
        
        if (emailResult.data === false) {
          return {
            success: true, 
            data: false,
            warnings: emailResult.warnings
          };
        }
      }

      // Якщо все унікальне
      return {
        success: true,
        data: true
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Помилка при комплексній перевірці унікальності даних клієнта: ${errorMessage}`
      };
    }
  }
}
