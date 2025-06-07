/**
 * @fileoverview Хук для управління характеристиками предмета
 *
 * Відповідальність:
 * - Завантаження матеріалів залежно від категорії
 * - Завантаження кольорів та наповнювачів
 * - Управління ступенем зносу
 */

import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useMemo, useEffect } from 'react';

import { ItemCharacteristicsService } from '@/lib/api/generated/services/ItemCharacteristicsService';

import type { ItemCharacteristics, UseItemCharacteristicsReturn } from './types';
import type { ServiceCategoryDTO } from '@/shared/api/generated/full/aksiApi.schemas';

// Константи для ступеня зносу
const WEAR_LEVEL_OPTIONS = [10, 30, 50, 75];

// Константа для query key
const QUERY_KEY_BASE = 'item-characteristics';

/**
 * Хук для управління характеристиками предмета
 *
 * @param categoryId - ID категорії для фільтрації матеріалів
 * @example
 * ```tsx
 * const {
 *   characteristics,
 *   materialOptions,
 *   setMaterial,
 *   setColor
 * } = useItemCharacteristics('category-1');
 *
 * // Встановити матеріал
 * setMaterial('Бавовна');
 *
 * // Встановити колір
 * setColor('Білий');
 * ```
 */
export function useItemCharacteristics(
  selectedCategory?: ServiceCategoryDTO
): UseItemCharacteristicsReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [characteristics, setCharacteristics] = useState<ItemCharacteristics>({
    material: '',
    color: '',
    wearLevel: 10,
  });

  // =====================================
  // API запити для довідкових даних
  // =====================================

  // Материалы в зависимости от категории
  const {
    data: materialOptions = [],
    isLoading: isLoadingMaterials,
    error: materialsError,
  } = useQuery({
    queryKey: [QUERY_KEY_BASE, 'materials', selectedCategory?.name],
    queryFn: () =>
      ItemCharacteristicsService.getMaterials({
        category: selectedCategory?.name,
      }),
    enabled: true, // Загружаем всегда, category - опциональная
    staleTime: 30 * 60 * 1000, // 30 минут
    gcTime: 60 * 60 * 1000, // 1 час
  });

  // Базові кольори
  const {
    data: colorOptions = [],
    isLoading: isLoadingColors,
    error: colorsError,
  } = useQuery({
    queryKey: [QUERY_KEY_BASE, 'colors'],
    queryFn: () => ItemCharacteristicsService.getColors(),
    staleTime: 60 * 60 * 1000, // 1 час (статичні дані)
    gcTime: 24 * 60 * 60 * 1000, // 24 години
  });

  // Тип наповнювачів
  const {
    data: fillingOptions = [],
    isLoading: isLoadingFillings,
    error: fillingsError,
  } = useQuery({
    queryKey: [QUERY_KEY_BASE, 'filler-types'],
    queryFn: () => ItemCharacteristicsService.getFillerTypes(),
    staleTime: 60 * 60 * 1000, // 1 час
    gcTime: 24 * 60 * 60 * 1000, // 24 години
  });

  // Ступені зносу (статичні дані з бекенду)
  const {
    data: wearLevelOptionsFromApi = [],
    isLoading: isLoadingWearLevels,
    error: wearLevelsError,
  } = useQuery({
    queryKey: [QUERY_KEY_BASE, 'wear-degrees'],
    queryFn: () => ItemCharacteristicsService.getWearDegrees(),
    staleTime: 60 * 60 * 1000, // 1 час
    gcTime: 24 * 60 * 60 * 1000, // 24 години
  });

  // =====================================
  // Derived state
  // =====================================

  const isLoading =
    isLoadingMaterials || isLoadingColors || isLoadingFillings || isLoadingWearLevels;
  const error =
    materialsError?.message ||
    colorsError?.message ||
    fillingsError?.message ||
    wearLevelsError?.message ||
    null;

  // Используем данные с API, если доступны, иначе fallback к константам
  const wearLevelOptions = useMemo(() => {
    if (wearLevelOptionsFromApi.length > 0) {
      return wearLevelOptionsFromApi.map((str) => parseInt(str.replace('%', '')));
    }
    return WEAR_LEVEL_OPTIONS;
  }, [wearLevelOptionsFromApi]);

  // =====================================
  // Скидання характеристик при зміні категорії
  // =====================================

  useEffect(() => {
    if (selectedCategory) {
      // При зміні категорії скидоємо матеріал, але зберігаємо інші характеристики
      setCharacteristics((prev) => ({
        ...prev,
        material: '',
      }));
    }
  }, [selectedCategory]);

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Встановити матеріал
   */
  const setMaterial = useCallback((material: string) => {
    setCharacteristics((prev) => ({ ...prev, material }));
  }, []);

  /**
   * Встановити колір
   */
  const setColor = useCallback((color: string) => {
    setCharacteristics((prev) => ({ ...prev, color }));
  }, []);

  /**
   * Встановити наповнювач
   */
  const setFilling = useCallback((filling: string) => {
    setCharacteristics((prev) => ({ ...prev, filling }));
  }, []);

  /**
   * Встановити ступінь зносу
   */
  const setWearLevel = useCallback(
    (wearLevel: number) => {
      if (wearLevelOptions.includes(wearLevel)) {
        setCharacteristics((prev) => ({ ...prev, wearLevel }));
      }
    },
    [wearLevelOptions]
  );

  /**
   * Очистити всі характеристики
   */
  const clearCharacteristics = useCallback(() => {
    setCharacteristics({
      material: '',
      color: '',
      wearLevel: 10,
    });
  }, []);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    characteristics,
    materialOptions,
    colorOptions,
    fillingOptions,
    wearLevelOptions,
    isLoading,
    error,

    // Дії
    setMaterial,
    setColor,
    setFilling,
    setWearLevel,
    clearCharacteristics,
  };
}
