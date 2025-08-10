import { useEffect } from 'react';
import { useCalculatePrice } from '@api/pricing';
import type { CartInfo } from '@api/cart';

/**
 * Business logic for automatic pricing calculation
 * Handles real-time price updates when cart changes
 */
export const usePricingCalculationOperations = (cart: CartInfo | undefined, includeGlobalModifiers = true) => {
  const pricingMutation = useCalculatePrice();

  // Automatically calculate price when cart changes
  useEffect(() => {
    if (cart && cart.items.length > 0) {
      const calculationData = {
        items: cart.items.map(item => ({
          priceListItemId: item.priceListItemId,
          quantity: item.quantity,
          characteristics: item.characteristics,
          modifierCodes: item.modifiers?.map(m => m.code) || []
        })),
        globalModifiers: includeGlobalModifiers ? cart.globalModifiers : undefined
      };
      
      console.log(`🧮 Calculating price for cart (${includeGlobalModifiers ? 'with' : 'without'} global modifiers):`, {
        ...calculationData,
        cartRaw: cart.items.map((item: any) => ({
          id: item.id,
          modifiers: item.modifiers,
          modifierCodes: item.modifiers?.map((m: any) => m.code)
        }))
      });
      
      pricingMutation.mutate({
        data: calculationData
      });
    }
  }, [cart, ...(includeGlobalModifiers ? [cart?.globalModifiers?.urgencyType, cart?.globalModifiers?.discountType, cart?.globalModifiers?.discountPercentage] : [])]);

  return {
    // State
    isCalculating: pricingMutation.isPending,
    error: pricingMutation.error,
    calculation: pricingMutation.data,
    
    // Operations
    calculatePrice: pricingMutation.mutate,
    resetCalculation: pricingMutation.reset
  };
};