/**
 * @fileoverview Main application layout wrapper
 * Provides consistent page structure with header and content area
 */

'use client';

import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';

import Header from './Header';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 2, md: 4 },
          px: { xs: 1, md: 2 },
          overflow: 'visible',
          minHeight: 0,
        }}
      >
        <Container maxWidth="xl" sx={{ height: '100%' }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
