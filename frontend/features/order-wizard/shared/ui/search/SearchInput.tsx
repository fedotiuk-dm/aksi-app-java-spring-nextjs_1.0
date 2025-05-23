'use client';

import { Search, Clear } from '@mui/icons-material';
import { TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  className?: string;
  autoFocus?: boolean;
  debounceMs?: number;
}

/**
 * Універсальний компонент поля пошуку
 * Забезпечує консистентний стиль та поведінку для всіх пошукових полів в Order Wizard
 *
 * Особливості:
 * - Автоматичний debounce для оптимізації запитів
 * - Кнопки пошуку та очищення
 * - Loading стан
 * - Клавіатурні скорочення (Enter для пошуку, Escape для очищення)
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Введіть текст для пошуку...',
  label,
  disabled = false,
  loading = false,
  size = 'medium',
  fullWidth = true,
  className,
  autoFocus = false,
  debounceMs = 300,
}) => {
  const [localValue, setLocalValue] = React.useState(value);
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // Синхронізуємо локальне значення з зовнішнім
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange
  React.useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [localValue, value, onChange, debounceMs]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearch?.(localValue);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleClear();
    }
  };

  const handleSearch = () => {
    onSearch?.(localValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    onClear?.();
  };

  const showClearButton = localValue.length > 0 && !loading;

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={localValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      size={size}
      fullWidth={fullWidth}
      className={className}
      autoFocus={autoFocus}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <IconButton
                size="small"
                onClick={handleSearch}
                disabled={disabled || !localValue.trim()}
                edge="start"
              >
                <Search />
              </IconButton>
            )}
          </InputAdornment>
        ),
        endAdornment: showClearButton && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear} disabled={disabled} edge="end">
              <Clear />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
