import { useItemSelectionOperations } from './useItemSelectionOperations';
import type { PriceListItemInfo } from '@api/priceList';
import { formatItemPricing } from '@/features/order-wizard/utils';

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
    selectedCategoryCode,
  } = useItemSelectionOperations();

  // Transform items for autocomplete format
  const itemOptions = availableItems.map((item) => ({
    ...item,
    label: `${item.name} (${formatItemPricing(item)})`,
    value: item.id,
  }));

  // Handle autocomplete selection
  const handleAutocompleteChange = (value: PriceListItemInfo | null) => {
    if (value?.id) handleItemSelect(value.id);
  };

  // Get selected item object
  const getSelectedItem = () => {
    return availableItems.find((item) => item.id === selectedItemId) || null;
  };

  return {
    // Data
    itemOptions,
    selectedItem: getSelectedItem(),
    selectedItemId,
    selectedCategoryCode,

    // Operations
    handleAutocompleteChange,

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
        : '',
  };
};
