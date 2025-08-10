import { useEffect } from 'react';
import { useCalculatePrice } from '@api/pricing';
import type { CartInfo } from '@api/cart';

/**
 * Business logic for automatic pricing calculation
 * Handles real-time price updates when cart changes
 */
export const usePricingCalculationOperations = (cart: CartInfo | undefined) => {
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
        globalModifiers: cart.globalModifiers
      };
      
      console.log('🧮 Calculating price for cart:', {
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
  }, [cart]);

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