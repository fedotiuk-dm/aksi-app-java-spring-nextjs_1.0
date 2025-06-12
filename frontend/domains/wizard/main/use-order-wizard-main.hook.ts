// ЕТАП 3: Композиційний хук для головного управління Order Wizard
'use client';

import { useMemo, useEffect, useCallback } from 'react';

import {
  useOrderWizardStart,
  useOrderWizardCompleteStage1,
  useOrderWizardCompleteStage2,
  useOrderWizardCompleteStage3,
  useOrderWizardCompleteOrder,
  useOrderWizardCancelOrder,
} from '@/shared/api/generated/wizard';

import {
  useOrderWizardMainStore,
  selectSessionInfo,
  selectNavigationState,
  selectDebugInfo,
} from './main.store';
// Спільний wizard management хук
import { useWizardManagement } from '../shared';

// Конфігураційні константи
const ORDER_WIZARD_CONFIG = {
  AUTO_SAVE_INTERVAL: 30000, // 30 секунд
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 хвилин
  RETRY_ATTEMPTS: 3,
} as const;

/**
 * Головний композиційний хук для управління Order Wizard
 *
 * Об'єднує:
 * - UI стан з Zustand (sessionId, навігація, етапи)
 * - API мутації через Orval (запуск, завершення етапів)
 * - Інтеграція з shared wizard management
 * - Валідація переходів між етапами
 *
 * @returns Об'єкт з групованими даними: ui, data, loading, errors, actions
 */
