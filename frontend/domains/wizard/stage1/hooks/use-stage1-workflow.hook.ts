// 🎯 ГОЛОВНИЙ КОМПОЗИЦІЙНИЙ ХУК для Stage1 Order Wizard
// Об'єднує всі підетапи та керує workflow

import { useCallback, useMemo } from 'react';

import { useBasicOrderInfo } from './use-basic-order-info.hook';
import { useClientCreate } from './use-client-create.hook';
import { useClientSearch } from './use-client-search.hook';
import { useMainStore } from '../../main/store/main.store';
import {
  STAGE1_SUBSTEPS,
  getSubstepProgress,
  canNavigateToSubstep,
  type Stage1Substep,
} from '../utils/stage1-mapping';

/**
 * 🎯 Головний хук для Stage1 Order Wizard
 *
 * Функціональність:
 * - Керування workflow між підетапами
 * - Композиція всіх підетапів
 * - Навігація між кроками
 * - Валідація готовності до переходу
 */
export const useStage1Workflow = () => {
  // 1. Підетапи
  const clientSearch = useClientSearch();
  const clientCreate = useClientCreate();
  const basicOrderInfo = useBasicOrderInfo();

  // 2. UI стан з Zustand
  const sessionId = useMainStore((state) => state.sessionId);

  // 3. Поточний активний підетап (визначаємо на основі UI станів)
  const currentSubstep = useMemo((): Stage1Substep => {
    if (clientCreate.ui.isCreateMode) {
      return STAGE1_SUBSTEPS.CLIENT_CREATION;
    }
    if (basicOrderInfo.ui.isBasicOrderInfoMode) {
      return STAGE1_SUBSTEPS.BASIC_ORDER_INFO;
    }
    // За замовчуванням - пошук клієнта
    return STAGE1_SUBSTEPS.CLIENT_SEARCH;
  }, [clientCreate.ui.isCreateMode, basicOrderInfo.ui.isBasicOrderInfoMode]);

  // 4. Обробники навігації
  const handleNavigateToSubstep = useCallback(
    (targetSubstep: Stage1Substep) => {
      if (!canNavigateToSubstep(targetSubstep, currentSubstep)) {
        console.warn('⚠️ Неможливо перейти до підетапу:', targetSubstep);
        return;
      }

      // Закриваємо всі режими
      clientSearch.actions.startSearch();
      clientCreate.actions.cancelCreate();
      basicOrderInfo.actions.cancelBasicOrderInfo();

      // Відкриваємо потрібний режим
      switch (targetSubstep) {
        case STAGE1_SUBSTEPS.CLIENT_SEARCH:
          clientSearch.actions.startSearch();
          break;
        case STAGE1_SUBSTEPS.CLIENT_CREATION:
          clientCreate.actions.startCreate();
          break;
        case STAGE1_SUBSTEPS.BASIC_ORDER_INFO:
          basicOrderInfo.actions.startBasicOrderInfo();
          break;
      }
    },
    [currentSubstep, clientSearch.actions, clientCreate.actions, basicOrderInfo.actions]
  );

  const handleNextSubstep = useCallback(() => {
    const substeps = Object.values(STAGE1_SUBSTEPS);
    const currentIndex = substeps.indexOf(currentSubstep);

    if (currentIndex < substeps.length - 1) {
      const nextSubstep = substeps[currentIndex + 1];
      handleNavigateToSubstep(nextSubstep);
    }
  }, [currentSubstep, handleNavigateToSubstep]);

  const handlePreviousSubstep = useCallback(() => {
    const substeps = Object.values(STAGE1_SUBSTEPS);
    const currentIndex = substeps.indexOf(currentSubstep);

    if (currentIndex > 0) {
      const previousSubstep = substeps[currentIndex - 1];
      handleNavigateToSubstep(previousSubstep);
    }
  }, [currentSubstep, handleNavigateToSubstep]);

  // 5. Computed значення для workflow
  const computed = useMemo(() => {
    const substeps = Object.values(STAGE1_SUBSTEPS);
    const currentIndex = substeps.indexOf(currentSubstep);

    return {
      // Поточний стан
      currentSubstep,
      currentSubstepIndex: currentIndex,
      totalSubsteps: substeps.length,
      progress: getSubstepProgress(currentSubstep),

      // Навігація
      canGoNext: currentIndex < substeps.length - 1,
      canGoPrevious: currentIndex > 0,
      isFirstSubstep: currentIndex === 0,
      isLastSubstep: currentIndex === substeps.length - 1,

      // Готовність підетапів
      isClientSearchCompleted: !!clientSearch.computed.selectedClient,
      isClientCreateCompleted:
        clientCreate.computed.isFormValid && !clientCreate.loading.isCreating,
      isBasicOrderInfoCompleted:
        basicOrderInfo.computed.isFormValid && !basicOrderInfo.loading.isUpdating,

      // Загальна готовність Stage1
      isStage1Ready:
        !!sessionId &&
        !!clientSearch.computed.selectedClient &&
        !!basicOrderInfo.computed.selectedBranch &&
        !!basicOrderInfo.computed.hasUniqueTag &&
        !!basicOrderInfo.computed.hasReceiptNumber,

      // Стани завантаження
      isAnyLoading:
        clientSearch.loading.isSearching ||
        clientCreate.loading.isCreating ||
        basicOrderInfo.loading.isUpdating,
    };
  }, [
    currentSubstep,
    sessionId,
    clientSearch.computed.selectedClient,
    clientCreate.computed.isFormValid,
    clientCreate.loading.isCreating,
    basicOrderInfo.computed.isFormValid,
    basicOrderInfo.computed.selectedBranch,
    basicOrderInfo.computed.hasUniqueTag,
    basicOrderInfo.computed.hasReceiptNumber,
    basicOrderInfo.loading.isUpdating,
    clientSearch.loading.isSearching,
  ]);

  // 6. Групування повернення
  return {
    // Підетапи
    substeps: {
      clientSearch,
      clientCreate,
      basicOrderInfo,
    },

    // Workflow стан
    workflow: {
      currentSubstep: computed.currentSubstep,
      currentIndex: computed.currentSubstepIndex,
      totalSubsteps: computed.totalSubsteps,
      progress: computed.progress,
    },

    // Навігація
    navigation: {
      canGoNext: computed.canGoNext,
      canGoPrevious: computed.canGoPrevious,
      isFirstSubstep: computed.isFirstSubstep,
      isLastSubstep: computed.isLastSubstep,
      navigateToSubstep: handleNavigateToSubstep,
      nextSubstep: handleNextSubstep,
      previousSubstep: handlePreviousSubstep,
    },

    // Стани готовності
    readiness: {
      isClientSearchCompleted: computed.isClientSearchCompleted,
      isClientCreateCompleted: computed.isClientCreateCompleted,
      isBasicOrderInfoCompleted: computed.isBasicOrderInfoCompleted,
      isStage1Ready: computed.isStage1Ready,
    },

    // Загальні стани
    loading: {
      isAnyLoading: computed.isAnyLoading,
    },

    // Computed значення
    computed,

    // Константи
    constants: {
      substeps: STAGE1_SUBSTEPS,
    },
  };
};

export type UseStage1WorkflowReturn = ReturnType<typeof useStage1Workflow>;
