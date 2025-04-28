import React from 'react';
import { TextField, Grid } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { ItemDefectsFormValues } from '@/features/order-wizard/model/schema/item-defects.schema';

interface DefectsNotesInputProps {
  control: Control<ItemDefectsFormValues>;
  onChange?: (value: string) => void;
}

/**
 * Компонент для введення приміток щодо дефектів
 */
export const DefectsNotesInput: React.FC<DefectsNotesInputProps> = ({ control, onChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="notes"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              label="Примітки щодо дефектів"
              placeholder="Додаткова інформація про дефекти та особливості догляду"
              variant="outlined"
              error={!!error}
              helperText={error ? error.message : 'Опишіть розташування та особливості дефектів, що дозволить краще оцінити їх вплив на обробку'}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e.target.value);
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};
