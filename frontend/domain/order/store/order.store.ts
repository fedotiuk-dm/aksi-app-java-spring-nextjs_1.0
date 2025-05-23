/**
 * Zustand Store для Order домену
 * Управляє станом поточного замовлення та загальними даними
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { Order, OrderItem, OrderStatus } from '../types';

/**
 * Стан Order Store
 */
export interface OrderState {
  // Поточне замовлення
  currentOrder: Order | null;

  // Стан завантаження
  isLoading: boolean;

  // Помилки
  error: string | null;

  // Історія операцій
  operationHistory: string[];

  // Кеш замовлень
  ordersCache: Record<string, Order>;
}

/**
 * Дії Order Store
 */
export interface OrderActions {
  // Керування поточним замовленням
  setCurrentOrder: (order: Order | null) => void;
  clearCurrentOrder: () => void;

  // Керування станом завантаження
  setIsLoading: (loading: boolean) => void;

  // Керування помилками
  setError: (error: string | null) => void;
  clearError: () => void;

  // Керування предметами в поточному замовленні
  addItemToCurrentOrder: (item: OrderItem) => void;
  updateItemInCurrentOrder: (itemId: string, updates: Partial<OrderItem>) => void;
  removeItemFromCurrentOrder: (itemId: string) => void;

  // Оновлення властивостей замовлення
  updateCurrentOrderStatus: (status: OrderStatus) => void;
  updateCurrentOrderNotes: (notes: string) => void;
  updateCurrentOrderFinancials: (updates: {
    totalAmount?: number;
    discountAmount?: number;
    finalAmount?: number;
    prepaymentAmount?: number;
    balanceAmount?: number;
  }) => void;

  // Керування кешем
  addToCache: (order: Order) => void;
  removeFromCache: (orderId: string) => void;
  clearCache: () => void;

  // Історія операцій
  addToHistory: (operation: string) => void;
  clearHistory: () => void;

  // Скидання стану
  reset: () => void;
}

/**
 * Початковий стан
 */
const initialState: OrderState = {
  currentOrder: null,
  isLoading: false,
  error: null,
  operationHistory: [],
  ordersCache: {},
};

/**
 * Order Store
 */
