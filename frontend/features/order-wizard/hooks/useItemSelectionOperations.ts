import { useListPriceListItems, useGetAllCategories } from '@api/priceList';
import { useListPriceModifiers } from '@api/pricing';
import { useOrderWizardStore } from '@/features/order-wizard';
import type { PriceListItemInfoCategoryCode } from '@api/priceList';
import { getColorOptions, getBasePrice, type ItemWithPricing } from '@/features/order-wizard/utils';

/**
 * Master business logic for item selection workflow
 * Handles Category → Items → Color/Pricing → Modifiers chain
 * Uses centralized store for state management
 */
export const useItemSelectionOperations = () => {
  const {
    selectedCategoryCode,
    selectedItemId,
    isBlackCategory,
    setSelectedCategoryCode,
    setSelectedItemId,
    setIsBlackCategory,
    resetItemSelection,
  } = useOrderWizardStore();

  // API calls - thin wrappers around Orval
  const { data: categoriesData, isLoading: loadingCategories } = useGetAllCategories();
  const { data: itemsData, isLoading: loadingItems } = useListPriceListItems(
    selectedCategoryCode ? { categoryCode: selectedCategoryCode as PriceListItemInfoCategoryCode } : undefined
  );
  const { data: modifiersData, isLoading: loadingModifiers } = useListPriceModifiers();

  // Simple data transformations
  const categoryOptions = (categoriesData || []).map((category) => ({
    value: category.code || '',
    label: category.name || '',
  }));

  const availableItems: ItemWithPricing[] = (itemsData?.priceListItems || []).map((item) => ({
    ...item,
    name: item.name,
    basePrice: item.basePrice,
    priceColor: item.priceColor,
    priceBlack: item.priceBlack,
    hasColorPrice: !!item.priceColor,
    hasBlackPrice: !!item.priceBlack,
  }));

  const availableModifiers = modifiersData?.modifiers || [];

  // Handle category selection
  const handleCategorySelect = (categoryCode: string) => {
    setSelectedCategoryCode(categoryCode as PriceListItemInfoCategoryCode);
    setSelectedItemId(''); // Reset item selection
    setIsBlackCategory(false); // Reset color logic
  };

  // Handle item selection
  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);

    const item = availableItems.find((i) => i.id === itemId);
    if (item) {
      // Determine if this item has only black pricing
      setIsBlackCategory(!!item.priceBlack && !item.hasColorPrice);
    }
  };

  const selectedItem = availableItems.find(i => i.id === selectedItemId);

  return {
    // Data
    categoryOptions,
    availableItems,
    availableModifiers,
    colorOptions: getColorOptions(selectedItem),

    // State
    selectedCategoryCode,
    selectedItemId,
    isBlackCategory,

    // Operations
    handleCategorySelect,
    handleItemSelect,
    getBasePrice,
    resetSelection: resetItemSelection,

    // Loading states
    loadingCategories,
    loadingItems,
    loadingModifiers,

    // Computed flags
    canSelectItem: !!selectedCategoryCode,
    canSelectColor: !!selectedItemId,
    canSelectModifiers: !!selectedItemId,
    hasItemsAvailable: availableItems.length > 0,
  };
};
