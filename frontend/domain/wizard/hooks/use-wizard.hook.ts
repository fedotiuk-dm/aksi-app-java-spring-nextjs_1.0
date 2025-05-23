import { useCallback, useMemo } from 'react';

import { useWizardNavigation } from './use-wizard-navigation.hook';
import { useWizardState } from './use-wizard-state.hook';
import { WizardValidationService } from '../services/wizard-validation.service';
import { useWizardStore } from '../store/wizard.store';
import { WizardStep, WizardContext, StepValidationResult, WizardStatus } from '../types';

/**
 * Main Wizard Hook (Facade)
 * Композиційний хук що об'єднує всі wizard операції
 *
 * SOLID принципи:
 * - Single Responsibility: композиція wizard функціональності
 * - Open/Closed: легко розширювати через додавання нових хуків
 * - Dependency Inversion: залежить від абстракцій хуків
 * - Composition over Inheritance: використовує композицію хуків
 */
export const useWizard = () => {
  // Композиція спеціалізованих хуків
  const state = useWizardState();
  const navigation = useWizardNavigation();

  // Store actions
  const {
    initialize,
    reset,
    startItemWizard,
    finishItemWizard,
    updateStepAvailability,
    changeMode,
    updateStatus,
    getEvents,
    clearEvents,
    validateStep,
  } = useWizardStore();

  // Validation service
  const validationService = useMemo(() => new WizardValidationService(), []);

  // Lifecycle methods
  const initializeWizard = useCallback(
    (wizardContext: WizardContext) => {
      // Валідуємо контекст перед ініціалізацією
      const contextValidation = validationService.validateWizardContext(wizardContext);
      if (!contextValidation.canProceed) {
        updateStatus(WizardStatus.ERROR);
        return {
          success: false,
          errors: contextValidation.errors,
        };
      }

      initialize(wizardContext);
      return {
        success: true,
        errors: [],
      };
    },
    [initialize, validationService, updateStatus]
  );

  const resetWizard = useCallback(() => {
    reset();
    clearEvents();
  }, [reset, clearEvents]);

  // Item wizard methods
  const startItemWizardFlow = useCallback(() => {
    if (state.currentStep !== WizardStep.ITEM_MANAGER) {
      return {
        success: false,
        error: 'Item Wizard можна запустити тільки з кроку ITEM_MANAGER',
      };
    }

    startItemWizard();
    return { success: true };
  }, [state.currentStep, startItemWizard]);

  const finishItemWizardFlow = useCallback(
    (saveItem: boolean = true) => {
      if (!state.isItemWizardActive) {
        return {
          success: false,
          error: 'Item Wizard не активний',
        };
      }

      finishItemWizard(saveItem);
      return { success: true };
    },
    [state.isItemWizardActive, finishItemWizard]
  );

  // Validation methods
  const validateCurrentStep = useCallback(
    (data?: unknown): StepValidationResult => {
      return validationService.validateStep(state.currentStep, data);
    },
    [validationService, state.currentStep]
  );

  const validateStepTransition = useCallback(
    (from: WizardStep, to: WizardStep): StepValidationResult => {
      return validationService.validateTransition(from, to);
    },
    [validationService]
  );

  const isStepComplete = useCallback(
    (step: WizardStep, data?: unknown): boolean => {
      return validationService.isStepComplete(step, data);
    },
    [validationService]
  );

  const isStepAvailable = useCallback(
    (step: WizardStep): boolean => {
      return state.availability[step] || false;
    },
    [state.availability]
  );

  const getRequiredSteps = useCallback((): WizardStep[] => {
    return validationService.getRequiredSteps(state.isItemWizardActive);
  }, [validationService, state.isItemWizardActive]);

  // Utility methods
  const getStepInfo = useCallback(
    (targetStep: WizardStep) => {
      const index = navigation.getStepIndex(targetStep);
      return {
        step: targetStep,
        index,
        isActive: targetStep === state.currentStep,
        isCompleted: index < navigation.getStepIndex(state.currentStep),
        isAvailable: isStepAvailable(targetStep),
        isRequired: getRequiredSteps().includes(targetStep),
      };
    },
    [navigation, state.currentStep, isStepAvailable, getRequiredSteps]
  );

  const getAllStepsInfo = useCallback(() => {
    return navigation.stepsOrder.map((step) => getStepInfo(step));
  }, [navigation.stepsOrder, getStepInfo]);

  // Event handling
  const domainEvents = useMemo(() => getEvents(), [getEvents]);

  const clearDomainEvents = useCallback(() => {
    clearEvents();
  }, [clearEvents]);

  // Debug helpers (тільки для development)
  const debugInfo = useMemo(() => {
    if (process.env.NODE_ENV !== 'development') return null;

    return {
      wizardId: state.wizardId,
      currentStep: state.currentStep,
      mode: state.mode,
      status: state.status,
      stepHistory: state.navigationState.stepHistory,
      availability: state.availability,
      progress: navigation.progress,
      events: domainEvents.length,
    };
  }, [state, navigation.progress, domainEvents]);

  return {
    // State (from useWizardState)
    ...state,

    // Navigation (from useWizardNavigation)
    ...navigation,

    // Lifecycle actions
    initializeWizard,
    resetWizard,

    // Item wizard actions
    startItemWizardFlow,
    finishItemWizardFlow,

    // Store actions
    updateStepAvailability,
    changeMode,
    updateStatus,

    // Validation
    validateCurrentStep,
    validateStepTransition,
    validateStep,
    isStepComplete,
    isStepAvailable,
    getRequiredSteps,

    // Utilities
    getStepInfo,
    getAllStepsInfo,

    // Events
    domainEvents,
    clearDomainEvents,

    // Debug (тільки для development)
    debugInfo,
  };
};
