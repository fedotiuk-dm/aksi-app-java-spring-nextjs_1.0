import { useMutation, useQuery } from '@tanstack/react-query';
import { PriceCalculationService } from '@/lib/api/generated';
import { QUERY_KEYS } from '../../helpers/query-keys';
import { mapCalculationDetailsFromApi } from '../utils/mapper';
import {
  PriceCalculationRequest,
  PriceCalculationResult,
  AppliedModifier,
  PriceModifier,
  PriceCalculationRequestDTO,
} from '../types';

const prepareCalculationRequest = (
  basePrice: number,
  categoryCode: string,
  itemName: string,
  appliedModifiers: AppliedModifier[],
  availableModifiers: PriceModifier[],
  quantity: number = 1,
  color?: string,
  expedited?: boolean,
  expeditePercent?: number,
  discountPercent?: number
): PriceCalculationRequestDTO => {
  const modifierCodes: string[] = [];
  const rangeModifierValues: { modifierCode: string; value: number }[] = [];
  const fixedModifierQuantities: { modifierCode: string; quantity: number }[] =
    [];

  appliedModifiers.forEach((applied) => {
    const modifier = availableModifiers.find(
      (m) => m.id === applied.modifierId
    );
    if (!modifier) {
      console.warn(`Модифікатор з ID ${applied.modifierId} не знайдено`);
      return;
    }

    if (modifier.minValue !== undefined && modifier.maxValue !== undefined) {
      const value =
        typeof applied.selectedValue === 'number'
          ? Math.max(
              modifier.minValue,
              Math.min(applied.selectedValue, modifier.maxValue)
            )
          : modifier.minValue;

      rangeModifierValues.push({
        modifierCode: applied.modifierId,
        value,
      });
    } else if (!modifier.isPercentage) {
      const quantity = Math.max(1, Math.round(applied.selectedValue || 1));
      fixedModifierQuantities.push({
        modifierCode: applied.modifierId,
        quantity,
      });
    } else {
      modifierCodes.push(applied.modifierId);
    }
  });

  return {
    categoryCode: categoryCode.trim(),
    itemName: itemName.trim(),
    quantity,
    color,
    expedited,
    expeditePercent,
    discountPercent,
    modifierCodes,
    rangeModifierValues,
    fixedModifierQuantities,
  };
};

export const useCalculatePrice = () => {
  return useMutation({
    mutationFn: async (
      request: PriceCalculationRequest
    ): Promise<PriceCalculationResult> => {
      const {
        basePrice,
        categoryCode,
        itemName,
        appliedModifiers,
        availableModifiers,
        quantity,
        color,
        expedited,
        expeditePercent,
        discountPercent,
      } = request;

      if (!categoryCode || !itemName) {
        throw new Error('Відсутній код категорії або назва предмета');
      }

      try {
        const apiRequest = prepareCalculationRequest(
          basePrice,
          categoryCode,
          itemName,
          appliedModifiers,
          availableModifiers,
          quantity,
          color,
          expedited,
          expeditePercent,
          discountPercent
        );

        const response = await PriceCalculationService.calculatePrice({
          requestBody: apiRequest,
        });

        return {
          ...response,
          basePrice: response.baseUnitPrice || 0,
          finalPrice: response.finalUnitPrice || 0,
          modifiersImpact: mapCalculationDetailsFromApi(
            response.calculationDetails || []
          ),
        };
      } catch (error) {
        console.error('Помилка при розрахунку ціни:', error);
        throw error;
      }
    },
  });
};

export const useCalculatePriceOnChange = (
  basePrice: number,
  categoryCode: string | undefined,
  itemName: string | undefined,
  appliedModifiers: AppliedModifier[],
  availableModifiers: PriceModifier[],
  quantity: number = 1,
  color?: string,
  expedited?: boolean,
  expeditePercent?: number,
  discountPercent?: number,
  updateTimestamp?: number
) => {
  const calculatePrice = useCalculatePrice();

  return useQuery<PriceCalculationResult>({
    queryKey: [
      QUERY_KEYS.PRICE_CALCULATION,
      categoryCode,
      itemName,
      appliedModifiers,
      quantity,
      color,
      expedited,
      expeditePercent,
      discountPercent,
      updateTimestamp,
    ],
    queryFn: async () => {
      if (!categoryCode || !itemName) {
        throw new Error('Відсутній код категорії або назва предмета');
      }

      const request: PriceCalculationRequest = {
        basePrice,
        categoryCode,
        itemName,
        appliedModifiers,
        availableModifiers,
        quantity,
        color,
        expedited,
        expeditePercent,
        discountPercent,
      };

      return await calculatePrice.mutateAsync(request);
    },
    enabled: Boolean(categoryCode && itemName && appliedModifiers.length > 0),
  });
};
