/**
 * @fileoverview Photos Slice Store - Zustand store для фотодокументації предмета
 * @module domain/wizard/store/stage-2
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Типи фото
 */
export enum PhotoType {
  GENERAL = 'GENERAL',
  DEFECT = 'DEFECT',
  STAIN = 'STAIN',
  CLOSE_UP = 'CLOSE_UP',
  BEFORE_CLEANING = 'BEFORE_CLEANING',
}

/**
 * Статуси завантаження фото
 */
export enum PhotoUploadStatus {
  PENDING = 'PENDING',
  UPLOADING = 'UPLOADING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * Інтерфейс фото предмета
 */
interface ItemPhoto {
  id: string;
  file: File;
  previewUrl: string;
  type: PhotoType;
  description: string;
  uploadStatus: PhotoUploadStatus;
  uploadProgress: number;
  uploadError: string | null;
  serverUrl?: string;
  isRequired: boolean;
  size: number;
  timestamp: Date;
}

/**
 * Налаштування фото
 */
interface PhotoSettings {
  maxFileSize: number; // в байтах
  maxPhotos: number;
  allowedFormats: string[];
  autoCompress: boolean;
  compressionQuality: number;
}

/**
 * Стан фотодокументації (Підетап 2.5)
 */
interface PhotosState {
  // Photos
  photos: ItemPhoto[];
  selectedPhotoId: string | null;
  hasPhotos: boolean;

  // Upload management
  isUploading: boolean;
  uploadQueue: string[];
  totalUploadProgress: number;
  failedUploads: string[];

  // Camera integration
  isCameraActive: boolean;
  cameraError: string | null;
  supportsCameraApi: boolean;

  // Settings
  photoSettings: PhotoSettings;

  // Validation
  photosValidationErrors: Record<string, string[]>;
  isPhotosStepValid: boolean;

  // Loading states
  isPhotosLoading: boolean;
  photosLoadingError: string | null;
}

/**
 * Дії для фотодокументації
 */
interface PhotosActions {
  // Photo management
  setPhotos: (photos: ItemPhoto[]) => void;
  addPhoto: (photo: Omit<ItemPhoto, 'id' | 'timestamp'>) => void;
  updatePhoto: (id: string, updates: Partial<ItemPhoto>) => void;
  removePhoto: (id: string) => void;
  setSelectedPhotoId: (id: string | null) => void;
  setHasPhotos: (hasPhotos: boolean) => void;

  // File operations
  handleFileSelect: (files: FileList) => Promise<void>;
  createPhotoFromFile: (file: File, type?: PhotoType) => Promise<ItemPhoto>;
  validateFile: (file: File) => string[];
  compressImage: (file: File) => Promise<File>;

  // Upload management
  setIsUploading: (uploading: boolean) => void;
  setUploadQueue: (queue: string[]) => void;
  setTotalUploadProgress: (progress: number) => void;
  addToUploadQueue: (photoId: string) => void;
  removeFromUploadQueue: (photoId: string) => void;
  uploadPhoto: (photoId: string) => Promise<void>;
  uploadAllPhotos: () => Promise<void>;
  retryFailedUploads: () => Promise<void>;

  // Camera integration
  setIsCameraActive: (active: boolean) => void;
  setCameraError: (error: string | null) => void;
  setSupportsCameraApi: (supports: boolean) => void;
  checkCameraSupport: () => void;
  captureFromCamera: () => Promise<void>;

  // Settings
  setPhotoSettings: (settings: Partial<PhotoSettings>) => void;
  loadPhotoSettings: () => Promise<void>;

  // Validation
  setPhotosValidationErrors: (field: string, errors: string[]) => void;
  clearPhotosValidationErrors: (field: string) => void;
  validatePhotosStep: () => void;
  setPhotosStepValid: (valid: boolean) => void;

  // Helper methods
  getPhotoTypeDisplayName: (type: PhotoType) => string;
  getUploadStatusDisplayName: (status: PhotoUploadStatus) => string;
  formatFileSize: (bytes: number) => string;
  generatePhotoId: () => string;
  calculateTotalProgress: () => number;

  // Reset actions
  resetPhotos: () => void;
}

/**
 * Початкові налаштування фото
 */
const defaultPhotoSettings: PhotoSettings = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxPhotos: 5,
  allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  autoCompress: true,
  compressionQuality: 0.8,
};

/**
 * Початковий стан фотодокументації
 */
const initialPhotosState: PhotosState = {
  photos: [],
  selectedPhotoId: null,
  hasPhotos: false,
  isUploading: false,
  uploadQueue: [],
  totalUploadProgress: 0,
  failedUploads: [],
  isCameraActive: false,
  cameraError: null,
  supportsCameraApi: false,
  photoSettings: defaultPhotoSettings,
  photosValidationErrors: {},
  isPhotosStepValid: true, // Фото не є обов'язковими
  isPhotosLoading: false,
  photosLoadingError: null,
};

