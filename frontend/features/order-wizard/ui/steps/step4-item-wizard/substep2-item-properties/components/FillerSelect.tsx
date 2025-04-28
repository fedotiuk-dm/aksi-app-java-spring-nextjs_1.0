import React from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Switch
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { ItemPropertiesFormValues, FillerType } from '@/features/order-wizard/model/schema/item-properties.schema';

interface FillerSelectProps {
  control: Control<ItemPropertiesFormValues>;
  hasFiller: boolean;
  selectedFillerType: FillerType | undefined;
  onFillerToggle: (value: boolean) => void;
  onFillerTypeChange: (type: FillerType) => void;
  onCustomFillerChange: (filler: string) => void;
  onFillerLumpyToggle: (value: boolean) => void;
}

/**
 * Компонент для вибору типу наповнювача
 */
export const FillerSelect: React.FC<FillerSelectProps> = ({
  control,
  hasFiller,
  selectedFillerType,
  onFillerToggle,
  onFillerTypeChange,
  onCustomFillerChange,
  onFillerLumpyToggle
}) => {
  // Переклади для відображення в інтерфейсі
  const fillerLabels: Record<FillerType, string> = {
    [FillerType.DOWN]: 'Пух',
    [FillerType.SINTEPON]: 'Синтепон',
    [FillerType.OTHER]: 'Інше (вказати)',
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="hasFiller"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    onFillerToggle(e.target.checked);
                  }}
                />
              }
              label="Виріб має наповнювач"
            />
          )}
        />
      </Grid>

      {hasFiller && (
        <>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="fillerType"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel id="filler-type-select-label">Тип наповнювача</InputLabel>
                  <Select
                    labelId="filler-type-select-label"
                    id="filler-type-select"
                    label="Тип наповнювача"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onFillerTypeChange(e.target.value as FillerType);
                    }}
                  >
                    {Object.values(FillerType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {fillerLabels[type]}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          {selectedFillerType === FillerType.OTHER && (
            <Grid size={{ xs: 12 }}>
              <Controller
                name="customFiller"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Вкажіть тип наповнювача"
                    variant="outlined"
                    error={!!error}
                    helperText={error ? error.message : ''}
                    onChange={(e) => {
                      field.onChange(e);
                      onCustomFillerChange(e.target.value);
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <Controller
              name="isFillerLumpy"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        onFillerLumpyToggle(e.target.checked);
                      }}
                    />
                  }
                  label="Наповнювач збитий/нерівномірний"
                />
              )}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};
