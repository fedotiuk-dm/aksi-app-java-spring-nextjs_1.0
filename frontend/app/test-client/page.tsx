'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { useState } from 'react';

import { useClientSearch, useClientForm } from '@/domain/wizard/hooks';

/**
 * Мінімальна тестова сторінка для client хуків
 * Без wizard залежностей
 */
export default function TestClientPage() {
  const [mode, setMode] = useState<'search' | 'form'>('search');

  const clientSearch = useClientSearch();
  const clientForm = useClientForm();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Тест Client Хуків
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant={mode === 'search' ? 'contained' : 'outlined'}
          onClick={() => setMode('search')}
        >
          Тест Пошуку
        </Button>
        <Button
          variant={mode === 'form' ? 'contained' : 'outlined'}
          onClick={() => setMode('form')}
        >
          Тест Форми
        </Button>
      </Box>

      {mode === 'search' && (
        <Box>
          <Typography variant="h6">Тест useClientSearch</Typography>
          <pre>
            {JSON.stringify(
              {
                searchTerm: clientSearch.searchTerm,
                isSearching: clientSearch.isSearching,
                hasResults: clientSearch.hasResults,
                totalResults: clientSearch.totalResults,
              },
              null,
              2
            )}
          </pre>
        </Box>
      )}

      {mode === 'form' && (
        <Box>
          <Typography variant="h6">Тест useClientForm</Typography>
          <pre>
            {JSON.stringify(
              {
                isCreating: clientForm.isCreating,
                showDuplicateWarning: clientForm.showDuplicateWarning,
              },
              null,
              2
            )}
          </pre>
        </Box>
      )}
    </Container>
  );
}
