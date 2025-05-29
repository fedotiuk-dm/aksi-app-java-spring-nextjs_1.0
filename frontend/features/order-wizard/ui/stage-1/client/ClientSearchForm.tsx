'use client';

import { Search, Clear } from '@mui/icons-material';
import { Box, TextField, Button, Typography, InputAdornment, Alert } from '@mui/material';
import { useState, useEffect, useCallback, useRef } from 'react';

import { useClientManagement } from '@/domain/wizard';

interface ClientSearchFormProps {
  isLoading: boolean;
  error: string | null;
}

/**
 * Поліпшений кастомний хук для debounce
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Очищуємо попередній таймер
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Встановлюємо новий таймер
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup функція
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Форма пошуку клієнтів
 * Дозволяє шукати за різними критеріями з debounce
 */
export const ClientSearchForm = ({ isLoading, error }: ClientSearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchClients, clearSearch, hasSearchResults } = useClientManagement();

  // Debounce пошукового терміну з затримкою 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Референс для попереднього значення, щоб уникнути зайвих викликів
  const prevDebouncedTermRef = useRef<string>('');

  // Автоматичний пошук при зміні debounced значення
  useEffect(() => {
    const currentTerm = debouncedSearchTerm.trim();
    const prevTerm = prevDebouncedTermRef.current;

    // Перевіряємо, чи справді змінилося значення
    if (currentTerm === prevTerm) {
      return;
    }

    // Оновлюємо попереднє значення
    prevDebouncedTermRef.current = currentTerm;

    if (currentTerm.length >= 2) {
      searchClients(currentTerm);
    } else if (currentTerm.length === 0) {
      clearSearch();
    }
  }, [debouncedSearchTerm]); // Видалили searchClients та clearSearch з залежностей

  const handleManualSearch = useCallback(() => {
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm || trimmedTerm.length < 2) return;
    searchClients(trimmedTerm);
  }, [searchTerm, searchClients]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    prevDebouncedTermRef.current = '';
    clearSearch();
  }, [clearSearch]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleManualSearch();
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Пошук клієнта
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Введіть мінімум 2 символи для автоматичного пошуку
      </Typography>

      {/* Поле пошуку */}
      <TextField
        fullWidth
        placeholder="Введіть прізвище, телефон або email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <Button
                size="small"
                onClick={handleClear}
                disabled={isLoading}
                sx={{ minWidth: 'auto', p: 0.5 }}
              >
                <Clear fontSize="small" />
              </Button>
            </InputAdornment>
          ),
        }}
        helperText={
          searchTerm.trim().length > 0 && searchTerm.trim().length < 2
            ? 'Введіть мінімум 2 символи'
            : isLoading
              ? 'Пошук...'
              : searchTerm.trim().length >= 2
                ? ''
                : ''
        }
      />

      {/* Кнопки */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleManualSearch}
          disabled={!searchTerm.trim() || searchTerm.trim().length < 2 || isLoading}
          startIcon={<Search />}
          fullWidth
        >
          {isLoading ? 'Пошук...' : 'Знайти зараз'}
        </Button>

        <Button
          variant="outlined"
          onClick={handleClear}
          disabled={isLoading || !searchTerm}
          startIcon={<Clear />}
        >
          Очистити
        </Button>
      </Box>

      {/* Помилка */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};
