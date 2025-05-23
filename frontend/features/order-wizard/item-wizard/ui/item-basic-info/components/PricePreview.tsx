'use client';

import { Grid, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

interface PricePreviewProps {
  basePrice: number;
  quantity: number;
  totalPrice: number;
  show: boolean;
}

/**
 * Компонент для відображення попереднього розрахунку ціни
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення цін
 * - Отримує розраховані дані через пропси
 * - Не містить бізнес-логіки розрахунків
 */
export const PricePreview: React.FC<PricePreviewProps> = ({
  basePrice,
  quantity,
  totalPrice,
  show,
}) => {
  if (!show) {
    return null;
  }

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
        <CardContent>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Попередня вартість
          </Typography>

          <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
            {totalPrice.toFixed(2)} грн
          </Typography>

          <Typography variant="caption" color="text.secondary" display="block">
            Базова ціна: {basePrice} грн
          </Typography>

          <Typography variant="caption" color="text.secondary" display="block">
            Кількість: {quantity}
          </Typography>

          <Typography variant="caption" color="text.secondary" display="block">
            Без модифікаторів
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PricePreview;
