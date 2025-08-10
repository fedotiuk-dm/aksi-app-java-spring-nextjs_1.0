import React, { useState } from 'react';
import { useCreateOrder } from '@api/order';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useOrderWizardCart } from './useOrderWizardCart';

export const useOrderCompletionOperations = () => {
  const { selectedCustomer, selectedBranch, uniqueLabel } = useOrderWizardStore();
  const { cart } = useOrderWizardCart();
  const createOrderMutation = useCreateOrder();
  
  const [signature, setSignature] = useState('');
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Handle signature input
  const handleSignatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignature(event.target.value);
  };

  // Check if order can be created
  const canCreateOrder = !!(
    selectedCustomer && 
    selectedBranch && 
    cart?.id && 
    signature.trim() &&
    cart.items.length > 0
  );

  // Create order
  const handleCreateOrder = async () => {
    if (!canCreateOrder || !cart?.id || !selectedBranch?.id) return;

    try {
      const orderData = {
        cartId: cart.id,
        branchId: selectedBranch.id,
        uniqueLabel: uniqueLabel || undefined,
        customerSignature: signature.trim()
      };

      console.log('📋 Creating order with data:', orderData);

      const result = await createOrderMutation.mutateAsync({
        data: orderData
      });

      console.log('✅ Order created successfully:', result);
      
      setOrderCreated(true);
      setOrderId(result.id);
      
    } catch (error) {
      console.error('❌ Order creation failed:', error);
    }
  };

  return {
    // Form state
    signature,
    handleSignatureChange,
    
    // Order creation
    handleCreateOrder,
    canCreateOrder,
    isCreatingOrder: createOrderMutation.isPending,
    
    // Order result
    orderCreated,
    orderId,
    
    // Error state
    error: createOrderMutation.error
  };
};