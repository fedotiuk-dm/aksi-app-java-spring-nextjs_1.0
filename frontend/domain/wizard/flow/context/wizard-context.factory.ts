/**
 * Фабрика контексту XState машини wizard
 */

import {
  WizardContext,
  WizardContextInput,
  WizardProgressInfo,
  WizardValidationInfo,
  WizardSessionInfo,
  WizardMetadata,
} from './wizard-context.types';
import { WizardStep, WizardMode } from '../../shared/types/wizard-common.types';

const CONTEXT_DEFAULTS = {
  INITIAL_STEP: WizardStep.CLIENT_SELECTION,
  DEFAULT_MODE: WizardMode.CREATE,
  AUTO_SAVE_INTERVAL: 5 * 60 * 1000, // 5 хвилин
  INITIAL_PROGRESS: 0,
} as const;

// Генерує унікальний ID сесії
const generateSessionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}_${random}`;
};

// Розраховує прогрес за кроком
const calculateProgress = (step: WizardStep): number => {
  const steps = Object.values(WizardStep);
  const index = steps.indexOf(step);
  return Math.round((index / (steps.length - 1)) * 100);
};

// Головна фабрика контексту
export const createInitialContext = (input: WizardContextInput = {}): WizardContext => {
  return {
    currentStep: input.initialStep ?? CONTEXT_DEFAULTS.INITIAL_STEP,
    currentItemStep: undefined,
    mode: input.mode ?? CONTEXT_DEFAULTS.DEFAULT_MODE,
    progress: createInitialProgressInfo(input.initialStep),
    validation: createInitialValidationInfo(),
    session: createInitialSessionInfo(input.sessionId),
    metadata: createInitialMetadata(input),
  };
};

export const createInitialProgressInfo = (
  initialStep: WizardStep = CONTEXT_DEFAULTS.INITIAL_STEP
): WizardProgressInfo => ({
  percentage: calculateProgress(initialStep),
  completedSteps: [],
  completedItemSteps: [],
  canProceed: false,
  isLastStep: initialStep === WizardStep.ORDER_CONFIRMATION,
});

export const createInitialValidationInfo = (): WizardValidationInfo => ({
  isValid: false,
  errors: [],
  warnings: [],
  isValidating: false,
  lastValidated: undefined,
});

export const createInitialSessionInfo = (customSessionId?: string): WizardSessionInfo => {
  const now = new Date();
  return {
    sessionId: customSessionId ?? generateSessionId(),
    startedAt: now,
    lastActivity: now,
    hasUnsavedChanges: false,
    autoSaveInterval: CONTEXT_DEFAULTS.AUTO_SAVE_INTERVAL,
  };
};

export const createInitialMetadata = (input: WizardContextInput): WizardMetadata => ({
  customData: {},
  returnUrl: input.returnUrl,
  isPersistent: input.isPersistent ?? false,
  orderId: input.orderId,
});

// Спеціалізовані фабрики
export const createViewContext = (orderId: string, returnUrl?: string): WizardContext =>
  createInitialContext({
    mode: WizardMode.VIEW,
    orderId,
    returnUrl,
    initialStep: WizardStep.ORDER_CONFIRMATION,
    isPersistent: false,
  });

export const createEditContext = (
  orderId: string,
  startStep: WizardStep = WizardStep.CLIENT_SELECTION,
  returnUrl?: string
): WizardContext =>
  createInitialContext({
    mode: WizardMode.EDIT,
    orderId,
    initialStep: startStep,
    returnUrl,
    isPersistent: true,
  });
