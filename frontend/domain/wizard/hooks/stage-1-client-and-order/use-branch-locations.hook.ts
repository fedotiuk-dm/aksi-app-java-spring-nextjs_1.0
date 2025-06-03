/**
 * @fileoverview Хук для отримання філій через Order Wizard API
 *
 * Принцип: всі дані беремо тільки через wizard API
 * Філії отримуємо з стану wizard через getWizardState
 */

import { useMemo } from 'react';

import { useGetWizardState } from '@/shared/api/generated/order-wizard';

interface BranchLocation {
  id: string;
  name: string;
  address: string;
  code?: string;
  active?: boolean;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 🏢 Хук для отримання філій через Order Wizard API
 *
 * Філії завантажуються з wizard state через getWizardState API
 * Backend повинен зберігати список активних філій в wizard data
 */
export function useBranchLocations(wizardId?: string) {
  // Отримуємо стан wizard через orval API
  const {
    data: wizardState,
    isLoading,
    error,
    refetch,
  } = useGetWizardState(
    wizardId || '', // wizardId обов'язковий для запиту
    {
      query: {
        enabled: !!wizardId, // Робимо запит тільки якщо є wizardId
        staleTime: 1000 * 60 * 5, // Дані актуальні 5 хвилин
        gcTime: 1000 * 60 * 10, // Очищення кешу через 10 хвилин
      },
    }
  );

  // Витягуємо філії з wizard data
  const branches = useMemo(() => {
    if (!wizardState?.data) {
      return [];
    }

    // Шукаємо філії в даних wizard
    const branchesData = wizardState.data.branches || wizardState.data.activeBranches;

    if (Array.isArray(branchesData)) {
      return branchesData as BranchLocation[];
    }

    // Якщо філії не знайдені, повертаємо пустий масив
    return [];
  }, [wizardState?.data]);

  // Перевіряємо чи wizard взагалі завантажений
  const isWizardAvailable = useMemo(() => {
    return !!wizardId && !!wizardState;
  }, [wizardId, wizardState]);

  return {
    branches,
    isLoading: isLoading && !!wizardId, // Показуємо загрузку тільки якщо є wizardId
    error: wizardId ? error : null, // Показуємо помилку тільки якщо є wizardId
    isWizardAvailable,
    refetch: () => {
      if (wizardId) {
        refetch();
      }
    },
  };
}

export type BranchLocationsHook = ReturnType<typeof useBranchLocations>;
