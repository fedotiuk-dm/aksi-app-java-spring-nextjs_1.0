import { Container, Typography, Paper, Alert } from '@mui/material';
import React from 'react';

import { OrderWizardExample } from '@/features/order-wizard';

/**
 * Тестова сторінка для нового OrderWizardExample
 * Використовує новий DDD store та архітектуру
 */
export default function OrderWizardTestPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Order Wizard Test - Нова архітектура
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Тестування нового OrderWizard з DDD архітектурою та оптимізованим Zustand store
        </Typography>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Архітектура:</strong> &ldquo;DDD inside, FSD outside&rdquo;
            <br />
            <strong>Store:</strong> Оптимізований single OrderWizard store
            <br />
            <strong>Особливості:</strong> Циклічний Item Wizard, валідація навігації, автоматичне
            управління доступністю
          </Typography>
        </Alert>
      </Paper>

      {/* Тестовий компонент */}
      <OrderWizardExample />
    </Container>
  );
}
