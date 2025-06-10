/**
 * @fileoverview Головний координуючий хук для Order Wizard State Machine
 *
 * Цей хук інкапсулює всю логіку координації між етапами та забезпечує
 * централізоване управління станом всього візарда.
 */

import { useCallback, useMemo } from 'react';

import {
  useGetWorkflow,
  useGetStagesStatus,
  useGetStageStatus,
  type WorkflowMap,
  type StagesStatus,
  type StageStatus,
  type ErrorResponse,
} from '@/shared/api/generated/full';

import { useWizardNavigationStore } from '../store/wizard-navigation.store';

export interface OrderWizardCoordinator {
  // Загальні дані
  workflow: WorkflowMap | undefined;
  stagesStatus: StagesStatus | undefined;

  // Поточний стан
  currentStage: number;
  currentStageStatus: StageStatus | undefined;

  // Навігація
  canNavigateToStage: (stageNumber: number) => boolean;
  navigateToStage: (stageNumber: number) => void;
  goToNextStage: () => void;
  goToPreviousStage: () => void;

  // Валідація
  isStageComplete: (stageNumber: number) => boolean;
  isWizardComplete: boolean;

  // Статуси завантаження
  isLoading: boolean;
  isError: boolean;
  error: ErrorResponse | null;

  // Утиліти
  refreshStatuses: () => void;
  resetWizard: () => void;
}

export const useOrderWizardCoordinator = (): OrderWizardCoordinator => {
  const { currentStage, setCurrentStage, resetNavigation } = useWizardNavigationStore();

  // Запити для отримання даних
  const {
    data: workflow,
    isLoading: isWorkflowLoading,
    error: workflowError,
    refetch: refetchWorkflow,
  } = useGetWorkflow({
    query: {
      staleTime: 5 * 60 * 1000, // 5 хвилин кеш
      gcTime: 10 * 60 * 1000, // 10 хвилин в garbage collection
    },
  });

  const {
    data: stagesStatus,
    isLoading: isStagesStatusLoading,
    error: stagesStatusError,
    refetch: refetchStagesStatus,
  } = useGetStagesStatus({
    query: {
      refetchInterval: 30000, // Оновлення кожні 30 секунд
      staleTime: 10 * 1000, // 10 секунд кеш
    },
  });

  const {
    data: currentStageStatus,
    isLoading: isCurrentStageLoading,
    error: currentStageError,
  } = useGetStageStatus(currentStage, {
    query: {
      enabled: !!currentStage,
      refetchInterval: 15000, // Оновлення кожні 15 секунд
    },
  });

  // Логіка навігації
  const canNavigateToStage = useCallback(
    (stageNumber: number): boolean => {
      if (!stagesStatus?.stages) return false;

      const stageKey = `stage${stageNumber}`;
      const stageInfo = stagesStatus.stages[stageKey];

      // Можна навігувати на етап, якщо він готовий або це поточний/попередній етап
      return stageInfo?.status === 'READY' || stageNumber <= currentStage;
    },
    [stagesStatus, currentStage]
  );

  const navigateToStage = useCallback(
    (stageNumber: number) => {
      if (canNavigateToStage(stageNumber)) {
        setCurrentStage(stageNumber);
      }
    },
    [canNavigateToStage, setCurrentStage]
  );

  const goToNextStage = useCallback(() => {
    const nextStage = currentStage + 1;
    if (canNavigateToStage(nextStage)) {
      setCurrentStage(nextStage);
    }
  }, [currentStage, canNavigateToStage, setCurrentStage]);

  const goToPreviousStage = useCallback(() => {
    const previousStage = Math.max(1, currentStage - 1);
    setCurrentStage(previousStage);
  }, [currentStage, setCurrentStage]);

  // Логіка валідації
  const isStageComplete = useCallback(
    (stageNumber: number): boolean => {
      if (!stagesStatus?.stages) return false;

      const stageKey = `stage${stageNumber}`;
      const stageInfo = stagesStatus.stages[stageKey];

      return stageInfo?.status === 'COMPLETED';
    },
    [stagesStatus]
  );

  const isWizardComplete = useMemo(() => {
    if (!workflow?.steps) return false;

    return workflow.steps.every((step, index) => isStageComplete(index + 1));
  }, [workflow, isStageComplete]);

  // Статуси завантаження та помилок
  const isLoading = isWorkflowLoading || isStagesStatusLoading || isCurrentStageLoading;
  const isError = !!(workflowError || stagesStatusError || currentStageError);
  const error = workflowError || stagesStatusError || currentStageError || null;

  // Утиліти
  const refreshStatuses = useCallback(() => {
    refetchWorkflow();
    refetchStagesStatus();
  }, [refetchWorkflow, refetchStagesStatus]);

  const resetWizard = useCallback(() => {
    resetNavigation();
    refreshStatuses();
  }, [resetNavigation, refreshStatuses]);

  return {
    // Загальні дані
    workflow,
    stagesStatus,

    // Поточний стан
    currentStage,
    currentStageStatus,

    // Навігація
    canNavigateToStage,
    navigateToStage,
    goToNextStage,
    goToPreviousStage,

    // Валідація
    isStageComplete,
    isWizardComplete,

    // Статуси завантаження
    isLoading,
    isError,
    error,

    // Утиліти
    refreshStatuses,
    resetWizard,
  };
};

export type { WorkflowMap, StagesStatus, StageStatus };
