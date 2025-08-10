'use client';

import React from 'react';
import { Box, Grid, Paper, Button, Tooltip } from '@mui/material';
import { RestartAlt } from '@mui/icons-material';
import { CustomerSection } from './components/CustomerSection';
import { ItemsSection } from './components/ItemsSection';
import { useOrderWizardReset } from '@features/order-wizard/hooks';

export const OrderWizard: React.FC = () => {
  const { resetCompleteSession } = useOrderWizardReset();

  const handleResetSession = async () => {
    if (window.confirm('Очистити всю сесію? Всі незбережені дані будуть втрачені.')) {
      await resetCompleteSession();
    }
  };

  return (
    <Box sx={{ p: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Reset button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Tooltip title="Очистити всю сесію та розпочати заново">
          <Button
            variant="outlined"
            color="warning"
            startIcon={<RestartAlt />}
            onClick={handleResetSession}
            size="small"
          >
            Нова сесія
          </Button>
        </Tooltip>
      </Box>

      <Grid container spacing={2} sx={{ flex: 1 }}>
        {/* Customer & Order Info - 30% */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper 
            elevation={2} 
            sx={{ 
              height: '100%', 
              p: 2, 
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <CustomerSection />
          </Paper>
        </Grid>

        {/* Items & Pricing - 50% */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper 
            elevation={2} 
            sx={{ 
              height: '100%', 
              p: 2, 
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <ItemsSection />
          </Paper>
        </Grid>

        {/* Summary & Completion - 20% */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Paper 
            elevation={2} 
            sx={{ 
              height: '100%', 
              p: 2, 
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary'
            }}>
              Підсумки (TODO)
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};