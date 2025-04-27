import React, { createContext, useContext, PropsWithChildren } from 'react';
import {
  useOrderWizardStore,
  useOrderWizardNavigation,
  useOrderWizardStatus,
} from './store/store';
// Імпортуємо API хуки з індексного файлу API для кращої організації
import {
  useClients,
  useOrders,
  useBranchLocations,
  useOrderItems,
  useItemCharacteristics,
  usePriceCalculator,
  useOrderItemPhotos
} from '../api';
import { WizardStep } from './types/types';

// Створюємо контекст для візарда
interface OrderWizardContextValue {
  // Навігація
  currentStep: WizardStep;
  navigateToStep: (step: WizardStep, subStep?: string) => void;
  navigateBack: () => void;
  isStepActive: (step: WizardStep) => boolean;

  // API для загальних сутностей
  clientsApi: ReturnType<typeof useClients>;
  ordersApi: ReturnType<typeof useOrders>;
  branchLocationsApi: ReturnType<typeof useBranchLocations>;
  
  // API для етапу 2 (Менеджер предметів)
  orderItemsApi: ReturnType<typeof useOrderItems>;
  itemCharacteristicsApi: ReturnType<typeof useItemCharacteristics>;
  priceCalculatorApi: ReturnType<typeof usePriceCalculator>;
  orderItemPhotosApi: ReturnType<typeof useOrderItemPhotos>;

  // Статус
  isLoading: boolean;
  error: string | null;
}

const OrderWizardContext = createContext<OrderWizardContextValue | null>(null);

/**
 * Провайдер контексту для Order Wizard
 */
export const OrderWizardProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  // Отримуємо дані про навігацію
  const navigation = useOrderWizardNavigation();

  // Отримуємо дані про статус
  const status = useOrderWizardStatus();

  // Ініціалізуємо всі API хуки
  const clientsApi = useClients();
  const ordersApi = useOrders();
  const branchLocationsApi = useBranchLocations();
  const orderItemsApi = useOrderItems();
  const itemCharacteristicsApi = useItemCharacteristics();
  const priceCalculatorApi = usePriceCalculator();
  const orderItemPhotosApi = useOrderItemPhotos();

  // Формуємо значення контексту
  const contextValue: OrderWizardContextValue = {
    // Навігація
    currentStep: navigation.currentStep,
    navigateToStep: navigation.navigateToStep,
    navigateBack: navigation.navigateBack,
    isStepActive: navigation.isStepActive,

    // API для загальних сутностей
    clientsApi,
    ordersApi,
    branchLocationsApi,
    
    // API для етапу 2
    orderItemsApi,
    itemCharacteristicsApi,
    priceCalculatorApi,
    orderItemPhotosApi,

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
    throw new Error(
      'Хук useOrderWizard може використовуватись лише всередині OrderWizardProvider'
    );
  }

  return context;
};

/**
 * Хук для отримання даних безпосередньо з Zustand-стору
 */
export const useOrderWizardData = () => {
  return useOrderWizardStore();
};
