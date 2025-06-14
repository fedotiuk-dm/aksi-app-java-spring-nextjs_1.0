// Substep5 Workflow Store - ТІЛЬКИ UI стан
// Мінімальна обгортка для координації substep5 кроків (фото документація)

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Локальні імпорти
import type {
  WorkflowInitializationFormData,
  WorkflowNavigationFormData,
  WorkflowCompletionFormData,
} from './schemas';
import {
  SUBSTEP5_WORKFLOW_STEPS,
  SUBSTEP5_STEP_ORDER,
  SUBSTEP5_VALIDATION_RULES,
  SUBSTEP5_WORKFLOW_LIMITS,
  calculateSubstep5Progress,
  getNextSubstep5Step,
  getPreviousSubstep5Step,
  type Substep5WorkflowStep,
} from './workflow.constants';


// =================== ТИПИ ===================

export interface PhotoUploadInfo {
  id: string;
  fileName: string;
  size: number;
  type: string;
  uploadProgress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
}

export interface Substep5WorkflowUIState {
  // Базова ідентифікація
  sessionId: string | null;
  orderId: string | null;
  itemId: string | null;

  // UI стан workflow (БЕЗ API даних)
  currentStep: Substep5WorkflowStep;

  // Фото документація (тільки UI стан)
  uploadedPhotos: PhotoUploadInfo[];
  selectedPhotoIds: string[];
  currentPhotoIndex: number;
  isUploading: boolean;
  uploadProgress: number;

  // UI прапорці
  isWorkflowStarted: boolean;
  canProceedToNext: boolean;
  hasUnsavedChanges: boolean;
  documentationCompleted: boolean;
}

export interface Substep5WorkflowUIActions {
  // Ініціалізація
  initializeWorkflow: (data: WorkflowInitializationFormData) => void;
  resetWorkflow: () => void;

  // Кроки workflow
  setCurrentStep: (step: Substep5WorkflowStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: Substep5WorkflowStep) => void;

  // Фото документація
  addPhoto: (photo: PhotoUploadInfo) => void;
  removePhoto: (photoId: string) => void;
  updatePhotoStatus: (
    photoId: string,
    status: PhotoUploadInfo['status'],
    errorMessage?: string
  ) => void;
  updatePhotoProgress: (photoId: string, progress: number) => void;
  setSelectedPhotoIds: (photoIds: string[]) => void;
  setCurrentPhotoIndex: (index: number) => void;
  setIsUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;

  // UI стан
  setCanProceedToNext: (canProceed: boolean) => void;
  markHasUnsavedChanges: () => void;
  markChangesSaved: () => void;
  setDocumentationCompleted: (completed: boolean) => void;
}

export type Substep5WorkflowStore = Substep5WorkflowUIState & Substep5WorkflowUIActions;

// =================== ПОЧАТКОВИЙ СТАН ===================

const initialState: Substep5WorkflowUIState = {
  sessionId: null,
  orderId: null,
  itemId: null,
  currentStep: SUBSTEP5_WORKFLOW_STEPS.INITIALIZATION,
  uploadedPhotos: [],
  selectedPhotoIds: [],
  currentPhotoIndex: 0,
  isUploading: false,
  uploadProgress: 0,
  isWorkflowStarted: false,
  canProceedToNext: false,
  hasUnsavedChanges: false,
  documentationCompleted: false,
};

// =================== СТОР ===================

export const useSubstep5WorkflowStore = create<Substep5WorkflowStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Ініціалізація
    initializeWorkflow: (data: WorkflowInitializationFormData) => {
      set({
        sessionId: data.sessionId,
        itemId: data.itemId,
        isWorkflowStarted: true,
        currentStep: data.startFromStep || SUBSTEP5_WORKFLOW_STEPS.INITIALIZATION,
        hasUnsavedChanges: false,
      });
    },

    resetWorkflow: () => {
      set(initialState);
    },

    // Кроки workflow
    setCurrentStep: (step) => {
      set({ currentStep: step });
    },

    goToNextStep: () => {
      const { currentStep } = get();
      const nextStep = getNextSubstep5Step(currentStep);
      if (nextStep) {
        set({ currentStep: nextStep });
      }
    },

    goToPreviousStep: () => {
      const { currentStep } = get();
      const previousStep = getPreviousSubstep5Step(currentStep);
      if (previousStep) {
        set({ currentStep: previousStep });
      }
    },

    goToStep: (step) => {
      set({ currentStep: step });
    },

    // Фото документація
    addPhoto: (photo) => {
      const { uploadedPhotos } = get();
      if (uploadedPhotos.length < SUBSTEP5_WORKFLOW_LIMITS.MAX_PHOTOS) {
        set({
          uploadedPhotos: [...uploadedPhotos, photo],
          hasUnsavedChanges: true,
        });
      }
    },

    removePhoto: (photoId) => {
      const { uploadedPhotos, selectedPhotoIds } = get();
      set({
        uploadedPhotos: uploadedPhotos.filter((photo) => photo.id !== photoId),
        selectedPhotoIds: selectedPhotoIds.filter((id) => id !== photoId),
        hasUnsavedChanges: true,
      });
    },

    updatePhotoStatus: (photoId, status, errorMessage) => {
      const { uploadedPhotos } = get();
      set({
        uploadedPhotos: uploadedPhotos.map((photo) =>
          photo.id === photoId ? { ...photo, status, errorMessage } : photo
        ),
        hasUnsavedChanges: true,
      });
    },

    updatePhotoProgress: (photoId, progress) => {
      const { uploadedPhotos } = get();
      set({
        uploadedPhotos: uploadedPhotos.map((photo) =>
          photo.id === photoId ? { ...photo, uploadProgress: progress } : photo
        ),
      });
    },

    setSelectedPhotoIds: (photoIds) => {
      set({
        selectedPhotoIds: photoIds,
        hasUnsavedChanges: true,
      });
    },

    setCurrentPhotoIndex: (index) => {
      set({ currentPhotoIndex: index });
    },

    setIsUploading: (uploading) => {
      set({ isUploading: uploading });
    },

    setUploadProgress: (progress) => {
      set({ uploadProgress: progress });
    },

    // UI стан
    setCanProceedToNext: (canProceed) => {
      set({ canProceedToNext: canProceed });
    },

    markHasUnsavedChanges: () => {
      set({ hasUnsavedChanges: true });
    },

    markChangesSaved: () => {
      set({ hasUnsavedChanges: false });
    },

    setDocumentationCompleted: (completed) => {
      set({ documentationCompleted: completed });
    },
  }))
);

