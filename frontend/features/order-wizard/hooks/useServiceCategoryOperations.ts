import { useItemSelectionOperations } from './useItemSelectionOperations';

/**
 * Business logic for service category operations
 * Uses master item selection workflow
 */
export const useServiceCategoryOperations = () => {
  const {
    categoryOptions,
    selectedCategoryCode,
    handleCategorySelect,
    loadingCategories,
    canSelectItem
  } = useItemSelectionOperations();

  // Format enum value to human-readable string (consistent with other operations)
  const formatCategoryName = (categoryCode: string): string => {
    if (!categoryCode) return '';
    return categoryCode.charAt(0) + categoryCode.slice(1).toLowerCase().replace(/_/g, ' ');
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement> | (Event & { target: { value: unknown; name: string; } })) => {
    const value = (event.target as { value: unknown }).value as string;
    handleCategorySelect(value);
  };

  return {
    // Data
    categoryOptions,
    selectedCategory: selectedCategoryCode,
    
    // Operations
    formatCategoryName,
    handleCategoryChange,
    
    // State
    isLoading: loadingCategories,
    canSelectItem
  };
};