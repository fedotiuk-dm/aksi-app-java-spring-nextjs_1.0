/**
 * Основний хук для роботи з замовленнями
 * Інтегрує Zustand store з React Query для керування станом та API
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { OrderService } from '../services/order.service';
import { useOrderStore } from '../store/order.store';
import { OrderUtils } from '../utils/order.utils';

import type {
  Order,
  OrderItem,
  OrderStatus,
  DiscountType,
} from '../types';

// Константа для повторюваного рядка
const NO_CURRENT_ORDER_ERROR = 'Немає поточного замовлення';

/**
 * Основний хук для роботи з замовленнями
 */
export const useOrder = () => {
  const queryClient = useQueryClient();

  // Zustand store
  const {
    currentOrder,
    setCurrentOrder,
    clearCurrentOrder,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearError,
  } = useOrderStore();

  /**
   * Створення нового замовлення
   */
  const createOrderMutation = useMutation({
    mutationFn: async ({
      clientId,
      branchLocationId,
      tagNumber,
    }: {
      clientId: string;
      branchLocationId: string;
      tagNumber?: string;
    }) => {
      const result = OrderService.createOrder(clientId, branchLocationId, tagNumber);
      if (!result.success || !result.order) {
        throw new Error(Object.values(result.errors || {}).join(', '));
      }
      return result.order;
    },
    onMutate: () => {
      setIsLoading(true);
      clearError();
    },
    onSuccess: (order) => {
      setCurrentOrder(order);
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка створення замовлення');
      setIsLoading(false);
    },
  });

  /**
   * Оновлення замовлення
   */
  const updateOrderMutation = useMutation({
    mutationFn: async (order: Order) => {
      const result = OrderService.updateOrder(order);
      if (!result.success || !result.order) {
        throw new Error(Object.values(result.errors || {}).join(', '));
      }
      return result.order;
    },
    onMutate: () => {
      setIsLoading(true);
      clearError();
    },
    onSuccess: (order) => {
      setCurrentOrder(order);
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', order.id] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка оновлення замовлення');
      setIsLoading(false);
    },
  });

  /**
   * Додавання предмета до замовлення
   */
  const addItemMutation = useMutation({
    mutationFn: async (item: OrderItem) => {
      if (!currentOrder) {
        throw new Error(NO_CURRENT_ORDER_ERROR);
      }
      const result = OrderService.addItemToOrder(currentOrder, item);
      if (!result.success || !result.order) {
        throw new Error(Object.values(result.errors || {}).join(', '));
      }
      return result.order;
    },
    onSuccess: (order) => {
      setCurrentOrder(order);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка додавання предмета');
    },
  });

  /**
   * Видалення предмета з замовлення
   */
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (!currentOrder) {
        throw new Error(NO_CURRENT_ORDER_ERROR);
      }
      const result = OrderService.removeItemFromOrder(currentOrder, itemId);
      if (!result.success || !result.order) {
        throw new Error(Object.values(result.errors || {}).join(', '));
      }
      return result.order;
    },
    onSuccess: (order) => {
      setCurrentOrder(order);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка видалення предмета');
    },
  });

  /**
   * Зміна статусу замовлення
   */
  const changeStatusMutation = useMutation({
    mutationFn: async (newStatus: OrderStatus) => {
      if (!currentOrder) {
        throw new Error(NO_CURRENT_ORDER_ERROR);
      }
      const result = OrderService.changeOrderStatus(currentOrder, newStatus);
      if (!result.success || !result.order) {
        throw new Error(Object.values(result.errors || {}).join(', '));
      }
      return result.order;
    },
    onSuccess: (order) => {
      setCurrentOrder(order);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка зміни статусу');
    },
  });

  /**
   * Застосування знижки
   */
  const applyDiscountMutation = useMutation({
    mutationFn: async ({
      discountType,
      discountPercentage,
    }: {
      discountType: DiscountType;
      discountPercentage: number;
    }) => {
      if (!currentOrder) {
        throw new Error(NO_CURRENT_ORDER_ERROR);
      }
      const result = OrderService.applyDiscountToOrder(
        currentOrder,
        discountType,
        discountPercentage
      );
      if (!result.success || !result.order) {
        throw new Error(Object.values(result.errors || {}).join(', '));
      }
      return result.order;
    },
    onSuccess: (order) => {
      setCurrentOrder(order);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка застосування знижки');
    },
  });

  /**
   * Допоміжні функції
   */
  const calculateProgress = () => {
    if (!currentOrder) return 0;
    return OrderUtils.calculateOrderProgress(currentOrder);
  };

  const canEditOrder = () => {
    if (!currentOrder) return false;
    return OrderUtils.canEditOrder(currentOrder);
  };

  const canCancelOrder = () => {
    if (!currentOrder) return false;
    return OrderUtils.canCancelOrder(currentOrder);
  };

  const canCompleteOrder = () => {
    if (!currentOrder) return false;
    return OrderUtils.canCompleteOrder(currentOrder);
  };

  const canDeliverOrder = () => {
    if (!currentOrder) return false;
    return OrderUtils.canDeliverOrder(currentOrder);
  };

  const getAvailableActions = () => {
    if (!currentOrder) return [];
    return OrderUtils.getAvailableActions(currentOrder);
  };

  const createOrderSummary = () => {
    if (!currentOrder) return null;
    return OrderUtils.createOrderSummary(currentOrder);
  };

  const calculateOrderPriority = () => {
    if (!currentOrder) return 'low';
    return OrderUtils.calculateOrderPriority(currentOrder);
  };

  const generateReceiptNumber = (branchCode?: string) => {
    return OrderUtils.generateReceiptNumber(branchCode);
  };

  const generateTagNumber = () => {
    return OrderUtils.generateTagNumber();
  };

  return {
    // Стан
    currentOrder,
    isLoading: isLoading || createOrderMutation.isPending || updateOrderMutation.isPending,
    error,

    // Дії
    setCurrentOrder,
    clearCurrentOrder,
    clearError,

    // Мутації
    createOrder: createOrderMutation.mutate,
    updateOrder: updateOrderMutation.mutate,
    addItem: addItemMutation.mutate,
    removeItem: removeItemMutation.mutate,
    changeStatus: changeStatusMutation.mutate,
    applyDiscount: applyDiscountMutation.mutate,

    // Допоміжні функції
    calculateProgress,
    canEditOrder,
    canCancelOrder,
    canCompleteOrder,
    canDeliverOrder,
    getAvailableActions,
    createOrderSummary,
    calculateOrderPriority,
    generateReceiptNumber,
    generateTagNumber,

    // Стани мутацій
    isCreating: createOrderMutation.isPending,
    isUpdating: updateOrderMutation.isPending,
    isAddingItem: addItemMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
    isChangingStatus: changeStatusMutation.isPending,
    isApplyingDiscount: applyDiscountMutation.isPending,
  };
};
