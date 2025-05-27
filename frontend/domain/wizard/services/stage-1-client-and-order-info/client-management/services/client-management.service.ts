/**
 * @fileoverview Комплексний сервіс управління клієнтами
 * @module domain/wizard/services/stage-1/client-management/services
 */

import { createNewClient } from './client-create.service';
import { searchClients } from './client-search.service';
import { clientTransformationSimpleService } from './client-transformation-simple.service';
import { clientUniquenessCheckService } from './client-uniqueness-check.service';
import { updateExistingClient } from './client-update.service';
import { clientDataSchema } from '../types/client-domain.types';

import type {
  OperationResult,
  IClientManagementService,
} from '../interfaces/client-management.interfaces';
import type {
  ClientData,
  ClientSearchResult,
  ClientSearchPaginatedResult,
} from '../types/client-domain.types';
import type { ZodIssue } from 'zod';

/**
 * Комплексний сервіс управління клієнтами
 * Об'єднує всі операції з клієнтами в єдиному інтерфейсі
 */
export class ClientManagementService implements IClientManagementService {
  private readonly UNKNOWN_ERROR = 'Невідома помилка';

  /**
   * Пошук клієнтів за параметрами
   */
  async searchClients(params: {
    query: string;
    page?: number;
    pageSize?: number;
  }): Promise<OperationResult<ClientSearchPaginatedResult>> {
    try {
      const { query, page = 0, pageSize = 20 } = params;

      const result = await searchClients(query, page, pageSize);

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Помилка при пошуку клієнтів',
        };
      }

      // Перетворюємо результат у формат з пагінацією
      const paginatedResult: ClientSearchPaginatedResult = {
        clients: result.data || [],
        totalElements: result.data?.length || 0,
        totalPages: Math.ceil((result.data?.length || 0) / pageSize),
        pageNumber: page,
        pageSize,
        hasPrevious: page > 0,
        hasNext: (page + 1) * pageSize < (result.data?.length || 0),
      };

      return {
        success: true,
        data: paginatedResult,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Отримання клієнта за ID
   */
  async getClientById(id: string): Promise<OperationResult<ClientSearchResult>> {
    try {
      // TODO: Реалізувати через адаптер getClientById
      // Поки що використовуємо пошук
      const searchResult = await searchClients(id, 0, 1);

      if (!searchResult.success || !searchResult.data || searchResult.data.length === 0) {
        return {
          success: false,
          error: 'Клієнта не знайдено',
        };
      }

      const client = searchResult.data.find((c) => c.id === id);

      if (!client) {
        return {
          success: false,
          error: 'Клієнта не знайдено',
        };
      }

      return {
        success: true,
        data: client,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Створення нового клієнта
   */
  async createClient(clientData: ClientData): Promise<OperationResult<ClientSearchResult>> {
    try {
      // Валідація даних через Zod схему
      const validation = clientDataSchema.safeParse(clientData);

      if (!validation.success) {
        const firstError = validation.error.issues[0];
        return {
          success: false,
          error: firstError.message,
          warnings: validation.error.issues.slice(1).map((issue) => issue.message),
        };
      }

      // Створення клієнта з валідованими даними
      return await createNewClient(validation.data);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Оновлення існуючого клієнта
   */
  async updateClient(
    id: string,
    clientData: Partial<ClientData>
  ): Promise<OperationResult<ClientSearchResult>> {
    try {
      // Спрощена валідація для оновлення - перевіряємо тільки надані поля
      if (clientData.phone && clientData.phone.trim().length < 10) {
        return {
          success: false,
          error: 'Телефон повинен містити мінімум 10 символів',
        };
      }

      if (clientData.email && clientData.email.trim().length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clientData.email)) {
          return {
            success: false,
            error: 'Некоректний формат email',
          };
        }
      }

      // Оновлення клієнта
      return await updateExistingClient(id, clientData);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Валідація даних клієнта через Zod схему
   */
  validateClientData(clientData: Partial<ClientData>): OperationResult<ClientData> {
    const validation = clientDataSchema.safeParse(clientData);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return {
        success: false,
        error: firstError.message,
        warnings: validation.error.issues.slice(1).map((issue: ZodIssue) => issue.message),
      };
    }

    return {
      success: true,
      data: validation.data,
    };
  }

  /**
   * Перевірка унікальності телефону
   */
  async checkPhoneUniqueness(
    phone: string,
    excludeClientId?: string
  ): Promise<OperationResult<boolean>> {
    const result = await clientUniquenessCheckService.checkPhoneUniqueness(phone, excludeClientId);
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }
    return {
      success: true,
      data: result.data ? result.data.isUnique : false,
    };
  }

  /**
   * Перевірка унікальності email
   */
  async checkEmailUniqueness(
    email: string,
    excludeClientId?: string
  ): Promise<OperationResult<boolean>> {
    const result = await clientUniquenessCheckService.checkEmailUniqueness(email, excludeClientId);
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }
    return {
      success: true,
      data: result.data ? result.data.isUnique : false,
    };
  }

  /**
   * Форматування телефону для відображення
   */
  formatPhoneForDisplay(phone: string): string {
    return clientTransformationSimpleService.formatPhoneForDisplay(phone);
  }

  /**
   * Створення повного імені клієнта
   */
  createFullName(firstName: string, lastName: string): string {
    return clientTransformationSimpleService.createFullName(firstName, lastName);
  }

  /**
   * Створення короткого опису клієнта
   */
  createClientSummary(client: ClientSearchResult): string {
    return clientTransformationSimpleService.createClientSummary(client);
  }
}

// Експорт екземпляра сервісу (Singleton)
export const clientManagementService = new ClientManagementService();
