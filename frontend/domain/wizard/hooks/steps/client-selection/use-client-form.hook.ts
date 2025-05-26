/**
 * @fileoverview Хук форми створення клієнтів (DDD архітектура)
 * @module domain/wizard/hooks/steps/client-selection
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import {
  clientSearchService,
  clientCreationService,
  clientDataSchema,
  type ClientData,
  type CreateClientRequest,
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
      const phoneResult = await clientSearchService.checkClientExistsByPhone(formData.phone);

      if (phoneResult.success && phoneResult.data) {
        setExistingClient(true);
        addWarning('Клієнт з таким телефоном вже існує');
        return;
      }

      if (formData.email) {
        const emailResult = await clientSearchService.checkClientExistsByEmail(formData.email);

        if (emailResult.success && emailResult.data) {
          setExistingClient(true);
          addWarning('Клієнт з таким email вже існує');
          return;
        }
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
        const request: CreateClientRequest = {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          address: data.address,
          contactMethods: data.contactMethods || [ContactMethod.PHONE],
          informationSource: data.informationSource || InformationSource.OTHER,
          informationSourceOther: data.informationSourceOther,
        };

        const result = await clientCreationService.createClient(request);

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
        const result = await clientCreationService.updateClient(id, data);

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
