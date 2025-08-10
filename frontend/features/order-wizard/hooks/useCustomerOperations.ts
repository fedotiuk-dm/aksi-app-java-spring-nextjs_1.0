import { useCreateCustomer, type CreateCustomerRequest } from '@api/customer';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useCartOperations } from './useCartOperations';

export const useCustomerOperations = () => {
  const { setSelectedCustomer } = useOrderWizardStore();
  const createCustomerMutation = useCreateCustomer();
  const { activateCustomer, isActivatingCustomer } = useCartOperations(false); // Mutations only, no cart loading

  const createAndActivateCustomer = async (customerData: CreateCustomerRequest) => {
    const newCustomer = await createCustomerMutation.mutateAsync({
      data: customerData,
    });

    await activateCustomer({ customerId: newCustomer.id });

    setSelectedCustomer(newCustomer);
    return newCustomer;
  };

  const activateExistingCustomer = async (customer: any) => {
    await activateCustomer({ customerId: customer.id });
    setSelectedCustomer(customer);
  };

  return {
    createAndActivateCustomer,
    activateExistingCustomer,
    isCreating: createCustomerMutation.isPending,
    isActivating: isActivatingCustomer,
    isLoading: createCustomerMutation.isPending || isActivatingCustomer,
  };
};