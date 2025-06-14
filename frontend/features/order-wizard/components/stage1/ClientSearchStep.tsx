'use client';

import React, { useState } from 'react';
import { Box, List, ListItemButton, ListItemText, Button, Alert, Typography } from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';

// Готові UI компоненти
import { SearchInput, ClientInfoCard, StepContainer, ActionButton } from '@/shared/ui';

// Прямі Orval хуки
import {
  useStage1SearchClients,
  useStage1SelectClient,
  type ClientResponse,
} from '@/shared/api/generated/stage1';

// Стор
import { useStage1WizardStore } from '../../stores/stage1-wizard.store';

// Debounce хук
import { useDebounce } from '@/shared/lib/hooks/useDebounce';

interface ClientSearchStepProps {
  sessionId: string;
  onNext: () => void;
}

/**
 * Крок пошуку клієнта
 * Використовує готові UI компоненти + прямі Orval хуки
 */
export const ClientSearchStep = ({ sessionId, onNext }: ClientSearchStepProps) => {
  // ========== СТОР ==========
  const { searchTerm, setSearchTerm, selectedClientId, setSelectedClientId, setShowClientForm } =
    useStage1WizardStore();

  // ========== ЛОКАЛЬНИЙ СТАН ==========
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(null);

  // ========== DEBOUNCE ==========
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // ========== ORVAL ХУКИ ==========
  const searchMutation = useStage1SearchClients({
    mutation: {
      onSuccess: (data) => {
        console.log('✅ Пошук завершено:', data);
      },
      onError: (error) => {
        console.error('❌ Помилка пошуку:', error);
      },
    },
  });

  const selectMutation = useStage1SelectClient({
    mutation: {
      onSuccess: () => {
        console.log('✅ Клієнт успішно обрано');
        onNext();
      },
      onError: (error) => {
        console.error('❌ Помилка вибору клієнта:', error);
      },
    },
  });

  // ========== SEARCH LOGIC ==========
  // Автоматичний пошук при зміні debounced терміну
  React.useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      console.log('🔍 Виконання пошуку для:', debouncedSearchTerm);
      searchMutation.mutate({
        sessionId,
        data: { generalSearchTerm: debouncedSearchTerm },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, sessionId]);

  // ========== EVENT HANDLERS ==========
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setSelectedClient(null);
    setSelectedClientId(null);
  };

  const handleClientSelect = (client: ClientResponse) => {
    setSelectedClient(client);
    setSelectedClientId(client.id || '');
  };

  const handleConfirmSelection = async () => {
    if (!selectedClientId) return;

    try {
      await selectMutation.mutateAsync({
        sessionId,
        params: { clientId: selectedClientId },
      });
    } catch (error) {
      console.error('❌ Помилка підтвердження вибору:', error);
    }
  };

  const handleCreateNewClient = () => {
    setShowClientForm(true);
  };

  // ========== COMPUTED VALUES ==========
  const searchResults = searchMutation.data?.clients || [];
  const hasResults = searchResults.length > 0;
  const isSearching = searchMutation.isPending;
  const canConfirm = selectedClientId && !selectMutation.isPending;

  return (
    <StepContainer title="Пошук клієнта" subtitle="Знайдіть існуючого клієнта або створіть нового">
      {/* Поле пошуку */}
      <Box sx={{ mb: 3 }}>
        <SearchInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Введіть ім'я, прізвище, телефон або email..."
          label="Пошук клієнта"
          loading={isSearching}
          autoFocus
        />
      </Box>

      {/* Результати пошуку */}
      {debouncedSearchTerm.length >= 2 && (
        <Box sx={{ mb: 3 }}>
          {isSearching && (
            <Typography variant="body2" color="text.secondary">
              Пошук клієнтів...
            </Typography>
          )}

          {!isSearching && !hasResults && (
            <Alert severity="info">
              Клієнтів не знайдено. Спробуйте змінити критерії пошуку або створіть нового клієнта.
            </Alert>
          )}

          {!isSearching && hasResults && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Знайдено клієнтів: {searchResults.length}
              </Typography>

              <List>
                {searchResults.map((client) => (
                  <ListItemButton
                    key={client.id}
                    selected={selectedClientId === client.id}
                    onClick={() => handleClientSelect(client)}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      '&.Mui-selected': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50',
                      },
                    }}
                  >
                    <ListItemText
                      primary={client.fullName}
                      secondary={
                        <Box component="span">
                          <Box component="span" sx={{ display: 'block' }}>
                            📞 {client.phone}
                          </Box>
                          {client.email && (
                            <Box component="span" sx={{ display: 'block' }}>
                              📧 {client.email}
                            </Box>
                          )}
                          {client.address && (
                            <Box component="span" sx={{ display: 'block' }}>
                              📍 {client.address}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </>
          )}
        </Box>
      )}

      {/* Інформація про обраного клієнта */}
      {selectedClient && (
        <Box sx={{ mb: 3 }}>
          <ClientInfoCard
            name={selectedClient.fullName || ''}
            phone={selectedClient.phone || ''}
            address={selectedClient.address}
            title="Обраний клієнт"
          />
        </Box>
      )}

      {/* Кнопки дій */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
        <Button variant="outlined" startIcon={<PersonAddIcon />} onClick={handleCreateNewClient}>
          Створити нового клієнта
        </Button>

        <ActionButton
          variant="contained"
          onClick={handleConfirmSelection}
          disabled={!canConfirm}
          loading={selectMutation.isPending}
          loadingText="Обробка..."
        >
          Продовжити з цим клієнтом
        </ActionButton>
      </Box>

      {/* Помилки */}
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
    </StepContainer>
  );
};
