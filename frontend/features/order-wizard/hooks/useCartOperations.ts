import {
  useGetCart,
  useAddCartItem,
  useUpdateCartItem,
  useRemoveCartItem,
  useUpdateCartModifiers,
  useCalculateCart,
  useActivateCustomerForCart,
  useClearCart,
} from '@api/cart';
import type {
  AddCartItemRequest,
  UpdateCartItemRequest,
  UpdateCartModifiersRequest,
  ActivateCustomerRequest,
} from '@api/cart';

/**
 * Centralized cart operations as a thin wrapper around Orval API
 * Provides a clean, consistent interface for all cart operations in OrderWizard
 */
export const useCartOperations = (enabled = false) => {
  // Query hook for getting cart data - only when explicitly enabled
  const {
    data: cart,
    refetch: refetchCart,
    ...cartQuery
  } = useGetCart({
    query: { enabled },
  });

  // Mutation hooks for cart operations
  const addItemMutation = useAddCartItem();
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();
  const updateModifiersMutation = useUpdateCartModifiers();
  const calculateCartMutation = useCalculateCart();
  const activateCustomerMutation = useActivateCustomerForCart();
  const clearCartMutation = useClearCart();

  // Cart data operations
  const getCartData = () => cart;
  const getCartItems = () => cart?.items || [];
  const getCartPricing = () => cart?.pricing;
  const getCartCustomer = () => cart?.customerId;

  // Centralized refetch helper
  const refetchAfter = async <T>(promise: Promise<T>) => {
    const result = await promise;
    await refetchCart();
    return result;
  };

  // Item operations
  const addItem = async (itemData: AddCartItemRequest) => {
    return refetchAfter(addItemMutation.mutateAsync({ data: itemData }));
  };

  const updateItem = async (itemId: string, itemData: UpdateCartItemRequest) => {
    return refetchAfter(updateItemMutation.mutateAsync({ itemId, data: itemData }));
  };

  const removeItem = async (itemId: string) => {
    return refetchAfter(removeItemMutation.mutateAsync({ itemId }));
  };

  // Cart-level operations
  const updateModifiers = async (modifiers: UpdateCartModifiersRequest) =>
    refetchAfter(updateModifiersMutation.mutateAsync({ data: modifiers }));

  const calculateCart = async () => refetchAfter(calculateCartMutation.mutateAsync());

  const activateCustomer = async (customerData: ActivateCustomerRequest) =>
    refetchAfter(activateCustomerMutation.mutateAsync({ data: customerData }));

  const clearCart = async () => refetchAfter(clearCartMutation.mutateAsync());

  // Refresh cart data
  const refreshCart = async () => {
    return await refetchCart();
  };

  // Loading states
  const isAddingItem = addItemMutation.isPending;
  const isUpdatingItem = updateItemMutation.isPending;
  const isRemovingItem = removeItemMutation.isPending;
  const isUpdatingModifiers = updateModifiersMutation.isPending;
  const isCalculating = calculateCartMutation.isPending;
  const isActivatingCustomer = activateCustomerMutation.isPending;
  const isClearing = clearCartMutation.isPending;

  const isLoading = cartQuery.isLoading;
  const isMutating =
    isAddingItem ||
    isUpdatingItem ||
    isRemovingItem ||
    isUpdatingModifiers ||
    isCalculating ||
    isActivatingCustomer ||
    isClearing;

  // Error states
  const errors = {
    cart: cartQuery.error,
    addItem: addItemMutation.error,
    updateItem: updateItemMutation.error,
    removeItem: removeItemMutation.error,
    updateModifiers: updateModifiersMutation.error,
    calculate: calculateCartMutation.error,
    activateCustomer: activateCustomerMutation.error,
    clear: clearCartMutation.error,
  };

  return {
    // Data access
    cart,
    getCartData,
    getCartItems,
    getCartPricing,
    getCartCustomer,

    // Operations
    addItem,
    updateItem,
    removeItem,
    updateModifiers,
    calculateCart,
    activateCustomer,
    clearCart,
    refreshCart,

    // State
    isLoading,
    isMutating,
    isAddingItem,
    isUpdatingItem,
    isRemovingItem,
    isUpdatingModifiers,
    isCalculating,
    isActivatingCustomer,
    isClearing,

    // Errors
    errors,
    hasError: Object.values(errors).some((error) => error !== null),
  };
};
