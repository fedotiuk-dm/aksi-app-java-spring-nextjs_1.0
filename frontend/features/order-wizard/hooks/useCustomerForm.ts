import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type CreateCustomerRequest, createCustomerBody } from '@api/customer';
import { useCustomerOperations } from './useCustomerOperations';
import { useOrderWizardStore } from '@/features/order-wizard';

const CUSTOMER_FORM_DEFAULTS: CreateCustomerRequest = {
  firstName: '',
  lastName: '',
  phonePrimary: '',
  email: '',
  contactPreferences: [],
  infoSource: undefined,
};

export const useCustomerForm = () => {
  const { setCustomerFormOpen } = useOrderWizardStore();
  const { createAndActivateCustomer, isLoading } = useCustomerOperations();

  const form = useForm<CreateCustomerRequest>({
    resolver: zodResolver(createCustomerBody),
    defaultValues: CUSTOMER_FORM_DEFAULTS,
  });

  const { control, handleSubmit, reset, watch, formState: { errors } } = form;
  const watchedContactPreferences = watch('contactPreferences') || [];

  const handleCreateCustomer = handleSubmit(async (data) => {
    try {
      await createAndActivateCustomer(data);
      setCustomerFormOpen(false);
      reset();
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  });

  const handleCancel = () => {
    setCustomerFormOpen(false);
    reset();
  };

  return {
    control,
    errors,
    watchedContactPreferences,
    handleCreateCustomer,
    handleCancel,
    isLoading,
  };
};