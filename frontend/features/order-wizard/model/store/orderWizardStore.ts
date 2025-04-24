/**
 * Центральний store для OrderWizard на базі Zustand
 * Об'єднує всі слайси та додає middleware
 */
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { OrderCreateRequest } from '@/lib/api';
import type { ClientDTO } from '@/lib/api';

import type {
  WizardState,
  ClientSelectionSubState,
  ItemManagementSubState,
  ItemWizardSubState,
  OrderItemUI,
  OrderWizardContext,
  ClientUI,
  allowedTransitions,
  StateHistoryEntry
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
}

// Початковий контекст для роботи з даними
const initialContext: OrderWizardContext = {
  orderData: {},
  items: [],
  itemWizardState: 'idle',
  itemWizardHistory: ['idle'],
  formIsDirty: false,
  validationErrors: {}
};

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
        immer((...args) => ({
          // Об'єднуємо всі слайси
          ...createClientSlice(...args),
          ...createNavigationSlice(...args),
          ...createItemsSlice(...args),
          ...createOrderSlice(...args),
          ...createUtilitySlice()
        })),
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
