'use client';

import { MonetizationOn, Warning, CheckCircle } from '@mui/icons-material';
import { Box, Typography, TextField, InputAdornment, Alert, Chip, Slider } from '@mui/material';
import React, { useState, useCallback, useMemo } from 'react';

interface PrepaymentAmountFieldProps {
  value: number;
  onChange: (amount: number) => void;
  totalAmount: number;
  maxAmount?: number;
  minAmount?: number;
  disabled?: boolean;
  error?: string;
  currency?: string;
  title?: string;
  description?: string;
  showSlider?: boolean;
  showPercentage?: boolean;
  variant?: 'standard' | 'compact';
}

/**
 * Компонент для введення суми передоплати
 */
export const PrepaymentAmountField: React.FC<PrepaymentAmountFieldProps> = ({
  value,
  onChange,
  totalAmount,
  maxAmount,
  minAmount = 0,
  disabled = false,
  error,
  currency = 'грн',
  title = 'Сума передоплати',
  description,
  showSlider = false,
  showPercentage = true,
  variant = 'standard',
}) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const effectiveMaxAmount = maxAmount ?? totalAmount;

  /**
   * Форматування валюти
   */
  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  /**
   * Розрахунок відсотка передоплати
   */
  const percentage = useMemo(() => {
    if (totalAmount === 0) return 0;
    return Math.round((value / totalAmount) * 100);
  }, [value, totalAmount]);

  /**
   * Розрахунок залишку
   */
  const remainingAmount = useMemo(() => {
    return Math.max(0, totalAmount - value);
  }, [totalAmount, value]);

  /**
   * Валідація суми
   */
  const validationStatus = useMemo(() => {
    if (value < minAmount)
      return { type: 'error', message: `Мінімальна сума: ${formatCurrency(minAmount)}` };
    if (value > effectiveMaxAmount)
      return { type: 'error', message: `Максимальна сума: ${formatCurrency(effectiveMaxAmount)}` };
    if (value === totalAmount) return { type: 'success', message: 'Повна оплата' };
    if (value > 0) return { type: 'info', message: `Залишок: ${formatCurrency(remainingAmount)}` };
    return { type: 'default', message: 'Без передоплати' };
  }, [value, minAmount, effectiveMaxAmount, totalAmount, remainingAmount]);

  /**
   * Обробник зміни тексту
   */
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInputValue(newValue);

      const numericValue = parseFloat(newValue) || 0;
      if (!isNaN(numericValue) && numericValue >= 0) {
        onChange(Math.min(numericValue, effectiveMaxAmount));
      }
    },
    [onChange, effectiveMaxAmount]
  );

  /**
   * Обробник втрати фокусу
   */
  const handleBlur = useCallback(() => {
    setInputValue(value.toFixed(2));
  }, [value]);

  /**
   * Обробник слайдера
   */
  const handleSliderChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      const amount = Array.isArray(newValue) ? newValue[0] : newValue;
      onChange(amount);
      setInputValue(amount.toFixed(2));
    },
    [onChange]
  );

  /**
   * Швидкі дії
   */
  const handleQuickAction = useCallback(
    (percentage: number) => {
      const amount = Math.round((totalAmount * percentage) / 100);
      onChange(amount);
      setInputValue(amount.toFixed(2));
    },
    [totalAmount, onChange]
  );

  if (variant === 'compact') {
    return (
      <Box>
        <TextField
          label={title}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled}
          type="number"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MonetizationOn color="primary" />
              </InputAdornment>
            ),
            endAdornment: <InputAdornment position="end">{currency}</InputAdornment>,
          }}
          error={!!error || validationStatus.type === 'error'}
          helperText={error || validationStatus.message}
          fullWidth
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* Заголовок */}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <MonetizationOn color="primary" />
        {title}
        {showPercentage && value > 0 && (
          <Chip
            label={`${percentage}%`}
            size="small"
            color={percentage === 100 ? 'success' : 'primary'}
            variant="outlined"
          />
        )}
      </Typography>

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}

      {/* Поле введення */}
      <TextField
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        disabled={disabled}
        type="number"
        placeholder="0.00"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MonetizationOn color="primary" />
            </InputAdornment>
          ),
          endAdornment: <InputAdornment position="end">{currency}</InputAdornment>,
        }}
        error={!!error || validationStatus.type === 'error'}
        helperText={error || validationStatus.message}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Слайдер */}
      {showSlider && !disabled && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Швидкий вибір суми:
          </Typography>
          <Slider
            value={value}
            onChange={handleSliderChange}
            min={minAmount}
            max={effectiveMaxAmount}
            step={10}
            marks={[
              { value: 0, label: '0%' },
              { value: totalAmount * 0.25, label: '25%' },
              { value: totalAmount * 0.5, label: '50%' },
              { value: totalAmount * 0.75, label: '75%' },
              { value: totalAmount, label: '100%' },
            ]}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => formatCurrency(value)}
          />
        </Box>
      )}

      {/* Швидкі дії */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          label="0%"
          size="small"
          onClick={() => handleQuickAction(0)}
          disabled={disabled}
          variant={value === 0 ? 'filled' : 'outlined'}
          color="default"
          clickable
        />
        <Chip
          label="25%"
          size="small"
          onClick={() => handleQuickAction(25)}
          disabled={disabled}
          variant={Math.abs(value - totalAmount * 0.25) < 1 ? 'filled' : 'outlined'}
          color="primary"
          clickable
        />
        <Chip
          label="50%"
          size="small"
          onClick={() => handleQuickAction(50)}
          disabled={disabled}
          variant={Math.abs(value - totalAmount * 0.5) < 1 ? 'filled' : 'outlined'}
          color="primary"
          clickable
        />
        <Chip
          label="100%"
          size="small"
          onClick={() => handleQuickAction(100)}
          disabled={disabled}
          variant={value === totalAmount ? 'filled' : 'outlined'}
          color="success"
          clickable
        />
      </Box>

      {/* Статус */}
      {validationStatus.type !== 'default' && (
        <Alert
          severity={validationStatus.type as 'error' | 'info' | 'success'}
          icon={
            validationStatus.type === 'success' ? (
              <CheckCircle />
            ) : validationStatus.type === 'error' ? (
              <Warning />
            ) : undefined
          }
          sx={{ mt: 1 }}
        >
          {validationStatus.message}
        </Alert>
      )}
    </Box>
  );
};
