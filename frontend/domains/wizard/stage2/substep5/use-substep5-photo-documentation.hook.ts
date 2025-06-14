// Substep5 Photo Documentation Hook - тонка обгортка над Orval хуками
// Координація між API та UI станом для substep5 (фотодокументація)

import { useMemo } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Orval хуки
import {
  useSubstep5InitializePhotoDocumentation,
  useSubstep5AddPhoto,
  useSubstep5RemovePhoto,
  useSubstep5GetDocumentationStatus,
  useSubstep5GetDocumentationData,
  useSubstep5CompletePhotoDocumentation,
  useSubstep5CloseSession,
} from '@/shared/api/generated/substep5';

// Локальні імпорти
import {
  SUBSTEP5_UI_STEPS,
  SUBSTEP5_VALIDATION_RULES,
  SUBSTEP5_LIMITS,
} from './constants';
import {
  photoUploadFormSchema,
  photoAnnotationFormSchema,
  stepNavigationFormSchema,
  completionFormSchema,
  type PhotoUploadFormData,
  type PhotoAnnotationFormData,
  type StepNavigationFormData,
  type CompletionFormData,
} from './schemas';
import { usePhotoDocumentationSelectors } from './photo-documentation.store';

// =================== ТИПИ ===================
export interface UseSubstep5PhotoDocumentationReturn {
  // UI стан (з Zustand)
  ui: ReturnType<typeof usePhotoDocumentationSelectors>;

  // API дані з Orval
  data: {
    status: ReturnType<typeof useSubstep5GetDocumentationStatus>['data'];
    documentation: ReturnType<typeof useSubstep5GetDocumentationData>['data'];
  };

  // Стан завантаження
  loading: {
    isInitializing: boolean;
    isAddingPhoto: boolean;
    isRemovingPhoto: boolean;
    isCompleting: boolean;
    isClosing: boolean;
    isLoadingStatus: boolean;
    isLoadingData: boolean;
    isAnyLoading: boolean;
  };

  // API мутації (прямо з Orval)
  mutations: {
    initialize: ReturnType<typeof useSubstep5InitializePhotoDocumentation>;
    addPhoto: ReturnType<typeof useSubstep5AddPhoto>;
    removePhoto: ReturnType<typeof useSubstep5RemovePhoto>;
    complete: ReturnType<typeof useSubstep5CompletePhotoDocumentation>;
    close: ReturnType<typeof useSubstep5CloseSession>;
  };

  // Запити (прямо з Orval)
  queries: {
    status: ReturnType<typeof useSubstep5GetDocumentationStatus>;
    data: ReturnType<typeof useSubstep5GetDocumentationData>;
  };

  // Форми React Hook Form + Zod
  forms: {
    photoUpload: UseFormReturn<PhotoUploadFormData>;
    photoAnnotation: UseFormReturn<PhotoAnnotationFormData>;
    stepNavigation: UseFormReturn<StepNavigationFormData>;
    completion: UseFormReturn<CompletionFormData>;
  };

  // Обчислені значення
  computed: {
    canProceedToNext: boolean;
    canGoBack: boolean;
    progressPercentage: number;
    currentStepIndex: number;
    totalSteps: number;
    isFirstStep: boolean;
    isLastStep: boolean;
  };

  // Константи (для UI компонентів)
  constants: {
    UI_STEPS: typeof SUBSTEP5_UI_STEPS;
    VALIDATION_RULES: typeof SUBSTEP5_VALIDATION_RULES;
    LIMITS: typeof SUBSTEP5_LIMITS;
  };
}

