import {
  FormControl,
  FormHelperText,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
  Box,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { ItemBasicInfoFormValues } from '@/features/order-wizard/model/schema/item-basic-info.schema';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import NumbersIcon from '@mui/icons-material/Numbers';
import { useState } from 'react';

interface QuantityInputProps {
  control: Control<ItemBasicInfoFormValues>;
  errors: FieldErrors<ItemBasicInfoFormValues>;
  disabled?: boolean;
}

export const QuantityInput = ({
  control,
  errors,
  disabled = false,
}: QuantityInputProps) => {
  // Локальний стан для відстеження фокусу
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      name="quantity"
      control={control}
      render={({ field }) => {
        // Отримуємо поточне значення
        const currentValue = Number(field.value);

        // Функції для збільшення/зменшення значення
        const increment = () => {
          const newValue = Math.min(100, currentValue + 1);
          field.onChange(newValue);
        };

        const decrement = () => {
          const newValue = Math.max(1, currentValue - 1);
          field.onChange(newValue);
        };

        return (
          <Box sx={{ width: '100%' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <NumbersIcon fontSize="small" />
              Кількість
            </Typography>

            <FormControl
              sx={{ width: '100%' }}
              error={!!errors.quantity}
              disabled={disabled}
            >
              <TextField
                id="quantity-input"
                type="number"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tooltip title="Зменшити">
                        <span>
                          <IconButton
                            onClick={decrement}
                            disabled={currentValue <= 1 || disabled}
                            size="small"
                            edge="start"
                          >
                            <RemoveIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Збільшити">
                        <span>
                          <IconButton
                            onClick={increment}
                            disabled={currentValue >= 100 || disabled}
                            size="small"
                            edge="end"
                          >
                            <AddIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  ),
                  inputProps: {
                    min: 1,
                    max: 100,
                    step: 1,
                    style: {
                      textAlign: 'center',
                      paddingLeft: 0,
                      paddingRight: 0,
                    },
                  },
                }}
                size="small"
                fullWidth
                {...field}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  field.onBlur();
                  setIsFocused(false);
                }}
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
                  field.onChange(
                    isNaN(parsedValue)
                      ? 1
                      : Math.max(1, Math.min(100, parsedValue))
                  );
                }}
                error={!!errors.quantity}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isFocused
                      ? 'action.hover'
                      : 'background.paper',
                  },
                }}
              />
              {errors.quantity && (
                <FormHelperText>{errors.quantity.message}</FormHelperText>
              )}
            </FormControl>
          </Box>
        );
      }}
    />
  );
};
