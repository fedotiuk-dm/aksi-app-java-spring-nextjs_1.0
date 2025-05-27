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
} from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

import type { UseClientManagementReturn } from '@/domain/wizard/hooks';
import type { ClientSearchResult } from '@/domain/wizard/services/stage-1-client-and-order-info/client-management';

interface ClientSearchPanelProps {
  searchQuery: string;
  searchResults: ClientSearchResult[];
  isSearching: boolean;
  searchError: string | null;
  searchClients: UseClientManagementReturn['searchClients'];
  clearSearch: UseClientManagementReturn['clearSearch'];
  formatPhone: UseClientManagementReturn['formatPhone'];
  createClientSummary: UseClientManagementReturn['createClientSummary'];
  onSelectClient: (client: ClientSearchResult) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

/**
 * Панель пошуку клієнтів
 */
export const ClientSearchPanel: React.FC<ClientSearchPanelProps> = ({
  searchQuery,
  searchResults,
  isSearching,
  searchError,
  searchClients,
  clearSearch,
  formatPhone,
  onSelectClient,
  onBack,
  showBackButton = true,
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const lastSearchRef = useRef<string>('');

  // Автоматичний debounced пошук при зміні localQuery
  useEffect(() => {
    const trimmedQuery = localQuery.trim();

    // Уникаємо дублювання запитів
    if (lastSearchRef.current === trimmedQuery) {
      return;
    }

    lastSearchRef.current = trimmedQuery;

    if (trimmedQuery.length >= 2) {
      searchClients(localQuery);
    } else if (trimmedQuery.length === 0) {
      searchClients('');
    }
  }, [localQuery, searchClients]);

  // Синхронізація з зовнішнім searchQuery
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (localQuery.trim()) {
      await searchClients(localQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    clearSearch();
  };

  const renderClientItem = (client: ClientSearchResult) => (
    <ListItem key={client.id} disablePadding>
      <ListItemButton onClick={() => onSelectClient(client)}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Person sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              {client.fullName || `${client.firstName} ${client.lastName}`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            <Chip
              icon={<Phone />}
              label={formatPhone(client.phone)}
              variant="outlined"
              size="small"
            />
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

          {client.orderCount !== undefined && (
            <Typography variant="caption" color="text.secondary">
              Замовлень: {client.orderCount}
            </Typography>
          )}
        </Box>
      </ListItemButton>
    </ListItem>
  );

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
          onKeyPress={handleKeyPress}
          placeholder="Введіть прізвище, телефон, email... (автоматичний пошук)"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: isSearching ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : undefined,
          }}
        />
        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={handleClearSearch} disabled={isSearching}>
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
      {searchError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {searchError}
        </Alert>
      )}

      {/* Результати пошуку */}
      {searchQuery && (
        <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
          {searchResults.length > 0 ? (
            <>
              <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2">
                  Знайдено клієнтів: {searchResults.length}
                </Typography>
              </Box>
              <List disablePadding>
                {searchResults.map((client, index) => (
                  <React.Fragment key={client.id}>
                    {index > 0 && <Divider />}
                    {renderClientItem(client)}
                  </React.Fragment>
                ))}
              </List>
            </>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Клієнтів не знайдено за запитом &quot;{searchQuery}&quot;
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Спробуйте змінити критерії пошуку або створіть нового клієнта
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Підказки */}
      {!searchQuery && (
        <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
          <Typography variant="body2" color="info.main">
            💡 Поради для пошуку:
          </Typography>
          <Typography variant="caption" component="div" sx={{ mt: 1 }}>
            • Введіть прізвище або частину прізвища
            <br />
            • Введіть номер телефону (можна частково)
            <br />
            • Введіть email адресу
            <br />• Введіть частину адреси
          </Typography>
        </Box>
      )}
    </Box>
  );
};
