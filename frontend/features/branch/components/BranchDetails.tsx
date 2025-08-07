'use client';

import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Skeleton,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  Schedule,
  Edit,
  ArrowBack,
} from '@mui/icons-material';
import { useGetBranchById } from '@/shared/api/generated/branch';
import { useRouter } from 'next/navigation';
import { useBranchStore } from '@/features/branch';

interface BranchDetailsProps {
  branchId: string;
}

export const BranchDetails: React.FC<BranchDetailsProps> = ({ branchId }) => {
  const router = useRouter();
  const { openForm } = useBranchStore();
  const { data: branch, isLoading, error } = useGetBranchById(branchId);

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Помилка завантаження інформації про філію: {error.message}
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="rectangular" height={200} />
        </Stack>
      </Container>
    );
  }

  if (!branch) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Філію не знайдено</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/branches')}
          sx={{ mb: 2 }}
        >
          Назад до списку
        </Button>
        
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4" component="h1">
            {branch.name}
          </Typography>
          <Chip
            label={branch.active ? 'Активна' : 'Неактивна'}
            color={branch.active ? 'success' : 'default'}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => openForm(branch)}
          >
            Редагувати
          </Button>
        </Stack>
      </Box>

      {/* Main Info */}
      <Grid container spacing={3}>
        <Grid size={{xs: 12, md: 8}}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Основна інформація
            </Typography>
            
            <Stack spacing={2} sx={{ mt: 2 }}>
              {branch.address && (
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <LocationOn color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Адреса
                    </Typography>
                    <Typography variant="body1">{branch.address}</Typography>
                  </Box>
                </Stack>
              )}

              {branch.phone && (
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Phone color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Телефон
                    </Typography>
                    <Typography variant="body1">{branch.phone}</Typography>
                  </Box>
                </Stack>
              )}

              {branch.email && (
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Email color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{branch.email}</Typography>
                  </Box>
                </Stack>
              )}

              {branch.workingHours && (
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Schedule color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Робочі години
                    </Typography>
                    <Typography variant="body1">{branch.workingHours}</Typography>
                  </Box>
                </Stack>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{xs: 12, md: 8}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Додаткова інформація
              </Typography>
              
              {branch.description && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Опис
                  </Typography>
                  <Typography variant="body1">{branch.description}</Typography>
                </Box>
              )}

              {branch.sortOrder !== undefined && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Порядок сортування
                  </Typography>
                  <Typography variant="body1">{branch.sortOrder}</Typography>
                </Box>
              )}

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ID філії
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {branch.id}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};