// 📋 STAGE2 WORKFLOW: Тонка обгортка над Orval хуками для координації підетапів
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

// Orval хуки для Stage2 Workflow
import {
  useStage2InitializeItemManager,
  useStage2GetCurrentManager,
  useStage2StartNewItemWizard,
  useStage2StartEditItemWizard,
  useStage2CloseWizard,
  useStage2CompleteStage,
  useStage2SynchronizeManager,
  useStage2GetCurrentState,
  useStage2ValidateCurrentState,
  useStage2CheckReadinessToProceed,
} from '@api/stage2';

// Локальні імпорти
import {
  STAGE2_WORKFLOW_UI_STATES,
  STAGE2_WORKFLOW_OPERATIONS,
  STAGE2_SUBSTEPS,
  STAGE2_SUBSTEP_ORDER,
  STAGE2_WORKFLOW_VALIDATION_RULES,
  STAGE2_WORKFLOW_LIMITS,
} from './constants';
import {
  substepNavigationFormSchema,
  completeStageFormSchema,
  closeWizardFormSchema,
  type SubstepNavigationFormData,
  type CompleteStageFormData,
  type CloseWizardFormData,
} from './schemas';
import { useStage2WorkflowStore, useStage2WorkflowSelectors } from './store';

// =================== ТОНКА ОБГОРТКА ===================
export const useStage2Workflow = () => {
  // UI стан з Zustand
  const uiState = useStage2WorkflowStore();
  const selectors = useStage2WorkflowSelectors();

  // Orval API хуки (без додаткової логіки)
  const initializeManagerMutation = useStage2InitializeItemManager();
  const startNewWizardMutation = useStage2StartNewItemWizard();
  const startEditWizardMutation = useStage2StartEditItemWizard();
  const closeWizardMutation = useStage2CloseWizard();
  const completeStageMutation = useStage2CompleteStage();
  const synchronizeManagerMutation = useStage2SynchronizeManager();

  // Запити даних
  const currentManagerQuery = useStage2GetCurrentManager(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const currentStateQuery = useStage2GetCurrentState(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const validateStateQuery = useStage2ValidateCurrentState(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const readinessQuery = useStage2CheckReadinessToProceed(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  // =================== ФОРМИ З ZOD ВАЛІДАЦІЄЮ ===================
  // Форма навігації між підетапами
  const substepNavigationForm = useForm<SubstepNavigationFormData>({
    resolver: zodResolver(substepNavigationFormSchema),
    defaultValues: {
      targetSubstep: uiState.currentSubstep,
      confirmed: false,
    },
  });

  // Форма завершення етапу
  const completeStageForm = useForm<CompleteStageFormData>({
    resolver: zodResolver(completeStageFormSchema),
    defaultValues: {
      confirmed: false,
      itemsCount: uiState.totalItemsCount,
    },
  });

  // Форма закриття візарда
  const closeWizardForm = useForm<CloseWizardFormData>({
    resolver: zodResolver(closeWizardFormSchema),
    defaultValues: {
      saveChanges: false,
      confirmed: false,
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
      isSynchronizing: synchronizeManagerMutation.isPending,
      isLoadingManager: currentManagerQuery.isLoading,
      isLoadingState: currentStateQuery.isLoading,
      isValidating: validateStateQuery.isLoading,
      isCheckingReadiness: readinessQuery.isLoading,
      isAnyLoading:
        initializeManagerMutation.isPending ||
        startNewWizardMutation.isPending ||
        startEditWizardMutation.isPending ||
        closeWizardMutation.isPending ||
        completeStageMutation.isPending ||
        synchronizeManagerMutation.isPending ||
        currentManagerQuery.isLoading ||
        currentStateQuery.isLoading ||
        validateStateQuery.isLoading ||
        readinessQuery.isLoading,
    }),
    [
      initializeManagerMutation.isPending,
      startNewWizardMutation.isPending,
      startEditWizardMutation.isPending,
      closeWizardMutation.isPending,
      completeStageMutation.isPending,
      synchronizeManagerMutation.isPending,
      currentManagerQuery.isLoading,
      currentStateQuery.isLoading,
      validateStateQuery.isLoading,
      readinessQuery.isLoading,
    ]
  );

  // =================== ОБЧИСЛЕНІ ЗНАЧЕННЯ ===================
  const computed = useMemo(
    () => ({
      // Прогрес з константами
      substepProgressPercentage: Math.round(
        ((STAGE2_SUBSTEP_ORDER.indexOf(uiState.currentSubstep) + 1) / STAGE2_SUBSTEP_ORDER.length) *
          100
      ),
      operationProgressPercentage: Math.round(
        ((Object.values(STAGE2_WORKFLOW_OPERATIONS).indexOf(uiState.currentOperation) + 1) /
          Object.values(STAGE2_WORKFLOW_OPERATIONS).length) *
          100
      ),

      // Навігація з константами
      nextSubstep: (() => {
        const currentIndex = STAGE2_SUBSTEP_ORDER.indexOf(uiState.currentSubstep);
        return STAGE2_SUBSTEP_ORDER[currentIndex + 1] || null;
      })(),
      previousSubstep: (() => {
        const currentIndex = STAGE2_SUBSTEP_ORDER.indexOf(uiState.currentSubstep);
        return STAGE2_SUBSTEP_ORDER[currentIndex - 1] || null;
      })(),

      // Валідація з константами
      canNavigateToNext: (() => {
        const currentIndex = STAGE2_SUBSTEP_ORDER.indexOf(uiState.currentSubstep);
        return currentIndex < STAGE2_SUBSTEP_ORDER.length - 1;
      })(),
      canNavigateToPrevious: (() => {
        const currentIndex = STAGE2_SUBSTEP_ORDER.indexOf(uiState.currentSubstep);
        return currentIndex > 0;
      })(),

      // Стан підетапів
      isFirstSubstep: uiState.currentSubstep === STAGE2_SUBSTEPS.SUBSTEP1,
      isLastSubstep: uiState.currentSubstep === STAGE2_SUBSTEPS.SUBSTEP5,

      // Workflow стан
      isWorkflowReady: uiState.currentUIState === STAGE2_WORKFLOW_UI_STATES.READY,
      isWorkflowBusy:
        uiState.currentUIState === STAGE2_WORKFLOW_UI_STATES.LOADING ||
        uiState.currentUIState === STAGE2_WORKFLOW_UI_STATES.SAVING,

      // Готовність до завершення
      isReadyToComplete: STAGE2_WORKFLOW_VALIDATION_RULES.canCompleteStage(
        uiState.sessionId,
        uiState.totalItemsCount
      ),
      hasMinimumItems: uiState.totalItemsCount >= STAGE2_WORKFLOW_LIMITS.MIN_ITEMS_COUNT,
      canAddMoreItems: uiState.totalItemsCount < STAGE2_WORKFLOW_LIMITS.MAX_ITEMS_COUNT,
    }),
    [
      uiState.currentSubstep,
      uiState.currentOperation,
      uiState.currentUIState,
      uiState.sessionId,
      uiState.totalItemsCount,
    ]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand + селектори)
    ui: {
      ...uiState,
      ...selectors,
    },

    // API дані (прямо з Orval)
    data: {
      currentManager: currentManagerQuery.data,
      currentState: currentStateQuery.data,
      validationResult: validateStateQuery.data,
      readinessCheck: readinessQuery.data,
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
      synchronizeManager: synchronizeManagerMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      currentManager: currentManagerQuery,
      currentState: currentStateQuery,
      validateState: validateStateQuery,
      readiness: readinessQuery,
    },

    // Форми з Zod валідацією
    forms: {
      substepNavigation: substepNavigationForm,
      completeStage: completeStageForm,
      closeWizard: closeWizardForm,
    },

    // Обчислені значення з константами
    computed,
  };
};

// =================== ТИПИ ===================
export type UseStage2WorkflowReturn = ReturnType<typeof useStage2Workflow>;
