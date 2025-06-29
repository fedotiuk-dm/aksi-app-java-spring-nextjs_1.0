'use client';

import { Delete, Preview, Image as ImageIcon, CloudUpload } from '@mui/icons-material';
import {
  Grid,
  Card,
  CardMedia,
  CardActions,
  Typography,
  IconButton,
  Box,
  Paper,
  Button,
} from '@mui/material';
import React from 'react';

interface PhotoItem {
  file: File;
  url?: string;
}

interface PhotoGalleryProps {
  photos: PhotoItem[];
  onPreviewPhoto: (photo: File) => void;
  onDeletePhoto: (index: number) => void;
  onAddFirstPhoto?: () => void;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  showEmptyState?: boolean;
}

/**
 * Компонент для відображення галереї фото
 */
export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  onPreviewPhoto,
  onDeletePhoto,
  onAddFirstPhoto,
  emptyStateTitle = 'Фото ще не додані',
  emptyStateDescription = 'Додайте фото предмета для кращого документування його стану та особливостей',
  showEmptyState = true,
}) => {
  if (photos.length === 0 && showEmptyState) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: 'grey.50',
          border: '2px dashed',
          borderColor: 'grey.300',
        }}
      >
        <ImageIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyStateTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {emptyStateDescription}
        </Typography>
        {onAddFirstPhoto && (
          <Button variant="contained" startIcon={<CloudUpload />} onClick={onAddFirstPhoto}>
            Додати перше фото
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <Grid container spacing={2}>
      {photos.map((photo, index) => {
        const imageUrl = photo.url || URL.createObjectURL(photo.file);

        return (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={imageUrl}
                alt={`Фото ${index + 1}`}
                sx={{ objectFit: 'cover' }}
              />
              <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {(photo.file.size / 1024).toFixed(0)} KB
                </Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => onPreviewPhoto(photo.file)}
                    color="primary"
                    title="Попередній перегляд"
                  >
                    <Preview />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDeletePhoto(index)}
                    color="error"
                    title="Видалити фото"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
