import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { BaseStore } from './baseStore';
import { StepValidationStatus } from '../../types/wizard.types';

/**
 * Константа для статусу валідації 'не валідовано'
 */
const NOT_VALIDATED: StepValidationStatus = 'not-validated';

/**
 * Типи модифікаторів ціни
 */
export enum ModifierType {
  PERCENTAGE = 'PERCENTAGE',           // Відсотковий
  FIXED = 'FIXED',                   // Фіксована сума
  COLOR = 'COLOR',                   // Модифікатор за кольором
  FIXED_QUANTITY = 'FIXED_QUANTITY',   // Фіксована сума за кількістю
  RANGE_PERCENTAGE = 'RANGE_PERCENTAGE' // Відсотковий з діапазоном
}

/**
 * Категорії модифікаторів ціни
 */
export enum ModifierCategory {
  GENERAL = 'general',               // Загальні модифікатори
  TEXTILE = 'textile',               // Модифікатори для текстильних виробів
  LEATHER = 'leather',               // Модифікатори для шкіряних виробів
  EXPEDITION = 'expedition'          // Модифікатори терміновості
}

/**
 * Тип модифікатора ціни
 */
export interface PriceModifier {
  id: string;
  name: string;
  description: string;
  type: ModifierType;
  category: ModifierCategory;
  value: number;
  minValue?: number;           // Мінімальне значення для діапазонів
  maxValue?: number;           // Максимальне значення для діапазонів
  isApplied: boolean;
  applicableCategories?: string[]; // Категорії предметів, до яких можна застосувати цей модифікатор
}

/**
 * Інтерфейс стану стору розрахунку ціни
 */
export interface PriceCalculationState extends BaseStore {
  // Базова ціна послуги
  basePrice: number;
  // Модифікатори ціни за категоріями
  modifiers: {
    general: PriceModifier[];
    textile: PriceModifier[];
    leather: PriceModifier[];
    expedition: PriceModifier[];
  };
  // Категорія предмета
  itemCategory: string;
  // Загальна кількість доступних модифікаторів
  availableModifiersCount: number;
  // Розрахована ціна
  calculatedPrice: number;
  // Статус валідації кроку
  validationStatus: StepValidationStatus;

  // Методи для оновлення стану
  setBasePrice: (price: number) => void;
  setItemCategory: (category: string) => void;
  setModifiers: (modifiers: PriceModifier[], category: ModifierCategory) => void;
  toggleModifier: (modifierId: string, category: ModifierCategory, isApplied: boolean) => void;
  updateModifierValue: (modifierId: string, category: ModifierCategory, value: number) => void;
  calculateTotalPrice: () => void;
  getAvailableModifiers: () => PriceModifier[];
  setValidationStatus: (status: StepValidationStatus) => void;
}

/**
 * Початковий стан для стору розрахунку ціни
 */
const initialState = {
  basePrice: 0,
  modifiers: {
    general: [],
    textile: [],
    leather: [],
    expedition: [],
  },
  itemCategory: '',
  availableModifiersCount: 0,
  calculatedPrice: 0,
  validationStatus: NOT_VALIDATED,
  error: null,
  isSaving: false,
};

/**
 * Стор для управління розрахунком ціни в Order Wizard
 */
export const usePriceCalculationStore = create<PriceCalculationState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Встановлення базової ціни
        setBasePrice: (basePrice) => {
          set({ basePrice });
          get().calculateTotalPrice();
        },

        // Встановлення категорії предмета
        setItemCategory: (category) => {
          set({ itemCategory: category });
          // Оновлення кількості доступних модифікаторів
          set({
            availableModifiersCount: get().getAvailableModifiers().length,
          });
        },

        // Встановлення списку доступних модифікаторів для певної категорії
        setModifiers: (modifiers, category) => {
          set((state) => ({
            modifiers: {
              ...state.modifiers,
              [category]: modifiers,
            },
          }));
          get().calculateTotalPrice();
        },

        // Вмикання/вимикання модифікатора ціни
        toggleModifier: (modifierId, category, isApplied) => {
          set((state) => ({
            modifiers: {
              ...state.modifiers,
              [category]: state.modifiers[category].map((modifier) =>
                modifier.id === modifierId ? { ...modifier, isApplied } : modifier
              ),
            },
          }));
          get().calculateTotalPrice();
        },

        // Оновлення значення модифікатора
        updateModifierValue: (modifierId, category, value) => {
          set((state) => ({
            modifiers: {
              ...state.modifiers,
              [category]: state.modifiers[category].map((modifier) =>
                modifier.id === modifierId ? { ...modifier, value } : modifier
              ),
            },
          }));
          get().calculateTotalPrice();
        },

        // Отримання всіх доступних для поточної категорії предмета модифікаторів
        getAvailableModifiers: () => {
          const { modifiers, itemCategory } = get();
          const allModifiers = [
            ...modifiers.general,
            ...modifiers.expedition,
          ];

          // Додаємо модифікатори залежно від категорії предмета
          if (itemCategory.includes('textile')) {
            allModifiers.push(...modifiers.textile);
          } else if (itemCategory.includes('leather')) {
            allModifiers.push(...modifiers.leather);
          }

          return allModifiers.filter((modifier) => 
            !modifier.applicableCategories ||
            modifier.applicableCategories.includes(itemCategory)
          );
        },

        // Розрахунок загальної ціни з урахуванням усіх модифікаторів
        calculateTotalPrice: () => {
          const { basePrice } = get();
          const availableModifiers = get().getAvailableModifiers();
          let calculatedPrice = basePrice;

          // Спочатку застосовуємо кольорові модифікатори
          const colorModifiers = availableModifiers.filter(
            (m) => m.isApplied && m.type === ModifierType.COLOR
          );
          for (const modifier of colorModifiers) {
            calculatedPrice += modifier.value;
          }

          // Застосовуємо відсоткові модифікатори
          const percentageModifiers = availableModifiers.filter(
            (m) => m.isApplied && m.type === ModifierType.PERCENTAGE
          );
          for (const modifier of percentageModifiers) {
            calculatedPrice += calculatedPrice * (modifier.value / 100);
          }

          // Застосовуємо фіксовані модифікатори
          const fixedModifiers = availableModifiers.filter(
            (m) => m.isApplied && m.type === ModifierType.FIXED
          );
          for (const modifier of fixedModifiers) {
            calculatedPrice += modifier.value;
          }

          // Застосовуємо діапазонні відсоткові модифікатори
          const rangeModifiers = availableModifiers.filter(
            (m) => m.isApplied && m.type === ModifierType.RANGE_PERCENTAGE
          );
          for (const modifier of rangeModifiers) {
            calculatedPrice += calculatedPrice * (modifier.value / 100);
          }

          // Встановлюємо розраховану ціну (округлену до 2 знаків після коми)
          set({ calculatedPrice: Math.round(calculatedPrice * 100) / 100 });
        },

        // Встановлення статусу валідації кроку
        setValidationStatus: (status) => set({
          validationStatus: status,
        }),

        // Встановлення помилки
        setError: (error) => set({
          error,
        }),

        // Встановлення статусу збереження
        setIsSaving: (isSaving) => set({
          isSaving,
        }),

        // Скидання стану стору
        reset: () => set(initialState),
      }),
      {
        name: 'order-wizard-price-calculation',
      }
    )
  )
);
