/**
 * @fileoverview API хук для Substep5 Photo Documentation
 *
 * Відповідальність: Тільки Orval API операції + React Query конфігурація
 * Принцип: Single Responsibility Principle
 */

import { useMemo } from 'react';

import {
  useSubstep5GetPhotos,
  useSubstep5AddPhoto,
  useSubstep5UpdatePhoto,
  useSubstep5DeletePhoto,
  useSubstep5GetPhotoMetadata,
  useSubstep5ValidateDocumentation,
  useSubstep5CompleteDocumentation,
  useSubstep5GetCameraCapabilities,
  useSubstep5CompressImage,
  useSubstep5GenerateThumbnail,
  useSubstep5GetUploadProgress,
  useSubstep5CancelUpload,
} from '@/shared/api/generated/wizard/aksiApi';

/**
 * Хук для роботи з API фотодокументації
 */
export const usePhotoDocumentationApi = (sessionId: string | null, itemId: string | null) => {
  // Базові параметри для всіх запитів
  const baseParams = useMemo(
    () => ({
      sessionId: sessionId || '',
      itemId: itemId || '',
    }),
    [sessionId, itemId]
  );

  const isReady = Boolean(sessionId && itemId);

  // 1. Отримання списку фото
  const photosQuery = useSubstep5GetPhotos(baseParams, {
    query: {
      enabled: isReady,
      staleTime: 30000, // 30 секунд
      cacheTime: 300000, // 5 хвилин
      refetchOnWindowFocus: false,
      retry: 2,
    },
  });

  // 2. Додавання фото
  const addPhotoMutation = useSubstep5AddPhoto({
    mutation: {
      onSuccess: () => {
        // Оновлюємо список фото після успішного додавання
        photosQuery.refetch();
      },
      onError: (error) => {
        console.error('Помилка додавання фото:', error);
      },
    },
  });

  // 3. Оновлення фото (опис, анотації)
  const updatePhotoMutation = useSubstep5UpdatePhoto({
    mutation: {
      onSuccess: () => {
        photosQuery.refetch();
      },
      onError: (error) => {
        console.error('Помилка оновлення фото:', error);
      },
    },
  });

  // 4. Видалення фото
  const deletePhotoMutation = useSubstep5DeletePhoto({
    mutation: {
      onSuccess: () => {
        photosQuery.refetch();
      },
      onError: (error) => {
        console.error('Помилка видалення фото:', error);
      },
    },
  });

  // 5. Отримання метаданих фото
  const getPhotoMetadataQuery = (photoId: string) =>
    useSubstep5GetPhotoMetadata(
      { ...baseParams, photoId },
      {
        query: {
          enabled: isReady && Boolean(photoId),
          staleTime: 60000, // 1 хвилина
          cacheTime: 300000, // 5 хвилин
        },
      }
    );

  // 6. Валідація документації
  const validateDocumentationQuery = useSubstep5ValidateDocumentation(baseParams, {
    query: {
      enabled: isReady,
      staleTime: 10000, // 10 секунд
      refetchOnWindowFocus: true,
    },
  });

  // 7. Завершення документації
  const completeDocumentationMutation = useSubstep5CompleteDocumentation({
    mutation: {
      onSuccess: () => {
        // Оновлюємо валідацію після завершення
        validateDocumentationQuery.refetch();
      },
      onError: (error) => {
        console.error('Помилка завершення документації:', error);
      },
    },
  });

  // 8. Отримання можливостей камери
  const cameraCapabilitiesQuery = useSubstep5GetCameraCapabilities(
    {},
    {
      query: {
        enabled: true,
        staleTime: Infinity, // Не змінюється протягом сесії
        cacheTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    }
  );

  // 9. Стиснення зображення
  const compressImageMutation = useSubstep5CompressImage({
    mutation: {
      onError: (error) => {
        console.error('Помилка стиснення зображення:', error);
      },
    },
  });

  // 10. Генерація мініатюри
  const generateThumbnailMutation = useSubstep5GenerateThumbnail({
    mutation: {
      onError: (error) => {
        console.error('Помилка генерації мініатюри:', error);
      },
    },
  });

  // 11. Отримання прогресу завантаження
  const getUploadProgressQuery = (uploadId: string) =>
    useSubstep5GetUploadProgress(
      { uploadId },
      {
        query: {
          enabled: Boolean(uploadId),
          refetchInterval: 1000, // Оновлення кожну секунду
          staleTime: 0,
          cacheTime: 0,
        },
      }
    );

  // 12. Скасування завантаження
  const cancelUploadMutation = useSubstep5CancelUpload({
    mutation: {
      onError: (error) => {
        console.error('Помилка скасування завантаження:', error);
      },
    },
  });

  // Обчислені стани
  const isLoading = useMemo(
    () => ({
      photos: photosQuery.isLoading,
      addingPhoto: addPhotoMutation.isPending,
      updatingPhoto: updatePhotoMutation.isPending,
      deletingPhoto: deletePhotoMutation.isPending,
      validating: validateDocumentationQuery.isLoading,
      completing: completeDocumentationMutation.isPending,
      cameraCapabilities: cameraCapabilitiesQuery.isLoading,
      compressing: compressImageMutation.isPending,
      generatingThumbnail: generateThumbnailMutation.isPending,
      cancellingUpload: cancelUploadMutation.isPending,
    }),
    [
      photosQuery.isLoading,
      addPhotoMutation.isPending,
      updatePhotoMutation.isPending,
      deletePhotoMutation.isPending,
      validateDocumentationQuery.isLoading,
      completeDocumentationMutation.isPending,
      cameraCapabilitiesQuery.isLoading,
      compressImageMutation.isPending,
      generateThumbnailMutation.isPending,
      cancelUploadMutation.isPending,
    ]
  );

  const hasErrors = useMemo(
    () => ({
      photos: Boolean(photosQuery.error),
      addingPhoto: Boolean(addPhotoMutation.error),
      updatingPhoto: Boolean(updatePhotoMutation.error),
      deletingPhoto: Boolean(deletePhotoMutation.error),
      validating: Boolean(validateDocumentationQuery.error),
      completing: Boolean(completeDocumentationMutation.error),
      cameraCapabilities: Boolean(cameraCapabilitiesQuery.error),
      compressing: Boolean(compressImageMutation.error),
      generatingThumbnail: Boolean(generateThumbnailMutation.error),
      cancellingUpload: Boolean(cancelUploadMutation.error),
    }),
    [
      photosQuery.error,
      addPhotoMutation.error,
      updatePhotoMutation.error,
      deletePhotoMutation.error,
      validateDocumentationQuery.error,
      completeDocumentationMutation.error,
      cameraCapabilitiesQuery.error,
      compressImageMutation.error,
      generateThumbnailMutation.error,
      cancelUploadMutation.error,
    ]
  );

  const errors = useMemo(
    () => ({
      photos: photosQuery.error,
      addingPhoto: addPhotoMutation.error,
      updatingPhoto: updatePhotoMutation.error,
      deletingPhoto: deletePhotoMutation.error,
      validating: validateDocumentationQuery.error,
      completing: completeDocumentationMutation.error,
      cameraCapabilities: cameraCapabilitiesQuery.error,
      compressing: compressImageMutation.error,
      generatingThumbnail: generateThumbnailMutation.error,
      cancellingUpload: cancelUploadMutation.error,
    }),
    [
      photosQuery.error,
      addPhotoMutation.error,
      updatePhotoMutation.error,
      deletePhotoMutation.error,
      validateDocumentationQuery.error,
      completeDocumentationMutation.error,
      cameraCapabilitiesQuery.error,
      compressImageMutation.error,
      generateThumbnailMutation.error,
      cancelUploadMutation.error,
    ]
  );

  // API дані
  const data = useMemo(
    () => ({
      photos: photosQuery.data?.photos || [],
      validation: validateDocumentationQuery.data,
      cameraCapabilities: cameraCapabilitiesQuery.data,
      completionResult: completeDocumentationMutation.data,
      compressedImage: compressImageMutation.data,
      thumbnail: generateThumbnailMutation.data,
    }),
    [
      photosQuery.data,
      validateDocumentationQuery.data,
      cameraCapabilitiesQuery.data,
      completeDocumentationMutation.data,
      compressImageMutation.data,
      generateThumbnailMutation.data,
    ]
  );

  // API методи
  const methods = useMemo(
    () => ({
      // Основні операції з фото
      addPhoto: addPhotoMutation.mutate,
      updatePhoto: updatePhotoMutation.mutate,
      deletePhoto: deletePhotoMutation.mutate,

      // Операції з документацією
      validateDocumentation: () => validateDocumentationQuery.refetch(),
      completeDocumentation: completeDocumentationMutation.mutate,

      // Операції з зображеннями
      compressImage: compressImageMutation.mutate,
      generateThumbnail: generateThumbnailMutation.mutate,

      // Операції з завантаженням
      cancelUpload: cancelUploadMutation.mutate,

      // Оновлення даних
      refreshPhotos: () => photosQuery.refetch(),
      refreshValidation: () => validateDocumentationQuery.refetch(),
      refreshCameraCapabilities: () => cameraCapabilitiesQuery.refetch(),

      // Скидання помилок
      resetAddPhotoError: () => addPhotoMutation.reset(),
      resetUpdatePhotoError: () => updatePhotoMutation.reset(),
      resetDeletePhotoError: () => deletePhotoMutation.reset(),
      resetCompletionError: () => completeDocumentationMutation.reset(),
      resetCompressionError: () => compressImageMutation.reset(),
      resetThumbnailError: () => generateThumbnailMutation.reset(),
      resetCancelUploadError: () => cancelUploadMutation.reset(),
    }),
    [
      addPhotoMutation,
      updatePhotoMutation,
      deletePhotoMutation,
      validateDocumentationQuery,
      completeDocumentationMutation,
      compressImageMutation,
      generateThumbnailMutation,
      cancelUploadMutation,
      photosQuery,
      cameraCapabilitiesQuery,
    ]
  );

  // Допоміжні методи
  const helpers = useMemo(
    () => ({
      getPhotoMetadata: getPhotoMetadataQuery,
      getUploadProgress: getUploadProgressQuery,
      isReady,
      hasAnyError: Object.values(hasErrors).some(Boolean),
      isAnyLoading: Object.values(isLoading).some(Boolean),
    }),
    [getPhotoMetadataQuery, getUploadProgressQuery, isReady, hasErrors, isLoading]
  );

  return {
    data,
    isLoading,
    hasErrors,
    errors,
    methods,
    helpers,
  };
};

export type UsePhotoDocumentationApiReturn = ReturnType<typeof usePhotoDocumentationApi>;
