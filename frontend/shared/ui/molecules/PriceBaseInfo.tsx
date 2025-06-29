'use client';

import { AttachMoney } from '@mui/icons-material';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import React from 'react';

interface PriceBaseInfoProps {
  itemName: string;
  category: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  totalBasePrice?: number;
  title?: string;
  showIcon?: boolean;
}

/**
 * Компонент для відображення базової інформації про предмет та ціну
 */
export const PriceBaseInfo: React.FC<PriceBaseInfoProps> = ({
  itemName,
  category,
  quantity,
  unitOfMeasure,
  unitPrice,
  totalBasePrice,
  title = 'Базова інформація',
  showIcon = true,
}) => {
  const calculatedTotal = totalBasePrice ?? unitPrice * quantity;

  return (
    <Card sx={{ mb: 3, bgcolor: 'primary.light' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          {showIcon && <AttachMoney color="primary" />}
          {title}
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1">
              <strong>Предмет:</strong> {itemName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Категорія: {category}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="body1">
              <strong>Кількість:</strong> {quantity} {unitOfMeasure}
            </Typography>
            {unitPrice > 0 && (
              <Typography variant="body2" color="text.secondary">
                Ціна за од.: {unitPrice.toFixed(2)} грн
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" color="primary">
              <strong>Базова ціна:</strong> {calculatedTotal.toFixed(2)} грн
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
