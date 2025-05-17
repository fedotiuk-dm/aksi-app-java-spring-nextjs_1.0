import React from 'react';
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  CircularProgress,
  Box,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { ItemBasicInfoFormValues } from '@/features/order-wizard/model/schema/item-basic-info.schema';
import ScaleIcon from '@mui/icons-material/Scale';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import StraightenIcon from '@mui/icons-material/Straighten';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import { translateUnitOfMeasure } from '@/features/order-wizard/api/helpers/formatters';

interface UnitOfMeasureSelectProps {
  unitsOfMeasure: string[];
  control: Control<ItemBasicInfoFormValues>;
  errors: FieldErrors<ItemBasicInfoFormValues>;
  disabled?: boolean;
  onChange: () => void;
  selectedItemUnitOfMeasure?: string; // Доданий параметр для автоматичного вибору одиниці на основі товару
}

// При порожньому списку завжди додаємо хоча б одну одиницю для виміру
const DEFAULT_UNIT = 'PIECES';

// Словник для іконок одиниць виміру
const unitIcons: Record<string, React.ReactElement> = {
  PIECES: <CheckroomIcon fontSize="small" />,
  KILOGRAMS: <ScaleIcon fontSize="small" />,
  METERS: <StraightenIcon fontSize="small" />,
  SQUARE_METERS: <SquareFootIcon fontSize="small" />,
};

// Словник для підказок для одиниць виміру
const unitHints: Record<string, string> = {
  PIECES: 'Кількість предметів одягу',
  KILOGRAMS: 'Вага в кілограмах',
  METERS: 'Довжина в метрах',
  SQUARE_METERS: 'Площа в квадратних метрах',
};

export const UnitOfMeasureSelect = ({
  unitsOfMeasure,
  control,
  errors,
  disabled = false,
  onChange,
  selectedItemUnitOfMeasure,
}: UnitOfMeasureSelectProps) => {
  // Якщо є одиниця виміру з вибраного товару і вона є в доступних одиницях,
  // використовуємо її як значення за замовчуванням
  const effectiveUnits =
    unitsOfMeasure.length > 0
      ? unitsOfMeasure
      : [selectedItemUnitOfMeasure || DEFAULT_UNIT];

  // Переконуємось, що одиниця виміру товару точно є у списку
  if (
    selectedItemUnitOfMeasure &&
    !effectiveUnits.includes(selectedItemUnitOfMeasure)
  ) {
    effectiveUnits.push(selectedItemUnitOfMeasure);
  }

  return (
    <Controller
      name="measurementUnit"
      control={control}
      render={({ field }) => {
        // Перевіряємо, чи є поточне значення у списку доступних одиниць
        const valueExists = effectiveUnits.includes(field.value as string);

        // Якщо є одиниця виміру від товару, використовуємо її
        const defaultValue =
          selectedItemUnitOfMeasure ||
          (effectiveUnits.length > 0 ? effectiveUnits[0] : '');

        // Якщо значення некоректне, використовуємо значення за замовчуванням
        const effectiveValue = valueExists ? field.value : defaultValue;

        return (
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              component="span"
              sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              Одиниця виміру
              {selectedItemUnitOfMeasure && (
                <Tooltip
                  title="Автоматично встановлено на основі вибраного товару"
                  placement="top"
                >
                  <Box
                    sx={{ display: 'inline-flex', alignItems: 'center', ml: 1 }}
                  >
                    <Typography variant="caption" color="primary">
                      (Встановлено автоматично)
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Typography>

            <FormControl
              fullWidth
              error={!!errors.measurementUnit}
              disabled={disabled || !!selectedItemUnitOfMeasure}
            >
              <Select
                id="unit-select"
                value={effectiveValue}
                onChange={(e) => {
                  field.onChange(e);
                  onChange();
                }}
              >
                {effectiveUnits.length === 0 ? (
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={20} />
                  </Box>
                ) : (
                  effectiveUnits.map((unit) => {
                    const icon = unitIcons[unit] || (
                      <CheckroomIcon fontSize="small" />
                    );
                    const hint = unitHints[unit] || 'Одиниця виміру';
                    const label = translateUnitOfMeasure(unit);
                    const isDefault = unit === selectedItemUnitOfMeasure;

                    return (
                      <MenuItem key={unit} value={unit} selected={isDefault}>
                        <Tooltip title={hint} placement="right">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={label}
                              secondary={
                                isDefault ? 'Рекомендована одиниця' : undefined
                              }
                            />
                          </Box>
                        </Tooltip>
                      </MenuItem>
                    );
                  })
                )}
              </Select>
              {errors.measurementUnit && (
                <FormHelperText>
                  {errors.measurementUnit.message}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
        );
      }}
    />
  );
};
