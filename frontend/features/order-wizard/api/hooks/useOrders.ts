/**
 * Хуки для роботи з API замовлень
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import { OrdersService } from '@/lib/api';
import { OrderDraftsService } from '@/lib/api';
import type { OrderCreateRequest } from '@/lib/api';
import type { OrderDraftRequest } from '@/lib/api';
import type { Pageable } from '@/lib/api';

/**
 * Хук для створення нового замовлення
 */
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (orderData: OrderCreateRequest) => {
      const result = await OrdersService.createOrder({ requestBody: orderData });
      return result;
    },
  });
};

/**
 * Хук для отримання замовлення за ID
 */
export const useGetOrder = (orderId?: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) {
        throw new Error('Order ID is required');
      }
      const result = await OrdersService.getOrderById({ id: orderId });
      return result;
    },
    enabled: !!orderId,
  });
};

/**
 * Хук для пошуку замовлень
 */
export const useSearchOrders = () => {
  return useMutation({
    mutationFn: async (pageable: Pageable) => {
      const result = await OrdersService.getAllOrders({ pageable });
      return result;
    },
  });
};

/**
 * Хук для створення чернетки замовлення
 */
export const useCreateOrderDraft = () => {
  return useMutation({
    mutationFn: async (draftData: OrderDraftRequest) => {
      const result = await OrderDraftsService.createDraft({ requestBody: draftData });
      return result;
    },
  });
};

/**
 * Хук для отримання чернетки замовлення за ID
 */
export const useGetOrderDraft = (draftId?: string) => {
  return useQuery({
    queryKey: ['orderDraft', draftId],
    queryFn: async () => {
      if (!draftId) {
        throw new Error('Draft ID is required');
      }
      const result = await OrderDraftsService.getDraftById({ id: draftId });
      return result;
    },
    enabled: !!draftId,
  });
};

/**
 * Хук для оновлення чернетки замовлення
 */
export const useUpdateOrderDraft = () => {
  return useMutation({
    mutationFn: async ({ id, draftData }: { id: string; draftData: OrderDraftRequest }) => {
      const result = await OrderDraftsService.updateDraft({ id, requestBody: draftData });
      return result;
    },
  });
};
