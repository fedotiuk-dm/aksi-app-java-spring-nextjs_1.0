'use client';

import { Add as AddIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Box, Grid, Button, Typography, Card, CardContent } from '@mui/material';
import React from 'react';

import { useItemWizard } from '@/domains/wizard';

import { ItemsTable } from './ItemsTable';
import { ItemSummaryCard } from './ItemSummaryCard';

import type { OrderItemDTO } from '@/lib/api/generated/models/OrderItemDTO';

/**
 * Головний екран менеджера предметів (підетап 2.0)
 *
 * Відповідальність:
 * - Відображення таблиці доданих предметів
 * - Показ статистики замовлення
 * - Кнопки для додавання предметів та навігації
 */
interface ItemManagerScreenProps {
  items: OrderItemDTO[];
  totalAmount: number;
  itemCount: number;
  canProceedToNextStage: boolean;
  onComplete?: () => void;
  onBack?: () => void;
}

export const ItemManagerScreen: React.FC<ItemManagerScreenProps> = ({
  items,
  totalAmount,
  itemCount,
  canProceedToNextStage,
  onComplete,
  onBack,
}) => {
  const { startNewItem, isLoading } = useItemWizard();

  const handleAddItem = React.useCallback(async () => {
    await startNewItem();
  }, [startNewItem]);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        {/* Статистика замовлення */}
        <Grid size={{ xs: 12 }}>
          <ItemSummaryCard totalAmount={totalAmount} itemCount={itemCount} items={items} />
        </Grid>

        {/* Кнопка додавання предмета */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Предмети замовлення</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
                  disabled={isLoading}
                  size="large"
                >
                  Додати предмет
                </Button>
              </Box>

              {/* Таблиця предметів */}
              {items.length > 0 ? (
                <ItemsTable items={items} />
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Предмети ще не додані
                  </Typography>
                  <Typography variant="body2">
                    Натисніть кнопку &quot;Додати предмет&quot; щоб почати
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Навігаційні кнопки */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 3,
            }}
          >
            <Button variant="outlined" onClick={onBack} size="large">
              Назад
            </Button>

            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={onComplete}
              disabled={!canProceedToNextStage}
              size="large"
            >
              Продовжити до наступного етапу
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
