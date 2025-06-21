'use client';

import { Box, Stack } from '@mui/material';
import { OrderParameters } from './OrderParameters';
import { FinancialSummary } from './FinancialSummary';
import { OrderCompletion } from './OrderCompletion';

export const SummarySection = () => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack spacing={2} sx={{ flex: 1 }}>
        {/* Параметри замовлення */}
        <Box>
          <OrderParameters />
        </Box>

        {/* Фінансовий підсумок */}
        <Box>
          <FinancialSummary />
        </Box>

        {/* Завершення замовлення */}
        <Box sx={{ mt: 'auto' }}>
          <OrderCompletion />
        </Box>
      </Stack>
    </Box>
  );
};
