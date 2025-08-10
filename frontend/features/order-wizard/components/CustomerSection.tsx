import React from 'react';
import { Box, Divider } from '@mui/material';
import { SectionHeader } from '@shared/ui/atoms';
import { CustomerSearch } from './customer/CustomerSearch';
import { CustomerForm } from './customer/CustomerForm';
import { OrderBasicInfo } from './customer/OrderBasicInfo';

export const CustomerSection: React.FC = () => {
  return (
    <Box>
      <SectionHeader 
        title="Клієнт та інформація замовлення"
        sx={{ mb: 2 }}
      />
      
      <CustomerSearch />
      
      <CustomerForm />
      
      <Divider sx={{ my: 3 }} />
      
      <OrderBasicInfo />
    </Box>
  );
};