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

import { useClientSearch } from '@/domains/wizard/stage1/client-search';

interface ClientSelectionPanelProps {
  onClientSelected?: (clientId: string) => void;
  onCreateNewClient?: () => void;
}

export const ClientSelectionPanel: FC<ClientSelectionPanelProps> = ({
  onClientSelected,
  onCreateNewClient,
}) => {
  const { ui, data, loading, actions } = useClientSearch();

  const handleSearch = () => {
    if (ui.searchTerm.trim().length >= 2 && ui.sessionId) {
      actions.searchClients({
        searchTerm: ui.searchTerm.trim(),
        sessionId: ui.sessionId,
      });
    }
  };

  const handleClientSelect = (clientId: string) => {
    if (clientId) {
      actions.selectClient(clientId);
      onClientSelected?.(clientId);
    }
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
            value={ui.searchTerm}
            onChange={(e) => actions.updateSearchTerm(e.target.value)}
            disabled={loading.isSearching || !ui.sessionId}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleSearch}
            disabled={ui.searchTerm.trim().length < 2 || loading.isSearching || !ui.sessionId}
            startIcon={loading.isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
          >
            {loading.isSearching ? 'Пошук...' : 'Знайти'}
          </Button>
        </Box>

        {/* Результати пошуку */}
        {data.searchResults && data.searchResults.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Знайдені клієнти ({data.searchResults.length})
            </Typography>
            <List>
              {data.searchResults.map((client, index) => (
                <ListItem key={client.id || `client-${index}`} disablePadding>
                  <ListItemButton
                    onClick={() => client.id && handleClientSelect(client.id)}
                    selected={ui.selectedClientId === client.id}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon fontSize="small" />
                          <Typography variant="body1">
                            {client.lastName} {client.firstName}
                          </Typography>
                          {ui.selectedClientId === client.id && (
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
          </Box>
        )}

        {/* Повідомлення про відсутність результатів */}
        {data.searchResults &&
          data.searchResults.length === 0 &&
          ui.searchTerm.trim().length >= 2 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              За запитом &ldquo;{ui.searchTerm}&rdquo; клієнтів не знайдено
            </Alert>
          )}

        {/* Обраний клієнт */}
        {data.selectedClient && (
          <Box sx={{ mb: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Обраний клієнт
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {data.selectedClient.lastName} {data.selectedClient.firstName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Телефон: {data.selectedClient.phone}
                </Typography>
                {data.selectedClient.email && (
                  <Typography variant="body2" color="textSecondary">
                    Email: {data.selectedClient.email}
                  </Typography>
                )}
                {data.selectedClient.address && (
                  <Typography variant="body2" color="textSecondary">
                    Адреса: {data.selectedClient.address}
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
      </CardContent>
    </Card>
  );
};
