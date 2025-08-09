import { useCallback } from 'react';
import {
  useGetCart,
  useUpdateCartModifiers,
  useCalculateCart,
  type UpdateCartModifiersRequest,
} from '@/shared/api/generated/cart';

type Urgency = 'NORMAL' | 'EXPRESS_48H' | 'EXPRESS_24H';
type Discount = 'NONE' | 'EVERCARD' | 'SOCIAL_MEDIA' | 'MILITARY' | 'OTHER';

export const useCart = (enabled: boolean) => {
  const cartQuery = useGetCart({ query: { enabled } });
  const updateModifiersMutation = useUpdateCartModifiers();
  const calculateCartMutation = useCalculateCart();

  const updateGlobalModifiers = useCallback(
    async (params: {
      urgencyType: Urgency;
      discountType: Discount;
      discountPercentage?: number;
    }) => {
      const body: UpdateCartModifiersRequest = {
        urgencyType: params.urgencyType,
        discountType: params.discountType,
        discountPercentage:
          params.discountType === 'OTHER' ? (params.discountPercentage ?? 0) : undefined,
      };
      await updateModifiersMutation.mutateAsync({ data: body });
      await cartQuery.refetch();
    },
    [updateModifiersMutation, cartQuery]
  );

  const recalculate = useCallback(async () => {
    await calculateCartMutation.mutateAsync();
    await cartQuery.refetch();
  }, [calculateCartMutation, cartQuery]);

  return {
    cartQuery,
    updateGlobalModifiers,
    recalculate,
    isUpdatingModifiers: updateModifiersMutation.isPending,
    isRecalculating: calculateCartMutation.isPending,
  };
};
