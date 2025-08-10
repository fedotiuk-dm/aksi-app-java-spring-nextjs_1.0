import { useState } from 'react';
import { useListCustomers } from '@api/customer';
import { useCustomerOperations } from './useCustomerOperations';
import { useOrderWizardStore } from '@/features/order-wizard';

export const useCustomerSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedCustomer } = useOrderWizardStore();
  const { activateExistingCustomer, isActivating } = useCustomerOperations();

  const { data: searchResults, isLoading } = useListCustomers(
    searchQuery.length >= 2 ? { search: searchQuery } : undefined,
    {
      query: {
        enabled: searchQuery.length >= 2,
        staleTime: 1000 * 60 * 2, // 2 minutes
      },
    }
  );

  const handleCustomerSelect = async (customer: any) => {
    if (!customer) return;

    try {
      await activateExistingCustomer(customer);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to activate customer:', error);
    }
  };

  const getOptionLabel = (option: any) =>
    `${option.lastName} ${option.firstName} - ${option.phonePrimary}`;

  return {
    searchResults: searchResults?.data || [],
    searchQuery,
    setSearchQuery,
    selectedCustomer,
    handleCustomerSelect,
    getOptionLabel,
    isLoading: isLoading || isActivating,
  };
};