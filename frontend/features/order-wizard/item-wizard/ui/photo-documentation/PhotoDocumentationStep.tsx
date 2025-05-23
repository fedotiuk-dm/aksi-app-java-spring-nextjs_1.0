'use client';

import {
  PhotoCamera,
  CloudUpload,
  Delete,
  Preview,
  Info,
  CheckCircle,
  Warning,
  Image as ImageIcon,
  Close,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Alert,
  Chip,
  IconButton,
  Card,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import React, { useState, useRef, useCallback, useMemo } from 'react';

import { useItemWizard } from '@/domain/order';

import { StepContainer } from '../../../shared/ui/step-container';
import { StepNavigation } from '../../../shared/ui/step-navigation';

/**
 * Підкрок 2.5: Фотодокументація
 *
 * Згідно з документацією Order Wizard:
 * - Завантаження фото з галереї та зйомка з камери
 * - Попередній перегляд завантажених фото (мініатюри з можливістю видалення)
 * - Обмеження: максимум 5 фото на один предмет, до 5MB кожне
 * - Автоматичне стиснення зображень перед відправкою на сервер
 */
export const PhotoDocumentationStep: React.FC = () => {
  // Отримуємо функціональність Item Wizard з domain layer
  const { itemData, validation, canProceed, updatePhotos, wizard } = useItemWizard();

  // Локальний стан
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Рефи
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Константи
  const MAX_PHOTOS = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_WIDTH = 1920;
  const MAX_HEIGHT = 1080;
  const COMPRESSION_QUALITY = 0.8;
  const JPEG_MIME_TYPE = 'image/jpeg';

  /**
   * Поточні фото
   */
  const currentPhotos = useMemo(() => itemData.photos || [], [itemData.photos]);

  /**
   * Перевірка чи можна додавати ще фото
   */
  const canAddMorePhotos = useMemo(() => currentPhotos.length < MAX_PHOTOS, [currentPhotos.length]);

  /**
   * Стиснення зображення
   */
  const compressImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Розрахунок нових розмірів зі збереженням пропорцій
        let { width, height } = img;
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Малювання стисненого зображення
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: JPEG_MIME_TYPE,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          JPEG_MIME_TYPE,
          COMPRESSION_QUALITY
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  /**
   * Валідація файлу
   */
  const validateFile = useCallback((file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Файл повинен бути зображенням';
    }

    if (file.size > MAX_FILE_SIZE) {
      return `Розмір файлу не повинен перевищувати ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }

    return null;
  }, []);

  /**
   * Обробка вибору файлів з галереї
   */
  const handleFileSelection = useCallback(
    async (files: FileList) => {
      if (!canAddMorePhotos) {
        return;
      }

      setIsUploading(true);
      setCompressionProgress(0);

      const newPhotos: File[] = [];
      const maxNewPhotos = MAX_PHOTOS - currentPhotos.length;

      for (let i = 0; i < Math.min(files.length, maxNewPhotos); i++) {
        const file = files[i];
        const error = validateFile(file);

        if (error) {
          console.error(`Помилка файлу ${file.name}:`, error);
          continue;
        }

        try {
          setCompressionProgress(((i + 1) / files.length) * 100);
          const compressedFile = await compressImage(file);
          newPhotos.push(compressedFile);
        } catch (error) {
          console.error('Помилка стиснення:', error);
        }
      }

      if (newPhotos.length > 0) {
        updatePhotos({
          photos: [...currentPhotos, ...newPhotos],
          hasPhotos: true,
        });
      }

      setIsUploading(false);
      setCompressionProgress(0);
    },
    [currentPhotos, canAddMorePhotos, validateFile, compressImage, updatePhotos]
  );

  /**
   * Відкриття діалогу вибору файлів
   */
  const handleUploadClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  /**
   * Обробник зміни input файлів
   */
  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        handleFileSelection(files);
      }
      // Очищуємо input для можливості повторного вибору того ж файлу
      event.target.value = '';
    },
    [handleFileSelection]
  );

  /**
   * Зйомка з камери
   */
  const handleCameraCapture = useCallback(async () => {
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Задня камера за замовчуванням
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Зупиняємо стрім після зйомки
        const takePhoto = () => {
          if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0);
            }

            canvas.toBlob(
              async (blob) => {
                if (blob) {
                  const file = new File([blob], `camera-${Date.now()}.jpg`, {
                    type: JPEG_MIME_TYPE,
                    lastModified: Date.now(),
                  });

                  try {
                    const compressedFile = await compressImage(file);
                    updatePhotos({
                      photos: [...currentPhotos, compressedFile],
                      hasPhotos: true,
                    });
                  } catch (error) {
                    console.error('Помилка стиснення фото з камери:', error);
                  }
                }

                // Зупиняємо камеру
                stream.getTracks().forEach((track) => track.stop());
              },
              JPEG_MIME_TYPE,
              COMPRESSION_QUALITY
            );
          }
        };

        // Автоматично робимо фото через 3 секунди або за кліком
        setTimeout(takePhoto, 3000);
      }
    } catch (error) {
      console.error('Помилка доступу до камери:', error);
      setCameraError('Неможливо отримати доступ до камери. Перевірте дозволи браузера.');
    }
  }, [currentPhotos, compressImage, updatePhotos]);

  /**
   * Видалення фото
   */
  const handleDeletePhoto = useCallback(
    (index: number) => {
      const newPhotos = currentPhotos.filter((_, i) => i !== index);
      updatePhotos({
        photos: newPhotos,
        hasPhotos: newPhotos.length > 0,
      });
    },
    [currentPhotos, updatePhotos]
  );

  /**
   * Перегляд фото
   */
  const handlePreviewPhoto = useCallback((photo: File) => {
    const url = URL.createObjectURL(photo);
    setPreviewImage(url);
  }, []);

  /**
   * Закриття preview
   */
  const handleClosePreview = useCallback(() => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }
  }, [previewImage]);

  /**
   * Обробник переходу до наступного кроку (завершення Item Wizard)
   */
  const handleNext = () => {
    if (canProceed) {
      // Завершуємо Item Wizard і повертаємося до Item Manager
      const result = wizard.navigateForward();
      if (result.success) {
        console.log('Перехід до завершення Item Wizard');
      } else {
        console.error('Помилка переходу:', result.errors);
      }
    }
  };

  /**
   * Обробник повернення до попереднього підкроку
   */
  const handleBack = () => {
    const result = wizard.navigateBack();
    if (result.success) {
      console.log('Повернення до калькулятора ціни');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  };

  return (
    <StepContainer
      title="Фотодокументація"
      subtitle="Додайте фото предмета для кращого документування його стану"
    >
      <Box sx={{ minHeight: '400px' }}>
        {/* Інформація та обмеження */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Обмеження:</strong> Максимум {MAX_PHOTOS} фото на предмет, до{' '}
            {MAX_FILE_SIZE / 1024 / 1024}MB кожне. Фото автоматично стискаються для оптимізації.
          </Typography>
        </Alert>

        {/* Кнопки завантаження */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<CloudUpload />}
              onClick={handleUploadClick}
              disabled={!canAddMorePhotos || isUploading}
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
              onClick={handleCameraCapture}
              disabled={!canAddMorePhotos || isUploading}
              size="large"
              sx={{ py: 2 }}
            >
              Зняти з камери
            </Button>
          </Grid>
        </Grid>

        {/* Прихований input для файлів */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {/* Прихований canvas для камери */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <video ref={videoRef} style={{ display: 'none' }} autoPlay muted />

        {/* Прогрес завантаження */}
        {isUploading && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              Обробка фото... {compressionProgress.toFixed(0)}%
            </Typography>
            <LinearProgress variant="determinate" value={compressionProgress} />
          </Paper>
        )}

        {/* Помилка камери */}
        {cameraError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setCameraError(null)}>
            {cameraError}
          </Alert>
        )}

        {/* Лічильник фото */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h6">
            Завантажені фото ({currentPhotos.length}/{MAX_PHOTOS})
          </Typography>
          {currentPhotos.length > 0 && (
            <Chip
              label={`${currentPhotos.length} фото`}
              color="primary"
              variant="outlined"
              icon={<ImageIcon />}
            />
          )}
        </Box>

        {/* Сітка фото */}
        {currentPhotos.length > 0 ? (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {currentPhotos.map((photo, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={URL.createObjectURL(photo)}
                    alt={`Фото ${index + 1}`}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {(photo.size / 1024).toFixed(0)} KB
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handlePreviewPhoto(photo)}
                        color="primary"
                      >
                        <Preview />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePhoto(index)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'grey.50',
              border: '2px dashed',
              borderColor: 'grey.300',
              mb: 3,
            }}
          >
            <ImageIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Фото ще не додані
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Додайте фото предмета для кращого документування його стану та особливостей
            </Typography>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              Додати перше фото
            </Button>
          </Paper>
        )}

        {/* Рекомендації */}
        <Paper sx={{ p: 3, bgcolor: 'info.light' }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Info color="info" />
            Рекомендації для фото
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Фотографуйте предмет при хорошому освітленні" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Показуйте всі дефекти, плями та особливості" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Робіть фото з різних ракурсів" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Уникайте розмитих та темних знімків" />
            </ListItem>
          </List>
        </Paper>

        {/* Валідація */}
        {validation.photoDocumentation.errors &&
          Object.keys(validation.photoDocumentation.errors).length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Виправте помилки: {Object.values(validation.photoDocumentation.errors).join(', ')}
              </Typography>
            </Alert>
          )}
      </Box>

      {/* Діалог попереднього перегляду */}
      <Dialog open={!!previewImage} onClose={handleClosePreview} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          Попередній перегляд фото
          <IconButton onClick={handleClosePreview} color="inherit">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={previewImage}
                alt="Попередній перегляд"
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Закрити</Button>
        </DialogActions>
      </Dialog>

      <StepNavigation
        onNext={canProceed ? handleNext : undefined}
        onBack={handleBack}
        nextLabel="Завершити та додати предмет"
        backLabel="Назад до ціни"
        isNextDisabled={!canProceed}
        nextLoading={isUploading}
      />
    </StepContainer>
  );
};

export default PhotoDocumentationStep;
