import { Box, Typography, Button, Paper, Container } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          🏪 Хімчистка AKSI
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Система управління для сервісу хімчистки
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/dashboard"
            variant="contained"
            size="large"
            sx={{ minWidth: 200 }}
          >
            📊 Dashboard
          </Button>

          <Button
            component={Link}
            href="/order-wizard-test"
            variant="outlined"
            size="large"
            sx={{ minWidth: 200 }}
          >
            🧪 Test Order Wizard (XState v5)
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
          DDD inside, FSD outside архітектура
        </Typography>
      </Paper>
    </Container>
  );
}
