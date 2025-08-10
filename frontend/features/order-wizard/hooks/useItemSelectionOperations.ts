import { useListPriceListItems, useGetAllCategories } from '@api/priceList';
import { useListPriceModifiers } from '@api/pricing';
import { useOrderWizardStore } from '@/features/order-wizard';
import type { PriceListItemInfoCategoryCode } from '@api/priceList';

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
    resetItemSelection
  } = useOrderWizardStore();

  // API calls
  const { data: categoriesData, isLoading: loadingCategories } = useGetAllCategories();
  const { data: itemsData, isLoading: loadingItems } = useListPriceListItems(
    selectedCategoryCode ? { 
      categoryCode: selectedCategoryCode as PriceListItemInfoCategoryCode 
    } : undefined
  );
  const { data: modifiersData, isLoading: loadingModifiers } = useListPriceModifiers();

  // Transform categories for UI
  const categoryOptions = (categoriesData || []).map((category) => ({
    value: category.code || '',
    label: category.name || ''
  }));

  // Transform items for UI with pricing logic (from Orval schema)
  const availableItems = (itemsData?.priceListItems || []).map((item) => ({
    ...item,
    // Price logic based on actual data structure
    basePrice: item.basePrice,
    colorPrice: item.priceColor, // Actual color price from DB
    blackPrice: item.priceBlack, // Actual black price from DB
    hasColorPrice: !!item.priceColor,
    hasBlackPrice: !!item.priceBlack
  }));

  // All modifiers (filtering is done in useModifiersOperations)
  const availableModifiers = modifiersData?.modifiers || [];

  // Handle category selection
  const handleCategorySelect = (categoryCode: string) => {
    setSelectedCategoryCode(categoryCode);
    setSelectedItemId(''); // Reset item selection
    setIsBlackCategory(false); // Reset color logic
  };

  // Handle item selection
  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
    
    const item = availableItems.find(i => i.id === itemId);
    if (item) {
      // Determine if this item has only black pricing
      setIsBlackCategory(!!item.priceBlack && !item.hasColorPrice);
    }
  };

  // Get color options based on selected item
  const getColorOptions = () => {
    const selectedItem = availableItems.find(i => i.id === selectedItemId);
    if (!selectedItem) return [];

    const hasDistinctColorPrice = selectedItem.hasColorPrice && selectedItem.colorPrice !== selectedItem.basePrice;
    const hasDistinctBlackPrice = selectedItem.hasBlackPrice && selectedItem.blackPrice !== selectedItem.basePrice;
    
    // Single standard price when no variants
    if (!hasDistinctColorPrice && !hasDistinctBlackPrice) {
      return [{
        value: 'standard',
        label: `Стандартна ціна (${(selectedItem.basePrice / 100).toFixed(2)} ₴)`,
        price: selectedItem.basePrice
      }];
    }

    // Multiple price variants
    const options = [{
      value: 'base',
      label: `Базова ціна (${(selectedItem.basePrice / 100).toFixed(2)} ₴)`,
      price: selectedItem.basePrice
    }];

    if (hasDistinctColorPrice) {
      options.push({
        value: 'color', 
        label: `Кольорова ціна (${(selectedItem.colorPrice! / 100).toFixed(2)} ₴)`,
        price: selectedItem.colorPrice!
      });
    }

    if (hasDistinctBlackPrice) {
      options.push({
        value: 'black',
        label: `Чорна ціна (${(selectedItem.blackPrice! / 100).toFixed(2)} ₴)`,
        price: selectedItem.blackPrice!
      });
    }

    return options;
  };

  // Get base price for selected color type
  const getBasePrice = (colorType: string) => {
    const selectedItem = availableItems.find(i => i.id === selectedItemId);
    if (!selectedItem) return 0;
    
    const priceMap = {
      black: selectedItem.blackPrice || 0,
      color: selectedItem.colorPrice || 0,
      base: selectedItem.basePrice,
      standard: selectedItem.basePrice
    };
    
    return priceMap[colorType as keyof typeof priceMap] || selectedItem.basePrice;
  };

  return {
    // Data
    categoryOptions,
    availableItems,
    availableModifiers,
    colorOptions: getColorOptions(),
    
    // State
    selectedCategoryCode,
    selectedItemId,
    isBlackCategory,
    
    // Operations
    handleCategorySelect,
    handleItemSelect,
    getBasePrice,
    resetSelection: resetItemSelection, // Use store reset function
    
    // Loading states
    loadingCategories,
    loadingItems,
    loadingModifiers,
    
    // Computed flags
    canSelectItem: !!selectedCategoryCode,
    canSelectColor: !!selectedItemId,
    canSelectModifiers: !!selectedItemId,
    hasItemsAvailable: availableItems.length > 0
  };
};