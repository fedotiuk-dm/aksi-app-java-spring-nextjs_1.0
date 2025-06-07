/**
 * @fileoverview Хук для управління модифікаторами цін та розрахунком вартості
 *
 * Відповідальність:
 * - Вибір модифікаторів цін
 * - Автоматичний розрахунок вартості
 * - Деталізація впливу модифікаторів
 */

import { useState, useCallback, useMemo } from 'react';

import { useGetAllModifiers, useCalculatePrice } from '@/shared/api/generated/full/aksiApi';

import type { ItemPricing, UseItemPricingReturn } from './types';
import type {
  PriceModifierDTO,
  PriceCalculationRequestDTO,
  PriceCalculationResponseDTO,
} from '@/shared/api/generated/full/aksiApi.schemas';

/**
 * Хук для управління модифікаторами цін та розрахунком вартості
 *
 * @example
 * ```tsx
 * const {
 *   pricing,
 *   availableModifiers,
 *   toggleModifier,
 *   calculatePrice
 * } = useItemPricing();
 *
 * // Додати/прибрати модифікатор
 * toggleModifier(modifier);
 *
 * // Розрахувати ціну
 * await calculatePrice(calculationRequest);
 * ```
 */
export function useItemPricing(): UseItemPricingReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [pricing, setPricing] = useState<ItemPricing>({
    modifiers: [],
    basePrice: 0,
    finalPrice: 0,
  });

  const [calculationError, setCalculationError] = useState<string | null>(null);

  // =====================================
  // API запити
  // =====================================

  // Модифікатори цін
  const {
    data: modifiersData,
    isLoading: isLoadingModifiers,
    error: modifiersError,
  } = useGetAllModifiers({
    query: {
      staleTime: 15 * 60 * 1000, // 15 хвилин кеш
      gcTime: 30 * 60 * 1000, // 30 хвилин в кеші
    },
  });

  // Мутація для розрахунку ціни
  const {
    mutateAsync: calculatePriceMutation,
    isPending: isCalculating,
    error: calculationMutationError,
  } = useCalculatePrice();

  // =====================================
  // Обробка даних
  // =====================================

  const availableModifiers = useMemo(() => {
    if (!modifiersData) return [];
    return Array.isArray(modifiersData) ? modifiersData : [modifiersData];
  }, [modifiersData]);

  // =====================================
  // Обробка помилок
  // =====================================

  useMemo(() => {
    if (modifiersError) {
      setCalculationError('Помилка завантаження модифікаторів');
    } else if (calculationMutationError) {
      setCalculationError('Помилка розрахунку ціни');
    } else {
      setCalculationError(null);
    }
  }, [modifiersError, calculationMutationError]);

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Додати/прибрати модифікатор
   */
  const toggleModifier = useCallback((modifier: PriceModifierDTO) => {
    setPricing((prev) => {
      const existingIndex = prev.modifiers.findIndex((m) => m.name === modifier.name);

      if (existingIndex >= 0) {
        // Прибираємо модифікатор
        return {
          ...prev,
          modifiers: prev.modifiers.filter((m) => m.name !== modifier.name),
        };
      } else {
        // Додаємо модифікатор
        return {
          ...prev,
          modifiers: [...prev.modifiers, modifier],
        };
      }
    });
  }, []);

  /**
   * Розрахувати ціну предмета
   */
  const calculatePrice = useCallback(
    async (request: PriceCalculationRequestDTO) => {
      try {
        setCalculationError(null);

        const response = await calculatePriceMutation({ data: request });

        if (response) {
          setPricing((prev) => ({
            ...prev,
            basePrice: response.baseTotalPrice || 0,
            finalPrice: response.finalTotalPrice || 0,
            calculation: response,
          }));
        }
      } catch (error) {
        console.error('Помилка розрахунку ціни:', error);
        setCalculationError('Не вдалося розрахувати ціну');
      }
    },
    [calculatePriceMutation]
  );

  /**
   * Очистити всі дані про ціну
   */
  const clearPricing = useCallback(() => {
    setPricing({
      modifiers: [],
      basePrice: 0,
      finalPrice: 0,
    });
    setCalculationError(null);
  }, []);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    pricing,
    availableModifiers,
    isLoadingModifiers,
    isCalculating,
    calculationError,

    // Дії
    toggleModifier,
    calculatePrice,
    clearPricing,
  };
}
