'use client';

import { Box, Container, Paper, Typography } from '@mui/material';
import PriceListCategories from './PriceListCategories';
import { usePriceList } from '../hooks/usePriceList';

/**
 * Компонент відображення прайс-листа з категоріями послуг
 */
export function PriceList() {
  const { categories, loading, error } = usePriceList();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Прайс-лист
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Актуальні ціни на послуги нашої хімчистки
        </Typography>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <PriceListCategories
          categories={categories}
          loading={loading}
          error={error}
        />
      </Paper>
    </Container>
  );
}
