/**
 * @fileoverview Хук для управління станом базової інформації замовлення
 *
 * Відповідальність:
 * - Управління станом базової інформації замовлення
 * - Валідація введених даних
 * - Перевірка готовності до наступного етапу
 */

import { useState, useCallback, useMemo } from 'react';

// Типи
import type { UseOrderBasicInfoReturn, OrderBasicInfo } from './types';

/**
 * Початкові дані для базової інформації замовлення
 */
const initialBasicInfo: OrderBasicInfo = {
  receiptNumber: '',
  uniqueTag: '',
  branchId: '',
  createdAt: new Date(),
};

/**
 * Хук для управління станом базової інформації замовлення
 *
 * Відповідає тільки за стан та валідацію даних.
 * Для генерації номера квитанції використовуйте useReceiptNumberGeneration.
 * Для валідації унікальності мітки використовуйте useUniqueTagValidation.
 *
 * @example
 * ```tsx
 * const {
 *   basicInfo,
 *   isValid,
 *   validationErrors,
 *   setUniqueTag,
 *   setBranchId,
 *   validate,
 *   reset
 * } = useOrderBasicInfo();
 * ```
 */
export const useOrderBasicInfo = (): UseOrderBasicInfoReturn => {
  const [basicInfo, setBasicInfoState] = useState<OrderBasicInfo>(initialBasicInfo);

  /**
   * Встановити унікальну мітку
   */
  const setUniqueTag = useCallback((tag: string) => {
    setBasicInfoState((prev) => ({
      ...prev,
      uniqueTag: tag.trim(),
    }));
  }, []);

  /**
   * Встановити філію
   */
  const setBranchId = useCallback((branchId: string) => {
    setBasicInfoState((prev) => ({
      ...prev,
      branchId,
    }));
  }, []);

  /**
   * Встановити дату створення
   */
  const setCreatedAt = useCallback((date: Date) => {
    setBasicInfoState((prev) => ({
      ...prev,
      createdAt: date,
    }));
  }, []);

  /**
   * Встановити дані повністю
   */
  const setBasicInfo = useCallback((info: Partial<OrderBasicInfo>) => {
    setBasicInfoState((prev) => ({
      ...prev,
      ...info,
    }));
  }, []);

  /**
   * Помилки валідації
   */
  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (!basicInfo.receiptNumber.trim()) {
      errors.receiptNumber = "Номер квитанції обов'язковий";
    }

    if (!basicInfo.uniqueTag.trim()) {
      errors.uniqueTag = "Унікальна мітка обов'язкова";
    } else if (basicInfo.uniqueTag.length < 3) {
      errors.uniqueTag = 'Мітка повинна містити мінімум 3 символи';
    } else if (basicInfo.uniqueTag.length > 50) {
      errors.uniqueTag = 'Мітка не повинна перевищувати 50 символів';
    } else if (!/^[a-zA-Z0-9\-_]+$/.test(basicInfo.uniqueTag)) {
      errors.uniqueTag = 'Мітка може містити тільки букви, цифри, дефіс та підкреслення';
    }

    if (!basicInfo.branchId) {
      errors.branchId = "Вибір філії обов'язковий";
    }

    return errors;
  }, [basicInfo]);

  /**
   * Валідувати дані
   */
  const validate = useCallback(() => {
    return Object.keys(validationErrors).length === 0;
  }, [validationErrors]);

  /**
   * Очистити дані
   */
  const reset = useCallback(() => {
    setBasicInfoState(initialBasicInfo);
  }, []);

  /**
   * Чи валідна інформація
   */
  const isValid = useMemo(() => {
    return validate();
  }, [validate]);

  return {
    basicInfo,
    isValid,
    validationErrors,
    setUniqueTag,
    setBranchId,
    setCreatedAt,
    setBasicInfo,
    validate,
    reset,
  };
};
