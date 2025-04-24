/**
 * Крок оплати та розрахунку у візарді замовлень
 */
import { FC } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

// Типи для пропсів компонента
interface BillingStepProps {
  onNext: () => void;
  onBack: () => void;
}

/**
 * Компонент кроку оплати та розрахунку замовлення
 */
export const BillingStep: FC<BillingStepProps> = ({ onNext, onBack }) => {
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Оплата та розрахунок
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Виберіть спосіб оплати та завершіть розрахунок
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Тут будуть поля вибору способу оплати та інформації про розрахунок */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1, height: '100%' }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Вибір способу оплати
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1, height: '100%' }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Підсумок розрахунку
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" onClick={onBack}>
            Назад
          </Button>
          <Button variant="contained" onClick={onNext} color="primary">
            Завершити замовлення
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
