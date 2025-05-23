'use client';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Box,
} from '@mui/material';
import React from 'react';

interface ItemModifier {
  name: string;
  percent: number;
  amount: number;
}

interface OrderItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  material: string;
  color: string;
  basePrice: number;
  modifiers: ItemModifier[];
  finalPrice: number;
  stains: string[];
  defects: string[];
}

interface ItemsTableProps {
  items: OrderItem[];
}

/**
 * Компонент для відображення таблиці предметів замовлення
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення таблиці предметів
 * - Отримує готові дані через пропси
 * - Не містить бізнес-логіки
 */
export const ItemsTable: React.FC<ItemsTableProps> = ({ items }) => {
  return (
    <Grid size={{ xs: 12 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Предмети замовлення
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>№</TableCell>
                  <TableCell>Найменування</TableCell>
                  <TableCell>Кіл.</TableCell>
                  <TableCell>Матеріал</TableCell>
                  <TableCell>Колір</TableCell>
                  <TableCell>Базова ціна</TableCell>
                  <TableCell>Модифікатори</TableCell>
                  <TableCell>Підсумок</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>{item.material}</TableCell>
                    <TableCell>{item.color}</TableCell>
                    <TableCell>{item.basePrice} грн</TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {item.modifiers.map((mod, idx) => (
                          <Typography key={idx} variant="caption" color="text.secondary">
                            {mod.name} (+{mod.percent}%): +{mod.amount} грн
                          </Typography>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {item.finalPrice} грн
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Додаткова інформація про предмети */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Забруднення та дефекти:
            </Typography>
            {items.map((item, index) => (
              <Box key={item.id} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>
                    {index + 1}. {item.name}:
                  </strong>
                </Typography>
                {item.stains.length > 0 && (
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Плями: {item.stains.join(', ')}
                    </Typography>
                  </Box>
                )}
                {item.defects.length > 0 && (
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="error.main">
                      Дефекти: {item.defects.join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ItemsTable;
