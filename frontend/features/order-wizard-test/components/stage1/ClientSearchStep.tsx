'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import { Search as SearchIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';

// Готові Orval хуки та типи
import {
  useStage1SearchClients,
  useStage1SelectClient,
  useStage1GetClientSearchState,
  useStage1InitializeClientSearch,
  type ClientSearchCriteriaDTO,
  type ClientSearchResultDTO,
  type ClientResponse,
} from '@/shared/api/generated/stage1';

// Спеціалізований debounce хук для пошуку
import { useDebounceSearch } from '@/shared/lib/hooks/useDebounce';

// Інші компоненти Stage1
import { ClientFormStep } from './ClientFormStep';
import { BasicOrderInfoStep } from './BasicOrderInfoStep';

interface ClientSearchStepProps {
  sessionId: string;
  onNext: () => void;
}

/**
 * Об'єднаний крок: Пошук клієнта + Базова інформація замовлення
 * Все на одному екрані без зайвих переходів
 */
export const ClientSearchStep = ({ sessionId, onNext }: ClientSearchStepProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ClientSearchResultDTO | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showBasicOrderInfo, setShowBasicOrderInfo] = useState(false);

  // Готові Orval хуки
  const searchMutation = useStage1SearchClients();
  const selectMutation = useStage1SelectClient();
  const initializeMutation = useStage1InitializeClientSearch();
  const searchState = useStage1GetClientSearchState(sessionId, {
    query: { enabled: !!sessionId },
  });

  // Ініціалізація пошуку при завантаженні (тільки один раз)
  useEffect(() => {
    if (sessionId && !initializeMutation.isSuccess && !initializeMutation.isPending) {
      initializeMutation.mutate();
    }
  }, [sessionId, initializeMutation]);

  // Функція пошуку для debounce хука
  const performSearch = async (term: string) => {
    if (!sessionId) return;

    try {
      const searchCriteria: ClientSearchCriteriaDTO = {
        generalSearchTerm: term,
        page: 0,
        size: 10,
      };

      const result = await searchMutation.mutateAsync({
        sessionId,
        data: searchCriteria,
      });

      setSearchResults(result);
    } catch (error) {
      console.error('Помилка пошуку клієнтів:', error);
      setSearchResults(null);
    }
  };

  // Debounce пошук з спеціалізованим хуком
  const debounce = useDebounceSearch(searchTerm, performSearch, 500, 2);

  // Ручний пошук (кнопка або Enter)
  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term || term.length < 2) return;

    try {
      const searchCriteria: ClientSearchCriteriaDTO = {
        generalSearchTerm: term,
        page: 0,
        size: 10,
      };

      const result = await searchMutation.mutateAsync({
        sessionId,
        data: searchCriteria,
      });

      setSearchResults(result);
    } catch (error) {
      console.error('Помилка пошуку клієнтів:', error);
      setSearchResults(null);
    }
  };

  // Вибір клієнта
  const handleSelectClient = async (clientId: string) => {
    try {
      await selectMutation.mutateAsync({
        sessionId,
        params: { clientId },
      });
      setSelectedClientId(clientId);
      setShowBasicOrderInfo(true); // Показуємо секцію базової інформації
    } catch (error) {
      console.error('Помилка вибору клієнта:', error);
    }
  };

  // Створення нового клієнта (показуємо форму)
  const handleCreateNewClient = () => {
    setShowClientForm(true);
  };

  // Після створення нового клієнта
  const handleClientCreated = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowClientForm(false);
    setShowBasicOrderInfo(true);
  };

  // Завершення всього процесу
  const handleCompleteStage1 = () => {
    onNext(); // Переходимо до Stage2
  };

  const isSearching = searchMutation.isPending || debounce.isSearching;
  const isSelecting = selectMutation.isPending;
  const canSearch = searchTerm.trim().length >= 2;
  const isTyping = searchTerm !== debounce.debouncedSearchTerm && searchTerm.length >= 2;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Створення замовлення - Stage 1
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Клієнт та базова інформація замовлення
      </Typography>

      {/* Секція 1: Пошук клієнта */}
      {!selectedClientId && !showClientForm && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Пошук існуючого клієнта
          </Typography>

          {/* Форма пошуку */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Пошук клієнта"
              placeholder="Введіть прізвище, ім'я, телефон або email (мін. 2 символи)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && canSearch && handleSearch()}
              InputProps={{
                endAdornment:
                  isSearching || isTyping ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SearchIcon color="action" />
                  ),
              }}
              helperText={
                searchTerm.length > 0 && searchTerm.length < 2
                  ? 'Введіть мінімум 2 символи для пошуку'
                  : isTyping
                    ? 'Пошук...'
                    : ''
              }
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={!canSearch || isSearching}
                startIcon={isSearching ? <CircularProgress size={16} /> : <SearchIcon />}
              >
                {isSearching ? 'Пошук...' : 'Знайти клієнта'}
              </Button>

              <Button
                variant="outlined"
                onClick={handleCreateNewClient}
                startIcon={<PersonAddIcon />}
              >
                Створити нового клієнта
              </Button>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Результати пошуку */}
          {searchResults && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Результати пошуку
              </Typography>

              {searchResults.clients && searchResults.clients.length > 0 ? (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Знайдено {searchResults.totalElements} клієнтів за запитом &quot;
                    {debounce.debouncedSearchTerm}&quot;
                    {searchResults.searchTimeMs && ` (${searchResults.searchTimeMs}мс)`}
                  </Typography>

                  <List>
                    {searchResults.clients.map((client: ClientResponse) => (
                      <ListItemButton
                        key={client.id}
                        onClick={() => client.id && handleSelectClient(client.id)}
                        disabled={isSelecting || !client.id}
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <ListItemText
                          primary={`${client.firstName || ''} ${client.lastName || ''}`.trim()}
                          secondary={
                            <Box component="span">
                              {client.phone && <div>Телефон: {client.phone}</div>}
                              {client.email && <div>Email: {client.email}</div>}
                              {client.address && <div>Адреса: {client.address}</div>}
                              {client.orderCount !== undefined && (
                                <div>Замовлень: {client.orderCount}</div>
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                    ))}
                  </List>

                  {/* Пагінація */}
                  {searchResults.totalPages && searchResults.totalPages > 1 && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Сторінка {(searchResults.pageNumber || 0) + 1} з {searchResults.totalPages}
                      </Typography>
                      {/* TODO: Додати кнопки пагінації */}
                    </Box>
                  )}
                </>
              ) : (
                <Alert severity="info">
                  Клієнтів не знайдено за запитом &quot;{debounce.debouncedSearchTerm}&quot;.
                  Спробуйте інший пошуковий запит або створіть нового клієнта.
                </Alert>
              )}
            </Box>
          )}

          {/* Стан ініціалізації */}
          {initializeMutation.isPending && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
              <CircularProgress size={20} />
              <Typography>Ініціалізація пошуку...</Typography>
            </Box>
          )}

          {/* Стан пошуку */}
          {searchState.isLoading && !initializeMutation.isPending && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
              <CircularProgress size={20} />
              <Typography>Завантаження стану пошуку...</Typography>
            </Box>
          )}

          {/* Помилки */}
          {initializeMutation.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Помилка ініціалізації: {initializeMutation.error.message}
            </Alert>
          )}

          {searchState.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Помилка завантаження стану: {searchState.error.message}
            </Alert>
          )}

          {searchMutation.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Помилка пошуку: {searchMutation.error.message}
            </Alert>
          )}

          {selectMutation.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Помилка вибору клієнта: {selectMutation.error.message}
            </Alert>
          )}

          {/* Підказка */}
          {!searchResults && !isSearching && !initializeMutation.isPending && !isTyping && (
            <Alert severity="info">
              Введіть дані для пошуку існуючого клієнта (мінімум 2 символи) або створіть нового
              клієнта
            </Alert>
          )}
        </Box>
      )}

      {/* Секція 2: Форма створення нового клієнта */}
      {showClientForm && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Створення нового клієнта
          </Typography>
          <ClientFormStep
            sessionId={sessionId}
            onNext={() => handleClientCreated('new-client-id')} // TODO: отримати реальний ID
            onBack={() => setShowClientForm(false)}
          />
        </Box>
      )}

      {/* Секція 3: Базова інформація замовлення */}
      {showBasicOrderInfo && selectedClientId && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Базова інформація замовлення
          </Typography>
          <BasicOrderInfoStep
            sessionId={sessionId}
            onComplete={handleCompleteStage1}
            onBack={() => {
              setSelectedClientId(null);
              setShowBasicOrderInfo(false);
            }}
          />
        </Box>
      )}
    </Box>
  );
};
