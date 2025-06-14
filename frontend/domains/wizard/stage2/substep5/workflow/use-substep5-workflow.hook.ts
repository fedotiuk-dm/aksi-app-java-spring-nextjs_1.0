// Substep5 Workflow Hook - тонка обгортка над Orval хуками
// Координація між API та UI станом для substep5 workflow (фотодокументація)

import { useMemo } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Orval хуки
import {
  useSubstep5InitializePhotoDocumentation,
  useSubstep5AddPhoto,
  useSubstep5RemovePhoto,
  useSubstep5CompletePhotoDocumentation,
  useSubstep5GetDocumentationStatus,
  useSubstep5GetDocumentationData,
} from '@/shared/api/generated/substep5';

// Локальні типи (з наших workflow схем)
import {
  workflowInitializationFormSchema,
  workflowNavigationFormSchema,
  workflowCompletionFormSchema,
  photoValidationFormSchema,
  type WorkflowInitializationFormData,
  type WorkflowNavigationFormData,
  type WorkflowCompletionFormData,
  type PhotoValidationFormData,
} from './schemas';

// Workflow стор та константи
import { useSubstep5WorkflowStore, useSubstep5WorkflowSelectors } from './workflow.store';
import {
  SUBSTEP5_WORKFLOW_STEPS,
  SUBSTEP5_WORKFLOW_LIMITS,
  SUBSTEP5_STEP_ORDER,
  calculateSubstep5Progress,
  getNextSubstep5Step,
  getPreviousSubstep5Step,
  isFirstSubstep5Step,
  isLastSubstep5Step,
} from './workflow.constants';

// =================== ТИПИ ===================
export interface UseSubstep5WorkflowReturn {
  // UI стан (з Zustand + селектори)
  ui: ReturnType<typeof useSubstep5WorkflowSelectors>;

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
  };

  // Запити (прямо з Orval)
  queries: {
    status: ReturnType<typeof useSubstep5GetDocumentationStatus>;
    data: ReturnType<typeof useSubstep5GetDocumentationData>;
  };

  // Форми React Hook Form + Zod
  forms: {
    initialization: ReturnType<typeof useForm<WorkflowInitializationFormData>>;
    navigation: ReturnType<typeof useForm<WorkflowNavigationFormData>>;
    completion: ReturnType<typeof useForm<WorkflowCompletionFormData>>;
    photoValidation: ReturnType<typeof useForm<PhotoValidationFormData>>;
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
    nextStep: string | null;
    previousStep: string | null;
  };

  // Константи (для UI компонентів)
  constants: {
    WORKFLOW_STEPS: typeof SUBSTEP5_WORKFLOW_STEPS;
    WORKFLOW_LIMITS: typeof SUBSTEP5_WORKFLOW_LIMITS;
    STEP_ORDER: typeof SUBSTEP5_STEP_ORDER;
  };
}

// =================== ТОНКА ОБГОРТКА ===================
export const useSubstep5Workflow = (): UseSubstep5WorkflowReturn => {
  // UI стан з Zustand + селектори
  const ui = useSubstep5WorkflowSelectors();

  // Orval API хуки (без додаткової логіки)
  const initializeMutation = useSubstep5InitializePhotoDocumentation();
  const addPhotoMutation = useSubstep5AddPhoto();
  const removePhotoMutation = useSubstep5RemovePhoto();
  const completeMutation = useSubstep5CompletePhotoDocumentation();

  // Запити даних (тільки якщо є sessionId)
  const statusQuery = useSubstep5GetDocumentationStatus(ui.sessionId || '', {
    query: { enabled: !!ui.sessionId },
  });

  const dataQuery = useSubstep5GetDocumentationData(ui.sessionId || '', {
    query: { enabled: !!ui.sessionId },
  });

  // React Hook Form + Zod валідація
  const initializationForm = useForm<WorkflowInitializationFormData>({
    resolver: zodResolver(workflowInitializationFormSchema),
    defaultValues: {
      sessionId: ui.sessionId || '',
      itemId: ui.itemId || '',
    },
  });

  const navigationForm = useForm<WorkflowNavigationFormData>({
    resolver: zodResolver(workflowNavigationFormSchema),
    defaultValues: {
      currentStep: ui.currentStep,
      targetStep: ui.currentStep,
      skipValidation: false,
      saveProgress: true,
    },
  });

  const completionForm = useForm<WorkflowCompletionFormData>({
    resolver: zodResolver(workflowCompletionFormSchema),
    defaultValues: {
      sessionId: ui.sessionId || '',
      documentationCompleted: false,
      notes: '',
      confirmCompletion: false,
    },
  });

  const photoValidationForm = useForm<PhotoValidationFormData>({
    resolver: zodResolver(photoValidationFormSchema),
    defaultValues: {
      photoIds: ui.selectedPhotoIds,
      validateAnnotations: false,
      requireAllAnnotations: false,
    },
  });

  // Стан завантаження (простий)
  const loading = useMemo(() => {
    const isInitializing = initializeMutation.isPending;
    const isAddingPhoto = addPhotoMutation.isPending;
    const isRemovingPhoto = removePhotoMutation.isPending;
    const isCompleting = completeMutation.isPending;
    const isLoadingStatus = statusQuery.isLoading;
    const isLoadingData = dataQuery.isLoading;

    return {
      isInitializing,
      isAddingPhoto,
      isRemovingPhoto,
      isCompleting,
      isLoadingStatus,
      isLoadingData,
      isAnyLoading:
        isInitializing ||
        isAddingPhoto ||
        isRemovingPhoto ||
        isCompleting ||
        isLoadingStatus ||
        isLoadingData,
    };
  }, [
    initializeMutation.isPending,
    addPhotoMutation.isPending,
    removePhotoMutation.isPending,
    completeMutation.isPending,
    statusQuery.isLoading,
    dataQuery.isLoading,
  ]);

  // Обчислені значення
  const computed = useMemo(() => {
    const currentStepIndex = SUBSTEP5_STEP_ORDER.indexOf(ui.currentStep);
    const totalSteps = SUBSTEP5_STEP_ORDER.length;
    const progressPercentage = calculateSubstep5Progress(ui.currentStep);
    const nextStep = getNextSubstep5Step(ui.currentStep);
    const previousStep = getPreviousSubstep5Step(ui.currentStep);

    return {
      canProceedToNext: ui.canGoNext && !loading.isAnyLoading,
      canGoBack: ui.canGoBack && !loading.isAnyLoading,
      progressPercentage,
      currentStepIndex,
      totalSteps,
      isFirstStep: isFirstSubstep5Step(ui.currentStep),
      isLastStep: isLastSubstep5Step(ui.currentStep),
      nextStep,
      previousStep,
    };
  }, [ui.currentStep, ui.canGoNext, ui.canGoBack, loading.isAnyLoading]);

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (з селекторами)
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
      complete: completeMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      status: statusQuery,
      data: dataQuery,
    },

    // Форми React Hook Form + Zod
    forms: {
      initialization: initializationForm,
      navigation: navigationForm,
      completion: completionForm,
      photoValidation: photoValidationForm,
    },

    // Обчислені значення
    computed,

    // Константи (для UI компонентів)
    constants: {
      WORKFLOW_STEPS: SUBSTEP5_WORKFLOW_STEPS,
      WORKFLOW_LIMITS: SUBSTEP5_WORKFLOW_LIMITS,
      STEP_ORDER: SUBSTEP5_STEP_ORDER,
    },
  };
};
