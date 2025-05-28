/**
 * @fileoverview Основний навігаційний хук для wizard
 * @module domain/wizard/hooks/navigation
 */

import { useMachine } from '@xstate/react';
import { useCallback } from 'react';

import {
  WIZARD_STEP_LABELS,
  ITEM_WIZARD_STEP_LABELS,
  WIZARD_STEPS_ORDER,
  ITEM_WIZARD_STEPS_ORDER,
} from '../../constants';
import { wizardMachine, WizardNavigationService } from '../../machines';
import { useWizardBaseStore } from '../../store';
import { WizardStep, ItemWizardStep } from '../../types/wizard-steps.types';

/**
 * Основний навігаційний хук для wizard
 * 🔗 Композиція: XState + Zustand + навігаційний сервіс
 */
export const useWizardNavigation = () => {
  // 🚦 XState - машина станів
  const [state, send] = useMachine(wizardMachine);

  // 🏪 Zustand - глобальний стан
  const { currentStep, currentSubStep, setCurrentStep, setCurrentSubStep, resetWizard } =
    useWizardBaseStore();

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

  // 📋 Використання констант
  const getCurrentStepLabel = useCallback(() => {
    return WIZARD_STEP_LABELS[currentStep] || currentStep;
  }, [currentStep]);

  const getCurrentSubStepLabel = useCallback(() => {
    return currentSubStep ? ITEM_WIZARD_STEP_LABELS[currentSubStep] : '';
  }, [currentSubStep]);

  const getNextStepFromOrder = useCallback(() => {
    const currentIndex = WIZARD_STEPS_ORDER.indexOf(currentStep);
    return currentIndex >= 0 && currentIndex < WIZARD_STEPS_ORDER.length - 1
      ? WIZARD_STEPS_ORDER[currentIndex + 1]
      : null;
  }, [currentStep]);

  const getPrevStepFromOrder = useCallback(() => {
    const currentIndex = WIZARD_STEPS_ORDER.indexOf(currentStep);
    return currentIndex > 0 ? WIZARD_STEPS_ORDER[currentIndex - 1] : null;
  }, [currentStep]);

  const getNextSubStepFromOrder = useCallback(() => {
    if (!currentSubStep) return null;
    const currentIndex = ITEM_WIZARD_STEPS_ORDER.indexOf(currentSubStep);
    return currentIndex >= 0 && currentIndex < ITEM_WIZARD_STEPS_ORDER.length - 1
      ? ITEM_WIZARD_STEPS_ORDER[currentIndex + 1]
      : null;
  }, [currentSubStep]);

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

    // 📋 Константи та лейбли
    getCurrentStepLabel,
    getCurrentSubStepLabel,
    getNextStepFromOrder,
    getPrevStepFromOrder,
    getNextSubStepFromOrder,
    wizardStepsOrder: WIZARD_STEPS_ORDER,
    itemWizardStepsOrder: ITEM_WIZARD_STEPS_ORDER,
    wizardStepLabels: WIZARD_STEP_LABELS,
    itemWizardStepLabels: ITEM_WIZARD_STEP_LABELS,
  };
};
