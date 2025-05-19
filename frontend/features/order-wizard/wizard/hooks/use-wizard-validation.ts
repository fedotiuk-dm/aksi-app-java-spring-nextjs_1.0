'use client';

import { useCallback } from 'react';

import { useWizardStore } from '../store/wizard.store';
import { ItemWizardSubStep, StepValidationStatus, WizardMainStep } from '../types/wizard.types';

// Константа для назви етапу візарда предметів
const ITEM_WIZARD_STEP = 'item-wizard' as const;

/**
 * Хук для управління валідацією кроків Order Wizard
 */
export const useWizardValidation = () => {
  // Отримуємо стан та дії з Zustand стору
  const stepsConfig = useWizardStore((state) => state.stepsConfig);
  const setStepValidationStatus = useWizardStore((state) => state.setStepValidationStatus);
  const currentStep = useWizardStore((state) => state.currentStep);

  /**
   * Перевірка, чи крок валідний
   * @param mainStep Основний крок
   * @param itemSubStep Підкрок (опціонально)
   */
  const isStepValid = useCallback(
    (mainStep: WizardMainStep, itemSubStep?: ItemWizardSubStep): boolean => {
      if (itemSubStep) {
        return stepsConfig.itemSubSteps[itemSubStep].validationStatus === 'valid';
      }

      return stepsConfig.mainSteps[mainStep].validationStatus === 'valid';
    },
    [stepsConfig]
  );

  /**
   * Встановлення статусу валідації для поточного кроку
   * @param status Статус валідації
   */
  const setCurrentStepValidationStatus = useCallback(
    (status: StepValidationStatus) => {
      if (currentStep.itemSubStep && currentStep.mainStep === ITEM_WIZARD_STEP) {
        setStepValidationStatus(currentStep.mainStep, status, currentStep.itemSubStep);
      } else {
        setStepValidationStatus(currentStep.mainStep, status);
      }
    },
    [currentStep, setStepValidationStatus]
  );

  /**
   * Встановлення валідного статусу для поточного кроку
   */
  const validateCurrentStep = useCallback(() => {
    setCurrentStepValidationStatus('valid');
  }, [setCurrentStepValidationStatus]);

  /**
   * Встановлення невалідного статусу для поточного кроку
   */
  const invalidateCurrentStep = useCallback(() => {
    setCurrentStepValidationStatus('invalid');
  }, [setCurrentStepValidationStatus]);

  /**
   * Перевірка, чи всі підкроки предмета валідні
   */
  const areAllItemSubStepsValid = useCallback((): boolean => {
    return Object.entries(stepsConfig.itemSubSteps).every(
      ([, stepInfo]) => stepInfo.validationStatus === 'valid'
    );
  }, [stepsConfig]);

  /**
   * Перевірка, чи всі основні кроки валідні
   */
  const areAllMainStepsValid = useCallback((): boolean => {
    return Object.entries(stepsConfig.mainSteps).every(
      ([, stepInfo]) => stepInfo.validationStatus === 'valid'
    );
  }, [stepsConfig]);

  /**
   * Скидання валідації для всіх кроків
   */
  const resetAllValidation = useCallback(() => {
    // Скидаємо валідацію для основних кроків
    Object.keys(stepsConfig.mainSteps).forEach((step) => {
      setStepValidationStatus(step as WizardMainStep, 'not-validated');
    });

    // Скидаємо валідацію для підкроків
    Object.keys(stepsConfig.itemSubSteps).forEach((step) => {
      setStepValidationStatus(ITEM_WIZARD_STEP, 'not-validated', step as ItemWizardSubStep);
    });
  }, [stepsConfig, setStepValidationStatus]);

  return {
    isStepValid,
    setStepValidationStatus,
    validateCurrentStep,
    invalidateCurrentStep,
    areAllItemSubStepsValid,
    areAllMainStepsValid,
    resetAllValidation,
  };
};
