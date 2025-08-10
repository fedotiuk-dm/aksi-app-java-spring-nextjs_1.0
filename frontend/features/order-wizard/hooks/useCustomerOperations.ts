import { useCreateCustomer, type CreateCustomerRequest } from '@api/customer';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useCartOperations } from './useCartOperations';
import { useCartStore } from '@/features/cart';

export const useCustomerOperations = () => {
  const { setSelectedCustomer } = useOrderWizardStore();
  const { setSelectedCustomer: setGlobalSelectedCustomer } = useCartStore();
  const createCustomerMutation = useCreateCustomer();
  const { activateCustomer, isActivatingCustomer } = useCartOperations(false); // Mutations only, no cart loading

  const createAndActivateCustomer = async (customerData: CreateCustomerRequest) => {
    const newCustomer = await createCustomerMutation.mutateAsync({
      data: customerData,
    });

    await activateCustomer({ customerId: newCustomer.id });

    // Sync both stores
    setSelectedCustomer(newCustomer);
    setGlobalSelectedCustomer(newCustomer);
    return newCustomer;
  };

  const activateExistingCustomer = async (customer: any) => {
    await activateCustomer({ customerId: customer.id });
    // Sync both stores
    setSelectedCustomer(customer);
    setGlobalSelectedCustomer(customer);
  };

  return {
    createAndActivateCustomer,
    activateExistingCustomer,
    isCreating: createCustomerMutation.isPending,
    isActivating: isActivatingCustomer,
    isLoading: createCustomerMutation.isPending || isActivatingCustomer,
  };
};