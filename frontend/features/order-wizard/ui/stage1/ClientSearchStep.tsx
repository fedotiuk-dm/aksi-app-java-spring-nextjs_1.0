'use client';

import { FC, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

import { useClientSearch } from '@/domains/wizard/stage1';

const TEXT_STYLES = {
  fontSize: '0.875rem',
  color: 'text.secondary',
  lineHeight: 1.43,
} as const;

interface ClientSearchStepProps {
  onClientSelected?: () => void;
  onCreateNewClient?: () => void;
}

export const ClientSearchStep: FC<ClientSearchStepProps> = ({
  onClientSelected,
  onCreateNewClient,
}) => {
  const { ui, data, loading, actions, computed } = useClientSearch();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      actions.searchClients('GENERAL', searchTerm.trim());
    }
  };

  const handleSearchByPhone = () => {
    if (searchTerm.trim()) {
      actions.searchClients('PHONE', searchTerm.trim());
    }
  };

  const handleSelectClient = (clientId: string) => {
    actions.selectClient(clientId);
    onClientSelected?.();
  };

  const handleCreateNew = () => {
    actions.clearSearch();
    onCreateNewClient?.();
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    actions.setSearchTerm(value);
  };

  const isPhoneFormat = /^\+?[0-9\s\-\(\)]{10,}$/.test(searchTerm.trim());

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Заголовок */}
      <Typography variant="h5" component="h2" gutterBottom>
        Пошук клієнта
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Знайдіть існуючого клієнта або створіть нового
      </Typography>

      {/* Форма пошуку */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Поле пошуку */}
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                fullWidth
                label={
                  isPhoneFormat ? 'Номер телефону' : "Пошук за прізвищем, ім'ям, email, адресою"
                }
                placeholder={isPhoneFormat ? '+380xxxxxxxxx' : 'Введіть текст для пошуку...'}
                InputProps={{
                  startAdornment: isPhoneFormat ? (
                    <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                  ) : (
                    <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                  ),
                }}
              />

              {/* Індикатор типу пошуку */}
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={isPhoneFormat ? 'Пошук за телефоном' : 'Загальний пошук'}
                  size="small"
                  color={isPhoneFormat ? 'secondary' : 'primary'}
                  variant="outlined"
                />
                {loading.isTyping && (
                  <Chip label="Набираєте..." size="small" color="info" sx={{ ml: 1 }} />
                )}
              </Box>
            </Grid>

            {/* Кнопки дій */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'flex-start' }}>
                <Button
                  variant="contained"
                  onClick={isPhoneFormat ? handleSearchByPhone : handleSearch}
                  disabled={loading.isSearching || !searchTerm.trim()}
                  startIcon={loading.isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
                  fullWidth
                >
                  {loading.isSearching ? 'Шукаю...' : 'Знайти'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Результати пошуку */}
      {computed.hasSearchResults && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Знайдені клієнти ({data.searchResults.length})
            </Typography>

            <List>
              {data.searchResults.map((client, index) => (
                <div key={client.id || index}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => client.id && handleSelectClient(client.id)}
                      selected={ui.selectedClientId === client.id}
                      sx={{ borderRadius: 1 }}
                    >
                      <Box sx={{ width: '100%' }}>
                        {/* Primary content */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {client.firstName} {client.lastName}
                          </Typography>
                          {ui.selectedClientId === client.id && (
                            <Chip label="Вибрано" size="small" color="primary" />
                          )}
                        </Box>

                        {/* Secondary content */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {client.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PhoneIcon fontSize="small" color="action" />
                              <Box
                                component="span"
                                sx={{
                                  ...TEXT_STYLES,
                                }}
                              >
                                {client.phone}
                              </Box>
                            </Box>
                          )}
                          {client.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <EmailIcon fontSize="small" color="action" />
                              <Box
                                component="span"
                                sx={{
                                  ...TEXT_STYLES,
                                }}
                              >
                                {client.email}
                              </Box>
                            </Box>
                          )}
                          {client.address && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocationIcon fontSize="small" color="action" />
                              <Box
                                component="span"
                                sx={{
                                  ...TEXT_STYLES,
                                }}
                              >
                                {client.address}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                  {index < data.searchResults.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Відсутні результати */}
      {searchTerm && !loading.isSearching && !loading.isTyping && !computed.hasSearchResults && (
        <Alert severity="info" sx={{ mb: 3 }}>
          За запитом &ldquo;{searchTerm}&rdquo; клієнтів не знайдено. Створіть нового клієнта.
        </Alert>
      )}

      {/* Вибраний клієнт */}
      {computed.hasSelectedClient && data.selectedClient && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'success.50',
            border: '1px solid',
            borderColor: 'success.200',
          }}
        >
          <Typography variant="h6" color="success.main" gutterBottom>
            ✅ Клієнт обраний
          </Typography>
          <Typography variant="body1">
            {data.selectedClient.firstName} {data.selectedClient.lastName}
          </Typography>
          {data.selectedClient.phone && (
            <Typography variant="body2" color="text.secondary">
              Телефон: {data.selectedClient.phone}
            </Typography>
          )}
        </Paper>
      )}

      {/* Дії */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          onClick={handleCreateNew}
          size="large"
        >
          Створити нового клієнта
        </Button>

        {computed.hasSelectedClient && (
          <Button
            variant="contained"
            onClick={() => actions.completeSearch()}
            disabled={loading.isCompleting}
            size="large"
          >
            {loading.isCompleting ? 'Завершення...' : 'Підтвердити вибір'}
          </Button>
        )}
      </Box>
    </Box>
  );
};
