'use client';

import { Box } from '@mui/material';

import Header from './Header';
import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
          px: { xs: 2, md: 4 },
          overflow: 'visible',
          minHeight: 0, // Allow content to determine height
        }}
      >
        {children}
      </Box>
      
    </Box>
  );
}
