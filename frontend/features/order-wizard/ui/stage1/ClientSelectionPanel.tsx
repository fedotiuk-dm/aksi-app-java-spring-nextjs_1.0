'use client';

import {
  Search as SearchIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { FC } from 'react';

import { useClientSearch } from '@/domains/wizard/stage1';

interface ClientSelectionPanelProps {
  onClientSelected?: (clientId: string) => void;
  onCreateNewClient?: () => void;
}

export const ClientSelectionPanel: FC<ClientSelectionPanelProps> = ({
  onClientSelected,
  onCreateNewClient,
}) => {
  const clientSearch = useClientSearch();

  const handleSearch = () => {
    if (clientSearch.computed.isSearchTermValid) {
      clientSearch.actions.searchClients(clientSearch.ui.searchTerm);
    }
  };

  const handleClientSelect = (clientId: string) => {
    if (clientId) {
      clientSearch.actions.selectClient(clientId);
      onClientSelected?.(clientId);
    }
  };

  // Отримуємо результати пошуку з мутацій
  const searchResults = clientSearch.data.searchResults || [];

  // Функція для отримання helper text
  const getHelperText = () => {
    if (clientSearch.loading.isTyping && clientSearch.computed.isSearchTermValid) {
      return 'Автоматичний пошук через секунду...';
    }
    if (clientSearch.loading.isSearching) {
      return 'Пошук...';
    }
    if (clientSearch.computed.hasSearchResults) {
      return `Знайдено ${clientSearch.data.searchResults.length} результатів`;
    }
    if (
      clientSearch.ui.searchTerm &&
      clientSearch.computed.isSearchTermValid &&
      !clientSearch.computed.hasSearchResults
    ) {
      return 'Нічого не знайдено';
    }
    if (clientSearch.ui.searchTerm && !clientSearch.computed.isSearchTermValid) {
      return 'Введіть мінімум 2 символи для пошуку';
    }
    return '';
  };

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <SearchIcon />
          Пошук існуючого клієнта
        </Typography>

        {/* Форма пошуку */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Пошук клієнта"
            placeholder="Введіть прізвище, ім'я, телефон або email"
            value={clientSearch.ui.searchTerm}
            onChange={(e) => {
              clientSearch.actions.setSearchTerm(e.target.value);
            }}
            disabled={clientSearch.loading.isSearching}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            sx={{ mb: 2 }}
            helperText={getHelperText()}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleSearch}
            disabled={!clientSearch.computed.canSearch || clientSearch.loading.isSearching}
            startIcon={
              clientSearch.loading.isSearching ? <CircularProgress size={20} /> : <SearchIcon />
            }
          >
            {clientSearch.loading.isSearching ? 'Пошук...' : 'Знайти'}
          </Button>
        </Box>

        {/* Результати пошуку */}
        {searchResults.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Знайдені клієнти ({searchResults.length}
              {clientSearch.computed.totalElements > searchResults.length &&
                ` з ${clientSearch.computed.totalElements}`}
              )
            </Typography>
            <List>
              {searchResults.map((client, index) => (
                <ListItem key={client.id || `client-${index}`} disablePadding>
                  <ListItemButton
                    onClick={() => client.id && handleClientSelect(client.id)}
                    selected={clientSearch.ui.selectedClientId === client.id}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon fontSize="small" />
                          <Typography variant="body1">
                            {client.lastName} {client.firstName}
                          </Typography>
                          {clientSearch.ui.selectedClientId === client.id && (
                            <Chip label="Обрано" color="primary" size="small" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box component="span">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon fontSize="small" />
                            <Typography component="span" variant="body2">
                              {client.phone}
                            </Typography>
                          </Box>
                          {client.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <EmailIcon fontSize="small" />
                              <Typography component="span" variant="body2">
                                {client.email}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {/* Пагінація */}
            {clientSearch.computed.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Сторінка {clientSearch.computed.currentPage + 1} з{' '}
                  {clientSearch.computed.totalPages}
                  {clientSearch.computed.hasPrevious || clientSearch.computed.hasNext
                    ? ' (пагінація буде додана пізніше)'
                    : ''}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Повідомлення про відсутність результатів */}
        {searchResults.length === 0 &&
          clientSearch.computed.hasSearchTerm &&
          !clientSearch.loading.isSearching && (
            <Alert severity="info" sx={{ mb: 2 }}>
              За запитом &ldquo;{clientSearch.ui.searchTerm}&rdquo; клієнтів не знайдено
            </Alert>
          )}

        {/* Обраний клієнт */}
        {clientSearch.data.selectedClient && (
          <Box sx={{ mb: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Обраний клієнт
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {clientSearch.data.selectedClient.lastName}{' '}
                  {clientSearch.data.selectedClient.firstName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Телефон: {clientSearch.data.selectedClient.phone}
                </Typography>
                {clientSearch.data.selectedClient.email && (
                  <Typography variant="body2" color="textSecondary">
                    Email: {clientSearch.data.selectedClient.email}
                  </Typography>
                )}
                {clientSearch.data.selectedClient.address && (
                  <Typography variant="body2" color="textSecondary">
                    Адреса: {clientSearch.data.selectedClient.address}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Кнопка створення нового клієнта */}
        <Divider sx={{ mb: 2 }} />
        <Button
          variant="outlined"
          fullWidth
          onClick={onCreateNewClient}
          startIcon={<PersonAddIcon />}
        >
          Створити нового клієнта
        </Button>

        {/* Debug інформація (тільки в розробці) */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" display="block">
              Debug: Search Term: &ldquo;{clientSearch.ui.searchTerm}&rdquo; | Debounced: &ldquo;
              {clientSearch.ui.debouncedSearchTerm}&rdquo; | Results: {searchResults.length} |
              Selected: {clientSearch.ui.selectedClientId || 'none'}
            </Typography>
            <Typography variant="caption" display="block">
              Is Typing: {clientSearch.loading.isTyping ? 'Yes' : 'No'} | Is Searching:{' '}
              {clientSearch.loading.isSearching ? 'Yes' : 'No'} | Will Auto Search:{' '}
              {clientSearch.computed.willAutoSearch ? 'Yes' : 'No'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
