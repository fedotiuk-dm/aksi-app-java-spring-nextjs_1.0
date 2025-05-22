import { useCallback } from 'react';

import { ClientResponse } from '@/lib/api';

import { useClientStore } from '../model';
import { CreateClient, EditClient } from '../schemas';
import { useClientFormBase } from './use-client-form-base';
import { UseClientFormProps } from './use-client-form-types';
import { useClientMutations } from './use-client-mutations';

/**
 * Основний хук для роботи з формою клієнта
 * Об'єднує всі частини для роботи з формою клієнта
 */
export const useClientForm = ({ type = 'create', onSuccess }: UseClientFormProps = {}) => {
  const {
    selectedClient,
    newClient,
    editClient,
    createClient: storeCreateClient,
    saveEditedClient: storeSaveEditedClient,
    startEditingClient,
    cancelEditing,
  } = useClientStore();

  // Базовий хук для роботи з формою
  const {
    form,
    error,
    setError,
    isSubmitting,
    setIsSubmitting,
    handleFieldChange,
    getValidationErrors,
    showSourceDetails,
  } = useClientFormBase({ type });

  // Хук для роботи з API
  const {
    createClient: apiCreateClient,
    updateClient: apiUpdateClient,
    isCreating,
    isUpdating,
  } = useClientMutations();

  // Обробник для створення клієнта
  const handleCreateClient = useCallback(
    async (data: any) => {
      // Заповнюємо поля newClient за допомогою handleFieldChange
      Object.entries(data).forEach(([key, value]) => {
        if (key in newClient) {
          handleFieldChange(key, value);
        }
      });

      // Викликаємо createClient з стору та API
      storeCreateClient();
      const result = await apiCreateClient(data as CreateClient);

      if (result.error) {
        throw new Error(result.error);
      }

      if (onSuccess && result.client) {
        onSuccess(result.client);
      }
    },
    [newClient, storeCreateClient, apiCreateClient, handleFieldChange, onSuccess]
  );

  // Обробник для оновлення клієнта
  const handleUpdateClient = useCallback(
    async (data: any) => {
      // Заповнюємо поля editClient за допомогою handleFieldChange
      Object.entries(data).forEach(([key, value]) => {
        if (key in editClient) {
          handleFieldChange(key, value);
        }
      });

      // Перевіряємо, що є обраний клієнт і ID
      if (!selectedClient?.id) {
        throw new Error('Не вибрано клієнта для редагування');
      }

      // Викликаємо saveEditedClient з стору та API
      storeSaveEditedClient();
      const result = await apiUpdateClient(data as EditClient, selectedClient.id);

      if (result.error) {
        throw new Error(result.error);
      }

      if (onSuccess && result.client) {
        onSuccess(result.client);
      }
    },
    [
      editClient,
      selectedClient,
      storeSaveEditedClient,
      apiUpdateClient,
      handleFieldChange,
      onSuccess,
    ]
  );

  // Обробник для створення клієнта з простої форми
  const handleSimpleCreate = useCallback(
    async (data: any) => {
      // Для спрощеної форми - заповнюємо основні поля ручно
      handleFieldChange('firstName', data.firstName);
      handleFieldChange('lastName', data.lastName);
      handleFieldChange('phone', data.phone);

      // Створюємо базовий запит з основними полями для мутації
      const createData: CreateClient = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: undefined,
        address: undefined,
        communicationChannels: ['PHONE'],
        source: [], // Використовуємо порожній масив замість undefined
        sourceDetails: undefined,
      };

      // Викликаємо createClient та API
      storeCreateClient();
      const result = await apiCreateClient(createData);

      if (result.error) {
        throw new Error(result.error);
      }

      if (onSuccess && result.client) {
        onSuccess(result.client);
      }
    },
    [storeCreateClient, apiCreateClient, handleFieldChange, onSuccess]
  );

  // Обробник відправки форми
  const handleSubmit = useCallback(async () => {
    try {
      setError(null);
      setIsSubmitting(true);

      const data = form.getValues();

      // Викликаємо відповідний обробник в залежності від типу форми
      if (type === 'create') {
        await handleCreateClient(data);
      } else if (type === 'edit') {
        await handleUpdateClient(data);
      } else {
        await handleSimpleCreate(data);
      }
    } catch (err) {
      console.error('Помилка при збереженні клієнта:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Помилка при збереженні даних клієнта. Спробуйте знову.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    form,
    type,
    handleCreateClient,
    handleUpdateClient,
    handleSimpleCreate,
    setError,
    setIsSubmitting,
  ]);

  return {
    form,
    isSubmitting: isSubmitting || isCreating || isUpdating,
    error,
    onSubmit: form.handleSubmit(handleSubmit),
    handleFieldChange,
    startEditingClient,
    cancelEditing,
    selectedClient,
    editClient,
    newClient,
    getValidationErrors,
    showSourceDetails,
    setError,
  };
};
