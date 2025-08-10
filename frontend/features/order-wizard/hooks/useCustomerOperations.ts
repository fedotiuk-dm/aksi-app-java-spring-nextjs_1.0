import { useCreateCustomer, type CreateCustomerRequest } from '@api/customer';
import { useActivateCustomerForCart } from '@api/cart';
import { useOrderWizardStore } from '@/features/order-wizard';

export const useCustomerOperations = () => {
  const { setSelectedCustomer } = useOrderWizardStore();
  const createCustomerMutation = useCreateCustomer();
  const activateCustomerMutation = useActivateCustomerForCart();

  const createAndActivateCustomer = async (customerData: CreateCustomerRequest) => {
    const newCustomer = await createCustomerMutation.mutateAsync({
      data: customerData,
    });

    await activateCustomerMutation.mutateAsync({ 
      data: { customerId: newCustomer.id } 
    });

    setSelectedCustomer(newCustomer);
    return newCustomer;
  };

  const activateExistingCustomer = async (customer: any) => {
    await activateCustomerMutation.mutateAsync({ 
      data: { customerId: customer.id } 
    });
    setSelectedCustomer(customer);
  };

  return {
    createAndActivateCustomer,
    activateExistingCustomer,
    isCreating: createCustomerMutation.isPending,
    isActivating: activateCustomerMutation.isPending,
    isLoading: createCustomerMutation.isPending || activateCustomerMutation.isPending,
  };
};