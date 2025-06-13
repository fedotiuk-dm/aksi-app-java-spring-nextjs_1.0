// Zustand стор для UI стану substep5 - Фотодокументація
// ТІЛЬКИ UI стан, БЕЗ бізнес-логіки (вона на бекенді)

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// =================== UI СТАН ===================
interface PhotoDocumentationUIState {
  // Сесія
  sessionId: string | null;
  itemId: string | null;

  // UI стан файлів
  selectedFiles: File[];
  uploadProgress: Record<string, number>; // fileId -> progress %

  // UI налаштування
  isGridView: boolean;
  sortBy: 'date' | 'name';
  sortOrder: 'asc' | 'desc';

  // UI прапорці
  isUploading: boolean;
  showAnnotationDialog: boolean;
  selectedPhotoId: string | null;
}

// =================== UI ДІЇ ===================
interface PhotoDocumentationUIActions {
  // Сесія
  setSessionId: (sessionId: string | null) => void;
  setItemId: (itemId: string | null) => void;

  // Файли
  setSelectedFiles: (files: File[]) => void;
  addSelectedFiles: (files: File[]) => void;
  removeSelectedFile: (index: number) => void;
  clearSelectedFiles: () => void;

  // Прогрес завантаження
  setUploadProgress: (fileId: string, progress: number) => void;
  clearUploadProgress: () => void;

  // UI налаштування
  setGridView: (isGrid: boolean) => void;
  setSortBy: (sortBy: 'date' | 'name') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;

  // UI прапорці
  setIsUploading: (isUploading: boolean) => void;
  setShowAnnotationDialog: (show: boolean) => void;
  setSelectedPhotoId: (photoId: string | null) => void;

  // Скидання стану
  resetUIState: () => void;
}

// =================== ПОЧАТКОВИЙ СТАН ===================
const initialState: PhotoDocumentationUIState = {
  sessionId: null,
  itemId: null,
  selectedFiles: [],
  uploadProgress: {},
  isGridView: true,
  sortBy: 'date',
  sortOrder: 'desc',
  isUploading: false,
  showAnnotationDialog: false,
  selectedPhotoId: null,
};

// =================== ZUSTAND СТОР ===================
export const usePhotoDocumentationStore = create<
  PhotoDocumentationUIState & PhotoDocumentationUIActions
>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Сесія
    setSessionId: (sessionId) => set({ sessionId }),
    setItemId: (itemId) => set({ itemId }),

    // Файли
    setSelectedFiles: (files) => set({ selectedFiles: files }),
    addSelectedFiles: (files) =>
      set((state) => ({
        selectedFiles: [...state.selectedFiles, ...files],
      })),
    removeSelectedFile: (index) =>
      set((state) => ({
        selectedFiles: state.selectedFiles.filter((_, i) => i !== index),
      })),
    clearSelectedFiles: () => set({ selectedFiles: [] }),

    // Прогрес завантаження
    setUploadProgress: (fileId, progress) =>
      set((state) => ({
        uploadProgress: { ...state.uploadProgress, [fileId]: progress },
      })),
    clearUploadProgress: () => set({ uploadProgress: {} }),

    // UI налаштування
    setGridView: (isGrid) => set({ isGridView: isGrid }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (order) => set({ sortOrder: order }),

    // UI прапорці
    setIsUploading: (isUploading) => set({ isUploading }),
    setShowAnnotationDialog: (show) => set({ showAnnotationDialog: show }),
    setSelectedPhotoId: (photoId) => set({ selectedPhotoId: photoId }),

    // Скидання стану
    resetUIState: () => set(initialState),
  }))
);
