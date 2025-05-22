import { useCallback } from 'react';

import { useNavigationStore, WizardStep } from '../store/navigation';

/**
 * Хук для роботи з навігацією в OrderWizard
 * Надає зручний інтерфейс для керування переходами між кроками
 */
export const useWizardNavigation = () => {
  const {
    currentStep,
    stepHistory,
    availability,
    isItemWizardActive,
    isBackAllowed,
    isForwardAllowed,
    goToStep,
    goBack,
    goForward,
    startItemWizard,
    finishItemWizard,
    updateStepAvailability,
    resetNavigation,
  } = useNavigationStore();

  /**
   * Перевірка, чи є крок поточним
   */
  const isCurrentStep = useCallback((step: WizardStep) => currentStep === step, [currentStep]);

  /**
   * Перевірка, чи доступний крок для переходу
   */
  const isStepAvailable = useCallback((step: WizardStep) => !!availability[step], [availability]);

  /**
   * Встановлює доступність кроку та всіх наступних етапів
   * Корисно, коли ми хочемо відкрити наступний крок після валідації
   */
  const unlockNextStep = useCallback(
    (currentStep: WizardStep) => {
      let nextStep: WizardStep | null = null;

      // Визначаємо наступний крок на основі поточного
      switch (currentStep) {
        case WizardStep.CLIENT_SELECTION:
          nextStep = WizardStep.BASIC_INFO;
          break;
        case WizardStep.BASIC_INFO:
          nextStep = WizardStep.ITEM_MANAGER;
          break;
        case WizardStep.ITEM_MANAGER:
          nextStep = WizardStep.ORDER_PARAMETERS;
          break;
        case WizardStep.ORDER_PARAMETERS:
          nextStep = WizardStep.ORDER_CONFIRMATION;
          break;
        // Навігація в рамках підкроків візарда предметів
        case WizardStep.ITEM_BASIC_INFO:
          nextStep = WizardStep.ITEM_PROPERTIES;
          break;
        case WizardStep.ITEM_PROPERTIES:
          nextStep = WizardStep.DEFECTS_STAINS;
          break;
        case WizardStep.DEFECTS_STAINS:
          nextStep = WizardStep.PRICE_CALCULATOR;
          break;
        case WizardStep.PRICE_CALCULATOR:
          nextStep = WizardStep.PHOTO_DOCUMENTATION;
          break;
        default:
          break;
      }

      if (nextStep) {
        updateStepAvailability(nextStep, true);
      }
    },
    [updateStepAvailability]
  );

  /**
   * Завершення поточного кроку та перехід до наступного
   */
  const completeCurrentStep = useCallback(() => {
    // Розблоковуємо наступний крок
    unlockNextStep(currentStep);

    // Переходимо вперед
    goForward();
  }, [currentStep, goForward, unlockNextStep]);

  /**
   * Завершення додавання предмета та повернення до менеджера предметів
   */
  const completeItemAddition = useCallback(
    (saveItem: boolean = true) => {
      finishItemWizard(saveItem);
    },
    [finishItemWizard]
  );

  return {
    // Стан
    currentStep,
    stepHistory,
    availability,
    isItemWizardActive,
    isBackAllowed,
    isForwardAllowed,

    // Утиліти та перевірки
    isCurrentStep,
    isStepAvailable,
    unlockNextStep,

    // Дії для навігації
    goToStep,
    goBack,
    goForward,
    startItemWizard,
    completeCurrentStep,
    completeItemAddition,
    resetNavigation,
  };
};
