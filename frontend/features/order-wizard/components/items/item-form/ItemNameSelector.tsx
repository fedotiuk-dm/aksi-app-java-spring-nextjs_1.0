import React from 'react';
import { Autocomplete, TextField, Typography } from '@mui/material';
import { useItemNameOperations } from '@features/order-wizard/hooks';

export const ItemNameSelector: React.FC = () => {
  const { 
    itemOptions,
    selectedItem,
    handleAutocompleteChange,
    isLoading,
    isDisabled,
    helperText,
    selectedCategoryCode
  } = useItemNameOperations();

  // Show helper text if no category selected
  if (!selectedCategoryCode) {
    return (
      <div>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Найменування предмета
        </Typography>
        <TextField
          fullWidth
          disabled
          placeholder="Спочатку виберіть категорію послуги"
          helperText="Виберіть категорію для показу доступних предметів"
        />
      </div>
    );
  }

  return (
    <Autocomplete
      options={itemOptions}
      getOptionLabel={(option) => option?.name || ''}
      loading={isLoading}
      value={selectedItem}
      onChange={(_, newValue) => handleAutocompleteChange(newValue)}
      disabled={isDisabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Найменування предмета"
          placeholder={itemOptions.length > 0 ? "Пошук предмета..." : "Немає доступних предметів"}
          helperText={helperText}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <div>
            <div>{option.name}</div>
            <Typography variant="caption" color="text.secondary">
              {option.priceBlack ? `Чорний: ${(option.priceBlack / 100).toFixed(2)} ₴` : ''}
              {option.priceBlack && option.basePrice ? ', ' : ''}
              {option.basePrice ? `Кольоровий: ${(option.basePrice / 100).toFixed(2)} ₴` : ''}
            </Typography>
          </div>
        </li>
      )}
    />
  );
};