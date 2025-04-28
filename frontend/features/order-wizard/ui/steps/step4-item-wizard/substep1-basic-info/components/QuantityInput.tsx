import { FormControl, FormHelperText, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { ItemBasicInfoFormValues } from '@/features/order-wizard/model/schema/item-basic-info.schema';

interface QuantityInputProps {
  control: Control<ItemBasicInfoFormValues>;
  errors: FieldErrors<ItemBasicInfoFormValues>;
  disabled?: boolean;
}

export const QuantityInput = ({
  control,
  errors,
  disabled = false
}: QuantityInputProps) => {
  return (
    <Controller
      name="quantity"
      control={control}
      render={({ field }) => (
        <FormControl 
          sx={{ width: '100%' }}
          error={!!errors.quantity}
          disabled={disabled}
        >
          <TextField
            id="quantity-input"
            label="Кількість"
            type="number"
            InputProps={{
              inputProps: { min: 1, step: 1 }
            }}
            fullWidth
            {...field}
            onChange={(e) => {
              // Перетворюємо введене значення на ціле число
              const rawValue = e.target.value;
              
              // Якщо поле порожнє, не парсимо його
              if (rawValue === '') {
                field.onChange(1); // За замовчуванням ставимо 1
                return;
              }
              
              // Парсимо та округлюємо до цілого
              const parsedValue = parseInt(rawValue, 10);
              
              // Якщо отримано NaN, ставимо 1
              field.onChange(isNaN(parsedValue) ? 1 : Math.max(1, parsedValue));
            }}
            error={!!errors.quantity}
          />
          {errors.quantity && (
            <FormHelperText>{errors.quantity.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
