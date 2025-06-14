// Substep3 Workflow Hook - тонка обгортка над Orval хуками
// Координація між API та UI станом для substep3 (забруднення та дефекти)

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

// Orval хуки
import {
  useSubstep3InitializeSubstep,
  useSubstep3ProcessStainSelection,
  useSubstep3ProcessDefectSelection,
  useSubstep3ProcessDefectNotes,
  useSubstep3CompleteSubstep,
  useSubstep3GoBack,
  useSubstep3GetAvailableStainTypes,
  useSubstep3GetAvailableDefectTypes,
  useSubstep3GetContext,
} from '@api/substep3';

// Локальні імпорти
import type { StainsDefectsContext, StainTypeDTO, DefectTypeDTO } from '@api/substep3';

import {
  workflowInitializationFormSchema,
  workflowNavigationFormSchema,
  workflowCompletionFormSchema,
  type WorkflowInitializationFormData,
  type WorkflowNavigationFormData,
  type WorkflowCompletionFormData,
} from './schemas';
import {
  SUBSTEP3_WORKFLOW_STEPS,
  SUBSTEP3_VALIDATION_RULES,
  SUBSTEP3_WORKFLOW_LIMITS,
} from './workflow.constants';
import { useSubstep3WorkflowSelectors } from './workflow.store';

// Імпорт типів з Orval

// =================== ТИПИ ===================

export interface UseSubstep3WorkflowReturn {
  // UI стан з Zustand
  ui: ReturnType<typeof useSubstep3WorkflowSelectors>;

  // API дані з Orval
  data: {
    context: StainsDefectsContext | undefined;
    availableStainTypes: string[] | undefined;
    availableDefectTypes: string[] | undefined;
  };

  // Стан завантаження
  loading: {
    isInitializing: boolean;
    isProcessingStains: boolean;
    isProcessingDefects: boolean;
    isProcessingNotes: boolean;
    isCompleting: boolean;
    isGoingBack: boolean;
    isLoadingContext: boolean;
    isLoadingStainTypes: boolean;
    isLoadingDefectTypes: boolean;
    isAnyLoading: boolean;
  };

  // Orval мутації
  mutations: {
    initialize: ReturnType<typeof useSubstep3InitializeSubstep>;
    processStainSelection: ReturnType<typeof useSubstep3ProcessStainSelection>;
    processDefectSelection: ReturnType<typeof useSubstep3ProcessDefectSelection>;
    processDefectNotes: ReturnType<typeof useSubstep3ProcessDefectNotes>;
    complete: ReturnType<typeof useSubstep3CompleteSubstep>;
    goBack: ReturnType<typeof useSubstep3GoBack>;
  };

  // Orval запити
  queries: {
    context: ReturnType<typeof useSubstep3GetContext>;
    availableStainTypes: ReturnType<typeof useSubstep3GetAvailableStainTypes>;
    availableDefectTypes: ReturnType<typeof useSubstep3GetAvailableDefectTypes>;
  };

  // Готові форми React Hook Form + Zod
  forms: {
    initialization: ReturnType<typeof useForm<WorkflowInitializationFormData>>;
    navigation: ReturnType<typeof useForm<WorkflowNavigationFormData>>;
    completion: ReturnType<typeof useForm<WorkflowCompletionFormData>>;
  };

  // Константи для UI
  constants: {
    WORKFLOW_STEPS: typeof SUBSTEP3_WORKFLOW_STEPS;
    VALIDATION_RULES: typeof SUBSTEP3_VALIDATION_RULES;
    LIMITS: typeof SUBSTEP3_WORKFLOW_LIMITS;
  };
}

// =================== ГОЛОВНИЙ ХУК ===================

export const useSubstep3Workflow = (): UseSubstep3WorkflowReturn => {
  // UI стан з Zustand
  const uiSelectors = useSubstep3WorkflowSelectors();

  // Orval мутації
  const initializeMutation = useSubstep3InitializeSubstep();
  const processStainSelectionMutation = useSubstep3ProcessStainSelection();
  const processDefectSelectionMutation = useSubstep3ProcessDefectSelection();
  const processDefectNotesMutation = useSubstep3ProcessDefectNotes();
  const completeMutation = useSubstep3CompleteSubstep();
  const goBackMutation = useSubstep3GoBack();

  // Orval запити
  const contextQuery = useSubstep3GetContext(uiSelectors.sessionId || '', {
    query: { enabled: !!uiSelectors.sessionId },
  });

  const availableStainTypesQuery = useSubstep3GetAvailableStainTypes({
    query: { enabled: uiSelectors.isWorkflowStarted },
  });

  const availableDefectTypesQuery = useSubstep3GetAvailableDefectTypes({
    query: { enabled: uiSelectors.isWorkflowStarted },
  });

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
      context: contextQuery.data,
      availableStainTypes: availableStainTypesQuery.data,
      availableDefectTypes: availableDefectTypesQuery.data,
    }),
    [contextQuery.data, availableStainTypesQuery.data, availableDefectTypesQuery.data]
  );

  // Стан завантаження
  const loading = useMemo(() => {
    const isAnyMutationLoading =
      initializeMutation.isPending ||
      processStainSelectionMutation.isPending ||
      processDefectSelectionMutation.isPending ||
      processDefectNotesMutation.isPending ||
      completeMutation.isPending ||
      goBackMutation.isPending;

    const isAnyQueryLoading =
      contextQuery.isLoading ||
      availableStainTypesQuery.isLoading ||
      availableDefectTypesQuery.isLoading;

    return {
      isInitializing: initializeMutation.isPending,
      isProcessingStains: processStainSelectionMutation.isPending,
      isProcessingDefects: processDefectSelectionMutation.isPending,
      isProcessingNotes: processDefectNotesMutation.isPending,
      isCompleting: completeMutation.isPending,
      isGoingBack: goBackMutation.isPending,
      isLoadingContext: contextQuery.isLoading,
      isLoadingStainTypes: availableStainTypesQuery.isLoading,
      isLoadingDefectTypes: availableDefectTypesQuery.isLoading,
      isAnyLoading: isAnyMutationLoading || isAnyQueryLoading,
    };
  }, [
    initializeMutation.isPending,
    processStainSelectionMutation.isPending,
    processDefectSelectionMutation.isPending,
    processDefectNotesMutation.isPending,
    completeMutation.isPending,
    goBackMutation.isPending,
    contextQuery.isLoading,
    availableStainTypesQuery.isLoading,
    availableDefectTypesQuery.isLoading,
  ]);

  // Групування мутацій
  const mutations = useMemo(
    () => ({
      initialize: initializeMutation,
      processStainSelection: processStainSelectionMutation,
      processDefectSelection: processDefectSelectionMutation,
      processDefectNotes: processDefectNotesMutation,
      complete: completeMutation,
      goBack: goBackMutation,
    }),
    [
      initializeMutation,
      processStainSelectionMutation,
      processDefectSelectionMutation,
      processDefectNotesMutation,
      completeMutation,
      goBackMutation,
    ]
  );

  // Групування запитів
  const queries = useMemo(
    () => ({
      context: contextQuery,
      availableStainTypes: availableStainTypesQuery,
      availableDefectTypes: availableDefectTypesQuery,
    }),
    [contextQuery, availableStainTypesQuery, availableDefectTypesQuery]
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

  // Константи
  const constants = useMemo(
    () => ({
      WORKFLOW_STEPS: SUBSTEP3_WORKFLOW_STEPS,
      VALIDATION_RULES: SUBSTEP3_VALIDATION_RULES,
      LIMITS: SUBSTEP3_WORKFLOW_LIMITS,
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
