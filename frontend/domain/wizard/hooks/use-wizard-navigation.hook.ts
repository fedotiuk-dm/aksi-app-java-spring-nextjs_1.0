import { useCallback, useMemo } from 'react';

import { useWizardState } from './use-wizard-state.hook';
import { WizardNavigationService } from '../services/wizard-navigation.service';
import { useWizardStore } from '../store/wizard.store';
import { WizardStep, NavigationResult } from '../types';

/**
 * Wizard Navigation Hook
 * Спеціалізований хук для навігації wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки навігаційна логіка
 * - Open/Closed: легко розширювати новими методами навігації
 * - Dependency Inversion: залежить від сервісів та стору
 */
export const useWizardNavigation = () => {
  const { currentStep, isItemWizardActive } = useWizardState();
  const { goToStep, goBack, goForward, calculateProgress } = useWizardStore();

  // Navigation service
  const navigationService = useMemo(() => new WizardNavigationService(), []);

  // Navigation helpers
  const nextStep = useMemo(() => {
    return navigationService.getNextStep(currentStep, isItemWizardActive);
  }, [navigationService, currentStep, isItemWizardActive]);

  const progress = useMemo(() => {
    return calculateProgress();
  }, [calculateProgress]);

  const stepsOrder = useMemo(() => {
    return navigationService.getStepsByOrder(isItemWizardActive);
  }, [navigationService, isItemWizardActive]);

  // Navigation actions
  const navigateToStep = useCallback(
    (step: WizardStep): NavigationResult => {
      return goToStep(step);
    },
    [goToStep]
  );

  const navigateBack = useCallback((): NavigationResult => {
    return goBack();
  }, [goBack]);

  const navigateForward = useCallback((): NavigationResult => {
    return goForward();
  }, [goForward]);

  // Step utilities
  const getStepIndex = useCallback(
    (step: WizardStep): number => {
      return navigationService.getStepIndex(step, isItemWizardActive);
    },
    [navigationService, isItemWizardActive]
  );

  const isStepBefore = useCallback(
    (step: WizardStep, compareWith: WizardStep): boolean => {
      const stepIndex = getStepIndex(step);
      const compareIndex = getStepIndex(compareWith);
      return stepIndex < compareIndex;
    },
    [getStepIndex]
  );

  const isStepAfter = useCallback(
    (step: WizardStep, compareWith: WizardStep): boolean => {
      const stepIndex = getStepIndex(step);
      const compareIndex = getStepIndex(compareWith);
      return stepIndex > compareIndex;
    },
    [getStepIndex]
  );

  const getStepsFromTo = useCallback(
    (from: WizardStep, to: WizardStep): WizardStep[] => {
      const fromIndex = getStepIndex(from);
      const toIndex = getStepIndex(to);
      const startIndex = Math.min(fromIndex, toIndex);
      const endIndex = Math.max(fromIndex, toIndex);

      return stepsOrder.slice(startIndex, endIndex + 1);
    },
    [getStepIndex, stepsOrder]
  );

  // Progress utilities
  const getProgressForStep = useCallback(
    (step: WizardStep): number => {
      return navigationService.calculateProgress(step, isItemWizardActive);
    },
    [navigationService, isItemWizardActive]
  );

  const getRemainingSteps = useCallback((): WizardStep[] => {
    const currentIndex = getStepIndex(currentStep);
    return stepsOrder.slice(currentIndex + 1);
  }, [getStepIndex, currentStep, stepsOrder]);

  const getCompletedSteps = useCallback((): WizardStep[] => {
    const currentIndex = getStepIndex(currentStep);
    return stepsOrder.slice(0, currentIndex);
  }, [getStepIndex, currentStep, stepsOrder]);

  return {
    // Navigation state
    currentStep,
    nextStep,
    progress,
    stepsOrder,

    // Navigation actions
    navigateToStep,
    navigateBack,
    navigateForward,

    // Step utilities
    getStepIndex,
    isStepBefore,
    isStepAfter,
    getStepsFromTo,

    // Progress utilities
    getProgressForStep,
    getRemainingSteps,
    getCompletedSteps,

    // Service access
    navigationService,
  };
};
