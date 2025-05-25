/**
 * @fileoverview Хук форми створення клієнтів (DDD архітектура)
 * @module domain/wizard/hooks/steps/client-selection
 */

import { useState, useCallback, useMemo } from 'react';
import { z } from 'zod';

import {
  nameSchema,
  phoneSchema,
  emailSchema,
  addressSchema,
} from '../../../schemas/wizard-client-fields.schemas';
import { ClientCreationService } from '../../../services';
import { useWizardForm, useWizardState } from '../../shared';

import type { DuplicateCheckResult, ClientCreationResult } from '../../../services';
import type { ClientSearchResult } from '../../../types';

// Імпорт Zod схеми для валідації

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
 * Хук форми створення клієнтів з валідацією та перевіркою дублікатів
 *
 * Відповідальність:
 * - React стан форми та валідації
 * - Інтеграція з Zod схемами
 * - Управління станом дублікатів
 * - Інтеграція з wizard станом
 *
 * Делегує бізнес-логіку:
 * - ClientCreationService для створення та перевірки дублікатів
 * - useWizardForm для валідації
 */
export const useClientForm = (initialData?: Partial<CreateClientFormData>) => {
  // === REACT СТАН ===
  const [isCreating, setIsCreating] = useState(false);
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckResult | null>(null);
  const [createdClient, setCreatedClient] = useState<ClientSearchResult | null>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

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

  const { watch, setValue, reset } = formMethods;

  // === ПЕРЕВІРКА ДУБЛІКАТІВ ===
  const checkDuplicates = useCallback(async () => {
    const formData = watch();

    if (!formData.firstName || !formData.lastName || !formData.phone) {
      return;
    }

    try {
      const result = await ClientCreationService.checkForDuplicates({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email || undefined,
        address: formData.address || undefined,
        communicationChannels: formData.communicationChannels,
        source: formData.source,
        sourceDetails: formData.sourceDetails || undefined,
      });

      setDuplicateCheck(result);

      if (result.hasDuplicates) {
        const message = ClientCreationService.getDuplicateMessage(result);
        addWarning(message);
        setShowDuplicateWarning(true);
      } else {
        clearWarnings();
        setShowDuplicateWarning(false);
      }
    } catch (error) {
      addError(error instanceof Error ? error.message : 'Помилка перевірки дублікатів');
    }
  }, [watch, addError, addWarning, clearWarnings]);

  // === ДОПОМІЖНІ ФУНКЦІЇ ===
  const handleDuplicateCheck = useCallback(async () => {
    if (!duplicateCheck || duplicateCheck.recommendedAction === 'review') {
      await checkDuplicates();

      if (duplicateCheck && !ClientCreationService.canAutoCreate(duplicateCheck)) {
        return { shouldStop: true };
      }
    }
    return { shouldStop: false };
  }, [duplicateCheck, checkDuplicates]);

  const handleCreationResult = useCallback(
    (result: ClientCreationResult) => {
      if (result.success && result.client) {
        setCreatedClient(result.client);
        setShowDuplicateWarning(false);

        if (result.warnings) {
          result.warnings.forEach((warning: string) => addWarning(warning));
        }

        return { success: true, client: result.client };
      } else {
        if (result.error) {
          addError(result.error);
        }

        if (result.duplicateCheck) {
          setDuplicateCheck(result.duplicateCheck);
          setShowDuplicateWarning(true);
        }

        return { success: false, duplicateCheck: result.duplicateCheck };
      }
    },
    [addWarning, addError]
  );

  // === СТВОРЕННЯ КЛІЄНТА ===
  const createClient = useCallback(
    async (data: CreateClientFormData, forceCreate: boolean = false) => {
      setIsCreating(true);
      clearErrors();

      try {
        // Перевірка дублікатів якщо не форсуємо
        if (!forceCreate) {
          const duplicateResult = await handleDuplicateCheck();
          if (duplicateResult.shouldStop) {
            setIsCreating(false);
            return { success: false, needsReview: true };
          }
        }

        const result = await ClientCreationService.createClient({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email || undefined,
          address: data.address || undefined,
          communicationChannels: data.communicationChannels,
          source: data.source,
          sourceDetails: data.sourceDetails || undefined,
        });

        return handleCreationResult(result);
      } catch (error) {
        addError(error instanceof Error ? error.message : 'Помилка створення клієнта');
        return { success: false };
      } finally {
        setIsCreating(false);
      }
    },
    [handleDuplicateCheck, handleCreationResult, addError, clearErrors]
  );

  // === МЕТОДИ УПРАВЛІННЯ ФОРМОЮ ===
  const resetForm = useCallback(() => {
    reset();
    setDuplicateCheck(null);
    setCreatedClient(null);
    setShowDuplicateWarning(false);
    clearErrors();
    clearWarnings();
  }, [reset, clearErrors, clearWarnings]);

  const dismissDuplicateWarning = useCallback(() => {
    setShowDuplicateWarning(false);
    clearWarnings();
  }, [clearWarnings]);

  const forceCreateClient = useCallback(
    async (data: CreateClientFormData) => {
      return await createClient(data, true);
    },
    [createClient]
  );

  // === COMPUTED ЗНАЧЕННЯ ===
  const computed = useMemo(() => {
    const canAutoCreate = duplicateCheck
      ? ClientCreationService.canAutoCreate(duplicateCheck)
      : true;
    const hasCriticalDuplicates =
      (duplicateCheck?.duplicatesByPhone?.length || 0) > 0 ||
      (duplicateCheck?.duplicatesByEmail?.length || 0) > 0;
    const hasNameDuplicates = (duplicateCheck?.duplicatesByFullName?.length || 0) > 0;

    return {
      canAutoCreate,
      hasCriticalDuplicates,
      hasNameDuplicates,
      needsReview: duplicateCheck?.recommendedAction === 'review',
      canProceed: !isCreating && (!duplicateCheck || canAutoCreate),
    };
  }, [duplicateCheck, isCreating]);

  return {
    // Форма
    ...formMethods,

    // Стан створення
    isCreating,
    createdClient,

    // Дублікати
    duplicateCheck,
    showDuplicateWarning,

    // Computed значення
    ...computed,

    // Методи
    createClient,
    checkDuplicates,
    resetForm,
    dismissDuplicateWarning,
    forceCreateClient,

    // Утиліти
    setValue,
    watch,
  };
};
