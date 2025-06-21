'use client';

import { Box, Grid, Paper, Typography } from '@mui/material';
import { ClientSection } from './client-section/ClientSection';
import { ItemsSection } from './items-section/ItemsSection';
import { SummarySection } from './summary-section/SummarySection';
import { useOrderOnepageStore } from './store/order-onepage.store';

export const OrderOnepageContainer = () => {
  const { sessionId } = useOrderOnepageStore();

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Нове замовлення хімчистки
      </Typography>

      <Grid container spacing={3} sx={{ height: 'calc(100vh - 120px)' }}>
        {/* Лівий блок: Клієнт та базова інформація (30%) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
            }}
          >
            <Typography variant="h6" gutterBottom color="primary">
              Клієнт та замовлення
            </Typography>
            <ClientSection />
          </Paper>
        </Grid>

        {/* Центральний блок: Предмети та розрахунки (50%) */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
            }}
          >
            <Typography variant="h6" gutterBottom color="primary">
              Предмети та розрахунки
            </Typography>
            <ItemsSection />
          </Paper>
        </Grid>

        {/* Правий блок: Підсумки та завершення (20%) */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
            }}
          >
            <Typography variant="h6" gutterBottom color="primary">
              Підсумки
            </Typography>
            <SummarySection />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