export const useOrderStore = create<OrderState & OrderActions>()(
  subscribeWithSelector((set, get) => ({
    // Початковий стан
    ...initialState,

    // === КЕРУВАННЯ ПОТОЧНИМ ЗАМОВЛЕННЯМ ===

    setCurrentOrder: (order) => {
      set({ currentOrder: order });

      if (order) {
        get().addToCache(order);
        get().addToHistory(`Встановлено поточне замовлення: ${order.receiptNumber}`);
      }
    },

    clearCurrentOrder: () => {
      const current = get().currentOrder;
      set({ currentOrder: null });

      if (current) {
        get().addToHistory(`Очищено поточне замовлення: ${current.receiptNumber}`);
      }
    },

    // === КЕРУВАННЯ СТАНОМ ЗАВАНТАЖЕННЯ ===

    setIsLoading: (loading) => set({ isLoading: loading }),

    // === КЕРУВАННЯ ПОМИЛКАМИ ===

    setError: (error) => {
      set({ error });

      if (error) {
        get().addToHistory(`Помилка: ${error}`);
      }
    },

    clearError: () => set({ error: null }),

    // === КЕРУВАННЯ ПРЕДМЕТАМИ ===

    addItemToCurrentOrder: (item) => {
      const { currentOrder } = get();
      if (!currentOrder) return;

      const updatedOrder: Order = {
        ...currentOrder,
        items: [...(currentOrder.items || []), item],
        itemsCount: (currentOrder.items || []).length + 1,
        updatedDate: new Date(),
      };

      get().setCurrentOrder(updatedOrder);
      get().addToHistory(`Додано предмет: ${item.name}`);
    },

    updateItemInCurrentOrder: (itemId, updates) => {
      const { currentOrder } = get();
      if (!currentOrder || !currentOrder.items) return;

      const updatedItems = currentOrder.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      );

      const updatedOrder: Order = {
        ...currentOrder,
        items: updatedItems,
        updatedDate: new Date(),
      };

      get().setCurrentOrder(updatedOrder);
      get().addToHistory(`Оновлено предмет: ${itemId}`);
    },

    removeItemFromCurrentOrder: (itemId) => {
      const { currentOrder } = get();
      if (!currentOrder || !currentOrder.items) return;

      const itemToRemove = currentOrder.items.find((item) => item.id === itemId);
      const updatedItems = currentOrder.items.filter((item) => item.id !== itemId);

      const updatedOrder: Order = {
        ...currentOrder,
        items: updatedItems,
        itemsCount: Math.max(0, (currentOrder.items || []).length - 1),
        updatedDate: new Date(),
      };

      get().setCurrentOrder(updatedOrder);

      if (itemToRemove) {
        get().addToHistory(`Видалено предмет: ${itemToRemove.name}`);
      }
    },

    // === ОНОВЛЕННЯ ВЛАСТИВОСТЕЙ ЗАМОВЛЕННЯ ===

    updateCurrentOrderStatus: (status) => {
      const { currentOrder } = get();
      if (!currentOrder) return;

      const updatedOrder: Order = {
        ...currentOrder,
        status,
        updatedDate: new Date(),
      };

      get().setCurrentOrder(updatedOrder);
      get().addToHistory(`Змінено статус: ${status}`);
    },

    updateCurrentOrderNotes: (notes) => {
      const { currentOrder } = get();
      if (!currentOrder) return;

      const updatedOrder: Order = {
        ...currentOrder,
        customerNotes: notes,
        updatedDate: new Date(),
      };

      get().setCurrentOrder(updatedOrder);
      get().addToHistory('Оновлено примітки');
    },

    updateCurrentOrderFinancials: (updates) => {
      const { currentOrder } = get();
      if (!currentOrder) return;

      const updatedOrder: Order = {
        ...currentOrder,
        ...updates,
        updatedDate: new Date(),
      };

      get().setCurrentOrder(updatedOrder);
      get().addToHistory('Оновлено фінансову інформацію');
    },

    // === КЕРУВАННЯ КЕШЕМ ===

    addToCache: (order) => {
      if (!order.id) return;

      set((state) => ({
        ordersCache: {
          ...state.ordersCache,
          [order.id as string]: order,
        },
      }));
    },

    removeFromCache: (orderId) => {
      set((state) => {
        const { [orderId]: removed, ...rest } = state.ordersCache;
        return { ordersCache: rest };
      });
    },

    clearCache: () => set({ ordersCache: {} }),

    // === ІСТОРІЯ ОПЕРАЦІЙ ===

    addToHistory: (operation) => {
      const timestamp = new Date().toLocaleTimeString('uk-UA');
      const logEntry = `${timestamp}: ${operation}`;

      set((state) => ({
        operationHistory: [...state.operationHistory, logEntry].slice(-50), // Зберігаємо останні 50 операцій
      }));
    },

    clearHistory: () => set({ operationHistory: [] }),

    // === СКИДАННЯ СТАНУ ===

    reset: () => {
      set(initialState);
      get().addToHistory('Стан store скинуто');
    },
  }))
);

/**
 * Селектори для зручного використання
 */
export const orderSelectors = {
  // Перевіряє чи є поточне замовлення
  hasCurrentOrder: () => useOrderStore.getState().currentOrder !== null,

  // Отримує кількість предметів у поточному замовленні
  getCurrentOrderItemsCount: () => {
    const currentOrder = useOrderStore.getState().currentOrder;
    return currentOrder?.items?.length || 0;
  },

  // Отримує загальну суму поточного замовлення
  getCurrentOrderTotal: () => {
    const currentOrder = useOrderStore.getState().currentOrder;
    return currentOrder?.finalAmount || 0;
  },

  // Перевіряє чи є активна помилка
  hasError: () => useOrderStore.getState().error !== null,

  // Отримує замовлення з кешу
  getFromCache: (orderId: string) => {
    return useOrderStore.getState().ordersCache[orderId] || null;
  },

  // Отримує останню операцію з історії
  getLastOperation: () => {
    const history = useOrderStore.getState().operationHistory;
    return history[history.length - 1] || null;
  },
};

/**
 * Хуки для підписки на зміни конкретних частин стану
 */
export const useCurrentOrder = () => useOrderStore((state) => state.currentOrder);
export const useOrderLoading = () => useOrderStore((state) => state.isLoading);
export const useOrderError = () => useOrderStore((state) => state.error);
export const useOrderHistory = () => useOrderStore((state) => state.operationHistory);
export const useOrderCache = () => useOrderStore((state) => state.ordersCache);
