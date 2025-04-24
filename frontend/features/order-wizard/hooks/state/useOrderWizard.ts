/**
 * Хук для роботи з Zustand сховищем OrderWizard
 */
import { useOrderWizardStore } from '../../model/store';

// Адаптер для міграції з XState на Zustand
// Цей хук забезпечує сумісність з компонентами, які раніше використовували XState
export const useOrderWizard = () => {
  const {
    // Стан клієнта
    client,
    selectClient,
    createClient,
    toggleClientFormMode,
    clientSelectionSubState,
    
    // Стан предметів
    items,
    currentItem,
    itemManagementSubState,
    addItem,
    editItem,
    deleteItem,
    saveItem,
    cancelItemEdit,
    
    // Стан замовлення
    orderData,
    saveBasicInfo,
    saveOrderParams,
    completeOrder,
    
    // Стан навігації
    currentState,
    goNext,
    goBack,
    goToState,
    isOrderComplete
  } = useOrderWizardStore();

  // Адаптований інтерфейс дій для сумісності зі старим кодом
  const actions = {
    selectClient,
    createClient,
    toggleClientFormMode,
    addItem,
    editItem,
    deleteItem,
    saveItem,
    cancelItemEdit,
    setOrderBasicInfo: saveBasicInfo,
    setOrderParams: saveOrderParams,
    completeOrder,
    next: goNext,
    back: goBack,
    goto: goToState
  };
  
  console.log('useOrderWizard повертає стан:', currentState);
  
  return {
    // Поточний стан і дані
    currentState,
    client,
    items,
    currentItem,
    orderData,
    clientSelectionSubState,
    itemManagementSubState,
    
    // Методи
    actions,
    isOrderComplete
  };
};
