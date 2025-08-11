import React from 'react';
import { FormControl, FormLabel, Select, MenuItem, SelectProps } from '@mui/material';

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  options: Option[];
  placeholder?: string;
  loading?: boolean;
  value?: string;
  onChange?: SelectProps['onChange'];
  disabled?: boolean;
  fullWidth?: boolean;
};

export const SelectorField: React.FC<Props> = ({
  label,
  options,
  placeholder = "Виберіть опцію",
  loading = false,
  value = "",
  onChange,
  disabled = false,
  fullWidth = true,
}) => {
  return (
    <FormControl fullWidth={fullWidth}>
      <FormLabel>{label}</FormLabel>
      <Select 
        value={value}
        onChange={(event, child) => {
          // Clear focus before calling onChange
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          onChange?.(event, child);
        }}
        disabled={disabled || loading}
        displayEmpty
        autoFocus={false}
        MenuProps={{
          disableAutoFocus: true,
          disableAutoFocusItem: true,
          disableRestoreFocus: true,
          keepMounted: true,
          onClose: () => {
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          }
        }}
      >
        <MenuItem value="">
          {loading ? 'Завантаження...' : placeholder}
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};