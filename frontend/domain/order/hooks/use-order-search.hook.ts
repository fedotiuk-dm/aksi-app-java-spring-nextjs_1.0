/**
 * Хук для пошуку та фільтрації замовлень
 * Інтегрує пошук з кешуванням та дебаунсингом
 */

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useMemo, useCallback } from 'react';

import { useDebounce } from '@/shared/lib/hooks';

import { OrderService } from '../services/order.service';
import { OrderStatus, ExpediteType } from '../types';
import { OrderUtils } from '../utils/order.utils';

import type { Order, OrderSearchParams, OrderSearchResult } from '../types';

interface UseOrderSearchOptions {
  initialFilters?: Partial<OrderSearchParams>;
  debounceMs?: number;
  enabledByDefault?: boolean;
  refetchInterval?: number;
}

/**
 * Хук для пошуку замовлень
 */
export const useOrderSearch = (options: UseOrderSearchOptions = {}) => {
  const {
    initialFilters = {},
    debounceMs = 300,
    enabledByDefault = true,
    refetchInterval,
  } = options;

  // Стан фільтрів
  const [filters, setFilters] = useState<OrderSearchParams>({
    keyword: '',
    status: [],
    ...initialFilters,
  });

  // Дебаунсинг для keyword пошуку
  const debouncedKeyword = useDebounce(filters.keyword || '', debounceMs);

  // Фінальні фільтри з дебаунсингом
  const finalFilters = useMemo(
    () => ({
      ...filters,
      keyword: debouncedKeyword,
    }),
    [filters, debouncedKeyword]
  );

  // React Query для отримання замовлень
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      // Тут буде реальний API виклик
      // Поки що повертаємо мок дані
      return [];
    },
    enabled: enabledByDefault,
    refetchInterval,
    staleTime: 1000 * 60 * 5, // 5 хвилин
  });

  // Пошук з фільтрацією
  const searchResult = useMemo((): OrderSearchResult | null => {
    if (!ordersQuery.data) return null;

    return OrderService.searchOrders(ordersQuery.data, finalFilters);
  }, [ordersQuery.data, finalFilters]);

  /**
   * Оновлення фільтрів
   */
  const updateFilters = useCallback((newFilters: Partial<OrderSearchParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const setKeyword = useCallback(
    (keyword: string) => {
      updateFilters({ keyword });
    },
    [updateFilters]
  );

  const setStatus = useCallback(
    (status: OrderStatus[]) => {
      updateFilters({ status });
    },
    [updateFilters]
  );

  const setDateRange = useCallback(
    (dateFrom?: Date, dateTo?: Date) => {
      updateFilters({ dateFrom, dateTo });
    },
    [updateFilters]
  );

  const setBranch = useCallback(
    (branchId?: string) => {
      updateFilters({ branchId });
    },
    [updateFilters]
  );

  const setClient = useCallback(
    (clientId?: string) => {
      updateFilters({ clientId });
    },
    [updateFilters]
  );

  const setAmountRange = useCallback(
    (minAmount?: number, maxAmount?: number) => {
      updateFilters({ minAmount, maxAmount });
    },
    [updateFilters]
  );

  /**
   * Скидання фільтрів
   */
  const resetFilters = useCallback(() => {
    setFilters({
      keyword: '',
      status: [],
      dateFrom: undefined,
      dateTo: undefined,
      branchId: undefined,
      clientId: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      hasItems: undefined,
      expediteType: undefined,
    });
  }, []);

  /**
   * Швидкі фільтри
   */
  const quickFilters = useMemo(
    () => ({
      // Сьогоднішні замовлення
      today: () => {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        setDateRange(startOfDay, endOfDay);
      },

      // Цього тижня
      thisWeek: () => {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        setDateRange(startOfWeek, endOfWeek);
      },

      // Цього місяця
      thisMonth: () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        setDateRange(startOfMonth, endOfMonth);
      },

      // Тільки нові
      newOnly: () => setStatus([OrderStatus.NEW]),

      // В роботі
      inProgress: () => setStatus([OrderStatus.IN_PROGRESS]),

      // Завершені
      completed: () => setStatus([OrderStatus.COMPLETED]),

      // Прострочені
      overdue: () => {
        const orders = searchResult?.orders || [];
        return orders.filter((order) => {
          if (!order.expectedCompletionDate) return false;
          return (
            order.expectedCompletionDate < new Date() &&
            order.status !== OrderStatus.DELIVERED &&
            order.status !== OrderStatus.CANCELLED
          );
        });
      },

      // Термінові
      urgent: () => {
        updateFilters({ expediteType: ExpediteType.EXPRESS_24H });
      },
    }),
    [setDateRange, setStatus, updateFilters, searchResult]
  );

  /**
   * Сортування
   */
  const sortedOrders = useMemo(() => {
    if (!searchResult?.orders) return [];
    // За замовчуванням сортуємо за датою створення (новіші спочатку)
    return OrderUtils.sortOrders(searchResult.orders, 'date', 'desc');
  }, [searchResult?.orders]);

  /**
   * Групування за статусом
   */
  const groupedByStatus = useMemo(() => {
    if (!searchResult?.orders) return {};
    return OrderUtils.groupOrdersByStatus(searchResult.orders);
  }, [searchResult?.orders]);

  /**
   * Статистика
   */
  const statistics = useMemo(() => {
    if (!searchResult?.orders) return null;
    return OrderUtils.calculateOrderStatistics(searchResult.orders);
  }, [searchResult?.orders]);

  /**
   * Індикатори активних фільтрів
   */
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.keyword) count++;
    if (filters.status && filters.status.length > 0) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.branchId) count++;
    if (filters.clientId) count++;
    if (filters.minAmount || filters.maxAmount) count++;
    if (filters.hasItems !== undefined) count++;
    if (filters.expediteType) count++;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFiltersCount > 0;

  return {
    // Дані
    orders: sortedOrders,
    groupedByStatus,
    statistics,
    searchResult,

    // Стан
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,
    isRefetching: ordersQuery.isRefetching,

    // Фільтри
    filters,
    updateFilters,
    resetFilters,
    setKeyword,
    setStatus,
    setDateRange,
    setBranch,
    setClient,
    setAmountRange,

    // Швидкі фільтри
    quickFilters,

    // Метаінформація
    hasActiveFilters,
    activeFiltersCount,
    totalCount: searchResult?.totalCount || 0,
    filteredCount: searchResult?.filteredCount || 0,

    // Керування
    refetch: ordersQuery.refetch,
    invalidate: () => ordersQuery.refetch(),
  };
};
