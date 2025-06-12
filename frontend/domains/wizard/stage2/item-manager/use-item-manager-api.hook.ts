/**
 * @fileoverview API хук для домену "Менеджер предметів Stage2"
 *
 * Відповідальність: тільки API операції через Orval хуки
 * Принцип: Single Responsibility Principle
 */

import { useMemo } from 'react';

// Готові Orval хуки
import {
  useStage2InitializeItemManager,
  useStage2AddItemToOrder,
  useStage2UpdateItemInOrder,
  useStage2DeleteItemFromOrder,
  useStage2StartNewItemWizard,
  useStage2StartEditItemWizard,
} from '@/shared/api/generated/wizard/aksiApi';

/**
 * Хук для API операцій менеджера предметів
 * Інкапсулює всі Orval хуки та мутації
 */
export const useItemManagerAPI = (sessionId: string | null) => {
  // Мутації для дій
  const initializeManagerMutation = useStage2InitializeItemManager({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API Success - Item manager initialized:', data);
      },
      onError: (error) => {
        console.error('💥 API Error - Initialize manager failed:', error);
      },
    },
  });

  const addItemMutation = useStage2AddItemToOrder({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API Success - Item added to order:', data);
      },
      onError: (error) => {
        console.error('💥 API Error - Add item failed:', error);
      },
    },
  });

  const updateItemMutation = useStage2UpdateItemInOrder({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API Success - Item updated in order:', data);
      },
      onError: (error) => {
        console.error('💥 API Error - Update item failed:', error);
      },
    },
  });

  const deleteItemMutation = useStage2DeleteItemFromOrder({
    mutation: {
      onSuccess: () => {
        console.log('🎉 API Success - Item deleted from order');
      },
      onError: (error) => {
        console.error('💥 API Error - Delete item failed:', error);
      },
    },
  });

  const startNewItemWizardMutation = useStage2StartNewItemWizard({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API Success - New item wizard started:', data);
      },
      onError: (error) => {
        console.error('💥 API Error - Start new item wizard failed:', error);
      },
    },
  });

  const startEditItemWizardMutation = useStage2StartEditItemWizard({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API Success - Edit item wizard started:', data);
      },
      onError: (error) => {
        console.error('💥 API Error - Start edit item wizard failed:', error);
      },
    },
  });

  // API операції з перевіркою sessionId
  const operations = useMemo(
    () => ({
      // Ініціалізація менеджера предметів
      initializeManager: async (orderId: string) => {
        return await initializeManagerMutation.mutateAsync({
          orderId,
        });
      },

      // Додавання предмета до замовлення
      addItemToOrder: async (itemData: any) => {
        if (!sessionId) throw new Error('No session ID for add item');

        return await addItemMutation.mutateAsync({
          sessionId,
          data: itemData,
        });
      },

      // Оновлення предмета в замовленні
      updateItemInOrder: async (itemId: string, itemData: any) => {
        if (!sessionId) throw new Error('No session ID for update item');

        return await updateItemMutation.mutateAsync({
          sessionId,
          itemId,
          data: itemData,
        });
      },

      // Видалення предмета з замовлення
      deleteItemFromOrder: async (itemId: string) => {
        if (!sessionId) throw new Error('No session ID for delete item');

        return await deleteItemMutation.mutateAsync({
          sessionId,
          itemId,
        });
      },

      // Запуск візарда нового предмета
      startNewItemWizard: async () => {
        if (!sessionId) throw new Error('No session ID for new item wizard');

        return await startNewItemWizardMutation.mutateAsync({
          sessionId,
        });
      },

      // Запуск візарда редагування предмета
      startEditItemWizard: async (itemId: string) => {
        if (!sessionId) throw new Error('No session ID for edit item wizard');

        return await startEditItemWizardMutation.mutateAsync({
          sessionId,
          itemId,
        });
      },
    }),
    [
      sessionId,
      initializeManagerMutation,
      addItemMutation,
      updateItemMutation,
      deleteItemMutation,
      startNewItemWizardMutation,
      startEditItemWizardMutation,
    ]
  );

  // Групування даних з API (з мутацій)
  const data = useMemo(
    () => ({
      managerState: initializeManagerMutation.data,
      addedItem: addItemMutation.data,
      updatedItem: updateItemMutation.data,
      newItemWizardState: startNewItemWizardMutation.data,
      editItemWizardState: startEditItemWizardMutation.data,
    }),
    [
      initializeManagerMutation.data,
      addItemMutation.data,
      updateItemMutation.data,
      startNewItemWizardMutation.data,
      startEditItemWizardMutation.data,
    ]
  );

  // Стани завантаження
  const loading = useMemo(
    () => ({
      isInitializingManager: initializeManagerMutation.isPending,
      isAddingItem: addItemMutation.isPending,
      isUpdatingItem: updateItemMutation.isPending,
      isDeletingItem: deleteItemMutation.isPending,
      isStartingNewWizard: startNewItemWizardMutation.isPending,
      isStartingEditWizard: startEditItemWizardMutation.isPending,

      // Агреговані стани
      anyLoading:
        initializeManagerMutation.isPending ||
        addItemMutation.isPending ||
        updateItemMutation.isPending ||
        deleteItemMutation.isPending ||
        startNewItemWizardMutation.isPending ||
        startEditItemWizardMutation.isPending,
    }),
    [
      initializeManagerMutation.isPending,
      addItemMutation.isPending,
      updateItemMutation.isPending,
      deleteItemMutation.isPending,
      startNewItemWizardMutation.isPending,
      startEditItemWizardMutation.isPending,
    ]
  );

  return {
    operations,
    data,
    loading,
  };
};

export type UseItemManagerAPIReturn = ReturnType<typeof useItemManagerAPI>;
