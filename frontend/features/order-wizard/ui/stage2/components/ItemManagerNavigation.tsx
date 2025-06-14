'use client';

import { Add as AddIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import React from 'react';

interface ItemManagerNavigationProps {
  itemsCount: number;
  onAddItem: () => void;
  onProceedToNext: () => void;
  loading?: boolean;
}

export const ItemManagerNavigation: React.FC<ItemManagerNavigationProps> = ({
  itemsCount,
  onAddItem,
  onProceedToNext,
  loading = false,
}) => {
  const canProceed = itemsCount > 0 && !loading;

  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Button
        variant="outlined"
        size="large"
        startIcon={<AddIcon />}
        onClick={onAddItem}
        disabled={loading}
      >
        Додати ще предмет
      </Button>

      <Button
        variant="contained"
        size="large"
        endIcon={<ArrowForwardIcon />}
        onClick={onProceedToNext}
        disabled={!canProceed}
      >
        Продовжити до наступного етапу
      </Button>
    </Box>
  );
};
