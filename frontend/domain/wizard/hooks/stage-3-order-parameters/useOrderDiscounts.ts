/**
 * @fileoverview Хук для управління знижками замовлення
 *
 * Відповідальність:
 * - Вибір типу знижки (EverCard 10%, соціальні мережі 5%, ЗСУ 10%, кастомна)
 * - Встановлення кастомної знижки
 * - Розрахунок знижки для замовлення
 * - Валідація категорій (знижки не діють на прасування, прання, фарбування)
 * - Відображення попереджень про неприйнятність знижки
 */

import { useState, useCallback, useMemo } from 'react';

import { useApplyDiscount1 } from '@/shared/api/generated/full/aksiApi';

import type {
  OrderDiscounts,
  DiscountType,
  UseOrderDiscountsReturn,
  OrderItemForDiscount,
  DiscountValidationResult,
} from './types';
import type { OrderDiscountRequest } from '@/shared/api/generated/full/aksiApi.schemas';

/**
 * Хук для управління знижками замовлення
 *
 * @example
 * ```tsx
 * const {
 *   discounts,
 *   discountOptions,
 *   setDiscountType,
 *   calculateDiscount,
 *   validateDiscountApplication
 * } = useOrderDiscounts();
 *
 * // Встановити тип знижки
 * setDiscountType('evercard');
 *
 * // Перевірити чи можна застосувати знижку
 * const canApply = validateDiscountApplication(orderItems);
 *
 * // Розрахувати знижку
 * await calculateDiscount(discountRequest);
 * ```
 */
