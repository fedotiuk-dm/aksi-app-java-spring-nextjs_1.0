'use client';

import { Box, Grid, Paper, Typography } from '@mui/material';
import { ClientSection } from './client-section/ClientSection';
import { ItemsSection } from './items-section/ItemsSection';
import { SummarySection } from './summary-section/SummarySection';
import { useOrderOnepageStore } from './store/order-onepage.store';
export const OrderOnepageContainer = () => {
  const { sessionId, stage1Ready, stage2Ready, stage3Ready, stage4Ready } = useOrderOnepageStore();

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Нове замовлення хімчистки
      </Typography>

      {/* Індикатор готовності етапів (тимчасово для відладки) */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mb: 2, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ display: 'block' }}>
            🔍 DEBUG INFO:
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            Session: {sessionId ? sessionId.slice(0, 8) + '...' : 'Немає'}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            Stage Readiness: Stage1({stage1Ready ? '✅' : '❌'}) | Stage2(
            {stage2Ready ? '✅' : '❌'}) | Stage3({stage3Ready ? '✅' : '❌'}) | Stage4(
            {stage4Ready ? '✅' : '❌'})
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: 'block', fontSize: '11px', color: 'text.secondary' }}
          >
            Stage1: Встановлюється після старту сесії | Stage2: Після додавання першого предмета
          </Typography>
        </Box>
      )}

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
