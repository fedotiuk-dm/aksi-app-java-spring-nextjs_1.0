/**
 * @fileoverview Головний композиційний хук для Substep5 Photo Documentation
 *
 * Відповідальність: Facade pattern - публічне API для UI компонентів
 * Принцип: Interface Segregation Principle
 */

import { useMemo } from 'react';
import { usePhotoDocumentationBusiness } from './use-photo-documentation-business.hook';
import { usePhotoDocumentationStore } from './photo-documentation.store';
import { useItemManagerStore } from '../item-manager/item-manager.store';

/**
 * Головний хук для фотодокументації
 * Facade pattern для UI компонентів
 */
export const usePhotoDocumentation = () => {
  // Отримуємо поточний предмет з Item Manager
  const { currentItemId, sessionId } = useItemManagerStore();

  // Бізнес-логіка
  const business = usePhotoDocumentationBusiness();

  // Синхронізуємо sessionId та itemId з Item Manager
  useMemo(() => {
    if (sessionId && currentItemId) {
      business.ui.sessionId !== sessionId &&
        usePhotoDocumentationStore.getState().setSessionId(sessionId);
      business.ui.currentItemId !== currentItemId &&
        usePhotoDocumentationStore.getState().setCurrentItemId(currentItemId);
    }
  }, [sessionId, currentItemId, business.ui.sessionId, business.ui.currentItemId]);

  // Обчислені стани готовності для UI
  const readinessStates = useMemo(
    () => ({
      // Основні стани
      isReady: business.readiness.isReady,
      isInitialized: business.ui.isInitialized,

      // Стани камери
      canUseCamera: business.readiness.canTakePhoto,
      isCameraOpen: business.ui.isCameraOpen,
      hasCameraCapabilities: Boolean(business.data.cameraCapabilities?.hasCamera),

      // Стани фото
      hasPhotos: business.readiness.hasPhotos,
      hasSelectedPhotos: business.readiness.hasSelectedPhotos,
      canUploadPhoto: business.readiness.canUploadPhoto,

      // Стани завантаження
      isProcessing: business.readiness.isProcessing,
      isUploading: business.loading.isUploading,
      hasUploadQueue: business.data.uploadQueue.length > 0,

      // Стани валідації
      isValidationComplete: business.ui.isValidationComplete,
      hasValidationErrors: business.ui.validationErrors.length > 0,
      canCompleteDocumentation: business.readiness.canCompleteDocumentation,

      // Стани редагування
      isEditingPhoto: Boolean(business.ui.editingPhotoId),
    }),
    [business]
  );

  // Групування даних для UI
  const uiData = useMemo(
    () => ({
      // Фото дані
      photos: business.data.photos,
      selectedPhotos: business.ui.selectedPhotos,
      editingPhotoId: business.ui.editingPhotoId,

      // Камера дані
      cameraCapabilities: business.data.cameraCapabilities,

      // Валідація дані
      validation: business.data.validation,
      validationErrors: business.ui.validationErrors,

      // Завантаження дані
      uploadQueue: business.data.uploadQueue,
    }),
    [business]
  );

  // Групування станів завантаження для UI
  const loadingStates = useMemo(
    () => ({
      // Основні завантаження
      photos: business.loading.photos,
      validation: business.loading.validating,
      cameraCapabilities: business.loading.cameraCapabilities,

      // Операції з фото
      addingPhoto: business.loading.addingPhoto,
      updatingPhoto: business.loading.updatingPhoto,
      deletingPhoto: business.loading.deletingPhoto,

      // Додаткові операції
      compressing: business.loading.compressing,
      generatingThumbnail: business.loading.generatingThumbnail,
      completing: business.loading.completing,

      // Загальні стани
      isUploading: business.loading.isUploading,
      isProcessing: business.readiness.isProcessing,
    }),
    [business.loading, business.readiness.isProcessing]
  );

  // Групування помилок для UI
  const errorStates = useMemo(
    () => ({
      // API помилки
      photos: business.errors.photos,
      addingPhoto: business.errors.addingPhoto,
      updatingPhoto: business.errors.updatingPhoto,
      deletingPhoto: business.errors.deletingPhoto,
      validation: business.errors.validating,
      completion: business.errors.completing,

      // UI помилки
      camera: business.errors.cameraError,
      upload: business.errors.uploadError,

      // Валідація помилки
      validationErrors: business.ui.validationErrors,

      // Загальні стани
      hasAnyError:
        Object.values(business.errors).some(Boolean) || business.ui.validationErrors.length > 0,
    }),
    [business.errors, business.ui.validationErrors]
  );

  // Групування дій для UI
  const actions = useMemo(
    () => ({
      // Дії камери
      camera: {
        open: business.actions.camera.openCamera,
        close: business.actions.camera.closeCamera,
        updateSettings: business.actions.camera.updateSettings,
        capture: business.actions.camera.capturePhoto,
      },

      // Дії фото
      photo: {
        upload: business.actions.photo.uploadPhoto,
        edit: business.actions.photo.editPhoto,
        delete: business.actions.photo.deletePhoto,
        select: business.actions.photo.selectPhoto,
        startEditing: business.actions.photo.startEditing,
        cancelEditing: business.actions.photo.cancelEditing,
      },

      // Дії пошуку
      search: {
        filter: business.actions.search.filterPhotos,
        updateFilters: business.actions.search.updateFilters,
      },

      // Дії завершення
      completion: {
        complete: business.actions.completion.completeDocumentation,
        validate: business.actions.completion.validateDocumentation,
      },

      // Дії очищення
      cleanup: {
        reset: business.actions.cleanup.reset,
        clearErrors: business.actions.cleanup.clearErrors,
      },
    }),
    [business.actions]
  );

  // Групування форм для UI
  const forms = useMemo(
    () => ({
      photoUpload: business.forms.photoUpload,
      photoEdit: business.forms.photoEdit,
      cameraSettings: business.forms.cameraSettings,
      photoFilter: business.forms.photoFilter,
      documentationValidation: business.forms.documentationValidation,
      documentationCompletion: business.forms.documentationCompletion,
      gallerySettings: business.forms.gallerySettings,
    }),
    [business.forms]
  );

  return {
    // Дані для UI
    data: uiData,

    // Стани завантаження
    loading: loadingStates,

    // Стани помилок
    errors: errorStates,

    // Стани готовності
    readiness: readinessStates,

    // Дії для UI
    actions,

    // Форми для UI
    forms,
  };
};

export type UsePhotoDocumentationReturn = ReturnType<typeof usePhotoDocumentation>;
