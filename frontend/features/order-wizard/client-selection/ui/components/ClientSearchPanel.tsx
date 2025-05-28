'use client';

import { Search, Person, Phone, Email, LocationOn, ArrowBack } from '@mui/icons-material';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
  Chip,
  Divider,
  Pagination,
} from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

// Типи з доменного шару
import type { ClientSearchState } from '@/domain/wizard/hooks/stage-1-client-and-order';
import type { ClientResponse } from '@/shared/api/generated/client';

interface ClientSearchPanelProps {
  searchState: ClientSearchState;
  formattedClients: Array<{
    client: ClientResponse;
    formatted: {
      fullName: string;
      contactInfo: string;
      address: string;
      source: string;
      orderCount: string;
      lastUpdate: string;
    };
  }>;
  onSearchTermChange: (term: string) => void;
  onClearSearch: () => void;
  onPageChange: (page: number) => void;
  onSelectClient: (client: ClientResponse) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

/**
 * Панель пошуку клієнтів (оновлена для DDD архітектури)
 */
export const ClientSearchPanel: React.FC<ClientSearchPanelProps> = ({
  searchState,
  formattedClients,
  onSearchTermChange,
  onClearSearch,
  onPageChange,
  onSelectClient,
  onBack,
  showBackButton = false,
}) => {
  const [localQuery, setLocalQuery] = useState(searchState.searchTerm);
  const lastSearchRef = useRef<string>('');

  // Синхронізація з зовнішнім searchTerm
  useEffect(() => {
    setLocalQuery(searchState.searchTerm);
  }, [searchState.searchTerm]);

  // Debounced пошук через хук
  useEffect(() => {
    const trimmedQuery = localQuery.trim();

    // Уникаємо дублювання запитів
    if (lastSearchRef.current === trimmedQuery) {
      return;
    }

    lastSearchRef.current = trimmedQuery;

    // Викликаємо хук для оновлення пошукового терміну (з debounce)
    onSearchTermChange(trimmedQuery);
  }, [localQuery, onSearchTermChange]);

  const handleClearSearch = () => {
    setLocalQuery('');
    onClearSearch();
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page - 1); // MUI використовує 1-based, API - 0-based
  };

  const renderClientItem = (formattedClient: (typeof formattedClients)[0]) => {
    const { client, formatted } = formattedClient;

    return (
      <ListItem key={client.id} disablePadding>
        <ListItemButton onClick={() => onSelectClient(client)}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Person sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="div">
                {formatted.fullName}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {client.phone && (
                <Chip icon={<Phone />} label={client.phone} variant="outlined" size="small" />
              )}
              {client.email && (
                <Chip
                  icon={<Email />}
                  label={client.email}
                  variant="outlined"
                  size="small"
                  color="secondary"
                />
              )}
              {client.address && (
                <Chip
                  icon={<LocationOn />}
                  label={client.address}
                  variant="outlined"
                  size="small"
                  color="default"
                />
              )}
            </Box>

            <Typography variant="caption" color="text.secondary">
              {formatted.orderCount} • Оновлено: {formatted.lastUpdate}
            </Typography>
          </Box>
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box>
      {/* Заголовок з кнопкою назад */}
      {showBackButton && onBack && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mr: 2 }}>
            Назад
          </Button>
          <Typography variant="h6">Пошук клієнтів</Typography>
        </Box>
      )}

      {!showBackButton && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Пошук клієнтів</Typography>
        </Box>
      )}

      {/* Поле пошуку */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Введіть прізвище, телефон, email... (автоматичний пошук з debounce 500ms)"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchState.isSearching ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : undefined,
          }}
        />
        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={handleClearSearch} disabled={searchState.isSearching}>
            Очистити пошук
          </Button>
          {localQuery.trim() && localQuery.trim().length < 2 && (
            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
              Введіть мінімум 2 символи для автоматичного пошуку
            </Typography>
          )}
        </Box>
      </Box>

      {/* Помилки */}
      {searchState.searchError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {searchState.searchError}
        </Alert>
      )}

      {/* Інформація про результати */}
      {searchState.searchTerm && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Знайдено: {formattedClients.length} клієнтів за запитом &quot;{searchState.searchTerm}
            &quot;
          </Typography>
        </Box>
      )}

      {/* Список клієнтів */}
      {formattedClients.length > 0 ? (
        <Paper elevation={0} sx={{ bgcolor: 'grey.50' }}>
          <List>
            {formattedClients.map((formattedClient) => (
              <React.Fragment key={formattedClient.client.id}>
                {renderClientItem(formattedClient)}
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : searchState.hasSearched && !searchState.isSearching ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            За запитом &quot;{searchState.searchTerm}&quot; нічого не знайдено
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Спробуйте змінити пошуковий запит або створити нового клієнта
          </Typography>
        </Box>
      ) : !searchState.hasSearched && formattedClients.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Введіть запит для пошуку клієнтів
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Мінімум 2 символи для автоматичного пошуку
          </Typography>
        </Box>
      ) : null}

      {/* Пагінація (якщо потрібна) */}
      {formattedClients.length > 0 && searchState.hasSearched && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(formattedClients.length / 20)}
            page={1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};
