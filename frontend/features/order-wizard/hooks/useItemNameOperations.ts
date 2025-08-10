import { useItemSelectionOperations } from './useItemSelectionOperations';

/**
 * Business logic for item name selection
 * Uses master item selection workflow with autocomplete
 */
export const useItemNameOperations = () => {
  const {
    availableItems,
    selectedItemId,
    handleItemSelect,
    loadingItems,
    canSelectItem,
    hasItemsAvailable,
    selectedCategoryCode
  } = useItemSelectionOperations();

  // Format pricing display for item options
  const formatPricing = (item: typeof availableItems[0]) => {
    const prices = [];
    // Show black price if available
    if (item.priceBlack) {
      prices.push(`Чорний: ${(item.priceBlack / 100).toFixed(2)} ₴`);
    }
    // Always show color price (basePrice)
    if (item.basePrice) {
      prices.push(`Кольоровий: ${(item.basePrice / 100).toFixed(2)} ₴`);
    }
    return prices.join(', ') || 'Ціна не вказана';
  };

  // Transform items for autocomplete format
  const itemOptions = availableItems.map(item => ({
    ...item,
    label: `${item.name} (${formatPricing(item)})`,
    value: item.id
  }));

  // Handle autocomplete selection
  const handleAutocompleteChange = (value: any) => {
    if (value && value.id) {
      handleItemSelect(value.id);
    }
  };

  // Get selected item object
  const getSelectedItem = () => {
    return availableItems.find(item => item.id === selectedItemId) || null;
  };

  return {
    // Data
    itemOptions,
    selectedItem: getSelectedItem(),
    selectedItemId,
    selectedCategoryCode,
    
    // Operations
    handleAutocompleteChange,
    formatPricing,
    
    // State
    isLoading: loadingItems,
    canSelectItem,
    hasItemsAvailable,
    isDisabled: !selectedCategoryCode,
    
    // Helper text
    helperText: !selectedCategoryCode 
      ? 'Спочатку виберіть категорію послуги'
      : !hasItemsAvailable 
        ? 'Немає доступних предметів для цієї категорії'
        : ''
  };
};