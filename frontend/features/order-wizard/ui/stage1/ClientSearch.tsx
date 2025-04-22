import React from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemButton, ListItemText, Alert, CircularProgress } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { ClientResponse } from '@/lib/api';

interface ClientSearchProps {
  searchTerm: string;
  clients: ClientResponse[];
  isSearching: boolean;
  error?: unknown;
  onSearch: (term: string) => void;
  onSelectClient: (client: ClientResponse) => void;
  onCreateNew: () => void;
}

export const ClientSearch: React.FC<ClientSearchProps> = ({
  searchTerm,
  clients,
  isSearching,
  error,
  onSearch,
  onSelectClient,
  onCreateNew,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(searchTerm);
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Пошук клієнта
      </Typography>
      
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <TextField
          label="Пошук за прізвищем або телефоном"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="Введіть прізвище або телефон клієнта"
          InputProps={{
            endAdornment: isSearching ? <CircularProgress size={20} /> : <SearchIcon />,
          }}
        />
        
        <Button
          variant="contained"
          onClick={() => onSearch(searchTerm)}
          disabled={isSearching || !searchTerm.trim()}
        >
          Пошук
        </Button>
      </Box>

      {!!error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Помилка пошуку клієнтів. Спробуйте пізніше.
        </Alert>
      )}

      {clients.length > 0 ? (
        <Box mb={2}>
          <Typography variant="subtitle1" mb={1}>
            Знайдені клієнти:
          </Typography>
          <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            {clients.map((client) => (
              <ListItem key={client.id} disablePadding divider>
                <ListItemButton onClick={() => onSelectClient(client)}>
                  <ListItemText
                    primary={`${client.lastName} ${client.firstName}`}
                    secondary={`Телефон: ${client.phone}${client.email ? ` | Email: ${client.email}` : ''}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : searchTerm && !isSearching ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Клієнтів не знайдено. Створіть нового клієнта.
        </Alert>
      ) : null}

      <Box display="flex" justifyContent="center">
        <Button variant="outlined" onClick={onCreateNew}>
          Створити нового клієнта
        </Button>
      </Box>
    </Box>
  );
};
