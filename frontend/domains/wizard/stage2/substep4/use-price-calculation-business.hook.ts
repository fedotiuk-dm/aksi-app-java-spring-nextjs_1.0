/**
 * @fileoverview Бізнес-хук для координації Substep4 Price Calculation
 *
 * Відповідальність: координація API + UI стан + форми + бізнес-логіка
 * Принцип: Single Responsibility Principle
 */

import { useCallback, useEffect, useMemo } from 'react';

import { usePriceCalculationStore } from './price-calculation.store';
import { usePriceCalculationApi } from './use-price-calculation-api.hook';
import { usePriceCalculationForms } from './use-price-calculation-forms.hook';

/**
 * Інтерфейс для бізнес-логіки Substep4
 */
export interface UsePriceCalculationBusinessReturn {
  // UI стан
  ui: {
    sessionId: string | null;
    basePrice: number;
    quantity: number;
    selectedModifiers: string[];
    discountPercentage: number;
    urgencyPercentage: number;
    finalPrice: number;
    isCalculating: boolean;
    showAdvancedOptions: boolean;
    calculationMode: 'BASIC' | 'ADVANCED';
  };

  // API дані
  data: {
    currentData: any;
    currentState: any;
    availableModifiers: any[];
    recommendedModifiers: any[];
    availableEvents: any[];
    validationResult: any;
    sessionExists: boolean;
  };

  // Стани завантаження
  loading: {
    isInitializing: boolean;
    isCalculatingPrice: boolean;
    isAddingModifier: boolean;
    isValidating: boolean;
    isAnyLoading: boolean;
  };

  // Дії
  actions: {
    // Ініціалізація
    initializeSubstep: (data: any) => Promise<void>;

    // Розрахунки цін
    calculateBasePrice: (data: any) => Promise<void>;
    calculatePrice: (data: any) => Promise<void>;
    calculateFinalPrice: () => Promise<void>;

    // Управління модифікаторами
    addModifier: (modifierId: string, value?: number, quantity?: number) => Promise<void>;
    removeModifier: (modifierId: string) => Promise<void>;

    // Завершення
    confirmCalculation: () => Promise<void>;
    resetCalculation: () => Promise<void>;

    // UI дії
    setBasePrice: (price: number) => void;
    setQuantity: (quantity: number) => void;
    setDiscountPercentage: (percentage: number) => void;
    setUrgencyPercentage: (percentage: number) => void;
    toggleAdvancedOptions: () => void;
    setCalculationMode: (mode: 'BASIC' | 'ADVANCED') => void;
  };

  // Форми
  forms: ReturnType<typeof usePriceCalculationForms>['forms'];
  formStates: ReturnType<typeof usePriceCalculationForms>['formStates'];
  formUtils: {
    resetAllForms: () => void;
    validateAllForms: () => Promise<boolean>;
    getFormData: () => any;
  };
}

/**
 * Бізнес-хук для Substep4 Price Calculation
 */
