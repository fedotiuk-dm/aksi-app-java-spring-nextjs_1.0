import { StateCreator } from 'zustand';
import { OrderWizardState, OrderItem } from '../types/types';

// Допоміжна функція для логування операцій з предметами
const logItemsOperation = (
  action: string,
  details: Record<string, unknown>
) => {
  console.group(`OrderWizard Items - ${action}`);
  console.log('Details:', details);
  console.groupEnd();
};

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
    | 'updateCurrentItem'
    | 'updateTotals'
  >
> = (set, get) => ({
  addItem: (item: OrderItem) => {
    console.log('OrderWizard - addItem:', {
      itemName: item.name,
      price: item.totalPrice,
    });

    set((state) => {
      state.items.push(item);
      state.isDirty = true;
    });

    // Оновлюємо суми після додавання предмета
    get().updateTotals();

    // Логуємо стан після оновлення
    setTimeout(() => {
      const state = get();
      logItemsOperation('After addItem', {
        itemsCount: state.items.length,
        lastItem: state.items[state.items.length - 1],
        totalAmount: state.totalAmount,
      });
    }, 0);
  },

  updateItem: (index: number, item: OrderItem) => {
    console.log('OrderWizard - updateItem:', { index, itemName: item.name });

    set((state) => {
      if (index >= 0 && index < state.items.length) {
        state.items[index] = item;
        state.isDirty = true;
      }
    });

    // Оновлюємо суми після оновлення предмета
    get().updateTotals();

    // Логуємо стан після оновлення
    setTimeout(() => {
      const state = get();
      logItemsOperation('After updateItem', {
        index,
        updatedItem:
          index >= 0 && index < state.items.length ? state.items[index] : null,
        totalAmount: state.totalAmount,
      });
    }, 0);
  },

  removeItem: (index: number) => {
    console.log('OrderWizard - removeItem:', { index });

    // Зберігаємо інформацію про предмет перед видаленням для логування
    const removedItem = get().items[index];

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

    // Логуємо стан після оновлення
    setTimeout(() => {
      const state = get();
      logItemsOperation('After removeItem', {
        removedItemIndex: index,
        removedItem,
        remainingItemsCount: state.items.length,
        totalAmount: state.totalAmount,
      });
    }, 0);
  },

  setCurrentItemIndex: (index: number | null) => {
    console.log('OrderWizard - setCurrentItemIndex:', { index });
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

    // Логуємо стан після оновлення
    setTimeout(() => {
      const state = get();
      logItemsOperation('After setCurrentItemIndex', {
        currentItemIndex: state.currentItemIndex,
        currentItem: state.currentItem,
      });
    }, 0);
  },

  setCurrentItem: (item: OrderItem | null) => {
    console.log(
      'OrderWizard - setCurrentItem:',
      item ? { itemName: item.name } : { item: null }
    );

    set((state) => {
      state.currentItem = item;

      // Якщо встановлюємо на null, скидаємо і індекс
      if (item === null) {
        state.currentItemIndex = null;
      }
    });

    // Логуємо стан після оновлення
    setTimeout(() => {
      const state = get();
      logItemsOperation('After setCurrentItem', {
        currentItemIndex: state.currentItemIndex,
        currentItem: state.currentItem,
      });
    }, 0);
  },

  updateCurrentItem: () => {
    console.log('OrderWizard - updateCurrentItem');
    const { currentItem, currentItemIndex } = get();

    // Перевіряємо, чи є поточний предмет і його індекс
    if (currentItem && currentItemIndex !== null) {
      // Оновлюємо предмет у масиві
      set((state) => {
        if (currentItemIndex >= 0 && currentItemIndex < state.items.length) {
          state.items[currentItemIndex] = currentItem;
          state.isDirty = true;
        }
      });

      // Оновлюємо суми після оновлення предмета
      get().updateTotals();

      // Логуємо стан після оновлення
      setTimeout(() => {
        const state = get();
        logItemsOperation('After updateCurrentItem', {
          currentItemIndex: state.currentItemIndex,
          updatedItem: state.currentItem,
          itemsCount: state.items.length,
          totalAmount: state.totalAmount,
        });
      }, 0);

      return true; // Успішно оновлено
    }

    return false; // Немає поточного предмета або індексу
  },

  updateTotals: () => {
    console.log('OrderWizard - updateTotals');

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

    // Логуємо стан після оновлення
    setTimeout(() => {
      const state = get();
      logItemsOperation('After updateTotals', {
        itemsCount: state.items.length,
        totalAmount: state.totalAmount,
        finalAmount: state.finalAmount,
        balanceAmount: state.balanceAmount,
      });
    }, 0);
  },
});
