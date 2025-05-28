/**
 * @fileoverview Items Manager Slice Store - Zustand store для управління предметами
 * @module domain/wizard/store/stage-2
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { OrderItemData } from '../../types';

/**
 * Стан менеджера предметів (Stage 2.0 + підвізард)
 */
interface ItemsManagerState {
  // Order items collection
  orderItems: OrderItemData[];
  totalItemsCount: number;
  totalOrderAmount: number;

  // Current item editing (підвізард предметів)
  currentItemId: string | null;
  currentItemData: Partial<OrderItemData> | null;
  isItemWizardActive: boolean;

  // Item validation
  itemValidationErrors: Record<string, string[]>;
  isCurrentItemValid: boolean;

  // Items operations
  isAddingItem: boolean;
  isUpdatingItem: boolean;
  isDeletingItem: boolean;
  operationError: string | null;
}

/**
 * Дії для управління предметами
 */
interface ItemsManagerActions {
  // Order items collection actions
  setOrderItems: (items: OrderItemData[]) => void;
  addOrderItem: (item: OrderItemData) => void;
  updateOrderItem: (itemId: string, item: Partial<OrderItemData>) => void;
  removeOrderItem: (itemId: string) => void;
  clearOrderItems: () => void;

  // Current item editing actions (підвізард)
  startEditingItem: (itemId?: string) => void;
  setCurrentItemData: (data: Partial<OrderItemData>) => void;
  updateCurrentItemField: (field: keyof OrderItemData, value: any) => void;
  completeItemEditing: () => void;
  cancelItemEditing: () => void;

  // Item validation actions
  setItemValidationErrors: (itemId: string, errors: string[]) => void;
  clearItemValidationErrors: (itemId: string) => void;
  setCurrentItemValid: (isValid: boolean) => void;

  // Items operations actions
  setAddingItem: (isAdding: boolean) => void;
  setUpdatingItem: (isUpdating: boolean) => void;
  setDeletingItem: (isDeleting: boolean) => void;
  setOperationError: (error: string | null) => void;

  // Calculated values actions
  recalculateTotals: () => void;

  // Reset actions
  resetItemsManager: () => void;
}

/**
 * Початковий стан менеджера предметів
 */
const initialItemsManagerState: ItemsManagerState = {
  orderItems: [],
  totalItemsCount: 0,
  totalOrderAmount: 0,
  currentItemId: null,
  currentItemData: null,
  isItemWizardActive: false,
  itemValidationErrors: {},
  isCurrentItemValid: false,
  isAddingItem: false,
  isUpdatingItem: false,
  isDeletingItem: false,
  operationError: null,
};

/**
 * Items Manager Slice Store
 *
 * Відповідальність:
 * - Управління колекцією предметів замовлення
 * - Поточний предмет в редагуванні (підвізард)
 * - Валідація предметів
 * - Операції додавання/редагування/видалення
 * - Розрахунок загальних сум
 *
 * Інтеграція:
 * - Orval типи для OrderItemData
 * - Сервіси розрахунку ціни
 * - XState для навігації підвізарда
 * - TanStack Query для API операцій
 */
