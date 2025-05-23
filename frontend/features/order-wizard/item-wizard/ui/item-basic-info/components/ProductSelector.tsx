'use client';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React from 'react';

interface Product {
  id: string;
  name: string;
  basePrice: number;
}

interface ProductSelectorProps {
  products: Product[];
  selectedProductId: string;
  onProductChange: (productId: string) => void;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Компонент для вибору виробу
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення селектора продуктів
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки
 */
export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProductId,
  onProductChange,
  disabled = false,
  required = false,
}) => {
  return (
    <FormControl fullWidth required={required} disabled={disabled || products.length === 0}>
      <InputLabel>Найменування виробу</InputLabel>
      <Select
        value={selectedProductId}
        onChange={(e) => onProductChange(e.target.value)}
        label="Найменування виробу"
      >
        {products.map((product) => (
          <MenuItem key={product.id} value={product.id}>
            {product.name} - {product.basePrice} грн
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProductSelector;
