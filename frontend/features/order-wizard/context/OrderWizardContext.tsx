import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  OrderWizardState, 
  OrderWizardStage,
  Stage2Data,
  Stage3Data,
  Stage4Data
} from '../model/types';
import { Stage1Data } from '../stages/stage1-client/model/types';

// Початковий стан OrderWizard
const initialState: OrderWizardState = {
  stage1: null,
  stage2: null,
  stage3: null,
  stage4: null,
  currentStage: OrderWizardStage.CLIENT_SELECTION,
  isComplete: false,
  isSubmitting: false,
  errors: {}
};

// Інтерфейс для контексту
interface OrderWizardContextType {
  state: OrderWizardState;
  
  // Методи для управління етапами
  goToStage: (stage: OrderWizardStage) => void;
  nextStage: () => void;
  prevStage: () => void;
  
  // Методи для збереження даних етапів
  setStage1Data: (data: Stage1Data) => void;
  setStage2Data: (data: Stage2Data) => void;
  setStage3Data: (data: Stage3Data) => void;
  setStage4Data: (data: Stage4Data) => void;
  
  // Методи для управління станом візарда
  resetWizard: () => void;
  completeWizard: () => void;
}

// Створення контексту
const OrderWizardContext = createContext<OrderWizardContextType | undefined>(undefined);

// Провайдер контексту
export function OrderWizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OrderWizardState>(initialState);
  
  // Навігація між етапами
  const goToStage = (stage: OrderWizardStage) => {
    setState(prev => ({ ...prev, currentStage: stage }));
  };
  
  const nextStage = () => {
    if (state.currentStage < OrderWizardStage.CONFIRMATION) {
      setState(prev => ({ ...prev, currentStage: prev.currentStage + 1 }));
    }
  };
  
  const prevStage = () => {
    if (state.currentStage > OrderWizardStage.CLIENT_SELECTION) {
      setState(prev => ({ ...prev, currentStage: prev.currentStage - 1 }));
    }
  };
  
  // Збереження даних етапів
  const setStage1Data = (data: Stage1Data) => {
    setState(prev => ({ ...prev, stage1: data }));
  };
  
  const setStage2Data = (data: Stage2Data) => {
    setState(prev => ({ ...prev, stage2: data }));
  };
  
  const setStage3Data = (data: Stage3Data) => {
    setState(prev => ({ ...prev, stage3: data }));
  };
  
  const setStage4Data = (data: Stage4Data) => {
    setState(prev => ({ ...prev, stage4: data }));
  };
  
  // Методи для управління станом візарда
  const resetWizard = () => {
    setState(initialState);
  };
  
  const completeWizard = () => {
    setState(prev => ({ ...prev, isComplete: true }));
  };
  
  // Значення, які будуть доступні через контекст
  const value: OrderWizardContextType = {
    state,
    goToStage,
    nextStage,
    prevStage,
    setStage1Data,
    setStage2Data,
    setStage3Data,
    setStage4Data,
    resetWizard,
    completeWizard
  };
  
  return (
    <OrderWizardContext.Provider value={value}>
      {children}
    </OrderWizardContext.Provider>
  );
}

// Хук для використання контексту в компонентах
export function useOrderWizard() {
  const context = useContext(OrderWizardContext);
  
  if (context === undefined) {
    throw new Error('useOrderWizard must be used within an OrderWizardProvider');
  }
  
  return context;
}
