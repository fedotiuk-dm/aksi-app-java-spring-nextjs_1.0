/**
 * @fileoverview Zustand стор для UI стану Substep5 Photo Documentation
 *
 * Відповідальність: Тільки UI стан (НЕ API дані)
 * Принцип: Single Responsibility Principle
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type {
  PhotoWithMetadata,
  CameraSettingsFormData,
  PhotoFilterFormData,
  GallerySettingsFormData,
  CameraCapabilities,
  UploadProgress,
} from './photo-documentation.schemas';

// UI стан інтерфейсу
interface PhotoDocumentationUIState {
  // Основний стан
  sessionId: string | null;
  currentItemId: string | null;
  isInitialized: boolean;

  // Стан камери
  isCameraOpen: boolean;
  cameraSettings: CameraSettingsFormData;
  cameraCapabilities: CameraCapabilities | null;
  cameraError: string | null;

  // Стан галереї
  selectedPhotos: string[];
  gallerySettings: GallerySettingsFormData;
  isGalleryOpen: boolean;
  currentPhotoIndex: number;

  // Стан завантаження
  uploadQueue: UploadProgress[];
  isUploading: boolean;
  uploadError: string | null;

  // Стан фільтрування
  photoFilters: PhotoFilterFormData;
  searchResults: PhotoWithMetadata[];

  // Стан редагування
  editingPhotoId: string | null;
  isEditDialogOpen: boolean;

  // Стан валідації
  validationErrors: string[];
  isValidationComplete: boolean;

  // Стан завершення
  isCompletionDialogOpen: boolean;
  completionNotes: string;
  skipReason: string;

  // UI прапорці
  showUploadProgress: boolean;
  showCameraControls: boolean;
  showPhotoMetadata: boolean;
  isFullscreenMode: boolean;
}

// UI дії
interface PhotoDocumentationUIActions {
  // Основні дії
  setSessionId: (sessionId: string | null) => void;
  setCurrentItemId: (itemId: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;

  // Дії камери
  openCamera: () => void;
  closeCamera: () => void;
  updateCameraSettings: (settings: Partial<CameraSettingsFormData>) => void;
  setCameraCapabilities: (capabilities: CameraCapabilities | null) => void;
  setCameraError: (error: string | null) => void;

  // Дії галереї
  togglePhotoSelection: (photoId: string) => void;
  selectAllPhotos: (photoIds: string[]) => void;
  clearPhotoSelection: () => void;
  updateGallerySettings: (settings: Partial<GallerySettingsFormData>) => void;
  openGallery: () => void;
  closeGallery: () => void;
  setCurrentPhotoIndex: (index: number) => void;

  // Дії завантаження
  addToUploadQueue: (progress: UploadProgress) => void;
  updateUploadProgress: (photoId: string, progress: number) => void;
  setUploadStatus: (photoId: string, status: UploadProgress['status'], error?: string) => void;
  removeFromUploadQueue: (photoId: string) => void;
  clearUploadQueue: () => void;
  setUploading: (uploading: boolean) => void;
  setUploadError: (error: string | null) => void;

  // Дії фільтрування
  updatePhotoFilters: (filters: Partial<PhotoFilterFormData>) => void;
  setSearchResults: (results: PhotoWithMetadata[]) => void;
  clearSearchResults: () => void;

  // Дії редагування
  startEditingPhoto: (photoId: string) => void;
  stopEditingPhoto: () => void;
  openEditDialog: () => void;
  closeEditDialog: () => void;

  // Дії валідації
  setValidationErrors: (errors: string[]) => void;
  addValidationError: (error: string) => void;
  clearValidationErrors: () => void;
  setValidationComplete: (complete: boolean) => void;

  // Дії завершення
  openCompletionDialog: () => void;
  closeCompletionDialog: () => void;
  setCompletionNotes: (notes: string) => void;
  setSkipReason: (reason: string) => void;

  // UI дії
  toggleUploadProgress: () => void;
  toggleCameraControls: () => void;
  togglePhotoMetadata: () => void;
  toggleFullscreenMode: () => void;
}

// Початковий стан
const initialState: PhotoDocumentationUIState = {
  // Основний стан
  sessionId: null,
  currentItemId: null,
  isInitialized: false,

  // Стан камери
  isCameraOpen: false,
  cameraSettings: {
    quality: 'medium',
    facingMode: 'environment',
    enableFlash: false,
    autoFocus: true,
  },
  cameraCapabilities: null,
  cameraError: null,

  // Стан галереї
  selectedPhotos: [],
  gallerySettings: {
    thumbnailSize: 'medium',
    showGrid: true,
    enableZoom: true,
    showMetadata: false,
  },
  isGalleryOpen: false,
  currentPhotoIndex: 0,

  // Стан завантаження
  uploadQueue: [],
  isUploading: false,
  uploadError: null,

  // Стан фільтрування
  photoFilters: {
    searchTerm: '',
    sortBy: 'date',
    sortOrder: 'desc',
    showOnlyWithAnnotations: false,
  },
  searchResults: [],

  // Стан редагування
  editingPhotoId: null,
  isEditDialogOpen: false,

  // Стан валідації
  validationErrors: [],
  isValidationComplete: false,

  // Стан завершення
  isCompletionDialogOpen: false,
  completionNotes: '',
  skipReason: '',

  // UI прапорці
  showUploadProgress: false,
  showCameraControls: true,
  showPhotoMetadata: false,
  isFullscreenMode: false,
};

export const usePhotoDocumentationStore = create<
  PhotoDocumentationUIState & PhotoDocumentationUIActions
>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Основні дії
    setSessionId: (sessionId) => set({ sessionId }),
    setCurrentItemId: (currentItemId) => set({ currentItemId }),
    setInitialized: (isInitialized) => set({ isInitialized }),
    reset: () => set(initialState),

    // Дії камери
    openCamera: () => set({ isCameraOpen: true, cameraError: null }),
    closeCamera: () => set({ isCameraOpen: false }),
    updateCameraSettings: (settings) =>
      set((state) => ({
        cameraSettings: { ...state.cameraSettings, ...settings },
      })),
    setCameraCapabilities: (cameraCapabilities) => set({ cameraCapabilities }),
    setCameraError: (cameraError) => set({ cameraError }),

    // Дії галереї
    togglePhotoSelection: (photoId) =>
      set((state) => ({
        selectedPhotos: state.selectedPhotos.includes(photoId)
          ? state.selectedPhotos.filter((id) => id !== photoId)
          : [...state.selectedPhotos, photoId],
      })),
    selectAllPhotos: (photoIds) => set({ selectedPhotos: photoIds }),
    clearPhotoSelection: () => set({ selectedPhotos: [] }),
    updateGallerySettings: (settings) =>
      set((state) => ({
        gallerySettings: { ...state.gallerySettings, ...settings },
      })),
    openGallery: () => set({ isGalleryOpen: true }),
    closeGallery: () => set({ isGalleryOpen: false, currentPhotoIndex: 0 }),
    setCurrentPhotoIndex: (currentPhotoIndex) => set({ currentPhotoIndex }),

    // Дії завантаження
    addToUploadQueue: (progress) =>
      set((state) => ({
        uploadQueue: [...state.uploadQueue, progress],
      })),
    updateUploadProgress: (photoId, progress) =>
      set((state) => ({
        uploadQueue: state.uploadQueue.map((item) =>
          item.photoId === photoId ? { ...item, progress } : item
        ),
      })),
    setUploadStatus: (photoId, status, error) =>
      set((state) => ({
        uploadQueue: state.uploadQueue.map((item) =>
          item.photoId === photoId ? { ...item, status, error } : item
        ),
      })),
    removeFromUploadQueue: (photoId) =>
      set((state) => ({
        uploadQueue: state.uploadQueue.filter((item) => item.photoId !== photoId),
      })),
    clearUploadQueue: () => set({ uploadQueue: [] }),
    setUploading: (isUploading) => set({ isUploading }),
    setUploadError: (uploadError) => set({ uploadError }),

    // Дії фільтрування
    updatePhotoFilters: (filters) =>
      set((state) => ({
        photoFilters: { ...state.photoFilters, ...filters },
      })),
    setSearchResults: (searchResults) => set({ searchResults }),
    clearSearchResults: () => set({ searchResults: [] }),

    // Дії редагування
    startEditingPhoto: (editingPhotoId) => set({ editingPhotoId }),
    stopEditingPhoto: () => set({ editingPhotoId: null }),
    openEditDialog: () => set({ isEditDialogOpen: true }),
    closeEditDialog: () => set({ isEditDialogOpen: false, editingPhotoId: null }),

    // Дії валідації
    setValidationErrors: (validationErrors) => set({ validationErrors }),
    addValidationError: (error) =>
      set((state) => ({
        validationErrors: [...state.validationErrors, error],
      })),
    clearValidationErrors: () => set({ validationErrors: [] }),
    setValidationComplete: (isValidationComplete) => set({ isValidationComplete }),

    // Дії завершення
    openCompletionDialog: () => set({ isCompletionDialogOpen: true }),
    closeCompletionDialog: () =>
      set({
        isCompletionDialogOpen: false,
        completionNotes: '',
        skipReason: '',
      }),
    setCompletionNotes: (completionNotes) => set({ completionNotes }),
    setSkipReason: (skipReason) => set({ skipReason }),

    // UI дії
    toggleUploadProgress: () => set((state) => ({ showUploadProgress: !state.showUploadProgress })),
    toggleCameraControls: () => set((state) => ({ showCameraControls: !state.showCameraControls })),
    togglePhotoMetadata: () => set((state) => ({ showPhotoMetadata: !state.showPhotoMetadata })),
    toggleFullscreenMode: () => set((state) => ({ isFullscreenMode: !state.isFullscreenMode })),
  }))
);
