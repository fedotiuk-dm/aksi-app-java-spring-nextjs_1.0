'use client';

import React from 'react';
import { Container } from '@mui/material';
import StepNavigationTest from '@/features/order-wizard/ui/components/StepNavigationTest';
import { OrderWizardProvider } from '@/features/order-wizard/model/OrderWizardContext';

/**
 * Тестова сторінка для перевірки навігації між етапами Order Wizard
 */
export default function OrderWizardTestPage() {
  return (
    <OrderWizardProvider>
      <Container>
        <StepNavigationTest />
      </Container>
    </OrderWizardProvider>
  );
}
