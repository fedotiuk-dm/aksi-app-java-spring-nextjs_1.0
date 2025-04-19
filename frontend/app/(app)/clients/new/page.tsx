import { Container, Typography, Box, Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import ClientForm from '@/features/clients/components/ClientForm';

export default function NewClientPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Додати нового клієнта
        </Typography>
        
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link href="/clients" style={{ textDecoration: 'none', color: 'inherit' }}>
            Клієнти
          </Link>
          <Typography color="text.primary">Новий клієнт</Typography>
        </Breadcrumbs>
      </Box>
      
      <ClientForm />
    </Container>
  );
}
