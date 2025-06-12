/**
 * @fileoverview Бізнес-логіка хук для домену "Створення клієнта"
 *
 * Відповідальність: координація між API та UI стором
 * Принцип: Single Responsibility Principle
 */

import { useCallback } from 'react';

import { useClientCreationStore } from './client-creation.store';
import { useClientCreationAPI } from './use-client-creation-api.hook';

import type { ClientCreationUIFormData } from './client-creation.schemas';

/**
 * Хук для бізнес-логіки створення клієнта
 * Координує взаємодію між API та UI станом
 */
export const useClientCreationBusiness = () => {
  const {
    // Стан
    sessionId,
    isFormVisible,
    isDirty,
    isSubmitting,

    // Дії з стором
    setSessionId,
    setFormVisible,
    updateFormData,
    setDirty,
    setSubmitting,
    clearValidationErrors,
    resetState,
  } = useClientCreationStore();

  // API операції
  const api = useClientCreationAPI(sessionId);

  // Координаційні бізнес-операції
  const initializeNewClient = useCallback(async () => {
    try {
      setSubmitting(true);
      clearValidationErrors();

      const newSessionId = await api.operations.initializeNewClient();
      setSessionId(newSessionId);
      setFormVisible(true);

      return newSessionId;
    } catch (error) {
      console.error('Business Error - Failed to initialize new client:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [api.operations, setSessionId, setFormVisible, setSubmitting, clearValidationErrors]);

  const updateClientData = useCallback(
    async (data: Partial<ClientCreationUIFormData>) => {
      try {
        setSubmitting(true);

        // Оновлюємо локальний стан
        updateFormData(data);

        // Синхронізуємо з сервером
        const response = await api.operations.updateClientData(data);

        setDirty(false);
        return response;
      } catch (error) {
        console.error('Business Error - Failed to update client data:', error);
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [api.operations, updateFormData, setDirty, setSubmitting]
  );

  const validateForm = useCallback(async () => {
    try {
      return await api.operations.validateForm();
    } catch (error) {
      console.error('Business Error - Failed to validate form:', error);
      throw error;
    }
  }, [api.operations]);

  const createClient = useCallback(async () => {
    try {
      setSubmitting(true);
      return await api.operations.createClient();
    } catch (error) {
      console.error('Business Error - Failed to create client:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [api.operations, setSubmitting]);

  const completeCreation = useCallback(async () => {
    try {
      setSubmitting(true);
      await api.operations.completeCreation();
      resetState();
    } catch (error) {
      console.error('Business Error - Failed to complete client creation:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [api.operations, resetState, setSubmitting]);

  const cancelCreation = useCallback(async () => {
    try {
      await api.operations.cancelCreation();
    } catch (error) {
      console.error('Business Error - Failed to cancel client creation:', error);
    } finally {
      resetState();
    }
  }, [api.operations, resetState]);

  return {
    // Операції
    initializeNewClient,
    updateClientData,
    validateForm,
    createClient,
    completeCreation,
    cancelCreation,

    // API дані
    data: api.data,

    // Стани завантаження
    loading: api.loading,

    // UI стан
    ui: {
      sessionId,
      isFormVisible,
      isDirty,
      isSubmitting,
    },
  };
};

export type UseClientCreationBusinessReturn = ReturnType<typeof useClientCreationBusiness>;
