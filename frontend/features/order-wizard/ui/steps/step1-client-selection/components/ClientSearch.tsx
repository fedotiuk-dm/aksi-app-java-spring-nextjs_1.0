'use client';

import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grow,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Client } from '@/features/order-wizard/model/types';
import { useClientSearch } from '@/features/order-wizard/hooks';

interface ClientSearchProps {
  onClientSelect: (client: Client) => void;
  className?: string;
}

/**
 * Компонент для пошуку клієнтів
 * Використовує хук useClientSearch для логіки пошуку
 */
export const ClientSearch: React.FC<ClientSearchProps> = ({
  onClientSelect,
  className,
}) => {
  // Використовуємо тему та медіазапити для адаптивного дизайну
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Використовуємо хук для логіки пошуку
  const {
    searchTerm,
    setSearchTerm,
    isSearching,
    searchResults,
    handleClearSearch,
    handleClientSelect,
  } = useClientSearch({
    onClientSelect, // Передаємо обробник вибору клієнта у хук
  });

  return (
    <Box className={className} sx={{ position: 'relative' }}>
      <Box mb={2}>
        <Typography
          variant={isTablet ? 'h6' : 'subtitle1'}
          fontWeight={isTablet ? 600 : 500}
          color="primary.dark"
          gutterBottom
        >
          Пошук клієнта
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: isTablet ? '1rem' : '0.875rem',
          }}
        >
          Введіть прізвище, телефон або email клієнта (мінімум 3 символи)
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="Пошук клієнта"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
        size={isTablet ? 'medium' : 'small'}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            fontSize: isTablet ? '1.1rem' : '1rem',
          },
          '& .MuiInputLabel-root': {
            fontSize: isTablet ? '1.1rem' : '1rem',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                color="primary"
                fontSize={isTablet ? 'medium' : 'small'}
              />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isSearching ? (
                <CircularProgress size={isTablet ? 24 : 20} />
              ) : searchTerm ? (
                <IconButton
                  aria-label="Очистити пошук"
                  onClick={handleClearSearch}
                  edge="end"
                  size={isTablet ? 'medium' : 'small'}
                >
                  <ClearIcon />
                </IconButton>
              ) : null}
            </InputAdornment>
          ),
        }}
        placeholder="Прізвище, телефон або email"
        disabled={isSearching}
      />

      {searchResults.length > 0 && (
        <Grow in={searchResults.length > 0} timeout={400}>
          <Paper
            elevation={3}
            sx={{
              mt: 2,
              maxHeight: isMobile ? 350 : 400,
              overflow: 'auto',
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: 2,
            }}
          >
            {/* Заголовок з кількістю знайдених клієнтів */}
            <Box
              sx={{
                p: isTablet ? 2 : 1.5,
                bgcolor: 'primary.main',
                color: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <SearchIcon />
              <Typography
                variant={isTablet ? 'subtitle1' : 'subtitle2'}
                sx={{
                  fontWeight: 'bold',
                  fontSize: isTablet ? '1.1rem' : '0.9rem',
                }}
              >
                Знайдено клієнтів: {searchResults.length}
              </Typography>
            </Box>

            {/* Список знайдених клієнтів */}
            <Box>
              {searchResults.map((client, index) => (
                <Box
                  key={client.id || `client-${index}`}
                  sx={{
                    p: isTablet ? 2.5 : 2,
                    cursor: 'pointer',
                    bgcolor: index % 2 === 0 ? 'background.paper' : 'grey.50',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease',
                    },
                    '&:not(:last-child)': {
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => handleClientSelect(client)}
                >
                  {/* Ім'я та прізвище клієнта */}
                  <Typography
                    variant={isTablet ? 'h6' : 'subtitle1'}
                    fontWeight="bold"
                    color="primary"
                    sx={{
                      fontSize: isTablet ? '1.25rem' : '1rem',
                    }}
                  >
                    {client.lastName} {client.firstName}
                  </Typography>

                  {/* Контактна інформація */}
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {client.phone && (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <PhoneIcon fontSize="small" color="primary" />
                        <Typography
                          variant="body2"
                          sx={{ fontSize: isTablet ? '1rem' : '0.875rem' }}
                        >
                          {client.phone}
                        </Typography>
                      </Box>
                    )}

                    {client.email && (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <EmailIcon fontSize="small" color="primary" />
                        <Typography
                          variant="body2"
                          sx={{ fontSize: isTablet ? '1rem' : '0.875rem' }}
                        >
                          {client.email}
                        </Typography>
                      </Box>
                    )}

                    {(client.address?.city || client.address?.street) && (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <LocationOnIcon fontSize="small" color="primary" />
                        <Typography
                          variant="body2"
                          sx={{ fontSize: isTablet ? '1rem' : '0.875rem' }}
                        >
                          {[client.address.city, client.address.street]
                            .filter(Boolean)
                            .join(', ')}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Комунікаційні канали */}
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
                            label={
                              channel === 'PHONE'
                                ? 'Телефон'
                                : channel === 'SMS'
                                ? 'SMS'
                                : channel
                            }
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
                </Box>
              ))}
            </Box>
          </Paper>
        </Grow>
      )}

      {searchTerm.length >= 3 && searchResults.length === 0 && !isSearching && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 2,
            fontSize: isTablet ? '1rem' : '0.875rem',
            fontStyle: 'italic',
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          Клієнтів не знайдено. Спробуйте змінити пошуковий запит або створіть
          нового клієнта.
        </Typography>
      )}
    </Box>
  );
};

export default ClientSearch;
