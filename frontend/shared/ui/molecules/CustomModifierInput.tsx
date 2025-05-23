'use client';

import { TextField, InputAdornment, Box, Typography } from '@mui/material';
import React from 'react';

interface CustomModifierInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  description?: string;
  disabled?: boolean;
  type?: 'PERCENTAGE' | 'FIXED_AMOUNT';
  error?: string;
}

/**
 * Компонент для введення кастомного значення модифікатора
 */
export const CustomModifierInput: React.FC<CustomModifierInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  label = 'Кастомне значення',
  description,
  disabled = false,
  type = 'PERCENTAGE',
  error,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value) || 0;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
  };

  const adornment = type === 'PERCENTAGE' ? '%' : 'грн';

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        label={label}
        type="number"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        error={!!error}
        helperText={error || description}
        inputProps={{
          min,
          max,
          step: type === 'PERCENTAGE' ? 1 : 0.01,
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">{adornment}</InputAdornment>,
        }}
        size="small"
        fullWidth
      />
      {!error && (
        <Typography variant="caption" color="text.secondary">
          Діапазон: {min} - {max} {adornment}
        </Typography>
      )}
    </Box>
  );
};
