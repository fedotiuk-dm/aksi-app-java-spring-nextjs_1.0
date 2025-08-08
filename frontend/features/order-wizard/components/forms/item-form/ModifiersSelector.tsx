'use client';

import React from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { getAvailableModifiers } from '@/features/order-wizard/constants/item-modifiers';
import type { PriceListItemInfoCategoryCode } from '@/shared/api/generated/priceList';

interface ModifiersSelectorProps {
  selectedCategory: PriceListItemInfoCategoryCode | '';
  selectedModifiers: string[];
  onChangeAction: (modifiers: string[]) => void;
  disabled?: boolean;
}

export const ModifiersSelector: React.FC<ModifiersSelectorProps> = ({
  selectedCategory,
  selectedModifiers,
  onChangeAction,
  disabled,
}) => {
  const availableModifiers = getAvailableModifiers(selectedCategory);

  const handleModifierToggle = (modifierCode: string) => {
    const index = selectedModifiers.indexOf(modifierCode);
    
    if (index >= 0) {
      onChangeAction(selectedModifiers.filter(code => code !== modifierCode));
    } else {
      onChangeAction([...selectedModifiers, modifierCode]);
    }
  };

  if (availableModifiers.length === 0) {
    return null;
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Модифікатори</FormLabel>
      <FormGroup>
        {availableModifiers.map((modifier) => (
          <FormControlLabel
            key={modifier.code}
            control={
              <Checkbox
                checked={selectedModifiers.includes(modifier.code)}
                onChange={() => handleModifierToggle(modifier.code)}
                disabled={disabled}
              />
            }
            label={`${modifier.label} ${modifier.value}`}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};