import { Container, Typography, Paper } from '@mui/material';
import React from 'react';

import OrderWizard from '@/features/order-wizard/shared/ui/order-wizard';


/**
 * Сторінка з майстром створення замовлення
 */
export default function OrderWizardPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Створення нового замовлення
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Додайте нове замовлення, заповнивши всі необхідні поля нижче
        </Typography>
      </Paper>

      <OrderWizard />
    </Container>
  );
}
