'use client';

import { TextField } from '@mui/material';
import React from 'react';

interface CustomModifierInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  show: boolean;
  disabled?: boolean;
}

/**
 * Компонент для введення користувацького відсотка модифікатора
 *
 * FSD принципи:
 * - Тільки UI логіка для поля введення відсотка
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки валідації
 */
export const CustomModifierInput: React.FC<CustomModifierInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  show,
  disabled = false,
}) => {
  if (!show) {
    return null;
  }

  return (
    <TextField
      size="small"
      type="number"
      disabled={disabled}
      label="Відсоток"
      value={value || ''}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      inputProps={{ min, max }}
      sx={{ ml: 4, mt: 1, width: 120 }}
      helperText={`${min}-${max}%`}
    />
  );
};

export default CustomModifierInput;
