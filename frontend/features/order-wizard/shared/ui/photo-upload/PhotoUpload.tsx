'use client';

import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { Box, Button, Grid, Typography, IconButton } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';

interface PhotoUploadProps {
  onPhotosChange?: (photos: File[]) => void;
  maxPhotos?: number;
  className?: string;
}

/**
 * Компонент для завантаження фотографій виробів/предметів
 * Використовується на підетапі 2.5 Фотодокументація
 */
export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotosChange,
  maxPhotos = 5,
  className
}) => {
  const [photos, setPhotos] = useState<Array<{ file: File, preview: string }>>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files).slice(0, maxPhotos - photos.length);

      const newPhotos = newFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);

      if (onPhotosChange) {
        onPhotosChange(updatedPhotos.map(photo => photo.file));
      }
    }
  };

  const handleDelete = (index: number) => {
    const updatedPhotos = [...photos];
    URL.revokeObjectURL(updatedPhotos[index].preview);
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);

    if (onPhotosChange) {
      onPhotosChange(updatedPhotos.map(photo => photo.file));
    }
  };

  const takePhoto = () => {
    // Тут буде логіка для зйомки фото за допомогою камери
    // Використовується на планшетах/мобільних
    const fileInput = document.getElementById('camera-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <Box className={className}>
      <Typography variant="h6" gutterBottom>
        Фотодокументація
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Завантажте фотографії виробу для кращої документації стану та дефектів
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddAPhotoIcon />}
              onClick={takePhoto}
              disabled={photos.length >= maxPhotos}
            >
              Зробити фото
            </Button>

            <Button
              variant="outlined"
              startIcon={<PhotoLibraryIcon />}
              component="label"
              disabled={photos.length >= maxPhotos}
            >
              Вибрати з галереї
              <input
                type="file"
                id="gallery-input"
                hidden
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </Button>

            <input
              type="file"
              id="camera-input"
              hidden
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
            />
          </Box>
        </Grid>
      </Grid>

      {photos.length > 0 && (
        <Grid container spacing={2}>
          {photos.map((photo, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Box
                sx={{
                  position: 'relative',
                  height: 200,
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: 1
                }}
              >
                <Image
                  src={photo.preview}
                  alt={`Фото ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                  }}
                  onClick={() => handleDelete(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        {photos.length} / {maxPhotos} фото завантажено
      </Typography>
    </Box>
  );
};
