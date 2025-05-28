/**
 * @fileoverview Хук для валідації замовлення перед підтвердженням (крок 4.1)
 * @module domain/wizard/hooks/stage-4
 */

import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { useWizardStore } from '../../store';

/**
 * Тип помилки валідації
 */
interface ValidationError {
  section: 'client' | 'branch' | 'items' | 'execution' | 'payment';
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Результат валідації
 */
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  completeness: number; // відсоток готовності 0-100
}

// 🔍 Допоміжні функції валідації
const validateClient = (selectedClient: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!selectedClient) {
    errors.push({
      section: 'client',
      field: 'selectedClient',
      message: 'Не вибрано клієнта',
      severity: 'error',
    });
    return errors;
  }

  if (!selectedClient.phone || selectedClient.phone.length < 10) {
    errors.push({
      section: 'client',
      field: 'phone',
      message: 'Некоректний номер телефону клієнта',
      severity: 'error',
    });
  }

  if (!selectedClient.fullName || selectedClient.fullName.length < 3) {
    errors.push({
      section: 'client',
      field: 'fullName',
      message: "Некоректне ім'я клієнта",
      severity: 'error',
    });
  }

  return errors;
};

const validateItems = (
  orderItems: any[]
): { errors: ValidationError[]; warnings: ValidationError[] } => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!orderItems || orderItems.length === 0) {
    errors.push({
      section: 'items',
      field: 'orderItems',
      message: 'Немає предметів у замовленні',
      severity: 'error',
    });
    return { errors, warnings };
  }

  orderItems.forEach((item: any, index: number) => {
    if (!item.name || !item.category) {
      errors.push({
        section: 'items',
        field: `item-${index}`,
        message: `Предмет ${index + 1}: відсутня назва або категорія`,
        severity: 'error',
      });
    }
    if (!item.finalPrice || item.finalPrice <= 0) {
      errors.push({
        section: 'items',
        field: `item-${index}-price`,
        message: `Предмет ${index + 1}: некоректна ціна`,
        severity: 'error',
      });
    }
  });

  // Попередження про ризики
  const riskyItems = orderItems.filter(
    (item: any) =>
      item.defects?.includes('без_гарантій') || item.risks?.includes('ризики_зміни_кольору')
  );
  if (riskyItems.length > 0) {
    warnings.push({
      section: 'items',
      field: 'risks',
      message: `${riskyItems.length} предметів з підвищеними ризиками`,
      severity: 'warning',
    });
  }

  return { errors, warnings };
};

const validateExecution = (executionParams: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!executionParams?.executionDate) {
    errors.push({
      section: 'execution',
      field: 'executionDate',
      message: 'Не встановлено дату виконання',
      severity: 'error',
    });
    return errors;
  }

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1);

  if (executionParams.executionDate < minDate) {
    errors.push({
      section: 'execution',
      field: 'executionDate',
      message: 'Дата виконання не може бути раніше завтра',
      severity: 'error',
    });
  }

  return errors;
};

/**
 * Хук для валідації замовлення
 * ✅ Композиція: валідація всіх етапів + бізнес-правила
 */
export const useOrderValidation = () => {
  // 🏪 Zustand - отримуємо всі дані
  const {
    selectedClient,
    selectedBranch,
    orderItems,
    executionParams,
    selectedDiscount,
    errors,
    warnings,
  } = useWizardStore();

  // ✅ Комплексна валідація всього замовлення
  const {
    data: validationResult,
    isLoading: isValidating,
    refetch: revalidate,
  } = useQuery({
    queryKey: [
      'order-validation',
      selectedClient?.id,
      selectedBranch?.id,
      orderItems?.length,
      executionParams?.executionDate?.toISOString(),
    ],
    queryFn: (): ValidationResult => {
      const validationErrors: ValidationError[] = [];
      const validationWarnings: ValidationError[] = [];

      // 1️⃣ Валідація клієнта
      validationErrors.push(...validateClient(selectedClient));

      // 2️⃣ Валідація філії
      if (!selectedBranch) {
        validationErrors.push({
          section: 'branch',
          field: 'selectedBranch',
          message: 'Не вибрано філію',
          severity: 'error',
        });
      }

      // 3️⃣ Валідація предметів
      const itemValidation = validateItems(orderItems || []);
      validationErrors.push(...itemValidation.errors);
      validationWarnings.push(...itemValidation.warnings);

      // 4️⃣ Валідація параметрів виконання
      validationErrors.push(...validateExecution(executionParams));

      // 5️⃣ Валідація знижок (тільки попередження)
      if (selectedDiscount && selectedDiscount.excludedItems?.length > 0) {
        validationWarnings.push({
          section: 'payment',
          field: 'discount',
          message: `Знижка не застосовується до ${selectedDiscount.excludedItems.length} предметів`,
          severity: 'warning',
        });
      }

      // 📊 Розрахунок повноти
      const completenessChecks = [
        !!selectedClient,
        !!selectedBranch,
        !!(orderItems && orderItems.length > 0),
        !!executionParams?.executionDate,
        true, // платежі опціональні
      ];
      const completeness =
        (completenessChecks.filter(Boolean).length / completenessChecks.length) * 100;

      return {
        isValid: validationErrors.length === 0,
        errors: validationErrors,
        warnings: validationWarnings,
        completeness,
      };
    },
    staleTime: 30000, // 30 секунд
    gcTime: 60000,
  });

  // 🔍 Методи валідації окремих секцій
  const validateSection = useCallback(
    (section: ValidationResult['errors'][0]['section']) => {
      if (!validationResult) return { isValid: true, errors: [], warnings: [] };

      const sectionErrors = validationResult.errors.filter((error) => error.section === section);
      const sectionWarnings = validationResult.warnings.filter(
        (warning) => warning.section === section
      );

      return {
        isValid: sectionErrors.length === 0,
        errors: sectionErrors,
        warnings: sectionWarnings,
      };
    },
    [validationResult]
  );

  // 📊 Інформація про валідацію
  const validationInfo = useMemo(
    () => ({
      isValidating,
      hasGlobalErrors: errors.length > 0,
      hasGlobalWarnings: warnings.length > 0,
      totalErrors: (validationResult?.errors.length || 0) + errors.length,
      totalWarnings: (validationResult?.warnings.length || 0) + warnings.length,
      completeness: validationResult?.completeness || 0,
      isReadyForConfirmation:
        validationResult?.isValid &&
        errors.length === 0 &&
        (validationResult?.completeness || 0) >= 80,
    }),
    [
      isValidating,
      errors.length,
      warnings.length,
      validationResult?.errors.length,
      validationResult?.warnings.length,
      validationResult?.completeness,
      validationResult?.isValid,
    ]
  );

  return {
    // ✅ Результати валідації
    validationResult,
    validationInfo,

    // 🔄 Стани
    isValidating,

    // 🔍 Методи валідації
    validateSection,
    revalidate,
  };
};
