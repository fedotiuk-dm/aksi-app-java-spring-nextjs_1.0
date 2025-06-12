/**
 * @fileoverview Головний композиційний хук для Substep4 Price Calculation
 *
 * Відповідальність: публічне API для UI компонентів
 * Принцип: Facade Pattern + Single Responsibility Principle
 */

import { useMemo } from 'react';

import { usePriceCalculationBusiness } from './use-price-calculation-business.hook';

/**
 * Інтерфейс для головного хука Substep4
 */
export interface UsePriceCalculationReturn {
  // UI стан (згруповано логічно)
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

  // Дані з API (згруповано логічно)
  data: {
    currentData: any;
    currentState: any;
    availableModifiers: any[];
    recommendedModifiers: any[];
    availableEvents: any[];
    validationResult: any;
    sessionExists: boolean;
  };

  // Стани завантаження (згруповано логічно)
  loading: {
    isInitializing: boolean;
    isCalculatingPrice: boolean;
    isAddingModifier: boolean;
    isValidating: boolean;
    isAnyLoading: boolean;
  };

  // Дії (згруповано за функціональністю)
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

  // Форми (згруповано логічно)
  forms: {
    basePriceCalculation: any;
    modifierSelection: any;
    priceCalculationForm: any;
    discountApplication: any;
    urgencyModifier: any;
    priceBreakdown: any;
    quickModifierSelection: any;
    priceValidation: any;
  };

  // Стани форм
  formStates: {
    isAnyFormDirty: boolean;
    isAnyFormSubmitting: boolean;
    hasAnyFormErrors: boolean;
    allFormErrors: Record<string, any>;
  };

  // Утиліти форм
  formUtils: {
    resetAllForms: () => void;
    validateAllForms: () => Promise<boolean>;
    getFormData: () => any;
  };

  // Готовність до використання
  isReady: boolean;
  hasErrors: boolean;
  canProceed: boolean;
}

/**
 * Головний хук для Substep4 Price Calculation
 *
 * Використання в UI компонентах:
 * ```tsx
 * const { ui, data, loading, actions, forms } = usePriceCalculation(sessionId);
 * ```
 */
export const usePriceCalculation = (sessionId: string | null): UsePriceCalculationReturn => {
  // Підключення до бізнес-логіки
  const business = usePriceCalculationBusiness(sessionId);

  // Обчислені значення для готовності
  const isReady = useMemo(() => {
    return !!(sessionId && business.data.sessionExists && !business.loading.isInitializing);
  }, [sessionId, business.data.sessionExists, business.loading.isInitializing]);

  const hasErrors = useMemo(() => {
    return !!(
      business.formStates.hasAnyFormErrors || business.data.validationResult?.errors?.length > 0
    );
  }, [business.formStates.hasAnyFormErrors, business.data.validationResult]);

  const canProceed = useMemo(() => {
    return !!(
      isReady &&
      !hasErrors &&
      business.ui.finalPrice > 0 &&
      !business.loading.isAnyLoading
    );
  }, [isReady, hasErrors, business.ui.finalPrice, business.loading.isAnyLoading]);

  // Повертаємо структуровані дані
  return {
    ui: business.ui,
    data: business.data,
    loading: business.loading,
    actions: business.actions,
    forms: business.forms,
    formStates: business.formStates,
    formUtils: business.formUtils,
    isReady,
    hasErrors,
    canProceed,
  };
};

/**
 * Експорт типу для використання в UI компонентах
 */
export type { UsePriceCalculationReturn };
