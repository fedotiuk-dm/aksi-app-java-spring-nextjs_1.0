import { useState } from 'react';
import { useGenerateReceiptPreview } from '@api/receipt';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useOrderWizardCart } from './useOrderWizardCart';

export const useReceiptPreview = () => {
  const { selectedCustomer, selectedBranch } = useOrderWizardStore();
  const { cart } = useOrderWizardCart();
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  
  const previewMutation = useGenerateReceiptPreview();
  
  // Handle receipt preview
  const handleReceiptPreview = async () => {
    if (!cart?.id || !selectedCustomer || !selectedBranch) return;
    
    try {
      console.log('🔍 Cart structure for debug:', cart);
      console.log('🔍 First item structure:', cart.items[0]);
      
      // Let backend build receipt data from cart
      const receiptData = {
        orderData: {
          orderNumber: `PREVIEW-${Date.now()}`,
          branchName: selectedBranch.name,
          branchAddress: selectedBranch.address || '',
          branchPhone: selectedBranch.phone || '',
          customerName: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
          customerPhone: selectedCustomer.phonePrimary || '',
          items: cart.items.map((item, index) => ({
            position: index + 1,
            name: item.priceListItem.name,
            catalogNumber: item.priceListItem.id,
            quantity: item.quantity || 1,
            unitPrice: item.pricing.basePrice,
            totalPrice: item.pricing.total,
            modifiers: item.modifiers?.map(m => m.name) || []
          })),
          subtotal: cart.pricing.itemsSubtotal || 0,
          discount: cart.pricing.discountAmount || 0,
          totalAmount: cart.pricing.total,
          paymentMethod: 'CASH' as const,
          createdAt: new Date().toISOString()
        },
        locale: 'uk'
      };

      console.log('📋 Generating receipt preview for cart:', cart.id);
      const previewBlob = await previewMutation.mutateAsync({ data: receiptData });
      
      const url = URL.createObjectURL(previewBlob);
      window.open(url, '_blank');
      
      setShowReceiptPreview(true);
    } catch (error) {
      console.error('❌ Preview generation failed:', error);
    }
  };

  return {
    handleReceiptPreview,
    showReceiptPreview,
    canPreview: !!(cart?.id && selectedCustomer && selectedBranch),
    isGeneratingPreview: previewMutation.isPending,
    previewError: previewMutation.error
  };
};