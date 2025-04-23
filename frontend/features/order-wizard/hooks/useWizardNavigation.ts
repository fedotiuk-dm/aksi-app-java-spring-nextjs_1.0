import { useState } from 'react';
import { OrderWizardStage } from '../model/types';

/**
 * Хук для управління навігацією між етапами візарда
 */
export function useWizardNavigation(initialStage = OrderWizardStage.CLIENT_SELECTION) {
  const [currentStage, setCurrentStage] = useState<OrderWizardStage>(initialStage);
  
  // Перехід до конкретного етапу
  const goToStage = (stage: OrderWizardStage) => {
    setCurrentStage(stage);
  };
  
  // Перехід до наступного етапу
  const nextStage = () => {
    if (currentStage < OrderWizardStage.CONFIRMATION) {
      setCurrentStage(currentStage + 1);
    }
  };
  
  // Перехід до попереднього етапу
  const prevStage = () => {
    if (currentStage > OrderWizardStage.CLIENT_SELECTION) {
      setCurrentStage(currentStage - 1);
    }
  };
  
  // Перевірка чи останній етап
  const isLastStage = () => currentStage === OrderWizardStage.CONFIRMATION;
  
  // Перевірка чи перший етап
  const isFirstStage = () => currentStage === OrderWizardStage.CLIENT_SELECTION;
  
  // Отримання назви поточного етапу
  const getStageTitle = () => {
    switch (currentStage) {
      case OrderWizardStage.CLIENT_SELECTION:
        return 'Вибір клієнта та базова інформація';
      case OrderWizardStage.ITEMS_MANAGEMENT:
        return 'Управління предметами';
      case OrderWizardStage.GENERAL_PARAMETERS:
        return 'Загальні параметри';
      case OrderWizardStage.CONFIRMATION:
        return 'Підтвердження та квитанція';
      default:
        return 'Order Wizard';
    }
  };
  
  return {
    currentStage,
    goToStage,
    nextStage,
    prevStage,
    isLastStage,
    isFirstStage,
    getStageTitle
  };
}
