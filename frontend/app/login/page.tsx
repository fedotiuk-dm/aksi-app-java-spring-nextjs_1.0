'use client';

/**
 * @fileoverview Login page component
 * Simple wrapper that renders the LoginForm component
 * Handles URL parameters and provides Suspense boundary
 */

import { Suspense } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { LoginForm } from '@/features/auth';

function LoginPageContent() {
  return <LoginForm />;
}

// Main login page component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 2,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
