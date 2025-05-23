'use client';

import { LocalOffer, Warning, Info } from '@mui/icons-material';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Chip,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';

export interface DiscountOption {
  value: string;
  label: string;
  percentage: number;
  description?: string;
  restrictions?: string[];
  disabled?: boolean;
}

interface DiscountTypeSelectorProps {
  options: DiscountOption[];
  selectedValue: string;
  customPercentage?: number;
  onChange: (value: string, customPercentage?: number) => void;
  disabled?: boolean;
  error?: string;
  title?: string;
  description?: string;
  hasRestrictedItems?: boolean;
  restrictedItemsMessage?: string;
  allowCustom?: boolean;
}

/**
 * Компонент для вибору типу знижки
 */
export const DiscountTypeSelector: React.FC<DiscountTypeSelectorProps> = ({
  options,
  selectedValue,
  customPercentage = 0,
  onChange,
  disabled = false,
  error,
  title = 'Тип знижки',
  description,
  hasRestrictedItems = false,
  restrictedItemsMessage,
  allowCustom = false,
}) => {
  const [customValue, setCustomValue] = useState(customPercentage.toString());

  /**
   * Обробник зміни типу знижки
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onChange(value, value === 'CUSTOM' ? parseFloat(customValue) || 0 : undefined);
  };

  /**
   * Обробник зміни індивідуального відсотка
   */
  const handleCustomPercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomValue(value);

    const percentage = parseFloat(value) || 0;
    if (selectedValue === 'CUSTOM') {
      onChange('CUSTOM', percentage);
    }
  };

  /**
   * Отримання кольору для знижки
   */
  const getDiscountColor = (
    option: DiscountOption
  ): 'success' | 'info' | 'warning' | 'secondary' => {
    if (option.percentage >= 15) return 'success';
    if (option.percentage >= 10) return 'info';
    if (option.percentage >= 5) return 'warning';
    return 'secondary';
  };

  /**
   * Отримання відсотка знижки
   */
  const getEffectivePercentage = (option: DiscountOption): number => {
    if (option.value === 'CUSTOM') return customPercentage;
    return option.percentage;
  };

  return (
    <Box>
      <FormControl component="fieldset" disabled={disabled} fullWidth>
        <FormLabel component="legend" sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <LocalOffer color="primary" />
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          )}
        </FormLabel>

        {/* Попередження про обмеження */}
        {hasRestrictedItems && (
          <Alert severity="warning" sx={{ mb: 2 }} icon={<Warning />}>
            <Typography variant="body2">
              {restrictedItemsMessage ||
                'Знижки не діють на прасування, прання і фарбування текстилю. Ці послуги будуть виключені зі знижки.'}
            </Typography>
          </Alert>
        )}

        <RadioGroup value={selectedValue} onChange={handleChange} sx={{ gap: 1 }}>
          {options.map((option) => (
            <Box key={option.value} sx={{ mb: 1 }}>
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                disabled={option.disabled}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {option.label}
                      </Typography>
                      {option.description && (
                        <Typography variant="caption" color="text.secondary">
                          {option.description}
                        </Typography>
                      )}
                      {option.restrictions && option.restrictions.length > 0 && (
                        <Typography
                          variant="caption"
                          color="warning.main"
                          display="block"
                          sx={{ mt: 0.5 }}
                        >
                          Обмеження: {option.restrictions.join(', ')}
                        </Typography>
                      )}
                    </Box>

                    {/* Chip з відсотком знижки */}
                    {option.value !== 'NONE' && (
                      <Chip
                        size="small"
                        icon={<LocalOffer />}
                        label={
                          option.value === 'CUSTOM'
                            ? `${getEffectivePercentage(option)}%`
                            : `${option.percentage}%`
                        }
                        color={
                          selectedValue === option.value ? getDiscountColor(option) : 'default'
                        }
                        variant={selectedValue === option.value ? 'filled' : 'outlined'}
                      />
                    )}

                    {option.value === 'NONE' && selectedValue === option.value && (
                      <Chip size="small" label="Без знижки" color="default" variant="filled" />
                    )}
                  </Box>
                }
                sx={{
                  m: 0,
                  p: 1.5,
                  border: '1px solid',
                  borderColor: selectedValue === option.value ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  backgroundColor:
                    selectedValue === option.value ? 'action.selected' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  width: '100%',
                  transition: 'all 0.2s ease-in-out',
                  opacity: option.disabled ? 0.6 : 1,
                }}
              />

              {/* Поле для індивідуального відсотка */}
              {option.value === 'CUSTOM' && selectedValue === 'CUSTOM' && allowCustom && (
                <Box sx={{ mt: 1, ml: 4 }}>
                  <TextField
                    label="Відсоток знижки"
                    value={customValue}
                    onChange={handleCustomPercentageChange}
                    type="number"
                    size="small"
                    InputProps={{
                      endAdornment: '%',
                    }}
                    inputProps={{
                      min: 0,
                      max: 50,
                      step: 1,
                    }}
                    sx={{ width: 150 }}
                    disabled={disabled}
                  />
                </Box>
              )}
            </Box>
          ))}
        </RadioGroup>

        {/* Помилка валідації */}
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

        {/* Інформаційне повідомлення */}
        {selectedValue !== 'NONE' && !hasRestrictedItems && (
          <Alert severity="info" sx={{ mt: 1 }} icon={<Info />}>
            <Typography variant="body2">
              Знижка буде застосована до всіх відповідних послуг у замовленні.
            </Typography>
          </Alert>
        )}
      </FormControl>
    </Box>
  );
};
