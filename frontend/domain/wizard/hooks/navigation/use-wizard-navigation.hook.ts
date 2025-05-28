/**
 * @fileoverview Основний навігаційний хук для wizard
 * @module domain/wizard/hooks/navigation
 */

import { useMachine } from '@xstate/react';
import { useCallback } from 'react';

import { wizardMachine, WizardNavigationService } from '../../machines';
import { useWizardStore } from '../../store';
import { WizardStep, ItemWizardStep } from '../../types';

/**
 * Основний навігаційний хук для wizard
 * 🔗 Композиція: XState + Zustand + навігаційний сервіс
 */
export const useWizardNavigation = () => {
  // 🚦 XState - машина станів
  const [state, send] = useMachine(wizardMachine);

  // 🏪 Zustand - глобальний стан
  const { currentStep, currentSubStep, setCurrentStep, setCurrentSubStep, resetWizard } =
    useWizardStore();

  // 🚦 Навігаційні методи
  const goToNextStep = useCallback(() => {
    const nextStep = WizardNavigationService.getNextStep(currentStep);
    if (nextStep && WizardNavigationService.canNavigateNext(currentStep)) {
      setCurrentStep(nextStep);
      send({ type: 'NEXT' });
    }
  }, [currentStep, setCurrentStep, send]);

  const goToPreviousStep = useCallback(() => {
    const prevStep = WizardNavigationService.getPreviousStep(currentStep);
    if (prevStep && WizardNavigationService.canNavigateBack(currentStep)) {
      setCurrentStep(prevStep);
      send({ type: 'PREV' });
    }
  }, [currentStep, setCurrentStep, send]);

  const goToStep = useCallback(
    (step: WizardStep) => {
      setCurrentStep(step);
      send({ type: 'GO_TO_STEP', step });
    },
    [setCurrentStep, send]
  );

  // 🔄 Item Wizard навігація
  const goToNextSubStep = useCallback(() => {
    if (!currentSubStep) return;

    const nextSubStep = WizardNavigationService.getNextSubStep(currentSubStep);
    if (nextSubStep) {
      setCurrentSubStep(nextSubStep);
      send({ type: 'NEXT_ITEM_STEP' });
    }
  }, [currentSubStep, setCurrentSubStep, send]);

  const goToPreviousSubStep = useCallback(() => {
    if (!currentSubStep) return;

    const prevSubStep = WizardNavigationService.getPreviousSubStep(currentSubStep);
    if (prevSubStep) {
      setCurrentSubStep(prevSubStep);
      send({ type: 'PREV_ITEM_STEP' });
    }
  }, [currentSubStep, setCurrentSubStep, send]);

  // 📊 Стан навігації
  const progress = WizardNavigationService.calculateProgress(currentStep);
  const canProceed = WizardNavigationService.canNavigateNext(currentStep);
  const canGoBack = WizardNavigationService.canNavigateBack(currentStep);

  // 🔄 Управління Item Wizard
  const startItemWizard = useCallback(() => {
    setCurrentSubStep(ItemWizardStep.BASIC_INFO);
    send({ type: 'START_ITEM_WIZARD' });
  }, [setCurrentSubStep, send]);

  const completeItemWizard = useCallback(() => {
    setCurrentSubStep(undefined);
    send({ type: 'COMPLETE_ITEM_WIZARD' });
  }, [setCurrentSubStep, send]);

  const cancelItemWizard = useCallback(() => {
    setCurrentSubStep(undefined);
    send({ type: 'CANCEL_ITEM_WIZARD' });
  }, [setCurrentSubStep, send]);

  // 🔄 Загальне управління wizard
  const completeWizard = useCallback(() => {
    send({ type: 'COMPLETE_WIZARD' });
  }, [send]);

  const resetWizardState = useCallback(() => {
    resetWizard();
    send({ type: 'RESET' });
  }, [resetWizard, send]);

  return {
    // 📍 Поточний стан
    currentStep,
    currentSubStep,
    xstateValue: state.value,

    // 📊 Інформація про навігацію
    progress,
    canProceed,
    canGoBack,

    // 🚦 Основна навігація
    goToNextStep,
    goToPreviousStep,
    goToStep,

    // 🔄 Item Wizard навігація
    goToNextSubStep,
    goToPreviousSubStep,
    startItemWizard,
    completeItemWizard,
    cancelItemWizard,

    // 🔄 Загальне управління
    completeWizard,
    resetWizard: resetWizardState,
  };
};
