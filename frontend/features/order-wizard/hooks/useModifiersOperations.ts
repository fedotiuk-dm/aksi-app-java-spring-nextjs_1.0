import { useListPriceModifiers } from '@api/pricing';
import { useOrderWizardStore } from '@/features/order-wizard';
import { filterModifiersByCategory, getFormattedModifiers } from '@/features/order-wizard/utils';

export const useModifiersOperations = () => {
  const {
    selectedCategoryCode,
    selectedModifiers,
    addSelectedModifier,
    removeSelectedModifier,
    resetSelectedModifiers,
  } = useOrderWizardStore();
  
  const { data: modifiersData, isLoading, error } = useListPriceModifiers();

  const filteredModifiers = filterModifiersByCategory(
    modifiersData?.modifiers || [], 
    selectedCategoryCode
  );

  const handleModifierChange = (modifierId: string, checked: boolean) => {
    if (checked) {
      addSelectedModifier(modifierId);
    } else {
      removeSelectedModifier(modifierId);
    }
  };

  return {
    // Data
    modifiers: getFormattedModifiers(filteredModifiers, selectedModifiers),
    selectedModifiers,

    // Operations
    handleModifierChange,
    resetSelection: resetSelectedModifiers,

    // State
    isLoading,
    error,
  };
};
