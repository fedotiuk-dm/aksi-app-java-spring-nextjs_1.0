import { useState } from 'react';
import { useCreateOrder } from '@api/order';
import { useGenerateOrderReceipt } from '@api/receipt';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useOrderWizardCart } from './useOrderWizardCart';
import { useCustomerState } from './useCustomerState';
import { canCreateOrder, getOrderCreationDebugInfo } from '@/features/order-wizard/utils';

export const useOrderCompletionOperations = () => {
  const { 
    uniqueLabel,
    customerSignature,
    agreementAccepted,
    setAgreementAccepted
  } = useOrderWizardStore();
  
  const { selectedCustomer, selectedBranch } = useCustomerState();
  const { cart } = useOrderWizardCart();
  const createOrderMutation = useCreateOrder();
  
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Get final receipt after order creation
  const receiptQuery = useGenerateOrderReceipt(orderId || '', undefined, {
    query: {
      enabled: !!orderId
    }
  });

  // Handle agreement checkbox
  const handleAgreementChange = (checked: boolean) => {
    setAgreementAccepted(checked);
  };

  const canCreate = canCreateOrder(selectedCustomer, selectedBranch, cart, customerSignature, agreementAccepted);
  
  // Debug logging for development
  console.log('🔍 Order creation check:', 
    getOrderCreationDebugInfo(selectedCustomer, selectedBranch, cart, customerSignature, agreementAccepted)
  );

  // Create order
  const handleCreateOrder = async () => {
    if (!canCreate || !cart?.id || !selectedBranch?.id) return;

    try {
      const orderData = {
        cartId: cart.id,
        branchId: selectedBranch.id,
        uniqueLabel: uniqueLabel || undefined,
        customerSignature: customerSignature.trim(),
        termsAccepted: agreementAccepted
      };

      console.log('📋 Creating order with data:', orderData);

      const result = await createOrderMutation.mutateAsync({
        data: orderData
      });

      console.log('✅ Order created successfully with signature:', result);
      
      setOrderCreated(true);
      setOrderId(result.id);
      
    } catch (error) {
      console.error('❌ Order creation failed:', error);
    }
  };

  const downloadReceipt = () => {
    if (receiptQuery.data) {
      const url = URL.createObjectURL(receiptQuery.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return {
    // Form state
    agreementAccepted,
    handleAgreementChange,
    
    // Order creation
    handleCreateOrder,
    canCreateOrder: canCreate,
    isCreatingOrder: createOrderMutation.isPending,
    
    // Receipt download
    downloadReceipt,
    receiptData: receiptQuery.data,
    isLoadingReceipt: receiptQuery.isLoading,
    
    // Order result
    orderCreated,
    orderId,
    
    // Error state
    error: createOrderMutation.error
  };
};