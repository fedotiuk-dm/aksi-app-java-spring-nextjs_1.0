/**
 * @fileoverview Discounts Slice Store - Zustand store для глобальних знижок
 * @module domain/wizard/store/stage-3
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { DiscountType } from '../../types';

/**
 * Стан знижок (Stage 3.2)
 */
interface DiscountsState {
  // Selected discount
  selectedDiscountType: DiscountType | null;
  customDiscountPercent: number;
  customDiscountReason: string;

  // Discount calculation
  discountAmount: number;
  discountPercentage: number;
  applicableOrderAmount: number;
  discountDescription: string;

  // Discount applicability (бізнес-правила)
  excludedCategories: string[];
  isDiscountApplicable: boolean;

  // Validation
  discountValidationErrors: string[];
  isDiscountValid: boolean;
}

/**
 * Дії для знижок
 */
interface DiscountsActions {
  // Discount selection actions
  setDiscountType: (discountType: DiscountType | null) => void;
  setCustomDiscount: (percent: number, reason: string) => void;
  clearDiscount: () => void;

  // Discount calculation actions
  calculateDiscountAmount: (orderTotal: number) => void;
  setApplicableOrderAmount: (amount: number) => void;

  // Discount applicability actions
  setExcludedCategories: (categories: string[]) => void;
  checkDiscountApplicability: (orderItems: any[]) => void;

  // Validation actions
  setDiscountValidationErrors: (errors: string[]) => void;
  clearDiscountValidationErrors: () => void;
  validateDiscount: () => void;

  // Reset actions
  resetDiscounts: () => void;

  // Helper methods
  getDiscountPercentage: (discountType: DiscountType | null) => number;
  getDiscountDescription: (discountType: DiscountType | null) => string;
}

/**
 * Початковий стан знижок
 */
const initialDiscountsState: DiscountsState = {
  selectedDiscountType: null,
  customDiscountPercent: 0,
  customDiscountReason: '',
  discountAmount: 0,
  discountPercentage: 0,
  applicableOrderAmount: 0,
  discountDescription: '',
  excludedCategories: ['IRONING', 'LAUNDRY', 'TEXTILE_DYEING'],
  isDiscountApplicable: true,
  discountValidationErrors: [],
  isDiscountValid: true,
};

/**
 * Discounts Slice Store
 *
 * Відповідальність:
 * - Вибір типу знижки (Еверкард, соцмережі, ЗСУ, інше)
 * - Розрахунок суми знижки
 * - Перевірка застосовності знижки (виключені категорії)
 * - Валідація знижок та обмежень
 *
 * Бізнес-правила:
 * - Знижки не діють на прасування, прання і фарбування текстилю
 * - Еверкард: 10%, Соцмережі: 5%, ЗСУ: 10%
 * - Можливість кастомної знижки з обґрунтуванням
 *
 * Інтеграція:
 * - Orval типи для DiscountType
 * - Сервіси розрахунку знижок
 * - API для перевірки права на знижку
 */
