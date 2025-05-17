'use client';

import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

interface TotalAmountProps {
  amount: number;
}

/**
 * Компонент для відображення загальної вартості замовлення
 */
export const TotalAmount: React.FC<TotalAmountProps> = ({ amount }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up('sm'));

  // Форматуємо суму з розділювачем тисяч
  const formattedAmount = new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="body2"
        color="inherit"
        sx={{ fontSize: isTablet ? '1rem' : '0.875rem' }}
      >
        Загальна вартість:
      </Typography>
      <Typography
        variant={isTablet ? 'h5' : 'h6'}
        color="inherit"
        sx={{ fontWeight: 'bold' }}
      >
        {formattedAmount} грн
      </Typography>
    </Box>
  );
};
