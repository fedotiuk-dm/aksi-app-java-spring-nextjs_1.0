'use client';

import { Grid, Card, CardContent, Typography, Divider } from '@mui/material';
import React from 'react';

interface OrderInfo {
  receiptNumber: string;
  uniqueTag: string;
  createdDate: string;
  executionDate: string;
}

interface ClientInfo {
  name: string;
  phone: string;
  contactMethod: string;
  address: string;
}

interface BranchInfo {
  name: string;
  address: string;
}

interface OrderSummaryInfoProps {
  orderInfo: OrderInfo;
  clientInfo: ClientInfo;
  branchInfo: BranchInfo;
}

/**
 * Компонент для відображення загальної інформації про замовлення
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення інформації замовлення
 * - Отримує готові дані через пропси
 * - Не містить бізнес-логіки
 */
export const OrderSummaryInfo: React.FC<OrderSummaryInfoProps> = ({
  orderInfo,
  clientInfo,
  branchInfo,
}) => {
  return (
    <Grid size={{ xs: 12 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Інформація про замовлення
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Номер квитанції
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {orderInfo.receiptNumber}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Унікальна мітка
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {orderInfo.uniqueTag}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Дата створення
              </Typography>
              <Typography variant="body1">{orderInfo.createdDate}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Дата готовності
              </Typography>
              <Typography variant="body1" color="primary">
                {orderInfo.executionDate}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            Інформація про клієнта
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2">
                <strong>ПІБ:</strong> {clientInfo.name}
              </Typography>
              <Typography variant="body2">
                <strong>Телефон:</strong> {clientInfo.phone}
              </Typography>
              <Typography variant="body2">
                <strong>Спосіб зв&apos;язку:</strong> {clientInfo.contactMethod}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2">
                <strong>Адреса:</strong> {clientInfo.address}
              </Typography>
              <Typography variant="body2">
                <strong>Філія:</strong> {branchInfo.name}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default OrderSummaryInfo;
