import React from 'react';
import { UpdateCartModifiersRequestDiscountType } from '@api/cart';
import { useOrderWizardStore } from '@/features/order-wizard';
import { generateDiscountOptions, getDiscountPercentage } from '@/features/order-wizard/utils';
import { useCartOperations } from './useCartOperations';

export const useDiscountParametersOperations = () => {
  const { updateModifiers, isUpdatingModifiers, errors } = useCartOperations(true);

  const {
    selectedDiscount,
    customDiscountPercentage,
    setSelectedDiscount,
    setCustomDiscountPercentage
  } = useOrderWizardStore();

  const discountOptions = generateDiscountOptions(customDiscountPercentage);
  const showPercentageInput = selectedDiscount === 'OTHER';

  // Handle discount type change
  const handleDiscountChange = async (type: string, pct?: number) => {
    if (isUpdatingModifiers) return; // Mutex protection

    const discountType = type as UpdateCartModifiersRequestDiscountType;
    setSelectedDiscount(discountType);

    // Get correct percentage for the discount type
    const correctPercentage = getDiscountPercentage(discountType, customDiscountPercentage);
    
    // Correct payload formation
    const payload = discountType === 'OTHER' 
      ? { discountType, discountPercentage: pct ?? 0 }
      : correctPercentage !== undefined 
        ? { discountType, discountPercentage: correctPercentage }
        : { discountType };

    await updateModifiers(payload);
  };

  // Handle custom percentage change with debounce protection
  const handlePercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = Number(event.target.value);
    setCustomDiscountPercentage(percentage);
  };

  const handlePercentageBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const percentage = Number(event.target.value);
    
    if (selectedDiscount === 'OTHER' && percentage >= 0 && percentage <= 100 && !isUpdatingModifiers) {
      await updateModifiers({
        discountType: selectedDiscount,
        discountPercentage: percentage
      });
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
    handlePercentageBlur,

    // State
    isLoading: isUpdatingModifiers,
    error: errors.updateModifiers
  };
};
