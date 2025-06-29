'use client';

import {
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormLabel,
  Box,
  Chip,
  Typography,
} from '@mui/material';
import React from 'react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectCheckboxGroupProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
  orientation?: 'row' | 'column';
  showSelectedTags?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

/**
 * Універсальний компонент для групи чекбоксів з мультивибором
 *
 * Особливості:
 * - Підтримка горизонтального та вертикального розташування
 * - Відображення вибраних значень у вигляді тегів
 * - Валідація та помилки
 * - Консистентний стиль з іншими shared компонентами
 *
 * Використовується для:
 * - Способи зв'язку клієнтів
 * - Категорії товарів
 * - Будь-які інші мультивибори
 */
export const MultiSelectCheckboxGroup: React.FC<MultiSelectCheckboxGroupProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  disabled = false,
  size = 'medium',
  orientation = 'row',
  showSelectedTags = true,
  className,
  required = false,
  error,
  helperText,
}) => {
  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter((v) => v !== value));
    }
  };

  return (
    <Box className={className}>
      <FormLabel component="legend" sx={{ mb: 1 }} required={required} error={!!error}>
        {label}
      </FormLabel>

      <FormGroup row={orientation === 'row'}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={selectedValues.includes(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                disabled={disabled || option.disabled}
                size={size}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>

      {/* Відображення помилки */}
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}

      {/* Допоміжний текст */}
      {helperText && !error && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {helperText}
        </Typography>
      )}

      {/* Теги вибраних значень */}
      {showSelectedTags && selectedValues.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Вибрано ({selectedValues.length}):
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {selectedValues.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <Chip
                  key={value}
                  label={option?.label || value}
                  size="small"
                  variant="outlined"
                  color="primary"
                  onDelete={!disabled ? () => handleChange(value, false) : undefined}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};
