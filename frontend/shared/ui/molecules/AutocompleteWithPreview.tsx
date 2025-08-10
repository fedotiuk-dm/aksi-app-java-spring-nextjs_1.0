import React from 'react';
import { Autocomplete, TextField, Typography } from '@mui/material';
import { formatPrice } from '@/shared/lib/utils';

type OptionWithPreview<T = unknown> = T & {
  id: string;
  name: string;
  priceBlack?: number;
  basePrice?: number;
};

type Props<T> = {
  label: string;
  placeholder?: string;
  emptyPlaceholder?: string;
  helperText?: string;
  options: OptionWithPreview<T>[];
  value: OptionWithPreview<T> | null;
  onChange: (value: OptionWithPreview<T> | null) => void;
  loading?: boolean;
  disabled?: boolean;
  showPricePreview?: boolean;
  getPreviewText?: (option: OptionWithPreview<T>) => string;
};

export const AutocompleteWithPreview = <T,>({
  label,
  placeholder = 'Пошук...',
  emptyPlaceholder = 'Немає доступних варіантів',
  helperText,
  options,
  value,
  onChange,
  loading = false,
  disabled = false,
  showPricePreview = false,
  getPreviewText,
}: Props<T>) => {
  const defaultPreviewText = (option: OptionWithPreview<T>) => {
    if (!showPricePreview) return '';

    const parts = [];
    if (option.priceBlack) {
      parts.push(`Чорний: ${formatPrice(option.priceBlack)}`);
    }
    if (option.basePrice) {
      parts.push(`Кольоровий: ${formatPrice(option.basePrice)}`);
    }
    return parts.join(', ');
  };

  const previewText = getPreviewText || defaultPreviewText;

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option?.name || ''}
      loading={loading}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={options.length > 0 ? placeholder : emptyPlaceholder}
          helperText={helperText}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <div>
            <div>{option.name}</div>
            {showPricePreview && (
              <Typography variant="caption" color="text.secondary">
                {previewText(option)}
              </Typography>
            )}
          </div>
        </li>
      )}
    />
  );
};
