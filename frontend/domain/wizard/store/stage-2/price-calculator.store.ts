/**
 * @fileoverview Price Calculator Slice Store - Zustand store для розрахунку цін предметів
 * @module domain/wizard/store/stage-2
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { OrderItemData } from '../../types';

/**
 * Типи цінових модифікаторів
 */
export enum PriceModifierType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  MULTIPLIER = 'MULTIPLIER',
}

/**
 * Інтерфейс цінового модифікатора
 */
interface PriceModifier {
  id: string;
  name: string;
  type: PriceModifierType;
  value: number;
  isApplicable: boolean;
  description: string;
  categoryRestrictions?: string[];
}

/**
 * Інтерфейс деталізованого розрахунку
 */
interface PriceCalculationDetail {
  stepName: string;
  description: string;
  baseAmount: number;
  modifierValue: number;
  resultAmount: number;
  appliedModifiers: string[];
}

/**
 * Стан калькулятора цін
 */
interface PriceCalculatorState {
  // Current item calculation
  currentItemId: string | null;
  basePrice: number;
  calculatedPrice: number;
  finalPrice: number;

  // Available modifiers
  availableModifiers: PriceModifier[];
  appliedModifiers: PriceModifier[];

  // Calculation details
  calculationSteps: PriceCalculationDetail[];
  isCalculationDetailed: boolean;

  // Price loading states
  isPriceLoading: boolean;
  priceCalculationError: string | null;

  // Batch calculation
  batchCalculationItems: string[];
  isBatchCalculating: boolean;
  batchCalculationResults: Record<string, number>;

  // Cache
  priceCache: Record<string, { price: number; modifiers: string[]; timestamp: Date }>;
  cacheExpiryMinutes: number;
}

/**
 * Дії калькулятора цін
 */
interface PriceCalculatorActions {
  // Current item calculation
  setCurrentItemId: (itemId: string | null) => void;
  setBasePrice: (price: number) => void;
  calculateItemPrice: (item: OrderItemData) => Promise<number>;
  recalculatePrice: () => void;

  // Modifiers management
  setAvailableModifiers: (modifiers: PriceModifier[]) => void;
  addAppliedModifier: (modifier: PriceModifier) => void;
  removeAppliedModifier: (modifierId: string) => void;
  clearAppliedModifiers: () => void;
  toggleModifier: (modifierId: string) => void;

  // Calculation details
  setCalculationDetailed: (detailed: boolean) => void;
  addCalculationStep: (step: PriceCalculationDetail) => void;
  clearCalculationSteps: () => void;

  // Price loading states
  setPriceLoading: (loading: boolean) => void;
  setPriceCalculationError: (error: string | null) => void;

  // Batch calculation
  addToBatchCalculation: (itemId: string) => void;
  removeFromBatchCalculation: (itemId: string) => void;
  setBatchCalculating: (calculating: boolean) => void;
  processBatchCalculation: () => Promise<void>;
  setBatchCalculationResults: (results: Record<string, number>) => void;

  // Cache management
  setCacheExpiry: (minutes: number) => void;
  getCachedPrice: (cacheKey: string) => number | null;
  setCachedPrice: (cacheKey: string, price: number, modifiers: string[]) => void;
  clearPriceCache: () => void;
  cleanExpiredCache: () => void;

  // Utility actions
  generateCacheKey: (item: OrderItemData, modifiers: PriceModifier[]) => string;
  validateModifierApplicability: (modifier: PriceModifier, item: OrderItemData) => boolean;

  // Reset actions
  resetPriceCalculator: () => void;
}

/**
 * Початковий стан калькулятора цін
 */
const initialPriceCalculatorState: PriceCalculatorState = {
  currentItemId: null,
  basePrice: 0,
  calculatedPrice: 0,
  finalPrice: 0,
  availableModifiers: [],
  appliedModifiers: [],
  calculationSteps: [],
  isCalculationDetailed: false,
  isPriceLoading: false,
  priceCalculationError: null,
  batchCalculationItems: [],
  isBatchCalculating: false,
  batchCalculationResults: {},
  priceCache: {},
  cacheExpiryMinutes: 30,
};

/**
 * Price Calculator Slice Store
 *
 * Відповідальність:
 * - Розрахунок цін предметів з урахуванням модифікаторів
 * - Управління ціновими модифікаторами (знижки, надбавки)
 * - Деталізований розрахунок із кроками
 * - Кешування результатів розрахунків
 * - Пакетний розрахунок цін для кількох предметів
 * - Валідація застосовності модифікаторів
 *
 * Інтеграція:
 * - Orval типи для OrderItemData
 * - API прайс-листів та модифікаторів
 * - Сервіси складних розрахунків
 * - localStorage для кешування
 */
