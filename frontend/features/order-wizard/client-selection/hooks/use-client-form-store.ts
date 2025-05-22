import { useCallback } from 'react';

import { ClientResponse } from '@/lib/api';

import { useClientStore } from '../model';
import { ClientFormType } from './use-client-form-types';

/**
 * Тип для результату API запиту з можливістю помилки
 */
export interface ApiResult {
  client: ClientResponse | null;
  errors: ValidationErrors | null;
}

// Для сумісності з існуючим кодом
type ValidationErrors = Record<string, string>; // Або імпортуйте тип з файлу типів

interface UseClientFormStoreProps {
  type: ClientFormType;
  onSuccess?: (client: ClientResponse) => void;
}

/**
 * Хук для взаємодії з глобальним стором
 * Відповідає за синхронізацію стану форми з Zustand-стором
 */
export const useClientFormStore = ({ type, onSuccess }: UseClientFormStoreProps) => {
  const {
    selectedClient,
    newClient,
    editClient,
    createClient: storeCreateClient,
    saveEditedClient: storeSaveEditedClient,
    startEditingClient,
    cancelEditing,
    updateNewClientField,
    updateEditClientField,
  } = useClientStore();

  /**
   * Обробник для створення клієнта
   */
  const handleCreateClient = useCallback(async () => {
    // Виклик акції з стору
    const result = await storeCreateClient();

    // Створюємо типізований результат
    const apiResult: ApiResult = {
      client: result ? result.client || null : null,
      errors: result && result.errors ? result.errors : null,
    };

    if (apiResult.client && !apiResult.errors && onSuccess) {
      onSuccess(apiResult.client);
    }

    return apiResult;
  }, [storeCreateClient, onSuccess]);

  /**
   * Обробник для оновлення клієнта
   */
  const handleUpdateClient = useCallback(async () => {
    // Перевіряємо, що є обраний клієнт і ID
    if (!selectedClient?.id) {
      return { errors: { general: 'Не вибрано клієнта для редагування' }, client: null };
    }

    // Виклик акції з стору
    const result = await storeSaveEditedClient();

    // Створюємо типізований результат
    const apiResult: ApiResult = {
      client: result ? result.client || null : null,
      errors: result && result.errors ? result.errors : null,
    };

    if (apiResult.client && !apiResult.errors && onSuccess) {
      onSuccess(apiResult.client);
    }

    return apiResult;
  }, [selectedClient, storeSaveEditedClient, onSuccess]);

  /**
   * Обробник для початку редагування клієнта
   */
  const handleStartEditingClient = useCallback(
    (client: ClientResponse) => {
      startEditingClient(client);
    },
    [startEditingClient]
  );

  /**
   * Обробник для скасування редагування клієнта
   */
  const handleCancelEditing = useCallback(() => {
    cancelEditing();
  }, [cancelEditing]);

  return {
    // Дані
    newClient,
    editClient,
    selectedClient,

    // Оновлення полів
    updateNewClientField,
    updateEditClientField,

    // Обробники дій
    handleCreateClient,
    handleUpdateClient,
    handleStartEditingClient,
    handleCancelEditing,

    // Тип форми
    type,
  };
};
