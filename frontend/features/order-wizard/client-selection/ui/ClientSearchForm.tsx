'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
  useTheme,
  Typography,
  Alert,
  Button,
  Collapse,
} from '@mui/material';
import React, { useCallback, useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { useClientSearch } from '../hooks';

/**
 * Компонент форми пошуку клієнтів
 */
export const ClientSearchForm: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showError, setShowError] = useState(false);

  // Використовуємо хук для пошуку клієнтів
  const {
    form,
    isSearching,
    isLoading,
    validationMessage,
    error,
    handleSearch,
    handleQueryChange,
    handleClearSearch,
    search,
  } = useClientSearch();

  // Відображення помилки з затримкою для кращого UX
  useEffect(() => {
    if (error) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [error]);

  // Використовуємо форму з хука
  const {
    control,
    formState: { errors },
  } = form;

  // Обробник зміни тексту з затримкою
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      onChange: (value: string) => void
    ) => {
      const value = e.target.value;
      onChange(value);
      handleQueryChange(value);

      // Скидаємо помилку при зміні вводу
      if (error) {
        setShowError(false);
      }
    },
    [handleQueryChange, error]
  );

  return (
    <Box component="form" onSubmit={handleSearch} noValidate>
      <Controller
        name="query"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            variant="outlined"
            placeholder="Введіть прізвище клієнта для пошуку"
            error={!!errors.query || !!error}
            helperText={validationMessage || errors.query?.message}
            onChange={(e) => handleInputChange(e, field.onChange)}
            disabled={isSearching}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {(isSearching || isLoading) && <CircularProgress size={20} color="primary" />}
                  {field.value && !isSearching && (
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClearSearch}
                      edge="end"
                      disabled={isSearching || isLoading}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1 }}
            onKeyDown={(e) => {
              // Запобігаємо багаторазовому натисканню Enter
              if (e.key === 'Enter' && (isSearching || isLoading)) {
                e.preventDefault();
              }
            }}
          />
        )}
      />

      <Collapse in={showError}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setShowError(false)}>
            {error}
          </Alert>
        )}
      </Collapse>

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
        Пошук здійснюється за прізвищем клієнта. Введіть мінімум 2 символи.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          startIcon={<SearchIcon />}
          disabled={isSearching || isLoading || search.query.length < 2}
        >
          {isSearching || isLoading ? 'Пошук...' : 'Знайти'}
        </Button>
      </Box>
    </Box>
  );
};

export default ClientSearchForm;
