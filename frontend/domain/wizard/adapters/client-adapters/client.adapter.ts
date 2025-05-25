/**
 * @fileoverview Композиційний адаптер клієнтів (зворотна сумісність)
 * @module domain/wizard/adapters/client-adapters
 */

import { ClientApiOperationsAdapter } from './api-operations.adapter';
import { ClientMappingAdapter } from './mapping.adapter';

import type { ClientSearchResult } from '../../types';
import type {
  ClientResponse,
  ClientPageResponse,
  CreateClientRequest,
  UpdateClientRequest,
} from '@/lib/api';

/**
 * Композиційний адаптер клієнтів для зворотної сумісності
 *
 * Відповідальність:
 * - Делегування до спеціалізованих адаптерів
 * - Збереження існуючого API
 * - Уніфікований доступ до функціональності
 */
export class ClientAdapter {
  // === ДЕЛЕГУВАННЯ ДО MAPPING ADAPTER ===

  /**
   * Перетворює API ClientResponse у доменний ClientSearchResult
   */
  static toDomain(apiClient: ClientResponse): ClientSearchResult {
    return ClientMappingAdapter.toDomain(apiClient);
  }

  /**
   * Перетворює пагіновану API відповідь у доменний тип
   */
  static toDomainPage(apiResponse: ClientPageResponse): {
    items: ClientSearchResult[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } {
    return ClientMappingAdapter.toDomainPage(apiResponse);
  }

  /**
   * Перетворює доменний тип у CreateClientRequest
   */
  static toCreateRequest(domainClient: Partial<ClientSearchResult>): CreateClientRequest {
    return ClientMappingAdapter.toCreateRequest(domainClient);
  }

  /**
   * Перетворює доменний тип у UpdateClientRequest
   */
  static toUpdateRequest(domainClient: Partial<ClientSearchResult>): UpdateClientRequest {
    return ClientMappingAdapter.toUpdateRequest(domainClient);
  }

  // === ДЕЛЕГУВАННЯ ДО API OPERATIONS ADAPTER ===

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
    return ClientApiOperationsAdapter.searchWithPagination(params);
  }

  /**
   * Створення нового клієнта через API
   */
  static async createClient(domainData: Partial<ClientSearchResult>): Promise<ClientSearchResult> {
    return ClientApiOperationsAdapter.createClient(domainData);
  }

  /**
   * Отримання клієнта за ID через API
   */
  static async getById(id: string): Promise<ClientSearchResult> {
    return ClientApiOperationsAdapter.getById(id);
  }

  /**
   * Оновлення існуючого клієнта через API
   */
  static async updateClient(
    id: string,
    domainData: Partial<ClientSearchResult>
  ): Promise<ClientSearchResult> {
    return ClientApiOperationsAdapter.updateClient(id, domainData);
  }

  /**
   * Видалення клієнта через API
   */
  static async deleteClient(id: string): Promise<void> {
    return ClientApiOperationsAdapter.deleteClient(id);
  }

  /**
   * Отримання всіх клієнтів з пагінацією через API
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
    return ClientApiOperationsAdapter.getAllClients(params);
  }

  /**
   * Простий пошук клієнтів (deprecated)
   * @deprecated Використовуйте searchWithPagination замість цього
   */
  static async searchClients(keyword: string): Promise<ClientSearchResult[]> {
    return ClientApiOperationsAdapter.searchClients(keyword);
  }

  // === ДЕЛЕГУВАННЯ ДО УТИЛІТАРНИХ МЕТОДІВ ===

  /**
   * Перевірка існування клієнта
   */
  static async clientExists(id: string): Promise<boolean> {
    return ClientApiOperationsAdapter.clientExists(id);
  }

  /**
   * Валідація даних клієнта перед створенням/оновленням
   */
  static validateClientData(clientData: Partial<ClientSearchResult>): string[] {
    return ClientApiOperationsAdapter.validateClientData(clientData);
  }

  /**
   * Створення клієнта з валідацією
   */
  static async createClientWithValidation(
    domainData: Partial<ClientSearchResult>
  ): Promise<ClientSearchResult> {
    return ClientApiOperationsAdapter.createClientWithValidation(domainData);
  }

  /**
   * Оновлення клієнта з валідацією
   */
  static async updateClientWithValidation(
    id: string,
    domainData: Partial<ClientSearchResult>
  ): Promise<ClientSearchResult> {
    return ClientApiOperationsAdapter.updateClientWithValidation(id, domainData);
  }

  // === ДОДАТКОВІ УТИЛІТАРНІ МЕТОДИ ===

  /**
   * Створює порожній об'єкт клієнта з базовими значеннями
   */
  static createEmptyClient(): Partial<ClientSearchResult> {
    return {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      communicationChannels: ['PHONE'],
      source: undefined,
      sourceDetails: '',
    };
  }

  /**
   * Форматує повне ім'я клієнта
   */
  static formatFullName(client: ClientSearchResult): string {
    return `${client.firstName} ${client.lastName}`.trim();
  }

  /**
   * Форматує відображення клієнта для списків
   */
  static formatDisplayName(client: ClientSearchResult): string {
    const fullName = this.formatFullName(client);
    return client.phone ? `${fullName} (${client.phone})` : fullName;
  }

  /**
   * Перевіряє чи є клієнт новим (без ID)
   */
  static isNewClient(client: Partial<ClientSearchResult>): boolean {
    return !client.id || client.id.trim() === '';
  }

  /**
   * Фільтрує клієнтів за пошуковим терміном
   */
  static filterClients(clients: ClientSearchResult[], searchTerm: string): ClientSearchResult[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return clients;
    }

    const term = searchTerm.toLowerCase().trim();
    return clients.filter((client) => {
      const fullName = this.formatFullName(client).toLowerCase();
      const phone = client.phone.toLowerCase();
      const email = (client.email || '').toLowerCase();

      return fullName.includes(term) || phone.includes(term) || email.includes(term);
    });
  }

  /**
   * Сортує клієнтів за прізвищем та ім'ям
   */
  static sortClientsByName(clients: ClientSearchResult[]): ClientSearchResult[] {
    return [...clients].sort((a, b) => {
      const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
      const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  /**
   * Групує клієнтів за першою літерою прізвища
   */
  static groupClientsByLastNameInitial(
    clients: ClientSearchResult[]
  ): Record<string, ClientSearchResult[]> {
    return clients.reduce(
      (groups, client) => {
        const initial = client.lastName.charAt(0).toUpperCase() || '#';
        if (!groups[initial]) {
          groups[initial] = [];
        }
        groups[initial].push(client);
        return groups;
      },
      {} as Record<string, ClientSearchResult[]>
    );
  }
}
