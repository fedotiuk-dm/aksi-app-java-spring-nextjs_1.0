'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  Alert,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useOrderOnepageStore } from '../store/order-onepage.store';
import {
  useStage2GetCurrentManager,
  useStage2DeleteItemFromOrder,
} from '@/shared/api/generated/stage2';

export const ItemsTable = () => {
  const { sessionId, orderId, startAddItem, startEditItem } = useOrderOnepageStore();

  // Отримання списку предметів
  const { data: managerData, isLoading } = useStage2GetCurrentManager(sessionId ?? '', {
    query: { enabled: !!sessionId },
  });

  // Видалення предмета
  const deleteItem = useStage2DeleteItemFromOrder();

  const handleAddItem = () => {
    startAddItem();
  };

  const handleEditItem = (itemId: string) => {
    startEditItem(itemId);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!sessionId || !orderId) return;

    if (window.confirm('Ви впевнені, що хочете видалити цей предмет?')) {
      try {
        await deleteItem.mutateAsync({
          sessionId,
          itemId,
        });
      } catch (error) {
        console.error('Помилка видалення предмета:', error);
      }
    }
  };

  // Використовуємо предмети з API, враховуючи структуру даних
  // В залежності від типу API предмети можуть бути в різних властивостях відповіді
  type OrderItemType = {
    id: string;
    name: string;
    category?: string;
    quantity?: number;
    unit?: string;
    material?: string;
    color?: string;
    totalPrice?: number;
    basePrice?: number;
    notes?: string;
  };

  // Доступ до предметів з правильною типізацією
  const items: OrderItemType[] = [];

  // Використання безпечного доступу до даних
  if (managerData) {
    // Перевірка доступних структур даних з API
    // Використовуємо as any для доступу до властивостей, оскільки тип ItemManagerDTO може не мати потрібних полів
    const availableItems = (managerData as any)?.orderItems ?? (managerData as any)?.items ?? [];
    if (Array.isArray(availableItems)) {
      // Додаємо всі доступні предмети
      availableItems.forEach((item) => {
        if (item && typeof item === 'object' && 'id' in item) {
          items.push(item as OrderItemType);
        }
      });
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Завантаження предметів...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Заголовок та кнопка додавання */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">Предмети замовлення ({items.length})</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddItem} size="small">
          Додати предмет
        </Button>
      </Box>

      {/* Таблиця */}
      <TableContainer component={Paper} sx={{ flex: 1, maxHeight: '400px' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Найменування</TableCell>
              <TableCell>Категорія</TableCell>
              <TableCell align="center">К-сть</TableCell>
              <TableCell>Матеріал</TableCell>
              <TableCell>Колір</TableCell>
              <TableCell align="right">Ціна</TableCell>
              <TableCell align="center">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Предмети не додані. Натисніть &quot;Додати предмет&quot; для початку.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.name}
                    </Typography>
                    {item.notes && (
                      <Typography variant="caption" color="text.secondary">
                        {item.notes}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={item.category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="center">
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell>{item.material}</TableCell>
                  <TableCell>{item.color}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {item.totalPrice?.toFixed(2)} ₴
                    </Typography>
                    {item.basePrice !== item.totalPrice && (
                      <Typography variant="caption" color="text.secondary">
                        (база: {item.basePrice?.toFixed(2)} ₴)
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditItem(item.id)}
                      title="Редагувати"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Видалити"
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Помилки */}
      {deleteItem.error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          Помилка видалення: {deleteItem.error.message}
        </Alert>
      )}
    </Box>
  );
};
