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

import { Branch } from '@/domain/branch';

interface BranchSelectorProps {
  availableBranches: Branch[];
  selectedBranch: Branch | null;
  searchResults?: Branch[] | null;
  onSelectBranch: (branch: Branch) => void;
  onSearch: (keyword: string) => Promise<void>;
  onClearSearch: () => void;
  onRefresh: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  showActiveOnly: boolean;
  onToggleActiveFilter: () => Promise<void>;
}

/**
 * Компонент для вибору приймального пункту
 * Підтримує пошук, фільтрацію та вибір з автокомпліту
 */
export const BranchSelector: React.FC<BranchSelectorProps> = ({
  availableBranches,
  selectedBranch,
  searchResults,
  onSelectBranch,
  onSearch,
  onClearSearch,
  onRefresh,
  isLoading,
  error,
  showActiveOnly,
  onToggleActiveFilter,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  // Визначаємо список для відображення
  const displayBranches = searchResults || availableBranches;

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
  const formatBranchOption = (branch: Branch) => {
    return `${branch.name} - ${branch.address}`;
  };

  /**
   * Перевірка чи рівні два об'єкти Branch
   */
  const isOptionEqualToValue = (option: Branch, value: Branch) => {
    return option.id === value.id;
  };

  return (
    <Box>
      {/* Заголовок та контроли */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Приймальні пункти</Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <FormControlLabel
            control={
              <Switch
                checked={showActiveOnly}
                onChange={onToggleActiveFilter}
                disabled={isLoading}
              />
            }
            label="Тільки активні"
          />

          <Tooltip title="Оновити список">
            <IconButton onClick={onRefresh} disabled={isLoading}>
              {isLoading ? <CircularProgress size={20} /> : <Refresh />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Відображення помилки */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Автокомпліт для вибору філії */}
      <Autocomplete
        options={displayBranches}
        value={selectedBranch}
        onChange={(_, newValue) => {
          if (newValue) {
            onSelectBranch(newValue);
          }
        }}
        getOptionLabel={formatBranchOption}
        isOptionEqualToValue={isOptionEqualToValue}
        loading={isLoading}
        disabled={isLoading}
        inputValue={searchKeyword}
        onInputChange={(_, newInputValue) => {
          handleSearchChange(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Пошук приймального пункту"
            placeholder="Введіть назву або адресу..."
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading && <CircularProgress size={20} />}
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
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <Box component="li" key={key} {...otherProps}>
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {option.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.address}
                </Typography>
                {option.phone && (
                  <Typography variant="caption" color="text.secondary">
                    Тел: {option.phone}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        }}
        noOptionsText={searchKeyword ? 'Філій не знайдено' : 'Немає доступних приймальних пунктів'}
        sx={{ mb: 2 }}
      />

      {/* Статистика */}
      <Typography variant="body2" color="text.secondary">
        Знайдено філій: {displayBranches.length}
        {searchResults && (
          <Box component="span" sx={{ ml: 1 }}>
            (результати пошуку)
          </Box>
        )}
      </Typography>
    </Box>
  );
};
