'use client';

import React from 'react';
import { Box, TextField, Button, Stack, IconButton, CircularProgress } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

interface ClientSearchFormProps {
  // Швидкий пошук
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onQuickSearch: () => void;

  // Стан
  isSearching: boolean;
  onClearSearch: () => void;

  // Додаткові опції
  placeholder?: string;
  disabled?: boolean;

  // Debounce індикація (опціонально)
  isAutoSearching?: boolean;
  showAutoSearchIndicator?: boolean;
}

export const ClientSearchForm: React.FC<ClientSearchFormProps> = ({
  searchTerm,
  onSearchTermChange,
  onQuickSearch,
  isSearching,
  onClearSearch,
  placeholder = "Введіть прізвище, ім'я, телефон або email",
  disabled = false,
  isAutoSearching = false,
  showAutoSearchIndicator = true,
}) => {
  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSearch();
  };

  return (
    <Box>
      {/* Швидкий пошук з автоматичним debounce */}
      <form onSubmit={handleQuickSearchSubmit}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <TextField
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            label="Пошук клієнта"
            placeholder={placeholder}
            fullWidth
            disabled={disabled}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={onClearSearch} disabled={disabled}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
            helperText={
              isSearching || isAutoSearching
                ? isAutoSearching && showAutoSearchIndicator
                  ? 'Автоматичний пошук...'
                  : 'Пошук...'
                : searchTerm.length > 0 && searchTerm.length < 2
                  ? 'Введіть мінімум 2 символи'
                  : ''
            }
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isSearching || !searchTerm || searchTerm.length < 2 || disabled}
            sx={{ minWidth: 140 }}
          >
            {isSearching ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Пошук...
              </>
            ) : (
              'Пошук'
            )}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
