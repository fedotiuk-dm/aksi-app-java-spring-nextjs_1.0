// 📋 ПІДЕТАП 2.4: Головний композиційний хук для калькулятора ціни
// Тонка обгортка над Orval хуками для substep4 - Калькулятор ціни
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Orval хуки (готові з бекенду)
import {
  useSubstep4InitializeSubstep,
  useSubstep4CalculatePrice,
  useSubstep4CalculateFinalPrice,
  useSubstep4CalculateBasePrice,
  useSubstep4AddModifier,
  useSubstep4RemoveModifier,
  useSubstep4ConfirmCalculation,
  useSubstep4ResetCalculation,
  useSubstep4GetCurrentState,
  useSubstep4GetCurrentData,
  useSubstep4GetAvailableModifiers,
  useSubstep4GetRecommendedModifiers,
  useSubstep4ValidateCurrentState,
} from '@/shared/api/generated/substep4';

// Локальні імпорти
import { usePriceCalculationStore, usePriceCalculationSelectors } from './store';
import {
  SUBSTEP4_UI_STEPS,
  SUBSTEP4_VALIDATION_RULES,
  calculateSubstep4Progress,
  getNextSubstep4Step,
  getPreviousSubstep4Step,
  isFirstSubstep4Step,
  isLastSubstep4Step,
} from './constants';
import {
  modifierSelectionFormSchema,
  priceCalculationFormSchema,
  calculationConfirmationFormSchema,
  priceCalculationNavigationFormSchema,
  type ModifierSelectionFormData,
  type PriceCalculationFormData,
  type CalculationConfirmationFormData,
  type PriceCalculationNavigationFormData,
} from './schemas';

