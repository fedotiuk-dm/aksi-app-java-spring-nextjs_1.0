import React from 'react';
import { TextField, Grid } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { ItemPropertiesFormValues } from '@/features/order-wizard/model/schema/item-properties.schema';

interface NotesInputProps {
  control: Control<ItemPropertiesFormValues>;
}

/**
 * Компонент для введення додаткових приміток
 */
export const NotesInput: React.FC<NotesInputProps> = ({ control }) => {
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
              rows={3}
              label="Примітки до характеристик"
              placeholder="Додаткові відомості про особливості предмета"
              variant="outlined"
              error={!!error}
              helperText={error ? error.message : 'Опціонально: додайте особливості матеріалу, кольору або інші важливі характеристики'}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};
