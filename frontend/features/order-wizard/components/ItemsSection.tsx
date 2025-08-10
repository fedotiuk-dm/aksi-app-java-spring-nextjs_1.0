import React from 'react';
import { Box, Divider } from '@mui/material';
import { SectionHeader } from '@shared/ui/atoms';
import { ItemsTable } from './items/ItemsTable';
import { ItemForm } from './items/ItemForm';
import { LivePricingCalculator } from './items/LivePricingCalculator';

export const ItemsSection: React.FC = () => {
  return (
    <Box>
      <SectionHeader 
        title="Предмети та розрахунки"
        sx={{ mb: 2 }}
      />
      
      <ItemsTable />
      
      <Divider sx={{ my: 3 }} />
      
      <ItemForm />
      
      <Divider sx={{ my: 3 }} />
      
      <LivePricingCalculator />
    </Box>
  );
};