/**
 * Основний хук для роботи з доменом Pricing
 * Надає зручний доступ до всієї функціональності ціноутворення
 */

import { useEffect, useCallback } from 'react';

import { PricingRepositoryFactory } from '../repositories/pricing.repository';
import {
  usePriceListStore,
  usePriceCalculationStore,
  pricingSelectors,
  initializePricingStores,
} from '../store/pricing.store';

import type {
  PriceCalculationRequest,
  ServiceCategoryCode,
  ModifierCategory,
} from '../types/pricing.types';

/**
 * Основний хук для роботи з pricing доменом
 */
export const usePricing = () => {
  // Отримуємо стан зі сторів
  const priceListState = usePriceListStore();
  const calculationState = usePriceCalculationStore();

  // Деструктуризуємо методи для правильних залежностей useCallback
  const {
    loadCategories,
    loadPriceListItems,
    loadModifiers,
    loadStainTypes,
    loadDefectTypes,
    refreshCache,
    clearErrors: clearPriceListErrors,
  } = priceListState;

  const {
    calculatePrice,
    clearCalculation,
    saveCalculationToHistory,
    clearHistory,
    clearErrors: clearCalculationErrors,
  } = calculationState;

  // Отримуємо репозиторій
  const repository = PricingRepositoryFactory.getInstance();

  // Ініціалізація при першому завантаженні
  useEffect(() => {
    initializePricingStores();
  }, []);

  // Мемоізовані дії для оптимізації
  const actions = {
    // Прайс-лист
    loadCategories: useCallback(() => loadCategories(), [loadCategories]),

    loadPriceListItems: useCallback(
      (categoryCode: ServiceCategoryCode) => loadPriceListItems(categoryCode),
      [loadPriceListItems]
    ),

    loadModifiers: useCallback(
      (category: ModifierCategory) => loadModifiers(category),
      [loadModifiers]
    ),

    loadStainTypes: useCallback(() => loadStainTypes(), [loadStainTypes]),

    loadDefectTypes: useCallback(() => loadDefectTypes(), [loadDefectTypes]),

    refreshCache: useCallback(() => refreshCache(), [refreshCache]),

    // Розрахунки
    calculatePrice: useCallback(
      (request: PriceCalculationRequest) => calculatePrice(request),
      [calculatePrice]
    ),

    clearCalculation: useCallback(() => clearCalculation(), [clearCalculation]),

    saveCalculationToHistory: useCallback(
      () => saveCalculationToHistory(),
      [saveCalculationToHistory]
    ),

    clearHistory: useCallback(() => clearHistory(), [clearHistory]),

    // Додаткові методи рекомендацій
    getRecommendedModifiersForStains: useCallback(
      (stains: string[], categoryCode?: ServiceCategoryCode, materialType?: string) =>
        repository.getRecommendedModifiersForStains(stains, categoryCode, materialType),
      [repository]
    ),

    getRecommendedModifiersForDefects: useCallback(
      (defects: string[], categoryCode?: ServiceCategoryCode, materialType?: string) =>
        repository.getRecommendedModifiersForDefects(defects, categoryCode, materialType),
      [repository]
    ),

    getRiskWarningsForItem: useCallback(
      (
        stains?: string[],
        defects?: string[],
        materialType?: string,
        categoryCode?: ServiceCategoryCode
      ) => repository.getRiskWarningsForItem(stains, defects, materialType, categoryCode),
      [repository]
    ),

    // Помилки
    clearAllErrors: useCallback(() => {
      clearPriceListErrors();
      clearCalculationErrors();
    }, [clearPriceListErrors, clearCalculationErrors]),
  };

  // Комбіновані селектори
  const data = {
    // Прайс-лист
    categories: priceListState.categories,
    activeCategories: pricingSelectors.getCategoriesByActive(true),
    items: priceListState.items,
    modifiers: priceListState.modifiers,
    stainTypes: priceListState.stainTypes,
    activeStainTypes: pricingSelectors.getActiveStainTypes(),
    defectTypes: priceListState.defectTypes,
    activeDefectTypes: pricingSelectors.getActiveDefectTypes(),

    // Розрахунки
    currentRequest: calculationState.currentRequest,
    currentResponse: calculationState.currentResponse,
    calculationHistory: calculationState.calculationHistory,

    // Стан
    isLoading: pricingSelectors.isLoading(),
    isCalculating: calculationState.isCalculating,

    // Помилки
    errors: pricingSelectors.getAllErrors(),
    hasErrors: Object.keys(pricingSelectors.getAllErrors()).length > 0,

    // Кеш
    cacheStatus: pricingSelectors.getCacheStatus(),
  };

  return {
    ...data,
    actions,

    // Утилітарні методи
    utils: {
      getPriceListItemsByCategory: pricingSelectors.getPriceListItemsByCategory,
      getModifiersByCategory: pricingSelectors.getModifiersByCategory,
      getCurrentCalculation: pricingSelectors.getCurrentCalculation,
      hasCalculationErrors: pricingSelectors.hasCalculationErrors,
    },
  };
};

export default usePricing;
