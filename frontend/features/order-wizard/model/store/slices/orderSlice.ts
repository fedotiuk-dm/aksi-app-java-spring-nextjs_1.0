/**
 * Слайс для управління загальними даними замовлення
 */
import type { StateCreator } from 'zustand';
import type { OrderCreateRequest } from '@/lib/api';
import type { OrderWizardStore } from '../orderWizardStore';

// Інтерфейс слайсу
export interface OrderSlice {
  // Селектори
  orderData: Partial<OrderCreateRequest>;
  formIsDirty?: boolean;
  validationErrors?: Record<string, string>;
  
  // Дії (actions)
  saveBasicInfo: (data: Partial<OrderCreateRequest>) => void;
  saveOrderParams: (params: Partial<OrderCreateRequest>) => void;
  completeOrder: () => void;
  setBranchOffice: (branchOfficeId: string) => void;
  setTagNumber: (tagNumber: string) => void;
  
  // Допоміжні функції
  isOrderComplete: () => boolean;
  validateOrder: () => Record<string, string> | null;
}

// Створення слайсу
export const createOrderSlice: StateCreator<
  OrderWizardStore,
  [],
  [],
  OrderSlice
> = (set, get) => ({
  // Початкові значення
  orderData: {},
  formIsDirty: false,
  validationErrors: {},
  
  // Збереження основних даних замовлення
  saveBasicInfo: (data) => {
    const { addStateToHistory } = get();
    
    // Зберігаємо поточний стан в історії
    addStateToHistory();
    
    set((state) => ({
      orderData: {
        ...state.orderData,
        ...data
      },
      formIsDirty: true,
      currentState: 'itemManagement',
      itemManagementSubState: 'itemList'
    }));
    
    console.log('Збережено базову інформацію замовлення');
  },
  
  // Збереження параметрів замовлення
  saveOrderParams: (params) => {
    const { addStateToHistory, validateOrder } = get();
    
    // Зберігаємо поточний стан в історії
    addStateToHistory();
    
    set((state) => ({
      orderData: {
        ...state.orderData,
        ...params
      },
      currentState: 'billing'
    }));
    
    // Перевіряємо валідність
    const errors = validateOrder();
    
    set(() => ({
      validationErrors: errors || {}
    }));
    
    console.log('Збережено параметри замовлення');
  },
  
  // Встановлення філії
  setBranchOffice: (branchOfficeId) => {
    set((state) => ({
      orderData: {
        ...state.orderData,
        branchOfficeId
      }
    }));
    
    console.log(`Встановлено філію: ${branchOfficeId}`);
  },
  
  // Встановлення номера бирки
  setTagNumber: (tagNumber) => {
    set((state) => ({
      orderData: {
        ...state.orderData,
        tagNumber
      }
    }));
    
    console.log(`Встановлено номер бирки: ${tagNumber}`);
  },
  
  // Завершення замовлення
  completeOrder: () => {
    const { addStateToHistory, validateOrder } = get();
    
    // Перевіряємо валідність
    const errors = validateOrder();
    
    if (errors) {
      set(() => ({
        validationErrors: errors
      }));
      
      console.warn('Замовлення містить помилки: ', errors);
      return;
    }
    
    // Зберігаємо поточний стан в історії
    addStateToHistory();
    
    set(() => ({
      currentState: 'complete',
      validationErrors: {}
    }));
    
    console.log('Замовлення успішно завершено');
  },
  
  // Перевірка чи замовлення завершене
  isOrderComplete: () => {
    const { client, orderData, items } = get();
    
    return (
      !!client &&
      !!orderData.receptionPointId &&
      !!orderData.urgencyType &&
      items.length > 0
    );
  },
  
  // Валідація замовлення
  validateOrder: () => {
    const { client, orderData, items } = get();
    const errors: Record<string, string> = {};
    
    if (!client) {
      errors.client = 'Клієнт не вибраний';
    }
    
    if (!orderData.receptionPointId) {
      errors.receptionPoint = 'Філію не вибрано';
    }
    
    if (!orderData.urgencyType) {
      errors.urgencyType = 'Не вибрано тип терміновості';
    }
    
    if (items.length === 0) {
      errors.items = 'Замовлення повинно містити хоча б один предмет';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }
});
