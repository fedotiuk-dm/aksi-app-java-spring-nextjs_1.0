'use client';

import { Typography, Container, Paper, Grid, Box, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useParams } from 'next/navigation';

export function ClientDetail() {
  const params = useParams();
  const clientId = params.clientId as string;
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Інформація про клієнта
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          href="/clients"
        >
          Назад до списку
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body1" gutterBottom>
              ID клієнта: {clientId}
            </Typography>
            <Typography variant="body1">
              Тут буде відображатися детальна інформація про клієнта, історія замовлень та контактна інформація.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
