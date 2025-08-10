import React, { useState } from 'react';
import type { ItemCharacteristics } from '@api/cart';
import { useItemSelectionOperations } from './useItemSelectionOperations';

export type CharacteristicsFormProps = {
  characteristics?: ItemCharacteristics;
  onChange?: (characteristics: ItemCharacteristics) => void;
};

type UseCharacteristicsOperationsProps = CharacteristicsFormProps;

export const useCharacteristicsOperations = (props?: UseCharacteristicsOperationsProps) => {
  const { characteristics: initialCharacteristics, onChange } = props || {};
  
  const [localCharacteristics, setLocalCharacteristics] = useState<ItemCharacteristics>(
    initialCharacteristics || { material: '', color: '' }
  );

  // Use controlled or uncontrolled mode
  const characteristics = initialCharacteristics || localCharacteristics;

  // Import dynamic color options from item selection
  const { colorOptions } = useItemSelectionOperations();

  const updateMaterial = (material: string) => {
    const newCharacteristics = { ...characteristics, material };
    
    if (!initialCharacteristics) {
      setLocalCharacteristics(newCharacteristics);
    }
    onChange?.(newCharacteristics);
  };

  const updateColor = (color: string) => {
    const newCharacteristics = { ...characteristics, color };
    
    if (!initialCharacteristics) {
      setLocalCharacteristics(newCharacteristics);
    }
    onChange?.(newCharacteristics);
  };

  const handleMaterialInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateMaterial(event.target.value);
  };

  const handleColorSelectorChange =
      (event: React.ChangeEvent<HTMLInputElement> | (Event & { target: { value: unknown; name: string; } })) => {
    const value = (event.target as { value: unknown }).value;
    updateColor(value as string);
  };

  const resetCharacteristics = () => {
    const resetValue = { material: '', color: '' };
    setLocalCharacteristics(resetValue);
    onChange?.(resetValue);
  };

  return {
    // Data
    characteristics,
    colorOptions, // Dynamic options from item selection
    
    // Handlers (ready to use in UI)
    handleMaterialInputChange,
    handleColorSelectorChange,
    
    // Operations
    updateMaterial,
    updateColor,
    resetCharacteristics
  };
};