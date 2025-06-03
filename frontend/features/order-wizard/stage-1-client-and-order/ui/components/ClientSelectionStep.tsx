/**
 * @fileoverview Підетап 1.1: Вибір або створення клієнта
 */

'use client';

import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Card,
  CardContent,
  Divider,
  Paper,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';

import { searchClientsWithPagination } from '@/shared/api/generated/client';

import type {
  ClientResponse,
  ClientResponseCommunicationChannelsItem,
  ClientResponseSource,
} from '@/shared/api/generated/order-wizard';

// Імпорт API для пошуку клієнтів

interface ClientSelectionStepProps {
  onClientSelected: (clientData: ClientResponse) => void;
  isLoading: boolean;
  sessionData?: any;
}

/**
 * 🎯 Підетап 1.1: Вибір або створення клієнта
 *
 * Включає:
 * - Форма пошуку існуючого клієнта
 * - Форма нового клієнта
 */
export function ClientSelectionStep({
  onClientSelected,
  isLoading,
  sessionData,
}: ClientSelectionStepProps) {
  const [mode, setMode] = useState<'search' | 'create'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ClientResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    communicationChannels: [] as ClientResponseCommunicationChannelsItem[],
    source: '' as ClientResponseSource | '',
    sourceDetails: '',
  });

  // Debounce для пошуку (500ms затримка)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Автоматичний пошук при зміні debounced запиту
  useEffect(() => {
    if (debouncedSearchQuery.trim().length >= 2) {
      performSearch(debouncedSearchQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  const performSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    try {
      console.log('🔍 Виконую пошук для:', query);

      // Реальний пошук через Client API
      const results = await searchClientsWithPagination({ query: query });

      // Результат - ClientPageResponse з властивістю content
      if (results && Array.isArray(results.content)) {
        setSearchResults(results.content);
      } else {
        setSearchResults([]);
      }

      console.log('✅ Результати пошуку:', results);
    } catch (error) {
      console.error('❌ Помилка пошуку:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleCreateClient = () => {
    // Валідація
    if (!newClient.firstName || !newClient.lastName || !newClient.phone) {
      alert("Заповніть обов'язкові поля: Ім'я, Прізвище, Телефон");
      return;
    }

    const clientData: ClientResponse = {
      firstName: newClient.firstName,
      lastName: newClient.lastName,
      phone: newClient.phone,
      email: newClient.email || undefined,
      address: newClient.address || undefined,
      communicationChannels: newClient.communicationChannels,
      source: newClient.source === '' ? undefined : (newClient.source as ClientResponseSource),
      sourceDetails: newClient.source === 'OTHER' ? newClient.sourceDetails : undefined,
    };

    onClientSelected(clientData);
  };

  const handleSelectExistingClient = (client: ClientResponse) => {
    onClientSelected(client);
  };

  const handleCommunicationChannelChange = (
    channel: ClientResponseCommunicationChannelsItem,
    checked: boolean
  ) => {
    if (checked) {
      setNewClient((prev) => ({
        ...prev,
        communicationChannels: [...prev.communicationChannels, channel],
      }));
    } else {
      setNewClient((prev) => ({
        ...prev,
        communicationChannels: prev.communicationChannels.filter((c) => c !== channel),
      }));
    }
  };

  return (
    <Box>
      {/* Заголовок підетапу */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          1.1. Вибір або створення клієнта
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Знайдіть існуючого клієнта або створіть нового
        </Typography>
      </Box>

      {/* Перемикач режиму */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={mode}
          onChange={(_, newValue) => setMode(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<SearchIcon />} label="Пошук існуючого" value="search" iconPosition="start" />
          <Tab
            icon={<PersonAddIcon />}
            label="Створити нового"
            value="create"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Пошук існуючого клієнта */}
      {mode === 'search' && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Пошук клієнта"
            placeholder="Прізвище, телефон, email або адреса"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{ mb: 2 }}
          />

          {/* Індикатор автопошуку */}
          {debouncedSearchQuery && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Автопошук: &quot;{debouncedSearchQuery}&quot;
            </Alert>
          )}

          {/* Результати пошуку */}
          <Paper elevation={1} sx={{ p: 2, minHeight: 120 }}>
            {isSearching && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Пошук клієнтів...
                </Typography>
              </Box>
            )}

            {!isSearching && searchQuery.length < 2 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 4 }}
              >
                Введіть мінімум 2 символи для пошуку клієнтів
              </Typography>
            )}

            {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 4 }}
              >
                Клієнтів не знайдено. Спробуйте інший запит або створіть нового клієнта.
              </Typography>
            )}

            {!isSearching && searchResults.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Знайдено клієнтів: {searchResults.length}
                </Typography>
                <List dense>
                  {searchResults.map((client) => (
                    <ListItem key={client.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleSelectExistingClient(client)}
                        sx={{ borderRadius: 1 }}
                      >
                        <ListItemText
                          primary={`${client.firstName} ${client.lastName}`}
                          secondary={
                            <Box component="span">
                              <Typography variant="body2" component="span">
                                <PhoneIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                {client.phone}
                              </Typography>
                              {client.email && (
                                <Typography variant="body2" component="span" sx={{ ml: 2 }}>
                                  <EmailIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                  {client.email}
                                </Typography>
                              )}
                              {client.address && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  component="span"
                                  sx={{ display: 'block', mt: 0.5 }}
                                >
                                  {client.address}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Button size="small" variant="outlined">
                          Вибрати
                        </Button>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Box>
      )}

      {/* Створення нового клієнта */}
      {mode === 'create' && (
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={3}>
            {/* Основні дані */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                label="Ім'я"
                value={newClient.firstName}
                onChange={(e) => setNewClient((prev) => ({ ...prev, firstName: e.target.value }))}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                label="Прізвище"
                value={newClient.lastName}
                onChange={(e) => setNewClient((prev) => ({ ...prev, lastName: e.target.value }))}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                label="Телефон"
                type="tel"
                value={newClient.phone}
                onChange={(e) => setNewClient((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient((prev) => ({ ...prev, email: e.target.value }))}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Адреса"
                value={newClient.address}
                onChange={(e) => setNewClient((prev) => ({ ...prev, address: e.target.value }))}
              />
            </Grid>

            {/* Способи зв'язку */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" gutterBottom>
                Способи зв&apos;язку
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newClient.communicationChannels.includes('PHONE')}
                      onChange={(e) => handleCommunicationChannelChange('PHONE', e.target.checked)}
                    />
                  }
                  label="Номер телефону"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newClient.communicationChannels.includes('SMS')}
                      onChange={(e) => handleCommunicationChannelChange('SMS', e.target.checked)}
                    />
                  }
                  label="SMS"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newClient.communicationChannels.includes('VIBER')}
                      onChange={(e) => handleCommunicationChannelChange('VIBER', e.target.checked)}
                    />
                  }
                  label="Viber"
                />
              </FormGroup>
            </Grid>

            {/* Джерело інформації */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Джерело інформації про хімчистку</InputLabel>
                <Select
                  value={newClient.source}
                  label="Джерело інформації про хімчистку"
                  onChange={(e) => setNewClient((prev) => ({ ...prev, source: e.target.value }))}
                >
                  <MenuItem value="">
                    <em>Оберіть джерело</em>
                  </MenuItem>
                  <MenuItem value="INSTAGRAM">Інстаграм</MenuItem>
                  <MenuItem value="GOOGLE">Google</MenuItem>
                  <MenuItem value="RECOMMENDATION">Рекомендації</MenuItem>
                  <MenuItem value="OTHER">Інше</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {newClient.source === 'OTHER' && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Вкажіть джерело"
                  placeholder="Опишіть джерело інформації"
                  value={newClient.sourceDetails}
                  onChange={(e) =>
                    setNewClient((prev) => ({ ...prev, sourceDetails: e.target.value }))
                  }
                />
              </Grid>
            )}
          </Grid>

          {/* Кнопка створення */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleCreateClient}
              disabled={isLoading}
              startIcon={<PersonAddIcon />}
            >
              {isLoading ? 'Створення...' : 'Створити клієнта'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
