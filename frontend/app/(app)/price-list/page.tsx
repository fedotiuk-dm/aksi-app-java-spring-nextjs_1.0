'use client';

import React from 'react';
import { Container } from '@mui/material';
import { PriceList } from '@/features/pricelist/components/PriceList';


/**
 * Сторінка прайс-листа послуг хімчистки
 */
export default function PriceListPage() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <PriceList />
    </Container>
  );
}
