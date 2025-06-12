/**
 * @fileoverview Форми хук для домену "Характеристики предмета (Substep2)"
 *
 * Відповідальність: тільки управління формами та валідація
 * Принцип: Single Responsibility Principle
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  materialSelectionSchema,
  colorSelectionSchema,
  fillerSelectionSchema,
  wearLevelSelectionSchema,
  type MaterialSelectionData,
  type ColorSelectionData,
  type FillerSelectionData,
  type WearLevelSelectionData,
} from './item-characteristics.schemas';
import { useItemCharacteristicsStore } from './item-characteristics.store';

/**
 * Хук для управління формами характеристик предмета
 * Інкапсулює всю логіку форм і валідації
 */
export const useItemCharacteristicsForms = () => {
  const {
    selectedMaterialId,
    selectedColorId,
    customColor,
    selectedFillerId,
    isFillerDamaged,
    wearPercentage,
    sessionId,
  } = useItemCharacteristicsStore();

  // React Hook Form для вибору матеріалу
  const materialForm = useForm<MaterialSelectionData>({
    resolver: zodResolver(materialSelectionSchema),
    defaultValues: {
      materialId: selectedMaterialId || '',
    },
    mode: 'onChange',
  });

  // React Hook Form для вибору кольору
  const colorForm = useForm<ColorSelectionData>({
    resolver: zodResolver(colorSelectionSchema),
    defaultValues: {
      color: customColor || '',
      isCustomColor: !!customColor,
    },
    mode: 'onChange',
  });

  // React Hook Form для вибору наповнювача
  const fillerForm = useForm<FillerSelectionData>({
    resolver: zodResolver(fillerSelectionSchema),
    defaultValues: {
      fillerType: selectedFillerId || '',
      isFillerDamaged: isFillerDamaged || false,
      hasNoFiller: !selectedFillerId,
    },
    mode: 'onChange',
  });

  // React Hook Form для ступеня зносу
  const wearForm = useForm<WearLevelSelectionData>({
    resolver: zodResolver(wearLevelSelectionSchema),
    defaultValues: {
      wearPercentage: wearPercentage || 0,
    },
    mode: 'onChange',
  });

  // Синхронізація форм з стором
  useEffect(() => {
    materialForm.setValue('materialId', selectedMaterialId || '');
  }, [selectedMaterialId, materialForm]);

  useEffect(() => {
    colorForm.setValue('color', customColor || '');
    colorForm.setValue('isCustomColor', !!customColor);
  }, [customColor, colorForm]);

  useEffect(() => {
    fillerForm.setValue('fillerType', selectedFillerId || '');
    fillerForm.setValue('isFillerDamaged', isFillerDamaged || false);
    fillerForm.setValue('hasNoFiller', !selectedFillerId);
  }, [selectedFillerId, isFillerDamaged, fillerForm]);

  useEffect(() => {
    wearForm.setValue('wearPercentage', wearPercentage || 0);
  }, [wearPercentage, wearForm]);

  return {
    // Форма вибору матеріалу
    material: materialForm,

    // Форма вибору кольору
    color: colorForm,

    // Форма вибору наповнювача
    filler: fillerForm,

    // Форма ступеня зносу
    wear: wearForm,
  };
};

export type UseItemCharacteristicsFormsReturn = ReturnType<typeof useItemCharacteristicsForms>;
