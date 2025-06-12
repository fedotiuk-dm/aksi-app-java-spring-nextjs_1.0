/**
 * @fileoverview Бізнес-логіка хук для Substep5 Photo Documentation
 *
 * Відповідальність: Координація між API, UI стором та формами + бізнес-логіка
 * Принцип: Single Responsibility Principle
 */

import { useCallback, useEffect, useMemo } from 'react';

import { usePhotoDocumentationStore } from './photo-documentation.store';
import { usePhotoDocumentationApi } from './use-photo-documentation-api.hook';
import { usePhotoDocumentationForms } from './use-photo-documentation-forms.hook';

import type {
  PhotoWithMetadata,
  PhotoUploadFormData,
  PhotoEditFormData,
  CameraSettingsFormData,
  DocumentationCompletionFormData,
} from './photo-documentation.schemas';

/**
 * Хук для бізнес-логіки фотодокументації
 */
export const usePhotoDocumentationBusiness = () => {
  // UI стор
  const {
    sessionId,
    currentItemId,
    isInitialized,
    isCameraOpen,
    cameraSettings,
    selectedPhotos,
    uploadQueue,
    isUploading,
    photoFilters,
    editingPhotoId,
    validationErrors,
    isValidationComplete,
    // Дії
    setInitialized,
    openCamera,
    closeCamera,
    updateCameraSettings,
    setCameraCapabilities,
    setCameraError,
    togglePhotoSelection,
    addToUploadQueue,
    setUploadStatus,
    removeFromUploadQueue,
    setUploading,
    setUploadError,
    updatePhotoFilters,
    setSearchResults,
    startEditingPhoto,
    stopEditingPhoto,
    setValidationErrors,
    setValidationComplete,
    reset,
  } = usePhotoDocumentationStore();

  // API хуки
  const api = usePhotoDocumentationApi(sessionId, currentItemId);

  // Форми
  const forms = usePhotoDocumentationForms();

  // Ініціалізація
  useEffect(() => {
    if (sessionId && currentItemId && !isInitialized) {
      setInitialized(true);

      // Завантажуємо можливості камери
      if (api.data.cameraCapabilities) {
        setCameraCapabilities(api.data.cameraCapabilities);
      }
    }
  }, [
    sessionId,
    currentItemId,
    isInitialized,
    setInitialized,
    api.data.cameraCapabilities,
    setCameraCapabilities,
  ]);

  // Синхронізація налаштувань камери з формою
  useEffect(() => {
    if (forms.forms.cameraSettings.formState.isDirty) {
      const settings = forms.forms.cameraSettings.getValues();
      updateCameraSettings(settings);
    }
  }, [
    forms.forms.cameraSettings.formState.isDirty,
    forms.forms.cameraSettings,
    updateCameraSettings,
  ]);

  // Синхронізація фільтрів з формою
  useEffect(() => {
    if (forms.forms.photoFilter.formState.isDirty) {
      const filters = forms.forms.photoFilter.getValues();
      updatePhotoFilters(filters);
    }
  }, [forms.forms.photoFilter.formState.isDirty, forms.forms.photoFilter, updatePhotoFilters]);

  // Автоматична валідація при зміні фото
  useEffect(() => {
    if (api.data.photos.length > 0) {
      api.methods.validateDocumentation();
    }
  }, [api.data.photos.length, api.methods]);

  // Обробка результатів валідації
  useEffect(() => {
    if (api.data.validation) {
      const errors = api.data.validation.errors || [];
      setValidationErrors(errors);
      setValidationComplete(api.data.validation.isValid || false);
    }
  }, [api.data.validation, setValidationErrors, setValidationComplete]);

  // Методи роботи з камерою
  const cameraActions = useMemo(
    () => ({
      openCamera: () => {
        if (api.data.cameraCapabilities?.hasCamera) {
          openCamera();
          setCameraError(null);
        } else {
          setCameraError('Камера недоступна на цьому пристрої');
        }
      },

      closeCamera: () => {
        closeCamera();
      },

      updateSettings: (settings: Partial<CameraSettingsFormData>) => {
        updateCameraSettings(settings);
        forms.forms.cameraSettings.reset({ ...cameraSettings, ...settings });
      },

      capturePhoto: async (imageData: Blob) => {
        try {
          setUploading(true);

          // Створюємо File об'єкт
          const file = new File([imageData], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });

          // Додаємо до черги завантаження
          const uploadId = `upload_${Date.now()}`;
          addToUploadQueue({
            photoId: uploadId,
            progress: 0,
            status: 'pending',
          });

          // Стискаємо зображення якщо потрібно
          let finalFile = file;
          if (file.size > 2 * 1024 * 1024) {
            // Більше 2MB
            const compressed = await api.methods.compressImage({ file, quality: 0.8 });
            if (compressed) {
              finalFile = compressed;
            }
          }

          // Завантажуємо фото
          await api.methods.addPhoto({
            sessionId: sessionId!,
            itemId: currentItemId!,
            file: finalFile,
            description: forms.forms.photoUpload.getValues().description,
            annotations: forms.forms.photoUpload.getValues().annotations,
          });

          setUploadStatus(uploadId, 'completed');
          removeFromUploadQueue(uploadId);

          // Скидаємо форму
          forms.forms.photoUpload.resetForm();
        } catch (error) {
          console.error('Помилка завантаження фото:', error);
          setUploadError('Помилка завантаження фото');
        } finally {
          setUploading(false);
        }
      },
    }),
    [
      api.data.cameraCapabilities,
      api.methods,
      openCamera,
      closeCamera,
      setCameraError,
      updateCameraSettings,
      cameraSettings,
      forms.forms.cameraSettings,
      forms.forms.photoUpload,
      setUploading,
      addToUploadQueue,
      setUploadStatus,
      removeFromUploadQueue,
      setUploadError,
      sessionId,
      currentItemId,
    ]
  );

  // Методи роботи з фото
  const photoActions = useMemo(
    () => ({
      uploadPhoto: async (data: PhotoUploadFormData) => {
        try {
          setUploading(true);

          const uploadId = `upload_${Date.now()}`;
          addToUploadQueue({
            photoId: uploadId,
            progress: 0,
            status: 'uploading',
          });

          await api.methods.addPhoto({
            sessionId: sessionId!,
            itemId: currentItemId!,
            file: data.file,
            description: data.description,
            annotations: data.annotations,
          });

          setUploadStatus(uploadId, 'completed');
          removeFromUploadQueue(uploadId);
          forms.forms.photoUpload.resetForm();
        } catch (error) {
          console.error('Помилка завантаження фото:', error);
          setUploadError('Помилка завантаження фото');
        } finally {
          setUploading(false);
        }
      },

      editPhoto: async (data: PhotoEditFormData) => {
        try {
          await api.methods.updatePhoto({
            sessionId: sessionId!,
            itemId: currentItemId!,
            photoId: data.photoId,
            description: data.description,
            annotations: data.annotations,
          });

          stopEditingPhoto();
          forms.forms.photoEdit.resetForm();
        } catch (error) {
          console.error('Помилка редагування фото:', error);
        }
      },

      deletePhoto: async (photoId: string) => {
        try {
          await api.methods.deletePhoto({
            sessionId: sessionId!,
            itemId: currentItemId!,
            photoId,
          });

          // Видаляємо з вибраних якщо було вибрано
          if (selectedPhotos.includes(photoId)) {
            togglePhotoSelection(photoId);
          }
        } catch (error) {
          console.error('Помилка видалення фото:', error);
        }
      },

      selectPhoto: (photoId: string) => {
        togglePhotoSelection(photoId);
      },

      startEditing: (photoId: string) => {
        startEditingPhoto(photoId);

        // Знаходимо фото та заповнюємо форму
        const photo = api.data.photos.find((p) => p.id === photoId);
        if (photo) {
          forms.forms.photoEdit.reset({
            photoId,
            description: photo.description || '',
            annotations: photo.annotations || '',
          });
        }
      },

      cancelEditing: () => {
        stopEditingPhoto();
        forms.forms.photoEdit.resetForm();
      },
    }),
    [
      api.methods,
      api.data.photos,
      sessionId,
      currentItemId,
      selectedPhotos,
      setUploading,
      addToUploadQueue,
      setUploadStatus,
      removeFromUploadQueue,
      setUploadError,
      togglePhotoSelection,
      startEditingPhoto,
      stopEditingPhoto,
      forms.forms.photoUpload,
      forms.forms.photoEdit,
    ]
  );

  // Методи фільтрування та пошуку
  const searchActions = useMemo(
    () => ({
      filterPhotos: (photos: PhotoWithMetadata[]) => {
        let filtered = [...photos];

        // Фільтр за пошуковим терміном
        if (photoFilters.searchTerm) {
          const term = photoFilters.searchTerm.toLowerCase();
          filtered = filtered.filter(
            (photo) =>
              photo.fileName.toLowerCase().includes(term) ||
              photo.description?.toLowerCase().includes(term) ||
              photo.annotations?.toLowerCase().includes(term)
          );
        }

        // Фільтр тільки з анотаціями
        if (photoFilters.showOnlyWithAnnotations) {
          filtered = filtered.filter(
            (photo) => photo.annotations && photo.annotations.trim().length > 0
          );
        }

        // Сортування
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (photoFilters.sortBy) {
            case 'date':
              comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
              break;
            case 'name':
              comparison = a.fileName.localeCompare(b.fileName);
              break;
            case 'size':
              comparison = a.fileSize - b.fileSize;
              break;
          }

          return photoFilters.sortOrder === 'desc' ? -comparison : comparison;
        });

        setSearchResults(filtered);
        return filtered;
      },

      updateFilters: (filters: Partial<typeof photoFilters>) => {
        updatePhotoFilters(filters);
        forms.forms.photoFilter.reset({ ...photoFilters, ...filters });
      },
    }),
    [photoFilters, setSearchResults, updatePhotoFilters, forms.forms.photoFilter]
  );

  // Методи завершення документації
  const completionActions = useMemo(
    () => ({
      completeDocumentation: async (data: DocumentationCompletionFormData) => {
        try {
          await api.methods.completeDocumentation({
            sessionId: sessionId!,
            itemId: currentItemId!,
            notes: data.notes,
            isComplete: data.isComplete,
            skipReason: data.skipReason,
          });

          forms.forms.documentationCompletion.resetForm();
        } catch (error) {
          console.error('Помилка завершення документації:', error);
        }
      },

      validateDocumentation: () => {
        api.methods.validateDocumentation();
      },
    }),
    [api.methods, sessionId, currentItemId, forms.forms.documentationCompletion]
  );

  // Методи очищення
  const cleanupActions = useMemo(
    () => ({
      reset: () => {
        reset();
        forms.resetAllForms();
      },

      clearErrors: () => {
        setUploadError(null);
        setCameraError(null);
        setValidationErrors([]);
      },
    }),
    [reset, forms, setUploadError, setCameraError, setValidationErrors]
  );

  // Обчислені стани готовності
  const readinessStates = useMemo(
    () => ({
      isReady: Boolean(sessionId && currentItemId && isInitialized),
      canTakePhoto: Boolean(api.data.cameraCapabilities?.hasCamera && !isUploading),
      canUploadPhoto: Boolean(!isUploading && forms.validity.photoUpload),
      canCompleteDocumentation: Boolean(isValidationComplete && validationErrors.length === 0),
      hasPhotos: api.data.photos.length > 0,
      hasSelectedPhotos: selectedPhotos.length > 0,
      isProcessing:
        isUploading ||
        api.isLoading.addingPhoto ||
        api.isLoading.updatingPhoto ||
        api.isLoading.deletingPhoto,
    }),
    [
      sessionId,
      currentItemId,
      isInitialized,
      api.data.cameraCapabilities,
      api.data.photos.length,
      api.isLoading,
      isUploading,
      forms.validity.photoUpload,
      isValidationComplete,
      validationErrors.length,
      selectedPhotos.length,
    ]
  );

  return {
    // Стани
    ui: {
      sessionId,
      currentItemId,
      isInitialized,
      isCameraOpen,
      selectedPhotos,
      editingPhotoId,
      validationErrors,
      isValidationComplete,
    },

    // Дані
    data: {
      photos: api.data.photos,
      cameraCapabilities: api.data.cameraCapabilities,
      validation: api.data.validation,
      uploadQueue,
    },

    // Стани завантаження
    loading: {
      ...api.isLoading,
      isUploading,
    },

    // Помилки
    errors: {
      ...api.errors,
      uploadError: usePhotoDocumentationStore.getState().uploadError,
      cameraError: usePhotoDocumentationStore.getState().cameraError,
    },

    // Дії
    actions: {
      camera: cameraActions,
      photo: photoActions,
      search: searchActions,
      completion: completionActions,
      cleanup: cleanupActions,
    },

    // Форми
    forms: forms.forms,

    // Стани готовності
    readiness: readinessStates,
  };
};

export type UsePhotoDocumentationBusinessReturn = ReturnType<typeof usePhotoDocumentationBusiness>;
