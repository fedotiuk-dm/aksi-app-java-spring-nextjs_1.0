'use client';

import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import React from 'react';

interface FillingType {
  id: string;
  name: string;
}

interface FillingConfigurationProps {
  fillingTypes: FillingType[];
  selectedFillingId: string;
  customFilling: string;
  isDamagedFilling: boolean;
  onFillingSelect: (fillingId: string) => void;
  onCustomFillingChange: (filling: string) => void;
  onDamagedFillingChange: (isDamaged: boolean) => void;
  show: boolean;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Компонент для конфігурації наповнювача предмета
 *
 * FSD принципи:
 * - Тільки UI логіка для полів наповнювача
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки визначення потреби в наповнювачі
 */
export const FillingConfiguration: React.FC<FillingConfigurationProps> = ({
  fillingTypes,
  selectedFillingId,
  customFilling,
  isDamagedFilling,
  onFillingSelect,
  onCustomFillingChange,
  onDamagedFillingChange,
  show,
  disabled = false,
  required = false,
}) => {
  if (!show) {
    return null;
  }

  const showCustomFillingInput = selectedFillingId === 'other';
  const showDamagedCheckbox = Boolean(selectedFillingId || customFilling);

  return (
    <>
      {/* Тип наповнювача */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth required={required} disabled={disabled}>
          <InputLabel>Наповнювач</InputLabel>
          <Select
            value={selectedFillingId}
            onChange={(e) => onFillingSelect(e.target.value)}
            label="Наповнювач"
          >
            {fillingTypes.map((filling) => (
              <MenuItem key={filling.id} value={filling.id}>
                {filling.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Власний наповнювач */}
      {showCustomFillingInput && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required={required}
            disabled={disabled}
            label="Вкажіть тип наповнювача"
            value={customFilling}
            onChange={(e) => onCustomFillingChange(e.target.value)}
            placeholder="Наприклад: холлофайбер, вата"
          />
        </Grid>
      )}

      {/* Чекбокс збитого наповнювача */}
      {showDamagedCheckbox && (
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isDamagedFilling}
                onChange={(e) => onDamagedFillingChange(e.target.checked)}
                disabled={disabled}
              />
            }
            label="Збитий наповнювач"
          />
        </Grid>
      )}
    </>
  );
};

export default FillingConfiguration;
