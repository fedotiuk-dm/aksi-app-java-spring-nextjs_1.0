'use client';

import { PhotoCamera, CloudUpload } from '@mui/icons-material';
import { Grid, Button, Typography, Box } from '@mui/material';
import React from 'react';

interface PhotoUploadButtonsProps {
  onCameraCapture: () => void;
  onGallerySelect: () => void;
  canAddMorePhotos: boolean;
  isUploading: boolean;
  currentCount: number;
  maxPhotos: number;
  disabled?: boolean;
}

/**
 * Компонент для кнопок завантаження фото
 */
export const PhotoUploadButtons: React.FC<PhotoUploadButtonsProps> = ({
  onCameraCapture,
  onGallerySelect,
  canAddMorePhotos,
  isUploading,
  currentCount,
  maxPhotos,
  disabled = false,
}) => {
  const isDisabled = !canAddMorePhotos || isUploading || disabled;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<CloudUpload />}
          onClick={onGallerySelect}
          disabled={isDisabled}
          size="large"
          sx={{ py: 2 }}
        >
          Завантажити з галереї
        </Button>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<PhotoCamera />}
          onClick={onCameraCapture}
          disabled={isDisabled}
          size="large"
          sx={{ py: 2 }}
        >
          Зняти з камери
        </Button>
      </Grid>

      {/* Статистика фото */}
      <Grid size={{ xs: 12 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Завантажено: {currentCount} / {maxPhotos} фото
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
