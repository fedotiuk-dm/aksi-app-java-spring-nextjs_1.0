'use client';

import { Refresh, Clear } from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Switch,
  FormControlLabel,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';
import React, { useState } from 'react';

interface AutocompleteSelectorOption {
  id: string;
  label: string;
  subtitle?: string;
  extra?: string;
  disabled?: boolean;
  [key: string]: any; // для додаткових полів
}

interface AutocompleteSelectorProps<T extends AutocompleteSelectorOption> {
  title?: string;
  label: string;
  placeholder?: string;
  options: T[];
  selectedOption: T | null;
  searchResults?: T[] | null;
  onSelect: (option: T) => void;
  onSearch: (keyword: string) => Promise<void>;
  onClearSearch: () => void;
  onRefresh?: () => Promise<void>;
  isLoading: boolean;
  error: string | null;

  // Фільтрація
  showFilter?: boolean;
  filterLabel?: string;
  filterValue?: boolean;
  onToggleFilter?: () => Promise<void>;

  // Опціональне форматування
  formatOptionLabel?: (option: T) => string;
  renderOptionContent?: (option: T) => React.ReactNode;

  // Стилізація та поведінка
  disabled?: boolean;
  className?: string;
  size?: 'small' | 'medium';
  required?: boolean;
  helperText?: string;
  noOptionsText?: string;
  searchResultsText?: string;
}

/**
 * Універсальний компонент автокомпліту з пошуком та фільтрацією
 *
 * Особливості:
 * - Пошук з автокомплітом
 * - Опціональна фільтрація (наприклад, "тільки активні")
 * - Оновлення списку
 * - Гнучке форматування опцій
 * - Валідація та помилки
 *
 * Використовується для:
 * - Вибір філій/приймальних пунктів
 * - Вибір клієнтів
 * - Вибір товарів/послуг
 * - Будь-які інші автокомпліти з пошуком
 */
export const AutocompleteSelector = <T extends AutocompleteSelectorOption>({
  title,
  label,
  placeholder = 'Почніть вводити для пошуку...',
  options,
  selectedOption,
  searchResults,
  onSelect,
  onSearch,
  onClearSearch,
  onRefresh,
  isLoading,
  error,
  showFilter = false,
  filterLabel = 'Фільтр',
  filterValue = false,
  onToggleFilter,
  formatOptionLabel,
  renderOptionContent,
  disabled = false,
  className,
  size = 'medium',
  required = false,
  helperText,
  noOptionsText = 'Опції не знайдено',
  searchResultsText = 'результати пошуку',
}: AutocompleteSelectorProps<T>) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  // Визначаємо список для відображення
  const displayOptions = searchResults || options;

  /**
   * Обробник зміни пошукового запиту
   */
  const handleSearchChange = async (keyword: string) => {
    setSearchKeyword(keyword);
    if (keyword.trim()) {
      await onSearch(keyword.trim());
    } else {
      onClearSearch();
    }
  };

  /**
   * Обробник очищення пошуку
   */
  const handleClearSearch = () => {
    setSearchKeyword('');
    onClearSearch();
  };

  /**
   * Форматування опції для відображення в Autocomplete
   */
  const getOptionLabel = (option: T) => {
    if (formatOptionLabel) {
      return formatOptionLabel(option);
    }
    return option.subtitle ? `${option.label} - ${option.subtitle}` : option.label;
  };

  /**
   * Перевірка чи рівні два об'єкти
   */
  const isOptionEqualToValue = (option: T, value: T) => {
    return option.id === value.id;
  };

  /**
   * Рендер вмісту опції
   */
  const renderOption = (props: any, option: T) => {
    const { key, ...otherProps } = props;

    if (renderOptionContent) {
      return (
        <Box component="li" key={key} {...otherProps}>
          {renderOptionContent(option)}
        </Box>
      );
    }

    return (
      <Box component="li" key={key} {...otherProps}>
        <Box>
          <Typography variant="body1" fontWeight="medium">
            {option.label}
          </Typography>
          {option.subtitle && (
            <Typography variant="body2" color="text.secondary">
              {option.subtitle}
            </Typography>
          )}
          {option.extra && (
            <Typography variant="caption" color="text.secondary">
              {option.extra}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box className={className}>
      {/* Заголовок та контроли */}
      {(title || showFilter || onRefresh) && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          {title && <Typography variant="h6">{title}</Typography>}

          <Stack direction="row" spacing={1} alignItems="center">
            {showFilter && onToggleFilter && (
              <FormControlLabel
                control={
                  <Switch
                    checked={filterValue}
                    onChange={onToggleFilter}
                    disabled={isLoading}
                    size={size}
                  />
                }
                label={filterLabel}
              />
            )}

            {onRefresh && (
              <Tooltip title="Оновити список">
                <IconButton onClick={onRefresh} disabled={isLoading} size={size}>
                  {isLoading ? <CircularProgress size={size === 'small' ? 16 : 20} /> : <Refresh />}
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      )}

      {/* Відображення помилки */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Автокомпліт */}
      <Autocomplete
        options={displayOptions}
        value={selectedOption}
        onChange={(_, newValue) => {
          if (newValue) {
            onSelect(newValue);
          }
        }}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        loading={isLoading}
        disabled={disabled || isLoading}
        inputValue={searchKeyword}
        onInputChange={(_, newInputValue) => {
          handleSearchChange(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            variant="outlined"
            fullWidth
            required={required}
            size={size}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading && <CircularProgress size={size === 'small' ? 16 : 20} />}
                  {searchKeyword && (
                    <Tooltip title="Очистити пошук">
                      <IconButton size="small" onClick={handleClearSearch}>
                        <Clear />
                      </IconButton>
                    </Tooltip>
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={renderOption}
        noOptionsText={searchKeyword ? noOptionsText : `Немає доступних опцій`}
        sx={{ mb: 1 }}
      />

      {/* Статистика */}
      <Typography variant="body2" color="text.secondary">
        Знайдено: {displayOptions.length}
        {searchResults && (
          <Box component="span" sx={{ ml: 1 }}>
            ({searchResultsText})
          </Box>
        )}
      </Typography>
    </Box>
  );
};
