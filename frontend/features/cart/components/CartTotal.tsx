'use client';

import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import {
  Calculate,
  Receipt,
} from '@mui/icons-material';
import { formatPrice } from '@/shared/lib/utils/format';
import type { CartInfo } from '@/shared/api/generated/cart';
import { useCalculateCart } from '@/shared/api/generated/cart';

interface CartTotalProps {
  cart: CartInfo;
}

export const CartTotal: React.FC<CartTotalProps> = ({ cart }) => {
  const calculateMutation = useCalculateCart();

  const handleRecalculate = async () => {
    try {
      await calculateMutation.mutateAsync();
    } catch (error) {
      console.error('Помилка перерахунку:', error);
    }
  };

  const pricing = cart.pricing;

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt fontSize="small" />
          <Typography variant="subtitle2">
            Розрахунок суми
          </Typography>
        </Box>

        {/* Pricing breakdown */}
        <Stack spacing={1}>
          {/* Subtotal */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              Сума за послуги ({cart.items.length} поз.)
            </Typography>
            <Typography variant="body2">
              {formatPrice(pricing.itemsSubtotal)}
            </Typography>
          </Box>

          {/* Urgency surcharge */}
          {pricing.urgencyAmount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="warning.main">
                Доплата за терміновість
              </Typography>
              <Typography variant="body2" color="warning.main">
                +{formatPrice(pricing.urgencyAmount)}
              </Typography>
            </Box>
          )}

          {/* Discount */}
          {pricing.discountAmount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="success.main">
                Знижка
                {pricing.discountApplicableAmount && (
                  <Typography component="span" variant="caption" color="text.secondary">
                    {' '}(на суму {formatPrice(pricing.discountApplicableAmount)})
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" color="success.main">
                -{formatPrice(pricing.discountAmount)}
              </Typography>
            </Box>
          )}

          <Divider />

          {/* Total */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              До сплати
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {formatPrice(pricing.total)}
            </Typography>
          </Box>
        </Stack>

        {/* Recalculate button */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<Calculate />}
          onClick={handleRecalculate}
          disabled={calculateMutation.isPending}
        >
          Перерахувати
        </Button>

        {/* Cart expiration info */}
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          Корзина діє до: {new Date(cart.expiresAt).toLocaleString('uk-UA')}
        </Typography>
      </Stack>
    </Box>
  );
};