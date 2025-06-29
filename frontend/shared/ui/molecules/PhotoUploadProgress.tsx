'use client';

import { Paper, Typography, LinearProgress, Box } from '@mui/material';
import React from 'react';

interface PhotoUploadProgressProps {
  isUploading: boolean;
  progress: number;
  message?: string;
  show?: boolean;
}

/**
 * Компонент для відображення прогресу завантаження фото
 */
export const PhotoUploadProgress: React.FC<PhotoUploadProgressProps> = ({
  isUploading,
  progress,
  message = 'Обробка фото...',
  show = true,
}) => {
  if (!show || !isUploading) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" gutterBottom>
          {message} {progress.toFixed(0)}%
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={progress} />
    </Paper>
  );
};
