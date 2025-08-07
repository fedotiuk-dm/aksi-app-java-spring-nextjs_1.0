'use client';

import React from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { useListCustomers, type CustomerInfo } from '@/shared/api/generated/customer';
import { useCartStore } from '@/features/cart';

export const CustomerSelector: React.FC = () => {
  const { selectedCustomer, setSelectedCustomer } = useCartStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Завантажуємо клієнтів з пошуком
  const { 
    data: customersData, 
    isLoading 
  } = useListCustomers(
    searchQuery.length >= 2 ? { search: searchQuery } : {},
    {
      query: {
        enabled: searchQuery.length >= 2 || selectedCustomer !== null,
      }
    }
  );

  const customers = customersData?.customers || [];

  const handleCustomerChange = (_: any, customer: CustomerInfo | null) => {
    setSelectedCustomer(customer);
  };

  const handleInputChange = (_: any, value: string) => {
    setSearchQuery(value);
  };

  const getOptionLabel = (customer: CustomerInfo) => {
    return `${customer.firstName} ${customer.lastName} (${customer.phonePrimary})`;
  };

  const renderOption = (props: any, customer: CustomerInfo) => (
    <Box component="li" {...props}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
        <Person fontSize="small" color="action" />
        <Box>
          <Typography variant="body2">
            {customer.firstName} {customer.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {customer.phonePrimary}
            {customer.email && ` • ${customer.email}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Autocomplete
      value={selectedCustomer}
      onChange={handleCustomerChange}
      onInputChange={handleInputChange}
      options={customers}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      loading={isLoading}
      loadingText="Завантаження..."
      noOptionsText={searchQuery.length < 2 ? "Введіть мінімум 2 символи" : "Клієнтів не знайдено"}
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Пошук клієнта за ім'ям або телефоном..."
          variant="outlined"
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
            endAdornment: (
              <>
                {isLoading && <CircularProgress size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};