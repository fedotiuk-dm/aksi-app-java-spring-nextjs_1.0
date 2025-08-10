import { useState } from 'react';
import { useCreateOrder, useSaveCustomerSignature } from '@api/order';
import { useGenerateOrderReceipt } from '@api/receipt';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useOrderWizardCart } from './useOrderWizardCart';

export const useOrderCompletionOperations = () => {
  const { 
    selectedCustomer, 
    selectedBranch, 
    uniqueLabel,
    customerSignature,
    agreementAccepted,
    setAgreementAccepted
  } = useOrderWizardStore();
  const { cart } = useOrderWizardCart();
  const createOrderMutation = useCreateOrder();
  const saveSignatureMutation = useSaveCustomerSignature();
  
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

  // Check if order can be created
  const canCreateOrder = !!(
    selectedCustomer && 
    selectedBranch && 
    cart?.id && 
    customerSignature.trim() &&
    agreementAccepted &&
    (cart?.items?.length || 0) > 0
  );
  
  // Debug logging
  console.log('🔍 Order creation check:', {
    selectedCustomer: !!selectedCustomer,
    selectedBranch: !!selectedBranch,
    cartId: !!cart?.id,
    hasSignature: !!customerSignature.trim(),
    agreementAccepted,
    hasItems: (cart?.items?.length || 0) > 0,
    canCreateOrder
  });

  // Create order
  const handleCreateOrder = async () => {
    if (!canCreateOrder || !cart?.id || !selectedBranch?.id) return;

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

      console.log('✅ Order created successfully:', result);
      
      setOrderCreated(true);
      setOrderId(result.id);
      
      // Save signature after order creation
      if (customerSignature.trim()) {
        try {
          await saveSignatureMutation.mutateAsync({
            orderId: result.id,
            data: {
              signature: customerSignature.trim()
            }
          });
          console.log('✅ Signature saved successfully');
        } catch (signatureError) {
          console.error('❌ Signature save failed:', signatureError);
        }
      }
      
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
    canCreateOrder,
    isCreatingOrder: createOrderMutation.isPending,
    
    // Receipt download
    downloadReceipt,
    receiptData: receiptQuery.data,
    isLoadingReceipt: receiptQuery.isLoading,
    
    // Order result
    orderCreated,
    orderId,
    
    // Error state
    error: createOrderMutation.error || saveSignatureMutation.error
  };
};