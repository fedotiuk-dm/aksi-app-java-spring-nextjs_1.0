import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderItemPhotosService } from '@/lib/api';
import type { OrderItemPhotoDTO } from '@/lib/api';
import { QUERY_KEYS } from '../../helpers/query-keys';

/**
 * Хук для роботи з фотодокументацією предметів замовлення (етап 2.5)
 */
export const useOrderItemPhotos = () => {
  const queryClient = useQueryClient();

  /**
   * Отримання всіх фотографій для предмета замовлення
   */
  const usePhotos = (itemId: string | undefined) => {
    return useQuery<OrderItemPhotoDTO[]>({
      queryKey: [QUERY_KEYS.ITEM_PHOTOS, itemId],
      queryFn: async () => {
        if (!itemId) {
          return [];
        }
        
        try {
          return await OrderItemPhotosService.getPhotosByItemId({
            itemId,
          });
        } catch (error) {
          console.error('Помилка при отриманні фотографій предмета:', error);
          return [];
        }
      },
      enabled: !!itemId,
    });
  };

  /**
   * Отримання деталей конкретної фотографії
   */
  const usePhotoDetails = (itemId: string | undefined, photoId: string | undefined) => {
    return useQuery<OrderItemPhotoDTO | null>({
      queryKey: [QUERY_KEYS.ITEM_PHOTOS, itemId, photoId],
      queryFn: async () => {
        if (!itemId || !photoId) {
          return null;
        }
        
        try {
          return await OrderItemPhotosService.getPhotoById({
            itemId,
            photoId,
          });
        } catch (error) {
          console.error('Помилка при отриманні деталей фотографії:', error);
          return null;
        }
      },
      enabled: !!itemId && !!photoId,
    });
  };

  /**
   * Завантаження нової фотографії
   */
  const useUploadPhoto = () => {
    return useMutation<
      OrderItemPhotoDTO,
      Error,
      { itemId: string, description?: string, file: File }
    >({
      mutationFn: async ({ itemId, description, file }) => {
        // Створюємо FormData для завантаження файлу
        const formData = {
          file: file as unknown as Blob, // Приведення типу для сумісності з API
        };
        
        try {
          return await OrderItemPhotosService.uploadPhoto({
            itemId,
            description,
            formData,
          });
        } catch (error) {
          console.error('Помилка при завантаженні фотографії:', error);
          throw error;
        }
      },
      onSuccess: (_, variables) => {
        // Інвалідуємо кеш після успішного завантаження
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ITEM_PHOTOS, variables.itemId] 
        });
      },
    });
  };

  /**
   * Видалення фотографії
   */
  const useDeletePhoto = () => {
    return useMutation<
      void,
      Error,
      { itemId: string, photoId: string }
    >({
      mutationFn: async ({ itemId, photoId }) => {
        try {
          await OrderItemPhotosService.deletePhoto({
            itemId,
            photoId,
          });
        } catch (error) {
          console.error('Помилка при видаленні фотографії:', error);
          throw error;
        }
      },
      onSuccess: (_, variables) => {
        // Інвалідуємо кеш після успішного видалення
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ITEM_PHOTOS, variables.itemId] 
        });
      },
    });
  };

  return {
    usePhotos,
    usePhotoDetails,
    useUploadPhoto,
    useDeletePhoto,
  };
};
