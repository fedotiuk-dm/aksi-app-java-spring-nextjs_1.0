// 📋 ПІДЕТАП 1.3: Базова інформація замовлення
// Композиційний хук для роботи з базовою інформацією замовлення

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

// Готові React Query хуки з Orval для базової інформації замовлення
import {
  useStage1UpdateBasicOrder,
  useStage1GetBasicOrderData,
  useStage1GetBranchesForSession,
  useStage1GenerateReceiptNumber,
  useStage1SetUniqueTag,
  useStage1SelectBranch,
  useStage1CompleteBasicOrder,
} from '@/shared/api/generated/stage1';

// Zod схеми з Orval
import { stage1UpdateBasicOrderBody } from '@/shared/api/generated/stage1/schemas.zod';
// Типи з API
import type { BasicOrderInfoDTO, ErrorResponse } from '@/shared/api/generated/stage1';

import { useStage1Store } from '../store/stage1.store';
import { useMainStore } from '../../main/store/main.store';

/**
 * 📋 Хук для базової інформації замовлення (підетап 1.3)
 *
 * Функціональність:
 * - Автоматичне генерування номера квитанції
 * - Введення унікальної мітки (вручну або сканування)
 * - Вибір пункту прийому замовлення (філії)
 * - Автоматичне встановлення дати створення
 */
