// 👤 ПІДЕТАП 1.2: Створення нового клієнта
// Композиційний хук для роботи з формою створення клієнта

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

// Готові React Query хуки з Orval для створення клієнта
import {
  useStage1UpdateClientData,
  useStage1CreateClient,
  useStage1GetClientFormState,
  useStage1CompleteClientCreation,
} from '@/shared/api/generated/stage1';

// Zod схеми з Orval
import { stage1UpdateClientDataBody } from '@/shared/api/generated/stage1/schemas.zod';
// Типи з API
import type { NewClientFormDTO } from '@/shared/api/generated/stage1';

import { useStage1Store } from '../store/stage1.store';
import { useMainStore } from '../../main/store/main.store';
import {
  CONTACT_METHODS,
  INFO_SOURCES,
  CONTACT_METHOD_NAMES,
  INFO_SOURCE_NAMES,
  getContactMethodName,
  getInfoSourceName,
} from '../utils/stage1-mapping';

/**
 * 👤 Хук для створення нового клієнта (підетап 1.2)
 *
 * Функціональність:
 * - Форма створення нового клієнта з валідацією
 * - Вибір способів зв'язку (мультивибір)
 * - Вибір джерела інформації про хімчистку
 * - Інтеграція з React Hook Form + Zod
 */
export const useClientCreate = () => {
  // 1. UI стан з Zustand
  const sessionId = useMainStore((state) => state.sessionId);
  const { isClientCreateMode, clientCreateFormData, setClientCreateMode, setClientCreateFormData } =
    useStage1Store();

  // 2. API хуки з Orval - Query
  const clientFormStateQuery = useStage1GetClientFormState(sessionId || '', {
    query: {
      enabled: !!sessionId && isClientCreateMode,
      staleTime: 30000,
    },
  });

  // 3. React Hook Form з Zod валідацією (потрібно ініціалізувати перед mutations)
  const form = useForm<NewClientFormDTO>({
    resolver: zodResolver(stage1UpdateClientDataBody),
    defaultValues: clientCreateFormData || {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      communicationChannels: [],
      informationSource: 'INSTAGRAM',
      sourceDetails: '',
    },
    mode: 'onChange',
  });

  // 4. API хуки з Orval - Mutations
  const updateClientDataMutation = useStage1UpdateClientData({
    mutation: {
      onSuccess: (data) => {
        console.log('✅ Дані клієнта оновлені успішно:', data);
        // Зберігаємо дані форми для можливого редагування
        setClientCreateFormData(form.getValues());
      },
      onError: (error) => {
        console.error('❌ Помилка оновлення даних клієнта:', error);
      },
    },
  });

  const createClientMutation = useStage1CreateClient({
    mutation: {
      onSuccess: (data) => {
        console.log('✅ Клієнт створений успішно:', data);
      },
      onError: (error) => {
        console.error('❌ Помилка створення клієнта:', error);
      },
    },
  });

  const completeClientCreationMutation = useStage1CompleteClientCreation({
    mutation: {
      onSuccess: () => {
        console.log('✅ Створення клієнта завершено');
        setClientCreateMode(false);
        form.reset();
        setClientCreateFormData(null);
      },
      onError: (error) => {
        console.error('❌ Помилка завершення створення клієнта:', error);
      },
    },
  });

  // 5. Обробники подій
  const handleUpdateClientData = useCallback(
    (data: NewClientFormDTO) => {
      if (!sessionId) {
        console.warn('⚠️ Відсутній sessionId для оновлення даних клієнта');
        return;
      }

      console.log('👤 Оновлення даних клієнта:', data);

      updateClientDataMutation.mutate({ sessionId, data });
    },
    [sessionId, updateClientDataMutation]
  );

  const handleCreateClient = useCallback(() => {
    if (!sessionId) {
      console.warn('⚠️ Відсутній sessionId для створення клієнта');
      return;
    }

    console.log('👤 Створення клієнта');

    createClientMutation.mutate({ sessionId });
  }, [sessionId, createClientMutation]);

  const handleCompleteClientCreation = useCallback(() => {
    if (!sessionId) {
      console.warn('⚠️ Відсутній sessionId для завершення створення клієнта');
      return;
    }

    completeClientCreationMutation.mutate({
      sessionId,
    });
  }, [sessionId, completeClientCreationMutation]);

  const handleStartClientCreate = useCallback(() => {
    setClientCreateMode(true);
    // Відновлюємо збережені дані форми якщо є
    if (clientCreateFormData) {
      form.reset(clientCreateFormData);
    }
  }, [setClientCreateMode, clientCreateFormData, form]);

  const handleCancelClientCreate = useCallback(() => {
    // Зберігаємо поточні дані форми
    setClientCreateFormData(form.getValues());
    setClientCreateMode(false);
  }, [setClientCreateMode, setClientCreateFormData, form]);

  const handleClearForm = useCallback(() => {
    form.reset();
    setClientCreateFormData(null);
  }, [form, setClientCreateFormData]);

  // 6. Computed значення з мемоізацією
  const informationSource = form.watch('informationSource');
  const communicationChannels = form.watch('communicationChannels');

  const computed = useMemo(
    () => ({
      // Стан форми
      isFormValid: form.formState.isValid,
      isDirty: form.formState.isDirty,
      hasErrors: Object.keys(form.formState.errors).length > 0,

      // Стан створення з API
      creationState: clientFormStateQuery.data,

      // Можливість завершити створення
      canCompleteCreation: !!sessionId && !completeClientCreationMutation.isPending,
      canSubmit: !!sessionId && form.formState.isValid && !updateClientDataMutation.isPending,
      canCreateClient: !!sessionId && !createClientMutation.isPending,

      // Спеціальні поля
      needsInfoSourceOther: informationSource === INFO_SOURCES.OTHER,
      selectedContactMethods: communicationChannels || [],
    }),
    [
      form.formState.isValid,
      form.formState.isDirty,
      form.formState.errors,
      informationSource,
      communicationChannels,
      sessionId,
      clientFormStateQuery.data,
      completeClientCreationMutation.isPending,
      updateClientDataMutation.isPending,
      createClientMutation.isPending,
    ]
  );

  // 7. Групування повернення
  return {
    // UI стан
    ui: {
      isCreateMode: isClientCreateMode,
      formData: clientCreateFormData,
    },

    // API дані
    data: {
      creationState: computed.creationState,
    },

    // Стани завантаження
    loading: {
      isUpdatingData: updateClientDataMutation.isPending,
      isCreating: createClientMutation.isPending,
      isCompleting: completeClientCreationMutation.isPending,
      isLoadingCreationState: clientFormStateQuery.isLoading,
    },

    // Дії
    actions: {
      updateClientData: handleUpdateClientData,
      createClient: handleCreateClient,
      completeCreation: handleCompleteClientCreation,
      startCreate: handleStartClientCreate,
      cancelCreate: handleCancelClientCreate,
      clearForm: handleClearForm,
    },

    // Форма
    form: {
      ...form,
      handleSubmit: form.handleSubmit(handleUpdateClientData),
    },

    // Computed значення
    computed,

    // Константи для UI
    constants: {
      contactMethods: CONTACT_METHODS,
      infoSources: INFO_SOURCES,
      contactMethodNames: CONTACT_METHOD_NAMES,
      infoSourceNames: INFO_SOURCE_NAMES,
      getContactMethodName,
      getInfoSourceName,
    },
  };
};

export type UseClientCreateReturn = ReturnType<typeof useClientCreate>;
