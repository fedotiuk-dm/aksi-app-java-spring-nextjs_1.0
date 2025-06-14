'use client';

import { Search as SearchIcon } from '@mui/icons-material';
import { Card, CardContent, TextField } from '@mui/material';
import React from 'react';

interface ItemManagerSearchFormProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const ItemManagerSearchForm: React.FC<ItemManagerSearchFormProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Пошук за назвою або категорією',
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <TextField
          fullWidth
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
      </CardContent>
    </Card>
  );
};
