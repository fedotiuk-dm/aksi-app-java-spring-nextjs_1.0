'use client';

import { Typography, Container, Paper, Grid, Box, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useParams } from 'next/navigation';

export function OrderDetail() {
  const params = useParams();
  const orderId = params.orderId as string;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Деталі замовлення
        </Typography>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} href="/orders">
          Назад до списку
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body1" gutterBottom>
              ID замовлення: {orderId}
            </Typography>
            <Typography variant="body1">
              Тут буде відображатися детальна інформація про замовлення, статус виконання, список
              речей та інформація про оплату.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
