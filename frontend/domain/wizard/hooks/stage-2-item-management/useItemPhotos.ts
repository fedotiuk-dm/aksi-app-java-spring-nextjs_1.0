/**
 * @fileoverview Хук для управління фотодокументацією предмета
 *
 * Відповідальність:
 * - Завантаження фото з камери або галереї
 * - Попередній перегляд завантажених фото
 * - Автоматичне стиснення зображень
 * - Обмеження кількості та розміру
 */

import { useState, useCallback } from 'react';

import { useUploadPhoto } from '@/shared/api/generated/full/aksiApi';

import type { ItemPhotos, UseItemPhotosReturn } from './types';
import type {
  OrderItemPhotoDTO,
  UploadPhotoBody,
} from '@/shared/api/generated/full/aksiApi.schemas';

// Константи для фото
const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const COMPRESSION_QUALITY = 0.8; // Якість стиснення
const COMPRESSED_IMAGE_TYPE = 'image/jpeg'; // Тип для стиснутого зображення
const MAX_WIDTH = 1920; // Максимальна ширина
const MAX_HEIGHT = 1080; // Максимальна висота

/**
 * Хук для управління фотодокументацією предмета
 *
 * @example
 * ```tsx
 * const {
 *   photos,
 *   addPhoto,
 *   removePhoto,
 *   uploadPhotos
 * } = useItemPhotos();
 *
 * // Додати фото
 * addPhoto(selectedFile);
 *
 * // Завантажити всі фото для предмета
 * await uploadPhotos(itemId);
 * ```
 */
export function useItemPhotos(): UseItemPhotosReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [photos, setPhotos] = useState<ItemPhotos>({
    photos: [],
    uploadedPhotos: [],
    maxPhotos: MAX_PHOTOS,
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // =====================================
  // API мутація
  // =====================================

  const { mutateAsync: uploadPhotoMutation, isPending: isUploading } = useUploadPhoto();

  // =====================================
  // Функції валідації та стиснення
  // =====================================

  /**
   * Перевірити файл на відповідність вимогам
   */
  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Непідтримуваний тип файлу. Оберіть JPG, PNG або WebP';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'Розмір файлу перевищує 5MB';
    }

    return null;
  }, []);

  /**
   * Стиснути зображення
   */
  const compressImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Розрахувати нові розміри зі збереженням пропорцій
        let { width, height } = img;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Намалювати зображення на canvas
        ctx?.drawImage(img, 0, 0, width, height);

        // Конвертувати в blob з стисненням
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: COMPRESSED_IMAGE_TYPE,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback на оригінальний файл
            }
          },
          COMPRESSED_IMAGE_TYPE,
          COMPRESSION_QUALITY
        );
      };

      img.onerror = () => {
        resolve(file); // Fallback на оригінальний файл
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Додати фото до локального списку
   */
  const addPhoto = useCallback(
    async (file: File) => {
      // Перевірка ліміту
      if (photos.photos.length >= MAX_PHOTOS) {
        setUploadError(`Максимальна кількість фото: ${MAX_PHOTOS}`);
        return;
      }

      // Валідація файлу
      const validationError = validateFile(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }

      // Перевірка на дублікати
      const isDuplicate = photos.photos.some(
        (existingFile) => existingFile.name === file.name && existingFile.size === file.size
      );

      if (isDuplicate) {
        setUploadError('Це фото вже додано');
        return;
      }

      try {
        // Стиснути зображення
        const compressedFile = await compressImage(file);

        // Додаємо фото
        setPhotos((prev) => ({
          ...prev,
          photos: [...prev.photos, compressedFile],
        }));

        setUploadError(null);
      } catch (error) {
        console.error('Помилка стиснення зображення:', error);
        setUploadError('Помилка обробки зображення');
      }
    },
    [photos.photos, validateFile, compressImage]
  );

  /**
   * Прибрати фото зі списку
   */
  const removePhoto = useCallback(
    (index: number) => {
      setPhotos((prev) => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index),
      }));

      // Очищаємо помилку при видаленні
      if (uploadError) {
        setUploadError(null);
      }
    },
    [uploadError]
  );

  /**
   * Завантажити всі фото на сервер для конкретного предмета
   */
  const uploadPhotos = useCallback(
    async (itemId?: string) => {
      if (photos.photos.length === 0) {
        setUploadError('Немає фото для завантаження');
        return;
      }

      if (!itemId) {
        setUploadError('ID предмета не вказано');
        return;
      }

      try {
        setUploadError(null);
        setUploadProgress(0);

        const uploadedPhotos: OrderItemPhotoDTO[] = [];
        const totalPhotos = photos.photos.length;

        // Завантажуємо кожне фото окремо
        for (let i = 0; i < totalPhotos; i++) {
          const file = photos.photos[i];

          try {
            const uploadBody: UploadPhotoBody = {
              file: file, // File implements Blob interface
            };

            const response = await uploadPhotoMutation({
              itemId,
              data: uploadBody,
              params: {
                description: `Фото ${i + 1} предмета`,
              },
            });

            if (response) {
              uploadedPhotos.push(response);
            }

            // Оновлюємо прогрес
            setUploadProgress(((i + 1) / totalPhotos) * 100);
          } catch (error) {
            console.error(`Помилка завантаження фото ${file.name}:`, error);
            // Продовжуємо з наступним фото
          }
        }

        // Оновлюємо стан
        setPhotos((prev) => ({
          ...prev,
          uploadedPhotos,
          photos: [], // Очищаємо локальні фото після завантаження
        }));

        setUploadProgress(100);

        if (uploadedPhotos.length === 0) {
          setUploadError('Не вдалося завантажити жодного фото');
        }
      } catch (error) {
        console.error('Помилка завантаження фото:', error);
        setUploadError('Не вдалося завантажити фото');
        setUploadProgress(0);
      }
    },
    [photos.photos, uploadPhotoMutation]
  );

  /**
   * Очистити всі фото
   */
  const clearPhotos = useCallback(() => {
    setPhotos({
      photos: [],
      uploadedPhotos: [],
      maxPhotos: MAX_PHOTOS,
    });
    setUploadError(null);
    setUploadProgress(0);
  }, []);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    photos,
    isUploading,
    uploadError,
    uploadProgress,

    // Дії
    addPhoto,
    removePhoto,
    uploadPhotos,
    clearPhotos,
  };
}
