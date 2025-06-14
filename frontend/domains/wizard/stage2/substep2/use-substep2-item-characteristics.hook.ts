// 📋 ПІДЕТАП 2.2: Тонка обгортка над Orval хуками для характеристик предмета
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
  useSubstep2GetAvailableMaterials,
  useSubstep2GetCurrentCharacteristics,
} from '@/shared/api/generated/substep2';

// Локальні імпорти
import { useItemCharacteristicsStore, useItemCharacteristicsSelectors } from './store';
import {
  SUBSTEP2_UI_STEPS,
  SUBSTEP2_STEP_ORDER,
  SUBSTEP2_VALIDATION_RULES,
  SUBSTEP2_LIMITS,
  calculateSubstep2Progress,
  getNextSubstep2Step,
  getPreviousSubstep2Step,
  isFirstSubstep2Step,
  isLastSubstep2Step,
  type Substep2UIStep,
} from './constants';
import {
  materialSearchFormSchema,
  colorSearchFormSchema,
  fillerSearchFormSchema,
  displaySettingsFormSchema,
  type MaterialSearchFormData,
  type ColorSearchFormData,
  type FillerSearchFormData,
  type DisplaySettingsFormData,
} from './schemas';

// =================== ТОНКА ОБГОРТКА ===================
export const useSubstep2ItemCharacteristics = () => {
  // UI стан з Zustand
  const store = useItemCharacteristicsStore();
  const selectors = useItemCharacteristicsSelectors();

  // =================== ORVAL API ХУКИ ===================
  // Мутації
  const initializeMutation = useSubstep2InitializeSubstep();
  const selectMaterialMutation = useSubstep2SelectMaterial();
  const selectColorMutation = useSubstep2SelectColor();
  const selectFillerMutation = useSubstep2SelectFiller();
  const selectWearLevelMutation = useSubstep2SelectWearLevel();
  const validateCharacteristicsMutation = useSubstep2ValidateCharacteristics();
  const completeSubstepMutation = useSubstep2CompleteSubstep();

  // Запити даних
  const availableMaterialsQuery = useSubstep2GetAvailableMaterials(store.sessionId || '', {
    query: { enabled: !!store.sessionId },
  });

  const currentCharacteristicsQuery = useSubstep2GetCurrentCharacteristics(store.sessionId || '', {
    query: { enabled: !!store.sessionId },
  });

  // =================== ФОРМИ (МІНІМАЛЬНІ) ===================
  const materialSearchForm = useForm<MaterialSearchFormData>({
    resolver: zodResolver(materialSearchFormSchema),
    defaultValues: {
      searchTerm: store.materialSearchTerm,
    },
  });

  const colorSearchForm = useForm<ColorSearchFormData>({
    resolver: zodResolver(colorSearchFormSchema),
    defaultValues: {
      searchTerm: store.colorSearchTerm,
    },
  });

  const fillerSearchForm = useForm<FillerSearchFormData>({
    resolver: zodResolver(fillerSearchFormSchema),
    defaultValues: {
      searchTerm: store.fillerSearchTerm,
    },
  });

  const displaySettingsForm = useForm({
    resolver: zodResolver(displaySettingsFormSchema),
    defaultValues: {
      showMaterialDetails: store.showMaterialDetails,
      showColorDetails: store.showColorDetails,
      showFillerDetails: store.showFillerDetails,
      showWearLevelDetails: store.showWearLevelDetails,
    },
  });

  // =================== СТАН ЗАВАНТАЖЕННЯ ===================
  const loading = useMemo(
    () => ({
      isInitializing: initializeMutation.isPending,
      isSelectingMaterial: selectMaterialMutation.isPending,
      isSelectingColor: selectColorMutation.isPending,
      isSelectingFiller: selectFillerMutation.isPending,
      isSelectingWearLevel: selectWearLevelMutation.isPending,
      isValidating: validateCharacteristicsMutation.isPending,
      isCompleting: completeSubstepMutation.isPending,
      isLoadingMaterials: availableMaterialsQuery.isLoading,
      isLoadingCharacteristics: currentCharacteristicsQuery.isLoading,
      isAnyLoading:
        initializeMutation.isPending ||
        selectMaterialMutation.isPending ||
        selectColorMutation.isPending ||
        selectFillerMutation.isPending ||
        selectWearLevelMutation.isPending ||
        validateCharacteristicsMutation.isPending ||
        completeSubstepMutation.isPending ||
        availableMaterialsQuery.isLoading ||
        currentCharacteristicsQuery.isLoading,
    }),
    [
      initializeMutation.isPending,
      selectMaterialMutation.isPending,
      selectColorMutation.isPending,
      selectFillerMutation.isPending,
      selectWearLevelMutation.isPending,
      validateCharacteristicsMutation.isPending,
      completeSubstepMutation.isPending,
      availableMaterialsQuery.isLoading,
      currentCharacteristicsQuery.isLoading,
    ]
  );

  // =================== ОБЧИСЛЕНІ ЗНАЧЕННЯ З КОНСТАНТАМИ ===================
  const computed = useMemo(
    () => ({
      // Прогрес з константами
      progressPercentage: calculateSubstep2Progress(store.currentStep),

      // Навігація з константами
      nextStep: getNextSubstep2Step(store.currentStep),
      previousStep: getPreviousSubstep2Step(store.currentStep),
      isFirstStep: isFirstSubstep2Step(store.currentStep),
      isLastStep: isLastSubstep2Step(store.currentStep),

      // Валідація з константами
      canGoToColorSelection: SUBSTEP2_VALIDATION_RULES.canGoToColorSelection(
        store.selectedMaterialId
      ),
      canGoToFillerSelection: SUBSTEP2_VALIDATION_RULES.canGoToFillerSelection(
        store.selectedMaterialId,
        store.selectedColorId
      ),
      canGoToWearLevelSelection: SUBSTEP2_VALIDATION_RULES.canGoToWearLevelSelection(
        store.selectedMaterialId,
        store.selectedColorId,
        store.selectedFillerId
      ),
      canValidate: SUBSTEP2_VALIDATION_RULES.canValidate(
        store.selectedMaterialId,
        store.selectedColorId,
        store.selectedFillerId,
        store.selectedWearLevelId
      ),
      canComplete: SUBSTEP2_VALIDATION_RULES.canComplete(
        store.selectedMaterialId,
        store.selectedColorId,
        store.selectedFillerId,
        store.selectedWearLevelId
      ),

      // Пошук валідація з константами
      isMaterialSearchValid: store.materialSearchTerm.length >= SUBSTEP2_LIMITS.MIN_SEARCH_LENGTH,
      isColorSearchValid: store.colorSearchTerm.length >= SUBSTEP2_LIMITS.MIN_SEARCH_LENGTH,
      isFillerSearchValid: store.fillerSearchTerm.length >= SUBSTEP2_LIMITS.MIN_SEARCH_LENGTH,

      // Ліміти з констант
      minSearchLength: SUBSTEP2_LIMITS.MIN_SEARCH_LENGTH,
      maxSearchLength: SUBSTEP2_LIMITS.MAX_SEARCH_LENGTH,
      debounceDelay: SUBSTEP2_LIMITS.DEBOUNCE_DELAY,
    }),
    [
      store.currentStep,
      store.selectedMaterialId,
      store.selectedColorId,
      store.selectedFillerId,
      store.selectedWearLevelId,
      store.materialSearchTerm,
      store.colorSearchTerm,
      store.fillerSearchTerm,
    ]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (з константами та селекторами)
    ui: {
      ...store,
      ...selectors,
    },

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
    },

    // Запити (прямо з Orval)
    queries: {
      availableMaterials: availableMaterialsQuery,
      currentCharacteristics: currentCharacteristicsQuery,
    },

    // Форми (React Hook Form + Zod)
    forms: {
      materialSearch: materialSearchForm,
      colorSearch: colorSearchForm,
      fillerSearch: fillerSearchForm,
      displaySettings: displaySettingsForm,
    },

    // Обчислені значення з константами
    computed,

    // Константи (для прямого доступу в UI)
    constants: {
      UI_STEPS: SUBSTEP2_UI_STEPS,
      STEP_ORDER: SUBSTEP2_STEP_ORDER,
      VALIDATION_RULES: SUBSTEP2_VALIDATION_RULES,
      LIMITS: SUBSTEP2_LIMITS,
    },
  };
};

// =================== ТИПИ ===================
export type UseSubstep2ItemCharacteristicsReturn = ReturnType<
  typeof useSubstep2ItemCharacteristics
>;
