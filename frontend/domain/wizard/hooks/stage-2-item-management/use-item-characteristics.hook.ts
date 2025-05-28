/**
 * @fileoverview Хук для характеристик предметів (крок 2.2)
 * @module domain/wizard/hooks/stage-2
 */

import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { CharacteristicsService } from '../../services/stage-2-item-management';
import { useWizardStore } from '../../store';

/**
 * Хук для характеристик предметів
 * 🧬 Композиція: TanStack Query + Zustand + CharacteristicsService
 */
export const useItemCharacteristics = () => {
  // 🏪 Zustand - глобальний стан
  const { addError } = useWizardStore();

  // ⚙️ Сервіс
  const characteristicsService = useMemo(() => new CharacteristicsService(), []);

  // 📋 Завантаження матеріалів
  const {
    data: materials = [],
    isLoading: isLoadingMaterials,
    error: materialsError,
  } = useQuery({
    queryKey: ['materials'],
    queryFn: () => characteristicsService.getAllMaterials(),
    staleTime: 3600000, // 1 година кеш
    gcTime: 7200000, // 2 години в кеші
  });

  // 📋 Завантаження кольорів
  const {
    data: colors = [],
    isLoading: isLoadingColors,
    error: colorsError,
  } = useQuery({
    queryKey: ['colors'],
    queryFn: () => characteristicsService.getAvailableColors(),
    staleTime: 1800000, // 30 хвилин кеш
    gcTime: 3600000, // 1 година в кеші
  });

  // 📋 Завантаження типів наповнювачів
  const {
    data: fillerTypes = [],
    isLoading: isLoadingFillerTypes,
    error: fillerTypesError,
  } = useQuery({
    queryKey: ['filler-types'],
    queryFn: () => characteristicsService.getFillerTypesEnum(),
    staleTime: 3600000, // 1 година кеш
    gcTime: 7200000, // 2 години в кеші
  });

  // 🔍 Методи фільтрації
  const searchMaterials = useCallback(
    (searchTerm: string) => {
      return materials.filter((material: any) =>
        material.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [materials]
  );

  const searchColors = useCallback(
    (searchTerm: string) => {
      return colors.filter((color: any) =>
        color.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [colors]
  );

  // 🔧 Утиліти для валідації
  const validateMaterial = useCallback(
    (materialData: unknown) => {
      return characteristicsService.validateMaterialSelection(materialData);
    },
    [characteristicsService]
  );

  const validateColor = useCallback(
    (colorData: unknown) => {
      return characteristicsService.validateColorInput(colorData);
    },
    [characteristicsService]
  );

  // 📊 Статус завантаження
  const loadingStatus = useMemo(
    () => ({
      isLoading: isLoadingMaterials || isLoadingColors || isLoadingFillerTypes,
      hasErrors: !!(materialsError || colorsError || fillerTypesError),
      errors: [materialsError, colorsError, fillerTypesError].filter(Boolean),
    }),
    [
      isLoadingMaterials,
      isLoadingColors,
      isLoadingFillerTypes,
      materialsError,
      colorsError,
      fillerTypesError,
    ]
  );

  return {
    // 📋 Дані
    materials,
    colors,
    fillerTypes,

    // 🔄 Стани завантаження
    isLoadingMaterials,
    isLoadingColors,
    isLoadingFillerTypes,
    loadingStatus,

    // ❌ Помилки
    materialsError,
    colorsError,
    fillerTypesError,

    // 🔍 Методи пошуку
    searchMaterials,
    searchColors,

    // ✅ Валідація
    validateMaterial,
    validateColor,
  };
};
