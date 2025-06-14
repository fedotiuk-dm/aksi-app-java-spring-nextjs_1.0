// Тонка обгортка над Orval хуками для substep3 - Забруднення та дефекти
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Orval хуки (готові з бекенду)
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
} from '@/shared/api/generated/substep3';

// Локальні імпорти
import { useStainsDefectsStore, useStainsDefectsSelectors } from './store';
import {
  SUBSTEP3_UI_STEPS,
  SUBSTEP3_VALIDATION_RULES,
  SUBSTEP3_LIMITS,
  SUBSTEP3_STEP_LABELS,
  SUBSTEP3_API_STATE_LABELS,
  calculateSubstep3Progress,
  getNextSubstep3Step,
  getPreviousSubstep3Step,
} from './constants';
import {
  stainSelectionFormSchema,
  defectSelectionFormSchema,
  defectNotesFormSchema,
  displaySettingsFormSchema,
  type StainSelectionFormData,
  type DefectSelectionFormData,
  type DefectNotesFormData,
  type DisplaySettingsFormData,
} from './schemas';

// =================== ТОНКА ОБГОРТКА ===================
export const useSubstep3StainsDefects = () => {
  // UI стан з Zustand
  const uiState = useStainsDefectsStore();
  const selectors = useStainsDefectsSelectors();

  // Orval API хуки (без додаткової логіки)
  const initializeMutation = useSubstep3InitializeSubstep();
  const processStainSelectionMutation = useSubstep3ProcessStainSelection();
  const processDefectSelectionMutation = useSubstep3ProcessDefectSelection();
  const processDefectNotesMutation = useSubstep3ProcessDefectNotes();
  const completeSubstepMutation = useSubstep3CompleteSubstep();
  const goBackMutation = useSubstep3GoBack();

  // Запити даних
  const availableStainTypesQuery = useSubstep3GetAvailableStainTypes({
    query: { enabled: true },
  });

  const availableDefectTypesQuery = useSubstep3GetAvailableDefectTypes({
    query: { enabled: true },
  });

  const contextQuery = useSubstep3GetContext(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  // React Hook Form інтеграція
  const stainSelectionForm = useForm<StainSelectionFormData>({
    resolver: zodResolver(stainSelectionFormSchema),
    defaultValues: {
      selectedStains: uiState.selectedStains,
      otherStains: uiState.otherStains,
    },
  });

  const defectSelectionForm = useForm<DefectSelectionFormData>({
    resolver: zodResolver(defectSelectionFormSchema),
    defaultValues: {
      selectedDefects: uiState.selectedDefects,
      noGuaranteeReason: uiState.noGuaranteeReason,
    },
  });

  const defectNotesForm = useForm<DefectNotesFormData>({
    resolver: zodResolver(defectNotesFormSchema),
    defaultValues: {
      defectNotes: uiState.defectNotes,
    },
  });

  const displaySettingsForm = useForm<DisplaySettingsFormData>({
    defaultValues: {
      showRiskLevels: true,
      groupByCategory: false,
      showDescriptions: true,
    },
  });

  // Стан завантаження (простий)
  const loading = useMemo(
    () => ({
      isInitializing: initializeMutation.isPending,
      isProcessingStains: processStainSelectionMutation.isPending,
      isProcessingDefects: processDefectSelectionMutation.isPending,
      isProcessingNotes: processDefectNotesMutation.isPending,
      isCompleting: completeSubstepMutation.isPending,
      isGoingBack: goBackMutation.isPending,
      isLoadingStainTypes: availableStainTypesQuery.isLoading,
      isLoadingDefectTypes: availableDefectTypesQuery.isLoading,
      isLoadingContext: contextQuery.isLoading,
      isAnyLoading:
        initializeMutation.isPending ||
        processStainSelectionMutation.isPending ||
        processDefectSelectionMutation.isPending ||
        processDefectNotesMutation.isPending ||
        completeSubstepMutation.isPending ||
        goBackMutation.isPending ||
        availableStainTypesQuery.isLoading ||
        availableDefectTypesQuery.isLoading ||
        contextQuery.isLoading,
    }),
    [
      initializeMutation.isPending,
      processStainSelectionMutation.isPending,
      processDefectSelectionMutation.isPending,
      processDefectNotesMutation.isPending,
      completeSubstepMutation.isPending,
      goBackMutation.isPending,
      availableStainTypesQuery.isLoading,
      availableDefectTypesQuery.isLoading,
      contextQuery.isLoading,
    ]
  );

  // Обчислені значення з константами
  const computed = useMemo(
    () => ({
      progressPercentage: selectors.progressPercentage,
      nextStep: selectors.nextStep,
      previousStep: selectors.previousStep,
      canProceedFromStainSelection: selectors.canProceedFromStainSelection,
      canProceedFromDefectSelection: selectors.canProceedFromDefectSelection,
      canProceedFromDefectNotes: selectors.canProceedFromDefectNotes,
      canCompleteSubstep: selectors.canCompleteSubstep,
      isStainSelectionAtLimit: selectors.isStainSelectionAtLimit,
      isDefectSelectionAtLimit: selectors.isDefectSelectionAtLimit,
      defectNotesCharacterCount: selectors.defectNotesCharacterCount,
      defectNotesCharacterLimit: selectors.defectNotesCharacterLimit,
      currentStepLabel: SUBSTEP3_STEP_LABELS[uiState.currentStep],
    }),
    [selectors, uiState.currentStep]
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
      availableStainTypes: availableStainTypesQuery.data,
      availableDefectTypes: availableDefectTypesQuery.data,
      context: contextQuery.data,
    },

    // Стан завантаження
    loading,

    // API мутації (прямо з Orval)
    mutations: {
      initialize: initializeMutation,
      processStainSelection: processStainSelectionMutation,
      processDefectSelection: processDefectSelectionMutation,
      processDefectNotes: processDefectNotesMutation,
      complete: completeSubstepMutation,
      goBack: goBackMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      availableStainTypes: availableStainTypesQuery,
      availableDefectTypes: availableDefectTypesQuery,
      context: contextQuery,
    },

    // Форми React Hook Form + Zod
    forms: {
      stainSelection: stainSelectionForm,
      defectSelection: defectSelectionForm,
      defectNotes: defectNotesForm,
      displaySettings: displaySettingsForm,
    },

    // Обчислені значення з константами
    computed,

    // Константи для UI
    constants: {
      UI_STEPS: SUBSTEP3_UI_STEPS,
      VALIDATION_RULES: SUBSTEP3_VALIDATION_RULES,
      LIMITS: SUBSTEP3_LIMITS,
      STEP_LABELS: SUBSTEP3_STEP_LABELS,
      API_STATE_LABELS: SUBSTEP3_API_STATE_LABELS,
      calculateProgress: calculateSubstep3Progress,
      getNextStep: getNextSubstep3Step,
      getPreviousStep: getPreviousSubstep3Step,
    },
  };
};

// =================== ТИПИ ===================
export type UseSubstep3StainsDefectsReturn = ReturnType<typeof useSubstep3StainsDefects>;
