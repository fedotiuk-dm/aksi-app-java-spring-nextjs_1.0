import React from 'react';
import { TextField } from '@mui/material';

interface TagNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * Компонент для вводу номера бирки замовлення
 */
export const TagNumberInput: React.FC<TagNumberInputProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <TextField
      fullWidth
      label="Номер бирки"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error || ''}
      placeholder="Введіть або відскануйте номер бирки"
    />
  );
};
