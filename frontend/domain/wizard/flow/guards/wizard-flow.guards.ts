/**
 * Guards для XState машини wizard - перевірки можливості переходів
 */

import { WizardStep, ItemWizardStep } from '../../shared/types/wizard-common.types';
import { WizardContext } from '../context';
import { WizardEvent } from '../events';

// Основні guards для переходів між кроками
export const canProceedToNextStep = ({
  context,
}: {
  context: WizardContext;
  event: WizardEvent;
}) => {
  return context.validation.isValid && context.progress.canProceed;
};

export const canReturnToPrevStep = ({
  context,
}: {
  context: WizardContext;
  event: WizardEvent;
}) => {
  return context.currentStep !== WizardStep.CLIENT_SELECTION;
};

export const canGotoStep = ({ context, event }: { context: WizardContext; event: WizardEvent }) => {
  if (event.type !== 'GOTO_STEP') return false;

  const targetStep = event.targetStep;
  const currentStepIndex = Object.values(WizardStep).indexOf(context.currentStep);
  const targetStepIndex = Object.values(WizardStep).indexOf(targetStep);

  // Можна переходити тільки до завершених кроків або наступного кроку
  return (
    targetStepIndex <= currentStepIndex + 1 || context.progress.completedSteps.includes(targetStep)
  );
};

// Guards для Item Wizard
export const canStartItemWizard = ({ context }: { context: WizardContext; event: WizardEvent }) => {
  return context.currentStep === WizardStep.ITEM_MANAGER;
};

export const canProceedItemStep = ({ context }: { context: WizardContext; event: WizardEvent }) => {
  return context.currentItemStep !== undefined && context.validation.isValid;
};

export const canReturnItemStep = ({ context }: { context: WizardContext; event: WizardEvent }) => {
  return context.currentItemStep !== ItemWizardStep.ITEM_BASIC_INFO;
};

export const canCompleteItemWizard = ({
  context,
}: {
  context: WizardContext;
  event: WizardEvent;
}) => {
  return (
    context.currentItemStep === ItemWizardStep.PHOTO_DOCUMENTATION && context.validation.isValid
  );
};

// Guards для валідації
export const needsValidation = ({ context }: { context: WizardContext; event: WizardEvent }) => {
  return !context.validation.isValid || context.validation.errors.length > 0;
};

export const canComplete = ({ context }: { context: WizardContext; event: WizardEvent }) => {
  return (
    context.currentStep === WizardStep.ORDER_CONFIRMATION &&
    context.validation.isValid &&
    context.progress.completedSteps.length === Object.values(WizardStep).length - 1
  );
};

// Guards для persistence
export const hasUnsavedChanges = ({ context }: { context: WizardContext; event: WizardEvent }) => {
  return context.session.hasUnsavedChanges;
};

export const shouldAutoSave = ({ context }: { context: WizardContext; event: WizardEvent }) => {
  const now = Date.now();
  const lastActivity = context.session.lastActivity?.getTime() || 0;
  return now - lastActivity >= context.session.autoSaveInterval;
};
