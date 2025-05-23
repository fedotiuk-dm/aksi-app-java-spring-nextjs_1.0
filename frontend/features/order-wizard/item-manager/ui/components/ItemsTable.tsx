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
} from '@mui/material';
import React from 'react';

/**
 * Інтерфейс для предмета в таблиці
 */
interface ItemTableData {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: 'шт' | 'кг';
  material: string;
  color: string;
  price: number;
}

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
  // TODO: Отримувати дані з domain layer
  const items: ItemTableData[] = []; // Тимчасово порожній масив

  /**
   * Обробник редагування предмета
   */
  const handleEditItem = (itemId: string) => {
    console.log('Редагування предмета:', itemId);
    // TODO: Запустити item wizard в режимі редагування
  };

  /**
   * Обробник видалення предмета
   */
  const handleDeleteItem = (itemId: string) => {
    console.log('Видалення предмета:', itemId);
    // TODO: Реалізувати видалення через domain layer
  };

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
              </TableCell>
              <TableCell>
                <Chip label={item.category} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                {item.quantity} {item.unit}
              </TableCell>
              <TableCell>{item.material}</TableCell>
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
                  {item.color}
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {item.price.toFixed(2)} грн
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditItem(item.id)}
                    color="primary"
                    title="Редагувати предмет"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteItem(item.id)}
                    color="error"
                    title="Видалити предмет"
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
