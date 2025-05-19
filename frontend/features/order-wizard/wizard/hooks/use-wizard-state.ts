'use client';

import { useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Типи для даних клієнта
 */
interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  [key: string]: unknown;
}

/**
 * Типи для предметів
 */
interface OrderItem {
  id: string;
  name: string;
  category: string;
  properties?: Record<string, string | number | boolean>;
  defects?: string[];
  photos?: string[];
  initialPrice: number;
  finalPrice: number;
  [key: string]: unknown;
}

/**
 * Інтерфейс для даних Order Wizard
 */
interface WizardData {
  // Дані клієнта
  clientId?: string;
  clientData?: ClientData;
  
  // Дані відділення
  branchId?: string;
  
  // Унікальний номер квитанції
  receiptNumber?: string;
  
  // Унікальна мітка
  orderTag?: string;
  
  // Поточний предмет в процесі додавання
  currentItem?: OrderItem | null;
  
  // Список доданих предметів
  items: OrderItem[];
  
  // Загальні параметри замовлення
  orderParams?: {
    executionDate?: string; // дата виконання
    urgent?: string; // тип терміновості
    discount?: {
      type?: string; // тип знижки
      value?: number; // значення знижки
      comment?: string; // коментар до знижки
    };
    payment?: {
      method?: string; // спосіб оплати
      paid?: number; // сплачена сума
    };
    notes?: string; // примітки до замовлення
  };
  
  // Загальна вартість
  totalPrice?: number;
  
  // Статус збереження даних
  isSaving: boolean;
}

/**
 * Інтерфейс дій для стану Order Wizard
 */
interface WizardDataActions {
  // Клієнт
  setClientData: (clientId: string, data?: ClientData) => void;
  
  // Відділення
  setBranchData: (branchId: string) => void;
  
  // Квитанція
  setReceiptData: (receiptNumber: string, orderTag?: string) => void;
  
  // Управління предметами
  setCurrentItem: (itemData: OrderItem | null) => void;
  addItem: (itemData: OrderItem) => void;
  updateItem: (itemId: string, itemData: Partial<OrderItem>) => void;
  removeItem: (itemId: string) => void;
  
  // Загальні параметри замовлення
  setOrderParams: (params: Partial<WizardData['orderParams']>) => void;
  
  // Загальна вартість
  setTotalPrice: (price: number) => void;
  
  // Скидання даних
  resetWizardData: () => void;
  
  // Статус збереження
  setSaving: (isSaving: boolean) => void;
}

/**
 * Початковий стан даних Order Wizard
 */
const initialWizardData: WizardData = {
  items: [],
  isSaving: false,
};

/**
 * Zustand стор для збереження даних Order Wizard
 */
const useWizardDataStore = create<WizardData & WizardDataActions>()(
  persist(
    (set, get) => ({
      ...initialWizardData,
      
      // Клієнт
      setClientData: (clientId, data) => {
        set({
          clientId,
          clientData: data,
        });
      },
      
      // Відділення
      setBranchData: (branchId) => {
        set({ branchId });
      },
      
      // Квитанція
      setReceiptData: (receiptNumber, orderTag) => {
        set({
          receiptNumber,
          orderTag,
        });
      },
      
      // Управління предметами
      setCurrentItem: (itemData) => {
        set({ currentItem: itemData });
      },
      
      addItem: (itemData) => {
        const items = [...get().items];
        items.push(itemData);
        set({ items, currentItem: null });
      },
      
      updateItem: (itemId, itemData) => {
        const items = [...get().items];
        const index = items.findIndex((item) => item.id === itemId);
        
        if (index !== -1) {
          items[index] = {
            ...items[index],
            ...itemData,
          };
          set({ items });
        }
      },
      
      removeItem: (itemId) => {
        const items = get().items.filter((item) => item.id !== itemId);
        set({ items });
      },
      
      // Загальні параметри замовлення
      setOrderParams: (params) => {
        set({
          orderParams: {
            ...get().orderParams,
            ...params,
          },
        });
      },
      
      // Загальна вартість
      setTotalPrice: (price) => {
        set({ totalPrice: price });
      },
      
      // Скидання даних
      resetWizardData: () => {
        set(initialWizardData);
      },
      
      // Статус збереження
      setSaving: (isSaving) => {
        set({ isSaving });
      },
    }),
    {
      name: 'order-wizard-data-store',
    }
  )
);

/**
 * Хук для управління даними Order Wizard
 */
export const useWizardState = () => {
  // Отримуємо стан та дії з Zustand стору
  const {
    // Стан
    clientId,
    clientData,
    branchId,
    receiptNumber,
    orderTag,
    currentItem,
    items,
    orderParams,
    totalPrice,
    isSaving,
    
    // Дії
    setClientData,
    setBranchData,
    setReceiptData,
    setCurrentItem,
    addItem,
    updateItem,
    removeItem,
    setOrderParams,
    setTotalPrice,
    resetWizardData,
    setSaving,
  } = useWizardDataStore();

  /**
   * Перевірка наявності клієнта
   */
  const hasClient = useCallback(() => {
    return !!clientId;
  }, [clientId]);

  /**
   * Перевірка наявності відділення
   */
  const hasBranch = useCallback(() => {
    return !!branchId;
  }, [branchId]);

  /**
   * Перевірка наявності предметів
   */
  const hasItems = useCallback(() => {
    return items.length > 0;
  }, [items]);

  /**
   * Отримання кількості предметів
   */
  const getItemsCount = useCallback(() => {
    return items.length;
  }, [items]);

  /**
   * Отримання загальної вартості предметів
   */
  const getTotalPrice = useCallback(() => {
    if (totalPrice !== undefined) {
      return totalPrice;
    }
    
    // Якщо загальна вартість не встановлена явно, обчислюємо суму по предметах
    return items.reduce((sum, item) => {
      return sum + (Number(item.finalPrice) || 0);
    }, 0);
  }, [items, totalPrice]);

  /**
   * Асинхронне збереження даних
   */
  const saveWizardData = useCallback(async () => {
    try {
      setSaving(true);
      // Тут можна додати логіку для збереження даних на сервер
      // Наприклад, використовуючи API клієнти з lib/api
      
      // Імітація асинхронної операції
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setSaving(false);
      return true;
    } catch (error) {
      setSaving(false);
      console.error('Error saving wizard data:', error);
      return false;
    }
  }, [setSaving]);

  return {
    // Стан
    clientId,
    clientData,
    branchId,
    receiptNumber,
    orderTag,
    currentItem,
    items,
    orderParams,
    isSaving,
    
    // Перевірки
    hasClient,
    hasBranch,
    hasItems,
    getItemsCount,
    getTotalPrice,
    
    // Дії
    setClientData,
    setBranchData,
    setReceiptData,
    setCurrentItem,
    addItem,
    updateItem,
    removeItem,
    setOrderParams,
    setTotalPrice,
    resetWizardData,
    saveWizardData,
  };
};
