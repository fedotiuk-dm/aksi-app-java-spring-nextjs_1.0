import React from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useBranchLocations } from '@/features/order-wizard/api';

import { UUID } from 'node:crypto';

interface BranchLocationSelectProps {
  value: UUID | string | null;
  onChange: (value: UUID | string | null) => void;
  error?: string;
}

/**
 * Компонент для вибору філії (пункту прийому замовлення)
 */
export const BranchLocationSelect: React.FC<BranchLocationSelectProps> = ({
  value,
  onChange,
  error,
}) => {
  const { data: branchLocations, isLoading } = useBranchLocations();
  
  // Мемоізуємо обробник зміни значення, щоб уникнути зайвих оновлень
  const handleChange = React.useCallback(
    (e: SelectChangeEvent) => {
      onChange(e.target.value as UUID);
    },
    [onChange]
  );

  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel>Пункт прийому замовлення</InputLabel>
      <Select
        value={value || ''}
        onChange={handleChange}
        label="Пункт прийому замовлення"
        disabled={isLoading}
      >
        <MenuItem value="">
          <em>Виберіть філію</em>
        </MenuItem>
        {isLoading ? (
          <MenuItem disabled value="loading">
            Завантаження...
          </MenuItem>
        ) : branchLocations && branchLocations.length > 0 ? (
          branchLocations.map((location) => (
            <MenuItem key={location.id} value={location.id}>
              {location.name} ({location.code})
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            Немає доступних філій
          </MenuItem>
        )}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
