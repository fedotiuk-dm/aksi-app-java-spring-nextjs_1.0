/**
 * Слайс для управління станом клієнта у візарді замовлень
 */
import type { StateCreator } from 'zustand';
import type { ClientDTO } from '@/lib/api';
import type { 
  ClientSelectionSubState,
  ClientUI
} from '../../types';
import type { OrderWizardStore } from '../orderWizardStore';

// Інтерфейс слайсу
export interface ClientSlice {
  // Селектори
  client?: ClientUI;
  clientSelectionSubState: ClientSelectionSubState;

  // Дії (actions)
  selectClient: (client: ClientDTO) => void;
  createClient: (client: ClientDTO) => void;
  toggleClientFormMode: (mode: ClientSelectionSubState) => void;
  
  // Приватні методи для внутрішнього використання
  _setClient: (client: ClientDTO) => void;
}

// Створення слайсу
export const createClientSlice: StateCreator<
  OrderWizardStore,
  [],
  [],
  ClientSlice
> = (set, get) => ({
  // Початкові значення
  client: undefined,
  clientSelectionSubState: 'search',
  
  // Встановлення клієнта (внутрішня функція)
  _setClient: (client) => {
    // Розширюємо DTO до UI-моделі
    const clientUI: ClientUI = {
      ...client,
      isSelected: true,
      fullName: `${client.lastName || ''} ${client.firstName || ''}`.trim()
    };
    
    set(() => ({
      client: clientUI
    }));
  },
  
  // Вибір існуючого клієнта
  selectClient: (client) => {
    const { _setClient, addStateToHistory } = get();
    
    // Зберігаємо в історії поточний стан
    addStateToHistory();
    
    // Встановлюємо клієнта
    _setClient(client);
    
    // Переходимо до наступного кроку
    set(() => ({
      currentState: 'basicInfo'
    }));
    
    console.log('Вибрано клієнта:', client.id);
  },
  
  // Створення нового клієнта
  createClient: (client) => {
    const { _setClient, addStateToHistory } = get();
    
    // Зберігаємо в історії поточний стан
    addStateToHistory();
    
    // Встановлюємо клієнта
    _setClient(client);
    
    // Переходимо до наступного кроку
    set(() => ({
      currentState: 'basicInfo'
    }));
    
    console.log('Створено клієнта:', client.id);
  },
  
  // Перемикання між режимами пошуку і створення
  toggleClientFormMode: (mode) => {
    set(() => ({
      clientSelectionSubState: mode
    }));
  }
});
