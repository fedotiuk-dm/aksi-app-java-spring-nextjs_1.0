import { useMemo } from 'react';

import { DefectType, StainType } from '../types';

export interface DefectOption {
  value: DefectType;
  label: string;
  severity: 'low' | 'medium' | 'high';
}

export interface StainOption {
  value: StainType;
  label: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * Хук для роботи з дефектами та плямами в item wizard
 */
export const useDefectsStains = () => {
  /**
   * Список доступних дефектів з локалізацією та категоризацією
   */
  const defectOptions: DefectOption[] = useMemo(
    () => [
      {
        value: DefectType.WORN,
        label: 'Потертості',
        severity: 'low',
      },
      {
        value: DefectType.TORN,
        label: 'Порване',
        severity: 'high',
      },
      {
        value: DefectType.MISSING_ACCESSORIES,
        label: 'Відсутність фурнітури',
        severity: 'medium',
      },
      {
        value: DefectType.DAMAGED_ACCESSORIES,
        label: 'Пошкодження фурнітури',
        severity: 'medium',
      },
      {
        value: DefectType.COLOR_CHANGE_RISK,
        label: 'Ризики зміни кольору',
        severity: 'high',
      },
      {
        value: DefectType.DEFORMATION_RISK,
        label: 'Ризики деформації',
        severity: 'high',
      },
      {
        value: DefectType.OTHER,
        label: 'Інше',
        severity: 'medium',
      },
    ],
    []
  );

  /**
   * Список доступних плям з локалізацією та оцінкою складності
   */
  const stainOptions: StainOption[] = useMemo(
    () => [
      {
        value: StainType.GREASE,
        label: 'Жир',
        difficulty: 'medium',
      },
      {
        value: StainType.BLOOD,
        label: 'Кров',
        difficulty: 'hard',
      },
      {
        value: StainType.PROTEIN,
        label: 'Білок',
        difficulty: 'medium',
      },
      {
        value: StainType.WINE,
        label: 'Вино',
        difficulty: 'hard',
      },
      {
        value: StainType.COFFEE,
        label: 'Кава',
        difficulty: 'medium',
      },
      {
        value: StainType.GRASS,
        label: 'Трава',
        difficulty: 'medium',
      },
      {
        value: StainType.INK,
        label: 'Чорнило',
        difficulty: 'hard',
      },
      {
        value: StainType.COSMETICS,
        label: 'Косметика',
        difficulty: 'easy',
      },
      {
        value: StainType.OTHER,
        label: 'Інше',
        difficulty: 'medium',
      },
    ],
    []
  );

  /**
   * Перетворення масиву enum значень в масив рядків для сумісності
   */
  const convertDefectsToStrings = (defects: DefectType[]): string[] => {
    return defects.map((defect) => defect.toString());
  };

  /**
   * Перетворення масиву рядків в масив enum значень
   */
  const convertDefectsFromStrings = (defects: string[]): DefectType[] => {
    return defects
      .map((defect) => defect as DefectType)
      .filter((defect) => Object.values(DefectType).includes(defect));
  };

  /**
   * Перетворення масиву enum значень в масив рядків для сумісності
   */
  const convertStainsToStrings = (stains: StainType[]): string[] => {
    return stains.map((stain) => stain.toString());
  };

  /**
   * Перетворення масиву рядків в масив enum значень
   */
  const convertStainsFromStrings = (stains: string[]): StainType[] => {
    return stains
      .map((stain) => stain as StainType)
      .filter((stain) => Object.values(StainType).includes(stain));
  };

  /**
   * Отримання локалізованої назви дефекту
   */
  const getDefectLabel = (defectType: DefectType): string => {
    const option = defectOptions.find((opt) => opt.value === defectType);
    return option?.label || defectType;
  };

  /**
   * Отримання локалізованої назви плями
   */
  const getStainLabel = (stainType: StainType): string => {
    const option = stainOptions.find((opt) => opt.value === stainType);
    return option?.label || stainType;
  };

  /**
   * Перевірка чи має предмет критичні дефекти
   */
  const hasCriticalDefects = (defects: DefectType[]): boolean => {
    const criticalDefects = [
      DefectType.COLOR_CHANGE_RISK,
      DefectType.DEFORMATION_RISK,
      DefectType.TORN,
    ];
    return defects.some((defect) => criticalDefects.includes(defect));
  };

  /**
   * Перевірка чи має предмет складні плями
   */
  const hasHardStains = (stains: StainType[]): boolean => {
    const hardStains = [StainType.BLOOD, StainType.WINE, StainType.INK];
    return stains.some((stain) => hardStains.includes(stain));
  };

  return {
    // Опції для UI компонентів
    defectOptions,
    stainOptions,

    // Утиліти конвертації
    convertDefectsToStrings,
    convertDefectsFromStrings,
    convertStainsToStrings,
    convertStainsFromStrings,

    // Утиліти локалізації
    getDefectLabel,
    getStainLabel,

    // Бізнес-логіка
    hasCriticalDefects,
    hasHardStains,
  };
};
