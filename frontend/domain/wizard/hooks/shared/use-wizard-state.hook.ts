/**
 * @fileoverview Хук для зручних селекторів Zustand стору wizard
 * @module domain/wizard/hooks/shared
 */

import { useMemo } from 'react';

import { useWizardStore } from '../../store';

/**
 * Зручні селектори вашого Zustand стору з computed значеннями
 *
 * Надає:
 * - Селектори стану (isLoading, errors, warnings)
 * - Computed значення (hasErrors, canProceed, hasUnsavedChanges)
 * - Методи управління станом
 */
export const useWizardState = () => {
  const {
    // Стан
    isLoading,
    isItemWizardActive,
    hasUnsavedChanges,
    lastSavedAt,
    errors,
    warnings,

    // Дії
    setLoading,
    startItemWizard,
    completeItemWizard,
    markUnsavedChanges,
    markSaved,
    addError,
    addWarning,
    clearErrors,
    clearWarnings,
    completeWizard,
    resetWizard,
  } = useWizardStore();

  // Computed значення
  const computed = useMemo(
    () => ({
      hasErrors: errors.length > 0,
      hasWarnings: warnings.length > 0,
      canProceed: !isLoading && errors.length === 0,
      isActive: !isLoading,
      hasAnyIssues: errors.length > 0 || warnings.length > 0,
      errorCount: errors.length,
      warningCount: warnings.length,
    }),
    [isLoading, errors.length, warnings.length]
  );

  return {
    // Стан
    isLoading,
    isItemWizardActive,
    hasUnsavedChanges,
    lastSavedAt,
    errors,
    warnings,

    // Computed значення
    ...computed,

    // Методи управління станом
    setLoading,
    startItemWizard,
    completeItemWizard,
    markUnsavedChanges,
    markSaved,
    addError,
    addWarning,
    clearErrors,
    clearWarnings,
    completeWizard,
    resetWizard,
  };
};
