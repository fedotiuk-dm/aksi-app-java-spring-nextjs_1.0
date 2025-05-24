/**
 * Типи контексту та метаданих wizard - відповідальність за контекстну інформацію
 */

import { WizardMode } from './wizard-modes.types';

/**
 * Метадані wizard сесії
 */
export interface WizardMetadata {
  startedAt: string;
  lastUpdated?: string;
  userAgent?: string;
  sessionId?: string;
  version?: string;
  operatorId?: string;
  branchId?: string;
}

/**
 * Контекст виконання wizard
 */
export interface WizardContext {
  mode: WizardMode;
  orderId?: string;
  customerId?: string;
  metadata: WizardMetadata;
}

/**
 * Розширений контекст з додатковою інформацією
 */
export interface ExtendedWizardContext extends WizardContext {
  isTestMode: boolean;
  debugEnabled: boolean;
  locale: string;
  timezone: string;
  featureFlags: Record<string, boolean>;
}

/**
 * Контекст автентифікації оператора
 */
export interface OperatorContext {
  operatorId: string;
  operatorName: string;
  role: string;
  permissions: string[];
  branchId: string;
  branchName: string;
}

/**
 * Повний контекст wizard з оператором
 */
export interface FullWizardContext extends ExtendedWizardContext {
  operator: OperatorContext;
}
