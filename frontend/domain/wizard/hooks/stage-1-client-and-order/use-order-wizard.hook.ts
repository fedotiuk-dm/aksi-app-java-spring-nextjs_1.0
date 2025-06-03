/**
 * @fileoverview Простий хук для Order Wizard
 *
 * Принцип: Spring State Machine керує ВСІМ
 * - Бекенд State Machine: вся бізнес-логіка + стани + дані (клієнти, філії, прайси)
 * - Фронтенд: тільки UI + виклики до Order Wizard API
 * - Ніяких окремих викликів до інших API!
 */

import { useState } from 'react';

import { submitClientData } from '@/shared/api/generated/full';
import {
  useCreateWizard,
  useGetWizardState,
  useExecuteAction,
  useCancelWizard,
  type OrderWizardSessionResponse,
  type ExecuteActionBody,
  type ClientResponse,
} from '@/shared/api/generated/order-wizard';

// Імпорт submitClientData з full API

// Імпорт спеціального API для Stage 1

/**
 * 🎯 Простий хук для Order Wizard
 *
 * Вся логіка в Spring State Machine, фронтенд тільки відображає UI
 */
export function useOrderWizard() {
  // Локальний стан wizard ID
  const [wizardId, setWizardId] = useState<string | null>(null);

  // 🚀 Створення wizard сесії
  const createWizardMutation = useCreateWizard({
    mutation: {
      onSuccess: (data) => {
        console.log('✅ Wizard створено:', data.wizardId);
        if (data.wizardId) {
          setWizardId(data.wizardId);
          console.log('🔧 Wizard ID встановлено в стан:', data.wizardId);
        }
      },
      onError: (error) => {
        console.error('❌ Помилка створення wizard:', error);
      },
    },
  });

  // 📋 Отримання стану wizard (тільки якщо є wizardId)
  const wizardStateQuery = useGetWizardState(wizardId || '', {
    query: {
      enabled: !!wizardId,
      refetchInterval: 5000, // оновлюємо кожні 5 секунд
    },
  });

  // 🔧 Виконання дій в State Machine
  const executeActionMutation = useExecuteAction({
    mutation: {
      onSuccess: (data, variables) => {
        console.log('✅ Дія виконана:', variables.actionName);
        // Оновлюємо стан wizard
        wizardStateQuery.refetch();
      },
      onError: (error, variables) => {
        console.error('❌ Помилка дії:', variables.actionName, error);
      },
    },
  });

  // 🗑️ Скасування wizard
  const cancelWizardMutation = useCancelWizard({
    mutation: {
      onSuccess: () => {
        console.log('✅ Wizard скасовано');
        setWizardId(null);
      },
      onError: (error) => {
        console.error('❌ Помилка скасування:', error);
      },
    },
  });

  /**
   * 🚀 Створити новий wizard
   */
  const createWizard = async (): Promise<OrderWizardSessionResponse> => {
    return createWizardMutation.mutateAsync();
  };

  /**
   * 👤 Вибрати клієнта (використовує спеціальний API для Stage 1)
   */
  const selectClient = async (clientData: ClientResponse) => {
    if (!wizardId) throw new Error('Wizard не створено');

    try {
      // Використовуємо спеціальний API endpoint для збереження клієнта
      const result = await submitClientData(wizardId, clientData);

      console.log('✅ Клієнта успішно збережено:', result);

      // Оновлюємо стан wizard після успішного збереження
      wizardStateQuery.refetch();

      return result;
    } catch (error) {
      console.error('❌ Помилка збереження клієнта:', error);
      throw error;
    }
  };

  /**
   * 📝 Зберегти базову інформацію замовлення (надсилає подію ORDER_INFO_COMPLETED)
   */
  const saveOrderInfo = async (branchId: string, uniqueTag?: string) => {
    if (!wizardId) throw new Error('Wizard не створено');

    const actionData: ExecuteActionBody = {
      orderBasicInfo: { branchId, uniqueTag },
    };

    return executeActionMutation.mutateAsync({
      wizardId,
      actionName: 'ORDER_INFO_COMPLETED',
      data: actionData,
    });
  };

  /**
   * 🗑️ Скасувати wizard
   */
  const cancelWizard = async () => {
    if (!wizardId) return;

    return cancelWizardMutation.mutateAsync({ wizardId });
  };

  // Витягуємо дані зі стану
  const session = wizardStateQuery.data?.session;
  const currentState = session?.currentState;
  const sessionData = wizardStateQuery.data?.data;

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 useOrderWizard return:', {
      wizardId,
      currentState,
      isCreating: createWizardMutation.isPending,
      isLoadingState: wizardStateQuery.isLoading,
      queryEnabled: !!wizardId,
      queryData: wizardStateQuery.data,
    });
  }

  return {
    // Основні дані
    wizardId,
    currentState,
    session,
    sessionData,

    // Методи
    createWizard,
    selectClient,
    saveOrderInfo,
    cancelWizard,

    // Стани завантаження
    isCreating: createWizardMutation.isPending,
    isExecutingAction: executeActionMutation.isPending,
    isCancelling: cancelWizardMutation.isPending,
    isLoadingState: wizardStateQuery.isLoading,

    // Помилки
    createError: createWizardMutation.error,
    actionError: executeActionMutation.error,
    cancelError: cancelWizardMutation.error,
    stateError: wizardStateQuery.error,

    // Утиліти
    refetchState: wizardStateQuery.refetch,
    resetErrors: () => {
      createWizardMutation.reset();
      executeActionMutation.reset();
      cancelWizardMutation.reset();
    },
  };
}

export type OrderWizardHook = ReturnType<typeof useOrderWizard>;
