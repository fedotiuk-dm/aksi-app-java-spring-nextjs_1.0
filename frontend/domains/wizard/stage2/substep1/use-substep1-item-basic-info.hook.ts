// Тонка обгортка над Orval хуками для substep1 - Основна інформація про предмет
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

// Orval хуки (готові з бекенду)
import {
  useSubstep1StartSubstep,
  useSubstep1SelectServiceCategory,
  useSubstep1SelectPriceListItem,
  useSubstep1EnterQuantity,
  useSubstep1ValidateAndComplete,
  useSubstep1Reset,
  useSubstep1FinalizeSession,
  useSubstep1GetStatus,
  useSubstep1GetServiceCategories,
  useSubstep1GetItemsForCategory,
} from '@api/substep1';

// Локальні імпорти
import {
  SUBSTEP1_UI_STEPS,
  SUBSTEP1_VALIDATION_RULES,
  calculateSubstep1Progress,
  getNextSubstep1Step,
  getPreviousSubstep1Step,
} from './constants';
import { adaptServiceCategories, adaptPriceListItems } from './utils';
import {
  substep1CategorySearchFormSchema,
  substep1ItemSearchFormSchema,
  substep1QuantityFormSchema,
  substep1ValidationFormSchema,
  type Substep1CategorySearchFormData,
  type Substep1ItemSearchFormData,
  type Substep1QuantityFormData,
  type Substep1ValidationFormData,
} from './schemas';
import { useItemBasicInfoStore, useItemBasicInfoSelectors } from './store';

