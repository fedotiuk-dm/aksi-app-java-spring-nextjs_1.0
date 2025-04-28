import React, { useState, useCallback } from 'react';
import { Box, Typography, Paper, Grid, Alert, LinearProgress } from '@mui/material';
import { StepContainer, StepNavigation } from '@/features/order-wizard/ui/components';
import { useItemPhotosForm } from '@/features/order-wizard/hooks/useItemPhotosForm';
import { PhotoUploader, PhotoPreview, WebcamCapture } from './components';

/**
 * П'ятий підетап Менеджера предметів - Фотодокументація
 */
export const PhotoDocumentationSubstep: React.FC = () => {
  const {
    error,
    isLoading,
    uploadProgress,
    previews,
    handleFileUpload,
    handleRemovePhoto,
    onSubmit,
    handleBack
  } = useItemPhotosForm();
  
  // Ліміт фотографій для завантаження
  const photoLimit = 10;
  // Використовуємо previews як завантажені фото
  const uploadedPhotos = previews.map((url, index) => ({
    id: undefined, // id необов'язковий у типі ItemPhoto
    url,
    thumbnailUrl: url,
    filename: `photo-${index}.jpg`,
    size: 0
  }));

  const [showWebcam, setShowWebcam] = useState(false);

  // Визначаємо, чи досягнуто ліміту завантажених фото
  const isLimitReached = uploadedPhotos.length >= photoLimit;

  // Адаптер для обробки завантаження файлів з галереї
  
  // Адаптер для обробки файлів для PhotoUploader
  const handleFileSelectAdapter = useCallback((file: File) => {
    // Створюємо штучну подію з файлом
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    
    const event = {
      target: {
        files: dataTransfer.files,
        value: ''
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleFileUpload(event);
  }, [handleFileUpload]);
  
  // Обробка завершення зйомки з веб-камери
  const handleWebcamComplete = (file: File | null) => {
    if (file) {
      // Використовуємо той самий адаптер для обробки файлу
      handleFileSelectAdapter(file);
    }
    setShowWebcam(false);
  };

  return (
    <StepContainer
      title="Фотодокументація"
      subtitle="Завантажте фотографії предмета для кращої оцінки"
    >
      <Box 
        component="form" 
        noValidate 
        autoComplete="off"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3 
        }}
        onSubmit={onSubmit}
      >
        {isLoading && (
          <LinearProgress 
            variant="determinate" 
            value={uploadProgress} 
            sx={{ mt: 1, mb: 2 }}
          />
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Інструкції щодо завантаження фото */}
        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Інструкція щодо фотографій
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Завантажте до {photoLimit} фотографій предмета для кращої оцінки
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Зробіть фото з різних ракурсів, включаючи загальний вигляд та проблемні ділянки
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Максимальний розмір кожного фото - 5MB
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Фотографії будуть автоматично стиснуті перед відправкою
          </Typography>
        </Paper>

        {/* Варіанти завантаження */}
        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Завантаження фото
          </Typography>

          {!showWebcam ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <PhotoUploader 
                  onFileSelected={handleFileSelectAdapter}
                  disabled={isLimitReached || isLoading}
                  uploadType="camera"
                  onClick={() => setShowWebcam(true)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <PhotoUploader 
                  onFileSelected={handleFileSelectAdapter}
                  disabled={isLimitReached || isLoading}
                  uploadType="gallery"
                />
              </Grid>
            </Grid>
          ) : (
            <WebcamCapture 
              onCapture={handleWebcamComplete} 
              onCancel={() => setShowWebcam(false)}
            />
          )}
        </Paper>

        {/* Попередній перегляд завантажених фото */}
        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Завантажені фото ({uploadedPhotos.length}/{photoLimit})
          </Typography>
          
          {uploadedPhotos.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
              Поки що не завантажено жодного фото. Використайте камеру або виберіть фото з пристрою.
            </Typography>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {uploadedPhotos.map((photo, index) => (
                <Grid key={`photo-preview-${index}`} size={{ xs: 6, sm: 4, md: 3 }}>
                  <PhotoPreview
                    photo={photo}
                    onDelete={() => handleRemovePhoto(index)}
                    isLoading={isLoading}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        {isLoading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Завантаження...
          </Alert>
        )}
        
        <StepNavigation 
          onBack={handleBack}
          isNextDisabled={isLoading}
          nextLabel="Продовжити до підсумку"
        />
      </Box>
    </StepContainer>
  );
};
