import React from 'react';
import { useUpdateCartModifiers, UpdateCartModifiersRequestDiscountType, UpdateCartModifiersRequest } from '@api/cart';
import { useOrderWizardCart } from './useOrderWizardCart';
import { useOrderWizardStore } from '@/features/order-wizard';
import { generateDiscountOptions, getDiscountPercentage } from '@/features/order-wizard/utils';

export const useDiscountParametersOperations = () => {
  const updateModifiersMutation = useUpdateCartModifiers();
  const { refreshCart } = useOrderWizardCart();

  const {
    selectedDiscount,
    customDiscountPercentage,
    setSelectedDiscount,
    setCustomDiscountPercentage
  } = useOrderWizardStore();

  const discountOptions = generateDiscountOptions(customDiscountPercentage);
  const showPercentageInput = selectedDiscount === 'OTHER';

  // Handle discount type change
  const handleDiscountChange = async (value: string) => {
    const discountType = value as UpdateCartModifiersRequestDiscountType;
    setSelectedDiscount(discountType);

    const expectedPercentage = getDiscountPercentage(discountType, customDiscountPercentage);
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
