'use client';

import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import React from 'react';

interface PropertiesSummaryData {
  material: string;
  color: string;
  wearLevel: string;
  filling?: string;
}

interface PropertiesSummaryProps {
  properties: PropertiesSummaryData;
  show: boolean;
}

/**
 * Компонент для відображення підсумку характеристик предмета
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення підсумку
 * - Отримує готові дані через пропси
 * - Не містить бізнес-логіки форматування
 */
export const PropertiesSummary: React.FC<PropertiesSummaryProps> = ({ properties, show }) => {
  if (!show) {
    return null;
  }

  return (
    <Grid size={{ xs: 12 }}>
      <Card variant="outlined" sx={{ bgcolor: 'success.50' }}>
        <CardContent>
          <Typography variant="subtitle2" color="success.main" gutterBottom>
            Характеристики предмета
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip label={`Матеріал: ${properties.material}`} size="small" />
            <Chip label={`Колір: ${properties.color}`} size="small" />
            <Chip label={`Знос: ${properties.wearLevel}`} size="small" />
            {properties.filling && (
              <Chip label={`Наповнювач: ${properties.filling}`} size="small" />
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PropertiesSummary;
