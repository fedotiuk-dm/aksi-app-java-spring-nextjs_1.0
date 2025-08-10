import { useItemSelectionOperations } from './useItemSelectionOperations';
import { formatEnumValue } from '../utils/formatting.utils';
import React from "react";

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


  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement> | (Event & { target: { value: unknown; name: string; } })) => {
    const value = (event.target as { value: unknown }).value as string;
    handleCategorySelect(value);
  };

  return {
    // Data
    categoryOptions,
    selectedCategory: selectedCategoryCode,
    
    // Operations
    formatCategoryName: formatEnumValue,
    handleCategoryChange,
    
    // State
    isLoading: loadingCategories,
    canSelectItem
  };
};