// =================== ТОНКА ОБГОРТКА ===================
export const useSubstep1ItemBasicInfo = () => {
  // UI стан з Zustand
  const uiState = useItemBasicInfoStore();
  const selectors = useItemBasicInfoSelectors();

  // Orval API хуки (без додаткової логіки)
  const startSubstepMutation = useSubstep1StartSubstep();
  const selectServiceCategoryMutation = useSubstep1SelectServiceCategory();
  const selectPriceListItemMutation = useSubstep1SelectPriceListItem();
  const enterQuantityMutation = useSubstep1EnterQuantity();
  const validateAndCompleteMutation = useSubstep1ValidateAndComplete();
  const resetMutation = useSubstep1Reset();
  const finalizeSessionMutation = useSubstep1FinalizeSession();

  // Запити даних
  const statusQuery = useSubstep1GetStatus(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const serviceCategoriesQuery = useSubstep1GetServiceCategories({
    query: { enabled: !!uiState.sessionId },
  });

  const itemsForCategoryQuery = useSubstep1GetItemsForCategory(uiState.selectedCategoryId || '', {
    query: { enabled: !!uiState.sessionId && !!uiState.selectedCategoryId },
  });

  // =================== ФОРМИ З ZOD ВАЛІДАЦІЄЮ ===================
  // Форма пошуку категорій
  const categorySearchForm = useForm<Substep1CategorySearchFormData>({
    resolver: zodResolver(substep1CategorySearchFormSchema),
    defaultValues: {
      searchTerm: uiState.searchTerm,
    },
  });

  // Форма пошуку предметів
  const itemSearchForm = useForm<Substep1ItemSearchFormData>({
    resolver: zodResolver(substep1ItemSearchFormSchema),
    defaultValues: {
      searchTerm: uiState.searchTerm,
      categoryId: uiState.selectedCategoryId || '',
    },
  });

  // Форма введення кількості
  const quantityForm = useForm<Substep1QuantityFormData>({
    resolver: zodResolver(substep1QuantityFormSchema),
    defaultValues: {
      quantity: uiState.quantity,
    },
  });

  // Форма валідації
  const validationForm = useForm<Substep1ValidationFormData>({
    resolver: zodResolver(substep1ValidationFormSchema),
    defaultValues: {
      confirmed: false,
    },
  });

  // Стан завантаження (простий)
  const loading = useMemo(
    () => ({
      isStarting: startSubstepMutation.isPending,
      isSelectingCategory: selectServiceCategoryMutation.isPending,
      isSelectingItem: selectPriceListItemMutation.isPending,
      isEnteringQuantity: enterQuantityMutation.isPending,
      isValidating: validateAndCompleteMutation.isPending,
      isResetting: resetMutation.isPending,
      isFinalizing: finalizeSessionMutation.isPending,
      isLoadingStatus: statusQuery.isLoading,
      isLoadingCategories: serviceCategoriesQuery.isLoading,
      isLoadingItems: itemsForCategoryQuery.isLoading,
      isAnyLoading:
        startSubstepMutation.isPending ||
        selectServiceCategoryMutation.isPending ||
        selectPriceListItemMutation.isPending ||
        enterQuantityMutation.isPending ||
        validateAndCompleteMutation.isPending ||
        resetMutation.isPending ||
        finalizeSessionMutation.isPending ||
        statusQuery.isLoading ||
        serviceCategoriesQuery.isLoading ||
        itemsForCategoryQuery.isLoading,
    }),
    [
      startSubstepMutation.isPending,
      selectServiceCategoryMutation.isPending,
      selectPriceListItemMutation.isPending,
      enterQuantityMutation.isPending,
      validateAndCompleteMutation.isPending,
      resetMutation.isPending,
      finalizeSessionMutation.isPending,
      statusQuery.isLoading,
      serviceCategoriesQuery.isLoading,
      itemsForCategoryQuery.isLoading,
    ]
  );

  // =================== ОБЧИСЛЕНІ ЗНАЧЕННЯ ===================
  const computed = useMemo(
    () => ({
      // Прогрес з константами
      progressPercentage: calculateSubstep1Progress(uiState.currentStep),

      // Навігація з константами
      nextStep: getNextSubstep1Step(uiState.currentStep),
      previousStep: getPreviousSubstep1Step(uiState.currentStep),

      // Валідація з константами
      canGoToNextStep: (() => {
        switch (uiState.currentStep) {
          case SUBSTEP1_UI_STEPS.CATEGORY_SELECTION:
            return SUBSTEP1_VALIDATION_RULES.canGoToItemSelection(uiState.selectedCategoryId);
          case SUBSTEP1_UI_STEPS.ITEM_SELECTION:
            return SUBSTEP1_VALIDATION_RULES.canGoToQuantityEntry(uiState.selectedItemId);
          case SUBSTEP1_UI_STEPS.QUANTITY_ENTRY:
            return SUBSTEP1_VALIDATION_RULES.canValidate(uiState.quantity);
          case SUBSTEP1_UI_STEPS.VALIDATION:
            return SUBSTEP1_VALIDATION_RULES.canComplete(
              uiState.selectedCategoryId,
              uiState.selectedItemId,
              uiState.quantity
            );
          default:
            return false;
        }
      })(),

      // Стан кроків
      isFirstStep: uiState.currentStep === SUBSTEP1_UI_STEPS.CATEGORY_SELECTION,
      isLastStep: uiState.currentStep === SUBSTEP1_UI_STEPS.COMPLETED,

      // Загальна готовність
      isReadyToComplete: SUBSTEP1_VALIDATION_RULES.canComplete(
        uiState.selectedCategoryId,
        uiState.selectedItemId,
        uiState.quantity
      ),
    }),
    [uiState.currentStep, uiState.selectedCategoryId, uiState.selectedItemId, uiState.quantity]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand + селектори)
    ui: {
      ...uiState,
      ...selectors,
    },

    // API дані (адаптовані для UI)
    data: {
      status: statusQuery.data,
      serviceCategories: serviceCategoriesQuery.data
        ? adaptServiceCategories(serviceCategoriesQuery.data)
        : undefined,
      itemsForCategory: itemsForCategoryQuery.data
        ? adaptPriceListItems(itemsForCategoryQuery.data)
        : undefined,
    },

    // Стан завантаження
    loading,

    // API мутації (прямо з Orval)
    mutations: {
      startSubstep: startSubstepMutation,
      selectServiceCategory: selectServiceCategoryMutation,
      selectPriceListItem: selectPriceListItemMutation,
      enterQuantity: enterQuantityMutation,
      validateAndComplete: validateAndCompleteMutation,
      reset: resetMutation,
      finalizeSession: finalizeSessionMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      status: statusQuery,
      serviceCategories: serviceCategoriesQuery,
      itemsForCategory: itemsForCategoryQuery,
    },

    // Форми з валідацією
    forms: {
      categorySearch: categorySearchForm,
      itemSearch: itemSearchForm,
      quantity: quantityForm,
      validation: validationForm,
    },

    // Обчислені значення з константами
    computed,

    // Константи для UI
    constants: {
      UI_STEPS: SUBSTEP1_UI_STEPS,
      VALIDATION_RULES: SUBSTEP1_VALIDATION_RULES,
    },
  };
};
// =================== ТИПИ ===================
export type UseSubstep1ItemBasicInfoReturn = ReturnType<typeof useSubstep1ItemBasicInfo>;
