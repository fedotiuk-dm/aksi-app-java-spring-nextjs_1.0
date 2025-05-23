/**
 * Спеціалізований хук для розрахунку цін
 * Надає розширену функціональність для калькулятора цін з валідацією та оптимізацією
 */

import { useState, useCallback, useMemo, useEffect } from 'react';

import { PricingRepositoryFactory } from '../repositories/pricing.repository';
import { priceCalculationRequestSchema } from '../schemas/pricing.schema';
import { usePriceCalculationStore, usePriceListStore } from '../store/pricing.store';

import type {
  PriceCalculationRequest,
  PriceCalculationResponse,
  ServiceCategoryCode,
  ModifierCode,
  PriceModifier,
  ValidationResult,
} from '../types/pricing.types';

/**
 * Конфігурація для калькулятора
 */
interface PriceCalculatorConfig {
  autoCalculate?: boolean; // Автоматичний розрахунок при зміні параметрів
  debounceMs?: number; // Затримка для debounce
  cacheResults?: boolean; // Кешування результатів
  validateOnChange?: boolean; // Валідація при зміні
}

/**
 * Стан калькулятора
 */
interface PriceCalculatorState {
  categoryCode: ServiceCategoryCode | '';
  itemName: string;
  quantity: number;
  color: string;
  selectedModifiers: ModifierCode[];
  stains: string[];
  defects: string[];
  isUrgent: boolean;
  urgencyLevel: number;
  discountType: string;
  discountValue: number;
}

/**
 * Хук для роботи з калькулятором цін
 */
