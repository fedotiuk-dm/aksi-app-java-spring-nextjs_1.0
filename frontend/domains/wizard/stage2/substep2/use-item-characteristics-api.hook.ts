/**
 * @fileoverview API хук для домену "Характеристики предмета (Substep2)"
 *
 * Відповідальність: тільки API операції через Orval хуки
 * Принцип: Single Responsibility Principle
 */

import { useMemo } from 'react';

// Готові Orval хуки
import {
  useSubstep2InitializeSubstep,
  useSubstep2GetCurrentCharacteristics,
  useSubstep2SelectMaterial,
  useSubstep2SelectColor,
  useSubstep2SelectFiller,
  useSubstep2SetWearPercentage,
  useSubstep2CompleteSubstep,
  useSubstep2ResetSubstep,
} from '@/shared/api/generated/wizard/aksiApi';

/**
 * Хук для API операцій характеристик предмета
 * Інкапсулює всі Orval хуки та мутації
 */
export const useItemCharacteristicsAPI = (sessionId: string | null) => {
  // Мутації для дій
  const initializeSubstepMutation = useSubstep2InitializeSubstep({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API: Ініціалізація Substep2 успішна', data);
      },
      onError: (error) => {
        console.error('❌ API: Помилка ініціалізації Substep2', error);
      },
    },
  });

  const selectMaterialMutation = useSubstep2SelectMaterial({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API: Матеріал обрано', data);
      },
      onError: (error) => {
        console.error('❌ API: Помилка вибору матеріалу', error);
      },
    },
  });

  const selectColorMutation = useSubstep2SelectColor({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API: Колір обрано', data);
      },
      onError: (error) => {
        console.error('❌ API: Помилка вибору кольору', error);
      },
    },
  });

  const selectFillerMutation = useSubstep2SelectFiller({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API: Наповнювач обрано', data);
      },
      onError: (error) => {
        console.error('❌ API: Помилка вибору наповнювача', error);
      },
    },
  });

  const setWearMutation = useSubstep2SetWearPercentage({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API: Ступінь зносу встановлено', data);
      },
      onError: (error) => {
        console.error('❌ API: Помилка встановлення ступеня зносу', error);
      },
    },
  });

  const completeSubstepMutation = useSubstep2CompleteSubstep({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API: Substep2 завершено', data);
      },
      onError: (error) => {
        console.error('❌ API: Помилка завершення Substep2', error);
      },
    },
  });

  const resetSubstepMutation = useSubstep2ResetSubstep({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API: Substep2 скинуто', data);
      },
      onError: (error) => {
        console.error('❌ API: Помилка скидання Substep2', error);
      },
    },
  });

  // Query для отримання поточного стану
  const currentCharacteristicsQuery = useSubstep2GetCurrentCharacteristics(sessionId || '', {
    query: {
      enabled: !!sessionId,
      staleTime: 30000, // 30 секунд
      refetchInterval: 60000, // 1 хвилина
    },
  });

  // Мемоізовані операції
  const operations = useMemo(
    () => ({
      // Ініціалізація підетапу
      initializeSubstep: async () => {
        if (!sessionId) throw new Error('No session ID for initialize substep');

        return await initializeSubstepMutation.mutateAsync({
          sessionId,
        });
      },

      // Вибір матеріалу
      selectMaterial: async (materialId: string) => {
        if (!sessionId) throw new Error('No session ID for select material');

        return await selectMaterialMutation.mutateAsync({
          sessionId,
          materialId,
        });
      },

      // Вибір кольору
      selectColor: async (colorId: string, customColor?: string) => {
        if (!sessionId) throw new Error('No session ID for select color');

        return await selectColorMutation.mutateAsync({
          sessionId,
          colorId,
          customColor,
        });
      },

      // Вибір наповнювача
      selectFiller: async (fillerId: string, isDamaged?: boolean) => {
        if (!sessionId) throw new Error('No session ID for select filler');

        return await selectFillerMutation.mutateAsync({
          sessionId,
          fillerId,
          isDamaged,
        });
      },

      // Встановлення ступеня зносу
      setWearPercentage: async (wearPercentage: number) => {
        if (!sessionId) throw new Error('No session ID for set wear');

        return await setWearMutation.mutateAsync({
          sessionId,
          wearPercentage,
        });
      },

      // Завершення підетапу
      completeSubstep: async () => {
        if (!sessionId) throw new Error('No session ID for complete substep');

        return await completeSubstepMutation.mutateAsync({
          sessionId,
        });
      },

      // Скидання підетапу
      resetSubstep: async () => {
        if (!sessionId) throw new Error('No session ID for reset substep');

        return await resetSubstepMutation.mutateAsync({
          sessionId,
        });
      },
    }),
    [
      sessionId,
      initializeSubstepMutation,
      selectMaterialMutation,
      selectColorMutation,
      selectFillerMutation,
      setWearMutation,
      completeSubstepMutation,
      resetSubstepMutation,
    ]
  );

  // Мемоізовані дані
  const data = useMemo(
    () => ({
      currentCharacteristics: currentCharacteristicsQuery.data,
    }),
    [currentCharacteristicsQuery.data]
  );

  // Мемоізовані стани завантаження
  const loading = useMemo(
    () => ({
      isInitializing: initializeSubstepMutation.isPending,
      isSelectingMaterial: selectMaterialMutation.isPending,
      isSelectingColor: selectColorMutation.isPending,
      isSelectingFiller: selectFillerMutation.isPending,
      isSettingWear: setWearMutation.isPending,
      isCompleting: completeSubstepMutation.isPending,
      isResetting: resetSubstepMutation.isPending,
      isLoadingCharacteristics: currentCharacteristicsQuery.isFetching,
    }),
    [
      initializeSubstepMutation.isPending,
      selectMaterialMutation.isPending,
      selectColorMutation.isPending,
      selectFillerMutation.isPending,
      setWearMutation.isPending,
      completeSubstepMutation.isPending,
      resetSubstepMutation.isPending,
      currentCharacteristicsQuery.isFetching,
    ]
  );

  return {
    operations,
    data,
    loading,
  };
};

export type UseItemCharacteristicsAPIReturn = ReturnType<typeof useItemCharacteristicsAPI>;
