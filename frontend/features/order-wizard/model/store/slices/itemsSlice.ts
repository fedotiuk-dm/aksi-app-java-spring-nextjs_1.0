/**
 * Слайс для управління предметами замовлення
 */
import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { 
  OrderItemUI,
  ItemManagementSubState,
  ItemWizardSubState
} from '../../types';
import type { OrderWizardStore } from '../orderWizardStore';

// Інтерфейс слайсу
export interface ItemsSlice {
  // Селектори
  items: OrderItemUI[];
  currentItem?: OrderItemUI;
  itemManagementSubState?: ItemManagementSubState;
  itemWizardState: ItemWizardSubState;
  itemWizardHistory: ItemWizardSubState[];
  
  // Дії (actions)
  addItem: () => void;
  editItem: (itemId: string) => void;
  deleteItem: (itemId: string) => void;
  saveItem: (item: OrderItemUI) => void;
  cancelItemEdit: () => void;
  goToItemWizardState: (state: ItemWizardSubState) => void;
  
  // Допоміжні функції
  isInItemWizard: () => boolean;
  getTotalCost: () => number;
}

// Створення слайсу
export const createItemsSlice: StateCreator<
  OrderWizardStore,
  [],
  [],
  ItemsSlice
> = (set, get) => ({
  // Початкові значення
  items: [],
  currentItem: undefined,
  itemManagementSubState: undefined,
  itemWizardState: 'idle',
  itemWizardHistory: ['idle'],
  
  // Перевірка, чи знаходимось ми у візарді предметів
  isInItemWizard: () => {
    return get().itemManagementSubState === 'itemWizard';
  },
  
  // Обчислення загальної вартості предметів
  getTotalCost: () => {
    return get().items.reduce((sum, item) => {
      return sum + (item.finalPrice || 0);
    }, 0);
  },
  
  // Додавання нового предмета
  addItem: () => {
    set(() => {
      // Створення нового предмета
      const newItem: OrderItemUI = {
        localId: uuidv4(),
        quantity: 1,
        unitOfMeasurement: 'PIECE',
        isValid: false
      };
      
      return {
        currentItem: newItem,
        itemWizardState: 'itemBasic',
        itemWizardHistory: ['idle'],
        itemManagementSubState: 'itemWizard'
      };
    });
    
    console.log('Додавання нового предмета');
  },
  
  // Редагування існуючого предмета
  editItem: (itemId) => {
    const { items } = get();
    const item = items.find(item => item.localId === itemId);
    
    if (!item) {
      console.warn(`Предмет з ID ${itemId} не знайдено`);
      return;
    }
    
    set(() => ({
      currentItem: { ...item }, // Копіюємо об'єкт для уникнення мутацій
      itemWizardState: 'itemBasic',
      itemWizardHistory: ['idle'],
      itemManagementSubState: 'itemWizard'
    }));
    
    console.log(`Редагування предмета з ID ${itemId}`);
  },
  
  // Видалення предмета
  deleteItem: (itemId) => {
    set((state) => ({
      items: state.items.filter(item => item.localId !== itemId)
    }));
    
    console.log(`Предмет ${itemId} видалено`);
  },
  
  // Збереження змін у предметі
  saveItem: (item) => {
    set((state) => {
      const newItems = [...state.items];
      const existingIndex = state.items.findIndex(i => i.localId === item.localId);
      
      // Забезпечуємо наявність localId
      const itemToSave: OrderItemUI = {
        ...item,
        localId: item.localId || uuidv4()
      };
      
      if (existingIndex >= 0) {
        // Оновлення існуючого предмета
        newItems[existingIndex] = itemToSave;
      } else {
        // Додавання нового предмета
        newItems.push(itemToSave);
      }
      
      return {
        items: newItems,
        currentItem: undefined,
        itemWizardState: 'idle',
        itemWizardHistory: ['idle'],
        itemManagementSubState: 'itemList'
      };
    });
    
    console.log(`Збереження предмета: ${item.localId}`);
  },
  
  // Скасування редагування предмета
  cancelItemEdit: () => {
    set(() => ({
      currentItem: undefined,
      itemWizardState: 'idle',
      itemWizardHistory: ['idle'],
      itemManagementSubState: 'itemList'
    }));
    
    console.log('Скасування редагування предмета');
  },
  
  // Перехід до певного стану візарда предметів
  goToItemWizardState: (wizardState) => {
    set((state) => ({
      itemWizardState: wizardState,
      itemWizardHistory: [...state.itemWizardHistory, wizardState]
    }));
    
    console.log(`Перехід до стану візарда предметів: ${wizardState}`);
  }
});
