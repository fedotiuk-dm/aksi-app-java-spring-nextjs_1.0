import React from 'react';
import { Box } from '@mui/material';
import { AutocompleteSearch, SelectedEntityCard } from '@shared/ui/molecules';
import { useCustomerSearch } from '@/features/order-wizard/hooks/useCustomerSearch';

export const CustomerSearch: React.FC = () => {
  const {
    searchResults,
    searchQuery,
    setSearchQuery,
    selectedCustomer,
    handleCustomerSelect,
    getOptionLabel,
    isLoading
  } = useCustomerSearch();

  return (
    <Box sx={{ mb: 2 }}>
      <AutocompleteSearch
        options={searchResults}
        getOptionLabel={getOptionLabel}
        loading={isLoading}
        value={selectedCustomer || null}
        onChange={handleCustomerSelect}
        inputValue={searchQuery}
        onInputChange={setSearchQuery}
        label="Пошук клієнта"
        placeholder="Прізвище, ім'я, телефон..."
        showQrScanner={true}
      />

      {selectedCustomer && (
        <SelectedEntityCard
          title={`${selectedCustomer.lastName} ${selectedCustomer.firstName}`}
          subtitle={selectedCustomer.phonePrimary}
          secondaryText={selectedCustomer.email}
          sx={{ mt: 2 }}
        />
      )}
    </Box>
  );
};