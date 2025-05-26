/**
 * @fileoverview Хук форми створення клієнтів (DDD архітектура)
 * @module domain/wizard/hooks/steps/client-selection
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import {
  searchClients,
  createNewClient,
  updateExistingClient,
  clientDataSchema,
  type ClientData,
  type ClientSearchResult,
  ContactMethod,
  InformationSource,
} from '../../../services/stage-1-client-and-order-info';
import { useWizardState } from '../../shared';

/**
 * Хук форми створення клієнтів з валідацією
 */
export const useClientForm = (initialData?: Partial<ClientData>) => {
  // === REACT СТАН ===
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [createdClient, setCreatedClient] = useState<ClientSearchResult | null>(null);
  const [existingClient, setExistingClient] = useState<boolean>(false);

  // === WIZARD ІНТЕГРАЦІЯ ===
  const { addError, addWarning, clearErrors, clearWarnings } = useWizardState();

  // === ФОРМА З ZOD ВАЛІДАЦІЄЮ ===
  const formMethods = useForm<ClientData>({
    resolver: zodResolver(clientDataSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      address: initialData?.address || '',
      contactMethods: initialData?.contactMethods || [ContactMethod.PHONE],
      informationSource: initialData?.informationSource || InformationSource.OTHER,
      informationSourceOther: initialData?.informationSourceOther || '',
    },
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // === ПЕРЕВІРКА ІСНУВАННЯ КЛІЄНТА ===
  const checkClientExists = useCallback(async () => {
    const formData = watch();

    if (!formData.phone) {
      return;
    }

    try {
      // Пошук клієнта за телефоном
      const result = await searchClients(formData.phone, 0, 5);

      if (result.success && result.data && result.data.length > 0) {
        setExistingClient(true);
        addWarning('Клієнт з таким телефоном може вже існувати');
        return;
      }

      setExistingClient(false);
      clearWarnings();
    } catch (error) {
      addError(error instanceof Error ? error.message : 'Помилка перевірки клієнта');
    }
  }, [watch, addError, addWarning, clearWarnings]);

  // === СТВОРЕННЯ КЛІЄНТА ===
  const createClient = useCallback(
    async (data: ClientData) => {
      setIsCreating(true);
      clearErrors();

      try {
        const result = await createNewClient(data);

        if (result.success && result.data) {
          setCreatedClient(result.data);
          return { success: true, client: result.data };
        } else {
          addError(result.error || 'Помилка створення клієнта');
          return { success: false };
        }
      } catch (error) {
        addError(error instanceof Error ? error.message : 'Помилка створення клієнта');
        return { success: false };
      } finally {
        setIsCreating(false);
      }
    },
    [addError, clearErrors]
  );

  // === ОНОВЛЕННЯ КЛІЄНТА ===
  const updateClient = useCallback(
    async (id: string, data: Partial<ClientData>) => {
      setIsUpdating(true);
      clearErrors();

      try {
        const result = await updateExistingClient(id, data);

        if (result.success && result.data) {
          setCreatedClient(result.data);
          return { success: true, client: result.data };
        } else {
          addError(result.error || 'Помилка оновлення клієнта');
          return { success: false };
        }
      } catch (error) {
        addError(error instanceof Error ? error.message : 'Помилка оновлення клієнта');
        return { success: false };
      } finally {
        setIsUpdating(false);
      }
    },
    [addError, clearErrors]
  );

  // === МЕТОДИ УПРАВЛІННЯ ФОРМОЮ ===
  const resetForm = useCallback(() => {
    reset();
    setCreatedClient(null);
    setExistingClient(false);
    clearErrors();
    clearWarnings();
  }, [reset, clearErrors, clearWarnings]);

  const submitForm = useCallback(
    (onSubmit: (data: ClientData) => void | Promise<void>) => {
      return handleSubmit(onSubmit);
    },
    [handleSubmit]
  );

  return {
    // Форма
    ...formMethods,

    // Стан
    isCreating,
    isUpdating,
    createdClient,
    existingClient,
    errors,

    // Методи
    createClient,
    updateClient,
    checkClientExists,
    resetForm,
    submitForm,
  };
};
