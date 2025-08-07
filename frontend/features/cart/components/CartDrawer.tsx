'use client';

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Button,
  Stack,
} from '@mui/material';
import {
  Close,
  ShoppingCart,
  Add,
  Person,
} from '@mui/icons-material';
import { useCartStore } from '@/features/cart';
import { useGetCart } from '@/shared/api/generated/cart';
import { CartItemList } from './CartItemList';
import { CartTotal } from './CartTotal';
import { CartModifiers } from './CartModifiers';
import { CustomerSelector } from '@/features/cart';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    closeCart,
    selectedCustomer,
    openAddItemModal,
    hasSelectedCustomer,
  } = useCartStore();

  // Завантажуємо корзину тільки якщо є вибраний клієнт
  const { 
    data: cart, 
    isLoading, 
    error 
  } = useGetCart({
    query: {
      enabled: !!selectedCustomer?.id,
    }
  });

  const handleAddItem = () => {
    if (!hasSelectedCustomer()) {
      alert('Спочатку оберіть клієнта');
      return;
    }
    openAddItemModal();
  };

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={closeCart}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCart />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Корзина
          </Typography>
          <IconButton onClick={closeCart}>
            <Close />
          </IconButton>
        </Box>

        <Divider />

        {/* Customer Selection */}
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person fontSize="small" />
              <Typography variant="subtitle2">
                Клієнт:
              </Typography>
            </Box>
            <CustomerSelector />
          </Stack>
        </Box>

        <Divider />

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {!hasSelectedCustomer() ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Alert severity="info">
                Оберіть клієнта для початку роботи з корзиною
              </Alert>
            </Box>
          ) : isLoading ? (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">
                Помилка завантаження корзини
              </Alert>
            </Box>
          ) : !cart || cart.items.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Корзина порожня
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddItem}
                fullWidth
              >
                Додати послугу
              </Button>
            </Box>
          ) : (
            <Box>
              {/* Cart Items */}
              <CartItemList cart={cart} />
              
              <Divider />
              
              {/* Modifiers */}
              <CartModifiers cart={cart} />
              
              <Divider />
              
              {/* Total */}
              <CartTotal cart={cart} />
            </Box>
          )}
        </Box>

        {/* Footer Actions */}
        {hasSelectedCustomer() && cart && cart.items.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddItem}
                  fullWidth
                >
                  Додати ще послугу
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                >
                  Створити замовлення
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};