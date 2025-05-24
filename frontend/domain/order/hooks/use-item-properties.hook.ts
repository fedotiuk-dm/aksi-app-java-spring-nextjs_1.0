import { useMemo } from 'react';

import { MaterialType } from '../types';

export interface MaterialOption {
  value: MaterialType;
  label: string;
}

export interface FillerOption {
  value: string;
  label: string;
}

export interface WearLevelOption {
  value: string;
  label: string;
}

/**
 * Хук для роботи з характеристиками предметів в item wizard
 */
export const useItemProperties = () => {
  /**
   * Локалізовані назви матеріалів
   */
  const materialLabels: Record<MaterialType, string> = useMemo(
    () => ({
      [MaterialType.COTTON]: 'Бавовна',
      [MaterialType.WOOL]: 'Шерсть',
      [MaterialType.SILK]: 'Шовк',
      [MaterialType.SYNTHETIC]: 'Синтетика',
      [MaterialType.LEATHER]: 'Гладка шкіра',
      [MaterialType.NUBUCK]: 'Нубук',
      [MaterialType.SPLIT_LEATHER]: 'Спілок',
      [MaterialType.SUEDE]: 'Замша',
    }),
    []
  );

  /**
   * Базові кольори для швидкого вибору
   */
  const baseColors: string[] = useMemo(
    () => [
      'Білий',
      'Чорний',
      'Сірий',
      'Коричневий',
      'Синій',
      'Темно-синій',
      'Зелений',
      'Червоний',
      'Жовтий',
      'Помаранчевий',
      'Рожевий',
      'Фіолетовий',
      'Бежевий',
      'Кремовий',
    ],
    []
  );

  /**
   * Типи наповнювача
   */
  const fillerOptions: FillerOption[] = useMemo(
    () => [
      { value: 'down', label: 'Пух' },
      { value: 'synthetic', label: 'Синтепон' },
      { value: 'other', label: 'Інше' },
    ],
    []
  );

  /**
   * Ступені зносу
   */
  const wearLevelOptions: WearLevelOption[] = useMemo(
    () => [
      { value: '10', label: '10%' },
      { value: '30', label: '30%' },
      { value: '50', label: '50%' },
      { value: '75', label: '75%' },
    ],
    []
  );

  /**
   * Отримання доступних матеріалів для категорії
   */
  const getMaterialsByCategory = (category: string): MaterialType[] => {
    console.log('🔍 getMaterialsByCategory викликано для категорії:', category);

    const materialsByCategory: Record<string, MaterialType[]> = {
      CLEANING_TEXTILES: [
        MaterialType.COTTON,
        MaterialType.WOOL,
        MaterialType.SILK,
        MaterialType.SYNTHETIC,
      ],
      CLOTHING: [MaterialType.COTTON, MaterialType.WOOL, MaterialType.SILK, MaterialType.SYNTHETIC],
      PADDING: [MaterialType.COTTON, MaterialType.WOOL, MaterialType.SYNTHETIC], // Додано категорію для верхнього одягу
      LAUNDRY: [MaterialType.COTTON, MaterialType.SYNTHETIC],
      IRONING: [MaterialType.COTTON, MaterialType.WOOL, MaterialType.SILK, MaterialType.SYNTHETIC],
      LEATHER_CLEANING: [
        MaterialType.LEATHER,
        MaterialType.NUBUCK,
        MaterialType.SPLIT_LEATHER,
        MaterialType.SUEDE,
      ],
      SHEEPSKIN_CLEANING: [MaterialType.LEATHER, MaterialType.SUEDE],
      FUR_CLEANING: [], // Для хутра матеріал не вибирається
      TEXTILE_DYEING: [
        MaterialType.COTTON,
        MaterialType.WOOL,
        MaterialType.SILK,
        MaterialType.SYNTHETIC,
      ],
    };

    const materials = materialsByCategory[category] || [];
    console.log('🔍 getMaterialsByCategory результат:', {
      category,
      materialsCount: materials.length,
      materials,
      'category exists in map': Object.keys(materialsByCategory).includes(category),
      'all available categories': Object.keys(materialsByCategory),
    });

    return materials;
  };

  /**
   * Перевірка чи потрібен наповнювач для категорії
   */
  const needsFiller = (category: string): boolean => {
    return ['CLEANING_TEXTILES', 'PADDING', 'SHEEPSKIN_CLEANING', 'FUR_CLEANING'].includes(
      category
    );
  };

  /**
   * Конвертація enum матеріалів в опції для UI
   */
  const getMaterialOptions = (category: string): MaterialOption[] => {
    const availableMaterials = getMaterialsByCategory(category);
    return availableMaterials.map((material) => ({
      value: material,
      label: materialLabels[material],
    }));
  };

  /**
   * Отримання локалізованої назви матеріалу
   */
  const getMaterialLabel = (material: MaterialType): string => {
    return materialLabels[material] || material;
  };

  /**
   * Отримання локалізованої назви наповнювача
   */
  const getFillerLabel = (fillerType: string): string => {
    const option = fillerOptions.find((f) => f.value === fillerType);
    return option?.label || fillerType;
  };

  /**
   * Перевірка чи є матеріал доступним для категорії
   */
  const isMaterialAvailable = (material: MaterialType, category: string): boolean => {
    const availableMaterials = getMaterialsByCategory(category);
    return availableMaterials.includes(material);
  };

  return {
    // Дані для UI компонентів
    baseColors,
    fillerOptions,
    wearLevelOptions,

    // Утиліти для матеріалів
    getMaterialsByCategory,
    getMaterialOptions,
    getMaterialLabel,
    isMaterialAvailable,

    // Утиліти для наповнювача
    needsFiller,
    getFillerLabel,

    // Локалізація
    materialLabels,
  };
};
