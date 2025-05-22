import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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

interface UseClientFormInitializationProps {
  type?: ClientFormType;
}

/**
 * Хук для ініціалізації форм клієнта
 * Відповідає тільки за створення і налаштування форм
 */
export const useClientFormInitialization = ({
  type = 'create',
}: UseClientFormInitializationProps = {}) => {
  const { newClient, editClient } = useClientStore();

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
    defaultValues: { firstName: '', lastName: '', phone: '', email: '' },
    mode: 'onChange',
  });

  // Вибираємо активну форму залежно від типу
  const form = type === 'create' ? createForm : type === 'edit' ? editForm : simpleForm;

  // Оновлення форми при зміні store
  useEffect(() => {
    if (type === 'create') {
      createForm.reset(newClient as CreateClient);
    } else if (type === 'edit' && editClient) {
      editForm.reset(editClient as EditClient);
    }
  }, [createForm, editForm, newClient, editClient, type]);

  return {
    form,
    type,
  };
};
