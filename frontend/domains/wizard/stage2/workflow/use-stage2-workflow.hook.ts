// Тонка обгортка над Orval хуками для Stage2 Workflow - Координація підетапів
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Orval хуки для Stage2 Workflow
import {
  useStage2InitializeItemManager,
  useStage2GetCurrentManager,
  useStage2StartNewItemWizard,
  useStage2StartEditItemWizard,
  useStage2CloseWizard,
  useStage2CompleteStage,
  useStage2GetCurrentState,
  useStage2ValidateCurrentState,
} from '@/shared/api/generated/stage2';

// Локальні імпорти
import { useStage2WorkflowStore } from '../store/workflow.store';
import {
  workflowInitializationFormSchema,
  workflowNavigationFormSchema,
  workflowValidationFormSchema,
  type WorkflowInitializationFormData,
  type WorkflowNavigationFormData,
  type WorkflowValidationFormData,
} from './schemas';

// =================== ТОНКА ОБГОРТКА ===================
export const useStage2Workflow = () => {
  // UI стан з Zustand
  const uiState = useStage2WorkflowStore((state) => state);

  // Orval API хуки (без додаткової логіки)
  const initializeManagerMutation = useStage2InitializeItemManager();
  const startNewWizardMutation = useStage2StartNewItemWizard();
  const startEditWizardMutation = useStage2StartEditItemWizard();
  const closeWizardMutation = useStage2CloseWizard();
  const completeStageMutation = useStage2CompleteStage();
  const validateStateQuery = useStage2ValidateCurrentState(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  // Запити даних
  const currentManagerQuery = useStage2GetCurrentManager(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const currentStateQuery = useStage2GetCurrentState(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  // Форми (мінімальні)
  const initializationForm = useForm<WorkflowInitializationFormData>({
    resolver: zodResolver(workflowInitializationFormSchema),
    defaultValues: {
      orderId: uiState.orderId || '',
      sessionId: uiState.sessionId || '',
    },
  });

  const navigationForm = useForm<WorkflowNavigationFormData>({
    resolver: zodResolver(workflowNavigationFormSchema),
    defaultValues: {
      currentState: uiState.currentState,
      targetState: uiState.currentState,
    },
  });

  const validationForm = useForm<WorkflowValidationFormData>({
    resolver: zodResolver(workflowValidationFormSchema),
    defaultValues: {
      isValid: true,
      notes: '',
    },
  });

  // Стан завантаження (простий)
  const loading = useMemo(
    () => ({
      isInitializing: initializeManagerMutation.isPending,
      isStartingNewWizard: startNewWizardMutation.isPending,
      isStartingEditWizard: startEditWizardMutation.isPending,
      isClosingWizard: closeWizardMutation.isPending,
      isCompletingStage: completeStageMutation.isPending,
      isValidating: validateStateQuery.isLoading,
      isLoadingManager: currentManagerQuery.isLoading,
      isLoadingState: currentStateQuery.isLoading,
      isTransitioning: uiState.isTransitioning,
    }),
    [
      initializeManagerMutation.isPending,
      startNewWizardMutation.isPending,
      startEditWizardMutation.isPending,
      closeWizardMutation.isPending,
      completeStageMutation.isPending,
      validateStateQuery.isLoading,
      currentManagerQuery.isLoading,
      currentStateQuery.isLoading,
      uiState.isTransitioning,
    ]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand)
    ui: uiState,

    // API дані (прямо з Orval)
    data: {
      currentManager: currentManagerQuery.data,
      currentState: currentStateQuery.data,
      validationResult: validateStateQuery.data,
    },

    // Стан завантаження
    loading,

    // API мутації (прямо з Orval)
    mutations: {
      initializeManager: initializeManagerMutation,
      startNewWizard: startNewWizardMutation,
      startEditWizard: startEditWizardMutation,
      closeWizard: closeWizardMutation,
      completeStage: completeStageMutation,
      validateState: validateStateQuery,
    },

    // Запити (прямо з Orval)
    queries: {
      currentManager: currentManagerQuery,
      currentState: currentStateQuery,
    },

    // Форми
    forms: {
      initialization: initializationForm,
      navigation: navigationForm,
      validation: validationForm,
    },
  };
};

// =================== ТИПИ ===================
export type UseStage2WorkflowReturn = ReturnType<typeof useStage2Workflow>;
