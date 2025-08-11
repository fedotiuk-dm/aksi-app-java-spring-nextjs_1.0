import { useMemo } from 'react';
import { useGetCustomer } from '@api/customer';
import { useGetBranchById } from '@api/branch';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useCartOperations } from './useCartOperations';

/**
 * Centralized customer and branch state management
 * Derives actual customer/branch data from React Query based on stored IDs
 * Provides single source of truth for customer/branch information
 */
export const useCustomerState = () => {
  const { 
    selectedCustomerId, 
    selectedBranchId,
    setSelectedCustomerId,
    setSelectedBranchId 
  } = useOrderWizardStore();
  
  // Only enable cart operations when customer is actually selected
  const cartEnabled = !!selectedCustomerId;
  const { cart } = useCartOperations(cartEnabled);

  // Get customer data from React Query
  const { data: selectedCustomer, isLoading: loadingCustomer } = useGetCustomer(
    selectedCustomerId || '',
    {
      query: {
        enabled: !!selectedCustomerId
      }
    }
  );

  // Get branch data from React Query  
  const { data: selectedBranch, isLoading: loadingBranch } = useGetBranchById(
    selectedBranchId || '',
    {
      query: {
        enabled: !!selectedBranchId
      }
    }
  );

  // Derive current customer from cart if available
  const currentCustomerId = useMemo(() => {
    return cart?.customerId || selectedCustomerId;
  }, [cart?.customerId, selectedCustomerId]);

  // Check if customer selection is consistent
  const isCustomerConsistent = useMemo(() => {
    if (!cart?.customerId || !selectedCustomerId) return true;
    return cart.customerId === selectedCustomerId;
  }, [cart?.customerId, selectedCustomerId]);

  const hasSelectedCustomer = !!selectedCustomerId;
  const hasSelectedBranch = !!selectedBranchId;
  const isLoading = loadingCustomer || loadingBranch;

  return {
    // Current state
    selectedCustomer,
    selectedBranch,
    selectedCustomerId,
    selectedBranchId,
    currentCustomerId,

    // State setters
    setSelectedCustomerId,
    setSelectedBranchId,

    // Computed flags
    hasSelectedCustomer,
    hasSelectedBranch,
    isCustomerConsistent,
    
    // Loading state
    isLoading,
    loadingCustomer,
    loadingBranch
  };
};