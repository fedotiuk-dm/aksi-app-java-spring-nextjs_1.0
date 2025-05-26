/**
 * @fileoverview Розширений сервіс пошуку клієнтів з підтримкою сортування
 * @module domain/wizard/services/client/services/client-search-advanced
 */

import { clientSearchCoreService } from './client-search-core.service';

import type { PaginatedOperationResult } from '../../interfaces';
import type { ClientSearchParams } from '../interfaces';
import type { ClientDomain, ClientSearchDomainParams } from '../types';

/**
 * Розширені параметри пошуку з сортуванням
 */
export interface AdvancedClientSearchParams extends ClientSearchParams {
  sortBy?: 'firstName' | 'lastName' | 'phone' | 'email' | 'createdAt';
  sortDirection?: 'ASC' | 'DESC';
}

/**
 * Інтерфейс розширеного сервісу пошуку клієнтів
 */
export interface IClientSearchAdvancedService {
  searchWithSorting(
    params: AdvancedClientSearchParams
  ): Promise<PaginatedOperationResult<ClientDomain>>;
  searchByNameSorted(
    firstName?: string,
    lastName?: string,
    page?: number,
    size?: number
  ): Promise<PaginatedOperationResult<ClientDomain>>;
  searchByPhoneSorted(
    phone: string,
    page?: number,
    size?: number
  ): Promise<PaginatedOperationResult<ClientDomain>>;
}

/**
 * Розширений сервіс пошуку клієнтів з підтримкою сортування
 * Відповідальність: розширений пошук з сортуванням та фільтрацією
 */
export class ClientSearchAdvancedService implements IClientSearchAdvancedService {
  public readonly name = 'ClientSearchAdvancedService';
  public readonly version = '1.0.0';

  /**
   * Пошук з сортуванням
   */
  async searchWithSorting(
    params: AdvancedClientSearchParams
  ): Promise<PaginatedOperationResult<ClientDomain>> {
    const searchParams: ClientSearchDomainParams = {
      ...params,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection || 'ASC',
    };

    return clientSearchCoreService.searchClients(searchParams);
  }

  /**
   * Пошук за іменем з сортуванням
   */
  async searchByNameSorted(
    firstName?: string,
    lastName?: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedOperationResult<ClientDomain>> {
    return this.searchWithSorting({
      firstName,
      lastName,
      page,
      size,
      sortBy: 'lastName',
      sortDirection: 'ASC',
    });
  }

  /**
   * Пошук за телефоном з сортуванням
   */
  async searchByPhoneSorted(
    phone: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedOperationResult<ClientDomain>> {
    return this.searchWithSorting({
      phone,
      page,
      size,
      sortBy: 'lastName',
      sortDirection: 'ASC',
    });
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientSearchAdvancedService = new ClientSearchAdvancedService();
