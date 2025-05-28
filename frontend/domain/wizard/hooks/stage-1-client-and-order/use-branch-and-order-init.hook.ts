'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';

// API imports з Orval
import { useGetAllBranchLocations, type BranchLocationDTO } from '@/shared/api/generated/branch';

// Wizard types та store
import { useWizardStore } from '../../store/wizard.store';
import { ValidationStatus } from '../../types';

import type { Branch } from '../../types';

/**
 * Інтерфейс для стану завантаження філій
 */
export interface BranchLoadingState {
  branches: Branch[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

/**
 * Інтерфейс для базової інформації замовлення
 */
export interface OrderBasicInfo {
  receiptNumber?: string;
  tagNumber?: string;
  createdDate: Date;
  branchId?: string;
}

/**
 * Результат валідації кроку вибору філії та ініціалізації замовлення
 */
export interface BranchAndOrderValidation {
  isValid: boolean;
  validationStatus: ValidationStatus;
  details: {
    branchSelected: boolean;
    tagNumberValid: boolean;
    orderDataComplete: boolean;
  };
  errors: string[];
}

/**
 * Стан кроку вибору філії та ініціалізації замовлення
 */
export interface BranchAndOrderState {
  branchState: BranchLoadingState;
  selectedBranch: Branch | null;
  orderBasicInfo: OrderBasicInfo;
  validation: BranchAndOrderValidation;
  isOrderInitiated: boolean;
}

/**
 * Хук для управління вибором філії та ініціалізацією базової інформації замовлення (крок 1.2)
 *
 * Відповідає за:
 * 1. Завантаження та вибір пункту прийому (філії)
 * 2. Генерацію номера квитанції
 * 3. Управління унікальною міткою замовлення
 * 4. Ініціалізацію базової інформації замовлення
 * 5. Валідацію кроку
 * 6. Інтеграцію з wizard store
 */
export const useBranchAndOrderInit = () => {
  const queryClient = useQueryClient();

  // Wizard store
  const {
    selectedBranch,
    selectedBranchId,
    setSelectedBranch,
    clearSelectedBranch,
    addError,
    clearErrors,
  } = useWizardStore();

  // Local state для унікальної мітки та базової інформації замовлення
  const [tagNumber, setTagNumber] = useState<string>('');
  const [isOrderInitiated, setIsOrderInitiated] = useState<boolean>(false);
  const [orderBasicInfo, setOrderBasicInfo] = useState<OrderBasicInfo>({
    createdDate: new Date(),
  });

  // API хук для завантаження філій
  const branchesQuery = useGetAllBranchLocations(
    {},
    {
      query: {
        staleTime: 15 * 60 * 1000, // 15 хвилин
        retry: 3,
      },
    }
  );

  // === ОПЕРАЦІЇ З ФІЛІЯМИ ===

  /**
   * Вибір філії
   */
  const selectBranch = useCallback(
    (branchLocationDto: BranchLocationDTO) => {
      const branch: Branch = {
        id: branchLocationDto.id || '',
        name: branchLocationDto.name || '',
        address: branchLocationDto.address || '',
        phone: branchLocationDto.phone,
        code: branchLocationDto.code || '',
        active: branchLocationDto.active ?? true,
        createdAt: branchLocationDto.createdAt || new Date().toISOString(),
        updatedAt: branchLocationDto.updatedAt || new Date().toISOString(),
      };

      setSelectedBranch(branch);
      clearErrors();

      // Оновлюємо базову інформацію замовлення
      setOrderBasicInfo((prev) => ({
        ...prev,
        branchId: branch.id,
      }));
    },
    [setSelectedBranch, clearErrors]
  );

  /**
   * Очищення вибору філії
   */
  const clearBranchSelection = useCallback(() => {
    clearSelectedBranch();
    setOrderBasicInfo((prev) => ({
      ...prev,
      branchId: undefined,
    }));
  }, [clearSelectedBranch]);

  // === ОПЕРАЦІЇ З ЗАМОВЛЕННЯМ ===

  /**
   * Встановлення унікальної мітки
   */
  const setUniqueTag = useCallback(
    (tag: string) => {
      const cleanTag = tag.trim();
      setTagNumber(cleanTag);
      setOrderBasicInfo((prev) => ({
        ...prev,
        tagNumber: cleanTag || undefined,
      }));
      clearErrors();
    },
    [clearErrors]
  );

  /**
   * Генерація автоматичного номера квитанції
   */
  const generateReceiptNumber = useCallback(() => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const time = now.getTime().toString().slice(-4);

    const receiptNumber = `${year}${month}${day}-${time}`;

    setOrderBasicInfo((prev) => ({
      ...prev,
      receiptNumber,
      createdDate: now,
    }));

    return receiptNumber;
  }, []);

  /**
   * Ініціалізація замовлення
   */
  const initializeOrder = useCallback(() => {
    if (!selectedBranch) {
      addError('Необхідно вибрати пункт прийому');
      return { success: false };
    }

    const receiptNumber = generateReceiptNumber();
    setIsOrderInitiated(true);
    clearErrors();

    return {
      success: true,
      receiptNumber,
      orderData: {
        ...orderBasicInfo,
        receiptNumber,
        branchId: selectedBranch.id,
        tagNumber: tagNumber || undefined,
      },
    };
  }, [selectedBranch, generateReceiptNumber, orderBasicInfo, tagNumber, addError, clearErrors]);

  // === ВАЛІДАЦІЯ ===

  /**
   * Валідація унікальної мітки
   */
  const validateTagNumber = useCallback((tag: string): boolean => {
    if (!tag.trim()) return true; // Мітка не обов'язкова

    // Базова валідація: довжина та символи
    const cleanTag = tag.trim();
    if (cleanTag.length < 3 || cleanTag.length > 20) return false;

    // Дозволені тільки букви, цифри, дефіси та підкреслення
    const tagPattern = /^[a-zA-Z0-9\-_]+$/;
    return tagPattern.test(cleanTag);
  }, []);

  /**
   * Валідація кроку вибору філії та ініціалізації замовлення
   */
  const validateStep = useCallback((): BranchAndOrderValidation => {
    const errors: string[] = [];
    const isBranchSelected = !!selectedBranch?.id;
    const isTagNumberValid = validateTagNumber(tagNumber);
    const isOrderDataComplete = isBranchSelected && !!orderBasicInfo.createdDate;

    if (!isBranchSelected) {
      errors.push('Необхідно вибрати пункт прийому замовлення');
    }

    if (!isTagNumberValid) {
      errors.push(
        'Унікальна мітка має містити від 3 до 20 символів (літери, цифри, дефіси, підкреслення)'
      );
    }

    const isValid =
      isBranchSelected && isTagNumberValid && isOrderDataComplete && errors.length === 0;

    return {
      isValid,
      validationStatus: isValid ? ValidationStatus.VALID : ValidationStatus.INVALID,
      details: {
        branchSelected: isBranchSelected,
        tagNumberValid: isTagNumberValid,
        orderDataComplete: isOrderDataComplete,
      },
      errors,
    };
  }, [selectedBranch, tagNumber, orderBasicInfo, validateTagNumber]);

  /**
   * Завершення кроку
   */
  const completeStep = useCallback(() => {
    const validation = validateStep();

    if (validation.isValid && selectedBranch) {
      const orderInitResult = initializeOrder();

      if (orderInitResult.success) {
        return {
          success: true,
          branchId: selectedBranch.id,
          branch: selectedBranch,
          orderData: orderInitResult.orderData,
          receiptNumber: orderInitResult.receiptNumber,
        };
      }
    }

    // Додаємо помилки валідації до store
    validation.errors.forEach((error) => addError(error));

    return {
      success: false,
      errors: validation.errors,
    };
  }, [validateStep, selectedBranch, initializeOrder, addError]);

  // === COMPUTED STATE ===

  /**
   * Стан завантаження філій
   */
  const branchLoadingState: BranchLoadingState = useMemo(() => {
    const branches: Branch[] = [];

    if (branchesQuery.data) {
      const branchArray = Array.isArray(branchesQuery.data)
        ? branchesQuery.data
        : [branchesQuery.data];

      branchArray.forEach((branch) => {
        if (branch.id) {
          branches.push({
            id: branch.id,
            name: branch.name || '',
            address: branch.address || '',
            phone: branch.phone,
            code: branch.code || '',
            active: branch.active ?? true,
            createdAt: branch.createdAt || new Date().toISOString(),
            updatedAt: branch.updatedAt || new Date().toISOString(),
          });
        }
      });
    }

    return {
      branches,
      isLoading: branchesQuery.isLoading,
      isError: branchesQuery.isError,
      errorMessage: branchesQuery.error?.message,
    };
  }, [branchesQuery]);

  /**
   * Повний стан кроку
   */
  const branchAndOrderState: BranchAndOrderState = useMemo(() => {
    const validation = validateStep();

    return {
      branchState: branchLoadingState,
      selectedBranch,
      orderBasicInfo: {
        ...orderBasicInfo,
        tagNumber: tagNumber || undefined,
      },
      validation,
      isOrderInitiated,
    };
  }, [
    branchLoadingState,
    selectedBranch,
    orderBasicInfo,
    tagNumber,
    validateStep,
    isOrderInitiated,
  ]);

  // === PUBLIC API ===
  return {
    // Стан
    branchAndOrderState,
    selectedBranch,
    tagNumber,
    isOrderInitiated,
    orderBasicInfo,

    // Філія операції
    selectBranch,
    clearBranchSelection,

    // Замовлення операції
    setUniqueTag,
    generateReceiptNumber,
    initializeOrder,

    // Валідація
    validateTagNumber,
    validateStep,
    completeStep,

    // Допоміжні методи
    refetchBranches: branchesQuery.refetch,
  };
};
