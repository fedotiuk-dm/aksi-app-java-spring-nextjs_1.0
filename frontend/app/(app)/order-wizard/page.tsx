'use client';

import React from 'react';
import { AuthGuard } from '@/features/auth/ui/AuthGuard';
import { Container, Typography } from '@mui/material';
import { OrderWizard } from '@/features/order-wizard/OrderWizard';

function OrderWizardContent() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Створення нового замовлення
      </Typography>
      <OrderWizard />
    </Container>
  );
}

export default function OrderWizardPage() {
  return (
    <AuthGuard>
      <OrderWizardContent />
    </AuthGuard>
  );
}
