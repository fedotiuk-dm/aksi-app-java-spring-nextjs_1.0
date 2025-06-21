'use client';

import { Box, Stack } from '@mui/material';
import { useOrderOnepageStore, useIsItemDialogOpen } from '../store/order-onepage.store';
import { ItemsTable } from './ItemsTable';
import { ItemDialog } from './ItemDialog';
import { PriceCalculatorSummary } from './PriceCalculatorSummary';

export const ItemsSection = () => {
  const isItemDialogOpen = useIsItemDialogOpen();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack spacing={2} sx={{ flex: 1 }}>
        {/* Таблиця предметів */}
        <Box sx={{ flex: 1 }}>
          <ItemsTable />
        </Box>

        {/* Підсумок розрахунків */}
        <Box>
          <PriceCalculatorSummary />
        </Box>
      </Stack>

      {/* Діалог додавання/редагування предмета */}
      {isItemDialogOpen && <ItemDialog />}
    </Box>
  );
};
