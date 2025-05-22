import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { useClientStore } from '../model';
import { ClientSource, CommunicationChannel, ClientFormData } from '../model/types';
import { CreateClient, EditClient, SimpleClient } from '../schemas';
import { arrayIncludes } from '../utils';
import { useClientFormFieldProcessor } from './use-client-form-field-processor';
import { ClientFormType } from './use-client-form-types';

type FormType =
  | ReturnType<typeof useForm<CreateClient>>
  | ReturnType<typeof useForm<EditClient>>
  | ReturnType<typeof useForm<SimpleClient>>;

interface UseClientFormHandlerProps {
  form: FormType;
  type: ClientFormType;
}

/**
 * Хук для обробки змін полів форми клієнта
 * Відповідає за обробку подій форми та оновлення стану
 */
export const useClientFormHandler = ({ form, type }: UseClientFormHandlerProps) => {
  const { newClient, editClient, updateNewClientField, updateEditClientField } = useClientStore();
  const fieldProcessor = useClientFormFieldProcessor();

  // Локальні стани
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Розрахунок showSourceDetails залежно від типу форми
  let showSourceDetails = false;
  if (type === 'create') {
    const sourceValue = (form as ReturnType<typeof useForm<CreateClient>>).watch('source') as
      | string[]
      | undefined;
    showSourceDetails = sourceValue ? arrayIncludes(sourceValue, 'OTHER') : false;
  } else if (type === 'edit') {
    const sourceValue = (form as ReturnType<typeof useForm<EditClient>>).watch('source') as
      | string[]
      | undefined;
    showSourceDetails = sourceValue ? arrayIncludes(sourceValue, 'OTHER') : false;
  }

  /**
   * Встановлює значення у форму відповідно до типу
   */
  const setFormValue = (fieldName: string, value: unknown) => {
    const options = { shouldDirty: true, shouldValidate: true };

    if (type === 'create') {
      const typedForm = form as ReturnType<typeof useForm<CreateClient>>;

      if (fieldName === 'communicationChannels') {
        typedForm.setValue(fieldName, value as CommunicationChannel[], options);
      } else if (fieldName === 'source') {
        typedForm.setValue(fieldName, value as ClientSource[], options);
      } else {
        typedForm.setValue(fieldName as keyof CreateClient, value as string | undefined, options);
      }
    } else if (type === 'edit') {
      const typedForm = form as ReturnType<typeof useForm<EditClient>>;

      if (fieldName === 'communicationChannels') {
        typedForm.setValue(fieldName, value as CommunicationChannel[], options);
      } else if (fieldName === 'source') {
        typedForm.setValue(fieldName, value as ClientSource[], options);
      } else {
        typedForm.setValue(fieldName as keyof EditClient, value as string | undefined, options);
      }
    } else {
      const typedForm = form as ReturnType<typeof useForm<SimpleClient>>;
      typedForm.setValue(fieldName as keyof SimpleClient, value as string | undefined, options);
    }
  };

  /**
   * Обробка змін полів форми
   */
  const handleFieldChange = (field: string, rawValue: unknown) => {
    let valueForFormSetValue: unknown;

    // Обробка значення залежно від типу поля
    if (field === 'communicationChannels') {
      valueForFormSetValue = fieldProcessor.processCommunicationChannels(
        rawValue,
        type,
        updateNewClientField,
        updateEditClientField
      );
    } else if (field === 'source') {
      valueForFormSetValue = fieldProcessor.processSource(
        rawValue,
        type,
        updateNewClientField,
        updateEditClientField
      );
    } else if (field === 'address') {
      const addressResult = fieldProcessor.processAddress(
        rawValue,
        type,
        updateNewClientField,
        updateEditClientField
      );
      valueForFormSetValue = addressResult.valueForForm;
    } else if (field === 'id') {
      valueForFormSetValue = fieldProcessor.processIdField(rawValue, type, updateEditClientField);
    } else {
      // Привести field до конкретного типу, який очікує processGenericField
      const genericField = field as Extract<
        keyof ClientFormData,
        'firstName' | 'lastName' | 'phone' | 'email' | 'sourceDetails'
      >;
      valueForFormSetValue = fieldProcessor.processGenericField(
        genericField,
        rawValue,
        type,
        updateNewClientField,
        updateEditClientField,
        newClient,
        editClient
      );
    }

    // Встановлюємо значення у форму
    setFormValue(field, valueForFormSetValue);
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
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    handleFieldChange,
    getValidationErrors,
    showSourceDetails,
  };
};
