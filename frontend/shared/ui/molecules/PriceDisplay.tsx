'use client';

import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import React from 'react';

interface PriceDisplayProps {
  basePrice: number;
  quantity: number;
  totalPrice: number;
  unitOfMeasure: string;
  currency?: string;
  showBreakdown?: boolean;
  variant?: 'outlined' | 'elevation';
  size?: 'small' | 'medium' | 'large';
}

/**
 * Компонент для відображення інформації про ціну
 */
export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  basePrice,
  quantity,
  totalPrice,
  unitOfMeasure,
  currency = 'грн',
  showBreakdown = true,
  variant = 'outlined',
  size = 'medium',
}) => {
  const getTypographyVariant = () => {
    switch (size) {
      case 'small':
        return 'h6';
      case 'large':
        return 'h4';
      default:
        return 'h5';
    }
  };

  return (
    <Card
      variant={variant}
      sx={{
        bgcolor: 'primary.50',
        height: size === 'small' ? 'auto' : '100%',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" color="primary">
            Орієнтовна вартість
          </Typography>
          <Chip label="Без модифікаторів" size="small" variant="outlined" color="primary" />
        </Box>

        <Typography
          variant={getTypographyVariant()}
          color="primary"
          sx={{ mb: showBreakdown ? 2 : 0, fontWeight: 600 }}
        >
          {totalPrice.toFixed(2)} {currency}
        </Typography>

        {showBreakdown && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Базова ціна: {basePrice} {currency}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Кількість: {quantity} {unitOfMeasure}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
