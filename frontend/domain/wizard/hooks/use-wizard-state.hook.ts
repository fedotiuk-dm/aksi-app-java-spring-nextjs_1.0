import { useMemo } from 'react';

import { useWizardStore } from '../store/wizard.store';
import { WizardStep, WizardMode, WizardStatus, StepAvailability } from '../types';

/**
 * Wizard State Hook
 * Спеціалізований хук для доступу до стану wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки стан wizard
 * - Interface Segregation: мінімальний API для стану
 * - Dependency Inversion: залежить від store абстракції
 */
export const useWizardState = () => {
  const { wizard, isInitialized, lastError } = useWizardStore();

  // Безпечний доступ до властивостей wizard entity
  const currentStep = wizard?.currentStep || WizardStep.CLIENT_SELECTION;
  const mode = wizard?.mode || WizardMode.CREATE;
  const status = wizard?.status || WizardStatus.IDLE;
  const context = wizard?.context;
  const stepHistory = useMemo(() => wizard?.stepHistory || [], [wizard?.stepHistory]);
  const availability: StepAvailability = useMemo(
    () => wizard?.availability || ({} as StepAvailability),
    [wizard?.availability]
  );
  const isItemWizardActive = wizard?.isItemWizardActive || false;
  const canGoBack = wizard?.canGoBack || false;
  const canGoForward = wizard?.canGoForward || false;
  const previousStep = wizard?.previousStep;

  // Computed state
  const wizardId = wizard?.id;
  const hasErrors = Boolean(lastError);
  const isInProgress = status === WizardStatus.LOADING || status === WizardStatus.SUBMITTING;

  // Мемоізовані обчислення
  const stateInfo = useMemo(
    () => ({
      isInitialized,
      hasErrors,
      isInProgress,
      currentStep,
      mode,
      status,
      isItemWizardActive,
    }),
    [isInitialized, hasErrors, isInProgress, currentStep, mode, status, isItemWizardActive]
  );

  const navigationState = useMemo(
    () => ({
      canGoBack,
      canGoForward,
      previousStep,
      currentStep,
      stepHistory: stepHistory.map((entry) => ({
        step: entry.step,
        direction: entry.direction,
        timestamp: new Date(entry.timestamp).toISOString(),
      })),
    }),
    [canGoBack, canGoForward, previousStep, currentStep, stepHistory]
  );

  const availabilityInfo = useMemo(
    () => ({
      availability,
      availableSteps: Object.entries(availability)
        .filter(([, isAvailable]) => isAvailable)
        .map(([step]) => step as WizardStep),
      unavailableSteps: Object.entries(availability)
        .filter(([, isAvailable]) => !isAvailable)
        .map(([step]) => step as WizardStep),
    }),
    [availability]
  );

  return {
    // Core state
    wizard,
    wizardId,
    isInitialized,
    lastError,
    hasErrors,

    // Wizard properties
    currentStep,
    mode,
    status,
    context,
    stepHistory,
    availability,
    isItemWizardActive,
    isInProgress,

    // Navigation state
    canGoBack,
    canGoForward,
    previousStep,

    // Computed state
    stateInfo,
    navigationState,
    availabilityInfo,
  };
};
