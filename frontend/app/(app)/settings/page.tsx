'use client';

import { Settings } from '@/features/settings/components/Settings';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

function SettingsContent() {
  return <Settings />;
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
