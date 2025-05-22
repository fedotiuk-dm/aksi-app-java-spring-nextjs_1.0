import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { ClientResponse } from '@/lib/api';

import { useClientStore } from '../model';
import { clientSelectionSchema, ClientSelection } from '../schemas';

/**
 * Хук для вибору клієнта
 * Інкапсулює логіку вибору клієнта, зміни режиму та валідацію вибору
 */
export const useClientSelection = () => {
  const {
    mode,
    selectedClient,
    selectClient,
    clearSelectedClient,
    setMode
  } = useClientStore();

  // Форма для валідації вибору клієнта
  const form = useForm<ClientSelection>({
    resolver: zodResolver(clientSelectionSchema),
    defaultValues: {
      clientId: selectedClient?.id || ''
    }
  });

  // Обробник вибору клієнта
  const handleSelectClient = useCallback((client: ClientResponse) => {
    selectClient(client);
    form.setValue('clientId', client.id || '');
  }, [selectClient, form]);

  // Обробник скидання вибору клієнта
  const handleClearSelection = useCallback(() => {
    clearSelectedClient();
    form.setValue('clientId', '');
  }, [clearSelectedClient, form]);

  // Обробник зміни режиму
  const handleSetMode = useCallback((newMode: 'existing' | 'new' | 'edit') => {
    setMode(newMode);
    if (newMode === 'new') {
      clearSelectedClient();
      form.setValue('clientId', '');
    }
  }, [setMode, clearSelectedClient, form]);

  // Ініціювання редагування вибраного клієнта
  const handleEditSelected = useCallback(() => {
    if (selectedClient) {
      setMode('edit');
    }
  }, [selectedClient, setMode]);

  // Підтвердження вибору клієнта з валідацією
  const confirmSelection = form.handleSubmit(() => {
    if (!selectedClient) {
      form.setError('clientId', {
        type: 'manual',
        message: 'Будь ласка, виберіть клієнта'
      });
      return false;
    }
    return true;
  });

  // Повертаємо все необхідне для компонентів
  return {
    form,
    mode,
    selectedClient,
    handleSelectClient,
    handleClearSelection,
    handleSetMode,
    handleEditSelected,
    confirmSelection,
    isExistingMode: mode === 'existing',
    isNewMode: mode === 'new',
    isEditMode: mode === 'edit'
  };
};
