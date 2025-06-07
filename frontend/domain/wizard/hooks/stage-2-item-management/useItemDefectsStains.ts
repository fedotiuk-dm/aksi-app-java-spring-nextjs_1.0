/**
 * @fileoverview Хук для управління дефектами та плямами предмета
 *
 * Відповідальність:
 * - Завантаження типів плям з API через Orval хуки
 * - Завантаження дефектів та ризиків з API через Orval хуки
 * - Мультивибір плям та дефектів
 * - Примітки до дефектів
 */

import { useState, useCallback, useMemo } from 'react';

import { useGetStainTypes, useGetDefectsAndRisks } from '@/shared/api/generated/full/aksiApi';

import type { ItemDefectsStains, UseItemDefectsStainsReturn } from './types';
import type { StainTypeDTO } from '@/shared/api/generated/full/aksiApi.schemas';

// Тимчасові типи для плям та дефектів (поки API не повертає об'єкти)
export interface StainType {
  id: string;
  name: string;
}

export interface DefectType {
  id: string;
  name: string;
}

/**
 * Хук для управління дефектами та плямами предмета
 *
 * @example
 * ```tsx
 * const {
 *   defectsStains,
 *   availableStains,
 *   toggleStain,
 *   toggleDefect
 * } = useItemDefectsStains();
 *
 * // Додати/прибрати пляму
 * toggleStain(stainType);
 *
 * // Додати/прибрати дефект
 * toggleDefect(defectType);
 * ```
 */
export function useItemDefectsStains(): UseItemDefectsStainsReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [defectsStains, setDefectsStains] = useState<ItemDefectsStains>({
    stains: [],
    defects: [],
    notes: '',
  });

  // =====================================
  // API запити через Orval хуки
  // =====================================

  // Типи плям
  const {
    data: stainTypesData = [],
    isLoading: isLoadingStains,
    error: stainsError,
  } = useGetStainTypes(undefined, {
    query: {
      staleTime: 30 * 60 * 1000, // 30 хвилин
      gcTime: 60 * 60 * 1000, // 1 година
    },
  });

  // Дефекти та ризики
  const {
    data: defectTypesData = [],
    isLoading: isLoadingDefects,
    error: defectsError,
  } = useGetDefectsAndRisks({
    query: {
      staleTime: 30 * 60 * 1000, // 30 хвилин
      gcTime: 60 * 60 * 1000, // 1 година
    },
  });

  // =====================================
  // Трансформація API даних у внутрішні типи
  // =====================================

  const availableStains = useMemo((): StainType[] => {
    return stainTypesData.map((stainDto: StainTypeDTO, index) => ({
      id: stainDto.id || `stain-${index}`,
      name: stainDto.name || '',
    }));
  }, [stainTypesData]);

  const availableDefects = useMemo((): DefectType[] => {
    return defectTypesData.map((defectName: string, index) => ({
      id: `defect-${index}`,
      name: defectName,
    }));
  }, [defectTypesData]);

  // =====================================
  // Derived state
  // =====================================

  const isLoading = isLoadingStains || isLoadingDefects;
  const error = stainsError?.message || defectsError?.message || null;

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Додати/прибрати пляму
   */
  const toggleStain = useCallback((stain: StainType) => {
    setDefectsStains((prev) => {
      const existingIndex = prev.stains.findIndex((s) => s.id === stain.id);

      if (existingIndex >= 0) {
        // Прибираємо пляму
        return {
          ...prev,
          stains: prev.stains.filter((s) => s.id !== stain.id),
        };
      } else {
        // Додаємо пляму
        return {
          ...prev,
          stains: [...prev.stains, stain],
        };
      }
    });
  }, []);

  /**
   * Додати/прибрати дефект
   */
  const toggleDefect = useCallback((defect: DefectType) => {
    setDefectsStains((prev) => {
      const existingIndex = prev.defects.findIndex((d) => d.id === defect.id);

      if (existingIndex >= 0) {
        // Прибираємо дефект
        return {
          ...prev,
          defects: prev.defects.filter((d) => d.id !== defect.id),
        };
      } else {
        // Додаємо дефект
        return {
          ...prev,
          defects: [...prev.defects, defect],
        };
      }
    });
  }, []);

  /**
   * Встановити примітки
   */
  const setNotes = useCallback((notes: string) => {
    setDefectsStains((prev) => ({ ...prev, notes }));
  }, []);

  /**
   * Очистити всі дефекти та плями
   */
  const clearDefectsStains = useCallback(() => {
    setDefectsStains({
      stains: [],
      defects: [],
      notes: '',
    });
  }, []);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    defectsStains,
    availableStains,
    availableDefects,
    isLoading,
    error,

    // Дії
    toggleStain,
    toggleDefect,
    setNotes,
    clearDefectsStains,
  };
}
