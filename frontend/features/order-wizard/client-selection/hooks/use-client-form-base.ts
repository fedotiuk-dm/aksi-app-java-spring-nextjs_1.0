import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { useClientStore } from '../model';
import {
  createClientSchema,
  editClientSchema,
  simpleClientSchema,
  CreateClient,
  EditClient,
  SimpleClient,
} from '../schemas';
import { ClientFormType } from './use-client-form-types';
import { arrayIncludes } from '../utils';

interface UseClientFormBaseProps {
  type?: ClientFormType;
}

/**
 * Базовий хук для роботи з формою клієнта
 * Відповідає за стан форми та валідацію
 */
export const useClientFormBase = ({ type = 'create' }: UseClientFormBaseProps = {}) => {
  const { newClient, editClient, updateNewClientField, updateEditClientField } = useClientStore();

  // Локальні стани
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Створюємо форми для всіх типів одночасно для уникнення умовного виклику хуків
  const createForm = useForm<CreateClient>({
    resolver: zodResolver(createClientSchema),
    defaultValues: newClient as CreateClient,
    mode: 'onChange',
  });

  const editForm = useForm<EditClient>({
    resolver: zodResolver(editClientSchema),
    defaultValues: editClient as EditClient,
    mode: 'onChange',
  });

  const simpleForm = useForm<SimpleClient>({
    resolver: zodResolver(simpleClientSchema),
    defaultValues: { firstName: '', lastName: '', phone: '' },
    mode: 'onChange',
  });

  // Вибираємо активну форму залежно від типу
  const form = type === 'create' ? createForm : type === 'edit' ? editForm : simpleForm;

  // Розрахунок showSourceDetails залежно від типу форми
  let showSourceDetails = false;
  if (type === 'create') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sourceValue = createForm.watch('source') as any;
    showSourceDetails = arrayIncludes(sourceValue, 'OTHER');
  } else if (type === 'edit') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sourceValue = editForm.watch('source') as any;
    showSourceDetails = arrayIncludes(sourceValue, 'OTHER');
  }

  // Оновлення форми при зміні store
  useEffect(() => {
    if (type === 'create') {
      createForm.reset(newClient as any);
    } else if (type === 'edit' && editClient) {
      editForm.reset(editClient as any);
    }
  }, [createForm, editForm, newClient, editClient, type]);

  /**
   * Обробка змін полів форми з покращеною типізацією
   */
  const handleFieldChange = (field: string, value: any) => {
    // Обробляємо null значення заздалегідь
    const processedValue = value === null ? '' : value;

    // Оновлюємо стор відповідно до типу форми
    if (type === 'create' && field in newClient) {
      // Дозволяємо передавати тільки поля, які є в newClient
      updateNewClientField(field as keyof typeof newClient, processedValue);
    } else if (type === 'edit' && field in editClient) {
      // Дозволяємо передавати тільки поля, які є в editClient
      updateEditClientField(field as keyof typeof editClient, processedValue);
    }

    // Оновлюємо React Hook Form незалежно від типу поля
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (form.setValue as any)(field, processedValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // Форматування помилок валідації
  const getValidationErrors = useCallback(() => {
    const { errors } = form.formState;
    return Object.entries(errors).map(([field, error]) => ({
      field,
      message: error?.message || `Помилка в полі ${field}`,
    }));
  }, [form.formState]);

  return {
    form,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    handleFieldChange,
    getValidationErrors,
    showSourceDetails,
    type,
  };
};
