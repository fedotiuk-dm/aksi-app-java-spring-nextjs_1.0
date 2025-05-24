/**
 * Хук для роботи з предметами замовлення
 * Інтегрує Order Items з React Query та бізнес-логікою
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { OrderItemService } from '../services/order-item.service';

import type {
  OrderItem,
  OrderItemSearchParams,
  OrderItemStats,
  OrderItemPriceCalculation,
} from '../types';

// === КОНСТАНТИ ===
const QUERY_KEYS = {
  ORDER_ITEMS: 'order-items',
  ORDER_ITEMS_STATS: 'order-items-stats',
  ORDERS: 'orders',
} as const;

const ERROR_MESSAGES = {
  ORDER_ID_REQUIRED: "Order ID обов'язкове",
  UNKNOWN_ERROR: 'Невідома помилка',
} as const;

/**
 * Конфігурація хука для предметів замовлення
 */
interface UseOrderItemsConfig {
  orderId?: string;
  autoRefresh?: boolean;
  cacheTime?: number;
}

/**
 * Результат операції з предметом
 */
interface OrderItemOperationResult {
  success: boolean;
  item?: OrderItem;
  error?: string;
}

/**
 * Хук для управління предметами замовлення
 */
export const useOrderItems = (config: UseOrderItemsConfig = {}) => {
  const { orderId, autoRefresh = false, cacheTime = 5 * 60 * 1000 } = config;
  const queryClient = useQueryClient();

  // === ЗАПИТИ (QUERIES) ===

  /**
   * Завантаження списку предметів замовлення
   */
  const {
    data: items = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.ORDER_ITEMS, orderId],
    queryFn: async () => {
      if (!orderId) return [];
      const result = await OrderItemService.getOrderItems(orderId);
      if (!result.success) {
        throw new Error(result.error || 'Помилка завантаження предметів');
      }
      return result.items || [];
    },
    enabled: !!orderId,
    staleTime: cacheTime,
    refetchInterval: autoRefresh ? 30000 : false,
  });

  /**
   * Запит для отримання статистики предметів
   */
  const { data: stats } = useQuery({
    queryKey: [QUERY_KEYS.ORDER_ITEMS_STATS, orderId],
    queryFn: async (): Promise<OrderItemStats> => {
      if (!orderId || items.length === 0) {
        return {
          totalItems: 0,
          totalValue: 0,
          averagePrice: 0,
          byCategory: {} as Record<string, number>,
          byMaterial: {} as Record<string, number>,
          withDefects: 0,
          withStains: 0,
          withPhotos: 0,
        };
      }

      return OrderItemService.calculateStats(items);
    },
    enabled: !!orderId && items.length > 0,
  });

  // === МУТАЦІЇ (MUTATIONS) ===

  /**
   * Мутація для додавання предмета
   */
  const addItemMutation = useMutation({
    mutationFn: async (itemData: Partial<OrderItem>) => {
      if (!orderId) throw new Error(ERROR_MESSAGES.ORDER_ID_REQUIRED);

      const result = await OrderItemService.addOrderItem(orderId, itemData);
      if (!result.success) {
        throw new Error(result.error || 'Помилка додавання предмета');
      }
      if (!result.item) {
        throw new Error('Предмет не був створений');
      }
      return result.item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_ITEMS, orderId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_ITEMS_STATS, orderId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    },
  });

  /**
   * Мутація для оновлення предмета
   */
  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, itemData }: { itemId: string; itemData: Partial<OrderItem> }) => {
      if (!orderId) throw new Error(ERROR_MESSAGES.ORDER_ID_REQUIRED);

      const result = await OrderItemService.updateOrderItem(orderId, itemId, itemData);
      if (!result.success) {
        throw new Error(result.error || 'Помилка оновлення предмета');
      }
      if (!result.item) {
        throw new Error('Предмет не був оновлений');
      }
      return result.item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_ITEMS, orderId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_ITEMS_STATS, orderId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    },
  });

  /**
   * Мутація для видалення предмета
   */
  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (!orderId) throw new Error(ERROR_MESSAGES.ORDER_ID_REQUIRED);

      const result = await OrderItemService.deleteOrderItem(orderId, itemId);
      if (!result.success) {
        throw new Error(result.error || 'Помилка видалення предмета');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_ITEMS, orderId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_ITEMS_STATS, orderId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    },
  });

  /**
   * Мутація для розрахунку ціни предмета
   */
  const calculatePriceMutation = useMutation({
    mutationFn: async (itemData: Partial<OrderItem>) => {
      const result = await OrderItemService.calculateItemPrice(itemData);
      if (!result.success) {
        throw new Error(result.error || 'Помилка розрахунку ціни');
      }
      if (!result.calculation) {
        throw new Error('Розрахунок не був виконаний');
      }
      return result.calculation;
    },
  });

  // === COMPUTED VALUES ===

  /**
   * Стан завантаження операцій
   */
  const isOperating = useMemo(
    () =>
      addItemMutation.isPending ||
      updateItemMutation.isPending ||
      deleteItemMutation.isPending ||
      calculatePriceMutation.isPending,
    [
      addItemMutation.isPending,
      updateItemMutation.isPending,
      deleteItemMutation.isPending,
      calculatePriceMutation.isPending,
    ]
  );

  /**
   * Перевірка чи є предмети
   */
  const hasItems = useMemo(() => items.length > 0, [items.length]);

  /**
   * Загальна вартість всіх предметів
   */
  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }, [items]);

  /**
   * Перевірка готовності до переходу на наступний крок
   */
  const canProceed = useMemo(() => {
    return hasItems && !isLoading && !isOperating;
  }, [hasItems, isLoading, isOperating]);

  // === ПУБЛІЧНІ МЕТОДИ ===

  /**
   * Додавання нового предмета
   */
  const addItem = useCallback(
    async (itemData: Partial<OrderItem>): Promise<OrderItemOperationResult> => {
      console.log('🔍 useOrderItems.addItem викликано з даними:', {
        orderId,
        itemData,
      });

      try {
        console.log('📤 Викликаємо addItemMutation.mutateAsync...');
        const item = await addItemMutation.mutateAsync(itemData);
        console.log('✅ addItemMutation.mutateAsync успішно завершений:', item);
        console.log('✅ Invalidate queries викликано автоматично через onSuccess');
        return { success: true, item };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
        console.error('❌ Помилка в addItemMutation.mutateAsync:', error);
        console.error('❌ Error message:', errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [addItemMutation, orderId]
  );

  /**
   * Оновлення існуючого предмета
   */
  const updateItem = useCallback(
    async (itemId: string, itemData: Partial<OrderItem>): Promise<OrderItemOperationResult> => {
      console.log('🔍 useOrderItems.updateItem викликано з даними:', {
        orderId,
        itemId,
        itemData,
      });

      try {
        console.log('📤 Викликаємо updateItemMutation.mutateAsync...');
        const item = await updateItemMutation.mutateAsync({ itemId, itemData });
        console.log('✅ updateItemMutation.mutateAsync успішно завершений:', item);
        console.log('✅ Invalidate queries викликано автоматично через onSuccess');
        return { success: true, item };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
        console.error('❌ Помилка в updateItemMutation.mutateAsync:', error);
        console.error('❌ Error message:', errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [updateItemMutation, orderId]
  );

  /**
   * Видалення предмета
   */
  const deleteItem = useCallback(
    async (itemId: string): Promise<OrderItemOperationResult> => {
      try {
        await deleteItemMutation.mutateAsync(itemId);
        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
        return { success: false, error: errorMessage };
      }
    },
    [deleteItemMutation]
  );

  /**
   * Розрахунок ціни предмета
   */
  const calculatePrice = useCallback(
    async (itemData: Partial<OrderItem>): Promise<OrderItemPriceCalculation | null> => {
      try {
        return await calculatePriceMutation.mutateAsync(itemData);
      } catch (error) {
        console.error('Помилка розрахунку ціни:', error);
        return null;
      }
    },
    [calculatePriceMutation]
  );

  /**
   * Пошук предмета за ID
   */
  const findItemById = useCallback(
    (itemId: string): OrderItem | undefined => {
      return items.find((item) => item.id === itemId);
    },
    [items]
  );

  /**
   * Фільтрація предметів
   */
  const filterItems = useCallback(
    (searchParams: OrderItemSearchParams): OrderItem[] => {
      return OrderItemService.filterItems(items, searchParams);
    },
    [items]
  );

  /**
   * Оновлення списку предметів
   */
  const refreshItems = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    // === ДАНІ ===
    items,
    stats: stats || {
      totalItems: 0,
      totalValue: 0,
      averagePrice: 0,
      byCategory: {},
      byMaterial: {},
      withDefects: 0,
      withStains: 0,
      withPhotos: 0,
    },

    // === СТАН ===
    isLoading,
    isOperating,
    hasItems,
    totalValue,
    canProceed,
    error: error?.message || null,

    // === МЕТОДИ ===
    addItem,
    updateItem,
    deleteItem,
    calculatePrice,
    findItemById,
    filterItems,
    refreshItems,

    // === МУТАЦІЇ (для додаткового контролю) ===
    mutations: {
      add: addItemMutation,
      update: updateItemMutation,
      delete: deleteItemMutation,
      calculatePrice: calculatePriceMutation,
    },
  };
};

/**
 * Хук для роботи з одним предметом замовлення
 */
export const useOrderItem = (orderId: string, itemId: string) => {
  const { items, ...rest } = useOrderItems({ orderId });

  const item = useMemo(() => {
    return items.find((item) => item.id === itemId);
  }, [items, itemId]);

  return {
    item,
    ...rest,
  };
};
