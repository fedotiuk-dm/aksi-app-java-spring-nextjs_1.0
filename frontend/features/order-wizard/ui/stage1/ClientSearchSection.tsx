'use client';

import {
  Search as SearchIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
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
  Grid,
  Divider,
} from '@mui/material';
import { FC, useState } from 'react';
import type { ClientResponse } from '@/shared/api/generated/stage1';

import { useMain } from '@/domains/wizard/main';
import { useClientSearch } from '@/domains/wizard/stage1';

interface ClientSearchSectionProps {
  onClientSelected?: (clientId: string) => void;
  onCreateNewClient?: () => void;
}

export const ClientSearchSection: FC<ClientSearchSectionProps> = ({
  onClientSelected,
  onCreateNewClient,
}) => {
  const clientSearch = useClientSearch();
  const orderWizard = useMain();
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const handleSearch = () => {
    if (localSearchTerm.trim().length >= 2) {
      clientSearch.actions.searchClients(localSearchTerm.trim());
    }
  };

  const handleClientSelect = (clientId: string) => {
    if (clientId) {
      clientSearch.actions.selectClient(clientId);
      onClientSelected?.(clientId);
    }
  };

  const hasSession = !!clientSearch.computed.searchState;
  // Результати пошуку приходять через мутації, а не через searchState
  const searchResults: ClientResponse[] = [];
  const selectedClient = clientSearch.data.selectedClient;

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

        {/* Стан сесії */}
        {!hasSession && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Для пошуку клієнтів потрібно спочатку запустити Order Wizard
            </Typography>
            <Button
              variant="contained"
              onClick={orderWizard.actions.startWizard}
              disabled={orderWizard.loading.isStarting}
              sx={{ mt: 1 }}
            >
              {orderWizard.loading.isStarting ? 'Запуск...' : 'Запустити Order Wizard'}
            </Button>
          </Alert>
        )}

        {/* Форма пошуку */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                fullWidth
                label="Пошук клієнта"
                placeholder="Введіть прізвище, ім'я, телефон або email"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                disabled={clientSearch.loading.isSearching || !hasSession}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                helperText="Введіть мінімум 2 символи для пошуку"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={
                  localSearchTerm.trim().length < 2 ||
                  clientSearch.loading.isSearching ||
                  !hasSession
                }
                startIcon={
                  clientSearch.loading.isSearching ? <CircularProgress size={20} /> : <SearchIcon />
                }
              >
                {clientSearch.loading.isSearching ? 'Пошук...' : 'Знайти'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Результати пошуку */}
        {searchResults.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Знайдені клієнти ({searchResults.length})
            </Typography>
            <List>
              {searchResults.map((client: ClientResponse, index: number) => (
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
                        <Box component="div" sx={{ mt: 1 }}>
                          {client.phone && (
                            <Box
                              component="span"
                              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
                            >
                              <PhoneIcon fontSize="small" />
                              <Typography variant="body2" component="span">
                                {client.phone}
                              </Typography>
                            </Box>
                          )}
                          {client.email && (
                            <Box
                              component="span"
                              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
                            >
                              <EmailIcon fontSize="small" />
                              <Typography variant="body2" component="span">
                                {client.email}
                              </Typography>
                            </Box>
                          )}
                          {client.address && (
                            <Box
                              component="span"
                              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                              <LocationIcon fontSize="small" />
                              <Typography variant="body2" component="span">
                                {client.address}
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
        {searchResults.length === 0 &&
          localSearchTerm.trim().length >= 2 &&
          !clientSearch.loading.isSearching && (
            <Alert severity="info" sx={{ mb: 2 }}>
              За запитом &quot;{localSearchTerm}&quot; клієнтів не знайдено
            </Alert>
          )}

        {/* Обраний клієнт */}
        {selectedClient && (
          <Box sx={{ mb: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Обраний клієнт
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedClient.lastName} {selectedClient.firstName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Телефон: {selectedClient.phone}
                </Typography>
                {selectedClient.email && (
                  <Typography variant="body2" color="textSecondary">
                    Email: {selectedClient.email}
                  </Typography>
                )}
                {selectedClient.address && (
                  <Typography variant="body2" color="textSecondary">
                    Адреса: {selectedClient.address}
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
          startIcon={<PersonIcon />}
          disabled={!hasSession}
        >
          Створити нового клієнта
        </Button>

        {/* Debug інформація */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" component="div">
              Debug: Session: {hasSession ? 'active' : 'inactive'}, Search: &quot;{localSearchTerm}
              &quot;, Results: {searchResults.length}, Selected: {selectedClient?.id || 'none'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
