'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Box, CircularProgress, Alert, Container } from '@mui/material';
import ClientForm from '@/features/clients/components/ClientForm';
import { useClient } from '@/features/clients/hooks/useClient';

export default function EditClientPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const { data: client, isLoading, isError } = useClient(clientId);

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError || !client) {
    return (
      <Container>
        <Alert severity="error" sx={{ my: 4 }}>
          Клієнта не знайдено або сталася помилка при завантаженні даних
        </Alert>
      </Container>
    );
  }

  return <ClientForm initialData={client} isEdit={true} />;
}
