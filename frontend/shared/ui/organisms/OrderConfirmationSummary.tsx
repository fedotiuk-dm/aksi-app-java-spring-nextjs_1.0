'use client';

import { Grid, Box, Typography } from '@mui/material';
import React from 'react';

import { OrderInfoCard, ClientInfoCard, FinancialSummaryCard } from '../molecules';

import { OrderItemsTable, OrderItemData } from './OrderItemsTable';

interface OrderConfirmationSummaryProps {
  // Order info
  receiptNumber: string;
  uniqueTag: string;
  createdDate: string;
  executionDate: string;

  // Client info
  clientName: string;
  clientPhone: string;
  clientContactMethod?: string;
  clientAddress?: string;

  // Branch info
  branchName?: string;
  branchAddress?: string;

  // Items
  items: OrderItemData[];

  // Financial info
  baseAmount: number;
  modifiersAmount?: number;
  subtotal: number;
  urgencySurcharge?: number;
  discountType?: string;
  discountPercent?: number;
  discountAmount?: number;
  finalTotal: number;
  paidAmount?: number;
  remainingDebt?: number;
  paymentMethod?: string;

  // Display options
  compact?: boolean;
  showItemDetails?: boolean;
  orderStatus?: 'draft' | 'confirmed' | 'processing' | 'completed';
}

/**
 * Компонент для повного підсумку замовлення в підтвердженні
 */
export const OrderConfirmationSummary: React.FC<OrderConfirmationSummaryProps> = ({
  receiptNumber,
  uniqueTag,
  createdDate,
  executionDate,
  clientName,
  clientPhone,
  clientContactMethod,
  clientAddress,
  branchName,
  branchAddress,
  items,
  baseAmount,
  modifiersAmount,
  subtotal,
  urgencySurcharge,
  discountType,
  discountPercent,
  discountAmount,
  finalTotal,
  paidAmount,
  remainingDebt,
  paymentMethod,
  compact = false,
  showItemDetails = true,
  orderStatus,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Заголовок */}
      <Typography variant="h5" component="h1" gutterBottom>
        Підтвердження замовлення
      </Typography>

      <Grid container spacing={3}>
        {/* Інформація про замовлення */}
        <Grid size={{ xs: 12 }}>
          <OrderInfoCard
            receiptNumber={receiptNumber}
            uniqueTag={uniqueTag}
            createdDate={createdDate}
            executionDate={executionDate}
            status={orderStatus}
          />
        </Grid>

        {/* Інформація про клієнта */}
        <Grid size={{ xs: 12 }}>
          <ClientInfoCard
            name={clientName}
            phone={clientPhone}
            contactMethod={clientContactMethod}
            address={clientAddress}
            branchName={branchName}
            branchAddress={branchAddress}
          />
        </Grid>

        {/* Таблиця предметів */}
        <OrderItemsTable items={items} showDetails={showItemDetails} compact={compact} />

        {/* Фінансова інформація */}
        <Grid size={{ xs: 12 }}>
          <FinancialSummaryCard
            baseAmount={baseAmount}
            modifiersAmount={modifiersAmount}
            subtotal={subtotal}
            urgencySurcharge={urgencySurcharge}
            discountType={discountType}
            discountPercent={discountPercent}
            discountAmount={discountAmount}
            finalTotal={finalTotal}
            paidAmount={paidAmount}
            remainingDebt={remainingDebt}
            paymentMethod={paymentMethod}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
