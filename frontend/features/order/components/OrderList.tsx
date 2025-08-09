'use client';

import React, { useState } from 'react';
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
import { Search, Visibility, PictureAsPdf } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/features/order';
import { useListOrders } from '@/shared/api/generated/order';
import { ReceiptPreview } from '@/features/order-wizard/components/receipt/ReceiptPreview';

export const OrderList: React.FC = () => {
  const router = useRouter();
  const { filters, setSearch, setStatus, getListParams, reset } = useOrderStore();

  const { data, isLoading, error } = useListOrders(getListParams());
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewOrderId, setPreviewOrderId] = useState<string | null>(null);
  const openPreview = (orderId: string) => {
    setPreviewOrderId(orderId);
    setPreviewOpen(true);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Помилка завантаження замовлень: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Замовлення
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Управління замовленнями
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Пошук за номером/клієнтом"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
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

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              value={filters.status || ''}
              label="Статус"
              onChange={(e) =>
                setStatus(
                  (e.target.value || undefined) as unknown as Parameters<typeof setStatus>[0]
                )
              }
            >
              <MenuItem value="">Всі</MenuItem>
              <MenuItem value="PENDING">Прийнято</MenuItem>
              <MenuItem value="ACCEPTED">Погоджено</MenuItem>
              <MenuItem value="IN_PROGRESS">В роботі</MenuItem>
              <MenuItem value="READY">Готове</MenuItem>
              <MenuItem value="COMPLETED">Завершено</MenuItem>
              <MenuItem value="CANCELLED">Скасовано</MenuItem>
            </Select>
          </FormControl>

          <Button variant="text" onClick={reset}>
            Скинути
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
                <TableCell>Номер</TableCell>
                <TableCell>Клієнт</TableCell>
                <TableCell>Філія</TableCell>
                <TableCell>Сума</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell align="right">Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>
                    {order.customer?.lastName} {order.customer?.firstName}
                  </TableCell>
                  <TableCell>{order.branchId}</TableCell>
                  <TableCell>{((order.pricing?.total || 0) / 100).toFixed(2)} ₴</TableCell>
                  <TableCell>
                    <Chip label={order.status} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => router.push(`/orders/${order.id}`)}
                      startIcon={<Visibility />}
                    >
                      Переглянути
                    </Button>
                    <Button
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => openPreview(order.id)}
                      startIcon={<PictureAsPdf />}
                    >
                      Квитанція
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <ReceiptPreview
        open={previewOpen}
        onCloseAction={() => setPreviewOpen(false)}
        orderId={previewOrderId ?? undefined}
      />
    </Container>
  );
};
