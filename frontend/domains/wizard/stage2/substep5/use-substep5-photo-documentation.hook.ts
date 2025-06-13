// Тонка обгортка над Orval хуками для substep5 - Фотодокументація
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { useMemo } from 'react';

// Orval хуки (готові з бекенду)
import {
  useSubstep5InitializePhotoDocumentation,
  useSubstep5AddPhoto,
  useSubstep5RemovePhoto,
  useSubstep5GetDocumentationStatus,
  useSubstep5GetDocumentationData,
  useSubstep5CompletePhotoDocumentation,
  useSubstep5CloseSession,
} from '@/shared/api/generated/substep5';

// Локальні імпорти
import { usePhotoDocumentationStore } from './photo-documentation.store';

// =================== ТОНКА ОБГОРТКА ===================
export const useSubstep5PhotoDocumentation = () => {
  // UI стан з Zustand
  const uiState = usePhotoDocumentationStore();

  // Orval API хуки (без додаткової логіки)
  const initializeMutation = useSubstep5InitializePhotoDocumentation();
  const addPhotoMutation = useSubstep5AddPhoto();
  const removePhotoMutation = useSubstep5RemovePhoto();
  const completeDocumentationMutation = useSubstep5CompletePhotoDocumentation();
  const closeSessionMutation = useSubstep5CloseSession();

  // Запити даних (тільки якщо є sessionId)
  const statusQuery = useSubstep5GetDocumentationStatus(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const dataQuery = useSubstep5GetDocumentationData(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  // Стан завантаження (простий)
  const loading = useMemo(
    () => ({
      isInitializing: initializeMutation.isPending,
      isAddingPhoto: addPhotoMutation.isPending,
      isRemovingPhoto: removePhotoMutation.isPending,
      isCompleting: completeDocumentationMutation.isPending,
      isClosing: closeSessionMutation.isPending,
      isLoadingStatus: statusQuery.isLoading,
      isLoadingData: dataQuery.isLoading,
    }),
    [
      initializeMutation.isPending,
      addPhotoMutation.isPending,
      removePhotoMutation.isPending,
      completeDocumentationMutation.isPending,
      closeSessionMutation.isPending,
      statusQuery.isLoading,
      dataQuery.isLoading,
    ]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand)
    ui: uiState,

    // API дані (прямо з Orval)
    data: {
      status: statusQuery.data,
      documentation: dataQuery.data,
    },

    // Стан завантаження
    loading,

    // API мутації (прямо з Orval)
    mutations: {
      initialize: initializeMutation,
      addPhoto: addPhotoMutation,
      removePhoto: removePhotoMutation,
      complete: completeDocumentationMutation,
      close: closeSessionMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      status: statusQuery,
      data: dataQuery,
    },
  };
};

// =================== ТИПИ ===================
export type UseSubstep5PhotoDocumentationReturn = ReturnType<typeof useSubstep5PhotoDocumentation>;