export const useOrderWizardMain = () => {
  // ========== 1. UI СТАН З ZUSTAND ==========

  // Отримуємо весь стан для уникнення проблем з селекторами
  const store = useOrderWizardMainStore();

  // Деструктуризація та обчислення селекторів
  const sessionInfo = useMemo(() => selectSessionInfo(store), [store]);
  const navigationState = useMemo(() => selectNavigationState(store), [store]);
  const debugInfo = useMemo(() => selectDebugInfo(store), [store]);

  // Actions напряму з стору
  const {
    initializeWizard,
    startWizard,
    resetWizard,
    setCurrentStage,
    completeStage,
    unlockStage,
    updateLastActiveTime,
    toggleDebugMode,
  } = store;

  // ========== 2. ІНТЕГРАЦІЯ З SHARED WIZARD MANAGEMENT ==========
  const wizardSystem = useWizardManagement();

  // ========== 3. API МУТАЦІЇ (ORVAL) ==========

  // Запуск Order Wizard
  const startOrderWizardMutation = useOrderWizardStart({
    mutation: {
      onMutate: () => {
        updateLastActiveTime();
      },
      onSuccess: (data) => {
        // Обробка відповіді - sessionId може бути в різних форматах
        let newSessionId: string;

        if (typeof data === 'string') {
          newSessionId = data;
        } else if (data && typeof data === 'object' && 'sessionId' in data) {
          newSessionId = data.sessionId as string;
        } else if (data && typeof data === 'object' && 'id' in data) {
          newSessionId = data.id as string;
        } else {
          throw new Error('Не вдалося отримати sessionId з відповіді сервера');
        }

        // Оновлення локального стану
        startWizard(newSessionId);
        setCurrentStage(1);
      },
      onError: (error) => {
        console.error('Помилка запуску Order Wizard:', error);
        resetWizard();
      },
    },
  });

  // Завершення Stage1
  const completeStage1Mutation = useOrderWizardCompleteStage1({
    mutation: {
      onMutate: () => {
        updateLastActiveTime();
      },
      onSuccess: () => {
        completeStage(1);
        unlockStage(2);
        setCurrentStage(2);
      },
      onError: (error) => {
        console.error('Помилка завершення Stage1:', error);
      },
    },
  });

  // Завершення Stage2
  const completeStage2Mutation = useOrderWizardCompleteStage2({
    mutation: {
      onMutate: () => {
        updateLastActiveTime();
      },
      onSuccess: () => {
        completeStage(2);
        unlockStage(3);
        setCurrentStage(3);
      },
      onError: (error) => {
        console.error('Помилка завершення Stage2:', error);
      },
    },
  });

  // Завершення Stage3
  const completeStage3Mutation = useOrderWizardCompleteStage3({
    mutation: {
      onMutate: () => {
        updateLastActiveTime();
      },
      onSuccess: () => {
        completeStage(3);
        unlockStage(4);
        setCurrentStage(4);
      },
      onError: (error) => {
        console.error('Помилка завершення Stage3:', error);
      },
    },
  });

  // Завершення всього замовлення
  const completeOrderMutation = useOrderWizardCompleteOrder({
    mutation: {
      onMutate: () => {
        updateLastActiveTime();
      },
      onSuccess: (data) => {
        completeStage(4);
        // Можна додати логіку для обробки завершеного замовлення
        console.log('Замовлення успішно завершено:', data);
      },
      onError: (error) => {
        console.error('Помилка завершення замовлення:', error);
      },
    },
  });

  // Скасування замовлення
  const cancelOrderMutation = useOrderWizardCancelOrder({
    mutation: {
      onMutate: () => {
        updateLastActiveTime();
      },
      onSuccess: () => {
        resetWizard();
      },
      onError: (error) => {
        console.error('Помилка скасування замовлення:', error);
      },
    },
  });

  // ========== 4. ДІЇ ТА УТИЛІТИ ==========

  // Ініціалізація Order Wizard
  const initializeOrderWizard = useCallback(() => {
    initializeWizard();
  }, [initializeWizard]);

  // Запуск нового замовлення
  const startNewOrder = useCallback(() => {
    if (wizardSystem.system.isHealthy && wizardSystem.system.systemReady) {
      startOrderWizardMutation.mutate();
    } else {
      console.warn('Система не готова для запуску нового замовлення');
    }
  }, [startOrderWizardMutation, wizardSystem.system]);

  // Навігація до етапу
  const navigateToStage = useCallback(
    (stage: 1 | 2 | 3 | 4) => {
      if (navigationState.canProceedToStage(stage)) {
        setCurrentStage(stage);
      }
    },
    [setCurrentStage, navigationState]
  );

  // Завершення поточного етапу
  const completeCurrentStage = useCallback(() => {
    if (!sessionInfo.sessionId) {
      console.warn('Немає активної сесії');
      return;
    }

    const { currentStage } = sessionInfo;

    switch (currentStage) {
      case 1:
        completeStage1Mutation.mutate({ sessionId: sessionInfo.sessionId });
        break;
      case 2:
        completeStage2Mutation.mutate({ sessionId: sessionInfo.sessionId });
        break;
      case 3:
        completeStage3Mutation.mutate({ sessionId: sessionInfo.sessionId });
        break;
      case 4:
        completeOrderMutation.mutate({ sessionId: sessionInfo.sessionId });
        break;
      default:
        console.warn(`Невідомий етап: ${currentStage}`);
    }
  }, [
    sessionInfo,
    completeStage1Mutation,
    completeStage2Mutation,
    completeStage3Mutation,
    completeOrderMutation,
  ]);

  // Скасування поточного замовлення
  const cancelCurrentOrder = useCallback(() => {
    if (sessionInfo.sessionId) {
      cancelOrderMutation.mutate({ sessionId: sessionInfo.sessionId });
    }
  }, [sessionInfo.sessionId, cancelOrderMutation]);

  // ========== 5. ЕФЕКТИ ==========

  // Автоматична ініціалізація при першому завантаженні
  useEffect(() => {
    if (!sessionInfo.isInitialized) {
      initializeOrderWizard();
    }
  }, [sessionInfo.isInitialized, initializeOrderWizard]);

  // Автоматичне оновлення активності при зміні етапу
  useEffect(() => {
    updateLastActiveTime();
  }, [sessionInfo.currentStage, updateLastActiveTime]);

  // ========== 6. COMPUTED VALUES ==========

  // Стани завантаження
  const loading = useMemo(
    () => ({
      isStarting: startOrderWizardMutation.isPending,
      isCompletingStage1: completeStage1Mutation.isPending,
      isCompletingStage2: completeStage2Mutation.isPending,
      isCompletingStage3: completeStage3Mutation.isPending,
      isCompletingOrder: completeOrderMutation.isPending,
      isCancelling: cancelOrderMutation.isPending,
      isAnyLoading:
        startOrderWizardMutation.isPending ||
        completeStage1Mutation.isPending ||
        completeStage2Mutation.isPending ||
        completeStage3Mutation.isPending ||
        completeOrderMutation.isPending ||
        cancelOrderMutation.isPending,
    }),
    [
      startOrderWizardMutation.isPending,
      completeStage1Mutation.isPending,
      completeStage2Mutation.isPending,
      completeStage3Mutation.isPending,
      completeOrderMutation.isPending,
      cancelOrderMutation.isPending,
    ]
  );

  // Помилки
  const errors = useMemo(
    () => ({
      startError: startOrderWizardMutation.error,
      stage1Error: completeStage1Mutation.error,
      stage2Error: completeStage2Mutation.error,
      stage3Error: completeStage3Mutation.error,
      orderError: completeOrderMutation.error,
      cancelError: cancelOrderMutation.error,
      hasAnyError: Boolean(
        startOrderWizardMutation.error ||
          completeStage1Mutation.error ||
          completeStage2Mutation.error ||
          completeStage3Mutation.error ||
          completeOrderMutation.error ||
          cancelOrderMutation.error
      ),
    }),
    [
      startOrderWizardMutation.error,
      completeStage1Mutation.error,
      completeStage2Mutation.error,
      completeStage3Mutation.error,
      completeOrderMutation.error,
      cancelOrderMutation.error,
    ]
  );

  // Стан готовності
  const readiness = useMemo(
    () => ({
      canStartNewOrder: !sessionInfo.isWizardStarted && wizardSystem.system.isHealthy,
      canNavigateToStage: (stage: number) => navigationState.canProceedToStage(stage),
      canCompleteCurrentStage: sessionInfo.isWizardStarted && !loading.isAnyLoading,
      canCancelOrder: sessionInfo.isWizardStarted && !loading.isAnyLoading,
      isOrderComplete: navigationState.isStageCompleted(4),
    }),
    [sessionInfo, navigationState, wizardSystem.system, loading]
  );

  // ========== 7. ГРУПУВАННЯ РЕЗУЛЬТАТУ ==========
  return {
    // UI стан
    ui: {
      ...sessionInfo,
      ...navigationState,
      isInitialized: sessionInfo.isInitialized,
      isSystemHealthy: wizardSystem.system.isHealthy,
      isSystemReady: wizardSystem.system.systemReady,
    },

    // API дані
    data: {
      systemHealth: wizardSystem.data.health,
      startResponse: startOrderWizardMutation.data,
      stage1Response: completeStage1Mutation.data,
      stage2Response: completeStage2Mutation.data,
      stage3Response: completeStage3Mutation.data,
      orderResponse: completeOrderMutation.data,
    },

    // Стани завантаження
    loading,

    // Помилки
    errors,

    // Стан готовності
    readiness,

    // Дії
    actions: {
      // Основні дії
      initializeOrderWizard,
      startNewOrder,
      completeCurrentStage,
      cancelCurrentOrder,

      // Навігація
      navigateToStage,
      setCurrentStage,

      // Утиліти
      resetWizard,
      toggleDebugMode,
    },

    // Системна інформація
    system: {
      ...wizardSystem.system,
      config: ORDER_WIZARD_CONFIG,
    },

    // Debug інформація (тільки в розробці)
    debug: debugInfo.isDebugMode
      ? {
          ...debugInfo,
          wizardSystem: wizardSystem,
        }
      : undefined,
  };
};

// ========== 8. ЕКСПОРТ ТИПУ ==========
export type UseOrderWizardMainReturn = ReturnType<typeof useOrderWizardMain>;
