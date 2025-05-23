'use client';

import { Grid, TextField } from '@mui/material';
import React from 'react';

interface QuantityInputProps {
  quantity: number;
  unit: string;
  onQuantityChange: (quantity: number) => void;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Компонент для введення кількості та відображення одиниці виміру
 *
 * FSD принципи:
 * - Тільки UI логіка для полів кількості та одиниці виміру
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки розрахунків
 */
export const QuantityInput: React.FC<QuantityInputProps> = ({
  quantity,
  unit,
  onQuantityChange,
  disabled = false,
  required = false,
}) => {
  const handleQuantityChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    const minValue = unit === 'кг' ? 0.1 : 1;
    const finalValue = Math.max(minValue, numValue);
    onQuantityChange(finalValue);
  };

  return (
    <>
      {/* Кількість */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          fullWidth
          required={required}
          disabled={disabled}
          type="number"
          label="Кількість"
          value={quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          inputProps={{
            min: unit === 'кг' ? 0.1 : 1,
            step: unit === 'кг' ? 0.1 : 1,
          }}
        />
      </Grid>

      {/* Одиниця виміру */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          fullWidth
          label="Одиниця виміру"
          value={unit}
          disabled
          helperText="Встановлюється автоматично на основі категорії"
        />
      </Grid>
    </>
  );
};

export default QuantityInput;
