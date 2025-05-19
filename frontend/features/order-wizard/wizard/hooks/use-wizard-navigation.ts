'use client';

import { useCallback } from 'react';

import { useWizardStore } from '../store/wizard.store';
import { ItemWizardSubStep, WizardMainStep } from '../types/wizard.types';

// Константи для назв етапів візарда
const ITEM_WIZARD = 'item-wizard' as const;
const ITEM_MANAGER = 'item-manager' as const;
const CLIENT_SELECTION = 'client-selection' as const;
const BASIC_INFO = 'basic-info' as const;
const PHOTO_DOCUMENTATION = 'photo-documentation' as const;

/**
 * Хук для навігації по Order Wizard
 */
export const useWizardNavigation = () => {
  // Отримуємо стан та дії з Zustand стору
  const currentStep = useWizardStore((state) => state.currentStep);
  const goToStep = useWizardStore((state) => state.goToStep);
  const goToNextMainStep = useWizardStore((state) => state.goToNextMainStep);
  const goToPreviousMainStep = useWizardStore((state) => state.goToPreviousMainStep);
  const goToNextItemSubStep = useWizardStore((state) => state.goToNextItemSubStep);
  const goToPreviousItemSubStep = useWizardStore((state) => state.goToPreviousItemSubStep);
  const stepsConfig = useWizardStore((state) => state.stepsConfig);

  /**
   * Перевірка, чи можна перейти до наступного кроку
   */
  const canGoNext = useCallback(() => {
    // Останній крок в основних кроках
    if (currentStep.mainStep === ITEM_WIZARD && !currentStep.itemSubStep) {
      return false;
    }

    // Перевіряємо, чи це останній підетап візарда предметів
    if (currentStep.mainStep === ITEM_WIZARD && currentStep.itemSubStep) {
      return currentStep.itemSubStep !== PHOTO_DOCUMENTATION;
    }

    return true;
  }, [currentStep]);

  /**
   * Перевірка, чи можна повернутись до попереднього кроку
   */
  const canGoBack = useCallback(() => {
    // Повертаємо false тільки для першого кроку візарда
    return !(currentStep.mainStep === CLIENT_SELECTION && !currentStep.itemSubStep);
  }, [currentStep]);

  /**
   * Отримання інформації про поточний крок
   */
  const getCurrentStepInfo = useCallback(() => {
    // Якщо ми на підетапі візарда предметів
    if (currentStep.itemSubStep && currentStep.mainStep === ITEM_WIZARD) {
      return stepsConfig.itemSubSteps[currentStep.itemSubStep];
    }

    // Інакше повертаємо інформацію про основний етап
    return stepsConfig.mainSteps[currentStep.mainStep];
  }, [currentStep, stepsConfig]);

  /**
   * Обгортка для переходу до наступного кроку з урахуванням контексту
   */
  const handleNext = useCallback(() => {
    // Якщо ми на підетапі візарда предметів
    if (currentStep.mainStep === ITEM_WIZARD && currentStep.itemSubStep) {
      goToNextItemSubStep();
    } else {
      goToNextMainStep();
    }
  }, [currentStep, goToNextItemSubStep, goToNextMainStep]);

  /**
   * Обгортка для переходу до попереднього кроку з урахуванням контексту
   */
  const handleBack = useCallback(() => {
    // Якщо ми на підетапі візарда предметів (не на першому)
    if (currentStep.mainStep === ITEM_WIZARD && currentStep.itemSubStep) {
      goToPreviousItemSubStep();
    } else {
      goToPreviousMainStep();
    }
  }, [currentStep, goToPreviousItemSubStep, goToPreviousMainStep]);

  /**
   * Перехід до початку роботи з новим предметом
   */
  const startNewItem = useCallback(() => {
    goToStep(ITEM_WIZARD, BASIC_INFO);
  }, [goToStep]);

  /**
   * Перехід до менеджера предметів
   */
  const goToItemManager = useCallback(() => {
    goToStep(ITEM_MANAGER, null);
  }, [goToStep]);

  /**
   * Перехід до конкретного підетапу предмета
   */
  const goToItemSubStep = useCallback((subStep: ItemWizardSubStep) => {
    goToStep(ITEM_WIZARD, subStep);
  }, [goToStep]);

  /**
   * Перехід до конкретного основного етапу
   */
  const goToMainStep = useCallback((mainStep: WizardMainStep) => {
    // Якщо переходимо до візарда предметів, встановлюємо перший підетап
    const itemSubStep = mainStep === ITEM_WIZARD ? BASIC_INFO : null;
    goToStep(mainStep, itemSubStep);
  }, [goToStep]);

  return {
    currentStep,
    canGoNext,
    canGoBack,
    handleNext,
    handleBack,
    getCurrentStepInfo,
    startNewItem,
    goToItemManager,
    goToItemSubStep,
    goToMainStep,
    goToStep,
  };
};
