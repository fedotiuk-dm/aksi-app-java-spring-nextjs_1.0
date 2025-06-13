// 🔥 ЕТАП 3: КОМПОЗИЦІЙНИЙ ХУК - wizard/main domain
// Об'єднання готових Orval хуків з UI станом

import { useMemo, useCallback, useEffect } from 'react';

import {
  useOrderWizardStart,
  useOrderWizardGetCurrentState,
  useOrderWizardGetSessionInfo,
  useOrderWizardGetStageStatus,
  useOrderWizardGetStagesStatus,
  useOrderWizardCompleteStage1,
  useOrderWizardCompleteStage2,
  useOrderWizardCompleteStage3,
  useOrderWizardCompleteOrder,
  useOrderWizardGoBack,
  useOrderWizardCancelOrder,
  useOrderWizardHealth,
  // Типи з Orval schemas
  type OrderWizardResponseDTO,
  type StageStatus,
  type StagesStatus,
  type HealthStatus,
  type OrderWizardGetSessionInfo200,
} from '@/shared/api/generated/main';

import { useMainStore, mainSelectors } from '../store/main.store';
import { mapApiStateToStage, type WizardStage } from '../utils/wizard-stage-mapping';
import { useClearWizardMemory } from '../../shared';

// Імпортуємо Stage1 стор для очищення
import { useStage1Store } from '../../stage1/store/stage1.store';

// ✅ Готові React Query хуки з Orval

// 🎯 Типи для композиційного хука
interface UseMainReturn {
  // UI стан
  ui: {
    sessionId: string | null;
    isInitializing: boolean;
    showDebugMode: boolean;
    isCompact: boolean;
    hasSession: boolean;
    isReady: boolean;
  };

  // API дані
  data: {
    currentState: OrderWizardResponseDTO | undefined;
    sessionInfo: OrderWizardGetSessionInfo200 | undefined;
    stageStatus: StageStatus | undefined;
    stagesStatus: StagesStatus | undefined;
    healthStatus: HealthStatus | undefined;
  };

  // Computed дані з API
  computed: {
    currentStage: WizardStage;
    canStart: boolean;
    canComplete: boolean;
    canGoBack: boolean;
    canCancel: boolean;
  };

  // Стани завантаження
  loading: {
    isLoadingState: boolean;
    isLoadingSession: boolean;
    isStarting: boolean;
    isCompleting: boolean;
    isNavigating: boolean;
  };

  // Дії
  actions: {
    // Початок сесії
    startWizard: () => void;

    // Завершення етапів
    completeStage1: () => void;
    completeStage2: () => void;
    completeStage3: () => void;
    completeOrder: () => void;

    // Навігація
    goBack: () => void;
    cancelOrder: () => void;

    // UI контроли
    toggleDebugMode: () => void;
    toggleCompactMode: () => void;

    // Скидання
    reset: () => void;
    clearMemory: () => void;
  };
}

