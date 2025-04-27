import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OrdersService } from '@/lib/api';
import { Order } from '../../../model/types';
import { QUERY_KEYS } from '../../helpers/query-keys';
import { mapApiOrderToModelOrder } from '../../helpers/mappers';

type OrderStatus = 'DRAFT' | 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED';

/**
 * Хук для управління статусом замовлення
 */
export const useOrderStatus = () => {
  const queryClient = useQueryClient();

  /**
   * Оновлення статусу замовлення
   */
  const useUpdateOrderStatus = () => {
    return useMutation({
      mutationFn: async ({ 
        orderId, 
        status 
      }: { 
        orderId: string, 
        status: OrderStatus 
      }): Promise<Order> => {
        const response = await OrdersService.updateOrderStatus({
          id: orderId,
          status,
        });

        return mapApiOrderToModelOrder(response);
      },
      onSuccess: (_, variables) => {
        // Інвалідуємо кеш після успішного оновлення статусу
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ORDER_DETAILS, variables.orderId] 
        });
      },
    });
  };

  /**
   * Відзначення замовлення як виконане
   */
  const useCompleteOrder = () => {
    return useMutation({
      mutationFn: async (orderId: string): Promise<Order> => {
        const response = await OrdersService.completeOrder({
          id: orderId,
        });

        return mapApiOrderToModelOrder(response);
      },
      onSuccess: (_, orderId) => {
        // Інвалідуємо кеш після успішного завершення
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ORDER_DETAILS, orderId] 
        });
      },
    });
  };

  /**
   * Перетворення чернетки на повноцінне замовлення
   */
  const useConvertDraftToOrder = () => {
    return useMutation({
      mutationFn: async (orderId: string): Promise<Order> => {
        const response = await OrdersService.convertDraftToOrder({
          id: orderId,
        });

        return mapApiOrderToModelOrder(response);
      },
      onSuccess: (_, orderId) => {
        // Інвалідуємо кеш після успішної конвертації
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS, 'drafts'] });
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ORDER_DETAILS, orderId] 
        });
      },
    });
  };

  return {
    useUpdateOrderStatus,
    useCompleteOrder,
    useConvertDraftToOrder,
  };
};
