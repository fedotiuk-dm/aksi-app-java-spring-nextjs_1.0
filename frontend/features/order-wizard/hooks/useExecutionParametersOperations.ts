import React from 'react';
import { useUpdateCartModifiers, UpdateCartModifiersRequestUrgencyType, UpdateCartModifiersRequest } from '@api/cart';
import { useOrderWizardCart } from './useOrderWizardCart';
import { useOrderWizardStore } from '@/features/order-wizard';
import { generateUrgencyOptions } from '@/features/order-wizard/utils';

export const useExecutionParametersOperations = () => {
  const updateModifiersMutation = useUpdateCartModifiers();
  const { refreshCart } = useOrderWizardCart();

  const {
    selectedUrgency,
    expectedDate,
    setSelectedUrgency,
    setExpectedDate
  } = useOrderWizardStore();

  const urgencyOptions = generateUrgencyOptions();

  // Handle urgency type change
  const handleUrgencyChange = async (value: string) => {
    const urgencyType = value as UpdateCartModifiersRequestUrgencyType;
    setSelectedUrgency(urgencyType);

    const requestData: UpdateCartModifiersRequest = {
      urgencyType,
      ...(expectedDate && { expectedCompletionDate: new Date(expectedDate + 'T00:00:00Z').toISOString() })
    };

    console.log('🚀 Sending urgency request:', requestData);

    await updateModifiersMutation.mutateAsync({
      data: requestData
    });
    await refreshCart();
  };

  // Handle expected date change
  const handleDateChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setExpectedDate(date);

    if (selectedUrgency) {
      const requestData: UpdateCartModifiersRequest = {
        urgencyType: selectedUrgency,
        ...(date && { expectedCompletionDate: new Date(date + 'T00:00:00Z').toISOString() })
      };

      await updateModifiersMutation.mutateAsync({
        data: requestData
      });
      await refreshCart();
    }
  };

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  return {
    // Data
    urgencyOptions,
    selectedUrgency,
    expectedDate,
    minDate,

    // Operations
    handleUrgencyChange,
    handleDateChange,

    // State
    isLoading: updateModifiersMutation.isPending,
    error: updateModifiersMutation.error
  };
};