export const useDiscountsStore = create<DiscountsState & DiscountsActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialDiscountsState,

      // Discount selection actions
      setDiscountType: (discountType) => {
        const percentage = get().getDiscountPercentage(discountType);
        const description = get().getDiscountDescription(discountType);

        set(
          {
            selectedDiscountType: discountType,
            discountPercentage: percentage,
            discountDescription: description,
            customDiscountPercent: discountType === 'CUSTOM' ? get().customDiscountPercent : 0,
            discountValidationErrors: [],
          },
          false,
          'discounts/setDiscountType'
        );

        get().validateDiscount();
      },

      setCustomDiscount: (percent, reason) => {
        set(
          {
            selectedDiscountType: 'CUSTOM',
            customDiscountPercent: percent,
            customDiscountReason: reason,
            discountPercentage: percent,
            discountDescription: `Індивідуальна знижка ${percent}%: ${reason}`,
          },
          false,
          'discounts/setCustomDiscount'
        );

        get().validateDiscount();
      },

      clearDiscount: () => {
        set(
          {
            selectedDiscountType: null,
            customDiscountPercent: 0,
            customDiscountReason: '',
            discountAmount: 0,
            discountPercentage: 0,
            discountDescription: '',
            discountValidationErrors: [],
            isDiscountValid: true,
          },
          false,
          'discounts/clearDiscount'
        );
      },

      // Discount calculation actions
      calculateDiscountAmount: (orderTotal) => {
        const state = get();
        if (!state.selectedDiscountType || state.discountPercentage === 0) {
          set({ discountAmount: 0 }, false, 'discounts/calculateDiscountAmount');
          return;
        }

        const applicableAmount = state.applicableOrderAmount || orderTotal;
        const discountAmount = applicableAmount * (state.discountPercentage / 100);

        set({ discountAmount }, false, 'discounts/calculateDiscountAmount');
      },

      setApplicableOrderAmount: (amount) => {
        set({ applicableOrderAmount: amount }, false, 'discounts/setApplicableOrderAmount');
        get().calculateDiscountAmount(amount);
      },

      // Discount applicability actions
      setExcludedCategories: (categories) => {
        set({ excludedCategories: categories }, false, 'discounts/setExcludedCategories');
      },

      checkDiscountApplicability: (orderItems) => {
        const state = get();

        // Перевіряємо чи є в замовленні предмети з виключених категорій
        const hasExcludedItems = orderItems.some((item) =>
          state.excludedCategories.includes(item.categoryCode)
        );

        // Розраховуємо суму, на яку можна застосувати знижку
        const applicableAmount = orderItems
          .filter((item) => !state.excludedCategories.includes(item.categoryCode))
          .reduce((sum, item) => sum + (item.finalPrice || 0), 0);

        set(
          {
            isDiscountApplicable: applicableAmount > 0,
            applicableOrderAmount: applicableAmount,
          },
          false,
          'discounts/checkDiscountApplicability'
        );

        if (hasExcludedItems && applicableAmount === 0) {
          get().setDiscountValidationErrors([
            'Знижка не може бути застосована до жодного предмета в замовленні',
          ]);
        }
      },

      // Validation actions
      setDiscountValidationErrors: (errors) => {
        set(
          {
            discountValidationErrors: errors,
            isDiscountValid: errors.length === 0,
          },
          false,
          'discounts/setDiscountValidationErrors'
        );
      },

      clearDiscountValidationErrors: () => {
        set(
          { discountValidationErrors: [], isDiscountValid: true },
          false,
          'discounts/clearDiscountValidationErrors'
        );
      },

      validateDiscount: () => {
        const state = get();
        const errors: string[] = [];

        if (state.selectedDiscountType === 'CUSTOM') {
          if (state.customDiscountPercent <= 0 || state.customDiscountPercent > 100) {
            errors.push('Відсоток знижки повинен бути від 1% до 100%');
          }
          if (!state.customDiscountReason.trim()) {
            errors.push("Обґрунтування для індивідуальної знижки обов'язкове");
          }
        }

        get().setDiscountValidationErrors(errors);
      },

      // Helper methods
      getDiscountPercentage: (discountType: DiscountType | null): number => {
        switch (discountType) {
          case 'EVERCARD':
            return 10;
          case 'SOCIAL_MEDIA':
            return 5;
          case 'MILITARY':
            return 10;
          case 'CUSTOM':
            return get().customDiscountPercent;
          default:
            return 0;
        }
      },

      getDiscountDescription: (discountType: DiscountType | null): string => {
        switch (discountType) {
          case 'EVERCARD':
            return 'Знижка за картою Еверкард 10%';
          case 'SOCIAL_MEDIA':
            return 'Знижка за відгук у соцмережах 5%';
          case 'MILITARY':
            return 'Знижка для військових ЗСУ 10%';
          case 'CUSTOM':
            return `Індивідуальна знижка ${get().customDiscountPercent}%`;
          default:
            return '';
        }
      },

      // Reset actions
      resetDiscounts: () => {
        set(initialDiscountsState, false, 'discounts/resetDiscounts');
      },
    }),
    {
      name: 'discounts-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type DiscountsStore = ReturnType<typeof useDiscountsStore>;
