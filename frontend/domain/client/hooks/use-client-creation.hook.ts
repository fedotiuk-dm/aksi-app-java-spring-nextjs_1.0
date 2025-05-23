import { useCallback } from 'react';

import { ClientResponse } from '@/lib/api';

import { eventBus } from '../../shared/events/event-bus';
import { ClientEventFactory } from '../events';
import { useClientCreationStore } from '../store/client-creation.store';
import { CreateClientFormData, CreateClientResult } from '../types';
import { ClientAdapter } from '../utils';


/**
 * Властивості хука створення клієнта
 */
interface UseClientCreationProps {
  onSuccess?: (client: ClientResponse) => void;
  onError?: (error: string) => void;
  autoReset?: boolean;
}

/**
 * Хук для створення клієнтів
 *
 * DDD SOLID принципи:
 * - Single Responsibility: відповідає ТІЛЬКИ за створення клієнтів
 * - Open/Closed: розширюється через props та callbacks
 * - Dependency Inversion: залежить від абстракцій (store, events)
 * - Interface Segregation: мінімальний, спеціалізований інтерфейс
 *
 * OpenAPI інтеграція:
 * - Всі дані з lib/api (ClientResponse)
 * - ClientAdapter для перетворення API ↔ Domain
 * - Type-safe взаємодія з backend
 */
export const useClientCreation = (props: UseClientCreationProps = {}) => {
  const { onSuccess, onError, autoReset = false } = props;

  const { formData, isLoading, error, setFormData, saveClient, resetForm } =
    useClientCreationStore();

  /**
   * Обробник збереження клієнта
   * Реалізує Domain Event pattern для міжобластної комунікації
   */
  const handleSave = useCallback(async (): Promise<CreateClientResult> => {
    const result = await saveClient();

    if (result.client && !result.errors) {
      // OpenAPI Response → Domain через ClientAdapter
      const domainClient = ClientAdapter.toDomain(result.client);

      // Створюємо доменну подію (DDD Event Sourcing)
      const event = ClientEventFactory.createClientCreatedEvent(domainClient);

      // Публікуємо подію в Event Bus (Loose Coupling)
      await eventBus.publish(event);

      // Callback для UI (Interface Segregation)
      onSuccess?.(result.client);

      // Автоматичне скидання форми після успіху
      if (autoReset) {
        resetForm();
      }
    } else if (result.errors && onError) {
      const errorMessage = result.errors.general || 'Помилка створення клієнта';
      onError(errorMessage);
    }

    return result;
  }, [saveClient, onSuccess, onError, autoReset, resetForm]);

  /**
   * Обробник оновлення одного поля форми
   * Type-safe оновлення з валідацією
   */
  const handleFieldChange = useCallback(
    <K extends keyof CreateClientFormData>(field: K, value: CreateClientFormData[K]) => {
      setFormData({ [field]: value });
    },
    [setFormData]
  );

  /**
   * Обробник оновлення множинних полів
   * Batch update для кращої продуктивності
   */
  const handleFormDataChange = useCallback(
    (data: Partial<CreateClientFormData>) => {
      setFormData(data);
    },
    [setFormData]
  );

  /**
   * Обробник скидання форми
   * Очищення стану та повернення до початкових значень
   */
  const handleReset = useCallback(() => {
    resetForm();
  }, [resetForm]);

  /**
   * Валідація форми згідно бізнес-правил
   * Domain validation rules
   */
  const isValid = Boolean(
    formData.firstName?.trim() && formData.lastName?.trim() && formData.phone?.trim()
  );

  /**
   * Перевірка, чи можна відправити форму
   * Business logic for form submission
   */
  const canSubmit = isValid && !isLoading;

  return {
    // Дані (Read-only для UI)
    formData,
    isLoading,
    error,

    // Методи (Write operations)
    handleSave,
    handleFieldChange,
    handleFormDataChange,
    handleReset,

    // Стан валідності (Computed properties)
    isValid,
    canSubmit,
    isEmpty: Object.keys(formData).length === 0,

    // Metadata
    formType: 'create' as const,
  };
};
