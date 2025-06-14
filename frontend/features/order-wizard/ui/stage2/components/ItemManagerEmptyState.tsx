'use client';

import { Add as AddIcon } from '@mui/icons-material';
import { Card, CardContent, Typography, Button } from '@mui/material';
import React from 'react';

interface ItemManagerEmptyStateProps {
  onAddItem: () => void;
}

export const ItemManagerEmptyState: React.FC<ItemManagerEmptyStateProps> = ({ onAddItem }) => {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Предмети ще не додані
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Додайте перший предмет до замовлення, щоб продовжити
        </Typography>
        <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={onAddItem}>
          Додати перший предмет
        </Button>
      </CardContent>
    </Card>
  );
};
