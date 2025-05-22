import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  ClientsService,
  ClientResponse,
  CreateClientRequest,
  UpdateClientRequest
} from '@/lib/api';

import {
  createClientSchema,
  editClientSchema,
  simpleClientSchema,
  CreateClient,
  EditClient,
  SimpleClient
} from '../schemas';
import { useClientStore } from '../store';

type ClientFormType = 'create' | 'edit' | 'simple';

interface UseClientFormProps {
  type?: ClientFormType;
  onSuccess?: (client: ClientResponse) => void;
}

/**
 * Хук для роботи з формою клієнта
 * Підтримує створення, редагування та спрощену форму клієнта
 */
export const useClientForm = ({ type = 'create', onSuccess }: UseClientFormProps = {}) => {
  const queryClient = useQueryClient();
  const {
    newClient,
    editClient,
    selectedClient,
    updateNewClientField,
    updateEditClientField,
    createClient,
    saveEditedClient,
    startEditingClient,
    cancelEditing
  } = useClientStore();

  // Вибір схеми в залежності від типу форми
  const schema = type === 'create'
    ? createClientSchema
    : type === 'edit'
      ? editClientSchema
      : simpleClientSchema;

  // Вибір початкових значень в залежності від типу форми
  const defaultValues = type === 'create'
    ? newClient
    : type === 'edit'
      ? editClient
      : { firstName: '', lastName: '', phone: '' };

  // Налаштування React Hook Form з відповідною схемою валідації
  type FormValues = CreateClient | EditClient | SimpleClient;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FormValues,
    mode: 'onChange'
  });

  // Оновлення форми при зміні store
  useEffect(() => {
    if (type === 'create') {
      form.reset(newClient as FormValues);
    } else if (type === 'edit' && editClient) {
      form.reset(editClient as FormValues);
    }
  }, [form, newClient, editClient, type]);

  // Мутація для створення клієнта
  const createClientMutation = useMutation({
    mutationFn: async (data: CreateClient) => {
      console.log('✅ Створення клієнта - вхідні дані:', JSON.stringify(data, null, 2));
      
      // Конвертація в формат API запиту
      const request: CreateClientRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email || undefined,
        // Використовуємо адресу з нового поля address або з об'єкта structuredAddress
        address: typeof data.address === 'string'
          ? data.address
          : data.address instanceof Object && 'fullAddress' in data.address
            ? data.address.fullAddress
            : undefined,
        // Беремо перше значення з масиву джерел або undefined
        source: Array.isArray(data.source) && data.source.length > 0
          ? data.source[0] as CreateClientRequest.source
          : undefined,
        sourceDetails: data.sourceDetails || undefined
      };

      console.log('✅ Запит на створення клієнта:', JSON.stringify(request, null, 2));
      console.log('✅ Використовуємо ClientsService.createClient() з OpenAPI');

      try {
        const response = await ClientsService.createClient({ requestBody: request });
        console.log('✅ Успішна відповідь від API:', response);
        return response;
      } catch (error) {
        console.error('❌ Помилка при створенні клієнта:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('✅ Успішне створення клієнта:', data);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      console.error('❌ Помилка в onError:', error);
    }
  });

  // Мутація для оновлення клієнта
  const updateClientMutation = useMutation({
    mutationFn: async (data: EditClient) => {
      console.log('✅ Оновлення клієнта - вхідні дані:', JSON.stringify(data, null, 2));
      console.log('✅ Обраний клієнт:', selectedClient);
      
      if (!selectedClient) throw new Error('No client selected for update');

      // Конвертація в формат API запиту
      const request: UpdateClientRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email || undefined,
        // Використовуємо адресу з нового поля address або з об'єкта AddressDTO
        address: typeof data.address === 'string'
          ? data.address
          : data.address instanceof Object && 'fullAddress' in data.address
            ? data.address.fullAddress
            : undefined,
        // Беремо перше значення з масиву джерел або undefined
        source: Array.isArray(data.source) && data.source.length > 0
          ? data.source[0] as CreateClientRequest.source
          : undefined,
        sourceDetails: data.sourceDetails || undefined
      };

      console.log('✅ Запит на оновлення клієнта:', JSON.stringify(request, null, 2));

      // Перевіряємо, що id точно string, як вимагає API
      if (!selectedClient.id) {
        throw new Error('Client ID is required for update');
      }

      console.log('✅ Використовуємо ClientsService.updateClient() з OpenAPI');
      console.log('✅ ID клієнта для оновлення:', selectedClient.id);

      try {
        const response = await ClientsService.updateClient({
          id: selectedClient.id,
          requestBody: request
        });
        console.log('✅ Успішна відповідь від API при оновленні клієнта:', response);
        return response;
      } catch (error) {
        console.error('❌ Помилка при оновленні клієнта:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('✅ Успішне оновлення клієнта:', data);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      console.error('❌ Помилка в onError при оновленні клієнта:', error);
    }
  });

  // Функція обробки відправки форми
  const onSubmit = (data: FormValues) => {
    if (type === 'create') {
      // Заповнюємо поля newClient за допомогою handleFieldChange
      // перед викликом createClient(), який не приймає аргументів
      Object.entries(data).forEach(([key, value]) => {
        if (key in newClient) {
          handleFieldChange(key, value);
        }
      });

      // Викликаємо createClient без аргументів та мутацію з даними
      createClient();
      createClientMutation.mutate(data as CreateClient);
    } else if (type === 'edit') {
      // Заповнюємо поля editClient за допомогою handleFieldChange
      Object.entries(data).forEach(([key, value]) => {
        if (key in editClient) {
          handleFieldChange(key, value);
        }
      });

      // Викликаємо saveEditedClient без аргументів та мутацію з даними
      saveEditedClient();
      updateClientMutation.mutate(data as EditClient);
    } else {
      // Для спрощеної форми - заповнюємо основні поля ручно
      handleFieldChange('firstName', data.firstName);
      handleFieldChange('lastName', data.lastName);
      handleFieldChange('phone', data.phone);

      // Створюємо базовий запит з основними полями для мутації
      const createData: CreateClient = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: undefined,
        address: undefined,
        communicationChannels: ['PHONE'],
        source: [], // Використовуємо порожній масив замість undefined, оскільки схема очікує масив,
        sourceDetails: undefined
      };

      // Викликаємо createClient без аргументів та мутацію з даними
      createClient();
      createClientMutation.mutate(createData);
    }
  };

  /**
   * Обробка змін полів форми з покращеною типізацією
   */
  const handleFieldChange = <K extends string>(field: K, value: unknown) => {
    const stringValue = typeof value === 'string' ? value : null;

    // Оновлюємо стор відповідно до типу форми
    if (type === 'create' && field in newClient) {
      // Дозволяємо передавати тільки поля, які є в newClient
      updateNewClientField(
        field as keyof typeof newClient,
        stringValue
      );
    } else if (type === 'edit' && field in editClient) {
      // Дозволяємо передавати тільки поля, які є в editClient
      updateEditClientField(
        field as keyof typeof editClient,
        stringValue
      );
    }

    // Оновлюємо React Hook Form незалежно від типу поля
    // Для забезпечення сумісності типів, нам доводиться використати any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setValue(field as any, value === null ? undefined : value, {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  return {
    form,
    isSubmitting: createClientMutation.isPending || updateClientMutation.isPending,
    onSubmit: form.handleSubmit((data: FormValues) => onSubmit(data)),
    handleFieldChange,
    startEditingClient,
    cancelEditing,
    selectedClient,
    editClient,
    newClient
  };
};
