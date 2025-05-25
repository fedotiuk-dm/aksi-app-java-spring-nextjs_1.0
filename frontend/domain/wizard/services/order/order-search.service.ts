/**
 * @fileoverview Сервіс пошуку замовлень
 * @module domain/wizard/services/order/order-search
 */

import { OperationResultFactory } from '../interfaces';

import type {
  OrderDomain,
  OrderSearchDomainParams,
  OrderSearchDomainResult,
} from './order-domain.types';
import type { IOrderSearchService } from './order.interfaces';
import type { OperationResult } from '../interfaces';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    SEARCH_FAILED: 'Помилка пошуку замовлень',
    ORDER_NOT_FOUND: 'Замовлення не знайдено',
    INVALID_RECEIPT_NUMBER: 'Некоректний номер квитанції',
    INVALID_CLIENT_ID: 'Некоректний ID клієнта',
    UNKNOWN: 'Невідома помилка',
  },
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  CACHE_TTL: 2 * 60 * 1000, // 2 хвилини
  RECEIPT_NUMBER_PATTERN: /^RC\d{4}[A-Z]{3}$/,
} as const;

/**
 * Сервіс пошуку замовлень
 * Відповідальність: валідація параметрів пошуку, кешування, фільтрація
 */
export class OrderSearchService implements IOrderSearchService {
  public readonly name = 'OrderSearchService';
  public readonly version = '1.0.0';

  private searchCache: Map<string, { data: OrderSearchDomainResult; timestamp: number }> =
    new Map();

