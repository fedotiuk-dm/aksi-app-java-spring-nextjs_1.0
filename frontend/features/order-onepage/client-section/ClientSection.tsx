'use client';

import { Box, Divider, Stack } from '@mui/material';
import { ClientSearchForm } from './ClientSearchForm';
import { ClientCreateForm } from './ClientCreateForm';
import { ClientSelectedInfo } from './ClientSelectedInfo';
import { OrderBasicInfoForm } from './OrderBasicInfoForm';
import { useOrderOnepageStore, useHasSelectedClient } from '../store/order-onepage.store';

export const ClientSection = () => {
  const { showClientForm } = useOrderOnepageStore();
  const hasSelectedClient = useHasSelectedClient();

  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      {/* Пошук або відображення обраного клієнта */}
      {!hasSelectedClient ? (
        <Box>
          <ClientSearchForm />
          {showClientForm && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <ClientCreateForm />
            </Box>
          )}
        </Box>
      ) : (
        <ClientSelectedInfo />
      )}

      {/* Базова інформація замовлення */}
      {hasSelectedClient && (
        <>
          <Divider />
          <OrderBasicInfoForm />
        </>
      )}
    </Stack>
  );
};
