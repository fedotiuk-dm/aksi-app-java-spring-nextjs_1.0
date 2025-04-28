import { useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  PriceCalculatorService,
  ModifierDTO,
  PriceCalculationRequestDTO,
  PriceCalculationResponseDTO,
  ModifierCalculationDetail,
  FixedModifierQuantityDTO,
  RangeModifierValueDTO,
} from '@/lib/api';
import {
  AppliedModifier,
  PriceModifier,
  PriceCalculationResult,
} from '@/features/order-wizard/model/schema/item-pricing.schema';
import { QUERY_KEYS } from '../../helpers/query-keys';

/**
 * Хук для роботи з ціноутворенням предметів замовлення та ціновим калькулятором
 */
export const useItemPricing = () => {
  /**
   * Перетворює ModifierDTO з API в PriceModifier для фронтенду
   */
  const mapModifierFromApi = useCallback(
    (apiModifier: ModifierDTO): PriceModifier => {
      // Проаналізуємо тип модифікатора для отримання додаткових даних
      const type = apiModifier.type || '';

      // Значення модифікатора
      // В майбутньому ці поля мають бути в ModifierDTO з бекенду
      let value = 0;
      let minValue: number | undefined = undefined;
      let maxValue: number | undefined = undefined;
      let isPercentage = false;
      let isDiscount = false;

      // Аналізуємо changeDescription та description для визначення параметрів
      const description = apiModifier.description || '';
      const changeDesc = apiModifier.changeDescription || '';

      // Визначаємо категорію модифікатора
      let category = 'GENERAL';
      if (type.includes('TEXTILE')) {
        category = 'TEXTILE';
      } else if (type.includes('LEATHER')) {
        category = 'LEATHER';
      }

      // Визначаємо, чи це дисконт (знижка) на основі даних з API
      isDiscount =
        changeDesc.includes('-') ||
        description.includes('знижка') ||
        description.includes('-') ||
        type.includes('DISCOUNT');

      // Визначаємо, чи це відсотковий модифікатор
      isPercentage =
        changeDesc.includes('%') ||
        description.includes('%') ||
        type.includes('PERCENTAGE') ||
        type.includes('PERCENT');

      // Шукаємо числові значення
      const percentMatches =
        changeDesc.match(/([\d.]+)%/) || description.match(/([\d.]+)%/);
      const rangeMatches =
        description.match(/від\s+([\d.]+)\s+до\s+([\d.]+)/) ||
        changeDesc.match(/від\s+([\d.]+)\s+до\s+([\d.]+)/);
      const valueMatches =
        changeDesc.match(/([\d.]+)/) || description.match(/([\d.]+)/);

      if (rangeMatches) {
        // Це модифікатор з діапазоном
        minValue = parseFloat(rangeMatches[1]);
        maxValue = parseFloat(rangeMatches[2]);
        value = minValue; // За замовчуванням беремо мінімальне значення
      } else if (percentMatches) {
        // Це відсотковий модифікатор
        value = parseFloat(percentMatches[1]);
        isPercentage = true;
      } else if (valueMatches) {
        // Якщо знайдено якесь числове значення
        value = parseFloat(valueMatches[1]);
      }

      return {
        id: apiModifier.id || '',
        name: apiModifier.name || '',
        type: type,
        description: apiModifier.description,
        category,
        isPercentage,
        value,
        minValue,
        maxValue,
        isDiscount,
      };
    },
    []
  );

  /**
   * Мапить всі модифікатори з API в формат фронтенду
   */
  const mapModifiersFromApi = useCallback(
    (apiModifiers: ModifierDTO[]): PriceModifier[] => {
      return apiModifiers.map(mapModifierFromApi);
    },
    [mapModifierFromApi]
  );

  /**
   * Перетворює деталі розрахунку з API в формат фронтенду
   */
  const mapCalculationDetailsFromApi = useCallback(
    (
      apiDetails: ModifierCalculationDetail[]
    ): PriceCalculationResult['modifiersImpact'] => {
      return apiDetails.map((detail) => ({
        modifierId: detail.modifierId || '',
        name: detail.modifierName || '',
        value: 0, // Буде заповнено пізніше з даних форми
        impact: detail.priceDifference || 0,
      }));
    },
    []
  );

  /**
   * Підготовка запиту для розрахунку ціни
   */
  const prepareCalculationRequest = useCallback(
    (
      basePrice: number,
      categoryCode: string | undefined,
      itemName: string | undefined,
      appliedModifiers: AppliedModifier[],
      availableModifiers: PriceModifier[]
    ): PriceCalculationRequestDTO => {
      // Розділяємо модифікатори на різні типи
      const simpleModifierIds: string[] = [];
      const rangeModifierValues: RangeModifierValueDTO[] = [];
      const fixedModifierQuantities: FixedModifierQuantityDTO[] = [];

      appliedModifiers.forEach((applied) => {
        const modifier = availableModifiers.find(
          (m) => m.id === applied.modifierId
        );
        if (!modifier) return;

        if (
          modifier.minValue !== undefined &&
          modifier.maxValue !== undefined
        ) {
          // Діапазонний модифікатор
          rangeModifierValues.push({
            modifierId: applied.modifierId,
            percentage: applied.selectedValue,
          });
        } else if (!modifier.isPercentage) {
          // Фіксований модифікатор
          fixedModifierQuantities.push({
            modifierId: applied.modifierId,
            quantity: Math.round(applied.selectedValue),
          });
        } else {
          // Простий відсотковий модифікатор
          simpleModifierIds.push(applied.modifierId);
        }
      });

      return {
        categoryCode,
        itemName,
        quantity: 1, // За замовчуванням кількість = 1
        modifierIds: simpleModifierIds,
        rangeModifierValues,
        fixedModifierQuantities,
      };
    },
    []
  );

  /**
   * Отримує базову ціну для предмета
   */
  /**
   * Отримання базової ціни для предмета
   */
  const useBasePrice = (
    categoryCode: string | undefined,
    itemName: string | undefined
  ) => {
    return useQuery<PriceCalculationResponseDTO>({
      queryKey: [QUERY_KEYS.PRICE_CALCULATION, 'base', categoryCode, itemName],
      queryFn: async () => {
        if (!categoryCode || !itemName) {
          throw new Error(
            "Категорія та назва предмета обов'язкові для отримання базової ціни"
          );
        }

        try {
          return await PriceCalculatorService.getBasePrice({
            categoryCode,
            itemName,
          });
        } catch (error) {
          console.error('Помилка при отриманні базової ціни:', error);
          throw error;
        }
      },
      enabled: !!categoryCode && !!itemName,
    });
  };

  /**
   * Розрахунок ціни з урахуванням модифікаторів
   */
  const useCalculatePrice = () => {
    return useMutation<
      PriceCalculationResponseDTO,
      Error,
      PriceCalculationRequestDTO
    >({
      mutationFn: async (request: PriceCalculationRequestDTO) => {
        try {
          return await PriceCalculatorService.calculatePrice({
            requestBody: request,
          });
        } catch (error) {
          console.error('Помилка при розрахунку ціни:', error);
          throw error;
        }
      },
    });
  };

  /**
   * Отримання всіх доступних модифікаторів ціни
   */
  const useAllModifiers = () => {
    return useQuery<ModifierDTO[]>({
      queryKey: [QUERY_KEYS.PRICE_MODIFIERS, 'all'],
      queryFn: async () => {
        try {
          return await PriceCalculatorService.getAllModifiers();
        } catch (error) {
          console.error('Помилка при отриманні модифікаторів ціни:', error);
          return [];
        }
      },
    });
  };

  /**
   * Отримання модифікаторів ціни для конкретної категорії
   */
  const useModifiersForCategory = (categoryCode: string | undefined) => {
    return useQuery<ModifierDTO[]>({
      queryKey: [QUERY_KEYS.PRICE_MODIFIERS, 'category', categoryCode],
      queryFn: async () => {
        if (!categoryCode) {
          return [];
        }

        try {
          return await PriceCalculatorService.getModifiersForCategory({
            categoryCode,
          });
        } catch (error) {
          console.error(
            'Помилка при отриманні модифікаторів для категорії:',
            error
          );
          return [];
        }
      },
      enabled: !!categoryCode,
    });
  };

  /**
   * Отримує базову ціну для предмета з розширеним інтерфейсом
   */
  const useBasePriceForItem = (categoryCode?: string, itemName?: string) => {
    const { data, isLoading, error } = useBasePrice(categoryCode, itemName);

    return {
      basePrice: data?.baseUnitPrice || 0,
      isLoading,
      error,
    };
  };

  /**
   * Отримує модифікатори ціни та конвертує їх у формат фронтенду
   */
  const useModifiersForItem = (categoryCode?: string) => {
    // Використовуємо один хук, щоб уникнути умовного виклику хуків
    const categoryKey = categoryCode ? `category:${categoryCode}` : 'all';

    const {
      data = [],
      isLoading,
      error,
    } = useQuery<ModifierDTO[]>({
      queryKey: [QUERY_KEYS.PRICE_MODIFIERS, categoryKey],
      queryFn: async () => {
        try {
          if (categoryCode) {
            return await PriceCalculatorService.getModifiersForCategory({
              categoryCode,
            });
          } else {
            return await PriceCalculatorService.getAllModifiers();
          }
        } catch (error) {
          console.error('Помилка при отриманні модифікаторів:', error);
          return [];
        }
      },
      enabled: true,
    });

    return {
      modifiers: mapModifiersFromApi(data),
      rawModifiers: data,
      isLoading,
      // Забезпечуємо доступ до помилки для обробки в UI
      error,
    };
  };

  /**
   * Функція для обчислення ціни з урахуванням модифікаторів (не React хук)
   */
  const calculatePrice = async (
    basePrice: number,
    categoryCode: string | undefined,
    itemName: string | undefined,
    appliedModifiers: AppliedModifier[],
    availableModifiers: PriceModifier[]
  ): Promise<PriceCalculationResult> => {
    if (!categoryCode || !itemName) {
      throw new Error('Необхідно вказати категорію та назву предмета');
    }

    try {
      const request = prepareCalculationRequest(
        basePrice,
        categoryCode,
        itemName,
        appliedModifiers,
        availableModifiers
      );

      // Використовуємо прямий API виклик, а не хук
      const result = await PriceCalculatorService.calculatePrice({
        requestBody: request,
      });

      // Формуємо результат у форматі фронтенду
      const calculationDetails = mapCalculationDetailsFromApi(
        result.calculationDetails || []
      );

      // Додаємо значення з форми до деталей розрахунку
      const detailsWithValues = calculationDetails.map((detail) => ({
        ...detail,
        value:
          appliedModifiers.find((m) => m.modifierId === detail.modifierId)
            ?.selectedValue || 0,
      }));

      return {
        basePrice,
        modifiersImpact: detailsWithValues,
        totalPrice: result.finalUnitPrice || basePrice,
      };
    } catch (error) {
      console.error('Помилка при розрахунку ціни:', error);
      throw error;
    }
  };

  /**
   * Хук для розрахунку ціни при зміні модифікаторів
   */
  const useCalculatePriceOnChange = (
    basePrice: number,
    categoryCode: string | undefined,
    itemName: string | undefined,
    appliedModifiers: AppliedModifier[],
    availableModifiers: PriceModifier[]
  ) => {
    return useQuery<PriceCalculationResult>({
      queryKey: [
        QUERY_KEYS.PRICE_CALCULATION,
        'calculate',
        categoryCode,
        itemName,
        appliedModifiers,
      ],
      queryFn: async () => {
        if (!categoryCode || !itemName) {
          throw new Error('Необхідно вказати категорію та назву предмета');
        }

        try {
          return await calculatePrice(
            basePrice,
            categoryCode,
            itemName,
            appliedModifiers,
            availableModifiers
          );
        } catch (error) {
          // При помилці API використовуємо локальний розрахунок
          return {
            basePrice,
            modifiersImpact: [],
            totalPrice: basePrice,
          };
        }
      },
      enabled: !!categoryCode && !!itemName && appliedModifiers.length > 0,
      // Використовуємо більший стандартний інтервал оновлення для розрахунків
      staleTime: 30000,
    });
  };

  return {
    // Низькорівневі запити до цінового сервісу
    useBasePrice,
    useCalculatePrice,
    useAllModifiers,
    useModifiersForCategory,

    // Розширені функції для використання в UI
    useBasePriceForItem,
    useModifiersForItem,
    calculatePrice,
    useCalculatePriceOnChange,

    // Допоміжні функції для перетворення даних
    mapModifierFromApi,
    mapModifiersFromApi,
    prepareCalculationRequest,
  };
};
