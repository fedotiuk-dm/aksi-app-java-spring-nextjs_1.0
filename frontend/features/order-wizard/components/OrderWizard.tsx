'use client';

import React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import { CustomerSection } from './sections/CustomerSection';
import { ItemsSection } from './sections/ItemsSection';
import { SummarySection } from './sections/SummarySection';

export const OrderWizard: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: 'auto',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 1, sm: 2 },
      }}
    >
      <Grid
        container
        spacing={{ xs: 1, sm: 2 }}
        sx={{
          height: 'auto',
          minHeight: { xs: 'auto', lg: '100vh' },
          flexDirection: { xs: 'column', lg: 'row' },
          overflow: 'visible',
          flexWrap: 'wrap',
        }}
      >
        {/* Section 1: Customer and basic order info (30%) */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Paper
            elevation={2}
            sx={{
              height: 'auto',
              maxHeight: { xs: 'none', sm: '40vh', lg: 'none' },
              overflow: 'auto',
              p: { xs: 1.5, sm: 2 },
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'grey.100',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'grey.400',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'grey.600',
                },
              },
            }}
          >
            <CustomerSection />
          </Paper>
        </Grid>

        {/* Section 2: Items and calculations (50%) */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={2}
            sx={{
              height: 'auto',
              maxHeight: { xs: 'none', sm: '50vh', lg: 'none' },
              overflow: 'auto',
              p: { xs: 1.5, sm: 2 },
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'grey.100',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'grey.400',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'grey.600',
                },
              },
            }}
          >
            <ItemsSection />
          </Paper>
        </Grid>

        {/* Section 3: Summary and completion (20%) */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Paper
            elevation={2}
            sx={{
              height: 'auto',
              maxHeight: { xs: 'none', sm: '60vh', lg: 'none' },
              overflow: 'auto',
              p: { xs: 1.5, sm: 2 },
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'grey.100',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'grey.400',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'grey.600',
                },
              },
            }}
          >
            <SummarySection />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
