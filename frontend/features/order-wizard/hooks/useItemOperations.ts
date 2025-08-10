import { useOrderWizardStore } from '@/features/order-wizard';
import { useOrderWizardCart } from './useOrderWizardCart';
import { usePricingCalculationOperations } from './usePricingCalculationOperations';
import { getItemDisplayInfo as utilsGetItemDisplayInfo } from '../utils/item.utils';

/**
 * Centralized business logic for item operations
 * Following the same pattern as useCustomerOperations
 */
export const useItemOperations = () => {
  const { setEditingItemId } = useOrderWizardStore();
  const { cart, getCartItems, removeItem, isRemovingItem, errors } = useOrderWizardCart();
  const { calculation } = usePricingCalculationOperations(cart, false);

  const items = getCartItems();

  const getItemDisplayInfo = (item: (typeof items)[0]) => {
    const calculatedItem = calculation?.items?.find(
      (calc) => calc.priceListItemId === item.priceListItemId
    );
    return utilsGetItemDisplayInfo(item, calculatedItem);
  };

  // Start editing item
  const startEditingItem = (itemId: string) => {
    setEditingItemId(itemId);
  };

  // Delete item from cart
  const deleteItem = async (itemId: string) => {
    await removeItem(itemId);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingItemId(null);
  };

  // Get formatted items for display
  const getFormattedItems = () => {
    return items.map((item) => ({
      ...item,
      display: getItemDisplayInfo(item),
    }));
  };

  const isLoading = isRemovingItem;
  const error = errors.removeItem;

  return {
    // Data
    items,
    formattedItems: getFormattedItems(),
    calculation,

    // Operations
    startEditingItem,
    deleteItem,
    cancelEditing,
    getItemDisplayInfo,

    // State
    isLoading,
    error,
  };
};
