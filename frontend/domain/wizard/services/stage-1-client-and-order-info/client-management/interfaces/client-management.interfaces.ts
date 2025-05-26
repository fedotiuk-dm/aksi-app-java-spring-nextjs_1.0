/**
 * @fileoverview Інтерфейси для сервісів управління клієнтами
 * @module domain/wizard/services/stage-1/client-management/interfaces
 */

import type {
  ClientData,
  ClientSearchResult,
  ClientSearchPaginatedResult,
} from '../types';

/**
 * Результат операції з типізованим успіхом/помилкою
 */
export interface OperationResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly warnings?: string[];
}

/**
 * Параметри пошуку клієнтів
 */
export interface ClientSearchParams {
  readonly query: string;
  readonly page?: number;
  readonly pageSize?: number;
}

/**
 * Інтерфейс сервісу для управління клієнтами
 */
export interface IClientManagementService {
  /**
   * Пошук клієнтів за параметрами
   */
  searchClients(
    params: ClientSearchParams
  ): Promise<OperationResult<ClientSearchPaginatedResult>>;

  /**
   * Отримання клієнта за ID
   */
  getClientById(id: string): Promise<OperationResult<ClientSearchResult>>;

  /**
   * Створення нового клієнта
   */
  createClient(clientData: ClientData): Promise<OperationResult<ClientSearchResult>>;

  /**
   * Оновлення існуючого клієнта
   */
  updateClient(
    id: string,
    clientData: Partial<ClientData>
  ): Promise<OperationResult<ClientSearchResult>>;

  /**
   * Валідація даних клієнта
   */
  validateClientData(clientData: Partial<ClientData>): OperationResult<ClientData>;

  /**
   * Перевірка унікальності телефону
   */
  checkPhoneUniqueness(phone: string): Promise<OperationResult<boolean>>;

  /**
   * Перевірка унікальності email
   */
  checkEmailUniqueness(email: string): Promise<OperationResult<boolean>>;

  /**
   * Перетворення між форматами даних клієнта
   */
  transformClientData(domainClient: ClientSearchResult): ClientData;
}

/**
 * Інтерфейс для сервісу управління станом клієнта в wizard
 */
export interface IClientStateService {
  /**
   * Отримання поточного стану клієнта в wizard
   */
  getSelectedClient(): ClientSearchResult | null;

  /**
   * Встановлення обраного клієнта
   */
  setSelectedClient(client: ClientSearchResult | null): void;

  /**
   * Отримання поточних даних форми клієнта
   */
  getClientFormData(): Partial<ClientData>;

  /**
   * Оновлення даних форми клієнта
   */
  updateClientFormData(data: Partial<ClientData>): void;

  /**
   * Скидання стану
   */
  resetClientState(): void;
}
