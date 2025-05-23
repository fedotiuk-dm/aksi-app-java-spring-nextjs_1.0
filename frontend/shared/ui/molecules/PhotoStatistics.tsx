'use client';

import { Image as ImageIcon } from '@mui/icons-material';
import { Box, Typography, Chip } from '@mui/material';
import React from 'react';

interface PhotoStatisticsProps {
  currentCount: number;
  maxCount: number;
  show?: boolean;
}

/**
 * Компонент для відображення статистики фото
 */
export const PhotoStatistics: React.FC<PhotoStatisticsProps> = ({
  currentCount,
  maxCount,
  show = true,
}) => {
  if (!show) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <Typography variant="h6">
        Завантажені фото ({currentCount}/{maxCount})
      </Typography>
      {currentCount > 0 && (
        <Chip
          label={`${currentCount} фото`}
          color="primary"
          variant="outlined"
          icon={<ImageIcon />}
        />
      )}
    </Box>
  );
};
