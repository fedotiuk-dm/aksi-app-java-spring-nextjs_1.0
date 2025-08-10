import React from 'react';
import { useUpdateCartModifiers } from '@api/cart';
import { UpdateCartModifiersRequestDiscountType, UpdateCartModifiersRequest } from '@api/cart';
import { useOrderWizardCart } from './useOrderWizardCart';
import { useOrderWizardStore } from '@/features/order-wizard';

export const useDiscountParametersOperations = () => {
  const updateModifiersMutation = useUpdateCartModifiers();
  const { refreshCart } = useOrderWizardCart();
  
  const {
    selectedDiscount,
    customDiscountPercentage,
    setSelectedDiscount,
    setCustomDiscountPercentage
  } = useOrderWizardStore();

  // Get expected percentage for predefined discount types
  const getExpectedPercentage = (discountType: UpdateCartModifiersRequestDiscountType): number | undefined => {
    switch (discountType) {
      case 'EVERCARD':
      case 'MILITARY':
        return 10;
      case 'SOCIAL_MEDIA':
        return 5;
      case 'OTHER':
        return customDiscountPercentage;
      case 'NONE':
        return 0;
      default:
        return undefined;
    }
  };

  // Generate discount options with percentages and proper translations
  const discountOptions = Object.keys(UpdateCartModifiersRequestDiscountType).map(discount => {
    const discountType = discount as UpdateCartModifiersRequestDiscountType;
    const percentage = getExpectedPercentage(discountType);
    let label: string;
    
    switch (discountType) {
      case 'NONE':
        label = 'Без знижки';
        break;
      case 'EVERCARD':
        label = `Еверкард (${percentage}%)`;
        break;
      case 'SOCIAL_MEDIA':
        label = `Соцмережі (${percentage}%)`;
        break;
      case 'MILITARY':
        label = `ЗСУ (${percentage}%)`;
        break;
      case 'OTHER':
        label = 'Інше (власний відсоток)';
        break;
      default:
        label = discount.charAt(0) + discount.slice(1).toLowerCase().replace(/_/g, ' ');
    }
    
    return {
      value: discount,
      label
    };
  });

  // Show percentage input for OTHER discount type
  const showPercentageInput = selectedDiscount === 'OTHER';

  // Handle discount type change
  const handleDiscountChange = async (value: string) => {
    const discountType = value as UpdateCartModifiersRequestDiscountType;
    setSelectedDiscount(discountType);
    
    const expectedPercentage = getExpectedPercentage(discountType);
    const requestData: UpdateCartModifiersRequest = {
      discountType,
      ...(expectedPercentage !== undefined && { discountPercentage: expectedPercentage })
    };
    
    console.log('💰 Updating discount:', requestData);
    
    await updateModifiersMutation.mutateAsync({
      data: requestData
    });
    await refreshCart();
  };

  // Handle custom percentage change
  const handlePercentageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = Number(event.target.value);
    setCustomDiscountPercentage(percentage);
    
    if (selectedDiscount === 'OTHER' && percentage >= 0 && percentage <= 100) {
      console.log('💰 Updating custom discount percentage:', percentage);
      
      await updateModifiersMutation.mutateAsync({
        data: {
          discountType: selectedDiscount,
          discountPercentage: percentage
        }
      });
      await refreshCart();
    }
  };

  return {
    // Data
    discountOptions,
    selectedDiscount,
    customPercentage: customDiscountPercentage,
    showPercentageInput,
    
    // Operations
    handleDiscountChange,
    handlePercentageChange,
    
    // State
    isLoading: updateModifiersMutation.isPending,
    error: updateModifiersMutation.error
  };
};