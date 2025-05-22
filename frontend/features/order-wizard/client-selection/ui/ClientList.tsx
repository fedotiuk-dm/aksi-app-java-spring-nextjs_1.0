'use client';

import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PhoneIcon from '@mui/icons-material/Phone';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Button,
  IconButton,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  Skeleton,
} from '@mui/material';
import React from 'react';

import { ClientResponse } from '@/lib/api';

import { useClientSearch } from '../hooks';
import { clientSourceOptions } from '../model/client-sources';
import { useClientStore } from '../store';

// Інтерфейс для властивостей компонента
interface ClientListProps {
  onClientSelect: (client: ClientResponse) => void;
  onClientEdit: (client: ClientResponse) => void;
}

/**
 * Компонент для відображення результатів пошуку клієнтів
 */
export const ClientList: React.FC<ClientListProps> = ({
  onClientSelect,
  onClientEdit,
}) => {
  // Отримуємо дані про клієнтів і стани з хуків
  const { clients = [], isLoading, search } = useClientSearch();
  const { selectedClient } = useClientStore();

  // Медіа-запити для адаптивного дизайну
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Визначення розміру сітки залежно від розміру екрану
  const gridSize = isMobile
    ? { xs: 12 }
    : isTablet
    ? { xs: 6 }
    : { xs: 4 };

  // Функція для відображення джерела клієнта
  const getSourceLabel = (source?: ClientResponse.source): string => {
    if (!source) return 'Невідомо';

    const sourceOption = clientSourceOptions.find(option => option.value === source);
    return sourceOption?.label || 'Невідомо';
  };

  // Функція для створення ініціалів клієнта
  const getClientInitials = (client: ClientResponse): string => {
    const lastName = client.lastName?.[0] || '';
    const firstName = client.firstName?.[0] || '';
    return `${lastName}${firstName}`.toUpperCase();
  };

  // Відображення скелетону під час завантаження
  if (isLoading) {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Пошук клієнтів...
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {[1, 2, 3].map((item) => (
            <Grid key={item} size={gridSize}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width="70%" height={24} />
                  </Box>
                  <Skeleton variant="text" width="50%" height={20} />
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }

  // Якщо пошук не було виконано
  if (!search.query && clients.length === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 4
        }}
      >
        <PersonAddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Введіть запит для пошуку
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Щоб знайти клієнта, введіть прізвище, телефон або email
        </Typography>
      </Paper>
    );
  }

  // Якщо пошук виконано, але клієнтів не знайдено
  if (search.query && clients.length === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 4
        }}
      >
        <Typography variant="h6" gutterBottom>
          Клієнтів не знайдено
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          За запитом &quot;{search.query}&quot; не знайдено жодного клієнта
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={() => {/* Цю логіку має обробляти батьківський компонент */}}
        >
          Створити клієнта
        </Button>
      </Paper>
    );
  }

  // Відображення списку клієнтів
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        {search.query
          ? `Результати пошуку за запитом "${search.query}"`
          : 'Список клієнтів'}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {clients.length === 1
          ? 'Знайдено 1 клієнта'
          : `Знайдено ${clients.length} клієнтів`}
      </Typography>

      <Grid container spacing={2}>
        {clients.map((client) => {
          const isSelected = selectedClient?.id === client.id;

          return (
            <Grid key={client.id} size={gridSize}>
              <Card
                variant={isSelected ? 'outlined' : 'elevation'}
                elevation={isSelected ? 0 : 2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  position: 'relative',
                  borderRadius: 2,
                  border: isSelected ? `2px solid ${theme.palette.primary.main}` : '',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardActionArea
                  onClick={() => onClientSelect(client)}
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ p: isTablet ? 2.5 : 2, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: isSelected ? 'primary.main' : 'primary.light',
                          width: 40,
                          height: 40
                        }}
                      >
                        {getClientInitials(client)}
                      </Avatar>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" component="div" fontWeight={500}>
                          {client.lastName} {client.firstName}
                        </Typography>

                        <Chip
                          label={getSourceLabel(client.source)}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.75rem',
                            mt: 0.5
                          }}
                        />
                      </Box>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClientEdit(client);
                        }}
                        sx={{
                          alignSelf: 'flex-start',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Divider sx={{ mb: 1.5 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {client.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon color="action" sx={{ fontSize: 18 }} />
                          <Typography variant="body2" color="text.secondary">
                            {client.phone}
                          </Typography>
                        </Box>
                      )}

                      {client.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon color="action" sx={{ fontSize: 18 }} />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {client.email}
                          </Typography>
                        </Box>
                      )}

                      {client.address && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <LocationOnIcon color="action" sx={{ fontSize: 18, mt: 0.2 }} />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {client.address}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default ClientList;
