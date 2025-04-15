'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  PersonAdd as PersonAddIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { ClientCard } from '@/features/clients/components/ClientCard';
import { ClientStatus, LoyaltyLevel } from '@/features/clients/types';
import { useDeleteClient } from '@/features/clients/hooks/useDeleteClient';
import { ClientResponse } from '@/features/clients/types';

interface ClientListProps {
  clients: ClientResponse[];
  isLoading: boolean;
  onPageChange?: (page: number) => void;
  totalPages?: number;
  currentPage?: number;
}

export default function ClientList({
  clients,
  isLoading,
  onPageChange,
  totalPages = 1,
  currentPage = 1,
}: ClientListProps) {
  const router = useRouter();
  const deleteClient = useDeleteClient();
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'ALL'>('ALL');
  const [loyaltyFilter, setLoyaltyFilter] = useState<LoyaltyLevel | 'ALL'>(
    'ALL'
  );

  // Функція для переходу до редагування клієнта
  const handleEditClient = (clientId: string) => {
    router.push(`/clients/${clientId}/edit`);
  };

  // Функція для відкриття діалогу перегляду деталей клієнта
  const handleViewClient = (client: ClientResponse) => {
    setSelectedClient(client);
    setOpenDialog(true);
  };

  // Функція для підтвердження видалення клієнта
  const handleDeleteClick = (client: ClientResponse) => {
    setSelectedClient(client);
    setOpenDeleteDialog(true);
  };

  // Функція для виконання видалення клієнта
  const confirmDelete = async () => {
    if (selectedClient) {
      try {
        await deleteClient.mutateAsync(selectedClient.id);
        setOpenDeleteDialog(false);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  // Фільтрація клієнтів
  const filteredClients = clients.filter((client) => {
    if (statusFilter !== 'ALL' && client.status !== statusFilter) {
      return false;
    }
    if (loyaltyFilter !== 'ALL' && client.loyaltyLevel !== loyaltyFilter) {
      return false;
    }
    return true;
  });

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Компонент для відображення статусу клієнта
  const StatusChip = ({ status }: { status: ClientStatus }) => {
    const statusProps = {
      ACTIVE: { color: 'success', label: 'Активний' },
      INACTIVE: { color: 'default', label: 'Неактивний' },
      BLOCKED: { color: 'error', label: 'Заблокований' },
    }[status] || { color: 'default', label: status };

    return (
      <Chip
        size="small"
        label={statusProps.label}
        color={statusProps.color as 'success' | 'default' | 'error'}
      />
    );
  };

  // Компонент для відображення рівня лояльності
  const LoyaltyChip = ({ level }: { level: LoyaltyLevel }) => {
    const loyaltyProps = {
      STANDARD: { color: 'default', label: 'Стандарт' },
      SILVER: { color: 'info', label: 'Срібний' },
      GOLD: { color: 'warning', label: 'Золотий' },
      PLATINUM: { color: 'secondary', label: 'Платиновий' },
      VIP: { color: 'success', label: 'VIP' },
    }[level] || { color: 'default', label: level };

    return (
      <Chip
        size="small"
        label={loyaltyProps.label}
        color={
          loyaltyProps.color as
            | 'default'
            | 'info'
            | 'warning'
            | 'secondary'
            | 'success'
        }
      />
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          variant={showFilters ? 'contained' : 'outlined'}
          size="small"
        >
          Фільтри
        </Button>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => router.push('/clients/new')}
        >
          Новий клієнт
        </Button>
      </Box>

      {showFilters && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ClientStatus | 'ALL')
                }
                label="Статус"
              >
                <MenuItem value="ALL">Всі статуси</MenuItem>
                <MenuItem value="ACTIVE">Активні</MenuItem>
                <MenuItem value="INACTIVE">Неактивні</MenuItem>
                <MenuItem value="BLOCKED">Заблоковані</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Лояльність</InputLabel>
              <Select
                value={loyaltyFilter}
                onChange={(e) =>
                  setLoyaltyFilter(e.target.value as LoyaltyLevel | 'ALL')
                }
                label="Лояльність"
              >
                <MenuItem value="ALL">Всі рівні</MenuItem>
                <MenuItem value="STANDARD">Стандарт</MenuItem>
                <MenuItem value="SILVER">Срібний</MenuItem>
                <MenuItem value="GOLD">Золотий</MenuItem>
                <MenuItem value="PLATINUM">Платиновий</MenuItem>
                <MenuItem value="VIP">VIP</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredClients.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Клієнтів не знайдено
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Спробуйте змінити параметри пошуку або створіть нового клієнта
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="clients table">
              <TableHead>
                <TableRow>
                  <TableCell>ПІБ</TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Лояльність</TableCell>
                  <TableCell align="center">Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell>{client.fullName}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.email || '—'}</TableCell>
                    <TableCell>
                      <StatusChip status={client.status} />
                    </TableCell>
                    <TableCell>
                      <LoyaltyChip level={client.loyaltyLevel} />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        aria-label="view"
                        onClick={() => handleViewClient(client)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="edit"
                        onClick={() => handleEditClient(client.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(client)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Діалог для перегляду деталей клієнта */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Деталі клієнта
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            &times;
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedClient && <ClientCard client={selectedClient} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Закрити</Button>
          {selectedClient && (
            <Button
              variant="contained"
              onClick={() => handleEditClient(selectedClient.id)}
            >
              Редагувати
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Діалог підтвердження видалення */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Підтвердження видалення</DialogTitle>
        <DialogContent>
          <Typography>
            Ви дійсно хочете видалити клієнта{' '}
            <strong>{selectedClient?.fullName}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Ця дія не може бути скасована. Всі дані клієнта будуть видалені.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Скасувати</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteClient.isPending}
          >
            {deleteClient.isPending ? 'Видалення...' : 'Видалити'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
