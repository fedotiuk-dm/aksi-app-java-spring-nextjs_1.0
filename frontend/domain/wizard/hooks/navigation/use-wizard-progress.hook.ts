/**
 * @fileoverview Хук для відстеження прогресу wizard
 * @module domain/wizard/hooks/navigation
 */

import { useMemo } from 'react';

import { WizardNavigationService } from '../../machines';
import { useWizardBaseStore } from '../../store';
import { WizardStep, ItemWizardStep } from '../../types/wizard-steps.types';

/**
 * Інформація про крок wizard
 */
interface StepInfo {
  step: WizardStep;
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isAccessible: boolean;
}

/**
 * Хук для відстеження прогресу wizard
 * 📊 Надає детальну інформацію про стан кожного кроку
 */
export const useWizardProgress = () => {
  const { currentStep, currentSubStep, completedSteps } = useWizardBaseStore();

  // 📋 Інформація про всі кроки
  const steps = useMemo((): StepInfo[] => {
    const stepLabels: Record<WizardStep, string> = {
      [WizardStep.CLIENT_SELECTION]: 'Вибір клієнта',
      [WizardStep.BRANCH_SELECTION]: 'Філія',
      [WizardStep.ITEM_MANAGER]: 'Предмети',
      [WizardStep.ORDER_PARAMETERS]: 'Параметри',
      [WizardStep.CONFIRMATION]: 'Підтвердження',
      [WizardStep.COMPLETED]: 'Завершено',
    };

    return (Object.values(WizardStep) as WizardStep[])
      .filter((step) => step !== WizardStep.COMPLETED) // Виключаємо завершений стан з прогресу
      .map((step) => ({
        step,
        label: stepLabels[step],
        isCompleted: completedSteps.includes(step),
        isCurrent: currentStep === step,
        isAccessible: WizardNavigationService.isStepAccessible(step, completedSteps),
      }));
  }, [currentStep, completedSteps]);

  // 📊 Загальний прогрес
  const progress = useMemo(() => {
    return WizardNavigationService.calculateProgress(currentStep);
  }, [currentStep]);

  // 🔄 Item Wizard прогрес (якщо активний)
  const itemWizardProgress = useMemo(() => {
    if (!currentSubStep) return null;

    const subStepLabels: Record<ItemWizardStep, string> = {
      [ItemWizardStep.BASIC_INFO]: 'Основна інформація',
      [ItemWizardStep.PROPERTIES]: 'Характеристики',
      [ItemWizardStep.DEFECTS]: 'Дефекти та плями',
      [ItemWizardStep.PRICING]: 'Розрахунок ціни',
      [ItemWizardStep.PHOTOS]: 'Фотографії',
    };

    const allSubSteps = Object.values(ItemWizardStep);
    const currentIndex = allSubSteps.indexOf(currentSubStep);
    const totalSubSteps = allSubSteps.length;

    return {
      currentStep: currentSubStep,
      currentStepLabel: subStepLabels[currentSubStep],
      stepIndex: currentIndex + 1,
      totalSteps: totalSubSteps,
      percent: Math.round(((currentIndex + 1) / totalSubSteps) * 100),
      isFirstStep: currentIndex === 0,
      isLastStep: currentIndex === totalSubSteps - 1,
    };
  }, [currentSubStep]);

  // 📈 Статистика виконання
  const statistics = useMemo(() => {
    const totalSteps = Object.values(WizardStep).length;
    const completedCount = completedSteps.length;

    return {
      totalSteps,
      completedSteps: completedCount,
      currentStepNumber: steps.findIndex((s) => s.isCurrent) + 1,
      isWizardCompleted: completedCount === totalSteps,
      remainingSteps: totalSteps - completedCount,
    };
  }, [steps, completedSteps]);

  // 🎯 Поточний крок деталі
  const currentStepInfo = useMemo(() => {
    return steps.find((s) => s.isCurrent) || null;
  }, [steps]);

  return {
    // 📋 Кроки
    steps,
    currentStepInfo,

    // 📊 Прогрес
    progress,
    itemWizardProgress,

    // 📈 Статистика
    statistics,

    // 🔍 Утиліти
    isStepCompleted: (step: WizardStep) => completedSteps.includes(step),
    isStepAccessible: (step: WizardStep) =>
      WizardNavigationService.isStepAccessible(step, completedSteps),
    getStepLabel: (step: WizardStep) => steps.find((s) => s.step === step)?.label || '',
  };
};
