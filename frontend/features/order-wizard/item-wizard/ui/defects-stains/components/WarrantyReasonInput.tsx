'use client';

import { TextField } from '@mui/material';
import React from 'react';

interface WarrantyReasonInputProps {
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  hasError: boolean;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Компонент для введення причини відсутності гарантій
 *
 * FSD принципи:
 * - Тільки UI логіка для поля причини гарантій
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки валідації
 */
export const WarrantyReasonInput: React.FC<WarrantyReasonInputProps> = ({
  value,
  onChange,
  show,
  hasError,
  disabled = false,
  required = false,
}) => {
  if (!show) {
    return null;
  }

  return (
    <TextField
      fullWidth
      required={required}
      disabled={disabled}
      label="Причина відсутності гарантій"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Обов'язково вкажіть причини відсутності гарантій"
      multiline
      rows={2}
      sx={{ mt: 2 }}
      error={hasError}
      helperText={hasError ? 'Обов\'язкове поле при виборі "Без гарантій"' : ''}
    />
  );
};

export default WarrantyReasonInput;
