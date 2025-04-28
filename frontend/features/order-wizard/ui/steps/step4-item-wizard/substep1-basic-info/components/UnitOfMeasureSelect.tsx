import { 
  FormControl, 
  FormHelperText, 
  InputLabel, 
  MenuItem, 
  Select,
  CircularProgress,
  Box
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { ItemBasicInfoFormValues } from '@/features/order-wizard/model/schema/item-basic-info.schema';

interface UnitOfMeasureSelectProps {
  unitsOfMeasure: string[];
  control: Control<ItemBasicInfoFormValues>;
  errors: FieldErrors<ItemBasicInfoFormValues>;
  disabled?: boolean;
  onChange: () => void;
}

// При порожньому списку завжди додаємо хоча б одну одиницю для виміру
const DEFAULT_UNIT = 'PIECES';

export const UnitOfMeasureSelect = ({
  unitsOfMeasure,
  control,
  errors,
  disabled = false,
  onChange
}: UnitOfMeasureSelectProps) => {
  // Забезпечуємо, щоб PIECES завжди був у списку, якщо список пустий
  const displayUnits = unitsOfMeasure.length === 0 ? [DEFAULT_UNIT] : unitsOfMeasure;
  
  return (
    <Controller
      name="measurementUnit"
      control={control}
      render={({ field }) => {
        // Перевіряємо, чи є поточне значення у списку доступних одиниць
        const valueExists = displayUnits.includes(field.value as string);
        
        // Якщо значення некоректне, використовуємо перше із списку
        const effectiveValue = valueExists ? field.value : (displayUnits.length > 0 ? displayUnits[0] : '');
        
        return (
          <FormControl 
            fullWidth 
            error={!!errors.measurementUnit}
            disabled={disabled}
          >
            <InputLabel id="unit-select-label">Одиниця виміру</InputLabel>
            <Select
              labelId="unit-select-label"
              id="unit-select"
              label="Одиниця виміру"
              {...field}
              value={effectiveValue}
              onChange={(e) => {
                field.onChange(e);
                onChange();
              }}
            >
              {displayUnits.length === 0 ? (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size={20} />
                </Box>
              ) : (
                displayUnits.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.measurementUnit && (
              <FormHelperText>{errors.measurementUnit.message}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
};
