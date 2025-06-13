// Тонка обгортка над Orval хуками для substep2 - Характеристики предмета
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Orval хуки (готові з бекенду)
import {
  useSubstep2InitializeSubstep,
  useSubstep2SelectMaterial,
  useSubstep2SelectColor,
  useSubstep2SelectFiller,
  useSubstep2SelectWearLevel,
  useSubstep2ValidateCharacteristics,
  useSubstep2CompleteSubstep,
  useSubstep2CancelSubstep,
  useSubstep2GetAvailableMaterials,
  useSubstep2GetCurrentCharacteristics,
} from '@/shared/api/generated/substep2';

// Локальні імпорти
import { useItemCharacteristicsStore } from './store';
import {
  materialSelectionFormSchema,
  colorSelectionFormSchema,
  fillerSelectionFormSchema,
  wearLevelSelectionFormSchema,
  type MaterialSelectionFormData,
  type ColorSelectionFormData,
  type FillerSelectionFormData,
  type WearLevelSelectionFormData,
} from './schemas';

// =================== ТОНКА ОБГОРТКА ===================
export const useSubstep2ItemCharacteristics = () => {
  // UI стан з Zustand
  const uiState = useItemCharacteristicsStore();

  // Orval API хуки (без додаткової логіки)
  const initializeMutation = useSubstep2InitializeSubstep();
  const selectMaterialMutation = useSubstep2SelectMaterial();
  const selectColorMutation = useSubstep2SelectColor();
  const selectFillerMutation = useSubstep2SelectFiller();
  const selectWearLevelMutation = useSubstep2SelectWearLevel();
  const validateCharacteristicsMutation = useSubstep2ValidateCharacteristics();
  const completeSubstepMutation = useSubstep2CompleteSubstep();
  const cancelSubstepMutation = useSubstep2CancelSubstep();

  // Запити даних
  const availableMaterialsQuery = useSubstep2GetAvailableMaterials(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const currentCharacteristicsQuery = useSubstep2GetCurrentCharacteristics(
    uiState.sessionId || '',
    {
      query: { enabled: !!uiState.sessionId },
    }
  );

  // Форми (мінімальні)
  const materialSelectionForm = useForm<MaterialSelectionFormData>({
    resolver: zodResolver(materialSelectionFormSchema),
    defaultValues: {
      materialId: uiState.selectedMaterialId || '',
      customMaterial: uiState.customMaterial,
    },
  });

  const colorSelectionForm = useForm<ColorSelectionFormData>({
    resolver: zodResolver(colorSelectionFormSchema),
    defaultValues: {
      colorId: uiState.selectedColorId || undefined,
      customColor: uiState.customColor,
    },
  });

  const fillerSelectionForm = useForm<FillerSelectionFormData>({
    resolver: zodResolver(fillerSelectionFormSchema),
    defaultValues: {
      fillerId: uiState.selectedFillerId || undefined,
      customFiller: uiState.customFiller,
      isFillerDamaged: uiState.isFillerDamaged,
    },
  });

  const wearLevelSelectionForm = useForm<WearLevelSelectionFormData>({
    resolver: zodResolver(wearLevelSelectionFormSchema),
    defaultValues: {
      wearLevelId: uiState.selectedWearLevelId || '',
      wearPercentage: uiState.wearPercentage,
    },
  });

  // Стан завантаження (простий)
  const loading = useMemo(
    () => ({
      isInitializing: initializeMutation.isPending,
      isSelectingMaterial: selectMaterialMutation.isPending,
      isSelectingColor: selectColorMutation.isPending,
      isSelectingFiller: selectFillerMutation.isPending,
      isSelectingWearLevel: selectWearLevelMutation.isPending,
      isValidating: validateCharacteristicsMutation.isPending,
      isCompleting: completeSubstepMutation.isPending,
      isCancelling: cancelSubstepMutation.isPending,
      isLoadingMaterials: availableMaterialsQuery.isLoading,
      isLoadingCharacteristics: currentCharacteristicsQuery.isLoading,
    }),
    [
      initializeMutation.isPending,
      selectMaterialMutation.isPending,
      selectColorMutation.isPending,
      selectFillerMutation.isPending,
      selectWearLevelMutation.isPending,
      validateCharacteristicsMutation.isPending,
      completeSubstepMutation.isPending,
      cancelSubstepMutation.isPending,
      availableMaterialsQuery.isLoading,
      currentCharacteristicsQuery.isLoading,
    ]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand)
    ui: uiState,

    // API дані (прямо з Orval)
    data: {
      availableMaterials: availableMaterialsQuery.data,
      currentCharacteristics: currentCharacteristicsQuery.data,
    },

    // Стан завантаження
    loading,

    // API мутації (прямо з Orval)
    mutations: {
      initialize: initializeMutation,
      selectMaterial: selectMaterialMutation,
      selectColor: selectColorMutation,
      selectFiller: selectFillerMutation,
      selectWearLevel: selectWearLevelMutation,
      validateCharacteristics: validateCharacteristicsMutation,
      complete: completeSubstepMutation,
      cancel: cancelSubstepMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      availableMaterials: availableMaterialsQuery,
      currentCharacteristics: currentCharacteristicsQuery,
    },

    // Форми
    forms: {
      materialSelection: materialSelectionForm,
      colorSelection: colorSelectionForm,
      fillerSelection: fillerSelectionForm,
      wearLevelSelection: wearLevelSelectionForm,
    },
  };
};

// =================== ТИПИ ===================
export type UseSubstep2ItemCharacteristicsReturn = ReturnType<
  typeof useSubstep2ItemCharacteristics
>;
