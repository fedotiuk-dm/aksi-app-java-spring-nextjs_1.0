'use client';

import { Scale } from '@mui/icons-material';
import { Grid } from '@mui/material';
import React from 'react';

import { FormField } from '../atoms';

interface QuantityFieldProps {
  quantity: number;
  unitOfMeasure: string;
  onQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number };
}

/**
 * Компонент для введення кількості з відповідною одиницею виміру
 */
export const QuantityField: React.FC<QuantityFieldProps> = ({
  quantity,
  unitOfMeasure,
  onQuantityChange,
  error,
  disabled = false,
  required = false,
  gridSize = { xs: 12, md: 3 },
}) => {
  return (
    <Grid size={gridSize}>
      <FormField
        type="number"
        label="Кількість"
        value={quantity}
        onChange={onQuantityChange}
        error={error}
        disabled={disabled}
        required={required}
        inputProps={{
          min: unitOfMeasure === 'кг' ? 0.1 : 1,
          max: 999,
          step: unitOfMeasure === 'кг' ? 0.1 : 1,
        }}
        startIcon={<Scale />}
        endIcon={unitOfMeasure}
      />
    </Grid>
  );
};
