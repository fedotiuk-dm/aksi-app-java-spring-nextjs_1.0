/**
 * Хук для розрахунку цін
 * Обчислює вартість послуг з урахуванням модифікаторів, знижок та бізнес-правил
 */

import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { PricingService } from '../services/pricing.service';
import { usePricingStore } from '../store/pricing.store';
import { PricingCalculator } from '../utils/pricing.calculator';
import { PricingValidator } from '../utils/pricing.validator';

import type {
  PriceListItem,
  PriceModifier,
  PriceCalculationParams,
  PriceCalculationResult,
  ServiceCategory,
} from '../types';

/**
 * Параметри для групового розрахунку
 */
interface BulkCalculationItem {
  params: PriceCalculationParams;
  modifiers?: PriceModifier[];
}

/**
 * Опції для хука розрахунку цін
 */
interface UsePriceCalculationOptions {
  autoCalculate?: boolean;
  enableValidation?: boolean;
  enableHistory?: boolean;
  maxHistoryItems?: number;
}

export const usePriceCalculation = (options: UsePriceCalculationOptions = {}) => {
  const {
    autoCalculate = true,
    enableValidation = true,
    enableHistory = true,
    maxHistoryItems = 50,
  } = options;

  // Store state
  const {
    selectedModifiers,
    currentCalculation,
    calculationHistory,
    isCalculating,
    calculationError,
    setCurrentCalculation,
    addToCalculationHistory,
    setIsCalculating,
    setCalculationError,
  } = usePricingStore();

  // Local state
  const [calculationParams, setCalculationParams] = useState<PriceCalculationParams | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // === MUTATIONS ===

  /**
   * Розрахунок ціни для одного предмета
   */
  const calculatePriceMutation = useMutation({
    mutationFn: async ({
      params,
      modifiers = selectedModifiers,
    }: {
      params: PriceCalculationParams;
      modifiers?: PriceModifier[];
    }) => {
      setIsCalculating(true);
      setCalculationError(null);

      // Валідація параметрів
      if (enableValidation) {
        const validation = PricingValidator.validateCalculationParams(params);
        if (!validation.valid) {
          throw new Error(`Помилки валідації: ${validation.errors.join(', ')}`);
        }
      }

      // Розрахунок ціни
      return PricingCalculator.calculatePrice(params, modifiers);
    },
    onSuccess: (result) => {
      setCurrentCalculation(result);

      if (enableHistory) {
        addToCalculationHistory(result);
      }

      setCalculationError(null);
      setIsCalculating(false);
    },
    onError: (error) => {
      setCalculationError(error instanceof Error ? error.message : 'Помилка розрахунку ціни');
      setIsCalculating(false);
    },
  });

  /**
   * Груповий розрахунок цін
   */
  const calculateBulkPricesMutation = useMutation({
    mutationFn: async (items: BulkCalculationItem[]) => {
      setIsCalculating(true);
      setCalculationError(null);

      const result = PricingService.calculateBulkPrices(items);

      if (!result.success) {
        throw new Error(result.errors?.general || 'Помилка групового розрахунку');
      }

      return result.data;
    },
    onSuccess: (result) => {
      // Додаємо всі розрахунки до історії
      if (enableHistory && result.results) {
        result.results.forEach((calc: PriceCalculationResult) => {
          addToCalculationHistory(calc);
        });
      }

      setCalculationError(null);
      setIsCalculating(false);
    },
    onError: (error) => {
      setCalculationError(error instanceof Error ? error.message : 'Помилка групового розрахунку');
      setIsCalculating(false);
    },
  });

  /**
   * Порівняння цін з різними наборами модифікаторів
   */
  const comparePricesMutation = useMutation({
    mutationFn: async ({
      params,
      modifierSets,
    }: {
      params: PriceCalculationParams;
      modifierSets: PriceModifier[][];
    }) => {
      const result = PricingService.comparePriceOptions(params, modifierSets);

      if (!result.success) {
        throw new Error(result.errors?.calculation?.[0] || 'Помилка порівняння цін');
      }

      return result.data;
    },
    onError: (error) => {
      setCalculationError(error instanceof Error ? error.message : 'Помилка порівняння цін');
    },
  });

  // === COMPUTED VALUES ===

  /**
   * Доступні модифікатори для поточного предмета
   */
  const availableModifiers = useMemo(() => {
    if (!calculationParams) return [];

    return PricingService.getApplicableModifiers(
      calculationParams.priceListItem,
      selectedModifiers
    );
  }, [calculationParams, selectedModifiers]);

  /**
   * Рекомендовані модифікатори
   */
  const recommendedModifiers = useMemo(() => {
    if (!calculationParams) return [];

    return PricingService.getRecommendedModifiers(
      calculationParams.priceListItem,
      calculationParams,
      selectedModifiers
    );
  }, [calculationParams, selectedModifiers]);

  /**
   * Валідація поточних параметрів
   */
  const currentValidation = useMemo(() => {
    if (!calculationParams || !enableValidation) return { valid: true, errors: [] };

    return PricingValidator.validateCalculationParams(calculationParams);
  }, [calculationParams, enableValidation]);

  /**
   * Чи можна розрахувати ціну
   */
  const canCalculate = useMemo(() => {
    return calculationParams !== null && currentValidation.valid;
  }, [calculationParams, currentValidation]);

  /**
   * Швидкий розрахунок ціни без збереження (для попереднього перегляду)
   */
  const previewCalculation = useMemo(() => {
    if (!calculationParams || !canCalculate) return null;

    try {
      return PricingCalculator.calculatePrice(calculationParams, selectedModifiers);
    } catch (error) {
      return null;
    }
  }, [calculationParams, selectedModifiers, canCalculate]);

  /**
   * Статистика розрахунків
   */
  const calculationStats = useMemo(() => {
    if (!enableHistory || calculationHistory.length === 0) {
      return {
        totalCalculations: 0,
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
        lastCalculation: null,
      };
    }

    const prices = calculationHistory.map((calc) => calc.finalPrice);

    return {
      totalCalculations: calculationHistory.length,
      averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      lastCalculation: calculationHistory[0],
    };
  }, [calculationHistory, enableHistory]);

  // === METHODS ===

  /**
   * Встановлює параметри розрахунку
   */
  const setParams = useCallback(
    (params: PriceCalculationParams | null) => {
      setCalculationParams(params);
      setValidationErrors([]);

      // Автоматичний розрахунок
      if (autoCalculate && params && enableValidation) {
        const validation = PricingValidator.validateCalculationParams(params);
        if (validation.valid) {
          calculatePriceMutation.mutate({ params });
        } else {
          setValidationErrors(validation.errors);
        }
      }
    },
    [autoCalculate, enableValidation, calculatePriceMutation]
  );

  /**
   * Розрахунок ціни з користувацькими модифікаторами
   */
  const calculateWithModifiers = useCallback(
    (params: PriceCalculationParams, modifiers: PriceModifier[]) => {
      calculatePriceMutation.mutate({ params, modifiers });
    },
    [calculatePriceMutation]
  );

  /**
   * Швидкий розрахунок терміновості
   */
  const calculateUrgencyPrice = useCallback(
    (basePrice: number, urgencyLevel: 'standard' | '48h' | '24h') => {
      return PricingCalculator.calculateUrgencyPrice(basePrice, urgencyLevel);
    },
    []
  );

  /**
   * Швидкий розрахунок дитячої знижки
   */
  const calculateChildDiscount = useCallback((basePrice: number, size?: string) => {
    return PricingCalculator.calculateChildDiscount(basePrice, size);
  }, []);

  /**
   * Валідація бізнес-правил для знижок
   */
  const validateDiscountRules = useCallback(
    (category: ServiceCategory, discountPercentage: number) => {
      return PricingValidator.validateDiscountRules(category, discountPercentage);
    },
    []
  );

  /**
   * Перевірка можливості застосування модифікатора
   */
  const canApplyModifier = useCallback(
    (modifier: PriceModifier, params: PriceCalculationParams, orderAmount?: number) => {
      return PricingValidator.canApplyModifier(modifier, params, orderAmount);
    },
    []
  );

  /**
   * Очищення поточного розрахунку
   */
  const clearCalculation = useCallback(() => {
    setCurrentCalculation(null);
    setCalculationParams(null);
    setValidationErrors([]);
    setCalculationError(null);
  }, [setCurrentCalculation, setCalculationError]);

  /**
   * Повторний розрахунок з поточними параметрами
   */
  const recalculate = useCallback(() => {
    if (calculationParams) {
      calculatePriceMutation.mutate({ params: calculationParams });
    }
  }, [calculationParams, calculatePriceMutation]);

  return {
    // Current calculation data
    currentCalculation,
    calculationParams,
    previewCalculation,

    // Modifiers
    availableModifiers,
    recommendedModifiers,
    selectedModifiers,

    // Validation
    currentValidation,
    validationErrors,
    canCalculate,

    // Loading states
    isCalculating: isCalculating || calculatePriceMutation.isPending,
    isBulkCalculating: calculateBulkPricesMutation.isPending,
    isComparing: comparePricesMutation.isPending,
    calculationError,

    // History and stats
    calculationHistory,
    calculationStats,

    // Methods
    setParams,
    calculatePrice: calculatePriceMutation.mutate,
    calculateWithModifiers,
    calculateBulkPrices: calculateBulkPricesMutation.mutate,
    comparePrices: comparePricesMutation.mutate,

    // Quick calculations
    calculateUrgencyPrice,
    calculateChildDiscount,

    // Validation methods
    validateDiscountRules,
    canApplyModifier,

    // Utility methods
    clearCalculation,
    recalculate,
    reset: () => {
      clearCalculation();
      calculatePriceMutation.reset();
      calculateBulkPricesMutation.reset();
      comparePricesMutation.reset();
    },
  };
};
