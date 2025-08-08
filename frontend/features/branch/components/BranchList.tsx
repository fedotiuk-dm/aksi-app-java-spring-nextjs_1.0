'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Search, Add, Edit, LocationOn, Phone, Email, Visibility } from '@mui/icons-material';
import {
  useListBranches,
  useDeactivateBranch,
  useActivateBranch,
} from '@/shared/api/generated/branch';
import { useBranchStore } from '@/features/branch';
import { BranchForm } from './BranchForm';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const BranchList: React.FC = () => {
  const router = useRouter();
  const {
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    openForm,
    getListParams,
    resetFilters,
  } = useBranchStore();

  // Get branches using Orval hook
  const { data, isLoading, error, refetch } = useListBranches(getListParams());

  // Deactivate mutation
  const deactivateMutation = useDeactivateBranch({
    mutation: {
      onSuccess: () => {
        toast.success('Філію деактивовано');
        void refetch();
      },
      onError: (error) => {
        toast.error(`Помилка: ${error.message}`);
      },
    },
  });

  // Activate mutation
  const activateMutation = useActivateBranch({
    mutation: {
      onSuccess: () => {
        toast.success('Філію активовано');
        void refetch();
      },
      onError: (error) => {
        toast.error(`Помилка: ${error.message}`);
      },
    },
  });

  const handleDeactivate = async (branchId: string) => {
    if (window.confirm('Деактивувати філію?')) {
      await deactivateMutation.mutateAsync({ branchId });
    }
  };

  const handleActivate = async (branchId: string) => {
    await activateMutation.mutateAsync({ branchId });
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Помилка завантаження філій: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Філії
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Управління філіями мережі
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Пошук за назвою або адресою"
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
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              value={statusFilter}
              label="Статус"
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            >
              <MenuItem value="all">Всі</MenuItem>
              <MenuItem value="active">Активні</MenuItem>
              <MenuItem value="inactive">Неактивні</MenuItem>
            </Select>
          </FormControl>

          <Button variant="text" onClick={resetFilters}>
            Скинути
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Button variant="contained" startIcon={<Add />} onClick={() => openForm()}>
            Додати філію
          </Button>
        </Stack>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        {isLoading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Назва</TableCell>
                <TableCell>Адреса</TableCell>
                <TableCell>Контакти</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell align="right">Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{branch.name}</Typography>
                    {branch.workingHours && (
                      <Typography variant="caption" color="text.secondary">
                        {branch.workingHours}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <LocationOn fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2">{branch.address}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {branch.phone && (
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2">{branch.phone}</Typography>
                      </Stack>
                    )}
                    {branch.email && (
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2">{branch.email}</Typography>
                      </Stack>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={branch.active ? 'Активна' : 'Неактивна'}
                      color={branch.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => router.push(`/branches/${branch.id}`)}
                      title="Переглянути"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" onClick={() => openForm(branch)} title="Редагувати">
                      <Edit />
                    </IconButton>
                    {branch.active ? (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeactivate(branch.id)}
                        disabled={deactivateMutation.isPending}
                      >
                        Деактивувати
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleActivate(branch.id)}
                        disabled={activateMutation.isPending}
                      >
                        Активувати
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Form Dialog */}
      <BranchForm />
    </Container>
  );
};
