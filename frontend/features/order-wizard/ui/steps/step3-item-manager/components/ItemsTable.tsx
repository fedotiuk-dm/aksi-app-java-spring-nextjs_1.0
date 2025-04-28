'use client';

import React from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  Typography
} from '@mui/material';
import { OrderItem } from '@/features/order-wizard/model/types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface ItemsTableProps {
  items: OrderItem[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

/**
 * Компонент таблиці предметів замовлення
 */
export const ItemsTable: React.FC<ItemsTableProps> = ({ 
  items, 
  onEdit,
  onDelete 
}) => {
  // Перевірка, чи є предмети в списку
  if (items.length === 0) {
    return (
      <Box sx={{ mb: 3, p: 2, textAlign: 'center' }}>
        <Typography color="textSecondary">
          Немає доданих предметів. Натисніть &ldquo;Додати предмет&rdquo;, щоб розпочати.
        </Typography>
      </Box>
    );
  }
  
  return (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Найменування предмета</TableCell>
            <TableCell>Категорія</TableCell>
            <TableCell>Кількість</TableCell>
            <TableCell>Матеріал</TableCell>
            <TableCell>Колір</TableCell>
            <TableCell>Сума</TableCell>
            <TableCell align="center">Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell>{item.category || '-'}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.material || '-'}</TableCell>
              <TableCell>{item.color || '-'}</TableCell>
              <TableCell>{item.totalPrice} грн</TableCell>
              <TableCell align="center">
                <IconButton 
                  aria-label="редагувати" 
                  size="small" 
                  onClick={() => onEdit(index)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  aria-label="видалити" 
                  size="small" 
                  onClick={() => onDelete(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
