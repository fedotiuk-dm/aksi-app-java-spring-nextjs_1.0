import { useOrderWizardStore } from '@/features/order-wizard';
import { useOrderWizardCart } from './useOrderWizardCart';
import { usePricingCalculationOperations } from './usePricingCalculationOperations';

/**
 * Centralized business logic for item operations
 * Following the same pattern as useCustomerOperations
 */
export const useItemOperations = () => {
  const { setEditingItemId } = useOrderWizardStore();
  const { cart, getCartItems, removeItem, isRemovingItem, errors } = useOrderWizardCart();
  const { calculation } = usePricingCalculationOperations(cart, false);

  const items = getCartItems();

  // Format enum value to human-readable string
  const formatEnumValue = (enumValue: string): string => {
    if (!enumValue) return '';
    return enumValue.charAt(0) + enumValue.slice(1).toLowerCase().replace(/_/g, ' ');
  };

  // Format item display name with category
  const getItemDisplayInfo = (item: typeof items[0]) => {
    // Find calculated price for this item
    const calculatedItem = calculation?.items?.find(calc => calc.priceListItemId === item.priceListItemId);
    
    console.log('🏷️ Item display info:', {
      id: item.id,
      name: item.priceListItem?.name,
      cartPricing: item.pricing,
      calculatedPricing: calculatedItem,
      modifiers: item.modifiers
    });
    
    return {
      name: item.priceListItem?.name || 'Невідомий предмет',
      category: formatEnumValue(item.priceListItem?.categoryCode || ''),
      totalPrice: calculatedItem?.total || item.pricing?.total || 0,
      basePrice: calculatedItem?.basePrice || item.pricing?.basePrice || 0,
      characteristics: item.characteristics,
      modifiers: item.modifiers || []
    };
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
    return items.map(item => ({
      ...item,
      display: getItemDisplayInfo(item)
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
    error
  };
};