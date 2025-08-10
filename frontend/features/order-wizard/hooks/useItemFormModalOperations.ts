import { useOrderWizardStore } from '@/features/order-wizard';
import { useItemFormOperations } from './useItemFormOperations';

/**
 * Business logic for ItemForm modal operations
 * Handles modal state and form submission orchestration
 */
export const useItemFormModalOperations = () => {
  const { editingItemId, setEditingItemId } = useOrderWizardStore();
  const {
    addItemToCart,
    resetForm,
    isLoading,
    canSubmit,
    error
  } = useItemFormOperations();

  // Modal state logic
  const isOpen = editingItemId === 'new' || !!editingItemId;
  const isEditing = editingItemId !== null && editingItemId !== 'new';

  // Modal operations
  const openModal = () => {
    setEditingItemId('new');
  };

  const closeModal = () => {
    resetForm();
    setEditingItemId(null);
  };

  const handleToggle = () => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  // Form submission
  const handleSubmit = async () => {
    await addItemToCart();
  };

  const handleCancel = () => {
    resetForm();
    setEditingItemId(null);
  };

  return {
    // Modal state
    isOpen,
    isEditing,
    
    // Modal operations
    openModal,
    closeModal,
    handleToggle,
    
    // Form operations
    handleSubmit,
    handleCancel,
    
    // Form state
    isLoading,
    canSubmit,
    error
  };
};