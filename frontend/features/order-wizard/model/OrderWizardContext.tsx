import React, { createContext, useContext, PropsWithChildren } from 'react';
import { useOrderWizardStore, useOrderWizardNavigation, useOrderWizardStatus } from './store';
import { useClients } from '../api/clients';
import { useOrders } from '../api/orders';
import { WizardStep } from './types';

// Створюємо контекст для візарда
interface OrderWizardContextValue {
  // Навігація
  currentStep: WizardStep;
  navigateToStep: (step: WizardStep, subStep?: string) => void;
  navigateBack: () => void;
  isStepActive: (step: WizardStep) => boolean;
  
  // API для клієнтів
  clientsApi: ReturnType<typeof useClients>;
  
  // API для замовлень
  ordersApi: ReturnType<typeof useOrders>;
  
  // Статус
  isLoading: boolean;
  error: string | null;
}

const OrderWizardContext = createContext<OrderWizardContextValue | null>(null);

/**
 * Провайдер контексту для Order Wizard
 */
export const OrderWizardProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // Отримуємо дані про навігацію
  const navigation = useOrderWizardNavigation();
  
  // Отримуємо дані про статус
  const status = useOrderWizardStatus();
  
  // Отримуємо API хуки
  const clientsApi = useClients();
  const ordersApi = useOrders();
  
  // Формуємо значення контексту
  const contextValue: OrderWizardContextValue = {
    // Навігація
    currentStep: navigation.currentStep,
    navigateToStep: navigation.navigateToStep,
    navigateBack: navigation.navigateBack,
    isStepActive: navigation.isStepActive,
    
    // API 
    clientsApi,
    ordersApi,
    
    // Статус
    isLoading: status.isLoading,
    error: status.error,
  };
  
  return (
    <OrderWizardContext.Provider value={contextValue}>
      {children}
    </OrderWizardContext.Provider>
  );
};

/**
 * Хук для використання контексту Order Wizard
 */
export const useOrderWizard = () => {
  const context = useContext(OrderWizardContext);
  
  if (!context) {
    throw new Error('useOrderWizard must be used within an OrderWizardProvider');
  }
  
  return context;
};

/**
 * Хук для отримання даних безпосередньо з Zustand-стору
 */
export const useOrderWizardData = () => {
  return useOrderWizardStore();
};
