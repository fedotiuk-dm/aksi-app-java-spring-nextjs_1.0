import { useState } from 'react';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useOrderWizardCart } from './useOrderWizardCart';
import { canSubmitItemForm } from '../utils/item.utils';
import type { AddCartItemRequest, ItemCharacteristics } from '@api/cart';

export const useItemFormOperations = () => {
  const { editingItemId, setEditingItemId, selectedItemId, selectedModifiers, resetSelectedModifiers } = useOrderWizardStore();
  const { addItem, updateItem, isAddingItem, isUpdatingItem, errors } = useOrderWizardCart();
  
  const [quantity, setQuantity] = useState(1);
  const [characteristics, setCharacteristics] = useState<ItemCharacteristics>({
    color: '',
    material: ''
  });

  const isEditing = editingItemId !== null && editingItemId !== 'new';
  const isLoading = isAddingItem || isUpdatingItem;

  const resetForm = () => {
    setQuantity(1);
    setCharacteristics({
      color: '',
      material: ''
    });
    resetSelectedModifiers();
    setEditingItemId(null);
  };

  const resetFormWithoutModifiers = () => {
    setQuantity(1);
    setCharacteristics({
      color: '',
      material: ''
    });
    setEditingItemId(null);
  };

  const addItemToCart = async () => {
    if (!selectedItemId) return;

    const itemData: AddCartItemRequest = {
      priceListItemId: selectedItemId,
      quantity,
      characteristics,
      modifierCodes: selectedModifiers
    };
    
    console.log('🛒 Adding item to cart:', itemData);

    if (isEditing && editingItemId !== 'new') {
      await updateItem(editingItemId, itemData);
      resetForm();
    } else {
      await addItem(itemData);
      resetFormWithoutModifiers();
    }
  };

  const canSubmit = canSubmitItemForm(selectedItemId, quantity);

  return {
    // Form state
    quantity,
    setQuantity,
    characteristics,
    setCharacteristics,
    selectedModifiers,
    
    // Operations
    addItemToCart,
    resetForm,
    
    // UI state
    isEditing,
    isLoading,
    canSubmit,
    
    // Validation
    error: errors.addItem || errors.updateItem
  };
};