/**
 * Zustand сторі для управління станом домену Pricing
 * Включає стан прайс-листа, модифікаторів, розрахунків та кешування
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { PricingRepositoryFactory } from '../repositories/pricing.repository';
import { priceCalculationRequestSchema } from '../schemas/pricing.schema';
import { ModifierCategory } from '../types/pricing.types';

import type {
  PriceListState,
  PriceCalculationState,
  PriceListActions,
  PriceCalculationActions,
  PriceCalculationRequest,
  ServiceCategoryCode,
} from '../types/pricing.types';

// ============= ТИПИ ДЛЯ СТОРІВ =============

/**
 * Комбінований стан для прайс-листа
 */
interface PriceListStore extends PriceListState, PriceListActions {}

/**
 * Комбінований стан для розрахунку цін
 */
interface PriceCalculationStore extends PriceCalculationState, PriceCalculationActions {}

// ============= СТОР ПРАЙС-ЛИСТА =============

/**
 * Стор для управління прайс-листом, категоріями та модифікаторами
 */
export const usePriceListStore = create<PriceListStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // ============= СТАН =============
      items: {},
      categories: [],
      modifiers: {
        [ModifierCategory.GENERAL]: [],
        [ModifierCategory.TEXTILE]: [],
        [ModifierCategory.LEATHER]: [],
      },
      stainTypes: [],
      defectTypes: [],
      isLoading: false,
      lastUpdated: undefined,
      errors: {},

      // ============= ДІЇ =============

      /**
       * Завантажити категорії послуг
       */
      loadCategories: async () => {
        const repository = PricingRepositoryFactory.getInstance();

        set((state) => {
          state.isLoading = true;
          delete state.errors.categories;
        });

        try {
          const categories = await repository.getActiveServiceCategories();

          set((state) => {
            state.categories = categories;
            state.lastUpdated = new Date();
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.errors.categories =
              error instanceof Error ? error.message : 'Помилка завантаження категорій';
            state.isLoading = false;
          });
        }
      },

      /**
       * Завантажити елементи прайс-листа для категорії
       */
      loadPriceListItems: async (categoryCode: ServiceCategoryCode) => {
        const repository = PricingRepositoryFactory.getInstance();

        set((state) => {
          state.isLoading = true;
          delete state.errors[`items_${categoryCode}`];
        });

        try {
          const items = await repository.getPriceListItemsByCategory(categoryCode);

          set((state) => {
            state.items[categoryCode] = items;
            state.lastUpdated = new Date();
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.errors[`items_${categoryCode}`] =
              error instanceof Error ? error.message : 'Помилка завантаження прайс-листа';
            state.isLoading = false;
          });
        }
      },

      /**
       * Завантажити модифікатори за категорією
       */
      loadModifiers: async (category: ModifierCategory) => {
        const repository = PricingRepositoryFactory.getInstance();

        set((state) => {
          state.isLoading = true;
          delete state.errors[`modifiers_${category}`];
        });

        try {
          const modifiers = await repository.getModifiersByCategory(category);

          set((state) => {
            state.modifiers[category] = modifiers;
            state.lastUpdated = new Date();
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.errors[`modifiers_${category}`] =
              error instanceof Error ? error.message : 'Помилка завантаження модифікаторів';
            state.isLoading = false;
          });
        }
      },

      /**
       * Завантажити типи забруднень
       */
      loadStainTypes: async () => {
        const repository = PricingRepositoryFactory.getInstance();

        set((state) => {
          state.isLoading = true;
          delete state.errors.stainTypes;
        });

        try {
          const stainTypes = await repository.getStainTypes(true);

          set((state) => {
            state.stainTypes = stainTypes;
            state.lastUpdated = new Date();
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.errors.stainTypes =
              error instanceof Error ? error.message : 'Помилка завантаження типів забруднень';
            state.isLoading = false;
          });
        }
      },

      /**
       * Завантажити типи дефектів
       */
      loadDefectTypes: async () => {
        const repository = PricingRepositoryFactory.getInstance();

        set((state) => {
          state.isLoading = true;
          delete state.errors.defectTypes;
        });

        try {
          const defectTypes = await repository.getDefectTypes(true);

          set((state) => {
            state.defectTypes = defectTypes;
            state.lastUpdated = new Date();
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.errors.defectTypes =
              error instanceof Error ? error.message : 'Помилка завантаження типів дефектів';
            state.isLoading = false;
          });
        }
      },

      /**
       * Оновити кеш
       */
      refreshCache: async () => {
        const { loadCategories, loadStainTypes, loadDefectTypes } = get();

        set((state) => {
          state.items = {};
          state.modifiers = {
            [ModifierCategory.GENERAL]: [],
            [ModifierCategory.TEXTILE]: [],
            [ModifierCategory.LEATHER]: [],
          };
          state.errors = {};
        });

        await Promise.all([loadCategories(), loadStainTypes(), loadDefectTypes()]);
      },

      /**
       * Очистити помилки
       */
      clearErrors: () => {
        set((state) => {
          state.errors = {};
        });
      },
    }))
  )
);

