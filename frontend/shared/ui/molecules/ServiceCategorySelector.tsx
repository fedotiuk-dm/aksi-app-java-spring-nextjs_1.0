'use client';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';

import { InfoChip } from '../atoms';

interface ServiceCategory {
  value: string;
  label: string;
  description: string;
  unitOfMeasure: string;
}

interface ServiceCategorySelectorProps {
  categories: ServiceCategory[];
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  error?: string;
  label?: string;
  showSelectedInfo?: boolean;
}

/**
 * Селектор категорій послуг з додатковою інформацією
 */
export const ServiceCategorySelector: React.FC<ServiceCategorySelectorProps> = ({
  categories,
  value,
  onChange,
  error,
  label = 'Оберіть категорію послуги',
  showSelectedInfo = true,
}) => {
  const selectedCategory = categories.find((cat) => cat.value === value);

  return (
    <Box>
      <FormControl fullWidth error={!!error} sx={{ mb: 2 }}>
        <InputLabel>{label}</InputLabel>
        <Select value={value} onChange={onChange} label={label}>
          {categories.map((category) => (
            <MenuItem key={category.value} value={category.value}>
              <Box>
                <Typography variant="body1">{category.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {category.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>

      {showSelectedInfo && selectedCategory && (
        <Alert severity="info" sx={{ mt: 1 }}>
          <Typography variant="body2">
            <strong>Обрана категорія:</strong> {selectedCategory.label}
          </Typography>
          <Typography variant="caption">
            Одиниця виміру: <InfoChip label={selectedCategory.unitOfMeasure} />
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
