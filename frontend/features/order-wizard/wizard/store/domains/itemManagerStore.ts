import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { BaseStore } from './baseStore';
import { StepValidationStatus } from '../../types/wizard.types';

/**
 * Базовий тип предмета
 */
export interface OrderItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  materialType?: string;
  color?: string;
  // інші поля будуть додані відповідно до вимог
}

/**
 * Інтерфейс стану стору менеджера предметів
 */
export interface ItemManagerState extends BaseStore {
  // Список предметів у замовленні
  items: OrderItem[];
  // Поточний предмет, який редагується
  currentItemId: string | null;
  // Статус валідації кроку
  validationStatus: StepValidationStatus;

  // Методи для оновлення стану
  addItem: (item: OrderItem) => void;
  updateItem: (itemId: string, updatedItem: Partial<OrderItem>) => void;
  removeItem: (itemId: string) => void;
  setCurrentItemId: (itemId: string | null) => void;
  setValidationStatus: (status: StepValidationStatus) => void;
}

/**
 * Початковий стан для стору менеджера предметів
 */
const initialState = {
  items: [],
  currentItemId: null,
  validationStatus: 'not-validated' as StepValidationStatus,
  error: null,
  isSaving: false,
};

/**
 * Стор для управління предметами замовлення в Order Wizard
 */
export const useItemManagerStore = create<ItemManagerState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Додавання нового предмета до замовлення
        addItem: (item) => set((state) => ({
          items: [...state.items, item],
        })),

        // Оновлення існуючого предмета
        updateItem: (itemId, updatedItem) => set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, ...updatedItem } : item
          ),
        })),

        // Видалення предмета із замовлення
        removeItem: (itemId) => set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

        // Встановлення поточного предмета для редагування
        setCurrentItemId: (itemId) => set({
          currentItemId: itemId,
        }),

        // Встановлення статусу валідації кроку
        setValidationStatus: (status) => set({
          validationStatus: status,
        }),

        // Встановлення помилки
        setError: (error) => set({
          error,
        }),

        // Встановлення статусу збереження
        setIsSaving: (isSaving) => set({
          isSaving,
        }),

        // Скидання стану стору
        reset: () => set(initialState),
      }),
      {
        name: 'order-wizard-item-manager',
      }
    )
  )
);