// ============= СТОР РОЗРАХУНКУ ЦІН =============

/**
 * Стор для управління розрахунками цін
 */
export const usePriceCalculationStore = create<PriceCalculationStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // ============= СТАН =============
      currentRequest: undefined,
      currentResponse: undefined,
      isCalculating: false,
      calculationHistory: [],
      errors: {},

      // ============= ДІЇ =============

      /**
       * Розрахувати ціну
       */
      calculatePrice: async (request: PriceCalculationRequest) => {
        const repository = PricingRepositoryFactory.getInstance();

        // Валідація запиту
        const validationResult = priceCalculationRequestSchema.safeParse(request);
        if (!validationResult.success) {
          set((state) => {
            state.errors.validation = validationResult.error.errors
              .map((e) => e.message)
              .join(', ');
          });
          return;
        }

        set((state) => {
          state.isCalculating = true;
          state.currentRequest = request;
          delete state.errors.calculation;
        });

        try {
          const response = await repository.calculatePrice(request);

          set((state) => {
            state.currentResponse = response;
            state.isCalculating = false;
          });
        } catch (error) {
          set((state) => {
            state.errors.calculation =
              error instanceof Error ? error.message : 'Помилка розрахунку ціни';
            state.isCalculating = false;
          });
        }
      },

      /**
       * Очистити поточний розрахунок
       */
      clearCalculation: () => {
        set((state) => {
          state.currentRequest = undefined;
          state.currentResponse = undefined;
          state.errors = {};
        });
      },

      /**
       * Зберегти розрахунок в історію
       */
      saveCalculationToHistory: () => {
        const { currentResponse } = get();

        if (currentResponse) {
          set((state) => {
            state.calculationHistory.unshift(currentResponse);
            // Зберігаємо тільки останні 10 розрахунків
            if (state.calculationHistory.length > 10) {
              state.calculationHistory = state.calculationHistory.slice(0, 10);
            }
          });
        }
      },

      /**
       * Очистити історію розрахунків
       */
      clearHistory: () => {
        set((state) => {
          state.calculationHistory = [];
        });
      },

      /**
       * Очистити помилки
       */
      clearErrors: () => {
        set((state) => {
          state.errors = {};
        });
      },
    }))
  )
);

// ============= СЕЛЕКТОРИ =============

/**
 * Селектори для зручного доступу до даних
 */
