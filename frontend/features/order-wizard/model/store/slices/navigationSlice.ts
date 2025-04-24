/**
 * Слайс для управління навігацією та історією станів у візарді замовлень
 */
import type { StateCreator } from 'zustand';
import type { 
  WizardState,
  StateHistoryEntry} from '../../types';
import type { OrderWizardStore } from '../orderWizardStore';

// Інтерфейс слайсу
export interface NavigationSlice {
  // Селектори
  currentState: WizardState;
  stateHistory: StateHistoryEntry[];
  
  // Дії (actions)
  goNext: () => void;
  goBack: () => void;
  reset: () => void;
  goToState: (state: WizardState) => void;
  
  // Допоміжні функції
  canTransitionTo: (targetState: WizardState) => boolean;
  addStateToHistory: () => void;
  popStateFromHistory: () => StateHistoryEntry | undefined;
}

// Створення слайсу
export const createNavigationSlice: StateCreator<
  OrderWizardStore,
  [],
  [],
  NavigationSlice
> = (set, get) => ({
  // Початкові значення
  currentState: 'clientSelection',
  stateHistory: [],
  
  // Перехід до наступного стану
  goNext: () => {
    const { currentState, canTransitionTo, addStateToHistory } = get();
    
    // Визначення наступного стану за логікою бізнес-процесу
    let nextState: WizardState;
    
    switch (currentState) {
      case 'clientSelection':
        nextState = 'basicInfo';
        break;
      case 'basicInfo':
        nextState = 'itemManagement';
        // Ініціалізуємо підстан itemManagement
        set(() => ({ itemManagementSubState: 'itemList' }));
        break;
      case 'itemManagement':
        nextState = 'orderParams';
        break;
      case 'orderParams':
        nextState = 'billing';
        break;
      case 'billing':
        nextState = 'complete';
        break;
      default:
        // Якщо немає визначеного переходу, залишаємось в поточному стані
        return;
    }
    
    // Перевірка можливості переходу
    if (!canTransitionTo(nextState)) {
      console.warn(`Перехід з ${currentState} до ${nextState} не дозволений`);
      return;
    }
    
    // Зберігаємо поточний стан в історії
    addStateToHistory();
    
    // Переходимо до наступного стану
    set(() => ({
      currentState: nextState
    }));
    
    console.log(`Перехід до стану: ${nextState}`);
  },
  
  // Повернення до попереднього стану
  goBack: () => {
    const { popStateFromHistory, currentState } = get();
    
    // Не можна повернутися з першого кроку
    if (currentState === 'clientSelection') {
      console.warn('Неможливо повернутися з першого кроку');
      return;
    }
    
    // Отримуємо попередній стан з історії
    const prevStateEntry = popStateFromHistory();
    
    if (!prevStateEntry) {
      // Якщо історії немає, використовуємо логіку переходу в зворотному напрямку
      let prevState: WizardState;
      
      switch (currentState) {
        case 'basicInfo':
          prevState = 'clientSelection';
          break;
        case 'itemManagement':
          prevState = 'basicInfo';
          break;
        case 'orderParams':
          prevState = 'itemManagement';
          set(() => ({ itemManagementSubState: 'itemList' }));
          break;
        case 'billing':
          prevState = 'orderParams';
          break;
        case 'complete':
          prevState = 'billing';
          break;
        default:
          return;
      }
      
      set(() => ({
        currentState: prevState
      }));
      
      console.log(`Повернення до стану: ${prevState} (за логікою)`);
    } else {
      // Переходимо до стану з історії
      set(() => ({
        currentState: prevStateEntry.state,
        // Відновлюємо підстан, якщо він був
        ...(prevStateEntry.subState && { 
          [prevStateEntry.state === 'clientSelection' ? 'clientSelectionSubState' : 
           prevStateEntry.state === 'itemManagement' ? 'itemManagementSubState' : '']: 
           prevStateEntry.subState 
        })
      }));
      
      console.log(`Повернення до стану: ${prevStateEntry.state} (з історії)`);
    }
  },
  
  // Повний скид стану
  reset: () => {
    set(() => ({
      currentState: 'clientSelection',
      clientSelectionSubState: 'search',
      itemManagementSubState: undefined,
      stateHistory: [],
      client: undefined,
      orderData: {},
      items: [],
      currentItem: undefined,
      itemWizardState: 'idle',
      itemWizardHistory: ['idle'],
      formIsDirty: false,
      validationErrors: {}
    }));
    
    console.log('Скид стану візарда');
  },
  
  // Перехід до конкретного стану
  goToState: (targetState) => {
    const { currentState, canTransitionTo, addStateToHistory } = get();
    
    // Перевіряємо можливість переходу
    if (!canTransitionTo(targetState)) {
      console.warn(`Перехід з ${currentState} до ${targetState} не дозволений`);
      return;
    }
    
    // Зберігаємо поточний стан в історії
    addStateToHistory();
    
    // Здійснюємо перехід
    set(() => ({
      currentState: targetState
    }));
    
    console.log(`Перехід до стану: ${targetState}`);
  },
  
  // Перевірка можливості переходу
  canTransitionTo: (targetState) => {
    const { currentState } = get();
    
    // Отримуємо дозволені переходи для поточного стану
    const allowedStates = get()._getTransitions(currentState);
    
    return allowedStates.includes(targetState);
  },
  
  // Додавання поточного стану до історії
  addStateToHistory: () => {
    const { currentState, clientSelectionSubState, itemManagementSubState } = get();
    
    // Створюємо запис історії з актуальними даними
    const historyEntry: StateHistoryEntry = {
      state: currentState,
      subState: currentState === 'clientSelection' 
        ? clientSelectionSubState 
        : currentState === 'itemManagement'
          ? itemManagementSubState
          : undefined,
      timestamp: Date.now()
    };
    
    set((state) => ({
      stateHistory: [...state.stateHistory, historyEntry]
    }));
  },
  
  // Вилучення останнього запису з історії
  popStateFromHistory: () => {
    const { stateHistory } = get();
    
    if (stateHistory.length === 0) {
      return undefined;
    }
    
    const lastEntry = stateHistory[stateHistory.length - 1];
    
    set((state) => ({
      stateHistory: state.stateHistory.slice(0, -1)
    }));
    
    return lastEntry;
  }
});
