'use client';

import { CheckCircle } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import { FC } from 'react';

import { OrderLocationInfo } from './OrderLocationInfo';
import { OrderReceiptInfo } from './OrderReceiptInfo';
import { OrderTimingInfo } from './OrderTimingInfo';

interface OrderData {
  id?: string;
  receiptNumber: string;
  tagNumber?: string;
  createdDate?: Date | string;
  expectedCompletionDate?: Date | string;
  branchLocation: {
    id?: string;
    name: string;
    address?: string;
    phone?: string;
    code?: string;
  };
}

interface OrderCreationSummaryProps {
  order: OrderData;
  compact?: boolean;
}

/**
 * Компонент для відображення підсумку створеного замовлення
 * Розділяє інформацію на логічні блоки для кращого UX
 */
export const OrderCreationSummary: FC<OrderCreationSummaryProps> = ({ order, compact = false }) => {
  return (
    <Box>
      {/* Заголовок успіху */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          p: 2,
          bgcolor: 'success.light',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'success.main',
        }}
      >
        <CheckCircle sx={{ color: 'success.main', mr: 2, fontSize: 32 }} />
        <Typography variant="h6" sx={{ color: 'success.dark', fontWeight: 600 }}>
          Замовлення успішно створено!
        </Typography>
      </Box>

      {/* Інформаційні картки */}
      <Grid container spacing={3}>
        {/* Основна інформація про квитанцію */}
        <Grid size={{ xs: 12, md: 6 }}>
          <OrderReceiptInfo
            receiptNumber={order.receiptNumber}
            tagNumber={order.tagNumber}
            compact={compact}
          />
        </Grid>

        {/* Інформація про терміни */}
        <Grid size={{ xs: 12, md: 6 }}>
          <OrderTimingInfo
            createdDate={order.createdDate}
            expectedCompletionDate={order.expectedCompletionDate}
            compact={compact}
          />
        </Grid>

        {/* Інформація про філію */}
        <Grid size={{ xs: 12 }}>
          <OrderLocationInfo branchLocation={order.branchLocation} compact={compact} />
        </Grid>
      </Grid>
    </Box>
  );
};
