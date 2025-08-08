'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Button,
  Grid,
} from '@mui/material';
import { Search, Add, Phone } from '@mui/icons-material';
import { useListCustomers } from '@/shared/api/generated/customer';
import { useCustomerStore } from '@/features/customer';
import { CustomerItem } from './CustomerItem';
import { CustomerForm } from './CustomerForm';

export const CustomerList: React.FC = () => {
  const {
    searchQuery,
    phoneFilter,
    setSearchQuery,
    setPhoneFilter,
    setFormOpen,
    getListParams,
    resetFilters,
  } = useCustomerStore();

  const { data, isLoading, error, refetch } = useListCustomers(getListParams());

  const handleAddNew = () => {
    setFormOpen(true);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Помилка завантаження клієнтів: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Клієнти
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Управління базою клієнтів
        </Typography>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Пошук за ім'ям, телефоном або email (мін. 2 символи)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              placeholder="Фільтр за телефоном..."
              value={phoneFilter}
              onChange={(e) => setPhoneFilter(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResetFilters}
              disabled={!searchQuery && !phoneFilter}
            >
              Очистити
            </Button>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ textAlign: 'right' }}>
            <Button fullWidth variant="contained" startIcon={<Add />} onClick={handleAddNew}>
              Додати клієнта
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : !data?.data || data.data.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {searchQuery || phoneFilter
              ? 'Не знайдено жодного клієнта за заданими критеріями'
              : 'Ще немає жодного клієнта'}
          </Typography>
        </Paper>
      ) : (
        <>
          <Box
            sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="body2" color="text.secondary">
              Знайдено клієнтів: {data.totalElements}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.data.map((customer) => (
              <CustomerItem key={customer.id} customer={customer} />
            ))}
          </Box>
        </>
      )}

      <CustomerForm onSuccessAction={refetch} />
    </Container>
  );
};
