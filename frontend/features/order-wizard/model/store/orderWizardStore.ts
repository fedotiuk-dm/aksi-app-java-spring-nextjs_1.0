/**
 * Центральний store для OrderWizard на базі Zustand
 * Об'єднує всі слайси та додає middleware
 */
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';

import type {
  WizardState
} from '../types/wizard.types';

import { createClientSlice, ClientSlice } from './slices/clientSlice';
import { createNavigationSlice, NavigationSlice } from './slices/navigationSlice';
import { createItemsSlice, ItemsSlice } from './slices/itemsSlice';
import { createOrderSlice, OrderSlice } from './slices/orderSlice';

// Додаємо допоміжні утиліти для роботи з allowedTransitions
interface UtilitySlice {
  _getTransitions: (state: WizardState) => WizardState[];
  _validateTransition: (from: WizardState, to: WizardState) => boolean;
}

// Повний інтерфейс store, який об'єднує всі слайси
export interface OrderWizardStore extends 
  ClientSlice,
  NavigationSlice,
  ItemsSlice,
  OrderSlice,
  UtilitySlice {
  // Додаткові поля можна додати тут
  resetWizard: () => void; // Додано дію скидання
}

// Ключ для збереження стану у localStorage
const STORAGE_KEY = 'aksi-order-wizard-storage';

// Створення утиліт
const createUtilitySlice = (): UtilitySlice => ({
  _getTransitions: (state: WizardState) => {
    // Тут використовуємо ручно керовані дозволені переходи
    const transitions: Record<WizardState, WizardState[]> = {
      clientSelection: ['basicInfo'],
      basicInfo: ['clientSelection', 'itemManagement'],
      itemManagement: ['basicInfo', 'orderParams'],
      orderParams: ['itemManagement', 'billing'],
      billing: ['orderParams', 'complete'],
      complete: ['clientSelection'] // Для нового замовлення
    };
    
    return transitions[state] || [];
  },
  
  _validateTransition: (from: WizardState, to: WizardState) => {
    // Тут використовуємо ручно керовані дозволені переходи
    const transitions: Record<WizardState, WizardState[]> = {
      clientSelection: ['basicInfo'],
      basicInfo: ['clientSelection', 'itemManagement'],
      itemManagement: ['basicInfo', 'orderParams'],
      orderParams: ['itemManagement', 'billing'],
      billing: ['orderParams', 'complete'],
      complete: ['clientSelection'] // Для нового замовлення
    };
    
    return transitions[from]?.includes(to) || false;
  }
});

// Створення store з усіма middleware та слайсами
export const useOrderWizardStore = create<OrderWizardStore>()(
  subscribeWithSelector(
    devtools(
      persist(
        immer((...args) => {
          // Збережемо посилання на set для використання в resetWizard
          const setState = args[0];
          const getState = args[1];
          const storeApi = args[2];

          // Створюємо початковий стан кожного slice (разом з діями)
          const initialClientSlice = createClientSlice(setState, getState, storeApi);
          const initialNavigationSlice = createNavigationSlice(setState, getState, storeApi);
          const initialItemsSlice = createItemsSlice(setState, getState, storeApi);
          const initialOrderSlice = createOrderSlice(setState, getState, storeApi);

          // Збираємо повний початковий стан, що відповідає OrderWizardStore
          // Потрібно додати утиліти та саму дію resetWizard
          const initialState: OrderWizardStore = {
            ...initialClientSlice,
            ...initialNavigationSlice,
            ...initialItemsSlice,
            ...initialOrderSlice,
            ...createUtilitySlice(), // Додаємо утиліти до початкового стану
            // Додаємо саму дію resetWizard, вона буде перезаписана нижче
            // Важливо, щоб initialState мав правильний тип для setState
            resetWizard: () => { /* Placeholder, буде перезаписано */ },
          };

          return {
            // Повертаємо початковий стан всіх слайсів
            ...initialState,
            // Реалізація дії скидання
            resetWizard: () => {
              // Тепер initialState має правильний тип OrderWizardStore
              setState(initialState, true, 'resetWizard'); 

              // Очистка localStorage, якщо persist middleware не робить це автоматично
              // при повному перезапису стану. Варто протестувати.
              try {
                useOrderWizardStore.persist.clearStorage();
                console.log('OrderWizardStore localStorage cleared.');
              } catch (error) {
                console.error('Failed to clear OrderWizardStore localStorage:', error);
              }

              console.log('OrderWizardStore reset to initial state.');
            },
          };
        }),
        {
          name: STORAGE_KEY,
          storage: createJSONStorage(() => localStorage),
          // Вибірково серіалізуємо тільки потрібні дані
          partialize: (state) => ({
            currentState: state.currentState,
            client: state.client,
            orderData: state.orderData,
            items: state.items
          })
        }
      ),
      { name: 'OrderWizardStore' }
    )
  )
);

// Селектори для оптимізації
export const selectCurrentState = (state: OrderWizardStore) => state.currentState;
export const selectClientSelectionSubState = (state: OrderWizardStore) => state.clientSelectionSubState;
export const selectItemManagementSubState = (state: OrderWizardStore) => state.itemManagementSubState;
export const selectClient = (state: OrderWizardStore) => state.client;
export const selectItems = (state: OrderWizardStore) => state.items;
export const selectCurrentItem = (state: OrderWizardStore) => state.currentItem;
export const selectItemWizardState = (state: OrderWizardStore) => state.itemWizardState;
export const selectOrderData = (state: OrderWizardStore) => state.orderData;
export const selectValidationErrors = (state: OrderWizardStore) => state.validationErrors;