// =================== ТОНКА ОБГОРТКА ===================
export const useSubstep4PriceCalculation = () => {
  // UI стан з Zustand
  const uiState = usePriceCalculationStore();
  const uiSelectors = usePriceCalculationSelectors();

  // Orval API хуки (без додаткової логіки)
  const initializeMutation = useSubstep4InitializeSubstep();
  const calculatePriceMutation = useSubstep4CalculatePrice();
  const calculateFinalPriceMutation = useSubstep4CalculateFinalPrice();
  const calculateBasePriceMutation = useSubstep4CalculateBasePrice();
  const addModifierMutation = useSubstep4AddModifier();
  const removeModifierMutation = useSubstep4RemoveModifier();
  const confirmCalculationMutation = useSubstep4ConfirmCalculation();
  const resetCalculationMutation = useSubstep4ResetCalculation();

  // Запити даних (тільки якщо є sessionId)
  const currentStateQuery = useSubstep4GetCurrentState(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const currentDataQuery = useSubstep4GetCurrentData(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const availableModifiersQuery = useSubstep4GetAvailableModifiers(
    {
      categoryCode: 'GENERAL',
    },
    {
      query: { enabled: true },
    }
  );

  const recommendedModifiersQuery = useSubstep4GetRecommendedModifiers(
    {
      categoryCode: 'GENERAL',
      itemName: 'DEFAULT',
    },
    {
      query: { enabled: true },
    }
  );

  const validationQuery = useSubstep4ValidateCurrentState(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  // React Hook Form форми
  const modifierSelectionForm = useForm<ModifierSelectionFormData>({
    resolver: zodResolver(modifierSelectionFormSchema),
    defaultValues: {
      selectedModifierIds: uiState.selectedModifiers || [],
      rangeValues: {},
      fixedQuantities: {},
      notes: uiState.calculationNotes || '',
    },
  });

  const priceCalculationForm = useForm<PriceCalculationFormData>({
    resolver: zodResolver(priceCalculationFormSchema),
    defaultValues: {
      categoryCode: '',
      itemName: '',
      color: '',
      quantity: 1,
      expedited: false,
      expeditePercent: 0,
      discountPercent: 0,
    },
  });

  const confirmationForm = useForm<CalculationConfirmationFormData>({
    resolver: zodResolver(calculationConfirmationFormSchema),
    defaultValues: {
      finalPriceAccepted: false,
      calculationNotes: '',
      proceedToNext: false,
    },
  });

  const navigationForm = useForm<PriceCalculationNavigationFormData>({
    resolver: zodResolver(priceCalculationNavigationFormSchema),
    defaultValues: {
      currentStep: uiState.currentStep,
      targetStep: undefined,
      saveProgress: true,
    },
  });

  // Стан завантаження (простий)
  const loading = useMemo(
    () => ({
      isInitializing: initializeMutation.isPending,
      isCalculatingPrice: calculatePriceMutation.isPending,
      isCalculatingFinal: calculateFinalPriceMutation.isPending,
      isCalculatingBase: calculateBasePriceMutation.isPending,
      isAddingModifier: addModifierMutation.isPending,
      isRemovingModifier: removeModifierMutation.isPending,
      isConfirming: confirmCalculationMutation.isPending,
      isResetting: resetCalculationMutation.isPending,
      isLoadingState: currentStateQuery.isLoading,
      isLoadingData: currentDataQuery.isLoading,
      isLoadingModifiers: availableModifiersQuery.isLoading,
      isValidating: validationQuery.isLoading,
      isAnyLoading: [
        initializeMutation.isPending,
        calculatePriceMutation.isPending,
        calculateFinalPriceMutation.isPending,
        calculateBasePriceMutation.isPending,
        addModifierMutation.isPending,
        removeModifierMutation.isPending,
        confirmCalculationMutation.isPending,
        resetCalculationMutation.isPending,
        currentStateQuery.isLoading,
        currentDataQuery.isLoading,
        availableModifiersQuery.isLoading,
        validationQuery.isLoading,
      ].some(Boolean),
    }),
    [
      initializeMutation.isPending,
      calculatePriceMutation.isPending,
      calculateFinalPriceMutation.isPending,
      calculateBasePriceMutation.isPending,
      addModifierMutation.isPending,
      removeModifierMutation.isPending,
      confirmCalculationMutation.isPending,
      resetCalculationMutation.isPending,
      currentStateQuery.isLoading,
      currentDataQuery.isLoading,
      availableModifiersQuery.isLoading,
      validationQuery.isLoading,
    ]
  );

  // Обчислені значення
  const computed = useMemo(
    () => ({
      progress: calculateSubstep4Progress(uiState.currentStep),
      nextStep: getNextSubstep4Step(uiState.currentStep),
      previousStep: getPreviousSubstep4Step(uiState.currentStep),
      isFirstStep: isFirstSubstep4Step(uiState.currentStep),
      isLastStep: isLastSubstep4Step(uiState.currentStep),
      canProceedNext: !loading.isAnyLoading && uiSelectors.hasSelectedModifiers,
      canGoBack: !isFirstSubstep4Step(uiState.currentStep) && !loading.isAnyLoading,
    }),
    [uiState.currentStep, loading.isAnyLoading, uiSelectors.hasSelectedModifiers]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand)
    ui: uiSelectors,

    // API дані (прямо з Orval)
    data: {
      currentState: currentStateQuery.data,
      currentData: currentDataQuery.data,
      availableModifiers: availableModifiersQuery.data,
      recommendedModifiers: recommendedModifiersQuery.data,
      validation: validationQuery.data,
    },

    // Стан завантаження
    loading,

    // API мутації (прямо з Orval)
    mutations: {
      initialize: initializeMutation,
      calculatePrice: calculatePriceMutation,
      calculateFinalPrice: calculateFinalPriceMutation,
      calculateBasePrice: calculateBasePriceMutation,
      addModifier: addModifierMutation,
      removeModifier: removeModifierMutation,
      confirm: confirmCalculationMutation,
      reset: resetCalculationMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      currentState: currentStateQuery,
      currentData: currentDataQuery,
      availableModifiers: availableModifiersQuery,
      recommendedModifiers: recommendedModifiersQuery,
      validation: validationQuery,
    },

    // Форми React Hook Form
    forms: {
      modifierSelection: modifierSelectionForm,
      priceCalculation: priceCalculationForm,
      confirmation: confirmationForm,
      navigation: navigationForm,
    },

    // Обчислені значення
    computed,

    // Константи
    constants: {
      steps: SUBSTEP4_UI_STEPS,
      validationRules: SUBSTEP4_VALIDATION_RULES,
    },
  };
};

// =================== ТИПИ ===================
export type UseSubstep4PriceCalculationReturn = ReturnType<typeof useSubstep4PriceCalculation>;
