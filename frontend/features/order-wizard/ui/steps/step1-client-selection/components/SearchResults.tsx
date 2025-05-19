'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Fade,
  Tooltip,
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  Pagination,
  Badge,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Client } from '@/features/order-wizard/model/types';
import { useSearchResults } from '@/features/order-wizard/api/clients/hooks/use-client-search';

interface SearchResultsProps {
  clients: Client[];
  onClientSelect: (client: Client) => void;
  onClientEdit: (client: Client) => void;
  className?: string;
}

/**
 * Компонент для відображення результатів пошуку клієнтів у вигляді сітки карток
 * Використовує хук useSearchResults для логіки
 */
export const SearchResults: React.FC<SearchResultsProps> = ({
  clients,
  onClientSelect,
  onClientEdit,
  className,
}) => {
  // Використовуємо тему та медіазапити для адаптивного дизайну
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Стан для пагінації
  const [page, setPage] = useState(1);
  const clientsPerPage = isTablet ? 8 : isMobile ? 4 : 12;

  // Використовуємо хук для логіки обробки результатів
  const { hasResults, handleClientSelect, handleClientEdit, getChannelLabel } =
    useSearchResults({ clients });

  // Якщо немає результатів, не відображаємо компонент
  if (!hasResults) {
    return null;
  }

  // Розраховуємо клієнтів для поточної сторінки
  const totalPages = Math.ceil(clients.length / clientsPerPage);
  const startIndex = (page - 1) * clientsPerPage;
  const displayedClients = clients.slice(
    startIndex,
    startIndex + clientsPerPage
  );

  // Функція для відображення ініціалів клієнта
  const getClientInitials = (client: Client) => {
    return `${client.firstName.charAt(0)}${client.lastName.charAt(
      0
    )}`.toUpperCase();
  };

  // Обробник зміни сторінки
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <Paper
      className={className}
      elevation={3}
      sx={{
        mt: 3,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Box
        sx={{
          p: isTablet ? 2 : 1.5,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon />
          <Typography
            variant={isTablet ? 'h6' : 'subtitle1'}
            fontWeight="bold"
            sx={{ fontSize: isTablet ? '1.1rem' : '1rem' }}
          >
            Вибрані клієнти
          </Typography>
        </Box>

        <Badge
          badgeContent={clients.length}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: isTablet ? '0.9rem' : '0.8rem',
              fontWeight: 'bold',
              height: isTablet ? 24 : 20,
              minWidth: isTablet ? 24 : 20,
            },
          }}
        >
          <Box />
        </Badge>
      </Box>

      <Box sx={{ p: isTablet ? 3 : 2, bgcolor: 'grey.50' }}>
        <Grid container spacing={isTablet ? 3 : 2}>
          {displayedClients.map((client, index) => (
            <Grid
              key={client.id || `selected-client-${index}`}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >
              <Fade in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[5],
                    },
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative',
                    borderRadius: 2,
                  }}
                >
                  <CardActionArea
                    onClick={() => handleClientSelect(client, onClientSelect)}
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      height: '100%',
                    }}
                  >
                    <CardContent sx={{ p: isTablet ? 2.5 : 2, flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          alignItems: 'center',
                          mb: 1.5,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            width: isTablet ? 48 : 40,
                            height: isTablet ? 48 : 40,
                            fontSize: isTablet ? '1.2rem' : '1rem',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                        >
                          {getClientInitials(client)}
                        </Avatar>

                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary"
                          noWrap
                          sx={{
                            fontSize: isTablet ? '1.2rem' : '1rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {client.lastName} {client.firstName}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        {client.phone && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {client.phone}
                            </Typography>
                          </Box>
                        )}
                        {client.email && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {client.email}
                            </Typography>
                          </Box>
                        )}
                        {client.address && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <LocationOnIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {client.address.street}, {client.address.city}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {client.communicationChannels &&
                        client.communicationChannels.length > 0 && (
                          <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 0.5,
                            }}
                          >
                            {client.communicationChannels.map((channel) => (
                              <Chip
                                key={channel}
                                label={getChannelLabel(channel)}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{
                                  fontSize: isTablet ? '0.9rem' : '0.75rem',
                                  height: isTablet ? 28 : 24,
                                }}
                              />
                            ))}
                          </Box>
                        )}
                    </CardContent>
                  </CardActionArea>

                  <CardActions sx={{ p: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="Редагувати клієнта">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClientEdit(client, onClientEdit);
                        }}
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.light',
                            color: 'white',
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size={isTablet ? 'medium' : 'small'}
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: isTablet ? '1rem' : '0.875rem',
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default SearchResults;
