'use client';

import React from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { ItemDefect, ItemDefectType } from '@/shared/api/generated/cart';
import { DEFECTS_CONFIG } from '@/features/order-wizard/constants/item-defects';

interface DefectsSelectorProps {
  selectedDefects: ItemDefect[];
  onChangeAction: (defects: ItemDefect[]) => void;
  disabled?: boolean;
}

export const DefectsSelector: React.FC<DefectsSelectorProps> = ({
  selectedDefects,
  onChangeAction,
  disabled,
}) => {
  const handleDefectToggle = (defectCode: ItemDefectType, defectLabel: string) => {
    const existingIndex = selectedDefects.findIndex(d => d.type === defectCode);
    
    if (existingIndex >= 0) {
      onChangeAction(selectedDefects.filter((_, index) => index !== existingIndex));
    } else {
      onChangeAction([...selectedDefects, { type: defectCode, description: defectLabel }]);
    }
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Дефекти</FormLabel>
      <FormGroup row>
        {DEFECTS_CONFIG.map((defect) => (
          <FormControlLabel
            key={defect.code}
            control={
              <Checkbox
                checked={selectedDefects.some(d => d.type === defect.code)}
                onChange={() => handleDefectToggle(defect.code, defect.label)}
                disabled={disabled}
              />
            }
            label={defect.label}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};