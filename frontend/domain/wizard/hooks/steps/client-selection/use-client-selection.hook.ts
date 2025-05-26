/**
 * @fileoverview Хук вибору клієнта в wizard (DDD архітектура)
 * @module domain/wizard/hooks/steps/client-selection
 */

import { useState, useCallback, useMemo } from 'react';

import { useWizardStore } from '../../../store';
import { useWizardState, useWizardNavigation } from '../../shared';

import type { ClientSearchResult } from '../../../services/stage-1-client-and-order-info';

/**
 * Результат валідації клієнта
 */
interface ClientValidationResult {
  canProceed: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Хук вибору клієнта в контексті wizard
 *
 * Відповідальність:
 * - React стан вибраного клієнта
 * - Інтеграція з Zustand store
 * - Управління переходом до наступного кроку
 * - Інтеграція з wizard навігацією
 */
export const useClientSelection = () => {
  // === REACT СТАН ===
  const [isSelecting, setIsSelecting] = useState(false);
  const [validationResult, setValidationResult] = useState<ClientValidationResult | null>(null);

  // === WIZARD ІНТЕГРАЦІЯ ===
  const { addError, addWarning, clearErrors, clearWarnings } = useWizardState();
  const { navigateForward, canNavigateForward } = useWizardNavigation();

  // === ZUSTAND STORE ===
  const {
    // Стан клієнта
    selectedClientId,
    selectedClient,
    isNewClient,

    // Дії
    setSelectedClient,
    clearSelectedClient,
    setNewClientFlag,
  } = useWizardStore();

  // === ВАЛІДАЦІЯ КЛІЄНТА ===
  const validateClientForOrder = useCallback(
    (client: ClientSearchResult): ClientValidationResult => {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Обов'язкові поля
      if (!client.firstName || client.firstName.trim() === '') {
        errors.push("Ім'я клієнта обов'язкове");
      }

      if (!client.lastName || client.lastName.trim() === '') {
        errors.push("Прізвище клієнта обов'язкове");
      }

      if (!client.phone || client.phone.trim() === '') {
        errors.push("Телефон клієнта обов'язковий");
      }

      // Рекомендовані поля
      if (!client.email || client.email.trim() === '') {
        warnings.push('Рекомендується вказати email клієнта');
      }

      if (!client.address || client.address.trim() === '') {
        warnings.push('Рекомендується вказати адресу клієнта');
      }

      return {
        canProceed: errors.length === 0,
        errors,
        warnings,
      };
    },
    []
  );

  // === ВИБІР КЛІЄНТА ===
  const selectClient = useCallback(
    async (client: ClientSearchResult) => {
      setIsSelecting(true);
      clearErrors();
      clearWarnings();

      try {
        // Оновлення Zustand store
        setSelectedClient(client);
        setNewClientFlag(false);

        // Валідація для замовлення
        const validation = validateClientForOrder(client);
        setValidationResult(validation);

        // Додавання попереджень якщо є
        if (validation.warnings.length > 0) {
          validation.warnings.forEach((warning: string) => addWarning(warning));
        }

        return { success: true, client };
      } catch (error) {
        addError(error instanceof Error ? error.message : 'Помилка вибору клієнта');
        return { success: false };
      } finally {
        setIsSelecting(false);
      }
    },
    [
      setSelectedClient,
      setNewClientFlag,
      addError,
      addWarning,
      clearErrors,
      clearWarnings,
      validateClientForOrder,
    ]
  );

  // === ОЧИЩЕННЯ ВИБОРУ ===
  const clearSelection = useCallback(() => {
    clearSelectedClient();
    setValidationResult(null);
    clearErrors();
    clearWarnings();
    return { success: true };
  }, [clearSelectedClient, clearErrors, clearWarnings]);

  // === ВИБІР НОВОГО КЛІЄНТА ===
  const selectNewClient = useCallback(
    (client: ClientSearchResult) => {
      setSelectedClient(client);
      setNewClientFlag(true);

      // Валідація нового клієнта
      const validation = validateClientForOrder(client);
      setValidationResult(validation);

      if (validation.warnings.length > 0) {
        validation.warnings.forEach((warning: string) => addWarning(warning));
      }

      return { success: true, client };
    },
    [setSelectedClient, setNewClientFlag, addWarning, validateClientForOrder]
  );

  // === ПЕРЕХІД ДО НАСТУПНОГО КРОКУ ===
  const proceedToNextStep = useCallback(() => {
    const validation = validationResult;

    if (!validation?.canProceed) {
      // Додаємо помилки до wizard стану
      validation?.errors.forEach((error: string) => addError(error));
      validation?.warnings.forEach((warning: string) => addWarning(warning));
      return;
    }

    // Використовуємо навігацію через XState
    const result = navigateForward();
    if (!result.success) {
      result.errors.forEach((error: string) => addError(error));
    }
  }, [validationResult, addError, addWarning, navigateForward]);

  // === ВАЛІДАЦІЯ ПОТОЧНОГО КЛІЄНТА ===
  const validateCurrentClient = useCallback(() => {
    if (!selectedClient) {
      return null;
    }

    const validation = validateClientForOrder(selectedClient);
    setValidationResult(validation);

    // Очищення попередніх попереджень
    clearWarnings();

    // Додавання нових попереджень
    if (validation.warnings.length > 0) {
      validation.warnings.forEach((warning: string) => addWarning(warning));
    }

    return validation;
  }, [selectedClient, addWarning, clearWarnings, validateClientForOrder]);

  // === УТИЛІТИ ===
  const formatClientForDisplay = useCallback((client: ClientSearchResult) => {
    return {
      fullName: `${client.firstName} ${client.lastName}`.trim(),
      phone: client.phone,
      email: client.email || 'Не вказано',
      address: client.address || 'Не вказано',
    };
  }, []);

  const getMissingRequiredFields = useCallback((client: ClientSearchResult) => {
    const missing: string[] = [];

    if (!client.firstName?.trim()) missing.push('firstName');
    if (!client.lastName?.trim()) missing.push('lastName');
    if (!client.phone?.trim()) missing.push('phone');

    return missing;
  }, []);

  const getMissingRecommendedFields = useCallback((client: ClientSearchResult) => {
    const missing: string[] = [];

    if (!client.email?.trim()) missing.push('email');
    if (!client.address?.trim()) missing.push('address');

    return missing;
  }, []);

  // === COMPUTED ЗНАЧЕННЯ ===
  const computed = useMemo(() => {
    const hasSelectedClient = !!selectedClient;
    const isValidForOrder = selectedClient
      ? getMissingRequiredFields(selectedClient).length === 0
      : false;
    const canProceed =
      hasSelectedClient && validationResult?.canProceed === true && canNavigateForward();

    const missingRequiredFields = selectedClient ? getMissingRequiredFields(selectedClient) : [];
    const missingRecommendedFields = selectedClient
      ? getMissingRecommendedFields(selectedClient)
      : [];
    const clientDisplay = selectedClient ? formatClientForDisplay(selectedClient) : null;

    return {
      hasSelectedClient,
      isValidForOrder,
      canProceed,
      missingRequiredFields,
      missingRecommendedFields,
      clientDisplay,
      hasValidationErrors: (validationResult?.errors?.length || 0) > 0,
      hasValidationWarnings: (validationResult?.warnings?.length || 0) > 0,
    };
  }, [
    selectedClient,
    validationResult,
    canNavigateForward,
    getMissingRequiredFields,
    getMissingRecommendedFields,
    formatClientForDisplay,
  ]);

  return {
    // Стан
    selectedClient,
    selectedClientId,
    isNewClient,
    isSelecting,
    validationResult,

    // Computed значення
    ...computed,

    // Методи вибору
    selectClient,
    selectNewClient,
    clearSelection,

    // Валідація
    validateCurrentClient,

    // Навігація
    proceedToNextStep,

    // Утиліти
    formatClientForDisplay,
    getMissingRequiredFields,
    getMissingRecommendedFields,
  };
};
