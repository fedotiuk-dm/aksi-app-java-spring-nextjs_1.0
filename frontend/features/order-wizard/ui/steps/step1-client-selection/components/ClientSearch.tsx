'use client';

import React from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
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
  className 
}) => {
  // Використовуємо хук для логіки пошуку
  const {
    searchTerm,
    setSearchTerm,
    isSearching,
    searchResults,
    handleClearSearch,
    handleClientSelect
  } = useClientSearch({
    onClientSelect, // Передаємо обробник вибору клієнта у хук
  });
  
  return (
    <Box className={className}>
      <Typography variant="h6" gutterBottom>
        Пошук клієнта
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Введіть прізвище, телефон або email клієнта (мінімум 3 символи)
      </Typography>
      
      <TextField
        fullWidth
        label="Пошук клієнта"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isSearching ? (
                <CircularProgress size={20} />
              ) : searchTerm ? (
                <IconButton
                  aria-label="Очистити пошук"
                  onClick={handleClearSearch}
                  edge="end"
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
        <Paper sx={{ mt: 2, maxHeight: 400, overflow: 'auto', border: '1px solid #1976d2' }}>
          {/* Заголовок з кількістю знайдених клієнтів */}
          <Typography
            variant="subtitle2"
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'  
            }}
          >
            Знайдено клієнтів: {searchResults.length}
          </Typography>
          
          {/* Список знайдених клієнтів */}
          <Box>
            {searchResults.map((client, index) => (
              <Box 
                key={client.id || `client-${index}`} 
                sx={{ 
                  p: 2, 
                  cursor: 'pointer',
                  bgcolor: index % 2 === 0 ? 'background.paper' : 'grey.50',
                  '&:hover': { bgcolor: 'action.hover' },
                  '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5
                }}
                onClick={() => handleClientSelect(client)}
              >
                {/* Ім'я та прізвище клієнта */}
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  {client.lastName} {client.firstName}
                </Typography>
                
                {/* Контактна інформація */}
                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {client.phone && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <strong>📞 Телефон:</strong> {client.phone}
                    </Typography>
                  )}
                  
                  {client.email && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <strong>✉️ Email:</strong> {client.email}
                    </Typography>
                  )}
                  
                  {(client.address?.city || client.address?.street) && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <strong>📍 Адреса:</strong> {[client.address.city, client.address.street].filter(Boolean).join(', ')}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
      
      {searchTerm.length >= 3 && searchResults.length === 0 && !isSearching && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Клієнтів не знайдено. Спробуйте змінити пошуковий запит або створіть нового клієнта.
        </Typography>
      )}
    </Box>
  );
};

export default ClientSearch;
