'use client';

import { Typography, Container, Paper, Grid, Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export function OrderList() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Замовлення
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          href="/order"
        >
          Нове замовлення
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body1">
              Тут буде відображатися список замовлень з можливістю пошуку, фільтрації за статусом та сортування за датами.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
