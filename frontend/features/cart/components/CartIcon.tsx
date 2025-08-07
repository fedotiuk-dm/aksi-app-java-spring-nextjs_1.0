'use client';

import React from 'react';
import {
  IconButton,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart,
} from '@mui/icons-material';
import { useCartStore } from '@/features/cart';
import { useGetCart } from '@/shared/api/generated/cart';

export const CartIcon: React.FC = () => {
  const { toggleCart, selectedCustomer } = useCartStore();
  
  // Завантажуємо корзину тільки якщо є вибраний клієнт
  const { data: cart } = useGetCart({
    query: {
      enabled: !!selectedCustomer?.id,
      refetchInterval: 30000, // Оновлювати кожні 30 секунд
    }
  });

  const itemsCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Tooltip title="Корзина">
      <IconButton
        color="inherit"
        onClick={toggleCart}
        size="large"
      >
        <Badge 
          badgeContent={itemsCount} 
          color="secondary"
          max={99}
        >
          <ShoppingCart />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};