export const useItemsManagerStore = create<ItemsManagerState & ItemsManagerActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialItemsManagerState,

      // Order items collection actions
      setOrderItems: (items) => {
        set({ orderItems: items }, false, 'itemsManager/setOrderItems');
        get().recalculateTotals();
      },

      addOrderItem: (item) => {
        set(
          (state) => ({ orderItems: [...state.orderItems, item] }),
          false,
          'itemsManager/addOrderItem'
        );
        get().recalculateTotals();
      },

      updateOrderItem: (itemId, itemUpdate) => {
        set(
          (state) => ({
            orderItems: state.orderItems.map((item) =>
              item.id === itemId ? { ...item, ...itemUpdate } : item
            ),
          }),
          false,
          'itemsManager/updateOrderItem'
        );
        get().recalculateTotals();
      },

      removeOrderItem: (itemId) => {
        set(
          (state) => ({
            orderItems: state.orderItems.filter((item) => item.id !== itemId),
            // Очищуємо валідаційні помилки для видаленого предмета
            itemValidationErrors: Object.fromEntries(
              Object.entries(state.itemValidationErrors).filter(([id]) => id !== itemId)
            ),
          }),
          false,
          'itemsManager/removeOrderItem'
        );
        get().recalculateTotals();
      },

      clearOrderItems: () => {
        set(
          {
            orderItems: [],
            itemValidationErrors: {},
            currentItemId: null,
            currentItemData: null,
            isItemWizardActive: false,
          },
          false,
          'itemsManager/clearOrderItems'
        );
        get().recalculateTotals();
      },

      // Current item editing actions (підвізард)
      startEditingItem: (itemId) => {
        const state = get();
        const existingItem = itemId ? state.orderItems.find((item) => item.id === itemId) : null;

        set(
          {
            currentItemId: itemId || null,
            currentItemData: existingItem || {},
            isItemWizardActive: true,
            isCurrentItemValid: false,
            operationError: null,
          },
          false,
          'itemsManager/startEditingItem'
        );
      },

      setCurrentItemData: (data) => {
        set({ currentItemData: data }, false, 'itemsManager/setCurrentItemData');
      },

      updateCurrentItemField: (field, value) => {
        set(
          (state) => ({
            currentItemData: state.currentItemData
              ? { ...state.currentItemData, [field]: value }
              : { [field]: value },
          }),
          false,
          'itemsManager/updateCurrentItemField'
        );
      },

      completeItemEditing: () => {
        const state = get();
        if (!state.currentItemData || !state.isCurrentItemValid) return;

        const isNewItem = !state.currentItemId;
        const itemData = state.currentItemData as OrderItemData;

        if (isNewItem) {
          // Додаємо новий предмет
          get().addOrderItem({ ...itemData, id: Date.now().toString() });
        } else {
          // Оновлюємо існуючий предмет
          if (state.currentItemId) {
            get().updateOrderItem(state.currentItemId, itemData);
          }
        }

        // Закриваємо підвізард
        set(
          {
            currentItemId: null,
            currentItemData: null,
            isItemWizardActive: false,
            isCurrentItemValid: false,
          },
          false,
          'itemsManager/completeItemEditing'
        );
      },

      cancelItemEditing: () => {
        set(
          {
            currentItemId: null,
            currentItemData: null,
            isItemWizardActive: false,
            isCurrentItemValid: false,
            operationError: null,
          },
          false,
          'itemsManager/cancelItemEditing'
        );
      },

      // Item validation actions
      setItemValidationErrors: (itemId, errors) => {
        set(
          (state) => ({
            itemValidationErrors: {
              ...state.itemValidationErrors,
              [itemId]: errors,
            },
          }),
          false,
          'itemsManager/setItemValidationErrors'
        );
      },

      clearItemValidationErrors: (itemId) => {
        set(
          (state) => {
            const { [itemId]: removed, ...rest } = state.itemValidationErrors;
            return { itemValidationErrors: rest };
          },
          false,
          'itemsManager/clearItemValidationErrors'
        );
      },

      setCurrentItemValid: (isValid) => {
        set({ isCurrentItemValid: isValid }, false, 'itemsManager/setCurrentItemValid');
      },

      // Items operations actions
      setAddingItem: (isAdding) => {
        set({ isAddingItem: isAdding }, false, 'itemsManager/setAddingItem');
      },

      setUpdatingItem: (isUpdating) => {
        set({ isUpdatingItem: isUpdating }, false, 'itemsManager/setUpdatingItem');
      },

      setDeletingItem: (isDeleting) => {
        set({ isDeletingItem: isDeleting }, false, 'itemsManager/setDeletingItem');
      },

      setOperationError: (error) => {
        set({ operationError: error }, false, 'itemsManager/setOperationError');
      },

      // Calculated values actions
      recalculateTotals: () => {
        const state = get();
        const totalItemsCount = state.orderItems.length;
        const totalOrderAmount = state.orderItems.reduce(
          (sum, item) => sum + (item.totalPrice || 0),
          0
        );

        set({ totalItemsCount, totalOrderAmount }, false, 'itemsManager/recalculateTotals');
      },

      // Reset actions
      resetItemsManager: () => {
        set(initialItemsManagerState, false, 'itemsManager/resetItemsManager');
      },
    }),
    {
      name: 'items-manager-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type ItemsManagerStore = ReturnType<typeof useItemsManagerStore>;
