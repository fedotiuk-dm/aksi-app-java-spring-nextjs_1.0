'use client';

import { Typography, Container, Paper, Grid } from '@mui/material';

export function Dashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Головна панель AKSI
            </Typography>
            <Typography variant="body1">
              Ласкаво просимо до системи управління хімчисткою AKSI. Тут буде розміщена інформація
              про поточні замовлення, статистику та важливі показники.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
