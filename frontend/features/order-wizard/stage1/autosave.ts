'use client';

import { useEffect, useCallback } from 'react';
import { type Control, useWatch } from 'react-hook-form';
import {
  useStage1InitializeClientSearch,
  useStage1SearchClients,
  useStage1SelectClient,
  useStage1CreateClient,
  useStage1UpdateClientData,
  useStage1InitializeBasicOrder,
  useStage1GetBranchesForSession,
  useStage1SelectBranch,
  useStage1GenerateReceiptNumber,
  useStage1SetUniqueTag,
  useStage1UpdateBasicOrder,
  useStage1CompleteBasicOrder,
  type ClientResponse,
  type BranchLocationDTO,
} from '@/shared/api/generated/stage1';
import { useOrderWizardStore } from './useOrderWizardStore';
import { WizardFormData } from './WizardProvider';
import { useDebounceSearch } from '@/shared/lib/hooks/useDebounce';

// Типи для autosave даних
export interface AutosaveData {
  isLoading: boolean;
  searchResults: ClientResponse[];
  selectedClient: void | undefined;
  branchList: BranchLocationDTO[];
  generatedReceiptNumber: string | undefined;
  completeStage1: () => Promise<unknown>;
  createNewClient: () => Promise<unknown>;
  sessionId: string | null;
}

/**
 * Простий autosave хук без складних залежностей
 */
export const useAutosave = (control: Control<WizardFormData>) => {
  const { sessionId, currentStep } = useOrderWizardStore();

  // Orval мутації та запити
  const initializeSearch = useStage1InitializeClientSearch();
  const searchClients = useStage1SearchClients();
  const selectClient = useStage1SelectClient();
  const createClient = useStage1CreateClient();
  const updateClientData = useStage1UpdateClientData();
  const initializeBasicOrder = useStage1InitializeBasicOrder();
  const getBranches = useStage1GetBranchesForSession(sessionId || '', {
    query: { enabled: !!sessionId && currentStep === 'orderInfo' },
  });
  const selectBranch = useStage1SelectBranch();
  const generateReceiptNumber = useStage1GenerateReceiptNumber();
  const setUniqueTag = useStage1SetUniqueTag();
  const updateBasicOrder = useStage1UpdateBasicOrder();
  const completeBasicOrder = useStage1CompleteBasicOrder();

  // Відстеження змін у формі
  const formData = useWatch({ control });

  // 1. Ініціалізація пошуку клієнтів
  useEffect(() => {
    if (sessionId && currentStep === 'client') {
      initializeSearch.mutate(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, currentStep]);

  // 2. Автопошук клієнтів при зміні пошукового терміну
  const searchTerm = formData.clientData?.searchTerm || '';

  const handleClientSearch = useCallback(
    (term: string) => {
      if (sessionId && term.trim().length >= 2) {
        searchClients.mutate({
          sessionId,
          data: {
            generalSearchTerm: term,
            // Використовуємо тільки загальний пошук, без додаткових полів
          },
        });
      }
    },
    [sessionId, searchClients]
  );

  // Дебаунс пошуку
  useDebounceSearch(searchTerm.trim().length >= 2 ? searchTerm : '', handleClientSearch, 500, 2);

  // 3. Вибір клієнта
  useEffect(() => {
    const selectedClientId = formData.clientData?.selectedClientId;
    if (sessionId && selectedClientId && selectedClientId.trim() !== '') {
      selectClient.mutate({
        sessionId,
        params: { clientId: selectedClientId },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.clientData?.selectedClientId, sessionId]);

  // 4. Оновлення даних клієнта (тільки для НОВОГО клієнта)
  useEffect(() => {
    const clientData = formData.clientData;
    const selectedClientId = formData.clientData?.selectedClientId;

    if (
      sessionId &&
      (!selectedClientId || selectedClientId.trim() === '') &&
      clientData &&
      clientData.firstName &&
      clientData.lastName &&
      clientData.phone
    ) {
      updateClientData.mutate({
        sessionId,
        data: {
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          phone: clientData.phone,
          email: clientData.email,
          address: clientData.address,
          communicationChannels: clientData.communicationChannels,
          informationSource: clientData.informationSource,
          sourceDetails: clientData.sourceDetails,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.clientData, sessionId]);

  // 5. Ініціалізація базового замовлення
  useEffect(() => {
    if (sessionId && currentStep === 'orderInfo') {
      initializeBasicOrder.mutate(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, currentStep]);

  // 6. Вибір філії
  useEffect(() => {
    const branchId = formData.orderData?.selectedBranchId;
    if (sessionId && branchId && branchId.trim() !== '') {
      selectBranch.mutate({
        sessionId,
        params: { branchId },
      });
      // Генеруємо номер квитанції після вибору філії
      generateReceiptNumber.mutate({
        sessionId,
        params: { branchCode: branchId },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.orderData?.selectedBranchId, sessionId]);

  // 7. Введення унікальної мітки
  useEffect(() => {
    const uniqueTag = formData.orderData?.uniqueTag;
    if (sessionId && uniqueTag && uniqueTag.length >= 3) {
      setUniqueTag.mutate({
        sessionId,
        params: { uniqueTag },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.orderData?.uniqueTag, sessionId]);

  // Функції для UI
  const completeStage1Fn = async () => {
    if (!sessionId) throw new Error('SessionId не знайдено');
    return completeBasicOrder.mutateAsync({ sessionId });
  };

  const createNewClient = async () => {
    if (!sessionId) throw new Error('SessionId не знайдено');
    const clientData = formData.clientData;
    if (!clientData?.firstName || !clientData?.lastName || !clientData?.phone) {
      throw new Error("Заповніть обов'язкові поля");
    }
    return createClient.mutateAsync({ sessionId });
  };

  // Повертаємо стан для UI
  return {
    isLoading:
      searchClients.isPending ||
      selectClient.isPending ||
      createClient.isPending ||
      getBranches.isLoading,
    searchResults: searchClients.data?.clients || [],
    selectedClient: selectClient.data,
    branchList: getBranches.data || [],
    generatedReceiptNumber: generateReceiptNumber.data,
    completeStage1: completeStage1Fn,
    createNewClient,
    sessionId,
  };
};
