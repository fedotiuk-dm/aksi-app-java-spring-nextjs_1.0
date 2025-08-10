import React from 'react';
import { TextField, Typography } from '@mui/material';
import { AutocompleteWithPreview } from '@shared/ui/molecules';
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
    <AutocompleteWithPreview
      label="Найменування предмета"
      placeholder="Пошук предмета..."
      emptyPlaceholder="Немає доступних предметів"
      helperText={helperText}
      options={itemOptions}
      value={selectedItem}
      onChange={handleAutocompleteChange}
      loading={isLoading}
      disabled={isDisabled}
      showPricePreview={true}
    />
  );
};