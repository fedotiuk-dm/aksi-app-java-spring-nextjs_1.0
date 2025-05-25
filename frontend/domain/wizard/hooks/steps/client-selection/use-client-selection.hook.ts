/**
 * @fileoverview Хук вибору клієнта в wizard (DDD архітектура)
 * @module domain/wizard/hooks/steps/client-selection
 */

import { useState, useCallback, useMemo } from 'react';

import { ClientSelectionService } from '../../../services';
import { useWizardStore } from '../../../store';
import { useWizardState, useWizardNavigation } from '../../shared';

import type { ClientValidationResult } from '../../../services';
import type { ClientSearchResult } from '../../../types';

/**
 * Хук вибору клієнта в контексті wizard
 *
 * Відповідальність:
 * - React стан вибраного клієнта
 * - Інтеграція з Zustand store
 * - Управління переходом до наступного кроку
 * - Інтеграція з wizard навігацією
 *
 * Делегує бізнес-логіку:
 * - ClientSelectionService для валідації та вибору
 * - useWizardNavigation для переходів
 */
export const useClientSelection = () => {
  // === REACT СТАН ===
  const [isSelecting, setIsSelecting] = useState(false);
  const [validationResult, setValidationResult] = useState<ClientValidationResult | null>(null);

  // === WIZARD ІНТЕГРАЦІЯ ===
  const { addError, addWarning, clearErrors, clearWarnings } = useWizardState();
  const { goNext, canGoNext } = useWizardNavigation();

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

  // === ВИБІР КЛІЄНТА ===
  const selectClient = useCallback(
    async (client: ClientSearchResult) => {
      setIsSelecting(true);
      clearErrors();
      clearWarnings();

      try {
        const result = ClientSelectionService.selectClient(client);

        if (result.success && result.client) {
          // Оновлення Zustand store
          setSelectedClient(result.client);
          setNewClientFlag(false);

          // Валідація для замовлення
          const validation = ClientSelectionService.validateClientForOrder(result.client);
          setValidationResult(validation);

          // Додавання попереджень якщо є
          if (result.warnings) {
            result.warnings.forEach((warning) => addWarning(warning));
          }

          if (validation.warnings.length > 0) {
            validation.warnings.forEach((warning) => addWarning(warning));
          }

          return { success: true, client: result.client };
        } else {
          if (result.error) {
            addError(result.error);
          }

          if (result.warnings) {
            result.warnings.forEach((warning) => addWarning(warning));
          }

          return { success: false, error: result.error };
        }
      } catch (error) {
        addError(error instanceof Error ? error.message : 'Помилка вибору клієнта');
        return { success: false };
      } finally {
        setIsSelecting(false);
      }
    },
    [setSelectedClient, setNewClientFlag, addError, addWarning, clearErrors, clearWarnings]
  );

  // === ОЧИЩЕННЯ ВИБОРУ ===
  const clearSelection = useCallback(() => {
    const result = ClientSelectionService.clearSelection();

    if (result.success) {
      clearSelectedClient();
      setValidationResult(null);
      clearErrors();
      clearWarnings();
    }

    return result;
  }, [clearSelectedClient, clearErrors, clearWarnings]);

  // === ВИБІР НОВОГО КЛІЄНТА ===
  const selectNewClient = useCallback(
    (client: ClientSearchResult) => {
      setSelectedClient(client);
      setNewClientFlag(true);

      // Валідація нового клієнта
      const validation = ClientSelectionService.validateClientForOrder(client);
      setValidationResult(validation);

      if (validation.warnings.length > 0) {
        validation.warnings.forEach((warning) => addWarning(warning));
      }

      return { success: true, client };
    },
    [setSelectedClient, setNewClientFlag, addWarning]
  );

  // === ПЕРЕХІД ДО НАСТУПНОГО КРОКУ ===
  const proceedToNextStep = useCallback(() => {
    if (!selectedClient) {
      addError('Оберіть клієнта для продовження');
      return false;
    }

    if (!ClientSelectionService.canProceedToNextStep(selectedClient)) {
      addError('Клієнт не може бути використаний для замовлення');
      return false;
    }

    return goNext();
  }, [selectedClient, addError, goNext]);

  // === ВАЛІДАЦІЯ ПОТОЧНОГО КЛІЄНТА ===
  const validateCurrentClient = useCallback(() => {
    if (!selectedClient) {
      return null;
    }

    const validation = ClientSelectionService.validateClientForOrder(selectedClient);
    setValidationResult(validation);

    // Очищення попередніх попереджень
    clearWarnings();

    // Додавання нових попереджень
    if (validation.warnings.length > 0) {
      validation.warnings.forEach((warning) => addWarning(warning));
    }

    return validation;
  }, [selectedClient, addWarning, clearWarnings]);

  // === COMPUTED ЗНАЧЕННЯ ===
  const computed = useMemo(() => {
    const hasSelectedClient = !!selectedClient;
    const isValidForOrder = selectedClient
      ? ClientSelectionService.isValidForOrder(selectedClient)
      : false;
    const canProceed = hasSelectedClient && isValidForOrder && canGoNext;

    const missingRequiredFields = selectedClient
      ? ClientSelectionService.getMissingRequiredFields(selectedClient)
      : [];

    const missingRecommendedFields = selectedClient
      ? ClientSelectionService.getMissingRecommendedFields(selectedClient)
      : [];

    const clientDisplay = selectedClient
      ? ClientSelectionService.formatClientForDisplay(selectedClient)
      : null;

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
  }, [selectedClient, canGoNext, validationResult]);

  return {
    // Стан вибору
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

    // Навігація
    proceedToNextStep,

    // Валідація
    validateCurrentClient,
  };
};
