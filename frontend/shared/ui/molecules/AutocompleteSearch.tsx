import React from 'react';
import { Autocomplete, TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Search, QrCodeScanner } from '@mui/icons-material';

type Props<T> = {
  options: T[];
  getOptionLabel: (option: T) => string;
  loading?: boolean;
  value: T | null;
  onChange: (value: T | null) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  label: string;
  placeholder?: string;
  showQrScanner?: boolean;
  onQrScan?: () => void;
};

export function AutocompleteSearch<T>({
  options,
  getOptionLabel,
  loading = false,
  value,
  onChange,
  inputValue,
  onInputChange,
  label,
  placeholder,
  showQrScanner = false,
  onQrScan,
}: Props<T>) {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel}
      loading={loading}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, newValue) => onInputChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {loading && <CircularProgress size={20} />}
                  {showQrScanner && (
                    <IconButton size="small" onClick={onQrScan}>
                      <QrCodeScanner />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}