export const usePriceCalculatorStore = create<PriceCalculatorState & PriceCalculatorActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialPriceCalculatorState,

      // Current item calculation
      setCurrentItemId: (itemId) => {
        set({ currentItemId: itemId }, false, 'priceCalculator/setCurrentItemId');
      },

      setBasePrice: (price) => {
        set({ basePrice: price }, false, 'priceCalculator/setBasePrice');
        get().recalculatePrice();
      },

      calculateItemPrice: async (item) => {
        set(
          { isPriceLoading: true, priceCalculationError: null },
          false,
          'priceCalculator/calculateItemPrice/start'
        );

        try {
          // Перевіряємо кеш
          const cacheKey = get().generateCacheKey(item, get().appliedModifiers);
          const cachedPrice = get().getCachedPrice(cacheKey);

          if (cachedPrice !== null) {
            set({ finalPrice: cachedPrice }, false, 'priceCalculator/calculateItemPrice/cached');
            return cachedPrice;
          }

          // Тут буде API виклик для розрахунку ціни
          // const calculationResult = await calculatePrice(item, appliedModifiers);

          // Мок для демонстрації
          await new Promise((resolve) => setTimeout(resolve, 800));

          let calculatedPrice = get().basePrice;
          const steps: PriceCalculationDetail[] = [];

          // Базова ціна
          steps.push({
            stepName: 'Базова ціна',
            description: `Ціна за ${item.quantity} шт`,
            baseAmount: 0,
            modifierValue: get().basePrice,
            resultAmount: get().basePrice,
            appliedModifiers: [],
          });

          // Застосовуємо модифікатори
          for (const modifier of get().appliedModifiers) {
            if (get().validateModifierApplicability(modifier, item)) {
              const previousAmount = calculatedPrice;

              switch (modifier.type) {
                case PriceModifierType.PERCENTAGE:
                  calculatedPrice = calculatedPrice * (1 + modifier.value / 100);
                  break;
                case PriceModifierType.FIXED_AMOUNT:
                  calculatedPrice = calculatedPrice + modifier.value;
                  break;
                case PriceModifierType.MULTIPLIER:
                  calculatedPrice = calculatedPrice * modifier.value;
                  break;
              }

              steps.push({
                stepName: modifier.name,
                description: modifier.description,
                baseAmount: previousAmount,
                modifierValue: modifier.value,
                resultAmount: calculatedPrice,
                appliedModifiers: [modifier.id],
              });
            }
          }

          const finalPrice = Math.round(calculatedPrice * 100) / 100; // Округлення до копійок

          set(
            {
              calculatedPrice,
              finalPrice,
              calculationSteps: steps,
            },
            false,
            'priceCalculator/calculateItemPrice/success'
          );

          // Зберігаємо в кеш
          get().setCachedPrice(
            cacheKey,
            finalPrice,
            get().appliedModifiers.map((m) => m.id)
          );

          return finalPrice;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Помилка розрахунку ціни';
          get().setPriceCalculationError(errorMessage);
          return 0;
        } finally {
          set({ isPriceLoading: false }, false, 'priceCalculator/calculateItemPrice/complete');
        }
      },

      recalculatePrice: () => {
        const state = get();
        if (state.currentItemId && state.basePrice > 0) {
          // Тут може бути простий перерахунок без API
          const appliedModifiers = state.appliedModifiers;
          let price = state.basePrice;

          for (const modifier of appliedModifiers) {
            switch (modifier.type) {
              case PriceModifierType.PERCENTAGE:
                price = price * (1 + modifier.value / 100);
                break;
              case PriceModifierType.FIXED_AMOUNT:
                price = price + modifier.value;
                break;
              case PriceModifierType.MULTIPLIER:
                price = price * modifier.value;
                break;
            }
          }

          const finalPrice = Math.round(price * 100) / 100;
          set({ calculatedPrice: price, finalPrice }, false, 'priceCalculator/recalculatePrice');
        }
      },

      // Modifiers management
      setAvailableModifiers: (modifiers) => {
        set({ availableModifiers: modifiers }, false, 'priceCalculator/setAvailableModifiers');
      },

      addAppliedModifier: (modifier) => {
        set(
          (state) => ({
            appliedModifiers: state.appliedModifiers.find((m) => m.id === modifier.id)
              ? state.appliedModifiers
              : [...state.appliedModifiers, modifier],
          }),
          false,
          'priceCalculator/addAppliedModifier'
        );
        get().recalculatePrice();
      },

      removeAppliedModifier: (modifierId) => {
        set(
          (state) => ({
            appliedModifiers: state.appliedModifiers.filter((m) => m.id !== modifierId),
          }),
          false,
          'priceCalculator/removeAppliedModifier'
        );
        get().recalculatePrice();
      },

      clearAppliedModifiers: () => {
        set({ appliedModifiers: [] }, false, 'priceCalculator/clearAppliedModifiers');
        get().recalculatePrice();
      },

      toggleModifier: (modifierId) => {
        const state = get();
        const isApplied = state.appliedModifiers.find((m) => m.id === modifierId);

        if (isApplied) {
          get().removeAppliedModifier(modifierId);
        } else {
          const modifier = state.availableModifiers.find((m) => m.id === modifierId);
          if (modifier) {
            get().addAppliedModifier(modifier);
          }
        }
      },

      // Calculation details
      setCalculationDetailed: (detailed) => {
        set({ isCalculationDetailed: detailed }, false, 'priceCalculator/setCalculationDetailed');
      },

      addCalculationStep: (step) => {
        set(
          (state) => ({ calculationSteps: [...state.calculationSteps, step] }),
          false,
          'priceCalculator/addCalculationStep'
        );
      },

      clearCalculationSteps: () => {
        set({ calculationSteps: [] }, false, 'priceCalculator/clearCalculationSteps');
      },

      // Price loading states
      setPriceLoading: (loading) => {
        set({ isPriceLoading: loading }, false, 'priceCalculator/setPriceLoading');
      },

      setPriceCalculationError: (error) => {
        set({ priceCalculationError: error }, false, 'priceCalculator/setPriceCalculationError');
      },

      // Batch calculation
      addToBatchCalculation: (itemId) => {
        set(
          (state) => ({
            batchCalculationItems: state.batchCalculationItems.includes(itemId)
              ? state.batchCalculationItems
              : [...state.batchCalculationItems, itemId],
          }),
          false,
          'priceCalculator/addToBatchCalculation'
        );
      },

      removeFromBatchCalculation: (itemId) => {
        set(
          (state) => ({
            batchCalculationItems: state.batchCalculationItems.filter((id) => id !== itemId),
          }),
          false,
          'priceCalculator/removeFromBatchCalculation'
        );
      },

      setBatchCalculating: (calculating) => {
        set({ isBatchCalculating: calculating }, false, 'priceCalculator/setBatchCalculating');
      },

      processBatchCalculation: async () => {
        const state = get();
        if (state.batchCalculationItems.length === 0) return;

        set({ isBatchCalculating: true }, false, 'priceCalculator/processBatchCalculation/start');

        try {
          const results: Record<string, number> = {};

          // Тут буде пакетний API виклик
          // const batchResults = await calculateBatchPrices(state.batchCalculationItems);

          // Мок для демонстрації
          for (const itemId of state.batchCalculationItems) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            results[itemId] = Math.random() * 500 + 100; // Mock price
          }

          get().setBatchCalculationResults(results);
        } catch (error) {
          console.error('Batch calculation failed:', error);
        } finally {
          set(
            { isBatchCalculating: false },
            false,
            'priceCalculator/processBatchCalculation/complete'
          );
        }
      },

      setBatchCalculationResults: (results) => {
        set(
          { batchCalculationResults: results },
          false,
          'priceCalculator/setBatchCalculationResults'
        );
      },

      // Cache management
      setCacheExpiry: (minutes) => {
        set({ cacheExpiryMinutes: minutes }, false, 'priceCalculator/setCacheExpiry');
      },

      getCachedPrice: (cacheKey) => {
        const state = get();
        const cached = state.priceCache[cacheKey];

        if (!cached) return null;

        const now = new Date();
        const expiryTime = new Date(cached.timestamp.getTime() + state.cacheExpiryMinutes * 60000);

        if (now > expiryTime) {
          // Кеш застарів, видаляємо
          set(
            (state) => {
              const { [cacheKey]: removed, ...rest } = state.priceCache;
              return { priceCache: rest };
            },
            false,
            'priceCalculator/getCachedPrice/expired'
          );
          return null;
        }

        return cached.price;
      },

      setCachedPrice: (cacheKey, price, modifiers) => {
        set(
          (state) => ({
            priceCache: {
              ...state.priceCache,
              [cacheKey]: {
                price,
                modifiers,
                timestamp: new Date(),
              },
            },
          }),
          false,
          'priceCalculator/setCachedPrice'
        );
      },

      clearPriceCache: () => {
        set({ priceCache: {} }, false, 'priceCalculator/clearPriceCache');
      },

      cleanExpiredCache: () => {
        const state = get();
        const now = new Date();
        const validCache: typeof state.priceCache = {};

        for (const [key, cached] of Object.entries(state.priceCache)) {
          const expiryTime = new Date(
            cached.timestamp.getTime() + state.cacheExpiryMinutes * 60000
          );
          if (now <= expiryTime) {
            validCache[key] = cached;
          }
        }

        set({ priceCache: validCache }, false, 'priceCalculator/cleanExpiredCache');
      },

      // Utility actions
      generateCacheKey: (item, modifiers) => {
        const modifierIds = modifiers
          .map((m) => m.id)
          .sort()
          .join(',');
        return `${item.id || 'new'}_${item.category}_${item.quantity}_${modifierIds}`;
      },

      validateModifierApplicability: (modifier, item) => {
        if (!modifier.categoryRestrictions || modifier.categoryRestrictions.length === 0) {
          return true; // Модифікатор застосовується до всіх категорій
        }

        return modifier.categoryRestrictions.includes(item.category || '');
      },

      // Reset actions
      resetPriceCalculator: () => {
        set(initialPriceCalculatorState, false, 'priceCalculator/resetPriceCalculator');
      },
    }),
    {
      name: 'price-calculator-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type PriceCalculatorStore = ReturnType<typeof usePriceCalculatorStore>;
