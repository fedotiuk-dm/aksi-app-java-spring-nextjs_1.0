'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Divider,
  Breadcrumbs,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useClient } from '../hooks/useClient';
import { ClientCard } from './ClientCard';
import { useDeleteClient } from '../hooks/useDeleteClient';

interface ClientDetailPageContentProps {
  clientId: string;
}

export default function ClientDetailPageContent({
  clientId,
}: ClientDetailPageContentProps) {
  const router = useRouter();
  const { data: client, isLoading, isError } = useClient(clientId);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteClient = useDeleteClient();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteClient.mutateAsync(clientId);
      setDeleteDialogOpen(false);
      router.push('/clients');
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError || !client) {
    return (
      <Container>
        <Alert severity="error" sx={{ my: 4 }}>
          Клієнта не знайдено або сталася помилка при завантаженні даних
        </Alert>
        <Button startIcon={<ArrowBackIcon />} component={Link} href="/clients">
          Повернутися до списку клієнтів
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Головна
          </Link>
          <Link
            href="/clients"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Клієнти
          </Link>
          <Typography color="text.primary">{client.fullName}</Typography>
        </Breadcrumbs>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {client.fullName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Клієнт #{clientId.slice(-6)}
            </Typography>
          </Grid>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => router.push(`/clients/${clientId}/edit`)}
            >
              Редагувати
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
            >
              Видалити
            </Button>
          </Grid>
        </Grid>

        <Card sx={{ mb: 3 }}>
          <ClientCard client={client} />
        </Card>

        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="client tabs"
            sx={{ px: 2 }}
          >
            <Tab
              icon={<ReceiptIcon />}
              label="Замовлення"
              iconPosition="start"
            />
            <Tab icon={<HistoryIcon />} label="Історія" iconPosition="start" />
            <Tab icon={<PersonIcon />} label="Профіль" iconPosition="start" />
          </Tabs>
          <Divider />
          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Замовлення клієнта
                </Typography>
                {client.orderCount === 0 ? (
                  <Alert severity="info">Клієнт ще не має замовлень</Alert>
                ) : (
                  <Typography>
                    Тут буде список замовлень клієнта (скоро)
                  </Typography>
                )}
              </Box>
            )}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Історія активності
                </Typography>
                <Typography>Тут буде історія дій клієнта (скоро)</Typography>
              </Box>
            )}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Детальна інформація
                </Typography>
                <Typography>
                  Тут буде детальна інформація про клієнта (скоро)
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        <Button
          startIcon={<ArrowBackIcon />}
          component={Link}
          href="/clients"
          sx={{ mt: 2 }}
        >
          Повернутися до списку клієнтів
        </Button>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Видалення клієнта</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ви дійсно хочете видалити клієнта &quot;{client.fullName}&quot;?
            Ця дія не може бути скасована.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Скасувати</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