export const useMain = (): UseMainReturn => {
  // Хук для очищення всієї пам'яті
  const { clearAllMemory: clearMemory } = useClearWizardMemory();

  // 1. UI стан з Zustand
  const {
    sessionId,
    isInitializing,
    showDebugMode,
    isCompact,
    setSessionId,
    setInitializing,
    toggleDebugMode,
    toggleCompactMode,
    reset,
  } = useMainStore();

  // Stage1 стор для очищення
  const { reset: resetStage1 } = useStage1Store();

  // 2. Обчислені селектори
  const hasSession = mainSelectors.hasSession(useMainStore.getState());
  const isReady = mainSelectors.isReady(useMainStore.getState());

  // 3. API хуки з Orval - тільки якщо є sessionId
  const currentStateQuery = useOrderWizardGetCurrentState(sessionId || '', {
    query: { enabled: !!sessionId },
  });

  const sessionInfoQuery = useOrderWizardGetSessionInfo(sessionId || '', {
    query: { enabled: !!sessionId },
  });

  const stageStatusQuery = useOrderWizardGetStageStatus(1, {
    query: { enabled: !!sessionId },
  });

  const stagesStatusQuery = useOrderWizardGetStagesStatus({
    query: { enabled: !!sessionId },
  });

  const healthQuery = useOrderWizardHealth();

  // 4. Мутації
  const startMutation = useOrderWizardStart({
    mutation: {
      onSuccess: (data) => {
        console.log('✅ Order Wizard запущено успішно:', data);
        setSessionId(data.sessionId || null);
        setInitializing(false);
      },
      onError: (error) => {
        console.error('❌ Помилка запуску Order Wizard:', error);
        setInitializing(false);
      },
    },
  });

  // Використовуємо новий спеціалізований хук для очищення пам'яті

  const completeStage1Mutation = useOrderWizardCompleteStage1();
  const completeStage2Mutation = useOrderWizardCompleteStage2();
  const completeStage3Mutation = useOrderWizardCompleteStage3();
  const completeOrderMutation = useOrderWizardCompleteOrder();
  const goBackMutation = useOrderWizardGoBack();
  const cancelOrderMutation = useOrderWizardCancelOrder();

  // 5. Обробники подій
  const handleStartWizard = useCallback(async () => {
    console.log('🚀 Запуск нового Order Wizard...');

    setInitializing(true);

    try {
      // Очищаємо всю пам'ять перед запуском нового візарда
      // Це вирішує проблему з валідацією sessionId після перезавантаження
      console.log("🧹 Очищення пам'яті перед запуском...");
      await clearMemory();

      // Очищаємо також Stage1 стор
      resetStage1();

      console.log("✅ Пам'ять очищена, чекаємо 1 секунду для стабілізації...");

      // Додаємо затримку для стабілізації backend сесій
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('✅ Затримка завершена, запускаємо новий візард...');

      // Запускаємо візард
      startMutation.mutate();
    } catch (error) {
      console.error("❌ Помилка при очищенні пам'яті:", error);
      setInitializing(false);
    }
  }, [startMutation, setInitializing, clearMemory, resetStage1]);

  const handleCompleteStage1 = useCallback(() => {
    if (!sessionId) return;
    completeStage1Mutation.mutate({ sessionId });
  }, [sessionId, completeStage1Mutation]);

  const handleCompleteStage2 = useCallback(() => {
    if (!sessionId) return;
    completeStage2Mutation.mutate({ sessionId });
  }, [sessionId, completeStage2Mutation]);

  const handleCompleteStage3 = useCallback(() => {
    if (!sessionId) return;
    completeStage3Mutation.mutate({ sessionId });
  }, [sessionId, completeStage3Mutation]);

  const handleCompleteOrder = useCallback(() => {
    if (!sessionId) return;
    completeOrderMutation.mutate({ sessionId });
  }, [sessionId, completeOrderMutation]);

  const handleGoBack = useCallback(() => {
    if (!sessionId) return;
    goBackMutation.mutate({ sessionId });
  }, [sessionId, goBackMutation]);

  const handleCancelOrder = useCallback(() => {
    if (!sessionId) return;
    cancelOrderMutation.mutate({ sessionId });
  }, [sessionId, cancelOrderMutation]);

  // 🔄 Автоматичне очищення при завантаженні компонента
  useEffect(() => {
    const clearOnMount = async () => {
      // Перевіряємо чи є старий sessionId в localStorage без валідної сесії
      const storedSessionId = localStorage.getItem('wizard-session');
      if (storedSessionId) {
        console.log("🧹 Виявлено старий sessionId при завантаженні, очищуємо пам'ять...");
        await clearMemory();
      }
    };

    clearOnMount();
  }, [clearMemory]); // Додаємо clearMemory до залежностей

  // 6. Групування результатів з useMemo для оптимізації
  return useMemo(
    () => ({
      ui: {
        sessionId,
        isInitializing,
        showDebugMode,
        isCompact,
        hasSession,
        isReady,
      },
      data: {
        currentState: currentStateQuery.data,
        sessionInfo: sessionInfoQuery.data,
        stageStatus: stageStatusQuery.data,
        stagesStatus: stagesStatusQuery.data,
        healthStatus: healthQuery.data,
      },
      loading: {
        isLoadingState: currentStateQuery.isLoading,
        isLoadingSession: sessionInfoQuery.isLoading,
        isStarting: startMutation.isPending,
        isCompleting:
          completeStage1Mutation.isPending ||
          completeStage2Mutation.isPending ||
          completeStage3Mutation.isPending ||
          completeOrderMutation.isPending,
        isNavigating: goBackMutation.isPending || cancelOrderMutation.isPending,
      },
      actions: {
        startWizard: handleStartWizard,
        completeStage1: handleCompleteStage1,
        completeStage2: handleCompleteStage2,
        completeStage3: handleCompleteStage3,
        completeOrder: handleCompleteOrder,
        goBack: handleGoBack,
        cancelOrder: handleCancelOrder,
        toggleDebugMode,
        toggleCompactMode,
        reset,
        clearMemory,
      },
      computed: {
        currentStage: mapApiStateToStage(currentStateQuery.data?.currentState),
        canStart: !hasSession && !isInitializing && !(currentStateQuery.data?.success === true),
        canComplete: hasSession && isReady && currentStateQuery.data?.success === true,
        canGoBack:
          hasSession && !goBackMutation.isPending && currentStateQuery.data?.success === true,
        canCancel:
          hasSession && !cancelOrderMutation.isPending && currentStateQuery.data?.success === true,
      },
    }),
    [
      sessionId,
      isInitializing,
      showDebugMode,
      isCompact,
      hasSession,
      isReady,
      currentStateQuery.data,
      currentStateQuery.isLoading,
      sessionInfoQuery.data,
      sessionInfoQuery.isLoading,
      stageStatusQuery.data,
      stagesStatusQuery.data,
      healthQuery.data,
      startMutation.isPending,
      completeStage1Mutation.isPending,
      completeStage2Mutation.isPending,
      completeStage3Mutation.isPending,
      completeOrderMutation.isPending,
      goBackMutation.isPending,
      cancelOrderMutation.isPending,
      handleStartWizard,
      handleCompleteStage1,
      handleCompleteStage2,
      handleCompleteStage3,
      handleCompleteOrder,
      handleGoBack,
      handleCancelOrder,
      toggleDebugMode,
      toggleCompactMode,
      reset,
      clearMemory,
    ]
  );
};

export type { UseMainReturn };
