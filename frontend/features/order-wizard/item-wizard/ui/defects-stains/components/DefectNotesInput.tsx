'use client';

import { Grid, TextField } from '@mui/material';
import React from 'react';

interface DefectNotesInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Компонент для введення додаткових приміток щодо дефектів
 *
 * FSD принципи:
 * - Тільки UI логіка для поля приміток
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки
 */
export const DefectNotesInput: React.FC<DefectNotesInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <Grid size={{ xs: 12 }}>
      <TextField
        fullWidth
        disabled={disabled}
        label="Додаткові примітки щодо дефектів"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Детальний опис виявлених дефектів, особливостей або рекомендацій"
        multiline
        rows={3}
      />
    </Grid>
  );
};

export default DefectNotesInput;
