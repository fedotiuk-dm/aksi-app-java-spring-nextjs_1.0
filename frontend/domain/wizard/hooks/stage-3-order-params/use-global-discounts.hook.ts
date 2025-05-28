/**
 * @fileoverview Хук для глобальних знижок замовлення (крок 3.2)
 * @module domain/wizard/hooks/stage-3
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { GlobalDiscountsService } from '../../services/stage-3-order-params';
import { useWizardStore } from '../../store';

/**
 * Інтерфейс знижки
 */
interface DiscountOption {
  id: string;
  name: string;
  percentage: number;
  isActive: boolean;
  excludedCategories: string[];
  description?: string;
}

/**
 * Інтерфейс застосованої знижки
 */
interface AppliedDiscount {
  discountId: string;
  percentage: number;
  amount: number;
  applicableItems: string[];
  excludedItems: string[];
}

/**
 * Хук для глобальних знижок замовлення
 * 🏷️ Композиція: TanStack Query + Zustand + GlobalDiscountsService
 */
export const useGlobalDiscounts = () => {
  // 🏪 Zustand - глобальний стан
  const { orderItems, selectedDiscount, setSelectedDiscount, addError, addWarning } =
    useWizardStore();

  // ⚙️ Сервіс
  const discountsService = useMemo(() => new GlobalDiscountsService(), []);

  // 📋 Завантаження доступних знижок (використовуємо опції з сервісу)
  const {
    data: availableDiscounts = [],
    isLoading: isLoadingDiscounts,
    error: discountsError,
  } = useQuery({
    queryKey: ['available-discounts'],
    queryFn: () => {
      // Конвертуємо опції з сервісу в DiscountOption формат
      const options = discountsService.getDiscountTypeOptions();
      return options.map((option, index) => ({
        id: option.value,
        name: option.label,
        percentage: option.percent || 0,
        isActive: true,
        excludedCategories: discountsService.getExcludedCategories(),
        description: option.label,
      }));
    },
    staleTime: 1800000, // 30 хвилин кеш
    gcTime: 3600000, // 1 година в кеші
  });

  // 🧮 Розрахунок застосування знижки (мок логіка)
  const calculateDiscountMutation = useMutation({
    mutationFn: async ({
      discountId,
      items,
    }: {
      discountId: string;
      items: any[];
    }): Promise<AppliedDiscount> => {
      const discount = availableDiscounts.find((d: DiscountOption) => d.id === discountId);
      if (!discount) throw new Error('Знижку не знайдено');

      const eligibleItems = items.filter(
        (item: any) => !discount.excludedCategories.includes(item.category)
      );
      const excludedItems = items.filter((item: any) =>
        discount.excludedCategories.includes(item.category)
      );

      const totalEligibleAmount = eligibleItems.reduce(
        (sum: number, item: any) => sum + (item.finalPrice || 0),
        0
      );
      const discountAmount = totalEligibleAmount * (discount.percentage / 100);

      return {
        discountId,
        percentage: discount.percentage,
        amount: discountAmount,
        applicableItems: eligibleItems.map((item: any) => item.id),
        excludedItems: excludedItems.map((item: any) => item.id),
      };
    },
    onError: (error) => {
      addError(`Помилка розрахунку знижки: ${error.message}`);
    },
  });

  // 🏷️ Методи роботи зі знижками
  const selectDiscount = useCallback(
    async (discountId: string | null) => {
      if (!discountId) {
        setSelectedDiscount(null);
        return;
      }

      if (!orderItems || orderItems.length === 0) {
        addError('Неможливо застосувати знижку до порожнього замовлення');
        return;
      }

      try {
        const appliedDiscount = await calculateDiscountMutation.mutateAsync({
          discountId,
          items: orderItems,
        });

        setSelectedDiscount(appliedDiscount);

        if (appliedDiscount.excludedItems.length > 0) {
          addWarning(
            `Знижка не застосовується до ${appliedDiscount.excludedItems.length} предметів через обмеження категорій`
          );
        }

        if (appliedDiscount.amount > 0) {
          addWarning(
            `Застосовано знижку: -${appliedDiscount.amount} грн (${appliedDiscount.percentage}%)`
          );
        }
      } catch (error) {
        addError('Не вдалося застосувати знижку');
      }
    },
    [orderItems, calculateDiscountMutation, setSelectedDiscount, addError, addWarning]
  );

  // ✅ Валідація знижок
  const validateDiscountEligibility = useCallback(
    (discountId: string): { isEligible: boolean; reason?: string } => {
      const discount = availableDiscounts.find((d: DiscountOption) => d.id === discountId);
      if (!discount) {
        return { isEligible: false, reason: 'Знижку не знайдено' };
      }

      if (!discount.isActive) {
        return { isEligible: false, reason: 'Знижка неактивна' };
      }

      if (!orderItems || orderItems.length === 0) {
        return { isEligible: false, reason: 'Немає предметів у замовленні' };
      }

      const eligibleItems = orderItems.filter(
        (item: any) => !discount.excludedCategories.includes(item.category)
      );
      if (eligibleItems.length === 0) {
        return {
          isEligible: false,
          reason: 'Всі предмети виключені з дії знижки',
        };
      }

      return { isEligible: true };
    },
    [availableDiscounts, orderItems]
  );

  // 🔍 Утиліти
  const getDiscountPreview = useCallback(
    (discountId: string) => {
      if (!orderItems || orderItems.length === 0) return null;

      const discount = availableDiscounts.find((d: DiscountOption) => d.id === discountId);
      if (!discount) return null;

      const eligibleItems = orderItems.filter(
        (item: any) => !discount.excludedCategories.includes(item.category)
      );
      const totalEligibleAmount = eligibleItems.reduce(
        (sum: number, item: any) => sum + (item.finalPrice || 0),
        0
      );
      const discountAmount = totalEligibleAmount * (discount.percentage / 100);

      return {
        discount,
        eligibleItemsCount: eligibleItems.length,
        totalEligibleAmount,
        discountAmount,
      };
    },
    [orderItems, availableDiscounts]
  );

  const formatDiscountAmount = useCallback((amount: number) => {
    return `${amount.toFixed(2)} грн`;
  }, []);

  const getDiscountDescription = useCallback(
    (discountId: string): string => {
      const discount = availableDiscounts.find((d: DiscountOption) => d.id === discountId);
      return discount?.description || discount?.name || '';
    },
    [availableDiscounts]
  );

  // 📊 Інформація про знижки
  const discountInfo = useMemo(() => {
    const totalDiscount = selectedDiscount?.amount || 0;
    const applicableItemsCount = selectedDiscount?.applicableItems.length || 0;
    const excludedItemsCount = selectedDiscount?.excludedItems.length || 0;

    return {
      hasAvailableDiscounts: availableDiscounts.length > 0,
      hasSelectedDiscount: !!selectedDiscount,
      totalDiscount,
      applicableItemsCount,
      excludedItemsCount,
      discountPercentage: selectedDiscount?.percentage || 0,
      isCalculating: calculateDiscountMutation.isPending,
    };
  }, [availableDiscounts, selectedDiscount, calculateDiscountMutation.isPending]);

  // 🔧 Допоміжні методи
  const clearDiscount = useCallback(() => {
    setSelectedDiscount(null);
  }, [setSelectedDiscount]);

  const isDiscountApplicable = useCallback(
    (discountId: string): boolean => {
      return validateDiscountEligibility(discountId).isEligible;
    },
    [validateDiscountEligibility]
  );

  return {
    // 📋 Дані
    availableDiscounts,
    selectedDiscount,
    discountInfo,

    // 🔄 Стани
    isLoadingDiscounts,
    discountsError,

    // 🏷️ Методи знижок
    selectDiscount,
    clearDiscount,
    validateDiscountEligibility,
    isDiscountApplicable,

    // 🔍 Утиліти
    getDiscountPreview,
    formatDiscountAmount,
    getDiscountDescription,
  };
};
