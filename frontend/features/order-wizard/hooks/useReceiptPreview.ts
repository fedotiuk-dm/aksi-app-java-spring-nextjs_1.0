import { useGenerateReceiptPreview } from '@api/receipt';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useGetCustomer } from '@api/customer';
import { useGetBranchById } from '@api/branch';
import { useOrderWizardCart } from './useOrderWizardCart';

export const useReceiptPreview = () => {
  const { selectedCustomerId, selectedBranchId } = useOrderWizardStore();
  const { cart } = useOrderWizardCart();

  const previewMutation = useGenerateReceiptPreview();
  const customerQ = useGetCustomer(selectedCustomerId || '', {
    query: { enabled: !!selectedCustomerId },
  });
  const branchQ = useGetBranchById(selectedBranchId || '', {
    query: { enabled: !!selectedBranchId },
  });

  // Handle receipt preview
  const handleReceiptPreview = async () => {
    if (!cart?.id) return;

    try {
      const receiptData = {
        orderData: {
          // Використовуємо дані З КОШИКА ТА Orval-станів без ручних плейсхолдерів
          orderNumber: cart.id,
          branchName: branchQ.data?.name || '',
          branchAddress: branchQ.data?.address || '',
          branchPhone: branchQ.data?.phone || '',
          customerName: customerQ.data
            ? `${customerQ.data.firstName} ${customerQ.data.lastName}`
            : '',
          customerPhone: customerQ.data?.phonePrimary || '',
          items: (cart.items || []).map((item, index) => ({
            position: index + 1,
            name: item.priceListItem?.name || '-',
            // catalogNumber опційний; у summary немає явного каталожного номера - пропускаємо або ставимо id
            quantity: item?.quantity || 1,
            unitPrice: item.pricing?.basePrice ?? 0,
            totalPrice: item.pricing?.total ?? 0,
            modifiers:
              item.pricing?.modifierDetails?.map((md) => md.name) ||
              item.modifiers?.map((m) => m.name) ||
              [],
          })),
          subtotal: cart.pricing?.itemsSubtotal ?? 0,
          discount: cart.pricing?.discountAmount ?? 0,
          totalAmount: cart.pricing?.total ?? 0,
          createdAt: cart.createdAt,
        },
        locale: 'uk',
      };

      const previewBlob = await previewMutation.mutateAsync({ data: receiptData });
      const url = URL.createObjectURL(previewBlob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('❌ Preview generation failed:', error);
    }
  };

  return {
    handleReceiptPreview,
    canPreview: !!(cart?.id && selectedCustomerId && selectedBranchId),
    isGeneratingPreview: previewMutation.isPending,
    previewError: previewMutation.error,
  };
};
