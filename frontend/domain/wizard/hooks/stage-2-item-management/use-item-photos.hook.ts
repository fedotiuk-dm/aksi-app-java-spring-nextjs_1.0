/**
 * @fileoverview Хук для управління фото предметів (крок 2.5)
 * @module domain/wizard/hooks/stage-2
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { PhotoManagementService } from '../../services/stage-2-item-management';
import { useWizardStore } from '../../store';

// Константа для уникнення дублювання
const QUERY_KEY_ITEM_PHOTOS = ['item-photos'] as const;

/**
 * Інформація про фото
 */
interface PhotoInfo {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

/**
 * Хук для управління фото предметів
 * 📸 Композиція: TanStack Query + Zustand + PhotoManagementService
 */
export const useItemPhotos = () => {
  const queryClient = useQueryClient();

  // 🏪 Zustand - глобальний стан
  const { addError, addWarning, markUnsavedChanges } = useWizardStore();

  // ⚙️ Сервіс
  const photoService = useMemo(() => new PhotoManagementService(), []);

  // 📸 Локальний стан для завантаження
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // 📋 Завантаження існуючих фото (якщо редагуємо предмет)
  const {
    data: photos = [],
    isLoading: isLoadingPhotos,
    error: photosError,
  } = useQuery({
    queryKey: QUERY_KEY_ITEM_PHOTOS,
    queryFn: () => photoService.getItemPhotos(''), // itemId буде передано динамічно
    enabled: false, // Активуємо тільки при редагуванні
    staleTime: 300000, // 5 хвилин кеш
    gcTime: 600000, // 10 хвилин в кеші
  });

  // 📤 Завантаження фото
  const uploadPhotoMutation = useMutation({
    mutationFn: ({ file, itemId }: { file: File; itemId?: string }) => {
      const uploadData = photoService.createPhotoUploadData(itemId || '', file);
      return photoService.uploadPhoto(uploadData);
    },
    onSuccess: (result, variables) => {
      if (result) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY_ITEM_PHOTOS });
        addWarning(`Фото "${variables.file.name}" завантажено`);
        markUnsavedChanges();

        // Очищуємо прогрес для цього файлу
        setUploadProgress((prev) => {
          const updated = { ...prev };
          delete updated[variables.file.name];
          return updated;
        });
      }
    },
    onError: (error, variables) => {
      addError(`Помилка завантаження фото "${variables.file.name}": ${error.message}`);

      // Очищуємо прогрес для цього файлу
      setUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[variables.file.name];
        return updated;
      });
    },
  });

  // 🗑️ Видалення фото
  const deletePhotoMutation = useMutation({
    mutationFn: ({ photoId, itemId }: { photoId: string; itemId?: string }) =>
      photoService.deletePhoto(itemId || '', photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ITEM_PHOTOS });
      addWarning('Фото видалено');
      markUnsavedChanges();
    },
    onError: (error) => {
      addError(`Помилка видалення фото: ${error.message}`);
    },
  });

  // 📸 Методи управління фото
  const selectFiles = useCallback((files: FileList | null) => {
    setSelectedFiles(files);
  }, []);

  const uploadSelectedFiles = useCallback(
    async (itemId?: string) => {
      if (!selectedFiles || selectedFiles.length === 0) {
        addError('Оберіть файли для завантаження');
        return;
      }

      // Валідація файлів
      const validationResult = photoService.validatePhotoList(Array.from(selectedFiles));
      if (!validationResult.success) {
        addError(`Помилка валідації файлів: ${validationResult.error.errors[0]?.message}`);
        return;
      }

      // Перевірка лімітів
      if (!photoService.checkPhotoLimits(photos.length, selectedFiles.length)) {
        addError('Перевищено ліміт фотографій (максимум 5 на предмет)');
        return;
      }

      // Завантажуємо файли по одному
      for (const file of Array.from(selectedFiles)) {
        try {
          setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
          await uploadPhotoMutation.mutateAsync({ file, itemId });
        } catch (error) {
          // Помилка вже оброблена в onError мутації
          break;
        }
      }

      // Очищуємо вибрані файли
      setSelectedFiles(null);
    },
    [selectedFiles, photoService, uploadPhotoMutation, addError, photos.length]
  );

  const deletePhoto = useCallback(
    (photoId: string, itemId?: string) => {
      deletePhotoMutation.mutate({ photoId, itemId });
    },
    [deletePhotoMutation]
  );

  // 📷 Зйомка з камери (Web API)
  const captureFromCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Задня камера на мобільних
      });

      // Тут буде логіка створення елементу video та canvas для зйомки
      // Поки що повертаємо mock
      addWarning('Функція зйомки з камери буде реалізована');

      // Закриваємо потік
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      addError('Не вдається отримати доступ до камери');
    }
  }, [addError, addWarning]);

  // 📊 Статус та валідація
  const photoStatus = useMemo(() => {
    const totalPhotos = photos.length + (selectedFiles?.length || 0);
    const hasSelectedFiles = selectedFiles && selectedFiles.length > 0;
    const isUploading = uploadPhotoMutation.isPending;
    const maxPhotos = 5; // Обмеження з технічного завдання

    return {
      totalPhotos,
      hasSelectedFiles,
      isUploading,
      canUploadMore: totalPhotos < maxPhotos,
      photosRemaining: Math.max(0, maxPhotos - totalPhotos),
      isAtLimit: totalPhotos >= maxPhotos,
    };
  }, [photos.length, selectedFiles, uploadPhotoMutation.isPending]);

  return {
    // 📸 Стан фото
    photos,
    selectedFiles,
    uploadProgress,

    // 🔄 Стани операцій
    isLoadingPhotos,
    isUploading: uploadPhotoMutation.isPending,
    isDeleting: deletePhotoMutation.isPending,

    // ❌ Помилки
    photosError,

    // 📸 Методи управління
    selectFiles,
    uploadSelectedFiles,
    deletePhoto,
    captureFromCamera,

    // 📊 Статус
    photoStatus,
  };
};
