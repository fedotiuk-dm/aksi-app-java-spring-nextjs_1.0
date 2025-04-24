/**
 * Компонент підсумку предметів замовлення
 * Відображає загальну кількість та вартість предметів
 */
import { FC, useMemo } from 'react';
import { OrderItemUI } from '@/features/order-wizard/model/types/wizard.types';

// MUI компоненти
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

// Пропси для компонента
interface ItemSummaryProps {
  items: OrderItemUI[];
}

/**
 * Компонент підсумку предметів замовлення
 */
export const ItemSummary: FC<ItemSummaryProps> = ({ items }) => {
  // Обчислюємо загальну вартість
  const totalCost = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + (item.finalPrice || 0);
    }, 0);
  }, [items]);
  
  // Обчислюємо загальну кількість предметів
  const totalItems = items.length;
  
  // Підраховуємо кількість предметів за одиницями виміру
  const { pieceCount, kgCount } = useMemo(() => {
    return items.reduce((acc, item) => {
      if (item.unitOfMeasurement === 'KILOGRAM') {
        acc.kgCount += item.quantity || 1;
      } else {
        acc.pieceCount += item.quantity || 1;
      }
      return acc;
    }, { pieceCount: 0, kgCount: 0 });
  }, [items]);
  
  return (
    <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        Підсумок замовлення
      </Typography>
      
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Загальна кількість позицій
            </Typography>
            <Typography variant="h6">
              {totalItems} {totalItems === 1 ? 'предмет' : totalItems < 5 ? 'предмети' : 'предметів'}
            </Typography>
          </Box>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Кількість за типами
            </Typography>
            <Typography variant="body1">
              {pieceCount > 0 && `${pieceCount} шт.`}
              {pieceCount > 0 && kgCount > 0 && ' | '}
              {kgCount > 0 && `${kgCount} кг`}
            </Typography>
          </Box>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Вартість
            </Typography>
            <Typography variant="h6" color="primary.main">
              {totalCost.toFixed(2)} грн
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          * Ціни вказані без урахування можливих знижок замовлення. Фінальна сума буде розрахована на етапі параметрів замовлення.
        </Typography>
      </Box>
    </Paper>
  );
};
