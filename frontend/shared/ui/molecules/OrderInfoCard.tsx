'use client';

import { Grid, Card, CardContent, Typography, Chip } from '@mui/material';
import React from 'react';

interface OrderInfoCardProps {
  receiptNumber: string;
  uniqueTag: string;
  createdDate: string;
  executionDate: string;
  title?: string;
  status?: 'draft' | 'confirmed' | 'processing' | 'completed';
}

/**
 * Компонент для відображення інформації про замовлення
 */
export const OrderInfoCard: React.FC<OrderInfoCardProps> = ({
  receiptNumber,
  uniqueTag,
  createdDate,
  executionDate,
  title = 'Інформація про замовлення',
  status,
}) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Чернетка';
      case 'confirmed':
        return 'Підтверджено';
      case 'processing':
        return 'В обробці';
      case 'completed':
        return 'Завершено';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'success' => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'confirmed':
        return 'primary';
      case 'processing':
        return 'secondary';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {title}
          {status && (
            <Chip
              label={getStatusLabel(status)}
              size="small"
              color={getStatusColor(status)}
              variant="filled"
            />
          )}
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Номер квитанції
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {receiptNumber}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Унікальна мітка
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {uniqueTag || '—'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Дата створення
            </Typography>
            <Typography variant="body1">{createdDate}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Дата готовності
            </Typography>
            <Typography variant="body1" color="primary" sx={{ fontWeight: 'medium' }}>
              {executionDate}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
