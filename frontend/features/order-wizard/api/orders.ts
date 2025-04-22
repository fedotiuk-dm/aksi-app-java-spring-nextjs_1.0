import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OrdersService } from '@/lib/api';
import dayjs from 'dayjs';

/**
 * Хук для отримання номера квитанції
 */
export const useReceiptNumber = () => {
  return useQuery({
    queryKey: ['receiptNumber'],
    queryFn: async () => {
      return await OrdersService.generateReceiptNumber();
    },
    staleTime: Infinity // Номер квитанції генерується один раз і не оновлюється
  });
};

/**
 * Хук для отримання списку активних пунктів прийому
 */
export const useReceptionPoints = () => {
  return useQuery({
    queryKey: ['receptionPoints'],
    queryFn: async () => {
      return await OrdersService.getActiveReceptionPoints1();
    },
    staleTime: 1000 * 60 * 5 // Кешуємо на 5 хвилин
  });
};

/**
 * Хук для роботи з базовою інформацією замовлення
 */
export const useOrderBaseInfo = () => {
  const [uniqueTag, setUniqueTag] = useState('');
  const [receptionPointId, setReceptionPointId] = useState<string | null>(null);
  const currentDate = dayjs().format('YYYY-MM-DD');
  
  const receiptNumberQuery = useReceiptNumber();
  const receptionPointsQuery = useReceptionPoints();
  
  const isLoading = receiptNumberQuery.isLoading || receptionPointsQuery.isLoading;
  const isError = receiptNumberQuery.isError || receptionPointsQuery.isError;
  
  return {
    uniqueTag,
    receptionPointId,
    currentDate,
    receiptNumber: receiptNumberQuery.data || '',
    receptionPoints: receptionPointsQuery.data || [],
    isLoading,
    isError,
    setUniqueTag,
    setReceptionPointId
  };
};
