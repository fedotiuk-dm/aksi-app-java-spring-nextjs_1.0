// 🎯 СПРОЩЕНИЙ WORKFLOW ХУК для Stage1 Order Wizard
// Два етапи: 1) Вибір/створення клієнта, 2) Вибір філії та створення ордера

import { useCallback, useMemo } from 'react';

import { useBranchSelection } from './use-branch-selection.hook';
import { useClientSelection } from './use-client-selection.hook';
import { useMainStore } from '../../main/store/main.store';
import {
  STAGE1_SUBSTEPS,
  getSubstepProgress,
  canNavigateToSubstep,
  type Stage1Substep,
} from '../utils/stage1-mapping';

/**
 * 🎯 Спрощений workflow хук для Stage1
 *
 * Функціональність:
 * - Два етапи: вибір клієнта → вибір філії
 * - Автоматичне створення ордера після вибору філії
 * - Спрощена навігація між етапами
 */
export const useStage1SimplifiedWorkflow = () => {
  // 1. Композиційні хуки
  const clientSelection = useClientSelection();
  const branchSelection = useBranchSelection();

  // 2. UI стан з Zustand
  const sessionId = useMainStore((state) => state.sessionId);

  // 3. Поточний активний підетап
  const currentSubstep = useMemo((): Stage1Substep => {
    // Якщо клієнт обраний, переходимо до вибору філії
    if (clientSelection.computed.hasSelectedClient) {
      return STAGE1_SUBSTEPS.BRANCH_SELECTION;
    }
    // Інакше залишаємося на вибору клієнта
    return STAGE1_SUBSTEPS.CLIENT_SELECTION;
  }, [clientSelection.computed.hasSelectedClient]);

  // 4. Обробники навігації
  const handleNavigateToSubstep = useCallback(
    (targetSubstep: Stage1Substep) => {
      if (!canNavigateToSubstep(targetSubstep, currentSubstep)) {
        console.warn('⚠️ Неможливо перейти до підетапу:', targetSubstep);
        return;
      }

      // Навігація відбувається автоматично на основі стану
      if (targetSubstep === STAGE1_SUBSTEPS.CLIENT_SELECTION) {
        // Повернення до вибору клієнта - очищуємо вибір
        clientSelection.search.actions.clearSearch();
        clientSelection.mode.switchToSearch();
      }
    },
    [currentSubstep, clientSelection.search.actions, clientSelection.mode]
  );

  const handleClientSelected = useCallback(() => {
    // Автоматичний перехід до вибору філії після вибору клієнта
    // Логіка переходу вже в currentSubstep
  }, []);

  const handleOrderCreated = useCallback(() => {
    // Ордер створений - Stage1 завершений
    return branchSelection.computed.isBranchSelectionCompleted;
  }, [branchSelection.computed.isBranchSelectionCompleted]);

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
      canGoNext: false, // Навігація автоматична
      canGoPrevious: currentSubstep === STAGE1_SUBSTEPS.BRANCH_SELECTION,
      isFirstSubstep: currentIndex === 0,
      isLastSubstep: currentIndex === substeps.length - 1,

      // Готовність підетапів
      isClientSelectionCompleted: clientSelection.computed.isClientSelectionCompleted,
      isBranchSelectionCompleted: branchSelection.computed.isBranchSelectionCompleted,

      // Загальна готовність Stage1
      isStage1Ready:
        !!sessionId &&
        clientSelection.computed.hasSelectedClient &&
        branchSelection.computed.canCreateOrder,

      // Стани завантаження
      isAnyLoading: clientSelection.loading.isAnyLoading || branchSelection.loading.isAnyLoading,
    };
  }, [
    currentSubstep,
    sessionId,
    clientSelection.computed.isClientSelectionCompleted,
    clientSelection.computed.hasSelectedClient,
    clientSelection.loading.isAnyLoading,
    branchSelection.computed.isBranchSelectionCompleted,
    branchSelection.computed.canCreateOrder,
    branchSelection.loading.isAnyLoading,
  ]);

  // 6. Групування повернення
  return {
    // Підетапи
    substeps: {
      clientSelection,
      branchSelection,
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
      goBackToClientSelection: () => handleNavigateToSubstep(STAGE1_SUBSTEPS.CLIENT_SELECTION),
    },

    // Стани готовності
    readiness: {
      isClientSelectionCompleted: computed.isClientSelectionCompleted,
      isBranchSelectionCompleted: computed.isBranchSelectionCompleted,
      isStage1Ready: computed.isStage1Ready,
    },

    // Загальні стани
    loading: {
      isAnyLoading: computed.isAnyLoading,
    },

    // Обробники подій
    handlers: {
      onClientSelected: handleClientSelected,
      onOrderCreated: handleOrderCreated,
    },

    // Computed значення
    computed,

    // Константи
    constants: {
      substeps: STAGE1_SUBSTEPS,
    },
  };
};

export type UseStage1SimplifiedWorkflowReturn = ReturnType<typeof useStage1SimplifiedWorkflow>;