/**
 * Photos Slice Store
 *
 * Відповідальність:
 * - Завантаження фото з файлової системи
 * - Зйомка з камери пристрою (WebRTC)
 * - Стиснення та оптимізація зображень
 * - Завантаження фото на сервер з прогресом
 * - Управління метаданими фото
 *
 * Інтеграція:
 * - WebRTC Camera API
 * - File API
 * - Canvas API для стиснення
 * - API завантаження файлів
 * - Orval типи
 */
export const usePhotosStore = create<PhotosState & PhotosActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialPhotosState,

      // Photo management
      setPhotos: (photos) => {
        set({ photos }, false, 'photos/setPhotos');
        set({ hasPhotos: photos.length > 0 }, false, 'photos/setPhotos/updateHasPhotos');
        get().validatePhotosStep();
      },

      addPhoto: (photoData) => {
        const photo: ItemPhoto = {
          ...photoData,
          id: get().generatePhotoId(),
          timestamp: new Date(),
        };

        set(
          (state) => ({
            photos: [...state.photos, photo],
            hasPhotos: true,
          }),
          false,
          'photos/addPhoto'
        );

        // Автоматично додаємо до черги завантаження
        get().addToUploadQueue(photo.id);
        get().validatePhotosStep();
      },

      updatePhoto: (id, updates) => {
        set(
          (state) => ({
            photos: state.photos.map((photo) =>
              photo.id === id ? { ...photo, ...updates } : photo
            ),
          }),
          false,
          'photos/updatePhoto'
        );
        get().validatePhotosStep();
      },

      removePhoto: (id) => {
        set(
          (state) => {
            const newPhotos = state.photos.filter((photo) => photo.id !== id);
            return {
              photos: newPhotos,
              hasPhotos: newPhotos.length > 0,
              selectedPhotoId: state.selectedPhotoId === id ? null : state.selectedPhotoId,
            };
          },
          false,
          'photos/removePhoto'
        );

        // Видаляємо з черги завантаження
        get().removeFromUploadQueue(id);
        get().validatePhotosStep();
      },

      setSelectedPhotoId: (id) => {
        set({ selectedPhotoId: id }, false, 'photos/setSelectedPhotoId');
      },

      setHasPhotos: (hasPhotos) => {
        set({ hasPhotos }, false, 'photos/setHasPhotos');

        if (!hasPhotos) {
          set(
            {
              photos: [],
              selectedPhotoId: null,
              uploadQueue: [],
              failedUploads: [],
            },
            false,
            'photos/setHasPhotos/clearPhotos'
          );
        }

        get().validatePhotosStep();
      },

      // File operations
      handleFileSelect: async (files) => {
        const validFiles: File[] = [];
        const errors: string[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileErrors = get().validateFile(file);

          if (fileErrors.length === 0) {
            validFiles.push(file);
          } else {
            errors.push(`${file.name}: ${fileErrors.join(', ')}`);
          }
        }

        // Показати помилки валідації якщо є
        if (errors.length > 0) {
          get().setPhotosValidationErrors('fileValidation', errors);
        }

        // Обробити валідні файли
        for (const file of validFiles) {
          try {
            const photo = await get().createPhotoFromFile(file);
            get().addPhoto(photo);
          } catch (error) {
            console.error('Failed to process file:', file.name, error);
          }
        }
      },

      createPhotoFromFile: async (file, type = PhotoType.GENERAL) => {
        let processedFile = file;

        // Стиснення якщо увімкнено
        if (get().photoSettings.autoCompress) {
          processedFile = await get().compressImage(file);
        }

        // Створення preview URL
        const previewUrl = URL.createObjectURL(processedFile);

        const photo: Omit<ItemPhoto, 'id' | 'timestamp'> = {
          file: processedFile,
          previewUrl,
          type,
          description: '',
          uploadStatus: PhotoUploadStatus.PENDING,
          uploadProgress: 0,
          uploadError: null,
          isRequired: false,
          size: processedFile.size,
        };

        return photo;
      },

      validateFile: (file) => {
        const errors: string[] = [];
        const settings = get().photoSettings;

        // Перевірка типу файлу
        if (!settings.allowedFormats.includes(file.type)) {
          errors.push('Неподтримуваний формат файлу');
        }

        // Перевірка розміру
        if (file.size > settings.maxFileSize) {
          errors.push(`Файл занадто великий (макс. ${get().formatFileSize(settings.maxFileSize)})`);
        }

        // Перевірка кількості фото
        if (get().photos.length >= settings.maxPhotos) {
          errors.push(`Досягнуто максимальну кількість фото (${settings.maxPhotos})`);
        }

        return errors;
      },

      compressImage: async (file) => {
        return new Promise((resolve) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();

          img.onload = () => {
            // Встановлюємо розміри canvas
            const maxWidth = 1920;
            const maxHeight = 1080;
            let { width, height } = img;

            if (width > height) {
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;

            // Малюємо зображення
            ctx?.drawImage(img, 0, 0, width, height);

            // Конвертуємо в blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const compressedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                } else {
                  resolve(file); // Якщо стиснення не вдалося, повертаємо оригінал
                }
              },
              file.type,
              get().photoSettings.compressionQuality
            );
          };

          img.src = URL.createObjectURL(file);
        });
      },

      // Upload management
      setIsUploading: (uploading) => {
        set({ isUploading: uploading }, false, 'photos/setIsUploading');
      },

      setUploadQueue: (queue) => {
        set({ uploadQueue: queue }, false, 'photos/setUploadQueue');
      },

      setTotalUploadProgress: (progress) => {
        set({ totalUploadProgress: progress }, false, 'photos/setTotalUploadProgress');
      },

      addToUploadQueue: (photoId) => {
        set(
          (state) => ({
            uploadQueue: state.uploadQueue.includes(photoId)
              ? state.uploadQueue
              : [...state.uploadQueue, photoId],
          }),
          false,
          'photos/addToUploadQueue'
        );
      },

      removeFromUploadQueue: (photoId) => {
        set(
          (state) => ({
            uploadQueue: state.uploadQueue.filter((id) => id !== photoId),
            failedUploads: state.failedUploads.filter((id) => id !== photoId),
          }),
          false,
          'photos/removeFromUploadQueue'
        );
      },

      uploadPhoto: async (photoId) => {
        const photo = get().photos.find((p) => p.id === photoId);
        if (!photo) return;

        // Оновлюємо статус
        get().updatePhoto(photoId, {
          uploadStatus: PhotoUploadStatus.UPLOADING,
          uploadProgress: 0,
          uploadError: null,
        });

        try {
          // API виклик для завантаження фото
          // const formData = new FormData();
          // formData.append('file', photo.file);
          // formData.append('type', photo.type);
          // formData.append('description', photo.description);

          // const response = await uploadItemPhoto(formData, {
          //   onUploadProgress: (progressEvent) => {
          //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          //     get().updatePhoto(photoId, { uploadProgress: progress });
          //   },
          // });

          // Симуляція успішного завантаження
          await new Promise((resolve) => setTimeout(resolve, 1000));

          get().updatePhoto(photoId, {
            uploadStatus: PhotoUploadStatus.COMPLETED,
            uploadProgress: 100,
            // serverUrl: response.data.url,
          });

          // Видаляємо з черги
          get().removeFromUploadQueue(photoId);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Помилка завантаження';

          get().updatePhoto(photoId, {
            uploadStatus: PhotoUploadStatus.FAILED,
            uploadError: errorMessage,
          });

          // Додаємо до списку неуспішних
          set(
            (state) => ({
              failedUploads: state.failedUploads.includes(photoId)
                ? state.failedUploads
                : [...state.failedUploads, photoId],
            }),
            false,
            'photos/uploadPhoto/addToFailed'
          );
        }
      },

      uploadAllPhotos: async () => {
        const { uploadQueue } = get();

        if (uploadQueue.length === 0) return;

        get().setIsUploading(true);

        try {
          // Завантажуємо фото паралельно
          await Promise.allSettled(uploadQueue.map((photoId) => get().uploadPhoto(photoId)));
        } finally {
          get().setIsUploading(false);
          get().setTotalUploadProgress(get().calculateTotalProgress());
        }
      },

      retryFailedUploads: async () => {
        const { failedUploads } = get();

        // Переносимо неуспішні завантаження назад до черги
        set(
          (state) => ({
            uploadQueue: [...state.uploadQueue, ...failedUploads],
            failedUploads: [],
          }),
          false,
          'photos/retryFailedUploads'
        );

        // Скидаємо статуси неуспішних фото
        failedUploads.forEach((photoId) => {
          get().updatePhoto(photoId, {
            uploadStatus: PhotoUploadStatus.PENDING,
            uploadProgress: 0,
            uploadError: null,
          });
        });

        // Запускаємо завантаження
        await get().uploadAllPhotos();
      },

      // Camera integration
      setIsCameraActive: (active) => {
        set({ isCameraActive: active }, false, 'photos/setIsCameraActive');
      },

      setCameraError: (error) => {
        set({ cameraError: error }, false, 'photos/setCameraError');
      },

      setSupportsCameraApi: (supports) => {
        set({ supportsCameraApi: supports }, false, 'photos/setSupportsCameraApi');
      },

      checkCameraSupport: () => {
        const supports = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        get().setSupportsCameraApi(supports);
      },

      captureFromCamera: async () => {
        if (!get().supportsCameraApi) {
          get().setCameraError('Камера не підтримується браузером');
          return;
        }

        try {
          get().setIsCameraActive(true);
          get().setCameraError(null);

          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }, // Задня камера на мобільних
          });

          // Тут буде реалізація захоплення кадру з відео потоку
          // const canvas = document.createElement('canvas');
          // const video = document.createElement('video');
          // ... логіка захоплення

          // API виклик для обробки зображення
          // const photo = await get().createPhotoFromFile(capturedFile, PhotoType.GENERAL);
          // get().addPhoto(photo);

          // Зупиняємо потік
          stream.getTracks().forEach((track) => track.stop());
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Помилка доступу до камери';
          get().setCameraError(errorMessage);
        } finally {
          get().setIsCameraActive(false);
        }
      },

      // Settings
      setPhotoSettings: (settings) => {
        set(
          (state) => ({
            photoSettings: { ...state.photoSettings, ...settings },
          }),
          false,
          'photos/setPhotoSettings'
        );
      },

      loadPhotoSettings: async () => {
        try {
          // API виклик для завантаження налаштувань фото
          // const settings = await getPhotoSettings();
          // get().setPhotoSettings(settings);
        } catch (error) {
          console.error('Failed to load photo settings:', error);
        }
      },

      // Validation
      setPhotosValidationErrors: (field, errors) => {
        set(
          (state) => ({
            photosValidationErrors: {
              ...state.photosValidationErrors,
              [field]: errors,
            },
          }),
          false,
          'photos/setPhotosValidationErrors'
        );
        get().validatePhotosStep();
      },

      clearPhotosValidationErrors: (field) => {
        set(
          (state) => {
            const { [field]: removed, ...rest } = state.photosValidationErrors;
            return { photosValidationErrors: rest };
          },
          false,
          'photos/clearPhotosValidationErrors'
        );
        get().validatePhotosStep();
      },

      validatePhotosStep: () => {
        const state = get();
        const errors: Record<string, string[]> = {};

        // Перевірка обов'язкових фото (якщо такі є)
        const requiredPhotos = state.photos.filter((photo) => photo.isRequired);
        const missingRequired = requiredPhotos.filter(
          (photo) => photo.uploadStatus !== PhotoUploadStatus.COMPLETED
        );

        if (missingRequired.length > 0) {
          errors.requiredPhotos = ["Не всі обов'язкові фото завантажені"];
        }

        const hasErrors = Object.keys(errors).length > 0;
        const hasValidationErrors = Object.values(state.photosValidationErrors).some(
          (fieldErrors) => fieldErrors.length > 0
        );

        set(
          {
            photosValidationErrors: errors,
            isPhotosStepValid: !hasErrors && !hasValidationErrors,
          },
          false,
          'photos/validatePhotosStep'
        );
      },

      setPhotosStepValid: (valid) => {
        set({ isPhotosStepValid: valid }, false, 'photos/setPhotosStepValid');
      },

      // Helper methods
      getPhotoTypeDisplayName: (type) => {
        const typeNames: Record<PhotoType, string> = {
          [PhotoType.GENERAL]: 'Загальний вигляд',
          [PhotoType.DEFECT]: 'Дефект',
          [PhotoType.STAIN]: 'Пляма',
          [PhotoType.CLOSE_UP]: 'Детальний знімок',
          [PhotoType.BEFORE_CLEANING]: 'До чистки',
        };
        return typeNames[type] || type;
      },

      getUploadStatusDisplayName: (status) => {
        const statusNames: Record<PhotoUploadStatus, string> = {
          [PhotoUploadStatus.PENDING]: 'Очікує',
          [PhotoUploadStatus.UPLOADING]: 'Завантаження',
          [PhotoUploadStatus.COMPLETED]: 'Завантажено',
          [PhotoUploadStatus.FAILED]: 'Помилка',
        };
        return statusNames[status] || status;
      },

      formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Б';
        const k = 1024;
        const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
      },

      generatePhotoId: () => {
        return `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      },

      calculateTotalProgress: () => {
        const { photos } = get();
        if (photos.length === 0) return 100;

        const totalProgress = photos.reduce((sum, photo) => sum + photo.uploadProgress, 0);
        return Math.round(totalProgress / photos.length);
      },

      // Reset actions
      resetPhotos: () => {
        // Очищуємо URL об'єктів для звільнення пам'яті
        get().photos.forEach((photo) => {
          if (photo.previewUrl) {
            URL.revokeObjectURL(photo.previewUrl);
          }
        });

        set(initialPhotosState, false, 'photos/resetPhotos');
      },
    }),
    {
      name: 'photos-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type PhotosStore = ReturnType<typeof usePhotosStore>;
