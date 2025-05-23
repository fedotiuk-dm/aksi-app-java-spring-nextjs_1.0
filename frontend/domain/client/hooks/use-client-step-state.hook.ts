import { useCallback, useMemo } from 'react';

import { useClientSelection } from './use-client-selection.hook';
import { useClientDomainStore } from '../store/client-store';
import { ClientMode } from '../types/client-enums';

/**
 * Хук для управління станом CLIENT_SELECTION кроку
 *
 * SOLID принципи:
 * - Single Responsibility: тільки управління станом кроку
 * - Open/Closed: розширюється через додаткові computed properties
 * - Dependency Inversion: залежить від domain store абстракцій
 */
export const useClientStepState = () => {
  const { mode, isGlobalLoading, globalError, setMode } = useClientDomainStore();

  const { selectedClient } = useClientSelection();

  /**
   * Перевірка завершеності кроку
   */
  const isStepComplete = useMemo(() => {
    return Boolean(selectedClient);
  }, [selectedClient]);

  /**
   * Перемикання режимів
   */
  const switchToMode = useCallback(
    (newMode: ClientMode) => {
      setMode(newMode);
    },
    [setMode]
  );

  /**
   * Швидкі перемикачі режимів
   */
  const switchToCreate = useCallback(() => switchToMode(ClientMode.CREATE), [switchToMode]);
  const switchToEdit = useCallback(() => switchToMode(ClientMode.EDIT), [switchToMode]);
  const switchToSelect = useCallback(() => switchToMode(ClientMode.SELECT), [switchToMode]);

  /**
   * Computed стан для UI
   */
  const stepInfo = useMemo(
    () => ({
      hasSelectedClient: Boolean(selectedClient),
      selectedClientName: selectedClient
        ? `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim()
        : undefined,
      selectedClientPhone: selectedClient?.phone,
      canProceed: isStepComplete,
    }),
    [selectedClient, isStepComplete]
  );

  return {
    // Основний стан
    mode,
    isLoading: isGlobalLoading,
    error: globalError,
    isStepComplete,
    selectedClient,

    // Computed стан
    stepInfo,

    // Дії управління режимом
    switchToMode,
    switchToCreate,
    switchToEdit,
    switchToSelect,
  };
};
