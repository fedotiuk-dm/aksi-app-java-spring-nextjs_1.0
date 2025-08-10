import React from 'react';
import { Box, Divider } from '@mui/material';
import { SectionHeader } from '@shared/ui/atoms';
import { ExecutionParameters } from './ExecutionParameters';
import { DiscountParameters } from './DiscountParameters';
import { FinancialSummary } from './FinancialSummary';
import { OrderCompletion } from './OrderCompletion';

export const SummarySection: React.FC = () => {
  return (
    <Box>
      <SectionHeader 
        title="Підсумки замовлення"
      />
      
      <Box sx={{ mt: 2 }}>
        <ExecutionParameters />
        
        <Divider sx={{ my: 2 }} />
        
        <DiscountParameters />
        
        <Divider sx={{ my: 2 }} />
        
        <FinancialSummary />
        
        <Divider sx={{ my: 2 }} />
        
        <OrderCompletion />
      </Box>
    </Box>
  );
};