/**
 * Actions для XState машини wizard - операції зміни контексту
 */

import { WizardStep, ItemWizardStep } from '../../shared/types/wizard-common.types';
import { WizardContext } from '../context/wizard-context.types';

// Navigation actions
export const updateStepContext = (
  context: WizardContext,
  targetStep: WizardStep
): Partial<WizardContext> => ({
  currentStep: targetStep,
  currentItemStep: undefined,
});

export const updateNextStepContext = (context: WizardContext): Partial<WizardContext> => {
  const steps = Object.values(WizardStep);
  const currentIndex = steps.indexOf(context.currentStep);
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : context.currentStep;

  return {
    currentStep: nextStep,
    currentItemStep: undefined,
  };
};

export const updatePrevStepContext = (context: WizardContext): Partial<WizardContext> => {
  const steps = Object.values(WizardStep);
  const currentIndex = steps.indexOf(context.currentStep);
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : context.currentStep;

  return {
    currentStep: prevStep,
    currentItemStep: undefined,
  };
};

// Item Wizard actions
export const updateItemStepContext = (
  context: WizardContext,
  targetItemStep: ItemWizardStep
): Partial<WizardContext> => ({
  currentItemStep: targetItemStep,
});

export const updateNextItemStepContext = (context: WizardContext): Partial<WizardContext> => {
  if (!context.currentItemStep) return {};

  const steps = Object.values(ItemWizardStep);
  const currentIndex = steps.indexOf(context.currentItemStep);
  const nextStep =
    currentIndex < steps.length - 1 ? steps[currentIndex + 1] : context.currentItemStep;

  return { currentItemStep: nextStep };
};

export const updatePrevItemStepContext = (context: WizardContext): Partial<WizardContext> => {
  if (!context.currentItemStep) return {};

  const steps = Object.values(ItemWizardStep);
  const currentIndex = steps.indexOf(context.currentItemStep);
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : context.currentItemStep;

  return { currentItemStep: prevStep };
};

// Progress actions
export const updateProgressContext = (context: WizardContext): Partial<WizardContext> => {
  const steps = Object.values(WizardStep);
  const currentIndex = steps.indexOf(context.currentStep);
  const percentage = Math.round((currentIndex / (steps.length - 1)) * 100);

  return {
    progress: {
      ...context.progress,
      percentage,
      canProceed: context.validation.isValid,
      isLastStep: context.currentStep === WizardStep.ORDER_CONFIRMATION,
    },
  };
};

export const markStepCompletedContext = (context: WizardContext): Partial<WizardContext> => ({
  progress: {
    ...context.progress,
    completedSteps: context.progress.completedSteps.includes(context.currentStep)
      ? context.progress.completedSteps
      : [...context.progress.completedSteps, context.currentStep],
  },
});

// Validation actions
export const updateValidationContext = (
  context: WizardContext,
  errors: string[] = [],
  isValid = false
): Partial<WizardContext> => ({
  validation: {
    ...context.validation,
    errors,
    isValid,
    isValidating: false,
    lastValidated: new Date(),
  },
});

export const clearValidationContext = (
  context: WizardContext,
  specificErrors?: string[]
): Partial<WizardContext> => {
  const filteredErrors = specificErrors
    ? context.validation.errors.filter((error: string) => !specificErrors.includes(error))
    : [];

  return {
    validation: {
      ...context.validation,
      errors: filteredErrors,
      isValid: filteredErrors.length === 0,
    },
  };
};

// Session actions
export const updateSessionContext = (context: WizardContext): Partial<WizardContext> => ({
  session: {
    ...context.session,
    lastActivity: new Date(),
  },
});

export const markUnsavedChangesContext = (context: WizardContext): Partial<WizardContext> => ({
  session: {
    ...context.session,
    hasUnsavedChanges: true,
  },
});

export const markChangesSavedContext = (context: WizardContext): Partial<WizardContext> => ({
  session: {
    ...context.session,
    hasUnsavedChanges: false,
  },
});
