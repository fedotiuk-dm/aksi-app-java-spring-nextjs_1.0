'use client';

import React from 'react';
import type { TypographyProps } from '@mui/material/Typography';
import { Box, Typography, Divider, Chip, LinearProgress, Alert } from '@mui/material';
import { useGetCart } from '@/shared/api/generated/cart';
import { useOrderWizardStore } from '@/features/order-wizard';

export const Calculator: React.FC = () => {
  const { selectedCustomer } = useOrderWizardStore();
  const CURRENCY_SYMBOL = '₴';
  const formatPrice = (kopecks?: number) =>
    `${((kopecks || 0) / 100).toFixed(2)} ${CURRENCY_SYMBOL}`;
  const ROW_BETWEEN_SX = { display: 'flex', justifyContent: 'space-between' } as const;
  const BODY2: TypographyProps['variant'] = 'body2';

  // Get real cart data from API only if customer is selected
  const {
    data: cartData,
    isLoading: isLoadingCart,
    error: cartError,
  } = useGetCart({
    query: {
      enabled: !!selectedCustomer,
    },
  });

  // Get cart totals from backend calculations
  const pricing = cartData?.pricing;
  const items = cartData?.items || [];

  if (!selectedCustomer) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Виберіть клієнта для розрахунку вартості
        </Typography>
      </Box>
    );
  }

  if (cartError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Помилка завантаження даних калькулятора
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Додайте предмети для розрахунку вартості
        </Typography>
      </Box>
    );
  }

  if (isLoadingCart) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
          Завантаження розрахунків...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Individual Items */}
      {items.map((item, index) => (
        <Box key={item.id} sx={{ mb: 2 }}>
          <Box sx={{ ...ROW_BETWEEN_SX, mb: 1 }}>
            <Typography variant={BODY2}>{item.priceListItem?.name}</Typography>
            <Typography variant={BODY2}>{formatPrice(item.pricing?.basePrice)}</Typography>
          </Box>

          {item.quantity > 1 && (
            <Box sx={{ ...ROW_BETWEEN_SX, mb: 1 }}>
              <Typography variant={BODY2} color="text.secondary">
                Кількість: {item.quantity} шт
              </Typography>
              <Typography variant={BODY2}>{formatPrice(item.pricing?.subtotal)}</Typography>
            </Box>
          )}

          {/* Show applied modifiers if any */}
          {item.pricing?.modifierDetails && item.pricing.modifierDetails.length > 0 && (
            <Box sx={{ ml: 2, mt: 1 }}>
              {item.pricing.modifierDetails.map((modifier) => (
                <Box
                  key={modifier.code}
                  sx={{
                    ...ROW_BETWEEN_SX,
                    alignItems: 'center',
                    mb: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {modifier.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatPrice(modifier.amount)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Item total */}
          <Box sx={{ ...ROW_BETWEEN_SX, mt: 1 }}>
            <Typography variant={BODY2} fontWeight="medium">
              Разом предмет:
            </Typography>
            <Typography variant={BODY2} fontWeight="medium">
              {formatPrice(item.pricing?.total)}
            </Typography>
          </Box>

          {index < items.length - 1 && <Divider sx={{ mt: 2 }} />}
        </Box>
      ))}

      {/* Cart Totals */}
      {pricing && (
        <>
          <Divider sx={{ my: 2 }} />

          {/* Subtotal */}
          <Box sx={{ ...ROW_BETWEEN_SX, mb: 1 }}>
            <Typography variant={BODY2}>Підсумок предметів:</Typography>
            <Typography variant={BODY2}>{formatPrice(pricing.itemsSubtotal)}</Typography>
          </Box>

          {/* Urgency surcharge */}
          {pricing.urgencyAmount && pricing.urgencyAmount > 0 && (
            <Box sx={{ ...ROW_BETWEEN_SX, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant={BODY2}>Терміновість:</Typography>
                <Chip label="+" size="small" color="warning" />
              </Box>
              <Typography variant={BODY2}>+{formatPrice(pricing.urgencyAmount)}</Typography>
            </Box>
          )}

          {/* Discount */}
          {pricing.discountAmount && pricing.discountAmount > 0 && (
            <Box sx={{ ...ROW_BETWEEN_SX, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant={BODY2}>Знижка:</Typography>
                <Chip label="-" size="small" color="success" />
              </Box>
              <Typography variant={BODY2}>-{formatPrice(pricing.discountAmount)}</Typography>
            </Box>
          )}

          {/* Final Total */}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ ...ROW_BETWEEN_SX, alignItems: 'center' }}>
            <Typography variant="h6">Загальна вартість:</Typography>
            <Typography variant="h6" color="primary">
              {formatPrice(pricing.total)}
            </Typography>
          </Box>
        </>
      )}

      {/* Additional Info */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          * Всі ціни розраховані бекендом на основі актуальних модифікаторів
        </Typography>
      </Box>
    </Box>
  );
};

// Helper functions removed - now using real backend calculations
