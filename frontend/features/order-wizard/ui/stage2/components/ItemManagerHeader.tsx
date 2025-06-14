'use client';

import { Add as AddIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import React from 'react';

interface ItemManagerHeaderProps {
  itemsCount: number;
  totalAmount: number;
  onAddItem: () => void;
  loading?: boolean;
}

export const ItemManagerHeader: React.FC<ItemManagerHeaderProps> = ({
  itemsCount,
  totalAmount,
  onAddItem,
  loading = false,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">Предметів у замовленні: {itemsCount}</Typography>
            <Typography variant="h5" color="primary">
              Загальна вартість: {totalAmount.toFixed(2)} грн
            </Typography>
          </Box>

          {/* Кнопка додавання (головна) */}
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={onAddItem}
            disabled={loading}
          >
            Додати предмет
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