// =================== ТОНКА ОБГОРТКА ===================
export const useSubstep5PhotoDocumentation = (): UseSubstep5PhotoDocumentationReturn => {
  // UI стан з Zustand (через селектори)
  const ui = usePhotoDocumentationSelectors();

  // Orval API хуки (без додаткової логіки)
  const initializeMutation = useSubstep5InitializePhotoDocumentation();
  const addPhotoMutation = useSubstep5AddPhoto();
  const removePhotoMutation = useSubstep5RemovePhoto();
  const completeDocumentationMutation = useSubstep5CompletePhotoDocumentation();
  const closeSessionMutation = useSubstep5CloseSession();

  // Запити даних (тільки якщо є sessionId)
  const statusQuery = useSubstep5GetDocumentationStatus(ui.sessionId || '', {
    query: { enabled: !!ui.sessionId },
  });

  const dataQuery = useSubstep5GetDocumentationData(ui.sessionId || '', {
    query: { enabled: !!ui.sessionId },
  });

  // React Hook Form + Zod валідація
  const photoUploadForm = useForm<PhotoUploadFormData>({
    resolver: zodResolver(photoUploadFormSchema),
    defaultValues: {
      files: [],
    },
  });

  const photoAnnotationForm = useForm<PhotoAnnotationFormData>({
    resolver: zodResolver(photoAnnotationFormSchema),
    defaultValues: {
      photoId: '',
      annotation: '',
      description: '',
    },
  });

  const stepNavigationForm = useForm<StepNavigationFormData>({
    resolver: zodResolver(stepNavigationFormSchema),
    defaultValues: {
      currentStep: ui.currentStep,
      targetStep: ui.currentStep,
    },
  });

  const completionForm = useForm<CompletionFormData>({
    resolver: zodResolver(completionFormSchema),
    defaultValues: {
      notes: '',
      confirmCompletion: false,
    },
  });

  // Стан завантаження (простий)
  const loading = useMemo(() => {
    const isInitializing = initializeMutation.isPending;
    const isAddingPhoto = addPhotoMutation.isPending;
    const isRemovingPhoto = removePhotoMutation.isPending;
    const isCompleting = completeDocumentationMutation.isPending;
    const isClosing = closeSessionMutation.isPending;
    const isLoadingStatus = statusQuery.isLoading;
    const isLoadingData = dataQuery.isLoading;

    return {
      isInitializing,
      isAddingPhoto,
      isRemovingPhoto,
      isCompleting,
      isClosing,
      isLoadingStatus,
      isLoadingData,
      isAnyLoading:
        isInitializing ||
        isAddingPhoto ||
        isRemovingPhoto ||
        isCompleting ||
        isClosing ||
        isLoadingStatus ||
        isLoadingData,
    };
  }, [
    initializeMutation.isPending,
    addPhotoMutation.isPending,
    removePhotoMutation.isPending,
    completeDocumentationMutation.isPending,
    closeSessionMutation.isPending,
    statusQuery.isLoading,
    dataQuery.isLoading,
  ]);

  // Обчислені значення
  const computed = useMemo(() => {
    const steps = Object.values(SUBSTEP5_UI_STEPS);
    const currentStepIndex = steps.indexOf(ui.currentStep);
    const totalSteps = steps.length;
    const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

    return {
      canProceedToNext: ui.canProceedToNext && !loading.isAnyLoading,
      canGoBack: currentStepIndex > 0 && !loading.isAnyLoading,
      progressPercentage,
      currentStepIndex,
      totalSteps,
      isFirstStep: currentStepIndex === 0,
      isLastStep: currentStepIndex === totalSteps - 1,
    };
  }, [ui.currentStep, ui.canProceedToNext, loading.isAnyLoading]);

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (через селектори)
    ui,

    // API дані (прямо з Orval)
    data: {
      status: statusQuery.data,
      documentation: dataQuery.data,
    },

    // Стан завантаження
    loading,

    // API мутації (прямо з Orval)
    mutations: {
      initialize: initializeMutation,
      addPhoto: addPhotoMutation,
      removePhoto: removePhotoMutation,
      complete: completeDocumentationMutation,
      close: closeSessionMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      status: statusQuery,
      data: dataQuery,
    },

    // Форми React Hook Form + Zod
    forms: {
      photoUpload: photoUploadForm,
      photoAnnotation: photoAnnotationForm,
      stepNavigation: stepNavigationForm,
      completion: completionForm,
    },

    // Обчислені значення
    computed,

    // Константи (для UI компонентів)
    constants: {
      UI_STEPS: SUBSTEP5_UI_STEPS,
      VALIDATION_RULES: SUBSTEP5_VALIDATION_RULES,
      LIMITS: SUBSTEP5_LIMITS,
    },
  };
};
