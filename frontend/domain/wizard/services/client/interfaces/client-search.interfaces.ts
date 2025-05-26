 /**
 * @fileoverview Інтерфейси сервісів пошуку клієнтів
 * @module domain/wizard/services/client/interfaces/client-search
 */

import type {
    BaseService,
    OperationResult,
    PaginatedOperationResult,
  } from '../../interfaces';
  import type {
    ClientDomain,
    ClientSearchDomainParams,
    ClientSearchDomainResult,
  } from '../types';
  
  /**
   * Параметри пошуку клієнтів (аліас для доменного типу)
   */
  export type ClientSearchParams = ClientSearchDomainParams;

  /**
   * Результат пошуку клієнтів (аліас для доменного типу)
   */
  export type ClientSearchResult = ClientSearchDomainResult;

  /**
   * Інтерфейс сервісу пошуку клієнтів
   */
  export interface IClientSearchService extends BaseService {
    searchClients(params: ClientSearchParams): Promise<PaginatedOperationResult<ClientDomain>>;
    searchByQuery(query: string): Promise<OperationResult<ClientDomain[]>>;
    searchByPhone(phone: string): Promise<OperationResult<ClientDomain[]>>;
    searchByEmail(email: string): Promise<OperationResult<ClientDomain[]>>;
    getRecentClients(limit?: number): Promise<OperationResult<ClientDomain[]>>;
  }
