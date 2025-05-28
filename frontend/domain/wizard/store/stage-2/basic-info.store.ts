/**
 * @fileoverview Basic Info Slice Store - Zustand store для основної інформації предмета
 * @module domain/wizard/store/stage-2
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Категорії послуг
 */
export enum ServiceCategory {
  CLOTHING_TEXTILE = 'CLOTHING_TEXTILE',
  LAUNDRY = 'LAUNDRY',
  IRONING = 'IRONING',
  LEATHER_RESTORATION = 'LEATHER_RESTORATION',
  SHEEPSKIN = 'SHEEPSKIN',
  NATURAL_FUR = 'NATURAL_FUR',
  TEXTILE_DYEING = 'TEXTILE_DYEING',
}

/**
 * Одиниці виміру
 */
export enum MeasurementUnit {
  PIECES = 'PIECES', // штуки
  KILOGRAMS = 'KILOGRAMS', // кілограми
}

/**
 * Інтерфейс елемента прайс-листа
 */
interface PriceListItem {
  id: string;
  category: ServiceCategory;
  number: string;
  name: string;
  unit: MeasurementUnit;
  basePrice: number;
  isActive: boolean;
}

/**
 * Стан основної інформації предмета (Підетап 2.1)
 */
interface BasicInfoState {
  // Service category
  selectedCategory: ServiceCategory | null;
  availableCategories: Array<{
    category: ServiceCategory;
    name: string;
    description: string;
  }>;

  // Price list items
  availablePriceItems: PriceListItem[];
  selectedPriceItem: PriceListItem | null;
  isPriceItemsLoading: boolean;

  // Item details
  itemName: string;
  customItemName: string;
  isCustomName: boolean;
  quantity: number;
  unit: MeasurementUnit;
  basePrice: number;

  // Auto-calculation
  isAutoCalculatePrice: boolean;
  calculatedBasePrice: number;

  // Validation
  basicInfoValidationErrors: Record<string, string[]>;
  isBasicInfoStepValid: boolean;

  // Loading states
  isCategoriesLoading: boolean;
  categoryLoadingError: string | null;
}

/**
 * Дії для основної інформації предмета
 */
interface BasicInfoActions {
  // Category management
  setSelectedCategory: (category: ServiceCategory | null) => void;
  setAvailableCategories: (
    categories: Array<{ category: ServiceCategory; name: string; description: string }>
  ) => void;
  setCategoriesLoading: (loading: boolean) => void;
  setCategoryLoadingError: (error: string | null) => void;
  loadCategories: () => Promise<void>;

  // Price list management
  setAvailablePriceItems: (items: PriceListItem[]) => void;
  setSelectedPriceItem: (item: PriceListItem | null) => void;
  setPriceItemsLoading: (loading: boolean) => void;
  loadPriceItemsByCategory: (category: ServiceCategory) => Promise<void>;

  // Item details
  setItemName: (name: string) => void;
  setCustomItemName: (name: string) => void;
  setIsCustomName: (isCustom: boolean) => void;
  setQuantity: (quantity: number) => void;
  setUnit: (unit: MeasurementUnit) => void;
  setBasePrice: (price: number) => void;

  // Auto-calculation
  setAutoCalculatePrice: (autoCalculate: boolean) => void;
  calculateBasePrice: () => void;
  setCalculatedBasePrice: (price: number) => void;

  // Validation
  setBasicInfoValidationErrors: (field: string, errors: string[]) => void;
  clearBasicInfoValidationErrors: (field: string) => void;
  validateBasicInfoStep: () => void;
  setBasicInfoStepValid: (valid: boolean) => void;

  // Helper methods
  getCategoryDisplayName: (category: ServiceCategory) => string;
  getUnitDisplayName: (unit: MeasurementUnit) => string;
  updateFromPriceItem: (item: PriceListItem) => void;

  // Reset actions
  resetBasicInfo: () => void;
}

/**
 * Початковий стан основної інформації предмета
 */
const initialBasicInfoState: BasicInfoState = {
  selectedCategory: null,
  availableCategories: [],
  availablePriceItems: [],
  selectedPriceItem: null,
  isPriceItemsLoading: false,
  itemName: '',
  customItemName: '',
  isCustomName: false,
  quantity: 1,
  unit: MeasurementUnit.PIECES,
  basePrice: 0,
  isAutoCalculatePrice: true,
  calculatedBasePrice: 0,
  basicInfoValidationErrors: {},
  isBasicInfoStepValid: false,
  isCategoriesLoading: false,
  categoryLoadingError: null,
};

