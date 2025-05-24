'use client';

import { SkipNext } from '@mui/icons-material';
import { Alert, Box, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';

import { useItemWizard, usePhotoDocumentation } from '@/domain/order';
import {
  PhotoUploadButtons,
  PhotoGallery,
  PhotoUploadProgress,
  PhotoStatistics,
  PhotoPreviewDialog,
  PhotoRecommendations,
  StatusMessage,
  StepContainer,
  StepNavigation,
  ActionButton,
} from '@/shared/ui';

/**
 * Підкрок 2.5: Фотодокументація
 *
 * FSD принципи:
 * - "Тонкий" UI компонент без бізнес-логіки
 * - Отримує всю функціональність з domain layer
 * - Використовує shared UI компоненти
 */
export const PhotoDocumentationStep: React.FC = () => {
  // === LOCAL STATE ===
  const [isSaving, setIsSaving] = useState(false);

  // === DOMAIN HOOKS ===
  // TODO: Отримати orderId з wizard state/context
  const orderId = 'temp-order-id'; // Тимчасове значення
  const { itemData, validation, canProceed, updatePhotos, wizard, saveItem } = useItemWizard({
    orderId,
  });
  const {
    previewImage,
    isUploading,
    compressionProgress,
    cameraError,
    fileInputRef,
    videoRef,
    canvasRef,
    constants,
    canAddMorePhotos,
    processFileSelection,
    captureFromCamera,
    openFileDialog,
    previewPhoto,
    closePreview,
    deletePhoto,
    convertPhotosForDisplay,
    clearCameraError,
  } = usePhotoDocumentation();

  // === COMPUTED VALUES ===
  const currentPhotos = itemData.photos || [];
  const canAddMore = canAddMorePhotos(currentPhotos.length);
  const photoItems = convertPhotosForDisplay(currentPhotos);

  // === EVENT HANDLERS ===

  /**
   * Обробник вибору файлів з галереї
   */
  const handleGallerySelect = useCallback(() => {
    openFileDialog();
  }, [openFileDialog]);

  /**
   * Обробник зйомки з камери
   */
  const handleCameraCapture = useCallback(() => {
    captureFromCamera(currentPhotos, (photos) => {
      updatePhotos({
        photos,
        hasPhotos: photos.length > 0,
      });
    });
  }, [captureFromCamera, currentPhotos, updatePhotos]);

  /**
   * Обробник зміни input файлів
   */
  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        processFileSelection(files, currentPhotos, (photos) => {
          updatePhotos({
            photos,
            hasPhotos: photos.length > 0,
          });
        });
      }
      // Очищуємо input для можливості повторного вибору того ж файлу
      event.target.value = '';
    },
    [processFileSelection, currentPhotos, updatePhotos]
  );

  /**
   * Обробник видалення фото
   */
  const handleDeletePhoto = useCallback(
    (index: number) => {
      deletePhoto(index, currentPhotos, (photos) => {
        updatePhotos({
          photos,
          hasPhotos: photos.length > 0,
        });
      });
    },
    [deletePhoto, currentPhotos, updatePhotos]
  );

  /**
   * Обробник переходу до наступного кроку (завершення Item Wizard)
   */
  const handleNext = useCallback(async () => {
    if (canProceed && !isSaving) {
      setIsSaving(true);
      console.log('Збереження предмета з фото...');

      try {
        // Спочатку зберігаємо предмет
        const saveResult = await saveItem();
        if (saveResult.success) {
          console.log('✅ Предмет збережено успішно:', saveResult.item);

          // Потім завершуємо Item Wizard
          const result = wizard.finishItemWizardFlow(true);
          if (result.success) {
            console.log('✅ Завершення Item Wizard з фото - повернення до Item Manager');
          } else {
            console.error('❌ Помилка завершення:', result.error);
          }
        } else {
          console.error('❌ Помилка збереження предмета:', saveResult.error);
        }
      } finally {
        setIsSaving(false);
      }
    }
  }, [canProceed, isSaving, wizard, saveItem]);

  /**
   * Обробник повернення до попереднього підкроку
   */
  const handleBack = useCallback(() => {
    const result = wizard.navigateBack();
    if (result.success) {
      console.log('Повернення до калькулятора ціни');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  }, [wizard]);

  /**
   * Обробник пропуску фото-документації
   * Завершує Item Wizard без додавання фото
   */
  const handleSkip = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    console.log('Пропуск фото-документації, збереження предмета без фото...');

    try {
      // Очищуємо фото, якщо були додані
      updatePhotos({
        photos: [],
        hasPhotos: false,
      });

      // Спочатку зберігаємо предмет без фото
      const saveResult = await saveItem();
      if (saveResult.success) {
        console.log('✅ Предмет збережено успішно без фото:', saveResult.item);

        // Потім завершуємо Item Wizard
        const result = wizard.finishItemWizardFlow(true);
        if (result.success) {
          console.log(
            '✅ Пропуск фото-документації, завершення Item Wizard - повернення до Item Manager'
          );
        } else {
          console.error('❌ Помилка завершення:', result.error);
        }
      } else {
        console.error('❌ Помилка збереження предмета:', saveResult.error);
      }
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, updatePhotos, wizard, saveItem]);

  return (
    <StepContainer
      title="Фотодокументація"
      subtitle="Додайте фото предмета для кращого документування його стану або пропустіть цей етап"
    >
      <Box sx={{ minHeight: '400px' }}>
        {/* Інформація та обмеження */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Необов&rsquo;язковий крок:</strong> Фото допомагають документувати стан
            предмета, але не є обов&rsquo;язковими. Можна пропустити цей етап.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Обмеження:</strong> Максимум {constants.MAX_PHOTOS} фото на предмет, до{' '}
            {constants.MAX_FILE_SIZE / 1024 / 1024}MB кожне. Фото автоматично стискаються для
            оптимізації.
          </Typography>
        </Alert>

        {/* Кнопки завантаження */}
        <Box sx={{ mb: 3 }}>
          <PhotoUploadButtons
            onCameraCapture={handleCameraCapture}
            onGallerySelect={handleGallerySelect}
            canAddMorePhotos={canAddMore}
            isUploading={isUploading}
            currentCount={currentPhotos.length}
            maxPhotos={constants.MAX_PHOTOS}
          />
        </Box>

        {/* Прихований input для файлів */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {/* Прихований canvas та video для камери */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <video ref={videoRef} style={{ display: 'none' }} autoPlay muted />

        {/* Прогрес завантаження */}
        <PhotoUploadProgress
          isUploading={isUploading}
          progress={compressionProgress}
          message="Обробка фото..."
        />

        {/* Помилка камери */}
        {cameraError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearCameraError}>
            {cameraError}
          </Alert>
        )}

        {/* Статистика фото */}
        <PhotoStatistics currentCount={currentPhotos.length} maxCount={constants.MAX_PHOTOS} />

        {/* Галерея фото */}
        <Box sx={{ mb: 3 }}>
          <PhotoGallery
            photos={photoItems}
            onPreviewPhoto={previewPhoto}
            onDeletePhoto={handleDeletePhoto}
            onAddFirstPhoto={handleGallerySelect}
          />
        </Box>

        {/* Рекомендації */}
        <PhotoRecommendations />

        {/* Валідація */}
        {validation.photoDocumentation.errors &&
          Object.keys(validation.photoDocumentation.errors).length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Виправте помилки: {Object.values(validation.photoDocumentation.errors).join(', ')}
              </Typography>
            </Alert>
          )}

        {/* Статусне повідомлення */}
        <StatusMessage
          message="Фотодокументація готова. Можете завершити додавання предмета."
          severity="success"
          show={canProceed}
        />
      </Box>

      {/* Діалог попереднього перегляду */}
      <PhotoPreviewDialog open={!!previewImage} imageUrl={previewImage} onClose={closePreview} />

      <StepNavigation
        onNext={canProceed ? handleNext : undefined}
        onBack={handleBack}
        nextLabel="Завершити та додати предмет"
        backLabel="Назад до ціни"
        isNextDisabled={!canProceed || isSaving}
        nextLoading={isUploading || isSaving}
        additionalActions={
          <ActionButton
            variant="text"
            color="warning"
            onClick={handleSkip}
            startIcon={<SkipNext />}
            size="medium"
            loading={isSaving}
            disabled={isSaving}
          >
            Пропустити фото
          </ActionButton>
        }
      />
    </StepContainer>
  );
};

export default PhotoDocumentationStep;
