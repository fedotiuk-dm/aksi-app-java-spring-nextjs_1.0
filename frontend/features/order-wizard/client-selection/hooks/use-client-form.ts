import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { CreateClient, EditClient, SimpleClient } from '../schemas';
import { useClientFormHandler } from './use-client-form-handler';
import { useClientFormInitialization } from './use-client-form-initialization';
import { useClientFormStore } from './use-client-form-store';
import { UseClientFormProps } from './use-client-form-types';
import { useClientFormValidation } from './use-client-form-validation';
import { useClientMutations } from './use-client-mutations';

/**
 * Головний хук для роботи з формою клієнта
 * Об'єднує всі складові частини для повної функціональності форми
 */
export const useClientForm = ({ type = 'create', onSuccess }: UseClientFormProps = {}) => {
  // Ініціалізація форми
  const { form } = useClientFormInitialization({ type });

  // Інтеграція зі стором
  const {
    selectedClient,
    newClient,
    editClient,
    handleCreateClient: storeHandleCreateClient,
    handleUpdateClient: storeHandleUpdateClient,
    handleStartEditingClient,
    handleCancelEditing,
  } = useClientFormStore({ type, onSuccess });

  // Обробник полів форми
  const {
    error,
    setError: setFormError, // Перейменовуємо для уникнення плутанини з setError з React Hook Form
    isSubmitting,
    setIsSubmitting,
    handleFieldChange,
    showSourceDetails,
  } = useClientFormHandler({ form, type });

  // Валідація форми
  const { getValidationErrors, isFormValid, getFieldError, isDirty } = useClientFormValidation({
    form,
  });

  // Хук для роботи з API
  const { isCreating, isUpdating } = useClientMutations();

  // Обробник для створення клієнта
  const handleCreateClient = useCallback(
    async (data: CreateClient) => {
      try {
        setIsSubmitting(true);
        setFormError(null);

        // Заповнюємо поля форми з даних
        Object.entries(data).forEach(([key, value]) => {
          handleFieldChange(key, value);
        });

        // Перевіряємо валідність форми
        if (!isFormValid()) {
          const errors = getValidationErrors();
          setFormError(`Виправте помилки у формі: ${errors.map((e) => e.message).join(', ')}`);
          return;
        }

        // Викликаємо створення через стор
        // Функція не приймає аргументів, оскільки вона використовує дані з стору
        const result = await storeHandleCreateClient();

        if (result?.errors) {
          // Якщо є помилки валідації полів, встановлюємо їх у формі
          // Якщо є загальна помилка, встановлюємо її як загальну помилку форми
          if (result.errors.general) {
            setFormError(result.errors.general);
          } else {
            // Встановлюємо помилки валідації для полів
            Object.entries(result.errors).forEach(([field, message]) => {
              // Перевіряємо, чи поле є допустимим для форми
              const allowedFields = ['firstName', 'lastName', 'phone', 'email'];
              if (allowedFields.includes(field)) {
                form.setError(field as 'firstName' | 'lastName' | 'phone' | 'email', { message });
              } else {
                // Якщо поле не дозволене, встановлюємо загальну помилку
                setFormError(`Помилка в полі ${field}: ${message}`);
              }
            });
          }
        }

        return result;
      } catch (error) {
        setFormError(error instanceof Error ? error.message : 'Помилка при створенні клієнта');
        return {
          error: error instanceof Error ? error.message : 'Помилка при створенні клієнта',
          client: null,
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      setIsSubmitting,
      setFormError,
      isFormValid,
      storeHandleCreateClient,
      handleFieldChange,
      getValidationErrors,
      form,
    ]
  );

  // Обробник для оновлення клієнта
  const handleUpdateClient = useCallback(
    async (data: EditClient) => {
      try {
        setIsSubmitting(true);
        setFormError(null);

        // Заповнюємо поля форми з даних
        Object.entries(data).forEach(([key, value]) => {
          handleFieldChange(key, value);
        });

        // Перевіряємо валідність форми
        if (!isFormValid()) {
          const errors = getValidationErrors();
          setFormError(`Виправте помилки у формі: ${errors.map((e) => e.message).join(', ')}`);
          return;
        }

        // Викликаємо оновлення через стор
        const result = await storeHandleUpdateClient();

        if (result?.errors) {
          // Якщо є помилки валідації полів, встановлюємо їх у формі
          if (result.errors.general) {
            setFormError(result.errors.general);
          } else {
            // Встановлюємо помилки валідації для полів
            Object.entries(result.errors).forEach(([field, message]) => {
              // Перевіряємо, чи поле є допустимим для форми
              const allowedFields = ['firstName', 'lastName', 'phone', 'email'];
              if (allowedFields.includes(field)) {
                form.setError(field as 'firstName' | 'lastName' | 'phone' | 'email', { message });
              } else {
                // Якщо поле не дозволене, встановлюємо загальну помилку
                setFormError(`Помилка в полі ${field}: ${message}`);
              }
            });
          }
        }

        return result;
      } catch (error) {
        setFormError(error instanceof Error ? error.message : 'Помилка при оновленні клієнта');
        return {
          error: error instanceof Error ? error.message : 'Помилка при оновленні клієнта',
          client: null,
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      setIsSubmitting,
      setFormError,
      isFormValid,
      storeHandleUpdateClient,
      handleFieldChange,
      getValidationErrors,
      form,
    ]
  );

  // Обробник для створення клієнта з простої форми
  const handleSimpleCreate = useCallback(
    async (data: { firstName: string; lastName: string; phone: string; email?: string }) => {
      // Для спрощеної форми - заповнюємо основні поля ручно
      handleFieldChange('firstName', data.firstName);
      handleFieldChange('lastName', data.lastName);
      handleFieldChange('phone', data.phone);

      // Викликаємо створення клієнта з використанням стору
      const result = await storeHandleCreateClient();

      if (result.errors) {
        // Якщо є загальна помилка, використовуємо її
        if (result.errors.general) {
          throw new Error(result.errors.general);
        } else {
          // Інакше використовуємо першу помилку з об'єкта помилок
          const errorMessage = Object.values(result.errors)[0] || 'Помилка валідації';
          throw new Error(errorMessage);
        }
      }

      if (onSuccess && result.client) {
        onSuccess(result.client);
      }
    },
    [storeHandleCreateClient, handleFieldChange, onSuccess]
  );

  // Обробник відправки форми
  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);

      // Перевіряємо, чи валідна форма
      if (!isFormValid()) {
        const validationErrors = getValidationErrors();
        // Встановлюємо помилки для кожного поля
        for (const errorItem of validationErrors) {
          // Використовуємо метод форми для встановлення помилки конкретного поля
          // Типізуємо поле як відповідне до типу форми
          if (type === 'create') {
            const typedForm = form as ReturnType<typeof useForm<CreateClient>>;
            typedForm.setError(errorItem.field as keyof CreateClient, {
              message: errorItem.message,
              type: 'manual',
            });
          } else if (type === 'edit') {
            const typedForm = form as ReturnType<typeof useForm<EditClient>>;
            typedForm.setError(errorItem.field as keyof EditClient, {
              message: errorItem.message,
              type: 'manual',
            });
          } else {
            const typedForm = form as ReturnType<typeof useForm<SimpleClient>>;
            typedForm.setError(errorItem.field as keyof SimpleClient, {
              message: errorItem.message,
              type: 'manual',
            });
          }
        }
        return;
      }

      // Отримуємо всі значення форми
      const values = form.getValues();
      const firstName = values.firstName as string;
      const lastName = values.lastName as string;
      const phone = values.phone as string;
      const email = values.email as string | undefined;

      // Обробляємо відповідно до типу форми
      switch (type) {
        case 'create':
          await handleCreateClient({
            firstName,
            lastName,
            phone,
            email,
            communicationChannels: ['PHONE'],
          });
          break;
        case 'edit':
          await handleUpdateClient({
            firstName,
            lastName,
            phone,
            email,
            communicationChannels: ['PHONE'],
            id: selectedClient?.id,
          });
          break;
        case 'simple':
          await handleSimpleCreate({
            firstName,
            lastName,
            phone,
            email,
          });
          break;
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormError(error instanceof Error ? error.message : 'Помилка при відправці форми');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    type,
    isFormValid,
    getValidationErrors,
    setFormError,
    handleCreateClient,
    handleUpdateClient,
    handleSimpleCreate,
    setIsSubmitting,
    form,
    selectedClient,
  ]);

  // Повертаємо API форми для використання у компоненті
  return {
    // Форма
    form,
    register: form.register,
    control: form.control,
    formState: form.formState,

    // Стан форми
    isDirty,

    // Помилки та валідація
    error,
    isSubmitting,
    showSourceDetails,
    isCreating,
    isUpdating,

    // Обробники полів
    handleFieldChange,

    // Валідація
    getValidationErrors,
    isFormValid,
    getFieldError,

    // Обробники форми
    handleCreateClient,
    handleUpdateClient,
    handleStartEditingClient,
    handleCancelEditing,
    handleSubmit,

    // Дані
    selectedClient,
    newClient,
    editClient,
  };
};
