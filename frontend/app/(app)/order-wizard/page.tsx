'use client';

import { Container } from '@mui/material';

import { OrderWizardContainer } from '@/features/order-wizard';

/**
 * Сторінка Order Wizard - повний візард для створення замовлень
 * Використовує архітектуру "DDD inside, FSD outside"
 */
export default function OrderWizardPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <OrderWizardContainer />
    </Container>
  );
}