export function useOrderDiscounts(): UseOrderDiscountsReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [discounts, setDiscounts] = useState<OrderDiscounts>({
    discountType: 'none',
    applicableItems: [],
    totalDiscountAmount: 0,
  });

  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [discountWarning, setDiscountWarning] = useState<string | null>(null);

  // =====================================
  // API запити
  // =====================================

  // Мутація для застосування знижки
  const {
    mutateAsync: applyDiscountMutation,
    isPending: isCalculating,
    error: calculationMutationError,
  } = useApplyDiscount1();

  // =====================================
  // Константи
  // =====================================

  const discountOptions = useMemo(
    () => [
      {
        value: 'none' as DiscountType,
        label: 'Без знижки',
        percent: 0,
      },
      {
        value: 'evercard' as DiscountType,
        label: 'EverCard (10%)',
        percent: 10,
      },
      {
        value: 'social_media' as DiscountType,
        label: 'Соцмережі (5%)',
        percent: 5,
      },
      {
        value: 'military' as DiscountType,
        label: 'ЗСУ (10%)',
        percent: 10,
      },
      {
        value: 'custom' as DiscountType,
        label: 'Інше (вкажіть відсоток)',
        percent: 0,
      },
    ],
    []
  );

  // Категорії та послуги, на які НЕ діють знижки
  const restrictedCategories = useMemo(
    () => [
      // Категорії послуг (по коду)
      'ironing', // Прасування
      'washing', // Прання
      'dyeing', // Фарбування текстилю
      'textile_dyeing', // Фарбування текстильних виробів

      // Категорії послуг (по назві українською)
      'прасування',
      'прання',
      'фарбування',
      'фарбування текстилю',
      'фарбування текстильних виробів',
    ],
    []
  );

  // =====================================
  // Обробка помилок
  // =====================================

  useMemo(() => {
    if (calculationMutationError) {
      setCalculationError('Помилка розрахунку знижки');
    } else {
      setCalculationError(null);
    }
  }, [calculationMutationError]);

  // =====================================
  // Утилітарні функції
  // =====================================

  /**
   * Перевірити чи є предмет в обмеженій категорії
   */
  const isRestrictedItem = useCallback(
    (item: OrderItemForDiscount): boolean => {
      const categoryCode = item.category?.code?.toLowerCase() || '';
      const categoryName = item.category?.name?.toLowerCase() || '';
      const itemName = item.name?.toLowerCase() || '';
      const serviceType = item.serviceType?.toLowerCase() || '';

      return restrictedCategories.some((restricted) => {
        const restrictedLower = restricted.toLowerCase();

        return (
          categoryCode.includes(restrictedLower) ||
          categoryName.includes(restrictedLower) ||
          itemName.includes(restrictedLower) ||
          serviceType.includes(restrictedLower)
        );
      });
    },
    [restrictedCategories]
  );

  /**
   * Фільтрувати предмети для застосування знижки
   */
  const getApplicableItems = useCallback(
    (items: OrderItemForDiscount[]): OrderItemForDiscount[] => {
      return items.filter((item) => !isRestrictedItem(item));
    },
    [isRestrictedItem]
  );

  /**
   * Отримати обмежені предмети
   */
  const getRestrictedItems = useCallback(
    (items: OrderItemForDiscount[]): OrderItemForDiscount[] => {
      return items.filter((item) => isRestrictedItem(item));
    },
    [isRestrictedItem]
  );

  /**
   * Валідувати можливість застосування знижки
   */
  const validateDiscountApplication = useCallback(
    (items: OrderItemForDiscount[]): DiscountValidationResult => {
      if (discounts.discountType === 'none') {
        return {
          canApply: true,
          warning: null,
          applicableCount: items.length,
          restrictedCount: 0,
        };
      }

      const applicableItems = getApplicableItems(items);
      const restrictedItems = getRestrictedItems(items);

      if (applicableItems.length === 0 && restrictedItems.length > 0) {
        return {
          canApply: false,
          warning:
            'Знижка не може бути застосована. Всі послуги відносяться до категорій без знижки (прасування, прання, фарбування).',
          applicableCount: 0,
          restrictedCount: restrictedItems.length,
        };
      }

      if (restrictedItems.length > 0) {
        const restrictedNames = restrictedItems
          .map((item) => item.name || 'Невідома послуга')
          .join(', ');
        return {
          canApply: true,
          warning: `Знижка не буде застосована до: ${restrictedNames}. Знижки не діють на прасування, прання і фарбування текстилю.`,
          applicableCount: applicableItems.length,
          restrictedCount: restrictedItems.length,
        };
      }

      return {
        canApply: true,
        warning: null,
        applicableCount: applicableItems.length,
        restrictedCount: 0,
      };
    },
    [discounts.discountType, getApplicableItems, getRestrictedItems]
  );

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Встановити тип знижки
   */
  const setDiscountType = useCallback((type: DiscountType) => {
    setDiscounts((prev) => ({
      ...prev,
      discountType: type,
      // Очищаємо кастомні значення при зміні типу
      customDiscountPercent: type === 'custom' ? prev.customDiscountPercent : undefined,
      customDiscountAmount: type === 'custom' ? prev.customDiscountAmount : undefined,
    }));

    // Очищаємо попередження при зміні типу
    setDiscountWarning(null);
    setCalculationError(null);
  }, []);

  /**
   * Встановити кастомний відсоток знижки
   */
  const setCustomDiscountPercent = useCallback((percent: number) => {
    if (percent >= 0 && percent <= 100) {
      setDiscounts((prev) => ({
        ...prev,
        customDiscountPercent: percent,
        customDiscountAmount: undefined, // Очищаємо фіксовану суму
      }));
    }
  }, []);

  /**
   * Встановити кастомну суму знижки
   */
  const setCustomDiscountAmount = useCallback((amount: number) => {
    if (amount >= 0) {
      setDiscounts((prev) => ({
        ...prev,
        customDiscountAmount: amount,
        customDiscountPercent: undefined, // Очищаємо відсоток
      }));
    }
  }, []);

  /**
   * Розрахувати знижку для замовлення з валідацією
   */
  const calculateDiscount = useCallback(
    async (request: OrderDiscountRequest) => {
      try {
        setCalculationError(null);
        setDiscountWarning(null);

        // Валідація перед відправкою запиту
        if (discounts.discountType === 'none') {
          setDiscounts((prev) => ({
            ...prev,
            totalDiscountAmount: 0,
            applicableItems: [],
          }));
          return;
        }

        const response = await applyDiscountMutation({ data: request });

        if (response && typeof response === 'object') {
          const responseObj = response as { discountAmount?: number; applicableItems?: string[] };

          setDiscounts((prev) => ({
            ...prev,
            totalDiscountAmount: responseObj.discountAmount || 0,
            applicableItems: responseObj.applicableItems || [],
          }));
        }
      } catch (error) {
        console.error('Помилка розрахунку знижки:', error);
        setCalculationError('Не вдалося розрахувати знижку');
      }
    },
    [applyDiscountMutation, discounts.discountType]
  );

  /**
   * Застосувати валідацію знижки до предметів
   */
  const applyDiscountValidation = useCallback(
    (items: OrderItemForDiscount[]) => {
      const validation = validateDiscountApplication(items);

      setDiscountWarning(validation.warning);

      // Оновити список дозволених предметів
      if (validation.canApply) {
        const applicableItems = getApplicableItems(items);
        setDiscounts((prev) => ({
          ...prev,
          applicableItems: applicableItems.map((item) => item.id || '').filter(Boolean),
        }));
      }

      return validation;
    },
    [validateDiscountApplication, getApplicableItems]
  );

  /**
   * Очистити всі знижки
   */
  const clearDiscounts = useCallback(() => {
    setDiscounts({
      discountType: 'none',
      applicableItems: [],
      totalDiscountAmount: 0,
    });
    setCalculationError(null);
    setDiscountWarning(null);
  }, []);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    discounts,
    discountOptions,
    restrictedCategories,
    isCalculating,
    calculationError,
    discountWarning,

    // Дії
    setDiscountType,
    setCustomDiscountPercent,
    setCustomDiscountAmount,
    calculateDiscount,
    validateDiscountApplication,
    applyDiscountValidation,
    clearDiscounts,
  };
}
