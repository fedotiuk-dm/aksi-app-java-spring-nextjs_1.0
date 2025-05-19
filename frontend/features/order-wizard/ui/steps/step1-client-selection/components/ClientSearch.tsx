'use client';

import ClearIcon from '@mui/icons-material/Clear';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
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
import { Theme } from '@mui/material/styles';
import React from 'react';

import { useClientSearch } from '@/features/order-wizard/api/clients/hooks/use-client-search';
import { Client } from '@/features/order-wizard/model/types';

interface ClientSearchProps {
  onClientSelect: (client: Client) => void;
  className?: string;
}

// Компонент для відображення заголовка пошуку
const SearchHeader = ({ isTablet }: { isTablet: boolean }) => (
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
      sx={{ fontSize: isTablet ? '1rem' : '0.875rem' }}
    >
      Введіть прізвище, телефон або email клієнта (мінімум 3 символи)
    </Typography>
  </Box>
);

// Компонент для відображення інформації про клієнта
const ClientInfo = ({ client, isTablet }: { client: Client; isTablet: boolean }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <Typography
      variant={isTablet ? 'h6' : 'subtitle1'}
      fontWeight="bold"
      color="primary"
      sx={{ fontSize: isTablet ? '1.25rem' : '1rem' }}
    >
      {client.lastName} {client.firstName}
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {client.phone && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">{client.phone}</Typography>
        </Box>
      )}
      {client.email && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon fontSize="small" color="action" />
          <Typography variant="body2">{client.email}</Typography>
        </Box>
      )}
      {client.address && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {client.address.street}, {client.address.city}
          </Typography>
        </Box>
      )}
    </Box>
    {client.source && (
      <Box sx={{ mt: 1 }}>
        <Chip label={client.source.source} size="small" color="primary" variant="outlined" />
      </Box>
    )}
  </Box>
);

// Компонент для відображення результатів пошуку
const SearchResults = ({
  results,
  isTablet,
  isMobile,
  theme,
  onSelect,
}: {
  results: Client[];
  isTablet: boolean;
  isMobile: boolean;
  theme: Theme;
  onSelect: (client: Client) => void;
}) => (
  <Grow in={results.length > 0} timeout={400}>
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
          Знайдено клієнтів: {results.length}
        </Typography>
      </Box>

      <Box>
        {results.map((client, index) => (
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
            onClick={() => onSelect(client)}
          >
            <ClientInfo client={client} isTablet={isTablet} />
          </Box>
        ))}
      </Box>
    </Paper>
  </Grow>
);

/**
 * Компонент для пошуку клієнтів
 * Використовує хук useClientSearch для логіки пошуку
 */
export const ClientSearch: React.FC<ClientSearchProps> = ({ onClientSelect, className }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { searchTerm, setSearchTerm, isLoading, searchResults = [] } = useClientSearch();

  const handleClearSearch = () => setSearchTerm('');

  return (
    <Box className={className} sx={{ position: 'relative' }}>
      <SearchHeader isTablet={isTablet} />

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
              <SearchIcon color="primary" fontSize={isTablet ? 'medium' : 'small'} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isLoading ? (
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
        disabled={isLoading}
      />

      {searchResults.length > 0 && (
        <SearchResults
          results={searchResults}
          isTablet={isTablet}
          isMobile={isMobile}
          theme={theme}
          onSelect={onClientSelect}
        />
      )}
    </Box>
  );
};

export default ClientSearch;