export const usePriceCalculator = (config: PriceCalculatorConfig = {}) => {
  const {
    autoCalculate = false,
    debounceMs = 500,
    cacheResults = true,
    validateOnChange = true,
  } = config;

  // Отримуємо стан зі сторів
  const calculationStore = usePriceCalculationStore();
  const priceListStore = usePriceListStore();
  const repository = PricingRepositoryFactory.getInstance();

  // Локальний стан калькулятора
  const [calculatorState, setCalculatorState] = useState<PriceCalculatorState>({
    categoryCode: '',
    itemName: '',
    quantity: 1,
    color: '',
    selectedModifiers: [],
    stains: [],
    defects: [],
    isUrgent: false,
    urgencyLevel: 0,
    discountType: '',
    discountValue: 0,
  });

  // Стан валідації
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
  });

  // Кеш для результатів
  const [calculationCache, setCalculationCache] = useState<Map<string, PriceCalculationResponse>>(
    new Map()
  );

  // Рекомендовані модифікатори
  const [recommendedModifiers, setRecommendedModifiers] = useState<PriceModifier[]>([]);
  const [riskWarnings, setRiskWarnings] = useState<string[]>([]);

  /**
   * Валідація поточного стану
   */
  const validateCalculatorState = useCallback((): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Базова валідація
    if (!calculatorState.categoryCode) {
      errors.push('Оберіть категорію послуги');
    }

    if (!calculatorState.itemName.trim()) {
      errors.push('Введіть назву предмета');
    }

    if (calculatorState.quantity <= 0) {
      errors.push('Кількість повинна бути більше 0');
    }

    if (calculatorState.isUrgent && calculatorState.urgencyLevel === 0) {
      warnings.push('Для термінового замовлення рекомендується вказати рівень терміновості');
    }

    if (calculatorState.discountType && calculatorState.discountValue === 0) {
      warnings.push('Вказано тип знижки, але не вказано її значення');
    }

    // Валідація через Zod схему
    try {
      const request: PriceCalculationRequest = {
        categoryCode: calculatorState.categoryCode as ServiceCategoryCode,
        itemName: calculatorState.itemName,
        quantity: calculatorState.quantity,
        color: calculatorState.color || undefined,
        selectedModifiers: calculatorState.selectedModifiers,
        stains: calculatorState.stains,
        defects: calculatorState.defects,
        isUrgent: calculatorState.isUrgent,
        urgencyLevel: calculatorState.urgencyLevel || undefined,
        discountType: calculatorState.discountType || undefined,
        discountValue: calculatorState.discountValue || undefined,
      };

      const validationResult = priceCalculationRequestSchema.safeParse(request);
      if (!validationResult.success) {
        errors.push(...validationResult.error.errors.map((e) => e.message));
      }
    } catch {
      errors.push('Помилка валідації даних');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }, [calculatorState]);

  /**
   * Створити ключ для кешування
   */
  const createCacheKey = useCallback((request: PriceCalculationRequest): string => {
    return JSON.stringify(request);
  }, []);

  /**
   * Отримати розрахунок з кешу
   */
  const getCachedCalculation = useCallback(
    (request: PriceCalculationRequest): PriceCalculationResponse | undefined => {
      if (!cacheResults) return undefined;
      const key = createCacheKey(request);
      return calculationCache.get(key);
    },
    [cacheResults, createCacheKey, calculationCache]
  );

  /**
   * Зберегти розрахунок в кеш
   */
  const setCachedCalculation = useCallback(
    (request: PriceCalculationRequest, response: PriceCalculationResponse) => {
      if (!cacheResults) return;
      const key = createCacheKey(request);
      setCalculationCache((prev) => new Map(prev).set(key, response));
    },
    [cacheResults, createCacheKey]
  );

  /**
   * Розрахувати ціну
   */
  const calculatePrice = useCallback(async (): Promise<void> => {
    const validation = validateCalculatorState();
    setValidationResult(validation);

    if (!validation.isValid) {
      return;
    }

    const request: PriceCalculationRequest = {
      categoryCode: calculatorState.categoryCode as ServiceCategoryCode,
      itemName: calculatorState.itemName,
      quantity: calculatorState.quantity,
      color: calculatorState.color || undefined,
      selectedModifiers: calculatorState.selectedModifiers,
      stains: calculatorState.stains,
      defects: calculatorState.defects,
      isUrgent: calculatorState.isUrgent,
      urgencyLevel: calculatorState.urgencyLevel || undefined,
      discountType: calculatorState.discountType || undefined,
      discountValue: calculatorState.discountValue || undefined,
    };

    // Перевіряємо кеш
    const cachedResult = getCachedCalculation(request);
    if (cachedResult) {
      usePriceCalculationStore.setState({
        currentRequest: request,
        currentResponse: cachedResult,
        isCalculating: false,
      });
      return;
    }

    try {
      await calculationStore.calculatePrice(request);

      // Зберігаємо в кеш
      if (calculationStore.currentResponse) {
        setCachedCalculation(request, calculationStore.currentResponse);
      }
    } catch (error) {
      console.error('Помилка розрахунку ціни:', error);
    }
  }, [
    calculatorState,
    validateCalculatorState,
    getCachedCalculation,
    setCachedCalculation,
    calculationStore,
  ]);

  /**
   * Завантажити рекомендації
   */
  const loadRecommendations = useCallback(async () => {
    if (!calculatorState.categoryCode) return;

    try {
      const [modifiers, warnings] = await Promise.all([
        repository.getRecommendedModifiers({
          stains: calculatorState.stains,
          defects: calculatorState.defects,
          categoryCode: calculatorState.categoryCode as ServiceCategoryCode,
        }),
        repository.getRiskWarnings({
          stains: calculatorState.stains,
          defects: calculatorState.defects,
          categoryCode: calculatorState.categoryCode as ServiceCategoryCode,
        }),
      ]);

      setRecommendedModifiers(modifiers);
      setRiskWarnings(warnings);
    } catch (error) {
      console.error('Помилка завантаження рекомендацій:', error);
    }
  }, [calculatorState.categoryCode, calculatorState.stains, calculatorState.defects, repository]);

  /**
   * Оновити стан калькулятора
   */
  const updateCalculatorState = useCallback((updates: Partial<PriceCalculatorState>) => {
    setCalculatorState((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Скинути калькулятор
   */
  const resetCalculator = useCallback(() => {
    setCalculatorState({
      categoryCode: '',
      itemName: '',
      quantity: 1,
      color: '',
      selectedModifiers: [],
      stains: [],
      defects: [],
      isUrgent: false,
      urgencyLevel: 0,
      discountType: '',
      discountValue: 0,
    });
    setValidationResult({ isValid: true, errors: [], warnings: [] });
    calculationStore.clearCalculation();
  }, [calculationStore]);

  /**
   * Додати модифікатор
   */
  const addModifier = useCallback((modifierCode: ModifierCode) => {
    setCalculatorState((prev) => ({
      ...prev,
      selectedModifiers: [
        ...prev.selectedModifiers.filter((m) => m !== modifierCode),
        modifierCode,
      ],
    }));
  }, []);

  /**
   * Видалити модифікатор
   */
  const removeModifier = useCallback((modifierCode: ModifierCode) => {
    setCalculatorState((prev) => ({
      ...prev,
      selectedModifiers: prev.selectedModifiers.filter((m) => m !== modifierCode),
    }));
  }, []);

  /**
   * Переключити модифікатор
   */
  const toggleModifier = useCallback((modifierCode: ModifierCode) => {
    setCalculatorState((prev) => {
      const isSelected = prev.selectedModifiers.includes(modifierCode);
      return {
        ...prev,
        selectedModifiers: isSelected
          ? prev.selectedModifiers.filter((m) => m !== modifierCode)
          : [...prev.selectedModifiers, modifierCode],
      };
    });
  }, []);

  // Валідація при зміні стану
  useEffect(() => {
    if (validateOnChange) {
      const validation = validateCalculatorState();
      setValidationResult(validation);
    }
  }, [calculatorState, validateOnChange, validateCalculatorState]);

  // Автоматичний розрахунок при зміні стану
  useEffect(() => {
    if (autoCalculate && validationResult.isValid) {
      const timeoutId = setTimeout(calculatePrice, debounceMs);
      return () => clearTimeout(timeoutId);
    }
  }, [calculatorState, autoCalculate, validationResult.isValid, calculatePrice, debounceMs]);

  // Завантаження рекомендацій при зміні параметрів
  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  // Мемоізовані селектори
  const availableItems = useMemo(() => {
    if (!calculatorState.categoryCode) return [];
    return priceListStore.items[calculatorState.categoryCode] || [];
  }, [calculatorState.categoryCode, priceListStore.items]);

  const availableModifiers = useMemo(() => {
    if (!calculatorState.categoryCode) return [];
    // Тут можна додати логіку фільтрації модифікаторів по категорії
    return Object.values(priceListStore.modifiers).flat();
  }, [calculatorState.categoryCode, priceListStore.modifiers]);

  return {
    // Стан
    calculatorState,
    validationResult,
    recommendedModifiers,
    riskWarnings,

    // Дані
    availableItems,
    availableModifiers,
    currentCalculation: calculationStore.currentResponse,
    isCalculating: calculationStore.isCalculating,

    // Дії
    updateCalculatorState,
    calculatePrice,
    resetCalculator,
    addModifier,
    removeModifier,
    toggleModifier,
    loadRecommendations,

    // Утиліти
    utils: {
      isValid: validationResult.isValid,
      hasErrors: validationResult.errors.length > 0,
      hasWarnings: validationResult.warnings.length > 0,
      canCalculate:
        validationResult.isValid && !!calculatorState.categoryCode && !!calculatorState.itemName,
      clearCache: () => setCalculationCache(new Map()),
    },
  };
};

export default usePriceCalculator;
