import { useCreateCustomer, type CreateCustomerRequest, type CustomerInfo } from '@api/customer';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useCartOperations } from './useCartOperations';

export const useCustomerOperations = () => {
  const { setSelectedCustomerId } = useOrderWizardStore();
  const createCustomerMutation = useCreateCustomer();
  const { activateCustomer, isActivatingCustomer } = useCartOperations(false); // Mutations only, no cart loading

  const createAndActivateCustomer = async (customerData: CreateCustomerRequest) => {
    const newCustomer = await createCustomerMutation.mutateAsync({
      data: customerData,
    });

    await activateCustomer({ customerId: newCustomer.id });

    setSelectedCustomerId(newCustomer.id);
    return newCustomer;
  };

  const activateExistingCustomer = async (customer: CustomerInfo) => {
    await activateCustomer({ customerId: customer.id });
    setSelectedCustomerId(customer.id);
  };

  return {
    createAndActivateCustomer,
    activateExistingCustomer,
    isCreating: createCustomerMutation.isPending,
    isActivating: isActivatingCustomer,
    isLoading: createCustomerMutation.isPending || isActivatingCustomer,
  };
};