// =================== СЕЛЕКТОРИ ===================

export const useSubstep5WorkflowSelectors = () => {
  const store = useSubstep5WorkflowStore();

  return {
    // Основні селектори
    isInitialized: store.sessionId !== null,
    isCompleted: store.currentStep === SUBSTEP5_WORKFLOW_STEPS.FINALIZATION,
    progressPercentage: calculateSubstep5Progress(store.currentStep),

    // Валідація переходів
    canGoToPhotoUpload: SUBSTEP5_VALIDATION_RULES.canGoToPhotoUpload(store.sessionId, store.itemId),
    canGoToPhotoReview: SUBSTEP5_VALIDATION_RULES.canGoToPhotoReview(store.uploadedPhotos.length),
    canGoToAnnotations: SUBSTEP5_VALIDATION_RULES.canGoToAnnotations(store.uploadedPhotos.length),
    canGoToCompletion: SUBSTEP5_VALIDATION_RULES.canGoToCompletion(
      store.uploadedPhotos.length,
      SUBSTEP5_WORKFLOW_LIMITS.MIN_PHOTOS
    ),
    canFinalize: SUBSTEP5_VALIDATION_RULES.canFinalize(
      store.uploadedPhotos.length,
      SUBSTEP5_WORKFLOW_LIMITS.MIN_PHOTOS,
      store.documentationCompleted
    ),

    // Стан даних
    hasPhotos: store.uploadedPhotos.length > 0,
    photosCount: store.uploadedPhotos.length,
    completedPhotosCount: store.uploadedPhotos.filter((photo) => photo.status === 'completed')
      .length,
    failedPhotosCount: store.uploadedPhotos.filter((photo) => photo.status === 'error').length,
    uploadingPhotosCount: store.uploadedPhotos.filter((photo) => photo.status === 'uploading')
      .length,

    // Фото статистика
    totalPhotosSize: store.uploadedPhotos.reduce((total, photo) => total + photo.size, 0),
    averageUploadProgress:
      store.uploadedPhotos.length > 0
        ? Math.round(
            store.uploadedPhotos.reduce((total, photo) => total + photo.uploadProgress, 0) /
              store.uploadedPhotos.length
          )
        : 0,

    // Навігація
    canGoNext: (() => {
      const { currentStep } = store;
      switch (currentStep) {
        case SUBSTEP5_WORKFLOW_STEPS.INITIALIZATION:
          return store.sessionId !== null && store.itemId !== null;
        case SUBSTEP5_WORKFLOW_STEPS.PHOTO_UPLOAD:
          return (
            store.uploadedPhotos.length >= SUBSTEP5_WORKFLOW_LIMITS.MIN_PHOTOS && !store.isUploading
          );
        case SUBSTEP5_WORKFLOW_STEPS.PHOTO_REVIEW:
          return store.uploadedPhotos.length > 0;
        case SUBSTEP5_WORKFLOW_STEPS.ANNOTATIONS:
          return store.uploadedPhotos.length > 0;
        case SUBSTEP5_WORKFLOW_STEPS.COMPLETION:
          return store.documentationCompleted;
        default:
          return false;
      }
    })(),

    canGoBack: store.currentStep !== SUBSTEP5_WORKFLOW_STEPS.INITIALIZATION,

    // Поточне фото
    currentPhoto: store.uploadedPhotos[store.currentPhotoIndex] || null,
    hasNextPhoto: store.currentPhotoIndex < store.uploadedPhotos.length - 1,
    hasPreviousPhoto: store.currentPhotoIndex > 0,

    // Експорт всіх значень стору
    ...store,
  };
};
