'use client';

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import React from 'react';

import { useStage2Manager, useItemWizard, formatPrice } from '@/domains/wizard';

import type { OrderItemDTO } from '@/lib/api/generated/models/OrderItemDTO';

/**
 * Таблиця предметів замовлення
 *
 * Відповідальність:
 * - Відображення списку предметів у табличному вигляді
 * - Кнопки редагування та видалення предметів
 * - Показ додаткової інформації (дефекти, спеціальні інструкції)
 */
interface ItemsTableProps {
  items: OrderItemDTO[];
}

export const ItemsTable: React.FC<ItemsTableProps> = ({ items }) => {
  const { deleteItem, isLoading } = useStage2Manager();
  const { startEditItem } = useItemWizard();

  const handleEdit = React.useCallback(
    async (itemId: string) => {
      await startEditItem(itemId);
    },
    [startEditItem]
  );

  const handleDelete = React.useCallback(
    async (itemId: string) => {
      if (window.confirm('Ви впевнені, що хочете видалити цей предмет?')) {
        await deleteItem(itemId);
      }
    },
    [deleteItem]
  );

  const formatQuantity = (quantity: number, unit?: string) => {
    const formattedQuantity = Number.isInteger(quantity)
      ? quantity.toString()
      : quantity.toFixed(2);

    return unit ? `${formattedQuantity} ${unit}` : formattedQuantity;
  };

  const hasDefects = (item: OrderItemDTO) => {
    return !!(item.defects || item.defectsAndRisks || item.noGuaranteeReason);
  };

  const hasSpecialInstructions = (item: OrderItemDTO) => {
    return !!item.specialInstructions;
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Найменування</TableCell>
            <TableCell>Категорія</TableCell>
            <TableCell align="center">Кількість</TableCell>
            <TableCell align="right">Ціна за од.</TableCell>
            <TableCell align="right">Сума</TableCell>
            <TableCell>Матеріал</TableCell>
            <TableCell>Колір</TableCell>
            <TableCell align="center">Статус</TableCell>
            <TableCell align="center">Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const itemId = item.id || '';
            const totalPrice = item.totalPrice || item.quantity * item.unitPrice;

            return (
              <TableRow key={itemId} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {item.name}
                    </Typography>
                    {item.description && (
                      <Typography variant="caption" color="text.secondary">
                        {item.description}
                      </Typography>
                    )}
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip label={item.category || 'Не вказана'} size="small" variant="outlined" />
                </TableCell>

                <TableCell align="center">
                  {formatQuantity(item.quantity, item.unitOfMeasure)}
                </TableCell>

                <TableCell align="right">
                  <Typography variant="body2">{formatPrice(item.unitPrice)}</Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    {formatPrice(totalPrice)}
                  </Typography>
                </TableCell>

                <TableCell>
                  {item.material && (
                    <Chip label={item.material} size="small" color="secondary" variant="outlined" />
                  )}
                </TableCell>

                <TableCell>
                  {item.color && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: item.color.toLowerCase(),
                          border: '1px solid #ccc',
                        }}
                      />
                      <Typography variant="caption">{item.color}</Typography>
                    </Box>
                  )}
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {hasDefects(item) && (
                      <Tooltip title="Має дефекти або ризики">
                        <Chip
                          icon={<WarningIcon />}
                          label="Дефекти"
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      </Tooltip>
                    )}
                    {hasSpecialInstructions(item) && (
                      <Tooltip title={item.specialInstructions}>
                        <Chip label="Інструкції" size="small" color="info" variant="outlined" />
                      </Tooltip>
                    )}
                    {item.noGuaranteeReason && (
                      <Tooltip title={item.noGuaranteeReason}>
                        <Chip label="Без гарантій" size="small" color="error" variant="outlined" />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Редагувати предмет">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(itemId)}
                        disabled={isLoading}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Видалити предмет">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(itemId)}
                        disabled={isLoading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
