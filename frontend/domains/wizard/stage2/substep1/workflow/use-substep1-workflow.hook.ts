// Substep1 Workflow Hook - тонка обгортка над Orval хуками
// Координація між API та UI станом для substep1

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Orval хуки
import {
  useSubstep1StartSubstep,
  useSubstep1SelectServiceCategory,
  useSubstep1SelectPriceListItem,
  useSubstep1EnterQuantity,
  useSubstep1ValidateAndComplete,
  useSubstep1Reset,
  useSubstep1FinalizeSession,
  useSubstep1GetStatus,
  useSubstep1GetServiceCategories,
  useSubstep1GetItemsForCategory,
} from '@/shared/api/generated/substep1';

// Локальні імпорти
import { useSubstep1WorkflowStore, useSubstep1WorkflowSelectors } from './workflow.store';
import {
  SUBSTEP1_WORKFLOW_STEPS,
  SUBSTEP1_VALIDATION_RULES,
  SUBSTEP1_WORKFLOW_LIMITS,
  type Substep1WorkflowStep,
} from './workflow.constants';
import {
  workflowInitializationFormSchema,
  workflowNavigationFormSchema,
  workflowCompletionFormSchema,
  type WorkflowInitializationFormData,
  type WorkflowNavigationFormData,
  type WorkflowCompletionFormData,
  type ItemBasicInfoResponse,
  type ServiceCategoryResponse,
  type PriceListItemResponse,
  type SubstepResultResponse,
} from './schemas';

// =================== ТИПИ ===================

export interface UseSubstep1WorkflowReturn {
  // UI стан з Zustand
  ui: ReturnType<typeof useSubstep1WorkflowSelectors>;

  // API дані з Orval
  data: {
    status: SubstepResultResponse | undefined;
    serviceCategories: ServiceCategoryResponse[] | undefined;
    itemsForCategory: PriceListItemResponse[] | undefined;
  };

  // Стан завантаження
  loading: {
    isStarting: boolean;
    isSelectingCategory: boolean;
    isSelectingItem: boolean;
    isEnteringQuantity: boolean;
    isValidating: boolean;
    isResetting: boolean;
    isFinalizing: boolean;
    isLoadingStatus: boolean;
    isLoadingCategories: boolean;
    isLoadingItems: boolean;
    isAnyLoading: boolean;
  };

  // Orval мутації
  mutations: {
    startSubstep: ReturnType<typeof useSubstep1StartSubstep>;
    selectCategory: ReturnType<typeof useSubstep1SelectServiceCategory>;
    selectItem: ReturnType<typeof useSubstep1SelectPriceListItem>;
    enterQuantity: ReturnType<typeof useSubstep1EnterQuantity>;
    validateAndComplete: ReturnType<typeof useSubstep1ValidateAndComplete>;
    reset: ReturnType<typeof useSubstep1Reset>;
    finalizeSession: ReturnType<typeof useSubstep1FinalizeSession>;
  };

  // Orval запити
  queries: {
    status: ReturnType<typeof useSubstep1GetStatus>;
    serviceCategories: ReturnType<typeof useSubstep1GetServiceCategories>;
    itemsForCategory: ReturnType<typeof useSubstep1GetItemsForCategory>;
  };

  // Готові форми React Hook Form + Zod
  forms: {
    initialization: ReturnType<typeof useForm<WorkflowInitializationFormData>>;
    navigation: ReturnType<typeof useForm<WorkflowNavigationFormData>>;
    completion: ReturnType<typeof useForm<WorkflowCompletionFormData>>;
  };

  // Константи для UI
  constants: {
    WORKFLOW_STEPS: typeof SUBSTEP1_WORKFLOW_STEPS;
    VALIDATION_RULES: typeof SUBSTEP1_VALIDATION_RULES;
    LIMITS: typeof SUBSTEP1_WORKFLOW_LIMITS;
  };
}

// =================== ГОЛОВНИЙ ХУК ===================

