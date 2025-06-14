// Zustand стор для UI стану substep5 - Фотодокументація
// ТІЛЬКИ UI стан, БЕЗ бізнес-логіки (вона на бекенді)

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  SUBSTEP5_UI_STEPS,
  SUBSTEP5_VALIDATION_RULES,
  SUBSTEP5_LIMITS,
  type Substep5UIStep,
} from './constants';

// =================== UI СТАН ===================
interface PhotoDocumentationUIState {
  // Сесія та контекст
  sessionId: string | null;
  itemId: string | null;
  currentStep: Substep5UIStep;

  // UI стан файлів
  selectedFiles: File[];
  uploadProgress: Record<string, number>; // fileId -> progress %
  uploadErrors: Record<string, string>; // fileId -> error message

  // UI налаштування перегляду
  isGridView: boolean;
  sortBy: 'date' | 'name' | 'size';
  sortOrder: 'asc' | 'desc';
  thumbnailSize: number;

  // UI прапорці та стани
  isUploading: boolean;
  showAnnotationDialog: boolean;
  selectedPhotoId: string | null;
  showPreview: boolean;
  previewPhotoId: string | null;

  // Валідація та помилки
  validationErrors: string[];
  hasUnsavedChanges: boolean;

  // Анотації (локальний UI стан)
  localAnnotations: Record<string, string>; // photoId -> annotation
}

// =================== UI ДІЇ ===================
interface PhotoDocumentationUIActions {
  // Сесія та навігація
  setSessionId: (sessionId: string | null) => void;
  setItemId: (itemId: string | null) => void;
  setCurrentStep: (step: Substep5UIStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Файли та завантаження
  setSelectedFiles: (files: File[]) => void;
  addSelectedFiles: (files: File[]) => void;
  removeSelectedFile: (index: number) => void;
  clearSelectedFiles: () => void;
  validateFiles: (files: File[]) => string[];

  // Прогрес та помилки завантаження
  setUploadProgress: (fileId: string, progress: number) => void;
  setUploadError: (fileId: string, error: string) => void;
  clearUploadProgress: () => void;
  clearUploadErrors: () => void;

  // UI налаштування перегляду
  setGridView: (isGrid: boolean) => void;
  setSortBy: (sortBy: 'date' | 'name' | 'size') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setThumbnailSize: (size: number) => void;

  // UI прапорці та діалоги
  setIsUploading: (isUploading: boolean) => void;
  setShowAnnotationDialog: (show: boolean) => void;
  setSelectedPhotoId: (photoId: string | null) => void;
  setShowPreview: (show: boolean) => void;
  setPreviewPhotoId: (photoId: string | null) => void;

  // Валідація та зміни
  setValidationErrors: (errors: string[]) => void;
  clearValidationErrors: () => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;

  // Анотації (локальний UI стан)
  setLocalAnnotation: (photoId: string, annotation: string) => void;
  clearLocalAnnotations: () => void;

  // Скидання стану
  resetUIState: () => void;
}

// =================== ПОЧАТКОВИЙ СТАН ===================
const initialState: PhotoDocumentationUIState = {
  sessionId: null,
  itemId: null,
  currentStep: SUBSTEP5_UI_STEPS.PHOTO_UPLOAD,
  selectedFiles: [],
  uploadProgress: {},
  uploadErrors: {},
  isGridView: true,
  sortBy: 'date',
  sortOrder: 'desc',
  thumbnailSize: SUBSTEP5_LIMITS.THUMBNAIL_SIZE,
  isUploading: false,
  showAnnotationDialog: false,
  selectedPhotoId: null,
  showPreview: false,
  previewPhotoId: null,
  validationErrors: [],
  hasUnsavedChanges: false,
  localAnnotations: {},
};

// =================== ZUSTAND СТОР ===================
export const usePhotoDocumentationStore = create<
  PhotoDocumentationUIState & PhotoDocumentationUIActions
>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Сесія та навігація
    setSessionId: (sessionId) => set({ sessionId }),
    setItemId: (itemId) => set({ itemId }),
    setCurrentStep: (step) => set({ currentStep: step }),
    goToNextStep: () => {
      const { currentStep } = get();
      const steps = Object.values(SUBSTEP5_UI_STEPS);
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex < steps.length - 1) {
        set({ currentStep: steps[currentIndex + 1] });
      }
    },
    goToPreviousStep: () => {
      const { currentStep } = get();
      const steps = Object.values(SUBSTEP5_UI_STEPS);
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex > 0) {
        set({ currentStep: steps[currentIndex - 1] });
      }
    },

    // Файли та завантаження
    setSelectedFiles: (files) => set({ selectedFiles: files }),
    addSelectedFiles: (files) =>
      set((state) => ({
        selectedFiles: [...state.selectedFiles, ...files],
        hasUnsavedChanges: true,
      })),
    removeSelectedFile: (index) =>
      set((state) => ({
        selectedFiles: state.selectedFiles.filter((_, i) => i !== index),
        hasUnsavedChanges: true,
      })),
    clearSelectedFiles: () => set({ selectedFiles: [], hasUnsavedChanges: false }),

    validateFiles: (files) => {
      const errors: string[] = [];

      if (files.length < SUBSTEP5_VALIDATION_RULES.MIN_PHOTOS) {
        errors.push(`Потрібно завантажити хоча б ${SUBSTEP5_VALIDATION_RULES.MIN_PHOTOS} фото`);
      }

      if (files.length > SUBSTEP5_VALIDATION_RULES.MAX_PHOTOS) {
        errors.push(`Максимум ${SUBSTEP5_VALIDATION_RULES.MAX_PHOTOS} фото`);
      }

      const maxSize = SUBSTEP5_VALIDATION_RULES.MAX_FILE_SIZE_MB * 1024 * 1024;
      const oversizedFiles = files.filter((file) => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        errors.push(
          `Файли перевищують максимальний розмір ${SUBSTEP5_VALIDATION_RULES.MAX_FILE_SIZE_MB}MB`
        );
      }

      const invalidFormats = files.filter(
        (file) =>
          !(SUBSTEP5_VALIDATION_RULES.ALLOWED_FORMATS as readonly string[]).includes(file.type)
      );
      if (invalidFormats.length > 0) {
        errors.push('Деякі файли мають недозволений формат');
      }

      return errors;
    },

    // Прогрес та помилки завантаження
    setUploadProgress: (fileId, progress) =>
      set((state) => ({
        uploadProgress: { ...state.uploadProgress, [fileId]: progress },
      })),
    setUploadError: (fileId, error) =>
      set((state) => ({
        uploadErrors: { ...state.uploadErrors, [fileId]: error },
      })),
    clearUploadProgress: () => set({ uploadProgress: {} }),
    clearUploadErrors: () => set({ uploadErrors: {} }),

    // UI налаштування перегляду
    setGridView: (isGrid) => set({ isGridView: isGrid }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (order) => set({ sortOrder: order }),
    setThumbnailSize: (size) => set({ thumbnailSize: size }),

    // UI прапорці та діалоги
    setIsUploading: (isUploading) => set({ isUploading }),
    setShowAnnotationDialog: (show) => set({ showAnnotationDialog: show }),
    setSelectedPhotoId: (photoId) => set({ selectedPhotoId: photoId }),
    setShowPreview: (show) => set({ showPreview: show }),
    setPreviewPhotoId: (photoId) => set({ previewPhotoId: photoId }),

    // Валідація та зміни
    setValidationErrors: (errors) => set({ validationErrors: errors }),
    clearValidationErrors: () => set({ validationErrors: [] }),
    setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

    // Анотації (локальний UI стан)
    setLocalAnnotation: (photoId, annotation) =>
      set((state) => ({
        localAnnotations: { ...state.localAnnotations, [photoId]: annotation },
        hasUnsavedChanges: true,
      })),
    clearLocalAnnotations: () => set({ localAnnotations: {} }),

    // Скидання стану
    resetUIState: () => set(initialState),
  }))
);

