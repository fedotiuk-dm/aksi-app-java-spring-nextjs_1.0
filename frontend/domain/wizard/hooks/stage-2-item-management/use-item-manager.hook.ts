/**
 * @fileoverview Хук менеджера предметів - координатор CRUD операцій
 * @module domain/wizard/hooks/stage-2
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { ItemManagerService } from '../../services/stage-2-item-management';
import { useWizardStore } from '../../store';

import type { WizardOrderItem } from '../../adapters/order';

// 🔑 Константи для query keys та повідомлень
const QUERY_KEY_ORDER_ITEMS = 'wizard-order-items';
const ERROR_NO_ORDER_ID = 'Не знайдено ідентифікатор замовлення';

/**
 * Стан редагування предмета
 */
interface ItemEditingState {
  isEditing: boolean;
  editingItemId: string | null;
  editingItemData: WizardOrderItem | null;
}

/**
 * Хук для менеджера предметів
 * 🗂️ Координатор: TanStack Query + Zustand + ItemManagerService
 */
export const useItemManager = () => {
  const queryClient = useQueryClient();

  // 🏪 Zustand - глобальний стан
  const {
    selectedClient,
    selectedBranch,
    isItemWizardActive,
    startItemWizard,
    completeItemWizard,
    addError,
    addWarning,
    markUnsavedChanges,
  } = useWizardStore();

  // ⚙️ Сервіс
  const itemManagerService = useMemo(() => new ItemManagerService(), []);

  // 📋 Завантаження списку предметів (якщо є чернетка замовлення)
  const {
    data: items = [],
    isLoading: isLoadingItems,
    error: itemsError,
    refetch: refetchItems,
  } = useQuery({
    queryKey: [QUERY_KEY_ORDER_ITEMS, selectedClient?.id],
    queryFn: () => {
      if (!selectedClient?.id) return [];
      return itemManagerService.getOrderItems(selectedClient.id);
    },
    enabled: !!selectedClient?.id,
    staleTime: 30000, // 30 секунд кеш
    gcTime: 300000, // 5 хвилин в кеші
  });

  // ➕ Додавання нового предмета
  const addItemMutation = useMutation({
    mutationFn: ({ orderId, itemData }: { orderId: string; itemData: Partial<WizardOrderItem> }) =>
      itemManagerService.addItem(orderId, itemData),
    onSuccess: (newItem) => {
      if (newItem) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ORDER_ITEMS] });
        addWarning('Предмет додано до замовлення');
        markUnsavedChanges();
        completeItemWizard(); // Закриваємо підвізард
      }
    },
    onError: (error) => {
      addError(`Помилка додавання предмета: ${error.message}`);
    },
  });

  // ✏️ Оновлення предмета
  const updateItemMutation = useMutation({
    mutationFn: ({
      orderId,
      itemId,
      itemData,
    }: {
      orderId: string;
      itemId: string;
      itemData: Partial<WizardOrderItem>;
    }) => itemManagerService.updateItem(orderId, itemId, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ORDER_ITEMS] });
      addWarning('Предмет оновлено');
      markUnsavedChanges();
      completeItemWizard(); // Закриваємо підвізард
    },
    onError: (error) => {
      addError(`Помилка оновлення предмета: ${error.message}`);
    },
  });

  // 🗑️ Видалення предмета
  const deleteItemMutation = useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: string; itemId: string }) =>
      itemManagerService.deleteItem(orderId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ORDER_ITEMS] });
      addWarning('Предмет видалено з замовлення');
      markUnsavedChanges();
    },
    onError: (error) => {
      addError(`Помилка видалення предмета: ${error.message}`);
    },
  });

  // 🗂️ Методи управління
  const startAddingItem = useCallback(() => {
    startItemWizard();
  }, [startItemWizard]);

  const startEditingItem = useCallback(
    (item: WizardOrderItem) => {
      // TODO: Set editing item data in wizard store or local state
      startItemWizard();
    },
    [startItemWizard]
  );

  const cancelItemOperation = useCallback(() => {
    completeItemWizard();
  }, [completeItemWizard]);

  const addItem = useCallback(
    (itemData: Partial<WizardOrderItem>) => {
      const orderId = selectedClient?.id;
      if (!orderId) {
        addError(ERROR_NO_ORDER_ID);
        return;
      }
      addItemMutation.mutate({ orderId, itemData });
    },
    [addItemMutation, selectedClient?.id, addError]
  );

  const updateItem = useCallback(
    (itemId: string, itemData: Partial<WizardOrderItem>) => {
      const orderId = selectedClient?.id;
      if (!orderId) {
        addError(ERROR_NO_ORDER_ID);
        return;
      }
      updateItemMutation.mutate({ orderId, itemId, itemData });
    },
    [updateItemMutation, selectedClient?.id, addError]
  );

  const deleteItem = useCallback(
    (itemId: string) => {
      const orderId = selectedClient?.id;
      if (!orderId) {
        addError(ERROR_NO_ORDER_ID);
        return;
      }
      deleteItemMutation.mutate({ orderId, itemId });
    },
    [deleteItemMutation, selectedClient?.id, addError]
  );

  // 📊 Розрахунки та статистика
  const calculations = useMemo(() => {
    const totalItems = items.length;
    const totalAmount = items.reduce((sum, item) => sum + (item.finalPrice || 0), 0);
    const averageItemPrice = totalItems > 0 ? totalAmount / totalItems : 0;

    return {
      totalItems,
      totalAmount,
      averageItemPrice,
      hasMinimumItems: totalItems >= 1, // Мінімум 1 предмет для продовження
    };
  }, [items]);

  // ✅ Валідація стану
  const validationState = useMemo(() => {
    const isValid = calculations.hasMinimumItems && !!selectedBranch;

    return {
      isValid,
      canProceed: isValid && !isItemWizardActive,
      errors: !calculations.hasMinimumItems
        ? ['Додайте принаймні один предмет до замовлення']
        : !selectedBranch
          ? ['Оберіть філію перед додаванням предметів']
          : [],
      warnings: isItemWizardActive ? ['Завершіть додавання предмета для продовження'] : [],
    };
  }, [calculations.hasMinimumItems, selectedBranch, isItemWizardActive]);

  return {
    // 📋 Стан предметів
    items,
    isLoadingItems,
    itemsError,

    // 🔄 Стани операцій
    isAddingItem: addItemMutation.isPending,
    isUpdatingItem: updateItemMutation.isPending,
    isDeletingItem: deleteItemMutation.isPending,
    isItemWizardActive,

    // 🗂️ Методи управління
    startAddingItem,
    startEditingItem,
    cancelItemOperation,
    addItem,
    updateItem,
    deleteItem,
    refetchItems,

    // 📊 Розрахунки
    calculations,

    // ✅ Валідація
    validationState,
  };
};
