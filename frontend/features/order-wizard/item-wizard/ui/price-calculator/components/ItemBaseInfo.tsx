'use client';

import { Grid, Card, CardContent, Typography, Stack, Chip } from '@mui/material';
import React from 'react';

interface ItemBaseInfoProps {
  productName: string;
  category: string;
  basePrice: number;
}

/**
 * Компонент для відображення базової інформації про предмет
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення базової інформації
 * - Отримує дані через пропси
 * - Не містить бізнес-логіки
 */
export const ItemBaseInfo: React.FC<ItemBaseInfoProps> = ({ productName, category, basePrice }) => {
  return (
    <Grid size={{ xs: 12 }}>
      <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
        <CardContent>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Базова інформація
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip label={`Предмет: ${productName}`} />
            <Chip label={`Категорія: ${category}`} />
            <Chip label={`Базова ціна: ${basePrice} грн`} color="primary" />
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ItemBaseInfo;
