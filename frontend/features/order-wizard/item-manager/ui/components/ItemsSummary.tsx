'use client';

import { Box, Typography, Chip } from '@mui/material';
import React from 'react';

/**
 * Компонент для відображення статистики предметів
 *
 * Показує:
 * - Кількість доданих предметів
 * - Загальну вартість
 * - Статус готовності до переходу
 */
export const ItemsSummary: React.FC = () => {
  // TODO: Отримувати дані з domain layer
  const itemsCount = 0;
  const totalAmount = 0;
  const isReadyToProceed = itemsCount > 0;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
      <Box>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          Предмети в замовленні
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Управління предметами для чистки
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Chip
          label={`${itemsCount} предметів`}
          color={itemsCount > 0 ? 'primary' : 'default'}
          variant={itemsCount > 0 ? 'filled' : 'outlined'}
        />

        <Chip
          label={`${totalAmount.toFixed(2)} грн`}
          color={totalAmount > 0 ? 'success' : 'default'}
          variant={totalAmount > 0 ? 'filled' : 'outlined'}
        />

        <Chip
          label={isReadyToProceed ? 'Готово до продовження' : 'Додайте предмети'}
          color={isReadyToProceed ? 'success' : 'warning'}
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default ItemsSummary;
