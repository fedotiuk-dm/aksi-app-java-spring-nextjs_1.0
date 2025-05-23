import { useCallback, useMemo } from 'react';

import { ClientResponse } from '@/lib/api';

import { eventBus } from '../../shared/events/event-bus';
import { ClientEventFactory } from '../events';
import { useClientEditingStore } from '../store/client-editing.store';
import { UpdateClientFormData, UpdateClientResult, Client } from '../types';
import { ClientAdapter } from '../utils';


/**
 * Властивості хука редагування клієнта
 */
interface UseClientEditingProps {
  onSuccess?: (client: ClientResponse) => void;
  onError?: (error: string) => void;
  onCancelEdit?: () => void;
}

/**
 * Хук для редагування клієнтів
 *
 * DDD SOLID принципи:
 * - Single Responsibility: відповідає ТІЛЬКИ за редагування клієнтів
 * - Open/Closed: розширюється через props та callbacks
 * - Dependency Inversion: залежить від абстракцій (store, events)
 * - Liskov Substitution: повністю замінює старі хуки без зміни поведінки
 * - Interface Segregation: мінімальний, спеціалізований інтерфейс
 *
 * OpenAPI інтеграція:
 * - Всі дані з lib/api (ClientResponse)
 * - ClientAdapter для безпечного перетворення типів API ↔ Domain
 * - Type-safe операції з backend через Repository pattern
 */
export const useClientEditing = (props: UseClientEditingProps = {}) => {
  const { onSuccess, onError, onCancelEdit } = props;

  const {
    formData,
    originalClient,
    isLoading,
    error,
    startEditing,
    setFormData,
    saveClient,
    cancelEditing,
  } = useClientEditingStore();

  /**
   * Обробник початку редагування
   * Ініціалізує процес редагування з доменною подією
   */
  const handleStartEditing = useCallback(
    (client: Client) => {
      startEditing(client);

      // Створюємо та публікуємо подію вибору клієнта (Domain Event)
      const event = ClientEventFactory.createClientSelectedEvent(client);
      eventBus.publish(event);
    },
    [startEditing]
  );

  /**
   * Обробник збереження змін
   * Реалізує Domain Event pattern та інтеграцію з OpenAPI
   */
  const handleSave = useCallback(async (): Promise<UpdateClientResult> => {
    const result = await saveClient();

    if (result.client && !result.errors) {
      // OpenAPI Response → Domain через ClientAdapter
      const domainClient = ClientAdapter.toDomain(result.client);

      // Створюємо доменну подію оновлення (DDD Event Sourcing)
      const event = ClientEventFactory.createClientUpdatedEvent(
        domainClient,
        originalClient || undefined
      );

      // Публікуємо подію в Event Bus (Loose Coupling)
      await eventBus.publish(event);

      // Callback для UI (Interface Segregation)
      onSuccess?.(result.client);
    } else if (result.errors && onError) {
      const errorMessage = result.errors.general || 'Помилка оновлення клієнта';
      onError(errorMessage);
    }

    return result;
  }, [saveClient, originalClient, onSuccess, onError]);

  /**
   * Обробник оновлення одного поля форми
   * Type-safe оновлення з валідацією
   */
  const handleFieldChange = useCallback(
    <K extends keyof UpdateClientFormData>(field: K, value: UpdateClientFormData[K]) => {
      setFormData({ [field]: value });
    },
    [setFormData]
  );

  /**
   * Обробник оновлення множинних полів
   * Batch update для кращої продуктивності
   */
  const handleFormDataChange = useCallback(
    (data: Partial<UpdateClientFormData>) => {
      setFormData(data);
    },
    [setFormData]
  );

  /**
   * Обробник скасування редагування
   * Очищення стану та доменна подія
   */
  const handleCancel = useCallback(() => {
    cancelEditing();

    // Публікуємо подію очищення вибору (Domain Event)
    const event = ClientEventFactory.createClientSelectionClearedEvent();
    eventBus.publish(event);

    // Callback для UI
    onCancelEdit?.();
  }, [cancelEditing, onCancelEdit]);

  /**
   * Валідація форми згідно бізнес-правил
   * Domain validation rules
   */
  const isValid = Boolean(
    formData?.firstName?.trim() && formData?.lastName?.trim() && formData?.phone?.trim()
  );

  /**
   * Перевірка наявності змін (Domain Logic)
   * Порівняння поточних даних з оригінальними
   */
  const hasChanges = useMemo(() => {
    if (!formData || !originalClient) return false;

    const fieldsToCompare: (keyof UpdateClientFormData)[] = [
      'firstName',
      'lastName',
      'phone',
      'email',
      'address',
      'sourceDetails',
    ];

    return fieldsToCompare.some((field) => {
      const formValue = formData[field];
      const originalValue = originalClient[field];
      return formValue !== originalValue;
    });
  }, [formData, originalClient]);

  /**
   * Перевірка, чи можна зберегти зміни
   * Business logic for form submission
   */
  const canSave = isValid && hasChanges && !isLoading;

  return {
    // Дані (Read-only для UI)
    formData,
    originalClient,
    isLoading,
    error,

    // Методи (Write operations)
    handleStartEditing,
    handleSave,
    handleFieldChange,
    handleFormDataChange,
    handleCancel,

    // Стан (Computed properties)
    isEditing: Boolean(formData),
    isValid,
    hasChanges,
    canSave,

    // Metadata
    formType: 'edit' as const,
  };
};
