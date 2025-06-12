/**
 * @fileoverview Композиційний хук для домену "Створення клієнта"
 *
 * Об'єднує всі розділені хуки в єдиний інтерфейс
 * за принципом "Golden Rule" архітектури та SOLID принципами
 */

import { useMemo } from 'react';

import { useClientCreationStore } from './client-creation.store';
import { useClientCreationBusiness } from './use-client-creation-business.hook';
import { useClientCreationForms } from './use-client-creation-forms.hook';
import { useClientCreationNavigation } from './use-client-creation-navigation.hook';

/**
 * Головний композиційний хук домену "Створення клієнта"
 *
 * Принципи:
 * - Single Responsibility: кожен підхук має одну відповідальність
 * - Open/Closed: легко розширювати без модифікації існуючого коду
 * - Dependency Inversion: залежність від абстракцій (хуків), а не конкретних реалізацій
 */
export const useClientCreation = () => {
  // 1. Бізнес-логіка (API + стор координація)
  const business = useClientCreationBusiness();

  // 2. Навігація між кроками
  const navigation = useClientCreationNavigation();

  // 3. Управління формами
  const forms = useClientCreationForms();

  // 4. Додатковий UI стан (що не входить в бізнес-логіку)
  const {
    validationErrors,
    showDuplicateWarning,
    duplicateClientId,
    isAdvancedMode,
    autoCompleteEnabled,
    formData,

    // UI дії
    setFormField,
    setValidationError,
    clearValidationErrors,
    setDuplicateWarning,
    toggleAdvancedMode,
    setAutoCompleteEnabled,
  } = useClientCreationStore();

  // 5. Групування результатів за логічними блоками
  const ui = useMemo(
    () => ({
      // З бізнес-логіки
      ...business.ui,

      // З навігації
      currentStep: navigation.currentStep,
      isFirstStep: navigation.isFirstStep,
      isLastStep: navigation.isLastStep,
      stepIndex: navigation.stepIndex,
      totalSteps: navigation.totalSteps,
      canGoNext: navigation.canGoNext,
      canGoPrevious: navigation.canGoPrevious,

      // Додатковий UI стан
      validationErrors,
      showDuplicateWarning,
      duplicateClientId,
      isAdvancedMode,
      autoCompleteEnabled,
      formData,
    }),
    [
      business.ui,
      navigation,
      validationErrors,
      showDuplicateWarning,
      duplicateClientId,
      isAdvancedMode,
      autoCompleteEnabled,
      formData,
    ]
  );

  const data = useMemo(
    () => ({
      ...business.data,
    }),
    [business.data]
  );

  const loading = useMemo(
    () => ({
      ...business.loading,
    }),
    [business.loading]
  );

  const actions = useMemo(
    () => ({
      // Бізнес-операції
      ...business,

      // Навігація
      goToNextStep: navigation.goToNextStep,
      goToPreviousStep: navigation.goToPreviousStep,
      goToStep: navigation.goToStep,

      // UI управління
      setFormField,
      setValidationError,
      clearValidationErrors,
      setDuplicateWarning,
      toggleAdvancedMode,
      setAutoCompleteEnabled,
    }),
    [
      business,
      navigation.goToNextStep,
      navigation.goToPreviousStep,
      navigation.goToStep,
      setFormField,
      setValidationError,
      clearValidationErrors,
      setDuplicateWarning,
      toggleAdvancedMode,
      setAutoCompleteEnabled,
    ]
  );

  return {
    ui,
    data,
    loading,
    actions,
    forms,
  };
};

export type UseClientCreationReturn = ReturnType<typeof useClientCreation>;
