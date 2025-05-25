/**
 * @fileoverview Адаптер API операцій з клієнтами
 * @module domain/wizard/adapters/client-adapters
 */

import { ClientsService } from '@/lib/api';

import { ClientMappingAdapter } from './mapping.adapter';

import type { ClientSearchResult } from '../../types';
import type { ClientSearchRequest } from '@/lib/api';

/**
 * Адаптер для прямих API операцій з клієнтами
 *
 * Відповідальність:
 * - Виклики lib/api сервісів
 * - Інтеграція з ClientMappingAdapter
 * - Обробка API помилок
 */
export class ClientApiOperationsAdapter {
  /**
   * Пошук клієнтів з пагінацією через API
   */
  static async searchWithPagination(params: {
    query: string;
    page?: number;
    size?: number;
  }): Promise<{
    items: ClientSearchResult[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    try {
      const searchRequest: ClientSearchRequest = {
        query: params.query,
        page: params.page || 0,
        size: params.size || 10,
      };

      const apiResponse = await ClientsService.searchClientsWithPagination({
        requestBody: searchRequest,
      });

      return ClientMappingAdapter.toDomainPage(apiResponse);
    } catch (error) {
      console.error('Помилка при пошуку клієнтів з пагінацією:', error);
      throw new Error(`Не вдалося знайти клієнтів: ${error}`);
    }
  }

  /**
   * Створення нового клієнта через API
   */
  static async createClient(domainData: Partial<ClientSearchResult>): Promise<ClientSearchResult> {
    try {
      const createRequest = ClientMappingAdapter.toCreateRequest(domainData);
      const apiResponse = await ClientsService.createClient({
        requestBody: createRequest,
      });

      return ClientMappingAdapter.toDomain(apiResponse);
    } catch (error) {
      console.error('Помилка при створенні клієнта:', error);
      throw new Error(`Не вдалося створити клієнта: ${error}`);
    }
  }

  /**
   * Отримання клієнта за ID через API
   */
  static async getById(id: string): Promise<ClientSearchResult> {
    try {
      const apiResponse = await ClientsService.getClientById({ id });
      return ClientMappingAdapter.toDomain(apiResponse);
    } catch (error) {
      console.error(`Помилка при отриманні клієнта ${id}:`, error);
      throw new Error(`Не вдалося отримати клієнта: ${error}`);
    }
  }

  /**
   * Оновлення існуючого клієнта через API
   */
  static async updateClient(
    id: string,
    domainData: Partial<ClientSearchResult>
  ): Promise<ClientSearchResult> {
    try {
      const updateRequest = ClientMappingAdapter.toUpdateRequest(domainData);
      const apiResponse = await ClientsService.updateClient({
        id,
        requestBody: updateRequest,
      });

      return ClientMappingAdapter.toDomain(apiResponse);
    } catch (error) {
      console.error(`Помилка при оновленні клієнта ${id}:`, error);
      throw new Error(`Не вдалося оновити клієнта: ${error}`);
    }
  }

  /**
   * Видалення клієнта через API
   */
  static async deleteClient(id: string): Promise<void> {
    try {
      await ClientsService.deleteClient({ id });
    } catch (error) {
      console.error(`Помилка при видаленні клієнта ${id}:`, error);
      throw new Error(`Не вдалося видалити клієнта: ${error}`);
    }
  }

  /**
   * Отримання всіх клієнтів з пагінацією через API
   * Примітка: API метод getAllClients повертає ClientResponse, а не масив
   */
  static async getAllClients(params: { page?: number; size?: number }): Promise<{
    items: ClientSearchResult[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    try {
      const apiResponse = await ClientsService.getAllClients({
        page: params.page || 0,
        size: params.size || 20,
      });

      // API повертає ClientResponse, а не масив або пагіновану відповідь
      // Тому створюємо структуру пагінації вручну
      const client = ClientMappingAdapter.toDomain(apiResponse);

      return {
        items: [client],
        totalElements: 1,
        totalPages: 1,
        currentPage: params.page || 0,
        pageSize: params.size || 20,
        hasNext: false,
        hasPrevious: false,
      };
    } catch (error) {
      console.error('Помилка при отриманні всіх клієнтів:', error);
      throw new Error(`Не вдалося отримати клієнтів: ${error}`);
    }
  }

  /**
   * Простий пошук клієнтів (deprecated, але може бути корисним)
   * @deprecated Використовуйте searchWithPagination замість цього
   */
  static async searchClients(keyword: string): Promise<ClientSearchResult[]> {
    try {
      const apiResponse = await ClientsService.searchClients({ keyword });

      // API повертає ClientResponse, а не масив
      const client = ClientMappingAdapter.toDomain(apiResponse);

      return [client];
    } catch (error) {
      console.error(`Помилка при пошуку клієнтів за ключовим словом "${keyword}":`, error);
      throw new Error(`Не вдалося знайти клієнтів: ${error}`);
    }
  }

  // === УТИЛІТАРНІ МЕТОДИ ===

  /**
   * Перевірка існування клієнта
   */
  static async clientExists(id: string): Promise<boolean> {
    try {
      await this.getById(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Валідація даних клієнта перед створенням/оновленням
   */
  static validateClientData(clientData: Partial<ClientSearchResult>): string[] {
    const errors: string[] = [];

    if (!clientData.firstName || clientData.firstName.trim() === '') {
      errors.push("Ім'я клієнта обов'язкове");
    }

    if (!clientData.lastName || clientData.lastName.trim() === '') {
      errors.push("Прізвище клієнта обов'язкове");
    }

    if (!clientData.phone || clientData.phone.trim() === '') {
      errors.push("Телефон клієнта обов'язковий");
    }

    // Валідація email якщо вказаний
    if (clientData.email && clientData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clientData.email)) {
        errors.push('Некоректний формат email');
      }
    }

    // Валідація телефону
    if (clientData.phone && clientData.phone.trim() !== '') {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(clientData.phone.replace(/\s/g, ''))) {
        errors.push('Некоректний формат телефону');
      }
    }

    return errors;
  }

  /**
   * Створення клієнта з валідацією
   */
  static async createClientWithValidation(
    domainData: Partial<ClientSearchResult>
  ): Promise<ClientSearchResult> {
    const validationErrors = this.validateClientData(domainData);
    if (validationErrors.length > 0) {
      throw new Error(`Помилки валідації: ${validationErrors.join(', ')}`);
    }

    return this.createClient(domainData);
  }

  /**
   * Оновлення клієнта з валідацією
   */
  static async updateClientWithValidation(
    id: string,
    domainData: Partial<ClientSearchResult>
  ): Promise<ClientSearchResult> {
    const validationErrors = this.validateClientData(domainData);
    if (validationErrors.length > 0) {
      throw new Error(`Помилки валідації: ${validationErrors.join(', ')}`);
    }

    return this.updateClient(id, domainData);
  }
}
