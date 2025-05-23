'use client';

import { Grid, Card, CardContent, Typography, Stack } from '@mui/material';
import React from 'react';

interface PhotoStatisticsProps {
  photoCount: number;
  totalSize: string;
  averageSize: string;
  show: boolean;
}

/**
 * Компонент для відображення статистики завантажених фото
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення статистики
 * - Отримує готові дані через пропси
 * - Не містить бізнес-логіки розрахунків
 */
export const PhotoStatistics: React.FC<PhotoStatisticsProps> = ({
  photoCount,
  totalSize,
  averageSize,
  show,
}) => {
  if (!show) {
    return null;
  }

  return (
    <Grid size={{ xs: 12 }}>
      <Card variant="outlined" sx={{ bgcolor: 'info.50' }}>
        <CardContent>
          <Typography variant="subtitle2" color="info.main" gutterBottom>
            Статистика завантажених фото
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Typography variant="body2">Кількість: {photoCount} фото</Typography>
            <Typography variant="body2">Загальний розмір: {totalSize}</Typography>
            <Typography variant="body2">Середній розмір: {averageSize}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PhotoStatistics;
