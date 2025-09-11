/**
 * @fileoverview Home page component
 * Welcome page with navigation to main application features
 */

'use client';

import { Box, Typography, Button, Paper, Container } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          AKSI Dry Cleaning
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Management system for dry cleaning services
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/dashboard"
            variant="contained"
            size="large"
            sx={{ minWidth: 200 }}
          >
            Dashboard
          </Button>

          <Button
            component={Link}
            href="/order-wizard"
            variant="outlined"
            size="large"
            sx={{ minWidth: 200 }}
          >
            Create Order
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
          DDD inside, FSD outside architecture
        </Typography>
      </Paper>
    </Container>
  );
}
