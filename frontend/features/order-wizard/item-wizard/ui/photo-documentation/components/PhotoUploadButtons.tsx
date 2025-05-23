'use client';

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { Grid, Button, Stack, Box, Typography } from '@mui/material';
import React from 'react';

interface PhotoUploadButtonsProps {
  onCameraCapture: () => void;
  onGallerySelect: () => void;
  canAddMorePhotos: boolean;
  isUploading: boolean;
  currentCount: number;
  maxPhotos: number;
}

/**
 * Компонент для кнопок завантаження фото
 *
 * FSD принципи:
 * - Тільки UI логіка для кнопок завантаження
 * - Отримує обробники та стан через пропси
 * - Не містить бізнес-логіки завантаження
 */
export const PhotoUploadButtons: React.FC<PhotoUploadButtonsProps> = ({
  onCameraCapture,
  onGallerySelect,
  canAddMorePhotos,
  isUploading,
  currentCount,
  maxPhotos,
}) => {
  return (
    <Grid size={{ xs: 12 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <Button
          variant="contained"
          startIcon={<CameraAltIcon />}
          onClick={onCameraCapture}
          disabled={!canAddMorePhotos || isUploading}
          size="large"
        >
          Зробити фото
        </Button>

        <Button
          variant="outlined"
          startIcon={<PhotoLibraryIcon />}
          onClick={onGallerySelect}
          disabled={!canAddMorePhotos || isUploading}
          size="large"
        >
          Вибрати з галереї
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
          {currentCount} / {maxPhotos} фото
        </Typography>
      </Stack>
    </Grid>
  );
};

export default PhotoUploadButtons;
