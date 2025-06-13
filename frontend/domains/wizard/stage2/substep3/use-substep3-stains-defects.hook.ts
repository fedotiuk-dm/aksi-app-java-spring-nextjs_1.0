// Тонка обгортка над Orval хуками для substep3 - Забруднення та дефекти
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { useMemo } from 'react';

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
import { useStainsDefectsStore } from './store';

// =================== ТОНКА ОБГОРТКА ===================
export const useSubstep3StainsDefects = () => {
  // UI стан з Zustand
  const uiState = useStainsDefectsStore();

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

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand)
    ui: uiState,

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
  };
};

// =================== ТИПИ ===================
export type UseSubstep3StainsDefectsReturn = ReturnType<typeof useSubstep3StainsDefects>;
