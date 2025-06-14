// 📋 SUBSTEP2 WORKFLOW: Тонка обгортка для координації характеристик предмета
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Orval хуки (готові з бекенду)
import {
  useSubstep2InitializeSubstep,
  useSubstep2CompleteSubstep,
  useSubstep2GetCurrentCharacteristics,
} from '@/shared/api/generated/substep2';

// Локальні імпорти
import { useSubstep2WorkflowStore, useSubstep2WorkflowSelectors } from './workflow.store';
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
} from './workflow.constants';
import {
  initializationFormSchema,
  navigationFormSchema,
  completionFormSchema,
  type InitializationFormData,
  type NavigationFormData,
  type CompletionFormData,
} from './schemas';

// =================== ТОНКА ОБГОРТКА ===================
export const useSubstep2Workflow = () => {
  // UI стан з Zustand
  const store = useSubstep2WorkflowStore();
  const selectors = useSubstep2WorkflowSelectors();

  // =================== ORVAL API ХУКИ ===================
  // Мутації
  const initializeMutation = useSubstep2InitializeSubstep();
  const completeMutation = useSubstep2CompleteSubstep();

  // Запити
  const currentCharacteristicsQuery = useSubstep2GetCurrentCharacteristics(store.sessionId || '', {
    query: { enabled: !!store.sessionId },
  });

  // =================== ФОРМИ (МІНІМАЛЬНІ) ===================
  const initializationForm = useForm<InitializationFormData>({
    resolver: zodResolver(initializationFormSchema),
    defaultValues: {
      sessionId: store.sessionId || '',
      orderId: store.orderId || undefined,
      itemId: store.itemId || undefined,
    },
  });

  const navigationForm = useForm({
    resolver: zodResolver(navigationFormSchema),
    defaultValues: {
      skipValidation: false,
    },
  });

  const completionForm = useForm({
    resolver: zodResolver(completionFormSchema),
    defaultValues: {
      saveProgress: true,
      proceedToNext: true,
    },
  });

  // =================== СТАН ЗАВАНТАЖЕННЯ ===================
  const loading = useMemo(
    () => ({
      isInitializing: initializeMutation.isPending,
      isCompleting: completeMutation.isPending,
      isLoadingCharacteristics: currentCharacteristicsQuery.isLoading,
      isAnyLoading:
        initializeMutation.isPending ||
        completeMutation.isPending ||
        currentCharacteristicsQuery.isLoading,
    }),
    [
      initializeMutation.isPending,
      completeMutation.isPending,
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
      currentCharacteristics: currentCharacteristicsQuery.data,
    },

    // Стан завантаження
    loading,

    // API мутації (прямо з Orval)
    mutations: {
      initialize: initializeMutation,
      complete: completeMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      currentCharacteristics: currentCharacteristicsQuery,
    },

    // Форми (React Hook Form + Zod)
    forms: {
      initialization: initializationForm,
      navigation: navigationForm,
      completion: completionForm,
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
export type UseSubstep2WorkflowReturn = ReturnType<typeof useSubstep2Workflow>;
