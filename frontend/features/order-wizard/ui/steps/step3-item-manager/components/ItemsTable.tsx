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
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import { OrderItem } from '@/features/order-wizard/model/types/types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CategoryIcon from '@mui/icons-material/Category';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import StyleIcon from '@mui/icons-material/Style';
import PaymentsIcon from '@mui/icons-material/Payments';

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
  onDelete,
}) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Перевірка, чи є предмети в списку
  if (items.length === 0) {
    return (
      <Box sx={{ mb: 3, p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary" variant="body1" sx={{ mb: 1 }}>
          Немає доданих предметів
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Натисніть &ldquo;Додати предмет&rdquo;, щоб розпочати створення
          замовлення
        </Typography>
      </Box>
    );
  }

  // Якщо мобільний екран, показуємо картки замість таблиці
  if (isMobile) {
    return (
      <Stack spacing={2}>
        {items.map((item, index) => (
          <Card key={index} sx={{ p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              {item.name}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              {item.category && (
                <Chip
                  icon={<CategoryIcon fontSize="small" />}
                  label={item.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}

              {item.color && (
                <Chip
                  icon={<ColorLensIcon fontSize="small" />}
                  label={item.color}
                  size="small"
                  variant="outlined"
                />
              )}

              {item.material && (
                <Chip
                  icon={<StyleIcon fontSize="small" />}
                  label={item.material}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
            >
              <Typography variant="body2">
                Кількість: {item.quantity}
              </Typography>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <PaymentsIcon fontSize="small" color="primary" />
                {item.totalPrice.toFixed(2)} грн
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <IconButton
                color="primary"
                size="small"
                onClick={() => onEdit(index)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                color="error"
                size="small"
                onClick={() => onDelete(index)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Stack>
    );
  }

  // Для планшетів і десктопів показуємо таблицю
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
      <Table sx={{ minWidth: 650 }} size={isTablet ? 'medium' : 'small'}>
        <TableHead>
          <TableRow
            sx={{ '& th': { fontWeight: 'bold', bgcolor: 'action.hover' } }}
          >
            <TableCell>Найменування предмета</TableCell>
            <TableCell>Категорія</TableCell>
            <TableCell align="center">Кількість</TableCell>
            <TableCell>Матеріал</TableCell>
            <TableCell>Колір</TableCell>
            <TableCell align="right">Сума, грн</TableCell>
            <TableCell align="center">Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={index}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ fontWeight: 'medium' }}
              >
                {item.name}
              </TableCell>
              <TableCell>{item.category || '-'}</TableCell>
              <TableCell align="center">{item.quantity}</TableCell>
              <TableCell>{item.material || '-'}</TableCell>
              <TableCell>{item.color || '-'}</TableCell>
              <TableCell align="right">{item.totalPrice.toFixed(2)}</TableCell>
              <TableCell align="center">
                <Tooltip title="Редагувати">
                  <IconButton
                    aria-label="редагувати"
                    size="small"
                    onClick={() => onEdit(index)}
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Видалити">
                  <IconButton
                    aria-label="видалити"
                    size="small"
                    onClick={() => onDelete(index)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
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
