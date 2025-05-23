'use client';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React from 'react';

interface ServiceCategory {
  id: string;
  name: string;
  unit: string;
}

interface ServiceCategorySelectorProps {
  categories: ServiceCategory[];
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Компонент для вибору категорії послуги
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення селектора
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки
 */
export const ServiceCategorySelector: React.FC<ServiceCategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
  disabled = false,
  required = false,
}) => {
  return (
    <FormControl fullWidth required={required} disabled={disabled}>
      <InputLabel>Категорія послуги</InputLabel>
      <Select
        value={selectedCategoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        label="Категорія послуги"
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ServiceCategorySelector;
