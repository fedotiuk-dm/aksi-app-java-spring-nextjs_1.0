import React, { useState, useCallback } from 'react';
import { Box, Typography, Paper, Grid, Alert, LinearProgress, Button } from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { StepContainer } from '@/features/order-wizard/ui/shared';
import { useItemPhotosForm } from '@/features/order-wizard/hooks/useItemPhotosForm';
import { PhotoUploader, PhotoPreview } from './components';
import { WizardStep, ItemManagerSubStep } from '@/features/order-wizard/model/types';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';

/**
 * П'ятий підетап Менеджера предметів - Фотодокументація (необов'язковий)
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
    handleBack,
  } = useItemPhotosForm();

  // Доступ до функції для навігації між кроками та збереження предмета
  const navigateToStep = useOrderWizardStore((state) => state.navigateToStep);
  const currentItem = useOrderWizardStore((state) => state.currentItem);
  const addItem = useOrderWizardStore((state) => state.addItem);
  const updateItem = useOrderWizardStore((state) => state.updateItem);
  const currentItemIndex = useOrderWizardStore((state) => state.currentItemIndex);
  const setDirty = useOrderWizardStore((state) => state.setDirty);

  // Ліміт фотографій для завантаження
  const photoLimit = 5;
  // Використовуємо previews як завантажені фото
  const uploadedPhotos = previews.map((url, index) => ({
    id: undefined, // id необов'язковий у типі ItemPhoto
    url,
    thumbnailUrl: url,
    filename: `photo-${index}.jpg`,
    size: 0,
  }));

  const [showWebcam, setShowWebcam] = useState(false);

  // Визначаємо, чи досягнуто ліміту завантажених фото
  const isLimitReached = uploadedPhotos.length >= photoLimit;

  // Адаптер для обробки файлів для PhotoUploader
  const handleFileSelectAdapter = useCallback(
    (file: File) => {
      // Створюємо штучну подію з файлом
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      const event = {
        target: {
          files: dataTransfer.files,
          value: '',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      handleFileUpload(event);
    },
    [handleFileUpload]
  );

  // Функція для пропуску етапу фотодокументації
  const handleSkip = useCallback(() => {
    // Якщо є незбережені фото, виводимо попередження
    if (uploadedPhotos.length > 0 && !currentItem?.photos?.length) {
      if (
        window.confirm(
          'Ви впевнені, що хочете пропустити цей етап? Завантажені фото не будуть збережені.'
        )
      ) {
        // Зберігаємо предмет без фотографій перед переходом
        if (currentItem) {
          // Встановлюємо флаг "брудного" стану, щоб зберегти зміни
          setDirty(true);

          // Перевіряємо, чи це редагування існуючого предмета чи додавання нового
          if (currentItemIndex !== null) {
            // Оновлюємо існуючий предмет
            console.log('Оновлюємо існуючий предмет з індексом:', currentItemIndex, currentItem);
            updateItem(currentItemIndex, currentItem);
          } else {
            // Додаємо новий предмет
            console.log('Додаємо новий предмет:', currentItem);
            addItem(currentItem);
          }
        } else {
          console.warn('Не вдалося зберегти предмет: currentItem відсутній');
        }

        // Переходимо до етапу Item Manager (список предметів)
        navigateToStep(WizardStep.ITEM_MANAGER, ItemManagerSubStep.ITEM_LIST);
      }
    } else {
      // Зберігаємо предмет без фотографій перед переходом
      if (currentItem) {
        // Встановлюємо флаг "брудного" стану, щоб зберегти зміни
        setDirty(true);

        // Перевіряємо, чи це редагування існуючого предмета чи додавання нового
        if (currentItemIndex !== null) {
          // Оновлюємо існуючий предмет
          console.log('Оновлюємо існуючий предмет з індексом:', currentItemIndex, currentItem);
          updateItem(currentItemIndex, currentItem);
        } else {
          // Додаємо новий предмет
          console.log('Додаємо новий предмет:', currentItem);
          addItem(currentItem);
        }
      } else {
        console.warn('Не вдалося зберегти предмет: currentItem відсутній');
      }

      // Якщо немає незбережених фото, просто переходимо далі
      navigateToStep(WizardStep.ITEM_MANAGER, ItemManagerSubStep.ITEM_LIST);
    }
  }, [
    uploadedPhotos.length,
    currentItem,
    currentItemIndex,
    navigateToStep,
    addItem,
    updateItem,
    setDirty,
  ]);

  return (
    <StepContainer
      title="Фотодокументація"
      subtitle="Завантажте фотографії предмета для кращої оцінки (необов'язково)"
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
        onSubmit={onSubmit}
      >
        {isLoading && (
          <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 1, mb: 2 }} />
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 2 }}>
          Цей етап є необов&apos;язковим. Ви можете пропустити його, якщо не бажаєте завантажувати
          фотографії предмета.
        </Alert>

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
          ) : null}
        </Paper>

        {/* Попередній перегляд завантажених фото */}
        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Завантажені фото ({uploadedPhotos.length}/{photoLimit})
          </Typography>

          {uploadedPhotos.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
              Поки що не завантажено жодного фото. Використайте кнопки вище для додавання фотографій
              або пропустіть цей етап.
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="outlined" onClick={handleBack} disabled={isLoading}>
            Назад
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleSkip}
              disabled={isLoading}
              startIcon={<SkipNextIcon />}
            >
              Пропустити
            </Button>

            <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
              {uploadedPhotos.length > 0 ? 'Зберегти та продовжити' : 'Продовжити без фото'}
            </Button>
          </Box>
        </Box>
      </Box>
    </StepContainer>
  );
};