  /**
   * Пошук замовлень з валідацією та кешуванням
   * Адаптер викликається в хуках домену
   */
  async searchOrders(
    params: OrderSearchDomainParams
  ): Promise<OperationResult<OrderSearchDomainResult>> {
    try {
      // Валідація параметрів пошуку
      const validationResult = this.validateSearchParams(params);
      if (!validationResult.success) {
        return OperationResultFactory.error(
          validationResult.error || CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED
        );
      }

      // Нормалізація параметрів
      const normalizedParams = this.normalizeSearchParams(params);

      // Перевірка кешу
      const cacheKey = this.createSearchCacheKey(normalizedParams);
      const cached = this.searchCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
        return OperationResultFactory.success(cached.data);
      }

      // Тут буде виклик адаптера в хуках домену
      // Повертаємо структуру для демонстрації
      const searchResult: OrderSearchDomainResult = {
        orders: [],
        total: 0,
        page: normalizedParams.page || 0,
        size: normalizedParams.size || CONSTANTS.DEFAULT_PAGE_SIZE,
        hasMore: false,
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
   * Отримання замовлення за ID з валідацією
   */
  async getOrderById(id: string): Promise<OperationResult<OrderDomain | null>> {
    try {
      if (!this.isValidOrderId(id)) {
        return OperationResultFactory.error('Некоректний ID замовлення');
      }

      // Тут буде виклик адаптера в хуках домену
      // Повертаємо null для демонстрації
      return OperationResultFactory.success(null);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.ORDER_NOT_FOUND}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання замовлення за номером квитанції
   */
  async getOrderByReceiptNumber(
    receiptNumber: string
  ): Promise<OperationResult<OrderDomain | null>> {
    try {
      if (!this.isValidReceiptNumber(receiptNumber)) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.INVALID_RECEIPT_NUMBER);
      }

      // Використання загального пошуку з фільтром по номеру квитанції
      const searchResult = await this.searchOrders({
        receiptNumber: receiptNumber.trim().toUpperCase(),
        page: 0,
        size: 1,
      });

      if (!searchResult.success || !searchResult.data) {
        return OperationResultFactory.error(
          searchResult.error || CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED
        );
      }

      const order = searchResult.data.orders.length > 0 ? searchResult.data.orders[0] : null;
      return OperationResultFactory.success(order);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.ORDER_NOT_FOUND}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання замовлень клієнта
   */
  async getOrdersByClient(clientId: string): Promise<OperationResult<OrderDomain[]>> {
    try {
      if (!this.isValidClientId(clientId)) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.INVALID_CLIENT_ID);
      }

      // Використання загального пошуку з фільтром по клієнту
      const searchResult = await this.searchOrders({
        clientId,
        page: 0,
        size: CONSTANTS.MAX_PAGE_SIZE,
      });

      if (!searchResult.success || !searchResult.data) {
        return OperationResultFactory.error(
          searchResult.error || CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED
        );
      }

      return OperationResultFactory.success(searchResult.data.orders);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання останніх замовлень
   */
  async getRecentOrders(limit: number = 10): Promise<OperationResult<OrderDomain[]>> {
    try {
      const validLimit = Math.min(Math.max(limit, 1), 50);

      const searchResult = await this.searchOrders({
        page: 0,
        size: validLimit,
      });

      if (!searchResult.success || !searchResult.data) {
        return OperationResultFactory.error(
          searchResult.error || CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED
        );
      }

      return OperationResultFactory.success(searchResult.data.orders);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Очищення кешу пошуку
   */
  clearSearchCache(): void {
    this.searchCache.clear();
  }

  /**
   * Отримання кешованого результату пошуку
   */
  getCachedSearchResult(params: OrderSearchDomainParams): OrderSearchDomainResult | null {
    const cacheKey = this.createSearchCacheKey(params);
    const cached = this.searchCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
      return cached.data;
    }

    return null;
  }

  /**
   * Валідація параметрів пошуку
   */
  private validateSearchParams(params: OrderSearchDomainParams): OperationResult<boolean> {
    // Валідація номера квитанції
    if (params.receiptNumber && !this.isValidReceiptNumber(params.receiptNumber)) {
      return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.INVALID_RECEIPT_NUMBER);
    }

    // Валідація ID клієнта
    if (params.clientId && !this.isValidClientId(params.clientId)) {
      return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.INVALID_CLIENT_ID);
    }

    // Валідація діапазону дат
    if (params.dateFrom && params.dateTo && params.dateFrom > params.dateTo) {
      return OperationResultFactory.error('Некоректний діапазон дат');
    }

    // Валідація пагінації
    if (params.page !== undefined && params.page < 0) {
      return OperationResultFactory.error("Номер сторінки не може бути від'ємним");
    }

    if (params.size !== undefined && (params.size < 1 || params.size > CONSTANTS.MAX_PAGE_SIZE)) {
      return OperationResultFactory.error(
        `Розмір сторінки повинен бути від 1 до ${CONSTANTS.MAX_PAGE_SIZE}`
      );
    }

    return OperationResultFactory.success(true);
  }

  /**
   * Нормалізація параметрів пошуку
   */
  private normalizeSearchParams(params: OrderSearchDomainParams): OrderSearchDomainParams {
    return {
      ...params,
      receiptNumber: params.receiptNumber?.trim().toUpperCase(),
      query: params.query?.trim(),
      page: params.page || 0,
      size: Math.min(params.size || CONSTANTS.DEFAULT_PAGE_SIZE, CONSTANTS.MAX_PAGE_SIZE),
    };
  }

  /**
   * Створення ключа кешу для пошуку
   */
  private createSearchCacheKey(params: OrderSearchDomainParams): string {
    const keyParts = [
      params.query || '',
      params.receiptNumber || '',
      params.clientId || '',
      params.branchId || '',
      params.status || '',
      params.dateFrom?.toISOString() || '',
      params.dateTo?.toISOString() || '',
      params.page || 0,
      params.size || CONSTANTS.DEFAULT_PAGE_SIZE,
    ];

    return keyParts.join('|');
  }

  /**
   * Валідація ID замовлення
   */
  private isValidOrderId(id: string): boolean {
    return typeof id === 'string' && id.trim().length > 0;
  }

  /**
   * Валідація номера квитанції
   */
  private isValidReceiptNumber(receiptNumber: string): boolean {
    if (!receiptNumber || typeof receiptNumber !== 'string') {
      return false;
    }

    const normalized = receiptNumber.trim().toUpperCase();
    return CONSTANTS.RECEIPT_NUMBER_PATTERN.test(normalized);
  }

  /**
   * Валідація ID клієнта
   */
  private isValidClientId(clientId: string): boolean {
    return typeof clientId === 'string' && clientId.trim().length > 0;
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const orderSearchService = new OrderSearchService();
