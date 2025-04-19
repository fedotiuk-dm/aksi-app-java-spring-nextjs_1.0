'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Paper,
  Box,
  Button,
  TextField,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid';
import { clientsApi, ClientSearchRequest } from '../api/clientsApi';
import { ClientStatus, LoyaltyLevel } from '../types';
import { Client } from '../types/client.types';
import { useRouter } from 'next/navigation';

// Компонент для відображення статусу клієнта
export const StatusChip = ({ status }: { status: ClientStatus }) => {
  let color: 'success' | 'warning' | 'error' = 'success';
  let label = 'Активний';

  switch (status) {
    case ClientStatus.ACTIVE:
      color = 'success';
      label = 'Активний';
      break;
    case ClientStatus.INACTIVE:
      color = 'warning';
      label = 'Неактивний';
      break;
    case ClientStatus.BLOCKED:
      color = 'error';
      label = 'Заблокований';
      break;
  }

  return <Chip label={label} color={color} size="small" />;
};

// Компонент для відображення рівня лояльності
export const LoyaltyChip = ({ level }: { level: LoyaltyLevel }) => {
  let color: 'default' | 'primary' | 'secondary' | 'info' | 'success' =
    'default';

  switch (level) {
    case LoyaltyLevel.STANDARD:
      color = 'default';
      break;
    case LoyaltyLevel.SILVER:
      color = 'primary';
      break;
    case LoyaltyLevel.GOLD:
      color = 'secondary';
      break;
    case LoyaltyLevel.PLATINUM:
      color = 'info';
      break;
    case LoyaltyLevel.VIP:
      color = 'success';
      break;
  }

  return <Chip label={level} color={color} size="small" />;
};

export function ClientsList() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: 'Ім\'я',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'phone',
      headerName: 'Телефон',
      width: 130,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      valueFormatter: (params: { value: string | null | undefined }) => {
        if (params?.value === null || params?.value === undefined) return '-';
        return params.value;
      },
    },
    {
      field: 'status',
      headerName: 'Статус',
      width: 130,
      renderCell: (params: GridRenderCellParams<Client>) => (
        <StatusChip status={params.row.status} />
      ),
    },
    {
      field: 'loyaltyLevel',
      headerName: 'Рівень лояльності',
      width: 160,
      renderCell: (params: GridRenderCellParams<Client>) => (
        <LoyaltyChip level={params.row.loyaltyLevel} />
      ),
    },
    {
      field: 'orderCount',
      headerName: 'Замовлень',
      type: 'number',
      width: 120,
    },
    {
      field: 'totalSpent',
      headerName: 'Сума замовлень',
      type: 'number',
      width: 150,
      valueFormatter: (params: { value: number | null | undefined }) => {
        if (params?.value === null || params?.value === undefined) return '-';
        try {
          return `${Number(params.value).toFixed(2)} ₴`;
        } catch {
          return '-';
        }
      },
    },
    {
      field: 'lastOrderDate',
      headerName: 'Останнє замовлення',
      width: 180,
      valueFormatter: (params: { value: string | Date | null | undefined }) => {
        if (!params?.value) return '-';
        try {
          return new Date(String(params.value)).toLocaleDateString('uk-UA');
        } catch (error) {
          console.error('Помилка форматування дати:', error);
          return '-';
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Дії',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Client>) => (
        <Tooltip title="Переглянути деталі">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigateToClientDetails(params.row.id);
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const loadClients = async (params: ClientSearchRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await clientsApi.getClients(params);
      setClients(response.content);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError('Помилка при завантаженні списку клієнтів');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients({
      page: paginationModel.page,
      size: paginationModel.pageSize,
      keyword: searchKeyword || undefined,
    });
  }, [paginationModel.page, paginationModel.pageSize, searchKeyword]);

  const handleSearch = () => {
    setPaginationModel({
      ...paginationModel,
      page: 0,
    });
    loadClients({
      page: 0,
      size: paginationModel.pageSize,
      keyword: searchKeyword || undefined,
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const navigateToClientDetails = (id: string) => {
    router.push(`/clients/${id}`);
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1">
          Клієнти
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} href="/clients/new">
          Новий клієнт
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <TextField
              placeholder="Пошук за іменем, телефоном або email"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              sx={{ mr: 2 }}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              Пошук
            </Button>
          </Box>

          {loading && clients.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={clients}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50]}
                rowCount={totalElements}
                paginationModel={paginationModel}
                paginationMode="server"
                onPaginationModelChange={setPaginationModel}
                loading={loading}
                disableRowSelectionOnClick
                disableColumnSelector
                localeText={{
                  noRowsLabel: 'Клієнтів не знайдено',
                  footerRowSelected: (count) => `${count} рядок обрано`,
                  paginationRowsPerPage: 'Рядків на сторінці:',
                  paginationDisplayedRows: ({
                    from,
                    to,
                    count,
                  }: {
                    from: number;
                    to: number;
                    count: number;
                  }) =>
                    `${from}-${to} з ${count !== -1 ? count : 'понад ' + to}`,
                }}
                slots={{ toolbar: GridToolbar }}
              />
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
