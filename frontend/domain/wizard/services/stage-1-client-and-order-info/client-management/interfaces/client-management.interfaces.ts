/**
 * @fileoverview Інтерфейси сервісів для управління клієнтами
 * @module domain/wizard/services/stage-1/client-management/interfaces
 */

import type { OperationResult } from '../../../shared/types/base.types';
import type {
  ClientData,
  ClientSearchResult,
  ClientSearchPaginatedResult,
  ClientSearchQuery,
  CreateClientRequest,
} from '../types/client-domain.types';

/**
 * Інтерфейс сервісу пошуку клієнтів
 */
export interface IClientSearchService {
  /**
   * Пошук клієнтів за ключовим словом з пагінацією
   */
  searchClients(
    query: string,
    page?: number,
    size?: number
  ): Promise<OperationResult<ClientSearchPaginatedResult>>;

  /**
   * Отримання клієнта за ID
   */
  getClientById(id: string): Promise<OperationResult<ClientSearchResult>>;

  /**
   * Перевірка існування клієнта за телефоном
   */
  checkClientExistsByPhone(phone: string): Promise<OperationResult<boolean>>;

  /**
   * Перевірка існування клієнта за email
   */
  checkClientExistsByEmail(email: string): Promise<OperationResult<boolean>>;
}

/**
 * Інтерфейс сервісу створення клієнтів
 */
export interface IClientCreationService {
  /**
   * Створення нового клієнта
   */
  createClient(data: CreateClientRequest): Promise<OperationResult<ClientSearchResult>>;

  /**
   * Валідація даних клієнта перед створенням
   */
  validateClientData(data: ClientData): OperationResult<ClientData>;

  /**
   * Перевірка унікальності телефону
   */
  validatePhoneUniqueness(phone: string): Promise<OperationResult<boolean>>;

  /**
   * Перевірка унікальності email (якщо вказаний)
   */
  validateEmailUniqueness(email: string): Promise<OperationResult<boolean>>;
}

/**
 * Інтерфейс сервісу редагування клієнтів
 */
export interface IClientEditingService {
  /**
   * Оновлення даних клієнта
   */
  updateClient(id: string, data: Partial<ClientData>): Promise<OperationResult<ClientSearchResult>>;

  /**
   * Валідація даних для оновлення
   */
  validateUpdateData(data: Partial<ClientData>): OperationResult<Partial<ClientData>>;

  /**
   * Перевірка можливості оновлення клієнта
   */
  canUpdateClient(id: string): Promise<OperationResult<boolean>>;
}

/**
 * Інтерфейс сервісу валідації клієнтів
 */
export interface IClientValidationService {
  /**
   * Валідація повних даних клієнта
   */
  validateClientData(data: ClientData): OperationResult<ClientData>;

  /**
   * Валідація пошукового запиту
   */
  validateSearchQuery(query: ClientSearchQuery): OperationResult<ClientSearchQuery>;

  /**
   * Валідація телефону
   */
  validatePhone(phone: string): OperationResult<string>;

  /**
   * Валідація email
   */
  validateEmail(email: string): OperationResult<string>;

  /**
   * Валідація способів зв'язку
   */
  validateContactMethods(methods: string[]): OperationResult<string[]>;

  /**
   * Валідація джерела інформації
   */
  validateInformationSource(
    source: string,
    other?: string
  ): OperationResult<{
    source: string;
    other?: string;
  }>;
}

/**
 * Інтерфейс основного сервісу управління клієнтами
 */
export interface IClientManagementService {
  /**
   * Пошук клієнтів
   */
  searchClients(
    query: string,
    page?: number,
    size?: number
  ): Promise<OperationResult<ClientSearchPaginatedResult>>;

  /**
   * Отримання клієнта за ID
   */
  getClientById(id: string): Promise<OperationResult<ClientSearchResult>>;

  /**
   * Створення нового клієнта
   */
  createClient(data: CreateClientRequest): Promise<OperationResult<ClientSearchResult>>;

  /**
   * Оновлення клієнта
   */
  updateClient(id: string, data: Partial<ClientData>): Promise<OperationResult<ClientSearchResult>>;

  /**
   * Валідація даних клієнта
   */
  validateClientData(data: ClientData): OperationResult<ClientData>;

  /**
   * Перевірка унікальності телефону
   */
  checkPhoneUniqueness(phone: string, excludeId?: string): Promise<OperationResult<boolean>>;

  /**
   * Перевірка унікальності email
   */
  checkEmailUniqueness(email: string, excludeId?: string): Promise<OperationResult<boolean>>;
}
