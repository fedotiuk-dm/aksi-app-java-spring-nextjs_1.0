'use client';

import { Typography, Container, Paper, Grid, Box } from '@mui/material';

export function PriceList() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Прайс-лист
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body1">
              Тут буде відображатися прайс-лист послуг хімчистки з можливістю фільтрації за категоріями та пошуку.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
