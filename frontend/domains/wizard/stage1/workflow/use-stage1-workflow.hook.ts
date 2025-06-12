import { useMemo, useCallback } from 'react';

import { useBasicOrderInfo } from '../basic-order-info';
import { useClientCreation } from '../client-creation';
import { useClientSearch } from '../client-search';

// Константи для підетапів
const SUBSTEPS = {
  CLIENT_SEARCH: 'client-search',
  CLIENT_CREATION: 'client-creation',
  BASIC_ORDER_INFO: 'basic-order-info',
} as const;

export const useStage1Workflow = () => {
  // Композиція всіх підетапів Stage1
  const clientSearch = useClientSearch();
  const clientCreation = useClientCreation();
  const basicOrderInfo = useBasicOrderInfo();

  // Визначення поточного активного підетапу
  const currentSubstep = useMemo(() => {
    if (clientSearch.ui.sessionId && !clientSearch.data.selectedClient) {
      return SUBSTEPS.CLIENT_SEARCH;
    }
    if (clientCreation.ui.isFormVisible) {
      return SUBSTEPS.CLIENT_CREATION;
    }
    if (basicOrderInfo.ui.sessionId) {
      return SUBSTEPS.BASIC_ORDER_INFO;
    }
    return SUBSTEPS.CLIENT_SEARCH; // За замовчуванням
  }, [
    clientSearch.ui.sessionId,
    clientSearch.data.selectedClient,
    clientCreation.ui.isFormVisible,
    basicOrderInfo.ui.sessionId,
  ]);

  // Загальний стан завантаження
  const isLoading = useMemo(
    () => ({
      clientSearch: Object.values(clientSearch.loading).some(Boolean),
      clientCreation: Object.values(clientCreation.loading).some(Boolean),
      basicOrderInfo: Object.values(basicOrderInfo.loading).some(Boolean),
      any:
        Object.values(clientSearch.loading).some(Boolean) ||
        Object.values(clientCreation.loading).some(Boolean) ||
        Object.values(basicOrderInfo.loading).some(Boolean),
    }),
    [clientSearch.loading, clientCreation.loading, basicOrderInfo.loading]
  );

  // Прогрес завершення Stage1
  const progress = useMemo(() => {
    let completed = 0;
    let total = 3;

    if (clientSearch.data.selectedClient) completed++;
    if (clientCreation.data.createdClient) completed++;
    if (basicOrderInfo.data.basicOrderData?.complete) completed++;

    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100),
    };
  }, [
    clientSearch.data.selectedClient,
    clientCreation.data.createdClient,
    basicOrderInfo.data.basicOrderData?.complete,
  ]);

  // Навігація між підетапами
  const navigateToSubstep = useCallback(
    (substep: 'client-search' | 'client-creation' | 'basic-order-info') => {
      switch (substep) {
        case SUBSTEPS.CLIENT_SEARCH:
          if (!clientSearch.ui.sessionId) {
            clientSearch.actions.initialize();
          }
          break;
        case SUBSTEPS.CLIENT_CREATION:
          if (!clientCreation.ui.sessionId) {
            clientCreation.actions.initializeNewClient();
          }
          break;
        case SUBSTEPS.BASIC_ORDER_INFO:
          if (!basicOrderInfo.ui.sessionId) {
            basicOrderInfo.actions.initializeBasicOrder();
          }
          break;
      }
    },
    [
      clientSearch.ui.sessionId,
      clientSearch.actions,
      clientCreation.ui.sessionId,
      clientCreation.actions,
      basicOrderInfo.ui.sessionId,
      basicOrderInfo.actions,
    ]
  );

  // Скидання всього стану Stage1
  const resetStage1 = useCallback(() => {
    clientSearch.actions.clearSearch();
    clientCreation.actions.cancelCreation();
    basicOrderInfo.actions.cancelBasicOrder();
  }, [clientSearch.actions, clientCreation.actions, basicOrderInfo.actions]);

  // Перевірка чи можна перейти до Stage2
  const canProceedToStage2 = useMemo(() => {
    return !!(clientSearch.data.selectedClient && basicOrderInfo.data.basicOrderData?.complete);
  }, [clientSearch.data.selectedClient, basicOrderInfo.data.basicOrderData?.complete]);

  return {
    // Підетапи
    substeps: {
      clientSearch,
      clientCreation,
      basicOrderInfo,
    },

    // Стан workflow
    ui: {
      currentSubstep,
      progress,
      canProceedToStage2,
    },

    // Загальні дані
    data: {
      selectedClient: clientSearch.data.selectedClient,
      createdClient: clientCreation.data.createdClient,
      basicOrderData: basicOrderInfo.data.basicOrderData,
    },

    // Загальне завантаження
    loading: isLoading,

    // Дії workflow
    actions: {
      navigateToSubstep,
      resetStage1,
    },
  };
};

export type UseStage1WorkflowReturn = ReturnType<typeof useStage1Workflow>;
