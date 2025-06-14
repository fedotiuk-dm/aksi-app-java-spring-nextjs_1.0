// Substep4 Workflow Hook - тонка обгортка над Orval хуками
// Координація між API та UI станом для substep4 (розрахунок ціни)

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';

// Orval хуки
import {
  useSubstep4InitializeSubstep,
  useSubstep4CalculatePrice,
  useSubstep4CalculateBasePrice,
  useSubstep4CalculateFinalPrice,
  useSubstep4AddModifier,
  useSubstep4RemoveModifier,
  useSubstep4ConfirmCalculation,
  useSubstep4ResetCalculation,
  useSubstep4GetCurrentState,
  useSubstep4GetCurrentData,
  useSubstep4GetAvailableModifiers,
  useSubstep4GetRecommendedModifiers,
  useSubstep4ValidateCurrentState,
  // Тільки типи даних, які використовуються в data секції
  type Substep4GetCurrentStateQueryResult,
  type Substep4GetCurrentDataQueryResult,
  type Substep4GetAvailableModifiersQueryResult,
  type Substep4GetRecommendedModifiersQueryResult,
  type Substep4ValidateCurrentStateQueryResult,
} from '@api/substep4/aksiApi';

// Локальні імпорти
import {
  workflowInitializationFormSchema,
  workflowNavigationFormSchema,
  workflowCompletionFormSchema,
  type WorkflowInitializationFormData,
  type WorkflowNavigationFormData,
  type WorkflowCompletionFormData,
  type Substep4GetAvailableModifiersParams,
  type Substep4GetRecommendedModifiersParams,
} from './schemas';
import {
  SUBSTEP4_WORKFLOW_STEPS,
  SUBSTEP4_VALIDATION_RULES,
  SUBSTEP4_WORKFLOW_LIMITS,
} from './workflow.constants';
import { useSubstep4WorkflowSelectors } from './workflow.store';

// =================== ТИПИ ===================
export interface UseSubstep4WorkflowReturn {
  // UI стан (з Zustand)
  ui: ReturnType<typeof useSubstep4WorkflowSelectors>;

  // API дані з Orval
  data: {
    currentState: Substep4GetCurrentStateQueryResult | undefined;
    currentData: Substep4GetCurrentDataQueryResult | undefined;
    availableModifiers: Substep4GetAvailableModifiersQueryResult | undefined;
    recommendedModifiers: Substep4GetRecommendedModifiersQueryResult | undefined;
    validation: Substep4ValidateCurrentStateQueryResult | undefined;
  };

  // Стан завантаження
  loading: {
    isInitializing: boolean;
    isCalculatingPrice: boolean;
    isCalculatingBase: boolean;
    isCalculatingFinal: boolean;
    isAddingModifier: boolean;
    isRemovingModifier: boolean;
    isConfirming: boolean;
    isResetting: boolean;
    isLoadingState: boolean;
    isLoadingData: boolean;
    isLoadingModifiers: boolean;
    isValidating: boolean;
    isAnyLoading: boolean;
  };

  // API мутації (прямо з Orval) - спрощена типізація
  mutations: {
    initialize: ReturnType<typeof useSubstep4InitializeSubstep>;
    calculatePrice: ReturnType<typeof useSubstep4CalculatePrice>;
    calculateBase: ReturnType<typeof useSubstep4CalculateBasePrice>;
    calculateFinal: ReturnType<typeof useSubstep4CalculateFinalPrice>;
    addModifier: ReturnType<typeof useSubstep4AddModifier>;
    removeModifier: ReturnType<typeof useSubstep4RemoveModifier>;
    confirm: ReturnType<typeof useSubstep4ConfirmCalculation>;
    reset: ReturnType<typeof useSubstep4ResetCalculation>;
  };

  // Запити (прямо з Orval) - спрощена типізація
  queries: {
    currentState: ReturnType<typeof useSubstep4GetCurrentState>;
    currentData: ReturnType<typeof useSubstep4GetCurrentData>;
    availableModifiers: ReturnType<typeof useSubstep4GetAvailableModifiers>;
    recommendedModifiers: ReturnType<typeof useSubstep4GetRecommendedModifiers>;
    validation: ReturnType<typeof useSubstep4ValidateCurrentState>;
  };

  // Форми React Hook Form
  forms: {
    initialization: UseFormReturn<WorkflowInitializationFormData>;
    navigation: UseFormReturn<WorkflowNavigationFormData>;
    completion: UseFormReturn<WorkflowCompletionFormData>;
  };

  // Константи
  constants: {
    steps: typeof SUBSTEP4_WORKFLOW_STEPS;
    validationRules: typeof SUBSTEP4_VALIDATION_RULES;
    limits: typeof SUBSTEP4_WORKFLOW_LIMITS;
  };
}

