/**
 * Тестова сторінка для Order Wizard XState v5
 * URL: /order-wizard-test
 */

import { Typography, Container, Paper } from '@mui/material';

import { OrderWizardExample } from '@/features/order-wizard/OrderWizardExample';

export default function TestWizardPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          🧪 Order Wizard - XState v5 Тест
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Тестова сторінка для нової машини станів на XState v5
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          DDD inside, FSD outside архітектура
        </Typography>
      </Paper>

      <OrderWizardExample />
    </Container>
  );
}
