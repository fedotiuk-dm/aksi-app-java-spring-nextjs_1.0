import { ClientsService, ClientResponse } from '@/lib/api';

import { ClientEntity } from '../entities';
import { IClientRepository } from './client-repository.interface';
import {
  CreateClientFormData,
  UpdateClientFormData,
  ClientSearchParams,
  ClientSearchResult,
} from '../types';
import { ClientAdapter } from '../utils';

/**
 * Репозиторій для роботи з клієнтами
 * Реалізує Repository Pattern та використовує Adapter Pattern для перетворення типів
 * Відповідає принципу Dependency Inversion - залежить від абстракцій (інтерфейсів), а не конкретних реалізацій
 */
export class ClientRepository implements IClientRepository {
  private readonly ERROR_PREFIX = 'Помилка';
  private readonly UNKNOWN_ERROR = 'Невідома помилка';

  /**
   * Отримує клієнта за ID
   */
  async getById(id: string): Promise<ClientEntity> {
    try {
      const response = await ClientsService.getClientById({
        id: id,
      });
      // Використовуємо адаптер для перетворення API response у доменну сутність
      return ClientAdapter.toDomainEntity(response);
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} отримання клієнта: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Пошук клієнтів за параметрами
   */
  async search(params: ClientSearchParams): Promise<ClientSearchResult> {
    try {
      const response = await ClientsService.searchClientsWithPagination({
        requestBody: {
          query: params.keyword || '',
          page: params.page || 0,
          size: params.size || 20,
        },
      });

      return {
        content: ClientAdapter.toDomainClients(response.content || []),
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0,
        number: response.pageNumber || 0,
        size: response.pageSize || 20,
        first: !response.hasPrevious,
        last: !response.hasNext,
        empty: (response.content?.length || 0) === 0,
      };
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} пошуку клієнтів: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Створює нового клієнта
   */
  async create(data: CreateClientFormData): Promise<ClientResponse> {
    try {
      // Використовуємо ClientAdapter для перетворення form data в API request
      const requestData = ClientAdapter.toCreateRequest(data);
      return await ClientsService.createClient({
        requestBody: requestData,
      });
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} створення клієнта: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Оновлює існуючого клієнта
   */
  async update(data: UpdateClientFormData): Promise<ClientResponse> {
    try {
      // Логування вхідних даних
      console.log('🔥 ClientRepository.update() - вхідні дані:', {
        data,
        structuredAddress: data.structuredAddress,
        allKeys: Object.keys(data),
      });

      // Використовуємо ClientAdapter для перетворення form data в API request
      const requestData = ClientAdapter.toUpdateRequest(data);

      // Логування перетворених даних
      console.log('🔥 ClientRepository.update() - дані для API:', {
        requestData,
        structuredAddress: requestData.structuredAddress,
        allKeys: Object.keys(requestData),
        stringifiedData: JSON.stringify(requestData, null, 2),
      });

      const result = await ClientsService.updateClient({
        id: data.id,
        requestBody: requestData,
      });

      console.log('🔥 ClientRepository.update() - результат від API:', result);

      return result;
    } catch (error) {
      console.error('🔥 ClientRepository.update() - помилка:', error);
      throw new Error(
        `${this.ERROR_PREFIX} оновлення клієнта: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Видаляє клієнта
   */
  async delete(id: string): Promise<void> {
    try {
      await ClientsService.deleteClient({ id });
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} видалення клієнта: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Отримує всіх клієнтів
   * Використовує адаптер для перетворення масиву відповідей
   */
  async getAll(): Promise<ClientEntity[]> {
    try {
      const response = await ClientsService.getAllClients({});
      // getAllClients повертає ClientResponse, але ми очікуємо масив
      // Можливо, потрібно використати пагінацію
      if (Array.isArray(response)) {
        return ClientAdapter.toDomainEntities(response);
      } else {
        // Якщо це один клієнт, повертаємо масив з одного елемента
        return [ClientAdapter.toDomainEntity(response)];
      }
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} отримання клієнтів: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }
}
