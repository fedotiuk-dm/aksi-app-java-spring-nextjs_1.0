import { useOrderWizardStore } from '@/features/order-wizard';
import { useCartOperations } from './useCartOperations';

/**
 * OrderWizard-specific cart operations
 * Automatically enables cart only when customer is selected
 * Centralizes the enabled logic for all OrderWizard components
 * 
 * Use this hook in OrderWizard components that need cart data.
 * For cart mutations without data loading (like activateCustomer), 
 * use useCartOperations(false) directly.
 */
export const useOrderWizardCart = () => {
  const { selectedCustomer } = useOrderWizardStore();
  const cartEnabled = !!selectedCustomer; // Enable cart only when customer selected
  
  return useCartOperations(cartEnabled);
};