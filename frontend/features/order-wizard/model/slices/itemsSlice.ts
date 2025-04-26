import { StateCreator } from 'zustand';
import { OrderWizardState, OrderItem } from '../types/types';

export const createItemsSlice: StateCreator<
  OrderWizardState,
  [['zustand/immer', never]],
  [],
  Pick<
    OrderWizardState,
    | 'addItem'
    | 'updateItem'
    | 'removeItem'
    | 'setCurrentItemIndex'
    | 'setCurrentItem'
    | 'updateTotals'
  >
> = (set, get) => ({
  addItem: (item: OrderItem) => {
    set((state) => {
      state.items.push(item);
      state.isDirty = true;
    });

    // Оновлюємо суми після додавання предмета
    get().updateTotals();
  },

  updateItem: (index: number, item: OrderItem) => {
    set((state) => {
      if (index >= 0 && index < state.items.length) {
        state.items[index] = item;
        state.isDirty = true;
      }
    });

    // Оновлюємо суми після оновлення предмета
    get().updateTotals();
  },

  removeItem: (index: number) => {
    set((state) => {
      if (index >= 0 && index < state.items.length) {
        state.items.splice(index, 1);

        // Якщо видаляємо поточний предмет, скидаємо поточний індекс
        if (state.currentItemIndex === index) {
          state.currentItemIndex = null;
          state.currentItem = null;
        }
        // Якщо видаляємо предмет перед поточним, зменшуємо поточний індекс
        else if (
          state.currentItemIndex !== null &&
          state.currentItemIndex > index
        ) {
          state.currentItemIndex -= 1;
        }

        state.isDirty = true;
      }
    });

    // Оновлюємо суми після видалення предмета
    get().updateTotals();
  },

  setCurrentItemIndex: (index: number | null) => {
    const { items } = get();

    set((state) => {
      state.currentItemIndex = index;

      // Встановлюємо поточний предмет на основі індексу
      if (index !== null && index >= 0 && index < items.length) {
        state.currentItem = items[index];
      } else {
        state.currentItem = null;
      }
    });
  },

  setCurrentItem: (item: OrderItem | null) => {
    set((state) => {
      state.currentItem = item;

      // Якщо встановлюємо на null, скидаємо і індекс
      if (item === null) {
        state.currentItemIndex = null;
      }
    });
  },

  updateTotals: () => {
    set((state) => {
      // Розрахунок загальної суми на основі всіх предметів
      const totalAmount = state.items.reduce(
        (sum, item) => sum + (item.totalPrice || 0),
        0
      );

      state.totalAmount = totalAmount;

      // Розрахунок фінальної суми після знижки
      const finalAmount = Math.max(0, totalAmount - state.discountAmount);
      state.finalAmount = finalAmount;

      // Розрахунок залишкової суми після передоплати
      state.balanceAmount = Math.max(0, finalAmount - state.prepaymentAmount);
    });
  },
});
