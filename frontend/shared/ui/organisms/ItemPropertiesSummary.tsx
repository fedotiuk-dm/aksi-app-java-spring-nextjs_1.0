'use client';

import { Paper, Typography, Box, Chip } from '@mui/material';
import React from 'react';

interface ItemPropertiesSummaryProps {
  material?: string;
  color?: string;
  fillerType?: string;
  fillerCompressed?: boolean;
  wearLevel?: string;
  show?: boolean;
}

/**
 * Компонент для відображення підсумку характеристик предмета
 */
export const ItemPropertiesSummary: React.FC<ItemPropertiesSummaryProps> = ({
  material,
  color,
  fillerType,
  fillerCompressed,
  wearLevel,
  show = true,
}) => {
  const hasProperties = material || color || fillerType || wearLevel;

  if (!show || !hasProperties) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Характеристики предмета:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {material && <Chip label={`Матеріал: ${material}`} variant="outlined" size="small" />}
        {color && <Chip label={`Колір: ${color}`} variant="outlined" size="small" />}
        {fillerType && (
          <Chip
            label={`Наповнювач: ${fillerType}${fillerCompressed ? ' (збитий)' : ''}`}
            variant="outlined"
            size="small"
          />
        )}
        {wearLevel && <Chip label={`Знос: ${wearLevel}`} variant="outlined" size="small" />}
      </Box>
    </Paper>
  );
};
