import type { CustomerInfo, BranchInfo } from '@api/customer';
import type { CartInfo } from '@api/cart';

export const canCreateOrder = (
  selectedCustomer: CustomerInfo | undefined,
  selectedBranch: BranchInfo | undefined,
  cart: CartInfo | undefined,
  customerSignature: string,
  agreementAccepted: boolean
): boolean => {
  return !!(
    selectedCustomer && 
    selectedBranch && 
    cart?.id && 
    customerSignature.trim() &&
    agreementAccepted &&
    (cart?.items?.length || 0) > 0
  );
};

export const getOrderCreationDebugInfo = (
  selectedCustomer: CustomerInfo | undefined,
  selectedBranch: BranchInfo | undefined,
  cart: CartInfo | undefined,
  customerSignature: string,
  agreementAccepted: boolean
) => ({
  selectedCustomer: !!selectedCustomer,
  selectedBranch: !!selectedBranch,
  cartId: !!cart?.id,
  hasSignature: !!customerSignature.trim(),
  agreementAccepted,
  hasItems: (cart?.items?.length || 0) > 0,
  canCreateOrder: canCreateOrder(selectedCustomer, selectedBranch, cart, customerSignature, agreementAccepted)
});