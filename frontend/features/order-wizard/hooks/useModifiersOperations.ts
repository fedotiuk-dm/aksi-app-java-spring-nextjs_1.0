import { useListPriceModifiers, ItemModifierType } from '@api/pricing';
import { useOrderWizardStore } from '@/features/order-wizard';

export const useModifiersOperations = () => {
  const { 
    selectedCategoryCode, 
    selectedModifiers, 
    addSelectedModifier, 
    removeSelectedModifier, 
    resetSelectedModifiers 
  } = useOrderWizardStore();
  const { data: modifiersData, isLoading, error } = useListPriceModifiers();
  
  // Filter modifiers by category - show general + category-specific
  const modifiers = (modifiersData?.modifiers || []).filter((modifier) => 
    !modifier.categoryRestrictions || 
    modifier.categoryRestrictions.length === 0 || 
    modifier.categoryRestrictions.includes(selectedCategoryCode as any)
  );

  const handleModifierChange = (modifierId: string, checked: boolean) => {
    if (checked) {
      addSelectedModifier(modifierId);
      console.log('✅ Modifier added:', modifierId, 'Total selected:', [...selectedModifiers, modifierId]);
    } else {
      removeSelectedModifier(modifierId);
      console.log('❌ Modifier removed:', modifierId, 'Total selected:', selectedModifiers.filter(id => id !== modifierId));
    }
  };

  const formatModifierValue = (value: number, type: string): string => {
    if (type === ItemModifierType.PERCENTAGE) {
      return `${(value / 100).toFixed(0)}%`;
    }
    if (type === ItemModifierType.FIXED) {
      return `+${(value / 100).toFixed(2)} ₴`;
    }
    return `${value}`;
  };

  const getFormattedModifiers = () => {
    return modifiers.map(modifier => ({
      ...modifier,
      displayValue: formatModifierValue(modifier.value, modifier.type),
      isSelected: selectedModifiers.includes(modifier.code)
    }));
  };

  const resetSelection = () => {
    resetSelectedModifiers();
  };

  return {
    // Data
    modifiers: getFormattedModifiers(),
    selectedModifiers,
    
    // Operations  
    handleModifierChange,
    resetSelection,
    
    // State
    isLoading,
    error
  };
};