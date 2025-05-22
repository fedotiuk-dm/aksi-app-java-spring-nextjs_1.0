import { useCallback } from 'react';

import { useWizardNavigation } from './use-wizard-navigation';
import { useWizardValidation } from './use-wizard-validation';

/**
 * Композиційний хук, що об'єднує навігацію та валідацію
 * для зручного керування станом OrderWizard
 */
export const useWizardComposition = () => {
  const navigation = useWizardNavigation();
  const validation = useWizardValidation();

  // Деструктуризуємо необхідні значення та методи для спрощення доступу
  const { currentStep, isForwardAllowed, goForward, unlockNextStep } = navigation;
  const { isStepValid, validateStep, setStepValid } = validation;

  /**
   * Валідує поточний крок та переходить до наступного, якщо валідація успішна
   */
  const validateAndProceed = useCallback(() => {
    // Запускаємо валідацію поточного кроку
    validateStep(currentStep);

    // Якщо крок вже валідний, розблоковуємо наступний та переходимо
    if (isStepValid(currentStep)) {
      unlockNextStep(currentStep);
      if (isForwardAllowed) {
        goForward();
      }
      return true;
    }

    return false;
  }, [currentStep, goForward, isForwardAllowed, isStepValid, unlockNextStep, validateStep]);

  /**
   * Помічає крок як валідний та переходить до наступного
   */
  const markValidAndProceed = useCallback(() => {
    // Встановлюємо статус "валідний" для поточного кроку
    setStepValid(currentStep);

    // Розблоковуємо наступний крок і переходимо
    unlockNextStep(currentStep);
    if (isForwardAllowed) {
      goForward();
    }

    return true;
  }, [currentStep, goForward, isForwardAllowed, setStepValid, unlockNextStep]);

  /**
   * Скидання всього візарда (і навігації, і валідації)
   */
  const resetWizard = useCallback(() => {
    navigation.resetNavigation();
    validation.resetAllValidation();
  }, [navigation, validation]);

  return {
    // Експортуємо все з хуків навігації та валідації
    ...navigation,
    ...validation,

    // Додаткові методи для композиції
    validateAndProceed,
    markValidAndProceed,
    resetWizard,
  };
};
