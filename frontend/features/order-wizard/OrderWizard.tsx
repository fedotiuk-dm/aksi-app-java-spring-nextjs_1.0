'use client';

import React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import { CustomerSection } from './components/CustomerSection';

export const OrderWizard: React.FC = () => {
  return (
    <Box sx={{ p: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary'
            }}>
              Предмети та розрахунки (TODO)
            </Box>
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