'use client';

import { CreditCard, Money, AccountBalance, Payment } from '@mui/icons-material';
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
} from '@mui/material';
import React from 'react';

export interface PaymentMethodOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface PaymentMethodSelectorProps {
  options: PaymentMethodOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  title?: string;
  description?: string;
  variant?: 'standard' | 'compact';
}

/**
 * Компонент для вибору способу оплати
 */
export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  options,
  selectedValue,
  onChange,
  disabled = false,
  error,
  title = 'Спосіб оплати',
  description,
  variant = 'standard',
}) => {
  /**
   * Обробник зміни способу оплати
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  /**
   * Отримання іконки для способу оплати за замовчуванням
   */
  const getDefaultIcon = (value: string): React.ReactNode => {
    switch (value.toUpperCase()) {
      case 'TERMINAL':
        return <CreditCard />;
      case 'CASH':
        return <Money />;
      case 'BANK_TRANSFER':
      case 'ACCOUNT':
        return <AccountBalance />;
      default:
        return <Payment />;
    }
  };

  /**
   * Отримання кольору для способу оплати
   */
  const getPaymentColor = (value: string): 'primary' | 'success' | 'info' | 'secondary' => {
    switch (value.toUpperCase()) {
      case 'TERMINAL':
        return 'primary';
      case 'CASH':
        return 'success';
      case 'BANK_TRANSFER':
      case 'ACCOUNT':
        return 'info';
      default:
        return 'secondary';
    }
  };

  if (variant === 'compact') {
    return (
      <FormControl component="fieldset" disabled={disabled} fullWidth>
        <FormLabel component="legend" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </FormLabel>

        <RadioGroup value={selectedValue} onChange={handleChange} row>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio size="small" />}
              label={
                <Chip
                  icon={option.icon || getDefaultIcon(option.value)}
                  label={option.label}
                  size="small"
                  color={selectedValue === option.value ? getPaymentColor(option.value) : 'default'}
                  variant={selectedValue === option.value ? 'filled' : 'outlined'}
                />
              }
              disabled={option.disabled}
              sx={{ mr: 2 }}
            />
          ))}
        </RadioGroup>

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
      </FormControl>
    );
  }

  return (
    <FormControl component="fieldset" disabled={disabled} fullWidth>
      <FormLabel component="legend" sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Payment color="primary" />
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
              disabled={option.disabled}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  {/* Іконка */}
                  <Box
                    sx={{
                      color: selectedValue === option.value ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {option.icon || getDefaultIcon(option.value)}
                  </Box>

                  {/* Текст */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {option.label}
                    </Typography>
                    {option.description && (
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    )}
                  </Box>

                  {/* Індикатор вибору */}
                  {selectedValue === option.value && (
                    <Chip
                      size="small"
                      label="Обрано"
                      color={getPaymentColor(option.value)}
                      variant="filled"
                    />
                  )}
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
                opacity: option.disabled ? 0.6 : 1,
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
