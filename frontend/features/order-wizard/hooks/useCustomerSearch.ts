import { useState } from 'react';
import { useListCustomers, type CustomerInfo } from '@api/customer';
import { useCustomerOperations } from './useCustomerOperations';
import { useCustomerState } from './useCustomerState';

export const useCustomerSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedCustomer } = useCustomerState();
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

  const handleCustomerSelect = async (customer: CustomerInfo | null) => {
    if (!customer) return;

    try {
      await activateExistingCustomer(customer);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to activate customer:', error);
    }
  };

  const getOptionLabel = (option: CustomerInfo) =>
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
