'use client';

import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import PriceListCategories from '@/features/pricelist/components/PriceListCategories';
import { usePriceList } from '@/features/pricelist/hooks/usePriceList';


/**
 * Сторінка прайс-листа послуг хімчистки
 */
export default function PriceListPage() {
  const { categories, loading, error } = usePriceList();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Прайс-лист послуг
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Повний перелік послуг хімчистки з актуальними цінами
            </Typography>
          </Box>
          
          <PriceListCategories 
            categories={categories} 
            loading={loading} 
            error={error} 
          />
        </Paper>
      </Container>
  );
}
