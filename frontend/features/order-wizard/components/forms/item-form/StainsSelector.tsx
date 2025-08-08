'use client';

import React from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { ItemStain, ItemStainType } from '@/shared/api/generated/cart';
import { STAINS_CONFIG } from '@/features/order-wizard/constants/item-defects';

interface StainsSelectorProps {
  selectedStains: ItemStain[];
  onChangeAction: (stains: ItemStain[]) => void;
  disabled?: boolean;
}

export const StainsSelector: React.FC<StainsSelectorProps> = ({
  selectedStains,
  onChangeAction,
  disabled,
}) => {
  const handleStainToggle = (stainCode: ItemStainType, stainLabel: string) => {
    const existingIndex = selectedStains.findIndex(s => s.type === stainCode);
    
    if (existingIndex >= 0) {
      onChangeAction(selectedStains.filter((_, index) => index !== existingIndex));
    } else {
      onChangeAction([...selectedStains, { type: stainCode, description: stainLabel }]);
    }
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Плями</FormLabel>
      <FormGroup row>
        {STAINS_CONFIG.map((stain) => (
          <FormControlLabel
            key={stain.code}
            control={
              <Checkbox
                checked={selectedStains.some(s => s.type === stain.code)}
                onChange={() => handleStainToggle(stain.code, stain.label)}
                disabled={disabled}
              />
            }
            label={stain.label}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};