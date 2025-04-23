import React, { useState, useEffect, useCallback } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useSearchClients } from '../api/clients';
import { ClientResponse } from '@/lib/api';

interface ClientSearchProps {
  onClientSelect: (client: ClientResponse) => void;
  onCreateNew: () => void;
}

export default function ClientSearch({ onClientSelect, onCreateNew }: ClientSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  // Використовуємо константи замість state, оскільки ми не змінюємо ці значення
  const page = 0;
  const size = 10;
  
  const { mutate: searchClients, isPending: isLoading, data, isError } = useSearchClients();
  
  // Debounce функція для пошуку з затримкою
  const debounce = <T extends (...args: unknown[]) => void>(func: T, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Обробник пошуку
  const handleSearch = useCallback(() => {
    if (!searchTerm.trim()) return;
    
    searchClients({
      search: searchTerm,
      page,
      size
    });
  }, [searchTerm, searchClients, page, size]);
  
  // Автоматичний пошук з debounce при введенні
  const debouncedSearch = useCallback(() => {
    if (searchTerm.trim().length >= 2) {
      debounce(handleSearch, 500)();
    }
  }, [searchTerm, handleSearch]);
  
  // Відстежуємо зміни пошукового запиту і запускаємо автоматичний пошук
  useEffect(() => {
    // Запускаємо пошук після введення мінімум 2 символів
    debouncedSearch();
  }, [searchTerm, debouncedSearch]);

  // Обробник натискання Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Очистити поле пошуку
  const handleClear = () => {
    setSearchTerm('');
    // Очищаємо результати пошуку
    searchClients({ search: '', page: 0, size: 10 });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Пошук клієнта
      </Typography>
      
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Пошук за прізвищем або телефоном"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm && (
                    <IconButton onClick={handleClear} edge="end">
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={isLoading || !searchTerm.trim()}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          >
            Пошук
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            onClick={onCreateNew}
          >
            Створити нового клієнта
          </Button>
        </Grid>
        
        {isError && (
          <Grid size={12}>
            <Alert severity="error">
              Помилка при пошуку клієнтів
            </Alert>
          </Grid>
        )}
        
        {data && data.content && data.content.length === 0 && (
          <Grid size={12}>
            <Alert severity="info">
              Клієнтів не знайдено. Спробуйте змінити критерії пошуку або створіть нового.
            </Alert>
          </Grid>
        )}
        
        {data && data.content && data.content.length > 0 && (
          <Grid size={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Знайдені клієнти:
            </Typography>
            <Box sx={{ mt: 1 }}>
              {data.content.map((client) => (
                <Box
                  key={client.id}
                  sx={{
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                  onClick={() => onClientSelect(client)}
                >
                  <Typography variant="subtitle1">
                    {client.lastName} {client.firstName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {client.phone}
                  </Typography>
                  {client.email && (
                    <Typography variant="body2" color="textSecondary">
                      {client.email}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
