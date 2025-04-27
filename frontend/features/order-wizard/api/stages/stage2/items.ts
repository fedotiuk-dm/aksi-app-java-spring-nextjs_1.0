import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrdersService } from '@/lib/api';
import { OrderItem } from '../../../model/types';
import { QUERY_KEYS } from '../../helpers/query-keys';
import { mapApiItemToModelItem, mapModelItemToApiItem } from '../../helpers/mappers';

/**
 * Хук для роботи з предметами замовлення (етап 2.1)
 */
export const useOrderItems = () => {
  const queryClient = useQueryClient();

  /**
   * Отримання всіх предметів замовлення
   */
  const useOrderItemsList = (orderId: string | undefined) => {
    return useQuery({
      queryKey: [QUERY_KEYS.ORDER_ITEMS, orderId],
      queryFn: async (): Promise<OrderItem[]> => {
        if (!orderId) return [];
        
        try {
          const response = await OrdersService.getOrderItems({
            orderId,
          });
          
          return response.map(mapApiItemToModelItem);
        } catch (error) {
          console.error('Помилка при отриманні предметів замовлення:', error);
          return [];
        }
      },
      enabled: !!orderId,
    });
  };

  /**
   * Отримання конкретного предмета замовлення
   */
  const useOrderItemDetails = (orderId: string | undefined, itemId: string | undefined) => {
    return useQuery({
      queryKey: [QUERY_KEYS.ORDER_ITEM_DETAILS, orderId, itemId],
      queryFn: async (): Promise<OrderItem | null> => {
        if (!orderId || !itemId) return null;
        
        try {
          const response = await OrdersService.getOrderItem({
            orderId,
            itemId,
          });
          
          return mapApiItemToModelItem(response);
        } catch (error) {
          console.error('Помилка при отриманні предмета замовлення:', error);
          return null;
        }
      },
      enabled: !!orderId && !!itemId,
    });
  };

  /**
   * Додавання нового предмета до замовлення
   */
  const useAddOrderItem = () => {
    return useMutation({
      mutationFn: async ({ 
        orderId, 
        item 
      }: { 
        orderId: string, 
        item: Omit<OrderItem, 'id'> 
      }): Promise<OrderItem> => {
        const apiItem = mapModelItemToApiItem(item as OrderItem);
        
        // Видаляємо id, щоб API згенерувало новий
        delete apiItem.id;
        
        const response = await OrdersService.addOrderItem({
          orderId,
          requestBody: apiItem,
        });
        
        return mapApiItemToModelItem(response);
      },
      onSuccess: (_, variables) => {
        // Інвалідуємо кеш після успішного додавання
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ORDER_ITEMS, variables.orderId] 
        });
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ORDER_DETAILS, variables.orderId] 
        });
      },
    });
  };

  /**
   * Оновлення існуючого предмета замовлення
   */
  const useUpdateOrderItem = () => {
    return useMutation({
      mutationFn: async ({ 
        orderId, 
        itemId,
        item 
      }: { 
        orderId: string, 
        itemId: string,
        item: OrderItem 
      }): Promise<OrderItem> => {
        const apiItem = mapModelItemToApiItem(item);
        
        const response = await OrdersService.updateOrderItem({
          orderId,
          itemId,
          requestBody: apiItem,
        });
        
        return mapApiItemToModelItem(response);
      },
      onSuccess: (_, variables) => {
        // Інвалідуємо кеш після успішного оновлення
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ORDER_ITEMS, variables.orderId] 
        });
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ORDER_ITEM_DETAILS, variables.orderId, variables.itemId] 
        });
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ORDER_DETAILS, variables.orderId] 
        });
      },
    });
  };

  /**
   * Видалення предмета з замовлення
   */
  const useDeleteOrderItem = () => {
    return useMutation({
      mutationFn: async ({ 
        orderId, 
        itemId 
      }: { 
        orderId: string, 
        itemId: string 
      }): Promise<void> => {
        await OrdersService.deleteOrderItem({
          orderId,
          itemId,
        });
      },
      onSuccess: (_, variables) => {
        // Інвалідуємо кеш після успішного видалення
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ORDER_ITEMS, variables.orderId] 
        });
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ORDER_DETAILS, variables.orderId] 
        });
      },
    });
  };

  return {
    // Запити для отримання даних
    useOrderItemsList,
    useOrderItemDetails,
    
    // Мутації для зміни даних
    useAddOrderItem,
    useUpdateOrderItem,
    useDeleteOrderItem,
  };
};
