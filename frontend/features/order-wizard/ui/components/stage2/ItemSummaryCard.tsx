'use client';

import {
  ShoppingCart as CartIcon,
  Euro as EuroIcon,
  Category as CategoryIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Card, CardContent, Typography, Box, Grid, Chip, Divider } from '@mui/material';
import React from 'react';

import { calculateManagerStatistics, formatPrice } from '@/domains/wizard';

import type { OrderItemDTO } from '@/lib/api/generated/models/OrderItemDTO';

/**
 * Картка з підсумковою інформацією про предмети замовлення
 *
 * Відповідальність:
 * - Відображення загальної статистики (кількість, сума, категорії)
 * - Показ важливих індикаторів (дефекти, особливі умови)
 * - Візуальний підсумок стану замовлення
 */
interface ItemSummaryCardProps {
  totalAmount: number;
  itemCount: number;
  items: OrderItemDTO[];
}

export const ItemSummaryCard: React.FC<ItemSummaryCardProps> = ({
  totalAmount,
  itemCount,
  items,
}) => {
  const statistics = React.useMemo(() => {
    return calculateManagerStatistics(items);
  }, [items]);

  const StatisticItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  }> = ({ icon, label, value, color = 'primary' }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 2,
        borderRadius: 1,
        backgroundColor: 'background.default',
      }}
    >
      <Box sx={{ color: `${color}.main` }}>{icon}</Box>
      <Box>
        <Typography variant="h6" component="div" color={`${color}.main`}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Підсумок замовлення
        </Typography>

        <Grid container spacing={2}>
          {/* Основна статистика */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticItem
              icon={<CartIcon />}
              label="Предметів"
              value={itemCount}
              color="primary"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticItem
              icon={<EuroIcon />}
              label="Загальна сума"
              value={formatPrice(totalAmount)}
              color="success"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticItem
              icon={<CategoryIcon />}
              label="Категорій"
              value={statistics.categoriesCount}
              color="info"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticItem
              icon={<WarningIcon />}
              label="З дефектами"
              value={statistics.hasDefectItems ? 'Так' : 'Ні'}
              color={statistics.hasDefectItems ? 'warning' : 'success'}
            />
          </Grid>
        </Grid>

        {/* Детальна інформація */}
        {items.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Деталі замовлення:
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {statistics.averageItemPrice > 0 && (
                  <Chip
                    label={`Середня ціна: ${formatPrice(statistics.averageItemPrice)}`}
                    size="small"
                    variant="outlined"
                  />
                )}

                {statistics.categoriesCount > 0 && (
                  <Chip
                    label={`Категорій: ${statistics.categoriesCount}`}
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                )}
              </Box>

              {/* Індикатори стану */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {statistics.hasDefectItems && (
                  <Chip
                    icon={<WarningIcon />}
                    label="Предмети з дефектами"
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                )}

                {statistics.hasSpecialInstructions && (
                  <Chip
                    label="З особливими інструкціями"
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </>
        )}

        {/* Індикатор готовності */}
        {itemCount === 0 && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: 'warning.light',
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="warning.dark">
              Для продовження до наступного етапу потрібно додати принаймні один предмет
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
