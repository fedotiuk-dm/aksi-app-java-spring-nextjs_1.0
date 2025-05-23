'use client';

import { Inventory } from '@mui/icons-material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import React, { useState } from 'react';

export interface OrderItemData {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  material?: string;
  color?: string;
  basePrice: number;
  modifiers?: Array<{
    name: string;
    amount: number;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  }>;
  finalPrice: number;
  stains?: string[];
  defects?: string[];
}

interface OrderItemsTableProps {
  items: OrderItemData[];
  title?: string;
  showDetails?: boolean;
  currency?: string;
  showIcons?: boolean;
  compact?: boolean;
}

/**
 * Компонент для відображення таблиці предметів замовлення
 */
export const OrderItemsTable: React.FC<OrderItemsTableProps> = ({
  items,
  title = 'Предмети замовлення',
  showDetails = true,
  currency = 'грн',
  showIcons = true,
  compact = false,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.finalPrice, 0);

  return (
    <Grid size={{ xs: 12 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            {showIcons && <Inventory color="primary" />}
            {title}
            <Chip
              label={`${items.length} предмет${items.length > 1 ? 'и' : ''}`}
              size="small"
              variant="outlined"
            />
          </Typography>

          <Table size={compact ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Найменування</TableCell>
                <TableCell>Категорія</TableCell>
                <TableCell align="center">Кількість</TableCell>
                {!compact && <TableCell>Матеріал</TableCell>}
                {!compact && <TableCell>Колір</TableCell>}
                <TableCell align="right">Ціна</TableCell>
                {showDetails && <TableCell align="center">Деталі</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => {
                const isExpanded = expandedItems.has(item.id);
                const hasDetails =
                  item.modifiers?.length || item.stains?.length || item.defects?.length;

                return (
                  <React.Fragment key={item.id}>
                    <TableRow hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {item.category}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {item.quantity} {item.unit}
                      </TableCell>
                      {!compact && (
                        <TableCell>
                          <Typography variant="body2">{item.material || '—'}</Typography>
                        </TableCell>
                      )}
                      {!compact && (
                        <TableCell>
                          <Typography variant="body2">{item.color || '—'}</Typography>
                        </TableCell>
                      )}
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {formatCurrency(item.finalPrice)}
                        </Typography>
                        {item.basePrice !== item.finalPrice && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            База: {formatCurrency(item.basePrice)}
                          </Typography>
                        )}
                      </TableCell>
                      {showDetails && (
                        <TableCell align="center">
                          {hasDetails && (
                            <IconButton
                              size="small"
                              onClick={() => toggleExpanded(item.id)}
                              aria-label={isExpanded ? 'Сховати деталі' : 'Показати деталі'}
                            >
                              {isExpanded ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          )}
                        </TableCell>
                      )}
                    </TableRow>

                    {/* Розширені деталі */}
                    {showDetails && hasDetails && (
                      <TableRow>
                        <TableCell colSpan={compact ? 6 : 8} sx={{ py: 0 }}>
                          <Collapse in={isExpanded}>
                            <Box sx={{ py: 2 }}>
                              <Grid container spacing={2}>
                                {/* Модифікатори */}
                                {item.modifiers && item.modifiers.length > 0 && (
                                  <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      Модифікатори ціни:
                                    </Typography>
                                    <List dense>
                                      {item.modifiers.map((modifier, idx) => (
                                        <ListItem key={idx} sx={{ px: 0 }}>
                                          <ListItemText
                                            primary={modifier.name}
                                            secondary={
                                              modifier.type === 'PERCENTAGE'
                                                ? `${modifier.amount >= 0 ? '+' : ''}${modifier.amount}%`
                                                : formatCurrency(modifier.amount)
                                            }
                                          />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Grid>
                                )}

                                {/* Плями */}
                                {item.stains && item.stains.length > 0 && (
                                  <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      Плями:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {item.stains.map((stain, idx) => (
                                        <Chip
                                          key={idx}
                                          label={stain}
                                          size="small"
                                          variant="outlined"
                                        />
                                      ))}
                                    </Box>
                                  </Grid>
                                )}

                                {/* Дефекти */}
                                {item.defects && item.defects.length > 0 && (
                                  <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      Дефекти та ризики:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {item.defects.map((defect, idx) => (
                                        <Chip
                                          key={idx}
                                          label={defect}
                                          size="small"
                                          variant="outlined"
                                          color="warning"
                                        />
                                      ))}
                                    </Box>
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Підсумкова строка */}
              <TableRow>
                <TableCell colSpan={compact ? 4 : 6} sx={{ fontWeight: 'bold' }}>
                  Загальна сума:
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(totalAmount)}
                </TableCell>
                {showDetails && <TableCell />}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Grid>
  );
};