/**
 * Basic Info Slice Store
 *
 * Відповідальність:
 * - Управління категоріями послуг
 * - Вибір найменування з прайс-листа
 * - Управління кількістю та одиницями виміру
 * - Розрахунок базової ціни
 * - Валідація основної інформації
 *
 * Інтеграція:
 * - API прайс-листів
 * - Orval типи для ServiceCategory
 * - Автоматичний розрахунок цін
 */
export const useBasicInfoStore = create<BasicInfoState & BasicInfoActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialBasicInfoState,

      // Category management
      setSelectedCategory: (category) => {
        set({ selectedCategory: category }, false, 'basicInfo/setSelectedCategory');

        // Очищуємо залежні поля при зміні категорії
        set(
          {
            selectedPriceItem: null,
            availablePriceItems: [],
            itemName: '',
            basePrice: 0,
          },
          false,
          'basicInfo/setSelectedCategory/clearDependent'
        );

        // Завантажуємо прайс-лист для нової категорії
        if (category) {
          get().loadPriceItemsByCategory(category);
        }

        get().validateBasicInfoStep();
      },

      setAvailableCategories: (categories) => {
        set({ availableCategories: categories }, false, 'basicInfo/setAvailableCategories');
      },

      setCategoriesLoading: (loading) => {
        set({ isCategoriesLoading: loading }, false, 'basicInfo/setCategoriesLoading');
      },

      setCategoryLoadingError: (error) => {
        set({ categoryLoadingError: error }, false, 'basicInfo/setCategoryLoadingError');
      },

      loadCategories: async () => {
        set(
          { isCategoriesLoading: true, categoryLoadingError: null },
          false,
          'basicInfo/loadCategories/start'
        );

        try {
          // API виклик для завантаження категорій
          // const categories = await getServiceCategories();
          // get().setAvailableCategories(categories);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Помилка завантаження категорій';
          get().setCategoryLoadingError(errorMessage);
        } finally {
          set({ isCategoriesLoading: false }, false, 'basicInfo/loadCategories/complete');
        }
      },

      // Price list management
      setAvailablePriceItems: (items) => {
        set({ availablePriceItems: items }, false, 'basicInfo/setAvailablePriceItems');
      },

      setSelectedPriceItem: (item) => {
        set({ selectedPriceItem: item }, false, 'basicInfo/setSelectedPriceItem');

        if (item) {
          get().updateFromPriceItem(item);
        }

        get().validateBasicInfoStep();
      },

      setPriceItemsLoading: (loading) => {
        set({ isPriceItemsLoading: loading }, false, 'basicInfo/setPriceItemsLoading');
      },

      loadPriceItemsByCategory: async (category) => {
        set({ isPriceItemsLoading: true }, false, 'basicInfo/loadPriceItemsByCategory/start');

        try {
          // API виклик для завантаження прайс-листа
          // const priceItems = await getPriceItemsByCategory(category);
          // get().setAvailablePriceItems(priceItems);
        } catch (error) {
          console.error('Failed to load price items:', error);
          get().setAvailablePriceItems([]);
        } finally {
          set({ isPriceItemsLoading: false }, false, 'basicInfo/loadPriceItemsByCategory/complete');
        }
      },

      // Item details
      setItemName: (name) => {
        set({ itemName: name }, false, 'basicInfo/setItemName');
        get().validateBasicInfoStep();
      },

      setCustomItemName: (name) => {
        set({ customItemName: name }, false, 'basicInfo/setCustomItemName');

        if (get().isCustomName) {
          set({ itemName: name }, false, 'basicInfo/setCustomItemName/updateItemName');
          get().validateBasicInfoStep();
        }
      },

      setIsCustomName: (isCustom) => {
        set({ isCustomName: isCustom }, false, 'basicInfo/setIsCustomName');

        if (isCustom) {
          set({ itemName: get().customItemName }, false, 'basicInfo/setIsCustomName/useCustom');
          set({ selectedPriceItem: null }, false, 'basicInfo/setIsCustomName/clearPriceItem');
        } else {
          set({ itemName: '' }, false, 'basicInfo/setIsCustomName/clearName');
        }

        get().validateBasicInfoStep();
      },

      setQuantity: (quantity) => {
        set({ quantity }, false, 'basicInfo/setQuantity');

        if (get().isAutoCalculatePrice) {
          get().calculateBasePrice();
        }

        get().validateBasicInfoStep();
      },

      setUnit: (unit) => {
        set({ unit }, false, 'basicInfo/setUnit');
        get().validateBasicInfoStep();
      },

      setBasePrice: (price) => {
        set({ basePrice: price }, false, 'basicInfo/setBasePrice');
        get().validateBasicInfoStep();
      },

      // Auto-calculation
      setAutoCalculatePrice: (autoCalculate) => {
        set({ isAutoCalculatePrice: autoCalculate }, false, 'basicInfo/setAutoCalculatePrice');

        if (autoCalculate) {
          get().calculateBasePrice();
        }
      },

      calculateBasePrice: () => {
        const state = get();

        if (state.selectedPriceItem) {
          const calculatedPrice = state.selectedPriceItem.basePrice * state.quantity;
          set(
            {
              calculatedBasePrice: calculatedPrice,
              basePrice: calculatedPrice,
            },
            false,
            'basicInfo/calculateBasePrice'
          );
        }
      },

      setCalculatedBasePrice: (price) => {
        set({ calculatedBasePrice: price }, false, 'basicInfo/setCalculatedBasePrice');
      },

      // Validation
      setBasicInfoValidationErrors: (field, errors) => {
        set(
          (state) => ({
            basicInfoValidationErrors: {
              ...state.basicInfoValidationErrors,
              [field]: errors,
            },
          }),
          false,
          'basicInfo/setBasicInfoValidationErrors'
        );
        get().validateBasicInfoStep();
      },

      clearBasicInfoValidationErrors: (field) => {
        set(
          (state) => {
            const { [field]: removed, ...rest } = state.basicInfoValidationErrors;
            return { basicInfoValidationErrors: rest };
          },
          false,
          'basicInfo/clearBasicInfoValidationErrors'
        );
        get().validateBasicInfoStep();
      },

      validateBasicInfoStep: () => {
        const state = get();
        const errors: Record<string, string[]> = {};

        // Валідація категорії
        if (!state.selectedCategory) {
          errors.category = ['Виберіть категорію послуги'];
        }

        // Валідація найменування
        if (!state.itemName.trim()) {
          errors.itemName = ['Введіть найменування предмета'];
        }

        // Валідація кількості
        if (state.quantity <= 0) {
          errors.quantity = ['Кількість повинна бути більше 0'];
        }

        // Валідація базової ціни
        if (state.basePrice <= 0) {
          errors.basePrice = ['Базова ціна повинна бути більше 0'];
        }

        const hasErrors = Object.keys(errors).length > 0;
        const hasValidationErrors = Object.values(state.basicInfoValidationErrors).some(
          (fieldErrors) => fieldErrors.length > 0
        );

        set(
          {
            basicInfoValidationErrors: errors,
            isBasicInfoStepValid: !hasErrors && !hasValidationErrors,
          },
          false,
          'basicInfo/validateBasicInfoStep'
        );
      },

      setBasicInfoStepValid: (valid) => {
        set({ isBasicInfoStepValid: valid }, false, 'basicInfo/setBasicInfoStepValid');
      },

      // Helper methods
      getCategoryDisplayName: (category) => {
        const state = get();
        const categoryData = state.availableCategories.find((c) => c.category === category);
        return categoryData?.name || category;
      },

      getUnitDisplayName: (unit) => {
        switch (unit) {
          case MeasurementUnit.PIECES:
            return 'шт';
          case MeasurementUnit.KILOGRAMS:
            return 'кг';
          default:
            return unit;
        }
      },

      updateFromPriceItem: (item) => {
        set(
          {
            itemName: item.name,
            unit: item.unit,
            isCustomName: false,
          },
          false,
          'basicInfo/updateFromPriceItem'
        );

        if (get().isAutoCalculatePrice) {
          get().calculateBasePrice();
        } else {
          set({ basePrice: item.basePrice }, false, 'basicInfo/updateFromPriceItem/setBasePrice');
        }
      },

      // Reset actions
      resetBasicInfo: () => {
        set(initialBasicInfoState, false, 'basicInfo/resetBasicInfo');
      },
    }),
    {
      name: 'basic-info-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type BasicInfoStore = ReturnType<typeof useBasicInfoStore>;
