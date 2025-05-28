/**
 * @fileoverview Базовий хук для wizard домену
 *
 * Забезпечує загальну функціональність для всіх хуків wizard:
 * - Логування з префіксом domain
 * - Загальні утиліти та константи
 * - Base typing для wizard операцій
 */

import { useCallback } from 'react';

/**
 * 🎯 Базовий хук для wizard домену
 */
export function useWizardBase() {
  const logInfo = useCallback((message: string, ...args: unknown[]) => {
    console.info(`[WizardDomain] ${message}`, ...args);
  }, []);

  const logError = useCallback((message: string, ...args: unknown[]) => {
    console.error(`[WizardDomain] ${message}`, ...args);
  }, []);

  const logWarning = useCallback((message: string, ...args: unknown[]) => {
    console.warn(`[WizardDomain] ${message}`, ...args);
  }, []);

  const logDebug = useCallback((message: string, ...args: unknown[]) => {
    console.debug(`[WizardDomain] ${message}`, ...args);
  }, []);

  return {
    logInfo,
    logError,
    logWarning,
    logDebug,
  };
}

/**
 * 🎯 Типи для wizard операцій
 */
export interface WizardStepBase {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface WizardOperationState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}
