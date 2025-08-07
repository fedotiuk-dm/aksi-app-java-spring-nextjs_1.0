'use client';

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { useGetAllActiveBranches } from '@/shared/api/generated/branch';

interface BranchSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  disabled?: boolean;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  value,
  onChange,
  label = 'Філія',
  required = false,
  fullWidth = true,
  size = 'medium',
  disabled = false,
}) => {
  const { data, isLoading, error } = useGetAllActiveBranches();

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value || null);
  };

  if (error) {
    return (
      <FormControl fullWidth={fullWidth} size={size} error>
        <InputLabel>{label}</InputLabel>
        <Select value="" disabled>
          <MenuItem value="">Помилка завантаження</MenuItem>
        </Select>
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth={fullWidth} size={size} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
        onChange={handleChange}
        disabled={disabled || isLoading}
        endAdornment={isLoading && <CircularProgress size={20} />}
      >
        {!required && <MenuItem value="">Без філії</MenuItem>}
        {data?.map((branch) => (
          <MenuItem key={branch.id} value={branch.id}>
            {branch.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};