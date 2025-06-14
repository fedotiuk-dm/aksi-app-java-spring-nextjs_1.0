'use client';

import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import React from 'react';

// Локальні типи для UI компонента (як у Stage1)
interface OrderItem {
  id?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  category?: string;
  color?: string;
  material?: string;
  unitOfMeasure?: string;
}

interface ItemManagerTableProps {
  items: OrderItem[];
  searchTerm: string;
  onEditItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  loading?: boolean;
}

export const ItemManagerTable: React.FC<ItemManagerTableProps> = ({
  items,
  searchTerm,
  onEditItem,
  onDeleteItem,
  loading = false,
}) => {
  // Фільтрація предметів за пошуковим терміном
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Форматування ціни
  const formatPrice = (price?: number) => {
    return price ? `${price.toFixed(2)} ₴` : '—';
  };

  // Форматування кількості з одиницею виміру
  const formatQuantity = (quantity: number, unitOfMeasure?: string) => {
    const unit = unitOfMeasure || 'шт.';
    return `${quantity} ${unit}`;
  };

  if (filteredItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          {searchTerm ? 'Предмети не знайдені за вказаним пошуком' : 'Предмети ще не додані'}
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Назва</TableCell>
            <TableCell>Категорія</TableCell>
            <TableCell>Кількість</TableCell>
            <TableCell>Матеріал</TableCell>
            <TableCell>Колір</TableCell>
            <TableCell align="right">Сума</TableCell>
            <TableCell align="center">Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredItems.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
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
                  label={item.category || 'Не вказано'}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatQuantity(item.quantity, item.unitOfMeasure)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {item.material || '—'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{item.color || '—'}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight={500}>
                  {formatPrice(item.totalPrice)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Редагувати предмет">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => item.id && onEditItem(item.id)}
                    disabled={loading || !item.id}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Видалити предмет">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => item.id && onDeleteItem(item.id)}
                    disabled={loading || !item.id}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