// =================== СЕЛЕКТОРИ ===================
// Селектори для зручного доступу до стану
export const usePhotoDocumentationSelectors = () => {
  const store = usePhotoDocumentationStore();

  return {
    // Основний стан
    sessionId: store.sessionId,
    itemId: store.itemId,
    currentStep: store.currentStep,

    // Файли та завантаження
    selectedFiles: store.selectedFiles,
    uploadProgress: store.uploadProgress,
    uploadErrors: store.uploadErrors,
    isUploading: store.isUploading,

    // UI налаштування
    isGridView: store.isGridView,
    sortBy: store.sortBy,
    sortOrder: store.sortOrder,
    thumbnailSize: store.thumbnailSize,

    // Діалоги та прев'ю
    showAnnotationDialog: store.showAnnotationDialog,
    selectedPhotoId: store.selectedPhotoId,
    showPreview: store.showPreview,
    previewPhotoId: store.previewPhotoId,

    // Валідація та зміни
    validationErrors: store.validationErrors,
    hasUnsavedChanges: store.hasUnsavedChanges,
    localAnnotations: store.localAnnotations,

    // Обчислені значення
    hasSelectedFiles: store.selectedFiles.length > 0,
    selectedFilesCount: store.selectedFiles.length,
    isMaxFilesReached: store.selectedFiles.length >= SUBSTEP5_VALIDATION_RULES.MAX_PHOTOS,
    hasValidationErrors: store.validationErrors.length > 0,
    hasUploadErrors: Object.keys(store.uploadErrors).length > 0,
    canProceedToNext:
      store.selectedFiles.length >= SUBSTEP5_VALIDATION_RULES.MIN_PHOTOS &&
      store.validationErrors.length === 0 &&
      !store.isUploading,
  };
};
