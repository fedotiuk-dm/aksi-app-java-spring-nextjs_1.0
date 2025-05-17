import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrdersService } from '@/lib/api';
import type { CreateOrderRequest } from '@/lib/api';
import { Order } from '../../../model/types';
import { QUERY_KEYS } from '../../helpers/query-keys';
import { mapApiOrderToModelOrder, formatDate } from '../../helpers/mappers';
import { Defect } from '../../../model/schema/item-defects.schema';

/**
 * Хук для базових операцій із замовленнями
 */
export const useOrders = () => {
  const queryClient = useQueryClient();

  /**
   * Отримання списку всіх замовлень
   */
  const useAllOrders = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.ORDERS, 'all'],
      queryFn: async (): Promise<Order[]> => {
        try {
          const response = await OrdersService.getAllOrders();
          return response.map(mapApiOrderToModelOrder);
        } catch (error) {
          console.error('Помилка при отриманні списку замовлень:', error);
          return [];
        }
      },
    });
  };

  /**
   * Отримання списку активних замовлень
   */
  const useActiveOrders = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.ORDERS, 'active'],
      queryFn: async (): Promise<Order[]> => {
        try {
          const response = await OrdersService.getActiveOrders();
          return response.map(mapApiOrderToModelOrder);
        } catch (error) {
          console.error('Помилка при отриманні активних замовлень:', error);
          return [];
        }
      },
    });
  };

  /**
   * Отримання списку чернеток замовлень
   */
  const useDraftOrders = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.ORDERS, 'drafts'],
      queryFn: async (): Promise<Order[]> => {
        try {
          const response = await OrdersService.getDraftOrders();
          return response.map(mapApiOrderToModelOrder);
        } catch (error) {
          console.error('Помилка при отриманні чернеток замовлень:', error);
          return [];
        }
      },
    });
  };

  /**
   * Отримання замовлення за ID
   */
  const useOrderDetails = (orderId: string | undefined) => {
    return useQuery({
      queryKey: [QUERY_KEYS.ORDER_DETAILS, orderId],
      queryFn: async (): Promise<Order | null> => {
        if (!orderId) return null;

        try {
          const response = await OrdersService.getOrderById({
            id: orderId,
          });
          return mapApiOrderToModelOrder(response);
        } catch (error) {
          console.error('Помилка при отриманні замовлення:', error);
          return null;
        }
      },
      enabled: !!orderId,
    });
  };

  /**
   * Конвертує масив дефектів у рядок для API
   */
  const convertDefectsToString = (defects?: Defect[]) => {
    if (!defects || !Array.isArray(defects) || defects.length === 0) {
      return undefined;
    }

    try {
      // Конвертуємо масив дефектів у JSON рядок
      return JSON.stringify(defects);
    } catch (e) {
      console.error('Помилка при конвертації дефектів у рядок:', e);
      return undefined;
    }
  };

  /**
   * Створення нового замовлення
   */
  const useCreateOrder = () => {
    return useMutation({
      mutationFn: async (orderData: Omit<Order, 'id'>): Promise<Order> => {
        // Підготовка даних замовлення для API
        const apiOrderData: CreateOrderRequest = {
          clientId: orderData.clientId,
          tagNumber: orderData.tagNumber,
          items: orderData.items.map((item) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            category: item.category,
            color: item.color,
            material: item.material,
            defects: convertDefectsToString(item.defects),
            specialInstructions: item.specialInstructions,
          })),
          branchLocationId: orderData.branchLocationId, // Правильна назва поля в API
          expectedCompletionDate: formatDate(orderData.expectedCompletionDate),
          customerNotes: orderData.customerNotes,
          internalNotes: orderData.internalNotes,
          express: orderData.express,
          draft: orderData.draft,
        };

        const response = await OrdersService.createOrder({
          requestBody: apiOrderData,
        });

        return mapApiOrderToModelOrder(response);
      },
      onSuccess: () => {
        // Інвалідуємо кеш після успішного створення
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      },
    });
  };

  /**
   * Збереження чернетки замовлення
   */
  const useSaveOrderDraft = () => {
    return useMutation({
      mutationFn: async (orderData: Omit<Order, 'id'>): Promise<Order> => {
        // Підготовка даних замовлення для API
        const apiOrderData: CreateOrderRequest = {
          clientId: orderData.clientId,
          tagNumber: orderData.tagNumber,
          items: orderData.items.map((item) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            category: item.category,
            color: item.color,
            material: item.material,
            defects: convertDefectsToString(item.defects),
            specialInstructions: item.specialInstructions,
          })),
          branchLocationId: orderData.branchLocationId, // Правильна назва поля в API
          expectedCompletionDate: formatDate(orderData.expectedCompletionDate),
          customerNotes: orderData.customerNotes,
          internalNotes: orderData.internalNotes,
          express: orderData.express,
          draft: true, // Завжди чернетка
        };

        const response = await OrdersService.saveOrderDraft({
          requestBody: apiOrderData,
        });

        return mapApiOrderToModelOrder(response);
      },
      onSuccess: () => {
        // Інвалідуємо кеш після успішного збереження
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORDERS, 'drafts'],
        });
      },
    });
  };

  /**
   * Скасування замовлення
   */
  const useCancelOrder = () => {
    return useMutation({
      mutationFn: async (orderId: string): Promise<void> => {
        await OrdersService.cancelOrder({
          id: orderId,
        });
      },
      onSuccess: (_, orderId) => {
        // Інвалідуємо кеш після успішного скасування
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORDER_DETAILS, orderId],
        });
      },
    });
  };

  return {
    // Запити для отримання даних
    useAllOrders,
    useActiveOrders,
    useDraftOrders,
    useOrderDetails,

    // Мутації для зміни даних
    useCreateOrder,
    useSaveOrderDraft,
    useCancelOrder,
  };
};
