import { useCallback } from 'react';
import { useCalculatePrice } from '@/shared/api/generated/pricing';
import type { ItemCharacteristics } from '@/shared/api/generated/pricing';

export const useLiveItemPricing = () => {
  const calculate = useCalculatePrice();

  const calculateItem = useCallback(
    async (params: {
      priceListItemId: string;
      quantity: number;
      characteristics?: ItemCharacteristics;
      modifierCodes?: string[];
      globalModifiers?: {
        urgencyType?: 'NORMAL' | 'EXPRESS_48H' | 'EXPRESS_24H';
        discountType?: 'NONE' | 'EVERCARD' | 'SOCIAL_MEDIA' | 'MILITARY' | 'OTHER';
        discountPercentage?: number;
      };
    }) => {
      return calculate.mutateAsync({
        data: {
          items: [
            {
              priceListItemId: params.priceListItemId,
              quantity: params.quantity,
              characteristics: params.characteristics,
              modifierCodes: params.modifierCodes,
            },
          ],
          globalModifiers: params.globalModifiers,
        },
      });
    },
    [calculate]
  );

  return { calculateItem, state: calculate };
};
