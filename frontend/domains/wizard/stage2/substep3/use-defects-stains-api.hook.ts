/**
 * @fileoverview API хук для домену "Дефекти та плями (Substep3)"
 *
 * Відповідальність: тільки Orval операції, НЕ UI стан
 * Принцип: Single Responsibility Principle
 */

import { useMemo } from 'react';

import {
  useSubstep3InitializeSubstep,
  useSubstep3ProcessStainSelection,
  useSubstep3ProcessDefectSelection,
  useSubstep3ProcessDefectNotes,
  useSubstep3CompleteSubstep,
  useSubstep3GoBack,
  useSubstep3GetContext,
  useSubstep3GetAvailableStainTypes,
  useSubstep3GetAvailableDefectTypes,
} from '@/shared/api/generated/wizard/aksiApi';

/**
 * Хук для API операцій дефектів та плям
 * Інкапсулює всі Orval операції без UI логіки
 */
export const useDefectsStainsAPI = (sessionId: string | null) => {
  // Мутації (POST/PUT/DELETE операції)
  const initializeSubstepMutation = useSubstep3InitializeSubstep({
    mutation: {
      onSuccess: () => {
        // Успішна ініціалізація - логіка в business хуку
      },
      onError: () => {
        // Помилка ініціалізації - логіка в business хуку
      },
    },
  });

  const processStainSelectionMutation = useSubstep3ProcessStainSelection({
    mutation: {
      onSuccess: () => {
        // Успішний вибір плям - логіка в business хуку
      },
      onError: () => {
        // Помилка вибору плям - логіка в business хуку
      },
    },
  });

  const processDefectSelectionMutation = useSubstep3ProcessDefectSelection({
    mutation: {
      onSuccess: () => {
        // Успішний вибір дефектів - логіка в business хуку
      },
      onError: () => {
        // Помилка вибору дефектів - логіка в business хуку
      },
    },
  });

  const processDefectNotesMutation = useSubstep3ProcessDefectNotes({
    mutation: {
      onSuccess: () => {
        // Успішне збереження приміток - логіка в business хуку
      },
      onError: () => {
        // Помилка збереження приміток - логіка в business хуку
      },
    },
  });

  const completeSubstepMutation = useSubstep3CompleteSubstep({
    mutation: {
      onSuccess: () => {
        // Успішне завершення підетапу - логіка в business хуку
      },
      onError: () => {
        // Помилка завершення підетапу - логіка в business хуку
      },
    },
  });

  const goBackMutation = useSubstep3GoBack({
    mutation: {
      onSuccess: () => {
        // Успішне повернення назад - логіка в business хуку
      },
      onError: () => {
        // Помилка повернення назад - логіка в business хуку
      },
    },
  });

  // Запити (GET операції)
  const contextQuery = useSubstep3GetContext(sessionId || '', {
    query: {
      enabled: !!sessionId,
      staleTime: 30000, // 30 секунд
      refetchInterval: 60000, // 1 хвилина
    },
  });

  const availableStainTypesQuery = useSubstep3GetAvailableStainTypes({
    query: {
      staleTime: 300000, // 5 хвилин
      cacheTime: 600000, // 10 хвилин
    },
  });

  const availableDefectTypesQuery = useSubstep3GetAvailableDefectTypes({
    query: {
      staleTime: 300000, // 5 хвилин
      cacheTime: 600000, // 10 хвилин
    },
  });

  // Мемоізовані операції для business хука
  const operations = useMemo(
    () => ({
      // Ініціалізація підетапу
      initializeSubstep: async () => {
        if (!sessionId) {
          throw new Error('Session ID is required');
        }
        return initializeSubstepMutation.mutateAsync({ sessionId });
      },

      // Обробка вибору плям
      processStainSelection: async (stains: string[], customStain?: string) => {
        if (!sessionId) {
          throw new Error('Session ID is required');
        }
        return processStainSelectionMutation.mutateAsync({
          sessionId,
          stains,
          customStain,
        });
      },

      // Обробка вибору дефектів
      processDefectSelection: async (defects: string[], customDefect?: string) => {
        if (!sessionId) {
          throw new Error('Session ID is required');
        }
        return processDefectSelectionMutation.mutateAsync({
          sessionId,
          defects,
          customDefect,
        });
      },

      // Обробка приміток про дефекти
      processDefectNotes: async (
        notes: string,
        hasNoGuarantee?: boolean,
        noGuaranteeReason?: string
      ) => {
        if (!sessionId) {
          throw new Error('Session ID is required');
        }
        return processDefectNotesMutation.mutateAsync({
          sessionId,
          notes,
          hasNoGuarantee,
          noGuaranteeReason,
        });
      },

      // Завершення підетапу
      completeSubstep: async () => {
        if (!sessionId) {
          throw new Error('Session ID is required');
        }
        return completeSubstepMutation.mutateAsync({ sessionId });
      },

      // Повернення назад
      goBack: async () => {
        if (!sessionId) {
          throw new Error('Session ID is required');
        }
        return goBackMutation.mutateAsync({ sessionId });
      },

      // Скидання підетапу
      resetSubstep: async () => {
        if (!sessionId) {
          throw new Error('Session ID is required');
        }
        // Логіка скидання через API (якщо потрібно)
        return Promise.resolve();
      },
    }),
    [
      sessionId,
      initializeSubstepMutation,
      processStainSelectionMutation,
      processDefectSelectionMutation,
      processDefectNotesMutation,
      completeSubstepMutation,
      goBackMutation,
    ]
  );

  // Мемоізовані дані
  const data = useMemo(
    () => ({
      context: contextQuery.data,
      availableStainTypes: availableStainTypesQuery.data || [],
      availableDefectTypes: availableDefectTypesQuery.data || [],

      // Додаткові обчислювані дані
      hasContext: !!contextQuery.data,
      hasStainTypes: (availableStainTypesQuery.data?.length || 0) > 0,
      hasDefectTypes: (availableDefectTypesQuery.data?.length || 0) > 0,
    }),
    [contextQuery.data, availableStainTypesQuery.data, availableDefectTypesQuery.data]
  );

  // Мемоізовані стани завантаження
  const loading = useMemo(
    () => ({
      isInitializing: initializeSubstepMutation.isPending,
      isProcessingStains: processStainSelectionMutation.isPending,
      isProcessingDefects: processDefectSelectionMutation.isPending,
      isProcessingNotes: processDefectNotesMutation.isPending,
      isCompleting: completeSubstepMutation.isPending,
      isGoingBack: goBackMutation.isPending,
      isLoadingContext: contextQuery.isFetching,
      isLoadingStainTypes: availableStainTypesQuery.isFetching,
      isLoadingDefectTypes: availableDefectTypesQuery.isFetching,

      // Загальні стани
      isAnyMutationPending:
        initializeSubstepMutation.isPending ||
        processStainSelectionMutation.isPending ||
        processDefectSelectionMutation.isPending ||
        processDefectNotesMutation.isPending ||
        completeSubstepMutation.isPending ||
        goBackMutation.isPending,

      isAnyQueryLoading:
        contextQuery.isFetching ||
        availableStainTypesQuery.isFetching ||
        availableDefectTypesQuery.isFetching,
    }),
    [
      initializeSubstepMutation.isPending,
      processStainSelectionMutation.isPending,
      processDefectSelectionMutation.isPending,
      processDefectNotesMutation.isPending,
      completeSubstepMutation.isPending,
      goBackMutation.isPending,
      contextQuery.isFetching,
      availableStainTypesQuery.isFetching,
      availableDefectTypesQuery.isFetching,
    ]
  );

  return {
    operations,
    data,
    loading,
  };
};

export type UseDefectsStainsAPIReturn = ReturnType<typeof useDefectsStainsAPI>;
