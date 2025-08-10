import { useOrderWizardStore } from '@/features/order-wizard';
import { useCartOperations } from './useCartOperations';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import { useCartStore } from '@/features/cart';

/**
 * Comprehensive reset hook for OrderWizard
 * Clears all state and cache for clean session start
 */
export const useOrderWizardReset = () => {
  const { resetOrderWizard } = useOrderWizardStore();
  const { setSelectedCustomer: resetGlobalCartCustomer, closeCart, closeAddItemModal } = useCartStore();
  const { clearCart } = useCartOperations(false); // Mutations only, no cart loading
  const queryClient = useQueryClient();

  const resetCompleteSession = async () => {
    // 1. Clear all store state first
    resetOrderWizard();
    resetGlobalCartCustomer(null); // Clear global cart customer
    closeCart(); // Close cart drawer
    closeAddItemModal(); // Close add item modal
    
    // 2. Clear all React Query cache immediately
    queryClient.removeQueries({ queryKey: ['listPriceListItems'] });
    queryClient.removeQueries({ queryKey: ['getAllCategories'] });
    queryClient.removeQueries({ queryKey: ['listPriceModifiers'] });
    queryClient.removeQueries({ queryKey: ['getCart'] });
    queryClient.removeQueries({ queryKey: ['listCustomers'] });
    queryClient.removeQueries({ queryKey: ['calculatePrice'] });
    
    // 3. Try to clear cart on backend (may fail if cart is in bad state)
    try {
      await clearCart();
    } catch (error) {
      console.warn('Cart clear failed (cart may be in invalid state):', error);
      // If cart clear fails, invalidate cache to force fresh start
      queryClient.removeQueries({ queryKey: ['getCart'] });
    }
    
    // 4. Force refetch essential data for new session
    await queryClient.invalidateQueries({ queryKey: ['getAllCategories'] });
  };

  const forceLogoutAndRedirect = () => {
    // 1. Clear all stores
    resetOrderWizard();
    resetGlobalCartCustomer(null);
    closeCart();
    closeAddItemModal();
    useAuthStore.getState().logout();
    
    // 2. Clear all cache
    queryClient.clear();
    
    // 3. Redirect to login
    const callbackUrl = window.location.pathname + window.location.search;
    window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  };

  const resetItemSelectionOnly = () => {
    const { resetItemSelection } = useOrderWizardStore.getState();
    resetItemSelection();
    
    // Clear item-related cache
    queryClient.removeQueries({ queryKey: ['listPriceListItems'] });
    queryClient.removeQueries({ queryKey: ['calculatePrice'] });
  };

  return {
    resetCompleteSession,
    resetItemSelectionOnly,
    forceLogoutAndRedirect,
    
    // Quick reset functions for specific parts
    resetStore: resetOrderWizard
  };
};