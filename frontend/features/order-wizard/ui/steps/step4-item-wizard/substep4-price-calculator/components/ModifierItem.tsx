'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
  TextField,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { PriceModifier } from '@/features/order-wizard/model/schema/item-pricing.schema';
import { formatCurrency } from '@/features/order-wizard/api/helpers/formatters';

interface ModifierItemProps {
  modifier: PriceModifier;
  isApplied: boolean;
  selectedValue: number;
  onModifierChange: (modifierId: string, value: number) => void;
  onModifierRemove: (modifierId: string) => void;
}

/**
 * Компонент для відображення окремого модифікатора ціни
 */
const ModifierItem: React.FC<ModifierItemProps> = ({
  modifier,
  isApplied,
  selectedValue,
  onModifierChange,
  onModifierRemove,
}) => {
  // Локальний стан для значення модифікатора (для слайдера/поля вводу)
  const [value, setValue] = useState<number>(
    isApplied ? selectedValue : modifier.value || 0
  );

  // Синхронізуємо локальний стан зі значенням із пропсів
  useEffect(() => {
    if (isApplied) {
      setValue(selectedValue);
    } else {
      setValue(modifier.value || 0);
    }
  }, [isApplied, selectedValue, modifier]);

  // Обробник для перемикання стану (застосований/не застосований)
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onModifierChange(modifier.id, value);
    } else {
      onModifierRemove(modifier.id);
    }
  };

  // Обробник для зміни значення слайдера
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const numericValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setValue(numericValue);
    if (isApplied) {
      onModifierChange(modifier.id, numericValue);
    }
  };

  // Обробник для зміни значення в текстовому полі
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    if (!isNaN(newValue)) {
      setValue(newValue);
      if (isApplied) {
        onModifierChange(modifier.id, newValue);
      }
    }
  };

  // Визначаємо, чи це діапазонний модифікатор
  const isRangeModifier =
    modifier.minValue !== undefined && modifier.maxValue !== undefined;

  // Визначаємо, чи це фіксований числовий модифікатор
  const isFixedModifier = !modifier.isPercentage && !isRangeModifier;

  // Форматуємо значення для відображення (включаючи символ відсотка, якщо необхідно)
  const formattedValue = modifier.isPercentage
    ? `${value}%`
    : formatCurrency(value);

  return (
    <Card
      variant={isApplied ? 'outlined' : 'elevation'}
      sx={{
        mb: 2,
        border: isApplied ? '1px solid' : 'none',
        borderColor: 'primary.main',
        opacity: isApplied ? 1 : 0.8,
        transition: 'all 0.2s',
        '&:hover': {
          opacity: 1,
          boxShadow: isApplied ? 3 : 1,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={isApplied}
                onChange={handleToggle}
                color="primary"
              />
            }
            label={
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: isApplied ? 'bold' : 'normal' }}
              >
                {modifier.name}
              </Typography>
            }
          />

          {modifier.description && (
            <Tooltip title={modifier.description}>
              <IconButton size="small" color="primary" sx={{ ml: 1 }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {isApplied && (
            <IconButton
              size="small"
              color="error"
              onClick={() => onModifierRemove(modifier.id)}
              sx={{ ml: 1 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Додаткові елементи інтерфейсу для різних типів модифікаторів */}
        {isApplied && (
          <Box sx={{ mt: 2, px: 1 }}>
            {/* Слайдер для діапазонних модифікаторів */}
            {isRangeModifier && (
              <Box>
                <Typography variant="caption" gutterBottom>
                  Значення: {formattedValue}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Slider
                    value={value}
                    onChange={handleSliderChange}
                    min={modifier.minValue}
                    max={modifier.maxValue}
                    step={1}
                    marks={[
                      {
                        value: modifier.minValue || 0,
                        label: `${modifier.minValue}%`,
                      },
                      {
                        value: modifier.maxValue || 100,
                        label: `${modifier.maxValue}%`,
                      },
                    ]}
                  />
                </Box>
              </Box>
            )}

            {/* Числове поле для фіксованих модифікаторів */}
            {isFixedModifier && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ mr: 2 }}>
                  Кількість:
                </Typography>
                <TextField
                  value={value}
                  onChange={handleInputChange}
                  type="number"
                  size="small"
                  inputProps={{ min: 1, step: 1 }}
                  sx={{ width: '100px' }}
                />
              </Box>
            )}

            {/* Відображення значення для відсоткових модифікаторів */}
            {modifier.isPercentage && !isRangeModifier && (
              <Typography variant="body2" color="primary">
                {modifier.isDiscount ? 'Знижка' : 'Додатково'}: {formattedValue}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ModifierItem;
