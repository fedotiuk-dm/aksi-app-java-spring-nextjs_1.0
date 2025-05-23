'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
  Alert,
} from '@mui/material';
import React from 'react';

import { useOrderItems } from '@/domain/order';
import { useWizard } from '@/domain/wizard';

/**
 * Компонент для відображення таблиці предметів
 *
 * Згідно з документацією:
 * - Найменування предмета
 * - Категорія
 * - Кількість (шт/кг)
 * - Матеріал
 * - Колір
 * - Сума
 * - Кнопки дій (Редагувати, Видалити)
 */
export const ItemsTable: React.FC = () => {
  // Отримуємо wizard для доступу до поточного замовлення
  const wizard = useWizard();

  // TODO: Отримати orderId з wizard state або контексту
  const orderId = 'temp-order-id'; // Тимчасове значення

  // Отримуємо дані предметів з domain layer
  const {
    items,
    isLoading,
    error,
    deleteItem,
    mutations: { delete: deleteMutation },
  } = useOrderItems({ orderId });

  /**
   * Обробник редагування предмета
   */
  const handleEditItem = (itemId: string) => {
    console.log('Редагування предмета:', itemId);
    // TODO: Запустити item wizard в режимі редагування
    // Це потребує додаткової логіки в wizard домені для режиму редагування
    wizard.startItemWizardFlow();
  };

  /**
   * Обробник видалення предмета
   */
  const handleDeleteItem = async (itemId: string) => {
    console.log('Видалення предмета:', itemId);

    // Запитуємо підтвердження
    if (window.confirm('Ви впевнені, що хочете видалити цей предмет?')) {
      const result = await deleteItem(itemId);
      if (!result.success) {
        console.error('Помилка видалення предмета:', result.error);
        // TODO: Показати toast з помилкою
      }
    }
  };

  /**
   * Форматування кольору для відображення
   */
  const formatColor = (color?: string) => {
    if (!color) return 'Не вказано';
    return color;
  };

  /**
   * Форматування матеріалу для відображення
   */
  const formatMaterial = (material?: string) => {
    if (!material) return 'Не вказано';
    // TODO: Використати енум для перекладу матеріалів
    return material;
  };

  // Показуємо помилку завантаження
  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Помилка завантаження предметів: {error}
      </Alert>
    );
  }

  // Показуємо індикатор завантаження
  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Завантаження предметів...
        </Typography>
      </Box>
    );
  }

  // Показуємо повідомлення коли немає предметів
  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Поки що немає доданих предметів
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Використайте кнопку &quot;Додати предмет&quot; щоб почати
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>№</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Найменування</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Категорія</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Кількість</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Матеріал</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Колір</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="right">
              Сума
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="center">
              Дії
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {item.name}
                </Typography>
                {item.description && (
                  <Typography variant="caption" color="text.secondary">
                    {item.description}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={item.category || 'Без категорії'}
                  size="small"
                  variant="outlined"
                  color={item.category ? 'primary' : 'default'}
                />
              </TableCell>
              <TableCell>
                {item.quantity} {item.unitOfMeasure || 'шт'}
              </TableCell>
              <TableCell>{formatMaterial(item.material)}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      bgcolor: 'grey.300', // TODO: реальний колір
                      border: '1px solid',
                      borderColor: 'grey.400',
                    }}
                  />
                  {formatColor(item.color)}
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {(item.totalPrice || 0).toFixed(2)} грн
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditItem(item.id || '')}
                    color="primary"
                    title="Редагувати предмет"
                    disabled={wizard.isItemWizardActive}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteItem(item.id || '')}
                    color="error"
                    title="Видалити предмет"
                    disabled={deleteMutation.isPending || wizard.isItemWizardActive}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemsTable;
