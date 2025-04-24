/**
 * Фінальний крок візарду замовлень - підтвердження завершення
 */
import { FC } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useOrderWizardStore } from '../../../model/store';

/**
 * Компонент екрану завершення замовлення
 */
export const CompletionStep: FC = () => {
  // Отримуємо дані про замовлення та метод reset для створення нового замовлення
  const { orderData, reset } = useOrderWizardStore(state => ({
    orderData: state.orderData,
    reset: state.reset
  }));
  
  // Обробник для створення нового замовлення
  const handleNewOrder = () => {
    reset();
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 2, mb: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Замовлення успішно створено
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Замовлення #{orderData.id || 'новий'} було успішно збережено в системі
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, border: '1px solid #eaeaea', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Інформація про клієнта
              </Typography>
              <Typography variant="body2">
                {orderData.clientFullName || 'Інформація про клієнта'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, border: '1px solid #eaeaea', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Підсумок замовлення
              </Typography>
              <Typography variant="body2">
                Кількість предметів: {orderData.items?.length || 0}
              </Typography>
              <Typography variant="body2">
                Загальна вартість: {orderData.totalPrice || 0} грн
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleNewOrder} size="large">
            Створити нове замовлення
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