export const pricingSelectors = {
  // Прайс-лист
  getCategoriesByActive: (active: boolean = true) =>
    usePriceListStore.getState().categories.filter((category) => category.active === active),

  getPriceListItemsByCategory: (categoryCode: ServiceCategoryCode) =>
    usePriceListStore.getState().items[categoryCode] || [],

  getModifiersByCategory: (category: ModifierCategory) =>
    usePriceListStore.getState().modifiers[category] || [],

  getActiveStainTypes: () =>
    usePriceListStore.getState().stainTypes.filter((stain) => stain.active),

  getActiveDefectTypes: () =>
    usePriceListStore.getState().defectTypes.filter((defect) => defect.active),

  // Розрахунки
  getCurrentCalculation: () => ({
    request: usePriceCalculationStore.getState().currentRequest,
    response: usePriceCalculationStore.getState().currentResponse,
  }),

  getCalculationHistory: () => usePriceCalculationStore.getState().calculationHistory,

  hasCalculationErrors: () => Object.keys(usePriceCalculationStore.getState().errors).length > 0,

  // Загальні
  isLoading: () =>
    usePriceListStore.getState().isLoading || usePriceCalculationStore.getState().isCalculating,

  getAllErrors: () => ({
    ...usePriceListStore.getState().errors,
    ...usePriceCalculationStore.getState().errors,
  }),

  // Кеш
  getCacheStatus: () => ({
    lastUpdated: usePriceListStore.getState().lastUpdated,
    categoriesLoaded: usePriceListStore.getState().categories.length > 0,
    stainTypesLoaded: usePriceListStore.getState().stainTypes.length > 0,
    defectTypesLoaded: usePriceListStore.getState().defectTypes.length > 0,
  }),
};

// ============= ПІДПИСКИ ТА ЕФЕКТИ =============

/**
 * Автоматичне оновлення кешу при зміні часу
 */
export const setupPricingCacheSubscription = () => {
  // Перевіряємо кеш кожні 30 хвилин
  const CACHE_TIMEOUT = 30 * 60 * 1000; // 30 хвилин

  const checkCache = () => {
    const { lastUpdated } = usePriceListStore.getState();
    if (!lastUpdated || Date.now() - lastUpdated.getTime() > CACHE_TIMEOUT) {
      usePriceListStore.getState().refreshCache();
    }
  };

  // Перевіряємо кеш при ініціалізації та кожні 5 хвилин
  checkCache();
  return setInterval(checkCache, 5 * 60 * 1000); // 5 хвилин
};

/**
 * Підписка на помилки для логування
 */
export const setupPricingErrorLogging = () => {
  return usePriceListStore.subscribe(
    (state) => state.errors,
    (errors, prevErrors) => {
      const newErrors = Object.keys(errors).filter((key) => !prevErrors[key]);
      newErrors.forEach((key) => {
        console.error(`Pricing Error [${key}]:`, errors[key]);
      });
    }
  );
};

// ============= УТИЛІТАРНІ ФУНКЦІЇ =============

/**
 * Ініціалізація сторів з базовими даними
 */
export const initializePricingStores = async () => {
  const priceListStore = usePriceListStore.getState();

  // Завантажуємо базові дані тільки якщо кеш порожній або застарілий
  const { lastUpdated } = priceListStore;
  const isStale = !lastUpdated || Date.now() - lastUpdated.getTime() > 10 * 60 * 1000; // 10 хвилин

  if (isStale || priceListStore.categories.length === 0) {
    await priceListStore.refreshCache();
  }
};

/**
 * Скинути всі стори до початкового стану
 */
export const resetPricingStores = () => {
  usePriceListStore.setState({
    items: {},
    categories: [],
    modifiers: {
      [ModifierCategory.GENERAL]: [],
      [ModifierCategory.TEXTILE]: [],
      [ModifierCategory.LEATHER]: [],
    },
    stainTypes: [],
    defectTypes: [],
    isLoading: false,
    lastUpdated: undefined,
    errors: {},
  });

  usePriceCalculationStore.setState({
    currentRequest: undefined,
    currentResponse: undefined,
    isCalculating: false,
    calculationHistory: [],
    errors: {},
  });
};
