/**
 * @fileoverview Форми хук для домену "Основна інформація про замовлення"
 *
 * Відповідальність: тільки управління формами та валідація
 * Принцип: Single Responsibility Principle
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  basicOrderUIFormSchema,
  branchSelectionUIFormSchema,
  type BasicOrderUIFormData,
  type BranchSelectionUIFormData,
} from './basic-order-info.schemas';
import { useBasicOrderInfoStore } from './basic-order-info.store';

/**
 * Хук для управління формами основної інформації замовлення
 * Інкапсулює всю логіку форм і валідації
 */
export const useBasicOrderInfoForms = () => {
  const { orderFormData, branchFormData } = useBasicOrderInfoStore();

  // React Hook Form для основної інформації замовлення
  const orderForm = useForm<BasicOrderUIFormData>({
    resolver: zodResolver(basicOrderUIFormSchema),
    values: {
      receiptNumber: orderFormData.receiptNumber || '',
      selectedBranchId: orderFormData.selectedBranchId || '',
      uniqueTag: orderFormData.uniqueTag || '',
      description: orderFormData.description || '',
      priority: orderFormData.priority || 'NORMAL',
      notes: orderFormData.notes || '',
    },
    mode: 'onChange',
  });

  // React Hook Form для вибору філії
  const branchForm = useForm<BranchSelectionUIFormData>({
    resolver: zodResolver(branchSelectionUIFormSchema),
    values: {
      selectedBranchId: branchFormData.selectedBranchId || '',
      searchTerm: branchFormData.searchTerm || '',
    },
    mode: 'onChange',
  });

  return {
    // Основна форма замовлення
    order: orderForm,

    // Форма вибору філії
    branch: branchForm,

    // Можна додати інші форми у майбутньому
    // validation: validationForm,
    // receipt: receiptForm,
  };
};

export type UseBasicOrderInfoFormsReturn = ReturnType<typeof useBasicOrderInfoForms>;
