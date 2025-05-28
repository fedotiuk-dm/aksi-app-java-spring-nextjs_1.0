/**
 * @fileoverview Хук навігації по підвізарду предметів
 * @module domain/wizard/hooks/stage-2
 */

import { useMemo, useCallback } from 'react';

import { WizardNavigationService } from '../../machines';
import { useWizardStore } from '../../store';
import { ItemWizardStep } from '../../types';

/**
 * Інформація про крок підвізарду
 */
interface ItemWizardStepInfo {
  step: ItemWizardStep;
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
  canNavigateTo: boolean;
}

/**
 * Хук для навігації по підвізарду предметів
 * 🧭 Композиція: XState + Zustand + NavigationService
 */
export const useItemWizardNavigation = () => {
  // 🏪 Zustand - глобальний стан
  const { currentSubStep, isItemWizardActive, setCurrentSubStep, completeItemWizard, addError } =
    useWizardStore();

  // 📋 Інформація про кроки підвізарду
  const steps = useMemo((): ItemWizardStepInfo[] => {
    const stepLabels: Record<ItemWizardStep, string> = {
      [ItemWizardStep.BASIC_INFO]: 'Основна інформація',
      [ItemWizardStep.PROPERTIES]: 'Характеристики',
      [ItemWizardStep.DEFECTS]: 'Дефекти та плями',
      [ItemWizardStep.PRICING]: 'Розрахунок ціни',
      [ItemWizardStep.PHOTOS]: 'Фотографії',
    };

    return Object.values(ItemWizardStep).map((step) => ({
      step,
      label: stepLabels[step],
      isCompleted: false, // TODO: отримувати з валідації конкретних кроків
      isCurrent: currentSubStep === step,
      canNavigateTo: true, // TODO: логіка доступності кроків
    }));
  }, [currentSubStep]);

  // 🧭 Методи навігації
  const navigateToStep = useCallback(
    (targetStep: ItemWizardStep) => {
      if (!isItemWizardActive) {
        addError('Підвізард предметів не активний');
        return false;
      }

      setCurrentSubStep(targetStep);
      return true;
    },
    [isItemWizardActive, setCurrentSubStep, addError]
  );

  const navigateNext = useCallback(() => {
    if (!currentSubStep) return false;

    const nextStep = WizardNavigationService.getNextSubStep(currentSubStep);
    if (!nextStep) {
      // Останній крок - завершуємо підвізард
      completeItemWizard();
      return true;
    }

    return navigateToStep(nextStep);
  }, [currentSubStep, navigateToStep, completeItemWizard]);

  const navigateBack = useCallback(() => {
    if (!currentSubStep) return false;

    const prevStep = WizardNavigationService.getPreviousSubStep(currentSubStep);
    if (!prevStep) return false;

    return navigateToStep(prevStep);
  }, [currentSubStep, navigateToStep]);

  const navigateToFirstStep = useCallback(() => {
    return navigateToStep(ItemWizardStep.BASIC_INFO);
  }, [navigateToStep]);

  const navigateToLastStep = useCallback(() => {
    return navigateToStep(ItemWizardStep.PHOTOS);
  }, [navigateToStep]);

  // 📊 Інформація про поточний стан
  const navigationInfo = useMemo(() => {
    const currentStepInfo = steps.find((s) => s.isCurrent);
    const canGoNext = currentSubStep
      ? !!WizardNavigationService.getNextSubStep(currentSubStep)
      : false;
    const canGoBack = currentSubStep
      ? !!WizardNavigationService.getPreviousSubStep(currentSubStep)
      : false;
    const currentStepIndex = currentSubStep
      ? Object.values(ItemWizardStep).indexOf(currentSubStep)
      : -1;
    const progress =
      currentStepIndex >= 0
        ? Math.round(((currentStepIndex + 1) / Object.values(ItemWizardStep).length) * 100)
        : 0;

    return {
      currentStep: currentSubStep,
      currentStepInfo,
      currentStepIndex: currentStepIndex + 1,
      totalSteps: Object.values(ItemWizardStep).length,
      progress,
      canGoNext,
      canGoBack,
      isFirstStep: currentStepIndex === 0,
      isLastStep: currentStepIndex === Object.values(ItemWizardStep).length - 1,
      isActive: isItemWizardActive,
    };
  }, [steps, currentSubStep, isItemWizardActive]);

  // 🔄 Додаткові утиліти
  const getStepLabel = useCallback(
    (step: ItemWizardStep): string => {
      return steps.find((s) => s.step === step)?.label || '';
    },
    [steps]
  );

  const isStepCompleted = useCallback(
    (step: ItemWizardStep): boolean => {
      return steps.find((s) => s.step === step)?.isCompleted || false;
    },
    [steps]
  );

  const canNavigateToStep = useCallback(
    (step: ItemWizardStep): boolean => {
      return steps.find((s) => s.step === step)?.canNavigateTo || false;
    },
    [steps]
  );

  return {
    // 📋 Стан кроків
    steps,
    navigationInfo,

    // 🧭 Методи навігації
    navigateToStep,
    navigateNext,
    navigateBack,
    navigateToFirstStep,
    navigateToLastStep,

    // 🔍 Утиліти
    getStepLabel,
    isStepCompleted,
    canNavigateToStep,
  };
};
