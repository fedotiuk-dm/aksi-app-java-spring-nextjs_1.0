'use client';

import React from 'react';
import { Box, Card, CircularProgress, Typography } from '@mui/material';
import { formatCurrency } from '@/features/order-wizard/api/helpers/formatters';

interface BasePriceDisplayProps {
  basePrice: number;
  isLoading: boolean;
  error?: string;
}

/**
 * Компонент для відображення базової ціни
 */
const BasePriceDisplay: React.FC<BasePriceDisplayProps> = ({
  basePrice,
  isLoading,
  error,
}) => {
  return (
    <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
          <CircularProgress size={24} />
        </Box>
      ) : error ? (
        <Typography color="error" variant="body2">
          Помилка при отриманні базової ціни: {error}
        </Typography>
      ) : (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Базова ціна предмета:
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {formatCurrency(basePrice)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Базова ціна залежить від типу предмета та його характеристик
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default BasePriceDisplay;
