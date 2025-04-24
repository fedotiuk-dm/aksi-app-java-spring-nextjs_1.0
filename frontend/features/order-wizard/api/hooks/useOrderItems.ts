/**
 * Хуки для роботи з API елементів замовлення
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import { OrderItemDetailsService } from '@/lib/api';
import { OrderItemPhotosApiService } from '@/lib/api';
import { OrdersService } from '@/lib/api';
import type { OrderItemCreateRequest } from '@/lib/api';
import type { OrderItemDefectCreateRequest } from '@/lib/api';
import type { OrderItemStainCreateRequest } from '@/lib/api';

/**
 * Хук для отримання елемента замовлення за ID
 * 
 * Нотатка: В API немає прямого методу для отримання одного елемента замовлення за ID.
 * В реальному сценарії треба отримати все замовлення і знайти потрібний елемент.
 */
export const useGetOrderItem = (orderId?: string, itemId?: string) => {
  return useQuery({
    queryKey: ['orderItem', orderId, itemId],
    queryFn: async () => {
      if (!orderId || !itemId) {
        throw new Error('Order ID and Order item ID are required');
      }
      // Отримуємо замовлення за ID
      const result = await OrdersService.getOrderById({ id: orderId });
      // Знаходимо потрібний елемент замовлення
      const orderItem = result.items?.find(item => item.id === itemId);
      if (!orderItem) {
        throw new Error('Order item not found');
      }
      return orderItem;
    },
    enabled: !!orderId && !!itemId,
  });
};

/**
 * Хук для додавання дефекту до елемента замовлення
 */
export const useAddOrderItemDefect = () => {
  return useMutation({
    mutationFn: async ({ 
      itemId, 
      defect 
    }: { 
      itemId: string; 
      defect: OrderItemDefectCreateRequest 
    }) => {
      const result = await OrderItemDetailsService.addDefectToItem({
        itemId,
        requestBody: defect,
      });
      return result;
    },
  });
};

/**
 * Хук для додавання забруднення до елемента замовлення
 */
export const useAddOrderItemStain = () => {
  return useMutation({
    mutationFn: async ({ 
      itemId, 
      stain 
    }: { 
      itemId: string; 
      stain: OrderItemStainCreateRequest 
    }) => {
      const result = await OrderItemDetailsService.addStainToItem({
        itemId,
        requestBody: stain,
      });
      return result;
    },
  });
};

/**
 * Хук для розрахунку вартості елемента замовлення
 * 
 * Для розрахунку вартості використовуємо метод оновлення предмета замовлення
 */
export const useCalculateOrderItemPrice = () => {
  return useMutation({
    mutationFn: async ({ 
      orderId, 
      itemId, 
      updateData 
    }: { 
      orderId: string; 
      itemId: string; 
      updateData: OrderItemCreateRequest 
    }) => {
      // Використовуємо метод оновлення елемента, щоб отримати оновлену ціну
      const result = await OrdersService.updateOrderItem({
        orderId,
        itemId,
        requestBody: updateData,
      });
      // Знаходимо оновлений елемент
      const updatedItem = result.items?.find(item => item.id === itemId);
      return updatedItem;
    },
  });
};

/**
 * Хук для завантаження фотографії елемента замовлення
 */
export const useUploadOrderItemPhoto = () => {
  return useMutation({
    mutationFn: async ({ 
      itemId, 
      file,
      description
    }: { 
      itemId: string; 
      file: File;
      description?: string;
    }) => {
      // Створюємо об'єкт з правильною структурою відповідно до API
      const photoData = {
        file,
        description
      };
      
      const result = await OrderItemPhotosApiService.uploadPhoto({
        itemId,
        formData: photoData,
      });
      return result;
    },
  });
};

/**
 * Хук для отримання фотографій елемента замовлення
 */
export const useGetOrderItemPhotos = (itemId?: string) => {
  return useQuery({
    queryKey: ['orderItemPhotos', itemId],
    queryFn: async () => {
      if (!itemId) {
        throw new Error('Order item ID is required');
      }
      const result = await OrderItemPhotosApiService.getItemPhotos({ itemId });
      return result;
    },
    enabled: !!itemId,
  });
};
