'use client';

import { TrendingUp, Schedule } from '@mui/icons-material';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Alert,
} from '@mui/material';
import React from 'react';

export interface UrgencyOption {
  value: string;
  label: string;
  description: string;
  multiplier: number;
  surcharge?: number;
}

interface UrgencyOptionSelectorProps {
  options: UrgencyOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  title?: string;
  description?: string;
}

/**
 * Компонент для вибору рівня терміновості замовлення
 */
export const UrgencyOptionSelector: React.FC<UrgencyOptionSelectorProps> = ({
  options,
  selectedValue,
  onChange,
  disabled = false,
  error,
  title = 'Рівень терміновості',
  description,
}) => {
  /**
   * Обробник зміни варіанту терміновості
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  /**
   * Отримання кольору для варіанту терміновості
   */
  const getUrgencyColor = (option: UrgencyOption): 'success' | 'warning' | 'error' | 'info' => {
    if (option.multiplier === 1) return 'success';
    if (option.multiplier <= 1.5) return 'warning';
    if (option.multiplier <= 2) return 'error';
    return 'info';
  };

  /**
   * Отримання тексту надбавки
   */
  const getSurchargeText = (option: UrgencyOption): string => {
    if (option.multiplier === 1) return 'Стандарт';
    return `+${Math.round((option.multiplier - 1) * 100)}%`;
  };

  return (
    <FormControl component="fieldset" disabled={disabled} fullWidth>
      <FormLabel component="legend" sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Schedule color="primary" />
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </FormLabel>

      <RadioGroup value={selectedValue} onChange={handleChange} sx={{ gap: 1 }}>
        {options.map((option) => (
          <Box key={option.value} sx={{ mb: 1 }}>
            <FormControlLabel
              value={option.value}
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {option.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>

                  {/* Chip з інформацією про надбавку */}
                  <Chip
                    size="small"
                    icon={option.multiplier > 1 ? <TrendingUp /> : undefined}
                    label={getSurchargeText(option)}
                    color={getUrgencyColor(option)}
                    variant={selectedValue === option.value ? 'filled' : 'outlined'}
                  />
                </Box>
              }
              sx={{
                m: 0,
                p: 1.5,
                border: '1px solid',
                borderColor: selectedValue === option.value ? 'primary.main' : 'divider',
                borderRadius: 1,
                backgroundColor: selectedValue === option.value ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                width: '100%',
                transition: 'all 0.2s ease-in-out',
              }}
            />
          </Box>
        ))}
      </RadioGroup>

      {/* Помилка валідації */}
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </FormControl>
  );
};
