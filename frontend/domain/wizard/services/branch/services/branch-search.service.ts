/**
 * @fileoverview Сервіс пошуку філій
 * @module domain/wizard/services/branch/services/branch-search
 */

import { branchRetrievalService } from './branch-retrieval.service';
import { OperationResultFactory } from '../../interfaces';

import type { OperationResult } from '../../interfaces';
import type { BranchDomain, BranchSearchDomainParams, BranchSearchDomainResult } from '../types';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    SEARCH_FAILED: 'Помилка пошуку філій',
    INVALID_PARAMS: 'Некоректні параметри пошуку',
    UNKNOWN: 'Невідома помилка',
  },
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  CACHE_TTL: 5 * 60 * 1000, // 5 хвилин
} as const;

/**
 * Інтерфейс сервісу пошуку філій
 */
export interface IBranchSearchService {
  searchBranches(
    params: BranchSearchDomainParams
  ): Promise<OperationResult<BranchSearchDomainResult>>;
  validateSearchParams(params: BranchSearchDomainParams): OperationResult<boolean>;
  filterBranches(branches: BranchDomain[], params: BranchSearchDomainParams): BranchDomain[];
  paginateBranches(
    branches: BranchDomain[],
    page: number,
    size: number
  ): {
    items: BranchDomain[];
    hasMore: boolean;
  };
  clearSearchCache(): void;
}

/**
 * Сервіс пошуку філій
 * Відповідальність: валідація параметрів пошуку, фільтрація, пагінація
 */
export class BranchSearchService implements IBranchSearchService {
  public readonly name = 'BranchSearchService';
  public readonly version = '1.0.0';

  private searchCache: Map<string, { data: BranchSearchDomainResult; timestamp: number }> =
    new Map();

  /**
   * Пошук філій з валідацією та кешуванням
   */
  async searchBranches(
    params: BranchSearchDomainParams
  ): Promise<OperationResult<BranchSearchDomainResult>> {
    try {
      // Валідація параметрів
      const validationResult = this.validateSearchParams(params);
      if (!validationResult.success) {
        return OperationResultFactory.error(
          validationResult.error || CONSTANTS.ERROR_MESSAGES.INVALID_PARAMS
        );
      }

      const page = params.page || 0;
      const size = Math.min(params.size || CONSTANTS.DEFAULT_PAGE_SIZE, CONSTANTS.MAX_PAGE_SIZE);

      // Перевірка кешу
      const cacheKey = this.createCacheKey(params);
      const cached = this.searchCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
        return OperationResultFactory.success(cached.data);
      }

      // Отримання всіх філій
      const allBranchesResult = await branchRetrievalService.getAllBranches();
      if (!allBranchesResult.success || !allBranchesResult.data) {
        return OperationResultFactory.error(
          allBranchesResult.error || CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED
        );
      }

      // Фільтрація за параметрами пошуку
      const filteredBranches = this.filterBranches(allBranchesResult.data, params);

      // Пагінація
      const paginationResult = this.paginateBranches(filteredBranches, page, size);

      const searchResult: BranchSearchDomainResult = {
        branches: paginationResult.items,
        total: filteredBranches.length,
        page,
        size,
        hasMore: paginationResult.hasMore,
      };

      // Оновлення кешу
      this.searchCache.set(cacheKey, {
        data: searchResult,
        timestamp: Date.now(),
      });

      return OperationResultFactory.success(searchResult);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Валідація параметрів пошуку
   */
  validateSearchParams(params: BranchSearchDomainParams): OperationResult<boolean> {
    // Валідація пагінації
    if (params.page !== undefined && params.page < 0) {
      return OperationResultFactory.error("Номер сторінки не може бути від'ємним");
    }

    if (params.size !== undefined && (params.size < 1 || params.size > CONSTANTS.MAX_PAGE_SIZE)) {
      return OperationResultFactory.error(
        `Розмір сторінки повинен бути від 1 до ${CONSTANTS.MAX_PAGE_SIZE}`
      );
    }

    // Валідація рядка пошуку
    if (params.query !== undefined && typeof params.query !== 'string') {
      return OperationResultFactory.error('Запит пошуку повинен бути рядком');
    }

    return OperationResultFactory.success(true);
  }

  /**
   * Фільтрація філій за параметрами
   */
  filterBranches(branches: BranchDomain[], params: BranchSearchDomainParams): BranchDomain[] {
    let filteredBranches = [...branches];

    // Фільтрація за текстовим запитом
    if (params.query) {
      const query = params.query.toLowerCase().trim();
      filteredBranches = filteredBranches.filter(
        (branch) =>
          branch.name.toLowerCase().includes(query) ||
          branch.address.toLowerCase().includes(query) ||
          branch.phone.includes(query) ||
          branch.code.toLowerCase().includes(query)
      );
    }

    // Фільтрація за статусом активності
    if (params.isActive !== undefined) {
      filteredBranches = filteredBranches.filter((branch) => branch.isActive === params.isActive);
    }

    return filteredBranches;
  }

  /**
   * Пагінація філій
   */
  paginateBranches(
    branches: BranchDomain[],
    page: number,
    size: number
  ): {
    items: BranchDomain[];
    hasMore: boolean;
  } {
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const items = branches.slice(startIndex, endIndex);
    const hasMore = endIndex < branches.length;

    return { items, hasMore };
  }

  /**
   * Очищення кешу пошуку
   */
  clearSearchCache(): void {
    this.searchCache.clear();
  }

  /**
   * Створення ключа кешу
   */
  private createCacheKey(params: BranchSearchDomainParams): string {
    const keyParts = [
      params.query || '',
      params.isActive?.toString() || '',
      params.page || 0,
      params.size || CONSTANTS.DEFAULT_PAGE_SIZE,
    ];

    return keyParts.join('|');
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const branchSearchService = new BranchSearchService();
