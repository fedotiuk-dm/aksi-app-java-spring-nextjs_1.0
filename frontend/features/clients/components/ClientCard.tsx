'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Loyalty as LoyaltyIcon,
  Receipt as ReceiptIcon,
  Notes as NotesIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { ClientResponse, ClientStatus, LoyaltyLevel } from '../types';

interface ClientCardProps {
  client: ClientResponse;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  // Функція для форматування дати
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Функція для форматування грошей
  const formatMoney = (amount?: number) => {
    if (amount === undefined) return '—';
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Статус клієнта
  const getStatusInfo = (status: ClientStatus) => {
    const statusMap = {
      [ClientStatus.ACTIVE]: { color: 'success', label: 'Активний' },
      [ClientStatus.INACTIVE]: { color: 'default', label: 'Неактивний' },
      [ClientStatus.BLOCKED]: { color: 'error', label: 'Заблокований' },
    };
    return statusMap[status] || { color: 'default', label: status };
  };

  // Рівень лояльності
  const getLoyaltyInfo = (level: LoyaltyLevel) => {
    const loyaltyMap = {
      [LoyaltyLevel.STANDARD]: { color: 'default', label: 'Стандарт' },
      [LoyaltyLevel.SILVER]: { color: 'info', label: 'Срібний' },
      [LoyaltyLevel.GOLD]: { color: 'warning', label: 'Золотий' },
      [LoyaltyLevel.PLATINUM]: { color: 'secondary', label: 'Платиновий' },
      [LoyaltyLevel.VIP]: { color: 'success', label: 'VIP' },
    };
    return loyaltyMap[level] || { color: 'default', label: level };
  };

  const statusInfo = getStatusInfo(client.status);
  const loyaltyInfo = getLoyaltyInfo(client.loyaltyLevel);

  return (
    <Card elevation={0} sx={{ width: '100%' }}>
      <CardContent>
        <Grid container spacing={3}>
          {/* Основні дані клієнта */}
          <Grid size={12}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Typography variant="h5" component="div">
                {client.fullName}
              </Typography>
              <Chip
                size="small"
                label={statusInfo.label}
                color={statusInfo.color as 'success' | 'default' | 'error'}
              />
            </Stack>
          </Grid>

          {/* Контактні дані */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Контактна інформація
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography>{client.phone}</Typography>
              </Box>
              {client.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography>{client.email}</Typography>
                </Box>
              )}
              {client.address && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HomeIcon fontSize="small" color="action" />
                  <Typography>{client.address}</Typography>
                </Box>
              )}
              {client.birthDate && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography>
                    Дата народження: {formatDate(client.birthDate)}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>

          {/* Інформація про лояльність і замовлення */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Лояльність і замовлення
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LoyaltyIcon fontSize="small" color="action" />
                <Typography>
                  Рівень лояльності:{' '}
                  <Chip
                    size="small"
                    label={loyaltyInfo.label}
                    color={
                      loyaltyInfo.color as
                        | 'default'
                        | 'info'
                        | 'warning'
                        | 'secondary'
                        | 'success'
                    }
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Box>
              {client.loyaltyPoints !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LoyaltyIcon fontSize="small" color="action" />
                  <Typography>Бонусні бали: {client.loyaltyPoints}</Typography>
                </Box>
              )}
              {client.orderCount !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptIcon fontSize="small" color="action" />
                  <Typography>
                    Кількість замовлень: {client.orderCount}
                  </Typography>
                </Box>
              )}
              {client.totalSpent !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptIcon fontSize="small" color="action" />
                  <Typography>
                    Загальна сума: {formatMoney(client.totalSpent)}
                  </Typography>
                </Box>
              )}
              {client.lastOrderDate && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography>
                    Останнє замовлення: {formatDate(client.lastOrderDate)}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>

          {/* Примітки */}
          {client.notes && (
            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  mt: 2,
                }}
              >
                <NotesIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                <Typography variant="body2">{client.notes}</Typography>
              </Box>
            </Grid>
          )}

          {/* Теги клієнта */}
          {client.tags && client.tags.length > 0 && (
            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Теги:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {client.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          )}

          {/* Інформація про створення */}
          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Створено: {formatDate(client.createdAt)} • Оновлено:{' '}
              {formatDate(client.updatedAt)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
