/**
 * @fileoverview Хук для роботи з станом wizard
 * @module domain/wizard/hooks/shared
 */

import { useWizardStore } from '../../store';

/**
 * Хук для роботи з станом wizard
 *
 * Принципи DDD:
 * - Тільки React стан та UI логіка
 * - Інкапсулює доступ до Zustand store
 * - Надає зручний API для UI компонентів
 */
export const useWizardState = () => {
  const {
    isLoading,
    errors,
    warnings,
    hasUnsavedChanges,
    lastSavedAt,
    addError,
    addWarning,
    clearErrors,
    clearWarnings,
    markUnsavedChanges,
    markSaved,
  } = useWizardStore();

  return {
    // Стан
    isLoading,
    errors,
    warnings,
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
    hasUnsavedChanges,
    lastSavedAt,

    // Методи
    addError,
    addWarning,
    clearErrors,
    clearWarnings,
    markUnsavedChanges,
    markSaved,
  };
};
