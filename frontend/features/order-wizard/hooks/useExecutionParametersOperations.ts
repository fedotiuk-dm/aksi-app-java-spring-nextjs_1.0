import React from 'react';
import { useUpdateCartModifiers } from '@api/cart';
import { UpdateCartModifiersRequestUrgencyType, UpdateCartModifiersRequest } from '@api/cart';
import { useOrderWizardCart } from './useOrderWizardCart';
import { useOrderWizardStore } from '@/features/order-wizard';

export const useExecutionParametersOperations = () => {
  const updateModifiersMutation = useUpdateCartModifiers();
  const { refreshCart } = useOrderWizardCart();
  
  const {
    selectedUrgency,
    expectedDate,
    setSelectedUrgency,
    setExpectedDate
  } = useOrderWizardStore();

  // Generate urgency options with percentages and proper translations
  const urgencyOptions = Object.keys(UpdateCartModifiersRequestUrgencyType).map(urgency => {
    const urgencyType = urgency as UpdateCartModifiersRequestUrgencyType;
    let label: string;
    
    switch (urgencyType) {
      case 'NORMAL':
        label = 'Звичайне (без націнки)';
        break;
      case 'EXPRESS_48H':
        label = 'Експрес 48 год (+50%)';
        break;
      case 'EXPRESS_24H':
        label = 'Експрес 24 год (+100%)';
        break;
      default:
        label = urgency.charAt(0) + urgency.slice(1).toLowerCase().replace(/_/g, ' ');
    }
    
    return {
      value: urgency,
      label
    };
  });

  console.log('📝 Available urgency options:', urgencyOptions);
  console.log('📝 Urgency enum values:', UpdateCartModifiersRequestUrgencyType);

  // Handle urgency type change
  const handleUrgencyChange = async (value: string) => {
    const urgencyType = value as UpdateCartModifiersRequestUrgencyType;
    setSelectedUrgency(urgencyType);
    
    const requestData: UpdateCartModifiersRequest = {
      urgencyType,
      ...(expectedDate && { expectedCompletionDate: expectedDate })
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
        ...(date && { expectedCompletionDate: date })
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