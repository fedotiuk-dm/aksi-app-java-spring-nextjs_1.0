import { useEffect, useMemo, useRef } from 'react';
import { useCalculatePrice } from '@api/pricing';
import type { CartInfo } from '@api/cart';

/**
 * Business logic for automatic pricing calculation
 * Handles real-time price updates when cart changes
 */
export const usePricingCalculationOperations = (
  cart: CartInfo | undefined,
  includeGlobalModifiers = true
) => {
  const pricingMutation = useCalculatePrice();

  // Stable calculation key to avoid effect thrashing
  const calcKey = useMemo(() => {
    if (!cart || cart.items.length === 0) return null;
    return JSON.stringify({
      items: cart.items.map((i) => ({
        id: i.id,
        qty: i.quantity,
        ch: i.characteristics,
        mods: i.modifiers?.map((m) => m.code) || [],
      })),
      gm: includeGlobalModifiers
        ? {
            u: cart.globalModifiers?.urgencyType,
            d: cart.globalModifiers?.discountType,
            p: cart.globalModifiers?.discountPercentage,
          }
        : undefined,
    });
  }, [cart, includeGlobalModifiers]);

  const lastRunKeyRef = useRef<string | null>(null);

  // Automatically calculate price when cart changes (guarded)
  useEffect(() => {
    if (!cart || cart.items.length === 0 || !calcKey) return;
    if (pricingMutation.isPending) return;
    if (lastRunKeyRef.current === calcKey) return;

    lastRunKeyRef.current = calcKey;

    pricingMutation.mutate({
      data: {
        items: cart.items.map((item) => ({
          priceListItemId: item.priceListItemId,
          quantity: item.quantity,
          characteristics: item.characteristics,
          modifierCodes: item.modifiers?.map((m) => m.code) || [],
        })),
        globalModifiers: includeGlobalModifiers ? cart.globalModifiers : undefined,
      },
    });
  }, [cart, calcKey, includeGlobalModifiers, pricingMutation]);


  return {
    // State
    isCalculating: pricingMutation.isPending,
    error: pricingMutation.error,
    calculation: pricingMutation.data,

    // Operations
    calculatePrice: pricingMutation.mutate,
    resetCalculation: pricingMutation.reset,
    // Compact summary for UI header (modifiers per item)
    summary: (pricelist: typeof pricingMutation.data | undefined = pricingMutation.data) => {
      const data = pricelist as unknown as
        | {
            items?: Array<{
              priceListItemId: string;
              itemName?: string;
              calculations?: {
                modifiers?: Array<{ code: string; name: string; amount: number }>;
              };
              total?: number;
            }>;
          }
        | undefined;
      if (!data?.items)
        return [] as Array<{ id: string; name: string; modifiers: string[]; total?: number }>;
      return data.items.map((it) => ({
        id: it.priceListItemId,
        name: it.itemName || '',
        modifiers: (it.calculations?.modifiers || []).map((m) => m.name),
        total: it.total,
      }));
    },
  };
};
