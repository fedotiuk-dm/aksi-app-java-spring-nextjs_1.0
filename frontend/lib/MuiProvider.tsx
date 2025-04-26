'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import EmotionRegistry from './EmotionRegistry';

/**
 * Провайдер MUI з удосконаленим механізмом гідратації Emotion
 * Використовує окремий EmotionRegistry для контролю кешу стилів
 */
export default function MuiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmotionRegistry>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionRegistry>
  );
}
