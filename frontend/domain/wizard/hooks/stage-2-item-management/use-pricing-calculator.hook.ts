/**
 * @fileoverview Хук калькулятора цін предметів
 * @module domain/wizard/hooks/stage-2
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { PricingCalculationService } from '../../services/stage-2-item-management';
import { useWizardStore } from '../../store';

import type { WizardOrderItem } from '../../adapters/order';
import type { WizardPriceCalculationResponse } from '../../adapters/shared';

/**
 * Деталізація розрахунку ціни
 */
interface PriceCalculationDetails {
  basePrice: number;
  modifiers: Array<{
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    amount: number;
  }>;
  subtotal: number;
  discounts: Array<{
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    amount: number;
  }>;
  finalPrice: number;
}

/**
 * Хук для розрахунку цін предметів
 * 🧮 Композиця: TanStack Query + Zustand + PricingCalculationService
 */
export const usePricingCalculator = () => {
  // 🏪 Zustand - глобальний стан
  const { addError, addWarning } = useWizardStore();

  // ⚙️ Сервіс
  const pricingService = useMemo(() => new PricingCalculationService(), []);

  // 🧮 Розрахунок ціни предмета
  const calculatePriceMutation = useMutation({
    mutationFn: (itemData: Partial<WizardOrderItem>) => {
      // Конвертуємо itemData у request формат
      const request = pricingService.createCalculationRequest(
        itemData.categoryName || '',
        itemData.itemName || '',
        itemData.quantity || 1
      );
      return pricingService.calculatePrice(request);
    },
    onError: (error) => {
      addError(`Помилка розрахунку ціни: ${error.message}`);
    },
  });

  // 📋 Завантаження базових цін для категорії
  const {
    data: basePrices = [],
    isLoading: isLoadingBasePrices,
    error: basePricesError,
  } = useQuery({
    queryKey: ['base-prices'],
    queryFn: async () => {
      // Повертаємо порожній масив для початку
      return [];
    },
    staleTime: 3600000, // 1 година кеш
    gcTime: 7200000, // 2 години в кеші
  });

  // Обробка помилки завантаження цін
  useMemo(() => {
    if (basePricesError) {
      addError(`Помилка завантаження цін: ${basePricesError.message}`);
    }
  }, [basePricesError, addError]);

  // 🧮 Методи розрахунку
  const calculatePrice = useCallback(
    async (itemData: Partial<WizardOrderItem>): Promise<PriceCalculationDetails | null> => {
      try {
        const result = await calculatePriceMutation.mutateAsync(itemData);

        if (!result) return null;

        // Конвертуємо результат у PriceCalculationDetails відповідно до реальної структури
        return {
          basePrice: result.baseUnitPrice || result.baseTotalPrice || 0,
          modifiers:
            result.calculation?.appliedModifiers?.map((mod) => ({
              name: mod.name || '',
              type: mod.type === 'PERCENTAGE' ? 'percentage' : 'fixed',
              value: mod.value || 0,
              amount: mod.appliedAmount || 0,
            })) || [],
          subtotal: result.calculation?.subtotal || result.baseTotalPrice || 0,
          discounts: [], // Розрахунки знижок будуть додані пізніше
          finalPrice: result.finalTotalPrice || result.finalUnitPrice || 0,
        };
      } catch (error) {
        addError(
          `Не вдалося розрахувати ціну: ${error instanceof Error ? error.message : 'Невідома помилка'}`
        );
        return null;
      }
    },
    [calculatePriceMutation, addError]
  );

  const calculateQuickPrice = useCallback((itemData: Partial<WizardOrderItem>): number => {
    // Швидкий розрахунок для попереднього перегляду
    return itemData.basePrice || 0;
  }, []);

  const validatePricing = useCallback(
    (itemData: Partial<WizardOrderItem>) => {
      const request = pricingService.createCalculationRequest(
        itemData.categoryName || '',
        itemData.itemName || '',
        itemData.quantity || 1
      );
      return pricingService.validateCalculationRequest(request);
    },
    [pricingService]
  );

  // 🔍 Утиліти для модифікаторів
  const getAvailableModifiers = useCallback(
    (categoryId: string, itemData: Partial<WizardOrderItem>) => {
      // Базовий список модифікаторів (буде розширено)
      return [];
    },
    []
  );

  const getModifierImpact = useCallback(
    (modifierId: string, basePrice: number) => {
      return pricingService.calculatePercentage(basePrice, basePrice);
    },
    [pricingService]
  );

  // 📊 Інформація про ціноутворення
  const pricingInfo = useMemo(
    () => ({
      hasBasePrices: Array.isArray(basePrices) && basePrices.length > 0,
      isCalculating: calculatePriceMutation.isPending,
      hasCalculationError: !!calculatePriceMutation.error,
      canCalculate: Array.isArray(basePrices) && !isLoadingBasePrices,
    }),
    [
      basePrices,
      calculatePriceMutation.isPending,
      calculatePriceMutation.error,
      isLoadingBasePrices,
    ]
  );

  // 🔧 Додаткові утиліти
  const formatPrice = useCallback(
    (price: number): string => {
      return pricingService.formatPrice(price);
    },
    [pricingService]
  );

  const formatPriceModifier = useCallback(
    (modifier: { type: 'percentage' | 'fixed'; value: number }): string => {
      if (modifier.type === 'percentage') {
        return `${modifier.value > 0 ? '+' : ''}${modifier.value}%`;
      }
      return formatPrice(modifier.value);
    },
    [formatPrice]
  );

  return {
    // 📋 Стан даних
    basePrices,
    isLoadingBasePrices,
    basePricesError,

    // 📊 Інформація
    pricingInfo,

    // 🧮 Методи розрахунку
    calculatePrice,
    calculateQuickPrice,
    validatePricing,

    // 🔍 Утиліти модифікаторів
    getAvailableModifiers,
    getModifierImpact,

    // 🔧 Форматування
    formatPrice,
    formatPriceModifier,
  };
};
