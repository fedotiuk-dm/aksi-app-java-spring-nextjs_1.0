import React from 'react';
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { ItemPropertiesFormValues, MaterialType } from '@/features/order-wizard/model/schema/item-properties.schema';

interface MaterialSelectProps {
  control: Control<ItemPropertiesFormValues>;
  materials: MaterialType[];
}

/**
 * Компонент для вибору матеріалу
 */
export const MaterialSelect: React.FC<MaterialSelectProps> = ({ control, materials }) => {
  // Переклади для відображення в інтерфейсі
  const materialLabels: Record<MaterialType, string> = {
    [MaterialType.COTTON]: 'Бавовна',
    [MaterialType.WOOL]: 'Шерсть',
    [MaterialType.SILK]: 'Шовк',
    [MaterialType.SYNTHETIC]: 'Синтетика',
    [MaterialType.SMOOTH_LEATHER]: 'Гладка шкіра',
    [MaterialType.NUBUCK]: 'Нубук',
    [MaterialType.SPLIT_LEATHER]: 'Спілок',
    [MaterialType.SUEDE]: 'Замша',
    [MaterialType.OTHER]: 'Інше',
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="material"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth error={!!error}>
              <InputLabel id="material-select-label">Матеріал</InputLabel>
              <Select
                labelId="material-select-label"
                id="material-select"
                label="Матеріал"
                {...field}
              >
                {materials.map((material) => (
                  <MenuItem key={material} value={material}>
                    {materialLabels[material]}
                  </MenuItem>
                ))}
              </Select>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>
    </Grid>
  );
};
