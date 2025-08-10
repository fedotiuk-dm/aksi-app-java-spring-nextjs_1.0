import { useOrderWizardCart, usePricingCalculationOperations } from '@features/order-wizard/hooks';

export const useFinancialSummaryOperations = () => {
  const { cart, getCartItems } = useOrderWizardCart();
  const { calculation, isCalculating, error } = usePricingCalculationOperations(cart, true);

  const items = getCartItems();
  const hasItems = items.length > 0;
  const totals = calculation?.totals;

  return {
    // Data
    calculation,
    cart,
    totals,
    hasItems,
    
    // State  
    isCalculating,
    error
  };
};