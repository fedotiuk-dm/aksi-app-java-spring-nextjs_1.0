'use client';

import { Box, Container, Typography } from '@mui/material';

import { ClientSelectionStep } from '@/features/order-wizard/client-selection/ui/ClientSelectionStep';

/**
 * Тестова сторінка для першого кроку Order Wizard
 * Повністю ізольована від інших компонентів
 */
export default function OrderWizardTestPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Тест: Вибір клієнта
      </Typography>

      <Box sx={{ mt: 3 }}>
        <ClientSelectionStep />
      </Box>
    </Container>
  );
}
