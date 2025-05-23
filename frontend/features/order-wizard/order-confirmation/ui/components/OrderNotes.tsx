'use client';

import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import React from 'react';

interface OrderNotesData {
  orderNotes: string;
  clientRequirements: string;
}

interface OrderNotesProps {
  notes: OrderNotesData;
}

/**
 * Компонент для відображення приміток до замовлення
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення приміток
 * - Отримує готові дані через пропси
 * - Не містить бізнес-логіки
 */
export const OrderNotes: React.FC<OrderNotesProps> = ({ notes }) => {
  // Не відображаємо компонент якщо немає приміток
  if (!notes.orderNotes && !notes.clientRequirements) {
    return null;
  }

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Примітки
          </Typography>

          {notes.orderNotes && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Примітки до замовлення:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {notes.orderNotes}
              </Typography>
            </Box>
          )}

          {notes.clientRequirements && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Вимоги клієнта:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {notes.clientRequirements}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default OrderNotes;
