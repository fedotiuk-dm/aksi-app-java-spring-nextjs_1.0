'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface TotalAmountProps {
  amount: number;
}

/**
 * Компонент для відображення загальної вартості замовлення
 */
export const TotalAmount: React.FC<TotalAmountProps> = ({ amount }) => {
  return (
    <Box sx={{ textAlign: 'right' }}>
      <Typography variant="h6">
        Загальна вартість: {amount} грн
      </Typography>
    </Box>
  );
};