export const usePriceCalculationBusiness = (
  sessionId: string | null
): UsePriceCalculationBusinessReturn => {
  // Підключення до сторів та хуків
  const store = usePriceCalculationStore();
  const api = usePriceCalculationApi(sessionId);
  const formsHook = usePriceCalculationForms();

  // Синхронізація sessionId зі стором
  useEffect(() => {
    if (sessionId && sessionId !== store.sessionId) {
      store.setSessionId(sessionId);
    }
  }, [sessionId, store]);

  // Автоматичний перерахунок при зміні параметрів
  useEffect(() => {
    if (store.basePrice > 0 && store.quantity > 0) {
      store.recalculatePrice();
    }
  }, [
    store.basePrice,
    store.quantity,
    store.selectedModifiers,
    store.discountPercentage,
    store.urgencyPercentage,
  ]);

  // UI стан
  const ui = useMemo(
    () => ({
      sessionId: store.sessionId,
      basePrice: store.basePrice,
      quantity: store.quantity,
      selectedModifiers: store.selectedModifiers,
      discountPercentage: store.discountPercentage,
      urgencyPercentage: store.urgencyPercentage,
      finalPrice: store.finalPrice,
      isCalculating: store.isCalculating,
      showAdvancedOptions: store.showAdvancedOptions,
      calculationMode: store.calculationMode,
    }),
    [store]
  );

  // API дані
  const data = useMemo(
    () => ({
      currentData: api.queries.getCurrentData.data,
      currentState: api.queries.getCurrentState.data,
      availableModifiers: api.queries.getAvailableModifiers.data || [],
      recommendedModifiers: api.queries.getRecommendedModifiers.data || [],
      availableEvents: api.queries.getAvailableEvents.data || [],
      validationResult: api.queries.validateCurrentState.data,
      sessionExists: api.queries.sessionExists.data || false,
    }),
    [api.queries]
  );

  // Стани завантаження
  const loading = useMemo(
    () => ({
      isInitializing: api.mutations.initializeSubstep.isPending,
      isCalculatingPrice:
        api.mutations.calculatePrice.isPending || api.mutations.calculateFinalPrice.isPending,
      isAddingModifier:
        api.mutations.addModifier.isPending || api.mutations.removeModifier.isPending,
      isValidating:
        api.queries.validateCurrentState.isLoading || api.queries.validateDetailed.isLoading,
      isAnyLoading: api.isAnyLoading,
    }),
    [api]
  );

  // Дії для ініціалізації
  const initializeSubstep = useCallback(
    async (data: any) => {
      try {
        store.setIsCalculating(true);
        await api.mutations.initializeSubstep.mutateAsync({ sessionId: sessionId!, data });
        await api.refetchData();
      } catch (error) {
        console.error('Error initializing substep:', error);
      } finally {
        store.setIsCalculating(false);
      }
    },
    [sessionId, api, store]
  );

  // Дії для розрахунків
  const calculateBasePrice = useCallback(
    async (data: any) => {
      try {
        store.setIsCalculating(true);
        const result = await api.mutations.calculateBasePrice.mutateAsync({
          sessionId: sessionId!,
          data,
        });
        if (result?.basePrice) {
          store.setBasePrice(result.basePrice);
        }
      } catch (error) {
        console.error('Error calculating base price:', error);
      } finally {
        store.setIsCalculating(false);
      }
    },
    [sessionId, api, store]
  );

  const calculatePrice = useCallback(
    async (data: any) => {
      try {
        store.setIsCalculating(true);
        const result = await api.mutations.calculatePrice.mutateAsync({
          sessionId: sessionId!,
          data,
        });
        if (result?.finalPrice) {
          store.setFinalPrice(result.finalPrice);
        }
      } catch (error) {
        console.error('Error calculating price:', error);
      } finally {
        store.setIsCalculating(false);
      }
    },
    [sessionId, api, store]
  );

  const calculateFinalPrice = useCallback(async () => {
    try {
      store.setIsCalculating(true);
      const result = await api.mutations.calculateFinalPrice.mutateAsync({ sessionId: sessionId! });
      if (result?.finalPrice) {
        store.setFinalPrice(result.finalPrice);
      }
    } catch (error) {
      console.error('Error calculating final price:', error);
    } finally {
      store.setIsCalculating(false);
    }
  }, [sessionId, api, store]);

  // Дії для модифікаторів
  const addModifier = useCallback(
    async (modifierId: string, value?: number, quantity?: number) => {
      try {
        const data = { modifierId, rangeValue: value, quantity };
        await api.mutations.addModifier.mutateAsync({ sessionId: sessionId!, data });
        store.addModifier(modifierId);
        await calculateFinalPrice();
      } catch (error) {
        console.error('Error adding modifier:', error);
      }
    },
    [sessionId, api, store, calculateFinalPrice]
  );

  const removeModifier = useCallback(
    async (modifierId: string) => {
      try {
        await api.mutations.removeModifier.mutateAsync({ sessionId: sessionId!, modifierId });
        store.removeModifier(modifierId);
        await calculateFinalPrice();
      } catch (error) {
        console.error('Error removing modifier:', error);
      }
    },
    [sessionId, api, store, calculateFinalPrice]
  );

  // Дії для завершення
  const confirmCalculation = useCallback(async () => {
    try {
      await api.mutations.confirmCalculation.mutateAsync({ sessionId: sessionId! });
      store.setCalculationCompleted(true);
    } catch (error) {
      console.error('Error confirming calculation:', error);
    }
  }, [sessionId, api, store]);

  const resetCalculation = useCallback(async () => {
    try {
      await api.mutations.resetCalculation.mutateAsync({ sessionId: sessionId! });
      store.resetCalculation();
      formsHook.resetAllForms();
    } catch (error) {
      console.error('Error resetting calculation:', error);
    }
  }, [sessionId, api, store, formsHook]);

  // UI дії
  const setBasePrice = useCallback(
    (price: number) => {
      store.setBasePrice(price);
    },
    [store]
  );

  const setQuantity = useCallback(
    (quantity: number) => {
      store.setQuantity(quantity);
    },
    [store]
  );

  const setDiscountPercentage = useCallback(
    (percentage: number) => {
      store.setDiscountPercentage(percentage);
    },
    [store]
  );

  const setUrgencyPercentage = useCallback(
    (percentage: number) => {
      store.setUrgencyPercentage(percentage);
    },
    [store]
  );

  const toggleAdvancedOptions = useCallback(() => {
    store.setShowAdvancedOptions(!store.showAdvancedOptions);
  }, [store]);

  const setCalculationMode = useCallback(
    (mode: 'BASIC' | 'ADVANCED') => {
      store.setCalculationMode(mode);
    },
    [store]
  );

  return {
    ui,
    data,
    loading,
    actions: {
      initializeSubstep,
      calculateBasePrice,
      calculatePrice,
      calculateFinalPrice,
      addModifier,
      removeModifier,
      confirmCalculation,
      resetCalculation,
      setBasePrice,
      setQuantity,
      setDiscountPercentage,
      setUrgencyPercentage,
      toggleAdvancedOptions,
      setCalculationMode,
    },
    forms: formsHook.forms,
    formStates: formsHook.formStates,
    formUtils: {
      resetAllForms: formsHook.resetAllForms,
      validateAllForms: formsHook.validateAllForms,
      getFormData: formsHook.getFormData,
    },
  };
};
