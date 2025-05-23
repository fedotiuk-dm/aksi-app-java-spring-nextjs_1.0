'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Grid,
  Typography,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  LinearProgress,
  Box,
} from '@mui/material';
import React from 'react';

interface PhotoFile {
  id: string;
  file: File;
  url: string;
  size: number;
  uploadProgress?: number;
}

interface PhotoGalleryProps {
  photos: PhotoFile[];
  onDeletePhoto: (photoId: string) => void;
  formatFileSize: (bytes: number) => string;
  show: boolean;
}

/**
 * Компонент для відображення галереї фото
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення галереї
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки управління файлами
 */
export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  onDeletePhoto,
  formatFileSize,
  show,
}) => {
  if (!show) {
    return null;
  }

  return (
    <Grid size={{ xs: 12 }}>
      <Typography variant="subtitle1" gutterBottom>
        Завантажені фото
      </Typography>

      <ImageList
        cols={3}
        gap={8}
        sx={{
          maxHeight: 400,
          '& .MuiImageListItem-root': {
            borderRadius: 1,
            overflow: 'hidden',
          },
        }}
      >
        {photos.map((photo) => (
          <ImageListItem key={photo.id}>
            <img
              src={photo.url}
              alt={`Фото предмета ${photo.id}`}
              loading="lazy"
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
              }}
            />
            <ImageListItemBar
              title={formatFileSize(photo.size)}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  onClick={() => onDeletePhoto(photo.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              }
            />
            {photo.uploadProgress !== undefined && photo.uploadProgress < 100 && (
              <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <LinearProgress
                  variant="determinate"
                  value={photo.uploadProgress}
                  sx={{ height: 3 }}
                />
              </Box>
            )}
          </ImageListItem>
        ))}
      </ImageList>
    </Grid>
  );
};

export default PhotoGallery;
