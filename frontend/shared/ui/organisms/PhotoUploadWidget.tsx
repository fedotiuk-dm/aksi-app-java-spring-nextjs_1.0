'use client';

import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { Box, Grid, Typography, IconButton, Paper, Alert } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';

import { ActionButton } from '../molecules';

interface PhotoUploadWidgetProps {
  onPhotosChange?: (photos: File[]) => void;
  maxPhotos?: number;
  maxFileSize?: number; // в MB
  acceptedFormats?: string[];
  className?: string;
  title?: string;
  subtitle?: string;
  showImagePreview?: boolean;
  disabled?: boolean;
  buttonSize?: 'small' | 'medium' | 'large';
  cameraLabel?: string;
  galleryLabel?: string;
  compact?: boolean;
}

/**
 * Універсальний компонент для завантаження фотографій
 * Повноцінний organism з логікою управління станом та валідацією
 *
 * FSD принципи:
 * - Універсальний organism для завантаження фото
 * - Не містить domain-специфічної логіки
 * - Забезпечує повний цикл роботи з фото (upload, validation, preview, delete)
 *
 * Особливості:
 * - Підтримка камери та галереї
 * - Попередній перегляд зображень
 * - Валідація розміру та формату файлів
 * - Консистентний стиль з іншими shared компонентами
 * - Підтримує MUI7 Grid з size атрибутом
 *
 * Використовується для:
 * - Фотодокументація предметів
 * - Завантаження документів
 * - Будь-які інші потреби в завантаженні зображень
 */
export const PhotoUploadWidget: React.FC<PhotoUploadWidgetProps> = ({
  onPhotosChange,
  maxPhotos = 5,
  maxFileSize = 5, // 5MB
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className,
  title = 'Фотодокументація',
  subtitle = 'Завантажте фотографії для кращої документації',
  showImagePreview = true,
  disabled = false,
  buttonSize = 'medium',
  cameraLabel = 'Зробити фото',
  galleryLabel = 'Вибрати з галереї',
  compact = false,
}) => {
  const [photos, setPhotos] = useState<Array<{ file: File; preview: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Формат файлу ${file.type} не підтримується. Дозволені формати: ${acceptedFormats.join(', ')}`;
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      return `Розмір файлу ${Math.round(file.size / 1024 / 1024)}MB перевищує максимально дозволений ${maxFileSize}MB`;
    }

    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);

    const availableSlots = maxPhotos - photos.length;
    const filesToProcess = Array.from(files).slice(0, availableSlots);

    const validFiles: { file: File; preview: string }[] = [];
    const errors: string[] = [];

    filesToProcess.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        return;
      }

      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
      });
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      const updatedPhotos = [...photos, ...validFiles];
      setPhotos(updatedPhotos);
      onPhotosChange?.(updatedPhotos.map((photo) => photo.file));
    }

    // Очищаємо input
    event.target.value = '';
  };

  const handleDelete = (index: number) => {
    if (disabled) return;

    const updatedPhotos = [...photos];
    URL.revokeObjectURL(updatedPhotos[index].preview);
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
    onPhotosChange?.(updatedPhotos.map((photo) => photo.file));
  };

  const takePhoto = () => {
    if (disabled) return;

    const fileInput = document.getElementById('camera-input') as HTMLInputElement;
    fileInput?.click();
  };

  const selectFromGallery = () => {
    if (disabled) return;

    const fileInput = document.getElementById('gallery-input') as HTMLInputElement;
    fileInput?.click();
  };

  const canAddMore = photos.length < maxPhotos && !disabled;

  return (
    <Box className={className}>
      <Typography variant={compact ? 'subtitle1' : 'h6'} gutterBottom>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
            {error}
          </Typography>
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 'auto' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <ActionButton
              variant="outlined"
              startIcon={<AddAPhotoIcon />}
              onClick={takePhoto}
              disabled={!canAddMore}
              size={buttonSize}
            >
              {cameraLabel}
            </ActionButton>

            <ActionButton
              variant="outlined"
              startIcon={<PhotoLibraryIcon />}
              onClick={selectFromGallery}
              disabled={!canAddMore}
              size={buttonSize}
            >
              {galleryLabel}
            </ActionButton>

            {/* Скриті input файли */}
            <input
              type="file"
              id="camera-input"
              hidden
              accept={acceptedFormats.join(',')}
              capture="environment"
              onChange={handleFileChange}
            />

            <input
              type="file"
              id="gallery-input"
              hidden
              accept={acceptedFormats.join(',')}
              multiple
              onChange={handleFileChange}
            />
          </Box>
        </Grid>
      </Grid>

      {showImagePreview && photos.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {photos.map((photo, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Paper
                variant="outlined"
                sx={{
                  position: 'relative',
                  height: compact ? 150 : 200,
                  borderRadius: 1,
                  overflow: 'hidden',
                  opacity: disabled ? 0.6 : 1,
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
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                  }}
                  onClick={() => handleDelete(index)}
                  size="small"
                  disabled={disabled}
                  title="Видалити фото"
                >
                  <DeleteIcon />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {photos.length} / {maxPhotos} фото завантажено
        {maxFileSize && ` • Максимальний розмір: ${maxFileSize}MB`}
        {acceptedFormats.length > 0 &&
          ` • Формати: ${acceptedFormats.map((f) => f.split('/')[1]).join(', ')}`}
      </Typography>
    </Box>
  );
};
