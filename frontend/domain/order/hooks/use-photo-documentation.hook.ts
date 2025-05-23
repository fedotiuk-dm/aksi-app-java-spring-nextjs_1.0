import { useState, useRef, useCallback, useMemo } from 'react';

export interface PhotoDocumentationConstants {
  MAX_PHOTOS: number;
  MAX_FILE_SIZE: number;
  MAX_WIDTH: number;
  MAX_HEIGHT: number;
  COMPRESSION_QUALITY: number;
  JPEG_MIME_TYPE: string;
}

export interface PhotoItem {
  file: File;
  url?: string;
}

/**
 * Хук для роботи з фотодокументацією в item wizard
 */
export const usePhotoDocumentation = () => {
  // === STATE ===
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // === REFS ===
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // === CONSTANTS ===
  const constants: PhotoDocumentationConstants = useMemo(
    () => ({
      MAX_PHOTOS: 5,
      MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
      MAX_WIDTH: 1920,
      MAX_HEIGHT: 1080,
      COMPRESSION_QUALITY: 0.8,
      JPEG_MIME_TYPE: 'image/jpeg',
    }),
    []
  );

  // === UTILITIES ===

  /**
   * Стиснення зображення
   */
  const compressImage = useCallback(
    (file: File): Promise<File> => {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          // Розрахунок нових розмірів зі збереженням пропорцій
          let { width, height } = img;
          if (width > constants.MAX_WIDTH || height > constants.MAX_HEIGHT) {
            const ratio = Math.min(constants.MAX_WIDTH / width, constants.MAX_HEIGHT / height);
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
                  type: constants.JPEG_MIME_TYPE,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            constants.JPEG_MIME_TYPE,
            constants.COMPRESSION_QUALITY
          );
        };

        img.src = URL.createObjectURL(file);
      });
    },
    [constants]
  );

  /**
   * Валідація файлу
   */
  const validateFile = useCallback(
    (file: File): string | null => {
      if (!file.type.startsWith('image/')) {
        return 'Файл повинен бути зображенням';
      }

      if (file.size > constants.MAX_FILE_SIZE) {
        return `Розмір файлу не повинен перевищувати ${constants.MAX_FILE_SIZE / 1024 / 1024}MB`;
      }

      return null;
    },
    [constants.MAX_FILE_SIZE]
  );

  /**
   * Перевірка чи можна додавати ще фото
   */
  const canAddMorePhotos = useCallback(
    (currentPhotosLength: number): boolean => {
      return currentPhotosLength < constants.MAX_PHOTOS;
    },
    [constants.MAX_PHOTOS]
  );

  /**
   * Обробка вибору файлів з галереї
   */
  const processFileSelection = useCallback(
    async (
      files: FileList,
      currentPhotos: File[],
      onUpdatePhotos: (photos: File[]) => void
    ): Promise<void> => {
      if (!canAddMorePhotos(currentPhotos.length)) {
        return;
      }

      setIsUploading(true);
      setCompressionProgress(0);

      const newPhotos: File[] = [];
      const maxNewPhotos = constants.MAX_PHOTOS - currentPhotos.length;

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
        onUpdatePhotos([...currentPhotos, ...newPhotos]);
      }

      setIsUploading(false);
      setCompressionProgress(0);
    },
    [canAddMorePhotos, constants.MAX_PHOTOS, validateFile, compressImage]
  );

  /**
   * Зйомка з камери
   */
  const captureFromCamera = useCallback(
    async (currentPhotos: File[], onUpdatePhotos: (photos: File[]) => void): Promise<void> => {
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
                      type: constants.JPEG_MIME_TYPE,
                      lastModified: Date.now(),
                    });

                    try {
                      const compressedFile = await compressImage(file);
                      onUpdatePhotos([...currentPhotos, compressedFile]);
                    } catch (error) {
                      console.error('Помилка стиснення фото з камери:', error);
                    }
                  }

                  // Зупиняємо камеру
                  stream.getTracks().forEach((track) => track.stop());
                },
                constants.JPEG_MIME_TYPE,
                constants.COMPRESSION_QUALITY
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
    },
    [compressImage, constants]
  );

  /**
   * Відкриття діалогу вибору файлів
   */
  const openFileDialog = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  /**
   * Попередній перегляд фото
   */
  const previewPhoto = useCallback((photo: File) => {
    const url = URL.createObjectURL(photo);
    setPreviewImage(url);
  }, []);

  /**
   * Закриття preview
   */
  const closePreview = useCallback(() => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }
  }, [previewImage]);

  /**
   * Видалення фото
   */
  const deletePhoto = useCallback(
    (index: number, currentPhotos: File[], onUpdatePhotos: (photos: File[]) => void) => {
      const newPhotos = currentPhotos.filter((_, i) => i !== index);
      onUpdatePhotos(newPhotos);
    },
    []
  );

  /**
   * Конвертація фото для відображення
   */
  const convertPhotosForDisplay = useCallback((photos: File[]): PhotoItem[] => {
    return photos.map((file) => ({ file }));
  }, []);

  /**
   * Очищення камерної помилки
   */
  const clearCameraError = useCallback(() => {
    setCameraError(null);
  }, []);

  return {
    // STATE
    previewImage,
    isUploading,
    compressionProgress,
    cameraError,

    // REFS
    fileInputRef,
    videoRef,
    canvasRef,

    // CONSTANTS
    constants,

    // UTILITIES
    canAddMorePhotos,
    processFileSelection,
    captureFromCamera,
    openFileDialog,
    previewPhoto,
    closePreview,
    deletePhoto,
    convertPhotosForDisplay,
    clearCameraError,
    validateFile,
  };
};
