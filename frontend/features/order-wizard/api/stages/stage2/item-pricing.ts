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
  PriceCalculationResult,
  PriceModifier,
} from '@/features/order-wizard/model/schema/item-pricing.schema';
import { QUERY_KEYS } from '../../helpers/query-keys';

// Тип для API помилок
interface ApiError {
  status?: number;
  message?: string;
}

/**
 * Хук для роботи з ціноутворенням предметів замовлення та ціновим калькулятором
 */
export const useItemPricing = () => {
  /**
   * Перетворює ModifierDTO з API в PriceModifier для фронтенду
   */
  const mapModifierFromApi = useCallback(
    (apiModifier: ModifierDTO): PriceModifier => {
      // Визначення основних параметрів модифікатора
      const type = apiModifier.type || '';
      let value = apiModifier.value || 0;
      let minValue = apiModifier.minValue;
      let maxValue = apiModifier.maxValue;
      let isPercentage = apiModifier.percentage ?? false;
      let isDiscount = apiModifier.discount ?? false;

      // Визначаємо категорію модифікатора
      let category = apiModifier.category || 'GENERAL';

      // Якщо немає категорії з API, визначаємо на основі типу
      if (!apiModifier.category) {
        if (type.includes('TEXTILE')) {
          category = 'TEXTILE';
        } else if (type.includes('LEATHER')) {
          category = 'LEATHER';
        }
      }

      // Якщо значення не визначені через API, намагаємося отримати їх з опису
      if (apiModifier.value === undefined) {
        const description = apiModifier.description || '';
        const changeDesc = apiModifier.changeDescription || '';

        // Шукаємо числові значення
        const percentMatches =
          changeDesc.match(/([\d.]+)%/) || description.match(/([\d.]+)%/);
        const rangeMatches =
          description.match(/від\s+([\d.]+)\s+до\s+([\d.]+)/) ||
          changeDesc.match(/від\s+([\d.]+)\s+до\s+([\d.]+)/);
        const valueMatches =
          changeDesc.match(/([\d.]+)/) || description.match(/([\d.]+)/);

        if (rangeMatches && minValue === undefined && maxValue === undefined) {
          // Це модифікатор з діапазоном
          minValue = parseFloat(rangeMatches[1]);
          maxValue = parseFloat(rangeMatches[2]);
          value = minValue; // За замовчуванням беремо мінімальне значення
        } else if (percentMatches && value === 0) {
          // Це відсотковий модифікатор
          value = parseFloat(percentMatches[1]);
          isPercentage = true;
        } else if (valueMatches && value === 0) {
          // Якщо знайдено якесь числове значення
          value = parseFloat(valueMatches[1]);
        }
      }

      return {
        id: apiModifier.id || '',
        name: apiModifier.name || '',
        type: type,
        description: apiModifier.description || '',
        category: category,
        isPercentage: isPercentage,
        value: value,
        minValue: minValue,
        maxValue: maxValue,
        isDiscount: isDiscount,
      };
    },
    []
  );

  /**
   * Мапить всі модифікатори з API в формат фронтенду
   */
  const mapModifiersFromApi = useCallback(
    (apiModifiers: ModifierDTO[] = []): PriceModifier[] => {
      return apiModifiers.map(mapModifierFromApi);
    },
    [mapModifierFromApi]
  );

  /**
   * Перетворює деталі розрахунку з API в формат фронтенду
   */
  const mapCalculationDetailsFromApi = useCallback(
    (
      apiDetails: ModifierCalculationDetail[] = []
    ): PriceCalculationResult['modifiersImpact'] => {
      return apiDetails.map((detail: ModifierCalculationDetail) => ({
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
      console.log('Підготовка запиту для розрахунку ціни', {
        basePrice,
        categoryCode,
        itemName,
        кількість_модифікаторів: appliedModifiers.length,
      });

      // Розділяємо модифікатори на різні типи
      const simpleModifierIds: string[] = [];
      const rangeModifierValues: RangeModifierValueDTO[] = [];
      const fixedModifierQuantities: FixedModifierQuantityDTO[] = [];

      // Перевіряємо валідність вхідних даних
      if (!categoryCode || !itemName) {
        console.error(
          'Відсутній код категорії або назва предмета в запиті розрахунку ціни'
        );
        return {
          categoryCode: categoryCode || '',
          itemName: itemName || '',
          quantity: 1, // Завжди додаємо quantity=1 за замовчуванням
          modifierIds: [],
          rangeModifierValues: [],
          fixedModifierQuantities: [],
        };
      }

      // Обробляємо кожен модифікатор і групуємо за типами
      appliedModifiers.forEach((applied) => {
        const modifier = availableModifiers.find(
          (m) => m.id === applied.modifierId
        );
        if (!modifier) {
          console.warn(
            `Модифікатор з ID ${applied.modifierId} не знайдено в доступних модифікаторах`
          );
          return;
        }

        console.log(`Обробка модифікатора: ${modifier.name} (${modifier.id})`);

        if (
          modifier.minValue !== undefined &&
          modifier.maxValue !== undefined
        ) {
          // Діапазонний модифікатор
          let percentage = 0;

          if (typeof applied.selectedValue === 'number') {
            percentage = Math.max(
              modifier.minValue,
              Math.min(applied.selectedValue, modifier.maxValue)
            );
          } else {
            percentage = modifier.minValue;
            console.warn(
              `Для діапазонного модифікатора ${modifier.name} не вказано значення, використано мінімальне: ${percentage}`
            );
          }

          rangeModifierValues.push({
            modifierId: applied.modifierId,
            percentage: percentage,
          });
        } else if (!modifier.isPercentage) {
          // Фіксований модифікатор (кількість)
          const quantity = Math.max(1, Math.round(applied.selectedValue || 1));

          fixedModifierQuantities.push({
            modifierId: applied.modifierId,
            quantity: quantity,
          });
        } else {
          // Простий відсотковий модифікатор
          simpleModifierIds.push(applied.modifierId);
        }
      });

      return {
        categoryCode: categoryCode.trim(),
        itemName: itemName.trim(),
        quantity: 1, // Завжди додаємо quantity=1 для POST-запиту
        modifierIds: simpleModifierIds,
        rangeModifierValues,
        fixedModifierQuantities,
      };
    },
    []
  );

  /**
   * Отримання базової ціни для предмета
   */
  const useBasePrice = (
    categoryCode: string | undefined,
    itemName: string | undefined
  ) => {
    return useQuery<PriceCalculationResponseDTO>({
      queryKey: [QUERY_KEYS.BASE_PRICE, categoryCode, itemName],
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
   * Отримує базову ціну для предмета з розширеним інтерфейсом
   */
  const useBasePriceForItem = (categoryCode?: string, itemName?: string) => {
    const result = useQuery({
      queryKey: [QUERY_KEYS.BASE_PRICE, categoryCode, itemName],
      queryFn: async () => {
        if (!categoryCode || !itemName) {
          throw new Error('Необхідні параметри не вказані');
        }

        try {
          const response = await PriceCalculatorService.getBasePrice({
            categoryCode,
            itemName,
          });

          if (!response) {
            console.warn('Отримано порожню відповідь при запиті базової ціни');
            return 0;
          }

          return response.baseUnitPrice || 0;
        } catch (error) {
          console.error('Помилка при отриманні базової ціни:', error);
          return 0;
        }
      },
      enabled: !!categoryCode && !!itemName,
    });

    return {
      basePrice: result.data || 0,
      isLoading: result.isLoading,
      error: result.error,
    };
  };

  /**
   * Отримання всіх доступних модифікаторів ціни
   */
  const useAllModifiers = () => {
    return useQuery<PriceModifier[]>({
      queryKey: [QUERY_KEYS.PRICE_MODIFIERS, 'all'],
      queryFn: async () => {
        try {
          const response = await PriceCalculatorService.getAllModifiers();
          return mapModifiersFromApi(response || []);
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
  const useModifiersForCategory = (categoryCode?: string) => {
    return useQuery<PriceModifier[]>({
      queryKey: [QUERY_KEYS.PRICE_MODIFIERS, 'category', categoryCode],
      queryFn: async () => {
        if (!categoryCode) {
          console.log(
            'Код категорії не вказано, повертаємо порожній список модифікаторів'
          );
          return [];
        }

        try {
          const response = await PriceCalculatorService.getModifiersForCategory(
            {
              categoryCode,
            }
          );

          if (!response || response.length === 0) {
            console.log(
              `Не знайдено модифікаторів для категорії ${categoryCode}`
            );
            return [];
          }

          console.log(
            `Отримано ${response.length} модифікаторів для категорії ${categoryCode}`
          );
          return mapModifiersFromApi(response);
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
   * Отримує модифікатори ціни та конвертує їх у формат фронтенду
   */
  const useModifiersForItem = (categoryCode?: string) => {
    const result = useQuery({
      queryKey: [QUERY_KEYS.PRICE_MODIFIERS, 'item', categoryCode],
      queryFn: async () => {
        if (!categoryCode) {
          throw new Error('Код категорії не вказано');
        }

        try {
          console.log(`Отримання модифікаторів для категорії: ${categoryCode}`);
          const response = await PriceCalculatorService.getModifiersForCategory(
            {
              categoryCode,
            }
          );

          if (!response || response.length === 0) {
            console.log(
              `Не знайдено модифікаторів для категорії ${categoryCode}`
            );
            return [];
          }

          console.log(
            `Отримано ${response.length} модифікаторів для категорії ${categoryCode}`
          );
          const mappedModifiers = mapModifiersFromApi(response);

          // Логуємо кількість модифікаторів за категоріями
          const generalModifiers = mappedModifiers.filter(
            (m) => m.category === 'GENERAL'
          );
          const textileModifiers = mappedModifiers.filter(
            (m) => m.category === 'TEXTILE'
          );
          const leatherModifiers = mappedModifiers.filter(
            (m) => m.category === 'LEATHER'
          );

          console.log(`Класифікація модифікаторів для ${categoryCode}:`, {
            загальні: generalModifiers.length,
            текстильні: textileModifiers.length,
            шкіряні: leatherModifiers.length,
          });

          return mappedModifiers;
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

    return {
      modifiers: result.data || [],
      isLoading: result.isLoading,
      error: result.error,
    };
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
   * Виконує розрахунок ціни через API
   */
  const calculatePrice = async (
    basePrice: number,
    categoryCode: string,
    itemName: string,
    appliedModifiers: AppliedModifier[],
    availableModifiers: PriceModifier[]
  ): Promise<PriceCalculationResult> => {
    try {
      console.log('Розрахунок ціни з модифікаторами:', {
        категорія: categoryCode,
        предмет: itemName,
        модифікаторів: appliedModifiers.length,
      });

      // Якщо немає застосованих модифікаторів, повертаємо базову ціну
      if (appliedModifiers.length === 0) {
        console.log('Немає застосованих модифікаторів, повертаємо базову ціну');
        return {
          basePrice: basePrice,
          totalPrice: basePrice,
          modifiersImpact: [],
        };
      }

      // Перетворюємо параметри в формат для API
      const requestData = prepareCalculationRequest(
        basePrice,
        categoryCode,
        itemName,
        appliedModifiers,
        availableModifiers
      );

      try {
        const response = await PriceCalculatorService.calculatePrice({
          requestBody: requestData,
        });

        console.log('Успішна відповідь від API розрахунку ціни:', response);

        // Перетворюємо відповідь в формат для фронтенду
        const result: PriceCalculationResult = {
          basePrice: response.baseUnitPrice || basePrice,
          totalPrice: response.finalUnitPrice || basePrice,
          modifiersImpact: mapCalculationDetailsFromApi(
            response.calculationDetails || []
          ),
        };

        // Додаємо значення модифікаторів з форми
        result.modifiersImpact.forEach((impact) => {
          const appliedModifier = appliedModifiers.find(
            (m) => m.modifierId === impact.modifierId
          );
          if (appliedModifier) {
            impact.value = appliedModifier.selectedValue;
          }
        });

        return result;
      } catch (error) {
        // Обробка помилок API
        console.error('Помилка при запиті до API calculatePrice:', error);

        // Перевіряємо, чи це помилка EntityNotFoundException (404)
        const isErrorObject = error && typeof error === 'object';
        if (isErrorObject && 'status' in error) {
          const apiError = error as ApiError;
          const statusCode = apiError.status;
          const errorMessage = apiError.message;

          console.error(
            `API помилка [${statusCode}]: ${errorMessage || 'Невідома помилка'}`
          );

          // Повертаємо базову ціну в разі помилки
          return {
            basePrice: basePrice,
            totalPrice: basePrice,
            modifiersImpact: appliedModifiers.map((mod) => {
              const modifierInfo = availableModifiers.find(
                (m) => m.id === mod.modifierId
              );
              return {
                modifierId: mod.modifierId,
                name: modifierInfo?.name || 'Невідомий модифікатор',
                value: mod.selectedValue,
                impact: 0, // Помилка, тому вплив невідомий
              };
            }),
          };
        }

        throw error; // Перекидаємо всі інші помилки
      }
    } catch (error) {
      console.error('Критична помилка при розрахунку ціни:', error);
      // В разі помилки повертаємо базову ціну
      return {
        basePrice: basePrice,
        totalPrice: basePrice,
        modifiersImpact: [],
      };
    }
  };

  /**
   * Хук для автоматичного розрахунку ціни при зміні модифікаторів
   */
  const useCalculatePriceOnChange = (
    basePrice: number,
    categoryCode: string | undefined,
    itemName: string | undefined,
    appliedModifiers: AppliedModifier[],
    availableModifiers: PriceModifier[],
    updateTimestamp?: number // Для примусового оновлення
  ) => {
    const queryKey = [
      QUERY_KEYS.PRICE_CALCULATION,
      'calculate',
      categoryCode,
      itemName,
      basePrice,
      JSON.stringify(appliedModifiers),
      updateTimestamp || 0,
    ];

    const shouldFetch =
      !!categoryCode &&
      !!itemName &&
      availableModifiers.length > 0 &&
      basePrice > 0;

    return useQuery<PriceCalculationResult>({
      queryKey,
      queryFn: async () => {
        if (!categoryCode || !itemName) {
          return {
            basePrice,
            totalPrice: basePrice,
            modifiersImpact: [],
          };
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
          console.error('Помилка при розрахунку ціни:', error);
          return {
            basePrice,
            totalPrice: basePrice,
            modifiersImpact: [],
          };
        }
      },
      enabled: shouldFetch,
      staleTime: 1000, // Результат вважається актуальним 1 секунду
      gcTime: 60 * 1000, // Зберігати дані в кеші 60 секунд
      refetchOnWindowFocus: false,
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
