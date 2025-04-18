'use client';

import { Typography, Container, Paper, Grid, Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export function ClientList() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Клієнти
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          href="/clients/new"
        >
          Новий клієнт
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body1">
              Тут буде відображатися список клієнтів хімчистки з можливістю пошуку, фільтрації та сортування.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