export const useSubstep1Workflow = (): UseSubstep1WorkflowReturn => {
  // UI стан з Zustand
  const uiSelectors = useSubstep1WorkflowSelectors();

  // Orval мутації
  const startSubstepMutation = useSubstep1StartSubstep();
  const selectCategoryMutation = useSubstep1SelectServiceCategory();
  const selectItemMutation = useSubstep1SelectPriceListItem();
  const enterQuantityMutation = useSubstep1EnterQuantity();
  const validateAndCompleteMutation = useSubstep1ValidateAndComplete();
  const resetMutation = useSubstep1Reset();
  const finalizeSessionMutation = useSubstep1FinalizeSession();

  // Orval запити
  const statusQuery = useSubstep1GetStatus(uiSelectors.sessionId || '', {
    query: { enabled: !!uiSelectors.sessionId },
  });

  const serviceCategoriesQuery = useSubstep1GetServiceCategories({
    query: { enabled: uiSelectors.isWorkflowStarted },
  });

  const itemsForCategoryQuery = useSubstep1GetItemsForCategory(
    uiSelectors.selectedCategoryId || '',
    {
      query: { enabled: !!uiSelectors.selectedCategoryId },
    }
  );

  // Готові форми React Hook Form + Zod
  const initializationForm = useForm<WorkflowInitializationFormData>({
    resolver: zodResolver(workflowInitializationFormSchema),
    defaultValues: {
      sessionId: uiSelectors.sessionId || '',
      orderId: uiSelectors.orderId || '',
    },
  });

  const navigationForm = useForm<WorkflowNavigationFormData>({
    resolver: zodResolver(workflowNavigationFormSchema),
    defaultValues: {
      targetStep: uiSelectors.currentStep,
      skipValidation: false,
    },
  });

  const completionForm = useForm<WorkflowCompletionFormData>({
    resolver: zodResolver(workflowCompletionFormSchema),
    defaultValues: {
      sessionId: uiSelectors.sessionId || '',
      confirmCompletion: false,
    },
  });

  // Групування API даних
  const data = useMemo(
    () => ({
      status: statusQuery.data,
      serviceCategories: serviceCategoriesQuery.data,
      itemsForCategory: itemsForCategoryQuery.data,
    }),
    [statusQuery.data, serviceCategoriesQuery.data, itemsForCategoryQuery.data]
  );

  // Стан завантаження
  const loading = useMemo(() => {
    const isAnyMutationLoading =
      startSubstepMutation.isPending ||
      selectCategoryMutation.isPending ||
      selectItemMutation.isPending ||
      enterQuantityMutation.isPending ||
      validateAndCompleteMutation.isPending ||
      resetMutation.isPending ||
      finalizeSessionMutation.isPending;

    const isAnyQueryLoading =
      statusQuery.isLoading || serviceCategoriesQuery.isLoading || itemsForCategoryQuery.isLoading;

    return {
      isStarting: startSubstepMutation.isPending,
      isSelectingCategory: selectCategoryMutation.isPending,
      isSelectingItem: selectItemMutation.isPending,
      isEnteringQuantity: enterQuantityMutation.isPending,
      isValidating: validateAndCompleteMutation.isPending,
      isResetting: resetMutation.isPending,
      isFinalizing: finalizeSessionMutation.isPending,
      isLoadingStatus: statusQuery.isLoading,
      isLoadingCategories: serviceCategoriesQuery.isLoading,
      isLoadingItems: itemsForCategoryQuery.isLoading,
      isAnyLoading: isAnyMutationLoading || isAnyQueryLoading,
    };
  }, [
    startSubstepMutation.isPending,
    selectCategoryMutation.isPending,
    selectItemMutation.isPending,
    enterQuantityMutation.isPending,
    validateAndCompleteMutation.isPending,
    resetMutation.isPending,
    finalizeSessionMutation.isPending,
    statusQuery.isLoading,
    serviceCategoriesQuery.isLoading,
    itemsForCategoryQuery.isLoading,
  ]);

  // Групування мутацій
  const mutations = useMemo(
    () => ({
      startSubstep: startSubstepMutation,
      selectCategory: selectCategoryMutation,
      selectItem: selectItemMutation,
      enterQuantity: enterQuantityMutation,
      validateAndComplete: validateAndCompleteMutation,
      reset: resetMutation,
      finalizeSession: finalizeSessionMutation,
    }),
    [
      startSubstepMutation,
      selectCategoryMutation,
      selectItemMutation,
      enterQuantityMutation,
      validateAndCompleteMutation,
      resetMutation,
      finalizeSessionMutation,
    ]
  );

  // Групування запитів
  const queries = useMemo(
    () => ({
      status: statusQuery,
      serviceCategories: serviceCategoriesQuery,
      itemsForCategory: itemsForCategoryQuery,
    }),
    [statusQuery, serviceCategoriesQuery, itemsForCategoryQuery]
  );

  // Групування форм
  const forms = useMemo(
    () => ({
      initialization: initializationForm,
      navigation: navigationForm,
      completion: completionForm,
    }),
    [initializationForm, navigationForm, completionForm]
  );

  // Константи для UI
  const constants = useMemo(
    () => ({
      WORKFLOW_STEPS: SUBSTEP1_WORKFLOW_STEPS,
      VALIDATION_RULES: SUBSTEP1_VALIDATION_RULES,
      LIMITS: SUBSTEP1_WORKFLOW_LIMITS,
    }),
    []
  );

  return {
    ui: uiSelectors,
    data,
    loading,
    mutations,
    queries,
    forms,
    constants,
  };
};