// =================== ТОНКА ОБГОРТКА ===================
export const useSubstep4Workflow = (): UseSubstep4WorkflowReturn => {
  // UI стан з Zustand
  const uiSelectors = useSubstep4WorkflowSelectors();

  // Orval API хуки (без додаткової логіки)
  const initializeMutation = useSubstep4InitializeSubstep();
  const calculatePriceMutation = useSubstep4CalculatePrice();
  const calculateBaseMutation = useSubstep4CalculateBasePrice();
  const calculateFinalMutation = useSubstep4CalculateFinalPrice();
  const addModifierMutation = useSubstep4AddModifier();
  const removeModifierMutation = useSubstep4RemoveModifier();
  const confirmMutation = useSubstep4ConfirmCalculation();
  const resetMutation = useSubstep4ResetCalculation();

  // Запити даних (тільки якщо є sessionId)
  const currentStateQuery = useSubstep4GetCurrentState(uiSelectors.sessionId || '', {
    query: { enabled: !!uiSelectors.sessionId },
  });

  const currentDataQuery = useSubstep4GetCurrentData(uiSelectors.sessionId || '', {
    query: { enabled: !!uiSelectors.sessionId },
  });

  const availableModifiersQuery = useSubstep4GetAvailableModifiers(
    {
      categoryCode: 'GENERAL',
    } as Substep4GetAvailableModifiersParams,
    {
      query: { enabled: true },
    }
  );

  const recommendedModifiersQuery = useSubstep4GetRecommendedModifiers(
    {
      categoryCode: 'GENERAL',
      itemName: 'DEFAULT',
    } as Substep4GetRecommendedModifiersParams,
    {
      query: { enabled: true },
    }
  );

  const validationQuery = useSubstep4ValidateCurrentState(uiSelectors.sessionId || '', {
    query: { enabled: !!uiSelectors.sessionId },
  });

  // React Hook Form форми
  const initializationForm = useForm<WorkflowInitializationFormData>({
    resolver: zodResolver(workflowInitializationFormSchema),
    defaultValues: {
      sessionId: uiSelectors.sessionId || '',
      orderId: uiSelectors.orderId || '',
      itemId: uiSelectors.itemId || '',
      startFromStep: undefined,
    },
  });

  const navigationForm = useForm<WorkflowNavigationFormData>({
    resolver: zodResolver(workflowNavigationFormSchema),
    defaultValues: {
      currentStep: uiSelectors.currentStep,
      targetStep: '',
      saveProgress: true,
      skipValidation: false,
    },
  });

  const completionForm = useForm<WorkflowCompletionFormData>({
    resolver: zodResolver(workflowCompletionFormSchema),
    defaultValues: {
      finalPrice: uiSelectors.finalPrice || 0,
      calculationConfirmed: false,
      proceedToNext: false,
      notes: '',
    },
  });

  // Стан завантаження (простий)
  const loading = useMemo(
    () => ({
      isInitializing: initializeMutation.isPending,
      isCalculatingPrice: calculatePriceMutation.isPending,
      isCalculatingBase: calculateBaseMutation.isPending,
      isCalculatingFinal: calculateFinalMutation.isPending,
      isAddingModifier: addModifierMutation.isPending,
      isRemovingModifier: removeModifierMutation.isPending,
      isConfirming: confirmMutation.isPending,
      isResetting: resetMutation.isPending,
      isLoadingState: currentStateQuery.isLoading,
      isLoadingData: currentDataQuery.isLoading,
      isLoadingModifiers: availableModifiersQuery.isLoading,
      isValidating: validationQuery.isLoading,
      isAnyLoading: [
        initializeMutation.isPending,
        calculatePriceMutation.isPending,
        calculateBaseMutation.isPending,
        calculateFinalMutation.isPending,
        addModifierMutation.isPending,
        removeModifierMutation.isPending,
        confirmMutation.isPending,
        resetMutation.isPending,
        currentStateQuery.isLoading,
        currentDataQuery.isLoading,
        availableModifiersQuery.isLoading,
        validationQuery.isLoading,
      ].some(Boolean),
    }),
    [
      initializeMutation.isPending,
      calculatePriceMutation.isPending,
      calculateBaseMutation.isPending,
      calculateFinalMutation.isPending,
      addModifierMutation.isPending,
      removeModifierMutation.isPending,
      confirmMutation.isPending,
      resetMutation.isPending,
      currentStateQuery.isLoading,
      currentDataQuery.isLoading,
      availableModifiersQuery.isLoading,
      validationQuery.isLoading,
    ]
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
      calculateBase: calculateBaseMutation,
      calculateFinal: calculateFinalMutation,
      addModifier: addModifierMutation,
      removeModifier: removeModifierMutation,
      confirm: confirmMutation,
      reset: resetMutation,
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
      initialization: initializationForm,
      navigation: navigationForm,
      completion: completionForm,
    },

    // Константи
    constants: {
      steps: SUBSTEP4_WORKFLOW_STEPS,
      validationRules: SUBSTEP4_VALIDATION_RULES,
      limits: SUBSTEP4_WORKFLOW_LIMITS,
    },
  };
};