export const useBasicOrderInfo = () => {
  // 1. UI стан з Zustand
  const sessionId = useMainStore((state) => state.sessionId);
  const {
    isBasicOrderInfoMode,
    basicOrderInfoFormData,
    setBasicOrderInfoMode,
    setBasicOrderInfoFormData,
  } = useStage1Store();

  // 2. API хуки з Orval - Query
  const basicOrderDataQuery = useStage1GetBasicOrderData(sessionId || '', {
    query: {
      enabled: !!sessionId,
      staleTime: 60000,
    },
  });

  const branchesQuery = useStage1GetBranchesForSession(sessionId || '', {
    query: {
      enabled: !!sessionId,
      staleTime: 300000, // 5 хвилин - філії рідко змінюються
    },
  });

  // 3. API хуки з Orval - Mutations
  const updateBasicOrderMutation = useStage1UpdateBasicOrder({
    mutation: {
      onSuccess: () => {
        console.log('✅ Базова інформація оновлена');
        // Інвалідуємо кеш для оновлення даних
        queryClient.invalidateQueries({
          queryKey: ['stage1GetBasicOrderData', sessionId],
        });
      },
      onError: (error: ErrorResponse) => {
        console.error('❌ Помилка оновлення базової інформації:', error);
      },
    },
  });

  const generateReceiptNumberMutation = useStage1GenerateReceiptNumber({
    mutation: {
      onSuccess: (receiptNumber) => {
        console.log('✅ Номер квитанції згенеровано:', receiptNumber);
        // Оновлюємо форму з новим номером
        form.setValue('receiptNumber', receiptNumber);

        // Автоматично зберігаємо оновлену інформацію в API
        if (sessionId) {
          const currentFormData = form.getValues();
          updateBasicOrderMutation.mutate({
            sessionId,
            data: {
              ...currentFormData,
              receiptNumber, // Використовуємо свіжо згенерований номер
            },
          });
        }
      },
      onError: (error: ErrorResponse) => {
        console.error('❌ Помилка генерування номера квитанції:', error);
      },
    },
  });

  const setUniqueTagMutation = useStage1SetUniqueTag({
    mutation: {
      onSuccess: () => {
        console.log('✅ Унікальна мітка встановлена');
        // Інвалідуємо кеш для оновлення даних
        queryClient.invalidateQueries({
          queryKey: ['stage1GetBasicOrderData', sessionId],
        });
      },
      onError: (error: ErrorResponse) => {
        console.error('❌ Помилка встановлення унікальної мітки:', error);
      },
    },
  });

  const queryClient = useQueryClient();

  const selectBranchMutation = useStage1SelectBranch({
    mutation: {
      onSuccess: () => {
        console.log('✅ Філія вибрана');
        // Інвалідуємо кеш для оновлення даних
        queryClient.invalidateQueries({
          queryKey: ['stage1GetBasicOrderData', sessionId],
        });
        queryClient.invalidateQueries({
          queryKey: ['stage1GetBasicOrderState', sessionId],
        });
      },
      onError: (error: ErrorResponse) => {
        console.error('❌ Помилка вибору філії:', error);
      },
    },
  });

  const completeBasicOrderMutation = useStage1CompleteBasicOrder({
    mutation: {
      onSuccess: () => {
        console.log('✅ Базова інформація замовлення завершена');
        setBasicOrderInfoMode(false);
      },
      onError: (error: ErrorResponse) => {
        console.error('❌ Помилка завершення базової інформації:', error);
      },
    },
  });

  // 4. React Hook Form з Zod валідацією
  const form = useForm<BasicOrderInfoDTO>({
    resolver: zodResolver(stage1UpdateBasicOrderBody),
    defaultValues: basicOrderInfoFormData || {
      receiptNumber: '',
      uniqueTag: '',
      selectedBranchId: '',
      creationDate: new Date().toISOString(),
    },
    mode: 'onChange',
  });

  // Синхронізація форми з API даними
  useEffect(() => {
    if (basicOrderDataQuery.data) {
      const apiData = basicOrderDataQuery.data;
      form.setValue('receiptNumber', apiData.receiptNumber || '');
      form.setValue('uniqueTag', apiData.uniqueTag || '');
      form.setValue('selectedBranchId', apiData.selectedBranchId || '');
      form.setValue('creationDate', apiData.creationDate || new Date().toISOString());
    }
  }, [basicOrderDataQuery.data, form]);

  // 5. Обробники подій
  const handleUpdateBasicOrder = useCallback(
    (data: BasicOrderInfoDTO) => {
      if (!sessionId) {
        console.warn('⚠️ Відсутній sessionId для збереження базової інформації');
        return;
      }

      console.log('📋 Збереження базової інформації:', data);
      updateBasicOrderMutation.mutate({ sessionId, data });
    },
    [sessionId, updateBasicOrderMutation]
  );

  const handleGenerateReceiptNumber = useCallback(
    (branchCode?: string) => {
      if (!sessionId) {
        console.warn('⚠️ Відсутній sessionId для генерування номера квитанції');
        return;
      }

      generateReceiptNumberMutation.mutate({
        sessionId,
        params: { branchCode: branchCode || 'DEFAULT' },
      });
    },
    [sessionId, generateReceiptNumberMutation]
  );

  const handleSetUniqueTag = useCallback(
    (uniqueTag: string) => {
      if (!sessionId) {
        console.warn('⚠️ Відсутній sessionId для встановлення унікальної мітки');
        return;
      }

      setUniqueTagMutation.mutate({
        sessionId,
        params: { uniqueTag },
      });
      form.setValue('uniqueTag', uniqueTag);
    },
    [sessionId, setUniqueTagMutation, form]
  );

  const handleSelectBranch = useCallback(
    (branchId: string) => {
      if (!sessionId) {
        console.warn('⚠️ Відсутній sessionId для вибору філії');
        return;
      }

      console.log('🏢 Вибір філії:', { sessionId, branchId });

      selectBranchMutation.mutate({
        sessionId,
        params: { branchId },
      });
      form.setValue('selectedBranchId', branchId);

      console.log('📝 Форма оновлена з selectedBranchId:', branchId);
    },
    [sessionId, selectBranchMutation, form]
  );

  const handleCompleteBasicOrder = useCallback(() => {
    if (!sessionId) {
      console.warn('⚠️ Відсутній sessionId для завершення базової інформації');
      return;
    }

    completeBasicOrderMutation.mutate({ sessionId });
  }, [sessionId, completeBasicOrderMutation]);

  const handleStartBasicOrderInfo = useCallback(() => {
    setBasicOrderInfoMode(true);
    // Відновлюємо збережені дані форми якщо є
    if (basicOrderInfoFormData) {
      form.reset(basicOrderInfoFormData);
    }
  }, [setBasicOrderInfoMode, basicOrderInfoFormData, form]);

  const handleCancelBasicOrderInfo = useCallback(() => {
    // Зберігаємо поточні дані форми
    setBasicOrderInfoFormData(form.getValues());
    setBasicOrderInfoMode(false);
  }, [setBasicOrderInfoMode, setBasicOrderInfoFormData, form]);

  const handleScanUniqueTag = useCallback(
    (scannedTag: string) => {
      handleSetUniqueTag(scannedTag);
      console.log('📱 Унікальна мітка відсканована:', scannedTag);
    },
    [handleSetUniqueTag]
  );

  // 6. Watch значення для computed
  const receiptNumber = form.watch('receiptNumber');
  const uniqueTag = form.watch('uniqueTag');
  const selectedBranchId = form.watch('selectedBranchId');

  // 7. Computed значення з мемоізацією
  const computed = useMemo(() => {
    // Беремо selectedBranchId з API даних, а не з форми
    const apiSelectedBranchId = basicOrderDataQuery.data?.selectedBranchId;
    const effectiveSelectedBranchId = apiSelectedBranchId || selectedBranchId;

    const foundBranch = branchesQuery.data?.find(
      (branch) => branch.id === effectiveSelectedBranchId
    );

    // Номер квитанції може бути з API або з форми
    const apiReceiptNumber = basicOrderDataQuery.data?.receiptNumber;
    const effectiveReceiptNumber = apiReceiptNumber || receiptNumber;

    // Унікальна мітка може бути з API або з форми
    const apiUniqueTag = basicOrderDataQuery.data?.uniqueTag;
    const effectiveUniqueTag = apiUniqueTag || uniqueTag;

    // Діагностика для розробки
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Debug computed values:', {
        apiReceiptNumber,
        formReceiptNumber: receiptNumber,
        effectiveReceiptNumber,
        hasReceiptNumber: !!effectiveReceiptNumber,
        apiSelectedBranchId,
        formSelectedBranchId: selectedBranchId,
        effectiveSelectedBranchId,
        foundBranch: foundBranch?.name,
      });
    }

    return {
      // Стан форми
      isFormValid: form.formState.isValid,
      isDirty: form.formState.isDirty,
      hasErrors: Object.keys(form.formState.errors).length > 0,

      // Дані з API
      basicOrderData: {
        ...basicOrderDataQuery.data,
        receiptNumber: effectiveReceiptNumber,
        uniqueTag: effectiveUniqueTag,
        selectedBranchId: effectiveSelectedBranchId,
      },
      branches: branchesQuery.data || [],

      // Можливість завершити
      canCompleteBasicOrder: !!sessionId && !completeBasicOrderMutation.isPending,
      canSubmit: !!sessionId && form.formState.isValid && !updateBasicOrderMutation.isPending,

      // Стан полів
      hasReceiptNumber: !!effectiveReceiptNumber,
      hasUniqueTag: !!effectiveUniqueTag,
      selectedBranchId: effectiveSelectedBranchId,
      selectedBranch: foundBranch,
    };
  }, [
    form.formState.isValid,
    form.formState.isDirty,
    form.formState.errors,
    sessionId,
    basicOrderDataQuery.data,
    branchesQuery.data,
    completeBasicOrderMutation.isPending,
    updateBasicOrderMutation.isPending,
    receiptNumber,
    uniqueTag,
    selectedBranchId,
  ]);

  // 8. Групування повернення
  return {
    // UI стан
    ui: {
      isBasicOrderInfoMode,
      formData: basicOrderInfoFormData,
    },

    // API дані
    data: {
      basicOrderData: computed.basicOrderData,
      branches: computed.branches,
      selectedBranch: computed.selectedBranch,
    },

    // Стани завантаження
    loading: {
      isUpdating: updateBasicOrderMutation.isPending,
      isGeneratingReceiptNumber: generateReceiptNumberMutation.isPending,
      isSettingUniqueTag: setUniqueTagMutation.isPending,
      isSelectingBranch: selectBranchMutation.isPending,
      isCompleting: completeBasicOrderMutation.isPending,
      isLoadingBasicOrderData: basicOrderDataQuery.isLoading,
      isLoadingBranches: branchesQuery.isLoading,
    },

    // Дії
    actions: {
      updateBasicOrder: handleUpdateBasicOrder,
      generateReceiptNumber: handleGenerateReceiptNumber,
      setUniqueTag: handleSetUniqueTag,
      selectBranch: handleSelectBranch,
      completeBasicOrder: handleCompleteBasicOrder,
      startBasicOrderInfo: handleStartBasicOrderInfo,
      cancelBasicOrderInfo: handleCancelBasicOrderInfo,
      scanUniqueTag: handleScanUniqueTag,
    },

    // Форма
    form: {
      ...form,
      handleSubmit: form.handleSubmit(handleUpdateBasicOrder),
    },

    // Computed значення
    computed,
  };
};

export type UseBasicOrderInfoReturn = ReturnType<typeof useBasicOrderInfo>;
