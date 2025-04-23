import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  OrdersService, 
  OrderCreateRequest, 
  OrderDraftsService, 
  OrderDto, 
  OrderDraftDto, 
  OrderDraftRequest
} from '@/lib/api';
import { createPageable, adaptPageResponse } from '@/lib/api/pagination';
import { OperationStatus } from '../model/types';
import { useCallback, useState } from 'react';

/**
 * Хук для створення нового замовлення
 */
export const useCreateOrder = () => {
  const [status, setStatus] = useState<OperationStatus>(OperationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  
  const mutation = useMutation({
    mutationFn: OrdersService.createOrder,
    onSuccess: () => {
      setStatus(OperationStatus.SUCCESS);
      setError(null);
    },
    onError: (err: Error) => {
      setStatus(OperationStatus.ERROR);
      setError(err?.message || 'Помилка при створенні замовлення');
    }
  });
  
  const createOrder = useCallback(async (orderData: OrderCreateRequest): Promise<OrderDto | undefined> => {
    setStatus(OperationStatus.LOADING);
    return mutation.mutateAsync({ requestBody: orderData });
  }, [mutation]);
  
  return {
    createOrder,
    status,
    error,
    isLoading: status === OperationStatus.LOADING
  };
};

/**
 * Хук для створення чернетки замовлення
 */
export const useSaveOrderDraft = () => {
  const [status, setStatus] = useState<OperationStatus>(OperationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  
  const mutation = useMutation({
    mutationFn: OrderDraftsService.createDraft,
    onSuccess: () => {
      setStatus(OperationStatus.SUCCESS);
      setError(null);
    },
    onError: (err: Error) => {
      setStatus(OperationStatus.ERROR);
      setError(err?.message || 'Помилка при створенні чернетки замовлення');
    }
  });
  
  const saveDraft = useCallback(async (draftData: OrderDraftRequest): Promise<OrderDraftDto | undefined> => {
    setStatus(OperationStatus.LOADING);
    return mutation.mutateAsync({ requestBody: draftData });
  }, [mutation]);
  
  return {
    saveDraft,
    status,
    error,
    isLoading: status === OperationStatus.LOADING
  };
};

/**
 * Хук для оновлення чернетки замовлення
 */
export const useUpdateOrderDraft = () => {
  const [status, setStatus] = useState<OperationStatus>(OperationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  
  const mutation = useMutation({
    mutationFn: ({ id, requestBody }: { id: string; requestBody: OrderDraftRequest }) => 
      OrderDraftsService.updateDraft({ id, requestBody }),
    onSuccess: () => {
      setStatus(OperationStatus.SUCCESS);
      setError(null);
    },
    onError: (err: Error) => {
      setStatus(OperationStatus.ERROR);
      setError(err?.message || 'Помилка при оновленні чернетки замовлення');
    }
  });
  
  const updateDraft = useCallback(async (id: string, draftData: OrderDraftRequest): Promise<OrderDraftDto | undefined> => {
    setStatus(OperationStatus.LOADING);
    return mutation.mutateAsync({ id, requestBody: draftData });
  }, [mutation]);
  
  return {
    updateDraft,
    status,
    error,
    isLoading: status === OperationStatus.LOADING
  };
};

/**
 * Хук для отримання чернетки замовлення за ID
 */
export const useGetOrderDraft = (id: string) => {
  return useQuery({
    queryKey: ['orderDraft', id],
    queryFn: () => OrderDraftsService.getDraftById({ id }),
    enabled: !!id
  });
};

/**
 * Хук для отримання чернеток поточного користувача
 */
export const useGetUserOrderDrafts = (
  page: number = 0,
  size: number = 10,
  sort?: { field: string; direction: 'asc' | 'desc' }
) => {
  // Створюємо об'єкт пагінації в форматі, який очікує Spring Data
  const pageable = createPageable(page, size, sort);
  
  return useQuery({
    queryKey: ['userOrderDrafts', page, size, sort],
    queryFn: async () => {
      const response = await OrderDraftsService.getCurrentUserDrafts({ pageable });
      // Адаптуємо відповідь до зручного формату
      return adaptPageResponse(response);
    }
  });
};

/**
 * Хук для отримання чернеток клієнта
 */
export const useGetClientOrderDrafts = (
  clientId: string,
  page: number = 0,
  size: number = 10,
  sort?: { field: string; direction: 'asc' | 'desc' }
) => {
  const pageable = createPageable(page, size, sort);
  
  return useQuery({
    queryKey: ['clientOrderDrafts', clientId, page, size, sort],
    queryFn: async () => {
      const response = await OrderDraftsService.getDraftsByClient({ clientId, pageable });
      return adaptPageResponse(response);
    },
    enabled: !!clientId
  });
};

/**
 * Хук для видалення чернетки замовлення
 */
export const useDeleteOrderDraft = () => {
  const [status, setStatus] = useState<OperationStatus>(OperationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  
  const mutation = useMutation({
    mutationFn: OrderDraftsService.deleteDraft,
    onSuccess: () => {
      setStatus(OperationStatus.SUCCESS);
      setError(null);
    },
    onError: (err: Error) => {
      setStatus(OperationStatus.ERROR);
      setError(err?.message || 'Помилка при видаленні чернетки замовлення');
    }
  });
  
  const deleteDraft = useCallback(async (id: string): Promise<void> => {
    setStatus(OperationStatus.LOADING);
    await mutation.mutateAsync({ id });
  }, [mutation]);
  
  return {
    deleteDraft,
    status,
    error,
    isLoading: status === OperationStatus.LOADING
  };
};

/**
 * Хук для позначення чернетки як конвертованої в замовлення
 */
export const useMarkDraftAsConverted = () => {
  const [status, setStatus] = useState<OperationStatus>(OperationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  
  const mutation = useMutation({
    mutationFn: ({ draftId, orderId }: { draftId: string; orderId: string }) => 
      OrderDraftsService.markAsConverted({ draftId, orderId }),
    onSuccess: () => {
      setStatus(OperationStatus.SUCCESS);
      setError(null);
    },
    onError: (err: Error) => {
      setStatus(OperationStatus.ERROR);
      setError(err?.message || 'Помилка при позначенні чернетки як конвертованої');
    }
  });
  
  const markAsConverted = useCallback(
    async (draftId: string, orderId: string): Promise<OrderDraftDto | undefined> => {
      setStatus(OperationStatus.LOADING);
      return mutation.mutateAsync({ draftId, orderId });
    }, 
    [mutation]
  );
  
  return {
    markAsConverted,
    status,
    error,
    isLoading: status === OperationStatus.LOADING
  };
};

/**
 * Хук для отримання номера квитанції
 */
export const useGenerateReceiptNumber = () => {
  const query = useQuery({
    queryKey: ['generateReceiptNumber'],
    queryFn: OrdersService.generateReceiptNumber,
    enabled: false
  });
  
  return {
    generateReceiptNumber: query.refetch,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error
  };
};
