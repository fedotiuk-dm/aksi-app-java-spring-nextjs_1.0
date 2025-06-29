'use client';

import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { PersonAdd, Search } from '@mui/icons-material';
import { useDebounce } from '@/shared/lib/hooks';
import { useOrderOnepageStore } from '../store/order-onepage.store';
import {
  useStage1SearchClients,
  useStage1SelectClient,
  type ClientSearchCriteriaDTO,
  type ClientResponse,
} from '@/shared/api/generated/stage1';
import { useOrderWizardStart } from '@/shared/api/generated/main';

export const ClientSearchForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const { sessionId, setSessionId, setSelectedClientId, setShowClientForm, setStage1Ready } =
    useOrderOnepageStore();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Ініціалізація сесії
  const startWizard = useOrderWizardStart();

  // Пошук клієнтів
  const searchClients = useStage1SearchClients();

  // Вибір клієнта
  const selectClient = useStage1SelectClient();

  // Ініціалізація сесії при завантаженні
  useEffect(() => {
    if (!sessionId) {
      startWizard.mutate(undefined, {
        onSuccess: (response) => {
          if (response.sessionId) {
            console.log('🚀 Сесія створена:', response.sessionId);
            setSessionId(response.sessionId);
            setStage1Ready(true); // Stage1 готовий після успішного старту
            console.log('✅ Stage1Ready встановлено в true');
          }
        },
        onError: (error) => {
          console.error('Помилка ініціалізації сесії:', error);
          setSearchError('Не вдалося ініціалізувати сесію');
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Пошук при зміні терміну
  useEffect(() => {
    if (debouncedSearchTerm && sessionId && debouncedSearchTerm.length >= 2) {
      setSearchError(null);

      // Створюємо критерії пошуку відповідно до ClientSearchCriteriaDTO
      const searchCriteria: ClientSearchCriteriaDTO = {
        generalSearchTerm: debouncedSearchTerm,
        page: 0,
        size: 10,
      };

      searchClients.mutate(
        {
          sessionId,
          data: searchCriteria,
        },
        {
          onError: (error) => {
            console.error('Помилка пошуку клієнтів:', error);
            setSearchError('Помилка при пошуку клієнтів');
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, sessionId]);

  const handleSelectClient = async (client: ClientResponse) => {
    if (!sessionId || !client.id) return;

    try {
      setSearchError(null);

      await selectClient.mutateAsync({
        sessionId,
        params: { clientId: client.id },
      });

      setSelectedClientId(client.id);
    } catch (error: any) {
      console.error('Помилка вибору клієнта:', error);
      setSearchError(
        error?.response?.data?.message || error?.message || 'Помилка при виборі клієнта'
      );
    }
  };

  const handleShowCreateForm = () => {
    setShowClientForm(true);
  };

  const clients = searchClients.data?.clients || [];
  const isSearching = searchClients.isPending;
  const hasSearched = debouncedSearchTerm.length >= 2;

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Пошук клієнта
      </Typography>

      <TextField
        fullWidth
        placeholder="Введіть прізвище, телефон або email (мінімум 2 символи)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          endAdornment: isSearching && <CircularProgress size={20} />,
        }}
        sx={{ mb: 2 }}
        disabled={!sessionId}
      />

      {/* Результати пошуку */}
      {hasSearched && (
        <Box>
          {clients.length > 0 ? (
            <List dense>
              {clients.map((client) => (
                <ListItem key={client.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleSelectClient(client)}
                    sx={{ borderRadius: 1 }}
                  >
                    <ListItemText
                      primary={`${client.lastName || ''} ${client.firstName || ''}`.trim()}
                      secondary={
                        <Box component="span" sx={{ display: 'block' }}>
                          {client.phone}
                          {client.email && <Box component="span"> • {client.email}</Box>}
                          {client.address && (
                            <Box
                              component="span"
                              sx={{ fontSize: '0.875em', color: 'text.secondary' }}
                            >
                              {client.address}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            !isSearching && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Клієнтів не знайдено за запитом &quot;{debouncedSearchTerm}&quot;
              </Alert>
            )
          )}
        </Box>
      )}

      {/* Підказка для пошуку */}
      {searchTerm.length > 0 && searchTerm.length < 2 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Введіть мінімум 2 символи для пошуку
        </Alert>
      )}

      {/* Кнопка створення нового клієнта */}
      <Button
        fullWidth
        variant="outlined"
        startIcon={<PersonAdd />}
        onClick={handleShowCreateForm}
        sx={{ mt: 2 }}
        disabled={!sessionId}
      >
        Створити нового клієнта
      </Button>

      {/* Помилки */}
      {searchError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {searchError}
        </Alert>
      )}
    </Box>
  );
};
