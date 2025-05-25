/**
 * @fileoverview Сервіс статистики замовлень
 * @module domain/wizard/services/order/order-stats
 */

import { OperationResultFactory } from '../interfaces';

import type { OrderStatsDomain, OrderStatus } from './order-domain.types';
import type { IOrderStatsService } from './order.interfaces';
import type { OperationResult } from '../interfaces';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    STATS_FAILED: 'Помилка отримання статистики',
    INVALID_DATE_RANGE: 'Некоректний діапазон дат',
    INVALID_LIMIT: 'Некоректний ліміт',
    UNKNOWN: 'Невідома помилка',
  },
  CACHE_TTL: 5 * 60 * 1000, // 5 хвилин
  DEFAULT_TOP_SERVICES_LIMIT: 10,
  MAX_TOP_SERVICES_LIMIT: 50,
  MIN_TOP_SERVICES_LIMIT: 1,
} as const;

/**
 * Сервіс статистики замовлень
 * Відповідальність: валідація параметрів, кешування, розрахунки статистики
 */
export class OrderStatsService implements IOrderStatsService {
  public readonly name = 'OrderStatsService';
  public readonly version = '1.0.0';

  private statsCache: Map<string, { data: any; timestamp: number }> = new Map();

  /**
   * Отримання загальної статистики замовлень з валідацією
   * Адаптер викликається в хуках домену
   */
  async getOrderStats(dateFrom?: Date, dateTo?: Date): Promise<OperationResult<OrderStatsDomain>> {
    try {
      // Валідація діапазону дат
      const dateValidation = this.validateDateRange(dateFrom, dateTo);
      if (!dateValidation.success) {
        return OperationResultFactory.error(
          dateValidation.error || CONSTANTS.ERROR_MESSAGES.INVALID_DATE_RANGE
        );
      }

      // Створення ключа кешу
      const cacheKey = this.createStatsKey('general', dateFrom, dateTo);
      const cached = this.statsCache.get(cacheKey);

      // Перевірка кешу
      if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
        return OperationResultFactory.success(cached.data);
      }

      // Тут буде виклик адаптера в хуках домену
      // Повертаємо структуру для демонстрації
      const stats: OrderStatsDomain = {
        totalOrders: 0,
        totalAmount: 0,
        averageOrderValue: 0,
        ordersByStatus: this.getEmptyStatusStats(),
        ordersByPaymentMethod: {
          CASH: 0,
          CARD: 0,
          TRANSFER: 0,
        },
        topServices: [],
      };

      // Оновлення кешу
      this.statsCache.set(cacheKey, {
        data: stats,
        timestamp: Date.now(),
      });

      return OperationResultFactory.success(stats);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.STATS_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання статистики за статусами з кешуванням
   */
  async getOrdersByStatus(): Promise<OperationResult<Record<OrderStatus, number>>> {
    try {
      const cacheKey = this.createStatsKey('by-status');
      const cached = this.statsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
        return OperationResultFactory.success(cached.data);
      }

      // Тут буде виклик адаптера в хуках домену
      // Повертаємо структуру для демонстрації
      const ordersByStatus: Record<OrderStatus, number> = this.getEmptyStatusStats();

      this.statsCache.set(cacheKey, {
        data: ordersByStatus,
        timestamp: Date.now(),
      });

      return OperationResultFactory.success(ordersByStatus);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.STATS_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання денної статистики з розрахунком середніх значень
   */
  async getDailyStats(date: Date): Promise<
    OperationResult<{
      ordersCount: number;
      totalAmount: number;
      averageOrderValue: number;
    }>
  > {
    try {
      // Валідація дати
      if (!this.isValidDate(date)) {
        return OperationResultFactory.error('Некоректна дата');
      }

      const cacheKey = this.createStatsKey('daily', date);
      const cached = this.statsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
        return OperationResultFactory.success(cached.data);
      }

      // Тут буде виклик адаптера в хуках домену
      // Повертаємо структуру для демонстрації з розрахунками
      const ordersCount = 0;
      const totalAmount = 0;
      const averageOrderValue = ordersCount > 0 ? totalAmount / ordersCount : 0;

      const dailyStats = {
        ordersCount,
        totalAmount,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100, // Округлення до копійок
      };

      this.statsCache.set(cacheKey, {
        data: dailyStats,
        timestamp: Date.now(),
      });

      return OperationResultFactory.success(dailyStats);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.STATS_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання топ послуг з валідацією ліміту
   */
  async getTopServices(limit: number = CONSTANTS.DEFAULT_TOP_SERVICES_LIMIT): Promise<
    OperationResult<
      Array<{
        serviceId: string;
        serviceName: string;
        count: number;
        totalAmount: number;
      }>
    >
  > {
    try {
      // Валідація та нормалізація ліміту
      const validLimit = this.validateAndNormalizeLimit(limit);
      if (!validLimit.success || validLimit.data === undefined) {
        return OperationResultFactory.error(
          validLimit.error || CONSTANTS.ERROR_MESSAGES.INVALID_LIMIT
        );
      }

      const cacheKey = this.createStatsKey('top-services', undefined, undefined, validLimit.data);
      const cached = this.statsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
        return OperationResultFactory.success(cached.data);
      }

      // Тут буде виклик адаптера в хуках домену
      // Повертаємо структуру для демонстрації
      const topServices: Array<{
        serviceId: string;
        serviceName: string;
        count: number;
        totalAmount: number;
      }> = [];

      this.statsCache.set(cacheKey, {
        data: topServices,
        timestamp: Date.now(),
      });

      return OperationResultFactory.success(topServices);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.STATS_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання статистики за період з показниками ефективності
   */
  async getPeriodStats(
    dateFrom: Date,
    dateTo: Date
  ): Promise<
    OperationResult<{
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      completionRate: number;
      cancellationRate: number;
    }>
  > {
    try {
      // Валідація діапазону дат
      const dateValidation = this.validateDateRange(dateFrom, dateTo);
      if (!dateValidation.success) {
        return OperationResultFactory.error(
          dateValidation.error || CONSTANTS.ERROR_MESSAGES.INVALID_DATE_RANGE
        );
      }

      const cacheKey = this.createStatsKey('period', dateFrom, dateTo);
      const cached = this.statsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
        return OperationResultFactory.success(cached.data);
      }

      // Тут буде виклик адаптера в хуках домену
      // Повертаємо структуру для демонстрації з розрахунками
      const totalOrders = 0;
      const completedOrders = 0;
      const cancelledOrders = 0;
      const totalRevenue = 0;

      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
      const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

      const periodStats = {
        totalOrders,
        totalRevenue,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        completionRate: Math.round(completionRate * 100) / 100,
        cancellationRate: Math.round(cancellationRate * 100) / 100,
      };

      this.statsCache.set(cacheKey, {
        data: periodStats,
        timestamp: Date.now(),
      });

      return OperationResultFactory.success(periodStats);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.STATS_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Очищення кешу статистики
   */
  clearStatsCache(): void {
    this.statsCache.clear();
  }

  /**
   * Отримання кешованої статистики
   */
  getCachedStats(key: string): any | null {
    const cached = this.statsCache.get(key);
    if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  /**
   * Валідація діапазону дат
   */
  private validateDateRange(dateFrom?: Date, dateTo?: Date): OperationResult<boolean> {
    if (dateFrom && !this.isValidDate(dateFrom)) {
      return OperationResultFactory.error('Некоректна початкова дата');
    }

    if (dateTo && !this.isValidDate(dateTo)) {
      return OperationResultFactory.error('Некоректна кінцева дата');
    }

    if (dateFrom && dateTo && dateFrom > dateTo) {
      return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.INVALID_DATE_RANGE);
    }

    return OperationResultFactory.success(true);
  }

  /**
   * Валідація та нормалізація ліміту
   */
  private validateAndNormalizeLimit(limit: number): OperationResult<number> {
    if (typeof limit !== 'number' || isNaN(limit)) {
      return OperationResultFactory.error('Ліміт повинен бути числом');
    }

    if (limit < CONSTANTS.MIN_TOP_SERVICES_LIMIT) {
      return OperationResultFactory.error(`Мінімальний ліміт: ${CONSTANTS.MIN_TOP_SERVICES_LIMIT}`);
    }

    if (limit > CONSTANTS.MAX_TOP_SERVICES_LIMIT) {
      return OperationResultFactory.error(
        `Максимальний ліміт: ${CONSTANTS.MAX_TOP_SERVICES_LIMIT}`
      );
    }

    return OperationResultFactory.success(Math.floor(limit));
  }

  /**
   * Валідація дати
   */
  private isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Отримання порожньої статистики за статусами
   */
  private getEmptyStatusStats(): Record<OrderStatus, number> {
    return {
      DRAFT: 0,
      CONFIRMED: 0,
      IN_PROGRESS: 0,
      READY: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
  }

  /**
   * Створення ключа кешу для статистики
   */
  private createStatsKey(type: string, dateFrom?: Date, dateTo?: Date, limit?: number): string {
    const keyParts = [
      type,
      dateFrom?.toISOString() || '',
      dateTo?.toISOString() || '',
      limit?.toString() || '',
    ];

    return keyParts.join('|');
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const orderStatsService = new OrderStatsService();
