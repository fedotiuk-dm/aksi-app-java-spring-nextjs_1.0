/**
 * @fileoverview Хук форми створення клієнтів (DDD архітектура)
 * @module domain/wizard/hooks/steps/client-selection
 */

import { useState, useCallback } from 'react';
import { z } from 'zod';

import {
  nameSchema,
  phoneSchema,
  emailSchema,
  addressSchema,
} from '../../../schemas/wizard-client-fields.schemas';
import { clientCreationService, clientExistenceService } from '../../../services/client';
import { useWizardForm, useWizardState } from '../../shared';

import type {
  ClientDomain,
  CreateClientDomainRequest,
  ContactMethod,
  ReferralSource,
} from '../../../services/client/types';

/**
 * Схема валідації форми створення клієнта
 */
const createClientSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  address: addressSchema,
  communicationChannels: z.array(z.enum(['PHONE', 'SMS', 'VIBER'])).optional(),
  source: z.enum(['INSTAGRAM', 'GOOGLE', 'RECOMMENDATION', 'OTHER']).optional(),
  sourceDetails: z.string().optional(),
});

type CreateClientFormData = z.infer<typeof createClientSchema>;

/**
 * Хук форми створення клієнтів з валідацією
 */
export const useClientForm = (initialData?: Partial<CreateClientFormData>) => {
  // === REACT СТАН ===
  const [isCreating, setIsCreating] = useState(false);
  const [createdClient, setCreatedClient] = useState<ClientDomain | null>(null);
  const [existingClient, setExistingClient] = useState<boolean>(false);

  // === WIZARD ІНТЕГРАЦІЯ ===
  const { addError, addWarning, clearErrors, clearWarnings } = useWizardState();

  // === ФОРМА З ZOD ВАЛІДАЦІЄЮ ===
  const formMethods = useWizardForm(createClientSchema, {
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      address: initialData?.address || '',
      communicationChannels: initialData?.communicationChannels || ['PHONE'],
      source: initialData?.source,
      sourceDetails: initialData?.sourceDetails || '',
    },
  });

  const { watch, reset } = formMethods;

  // === ПЕРЕВІРКА ІСНУВАННЯ КЛІЄНТА ===
  const checkClientExists = useCallback(async () => {
    const formData = watch();

    if (!formData.phone) {
      return;
    }

    try {
      const result = await clientExistenceService.checkClientExists(
        formData.phone,
        formData.email || undefined
      );

      if (result.success && result.data) {
        setExistingClient(true);
        addWarning('Клієнт з таким телефоном вже існує');
      } else {
        setExistingClient(false);
        clearWarnings();
      }
    } catch (error) {
      addError(error instanceof Error ? error.message : 'Помилка перевірки клієнта');
    }
  }, [watch, addError, addWarning, clearWarnings]);

  // === СТВОРЕННЯ КЛІЄНТА ===
  const createClient = useCallback(
    async (data: CreateClientFormData) => {
      setIsCreating(true);
      clearErrors();

      try {
        const request: CreateClientDomainRequest = {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email || undefined,
          address: data.address
            ? {
                street: data.address,
                city: '', // Потрібно буде додати поле в форму
              }
            : undefined,
          contactMethods: (data.communicationChannels || ['PHONE']) as ContactMethod[],
          referralSource: data.source as ReferralSource,
          referralSourceOther: data.sourceDetails || undefined,
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

  // === МЕТОДИ УПРАВЛІННЯ ФОРМОЮ ===
  const resetForm = useCallback(() => {
    reset();
    setCreatedClient(null);
    setExistingClient(false);
    clearErrors();
    clearWarnings();
  }, [reset, clearErrors, clearWarnings]);

  return {
    // Форма
    ...formMethods,

    // Стан
    isCreating,
    createdClient,
    existingClient,

    // Методи
    createClient,
    checkClientExists,
    resetForm,
  };
};
