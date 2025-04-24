/**
 * Крок параметрів замовлення у візарді
 */
import { FC } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

// Типи для пропсів компонента
interface OrderParamsStepProps {
  onNext: () => void;
  onBack: () => void;
}

/**
 * Компонент для налаштування параметрів замовлення
 */
export const OrderParamsStep: FC<OrderParamsStepProps> = ({ onNext, onBack }) => {
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Параметри замовлення
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Налаштуйте додаткові параметри замовлення
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Тут будуть поля налаштування параметрів замовлення */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1, height: '100%' }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Параметри замовлення будуть додані пізніше
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1, height: '100%' }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Додаткові налаштування
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" onClick={onBack}>
            Назад
          </Button>
          <Button variant="contained" onClick={onNext} color="primary">
            Далі
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
