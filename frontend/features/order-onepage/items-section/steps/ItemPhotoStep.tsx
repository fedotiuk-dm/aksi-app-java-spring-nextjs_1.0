'use client';

import { useState, useRef } from 'react';
import {
  Stack,
  Button,
  Typography,
  Alert,
  Box,
  Paper,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import Image from 'next/image';
import { ArrowBack, PhotoCamera, Upload, Delete, CheckCircle } from '@mui/icons-material';
import { useOrderOnepageStore } from '../../store/order-onepage.store';
import {
  useSubstep5AddPhoto,
  useSubstep5RemovePhoto,
  useSubstep5CompletePhotoDocumentation,
} from '@/shared/api/generated/substep5';
import { useStage2AddItemToOrder } from '@/shared/api/generated/stage2';

interface ItemPhotoStepProps {
  data: any;
  onDataChange: (data: any) => void;
  onBack: () => void;
  onComplete: () => void;
  isEditing: boolean;
}

export const ItemPhotoStep = ({
  data,
  onDataChange,
  onBack,
  onComplete,
  isEditing,
}: ItemPhotoStepProps) => {
  const { sessionId, orderId } = useOrderOnepageStore();
  const [photos, setPhotos] = useState<File[]>(data.photos || []);
  const [photoUrls, setPhotoUrls] = useState<string[]>(data.photoUrls || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const addPhoto = useSubstep5AddPhoto();
  const removePhoto = useSubstep5RemovePhoto();
  const completeDocumentation = useSubstep5CompletePhotoDocumentation();
  const addItemToOrder = useStage2AddItemToOrder();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleAddPhotos(files);
  };

  const handleAddPhotos = async (files: File[]) => {
    if (!sessionId) return;

    // Перевірка ліміту (максимум 5 фото)
    if (photos.length + files.length > 5) {
      alert('Максимум 5 фото на предмет');
      return;
    }

    // Перевірка розміру файлів (максимум 5MB кожен)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Розмір файлу не повинен перевищувати 5MB');
      return;
    }

    try {
      const newPhotos = [...photos];
      const newPhotoUrls = [...photoUrls];

      for (const file of files) {
        // Створюємо URL для превью
        const url = URL.createObjectURL(file);
        newPhotoUrls.push(url);
        newPhotos.push(file);

        // Відправляємо на сервер
        await addPhoto.mutateAsync({
          sessionId,
          data: { file },
        });
      }

      setPhotos(newPhotos);
      setPhotoUrls(newPhotoUrls);
      onDataChange({ photos: newPhotos, photoUrls: newPhotoUrls });
    } catch (error) {
      console.error('Помилка додавання фото:', error);
    }
  };

  const handleRemovePhoto = async (index: number) => {
    if (!sessionId) return;

    try {
      await removePhoto.mutateAsync({
        sessionId,
        photoId: String(index),
      });

      // Видаляємо URL з пам'яті
      URL.revokeObjectURL(photoUrls[index]);

      const newPhotos = photos.filter((_, i) => i !== index);
      const newPhotoUrls = photoUrls.filter((_, i) => i !== index);

      setPhotos(newPhotos);
      setPhotoUrls(newPhotoUrls);
      onDataChange({ photos: newPhotos, photoUrls: newPhotoUrls });
    } catch (error) {
      console.error('Помилка видалення фото:', error);
    }
  };

  const handleComplete = async () => {
    if (!sessionId || !orderId) return;

    try {
      // Завершуємо фотодокументацію
      await completeDocumentation.mutateAsync({
        sessionId,
      });

      // Додаємо предмет до замовлення
      const itemData = {
        ...data,
        photos: photos.length,
        photoUrls: photoUrls.length,
      };

      if (isEditing) {
        // Логіка оновлення існуючого предмета
        // await updateItemInOrder.mutateAsync({ sessionId, itemId: data.itemId, data: itemData });
      } else {
        // Додаємо новий предмет
        await addItemToOrder.mutateAsync({
          sessionId,
          data: itemData,
        });
      }

      onComplete();
    } catch (error) {
      console.error('Помилка завершення додавання предмета:', error);
    }
  };

  const isLoading =
    addPhoto.isPending ||
    removePhoto.isPending ||
    completeDocumentation.isPending ||
    addItemToOrder.isPending;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Фотодокументація
      </Typography>

      <Stack spacing={3}>
        {/* Інструкції */}
        <Alert severity="info">
          Додайте до 5 фото предмета. Максимальний розмір файлу: 5MB. Фото допоможуть краще оцінити
          стан предмета та уникнути непорозумінь.
        </Alert>

        {/* Кнопки додавання фото */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Додати фото ({photos.length}/5)
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<PhotoCamera />}
              onClick={() => cameraInputRef.current?.click()}
              disabled={photos.length >= 5 || isLoading}
            >
              Зняти фото
            </Button>
            <Button
              variant="outlined"
              startIcon={<Upload />}
              onClick={() => fileInputRef.current?.click()}
              disabled={photos.length >= 5 || isLoading}
            >
              Завантажити файл
            </Button>
          </Stack>

          {/* Приховані input елементи */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </Paper>

        {/* Галерея фото */}
        {photoUrls.length > 0 && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Додані фото
            </Typography>
            <ImageList cols={3} gap={8}>
              {photoUrls.map((url, index) => (
                <ImageListItem key={index}>
                  <Image
                    src={url}
                    alt={`Фото ${index + 1}`}
                    width={120}
                    height={120}
                    style={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
                  />
                  <ImageListItemBar
                    position="top"
                    actionIcon={
                      <IconButton
                        size="small"
                        onClick={() => handleRemovePhoto(index)}
                        disabled={isLoading}
                        sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    }
                    actionPosition="right"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Paper>
        )}

        {/* Підсумок предмета */}
        <Paper sx={{ p: 2, backgroundColor: 'action.hover' }}>
          <Typography variant="subtitle2" gutterBottom>
            Підсумок предмета
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2">
                <strong>Найменування:</strong> {data.itemName || 'Не вказано'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2">
                <strong>Кількість:</strong> {data.quantity || 1} {data.unit || 'шт'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2">
                <strong>Матеріал:</strong> {data.material || 'Не вказано'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2">
                <strong>Колір:</strong> {data.color || data.customColor || 'Не вказано'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2">
                <strong>Фінальна ціна:</strong> {data.finalPrice?.toFixed(2) || '0.00'} ₴
              </Typography>
            </Grid>
            {data.modifiers && data.modifiers.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2">
                  <strong>Модифікатори:</strong> {data.modifiers.length} застосовано
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Кнопки навігації */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button onClick={onBack} startIcon={<ArrowBack />} variant="outlined" sx={{ flex: 1 }}>
            Назад
          </Button>
          <Button
            onClick={handleComplete}
            variant="contained"
            startIcon={<CheckCircle />}
            disabled={isLoading}
            sx={{ flex: 1 }}
          >
            {isLoading ? 'Збереження...' : isEditing ? 'Оновити предмет' : 'Додати предмет'}
          </Button>
        </Stack>

        {/* Помилки */}
        {(addPhoto.error ||
          removePhoto.error ||
          completeDocumentation.error ||
          addItemToOrder.error) && (
          <Alert severity="error">Помилка обробки фото або додавання предмета</Alert>
        )}
      </Stack>
    </Box>
  );
};
