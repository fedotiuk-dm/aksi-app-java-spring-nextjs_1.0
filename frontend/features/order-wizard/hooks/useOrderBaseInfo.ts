import { useState, useEffect } from 'react';
import { OrderBaseInfoValues } from '../model/types';
import { useOrderBaseInfo as useOrderBaseInfoApi } from '../api/orders';
import dayjs from 'dayjs';

/**
 * Хук для управління базовою інформацією замовлення
 */
export const useOrderBaseInfo = () => {
  const {
    receiptNumber,
    receptionPoints,
    isLoading,
    isError,
    setUniqueTag: apiSetUniqueTag,
    setReceptionPointId: apiSetReceptionPointId
  } = useOrderBaseInfoApi();

  // Ініціалізуємо значення форми
  const [formValues, setFormValues] = useState<OrderBaseInfoValues>({
    receiptNumber: '',
    uniqueTag: '',
    receptionPointId: null,
    createdAt: dayjs().format('YYYY-MM-DD')
  });

  // Оновлюємо формВалюес, коли отримуємо дані з API
  useEffect(() => {
    if (receiptNumber) {
      setFormValues(prev => ({
        ...prev,
        receiptNumber
      }));
    }
  }, [receiptNumber]);

  // Коли користувач вводить унікальну мітку
  const handleUniqueTagChange = (value: string) => {
    apiSetUniqueTag(value);
    setFormValues(prev => ({
      ...prev,
      uniqueTag: value
    }));
  };

  // Коли користувач обирає пункт прийому
  const handleReceptionPointChange = (value: string | null) => {
    apiSetReceptionPointId(value);
    setFormValues(prev => ({
      ...prev,
      receptionPointId: value
    }));
  };

  // Перевірка чи всі обов'язкові поля заповнені
  const isFormValid = () => {
    return (
      formValues.receiptNumber.trim() !== '' &&
      formValues.uniqueTag.trim() !== '' &&
      formValues.receptionPointId !== null
    );
  };

  return {
    formValues,
    receptionPoints,
    isLoading,
    isError,
    handleUniqueTagChange,
    handleReceptionPointChange,
    isFormValid
  };
};
