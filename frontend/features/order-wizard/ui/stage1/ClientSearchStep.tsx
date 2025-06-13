'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Button, Alert, Stack } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

// Доменна логіка
import { useClientSearch } from '@/domains/wizard/stage1/client-search';

// Загальні компоненти
import { ClientSearchForm, ClientResultsList } from '../components';

interface ClientSearchStepProps {
  onClientSelected: (clientId: string) => void;
  onCreateNewClient: () => void;
}

export const ClientSearchStep: React.FC<ClientSearchStepProps> = ({
  onClientSelected,
  onCreateNewClient,
}) => {
  // ========== ДОМЕННА ЛОГІКА ==========
  const { ui, data, loading, mutations } = useClientSearch();

  // ========== ЛОКАЛЬНИЙ UI СТАН ==========
  const [showAdvancedSearch, setShowAdvancedSearch] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [address, setAddress] = React.useState('');

  // ========== EVENT HANDLERS ==========
  const handleQuickSearch = async () => {
    if (searchTerm && ui.sessionId) {
      await mutations.searchClients.mutateAsync({
        sessionId: ui.sessionId,
        data: { generalSearchTerm: searchTerm },
      });
    }
  };

  const handleAdvancedSearch = async () => {
    if (ui.sessionId) {
      await mutations.searchClients.mutateAsync({
        sessionId: ui.sessionId,
        data: { firstName, lastName, phone, email, address },
      });
    }
  };

  const handleClientSelect = async (clientId: string) => {
    try {
      if (ui.sessionId) {
        await mutations.selectClient.mutateAsync({
          sessionId: ui.sessionId,
          params: { clientId },
        });
        onClientSelected(clientId);
      }
    } catch (error) {
      console.error('Помилка вибору клієнта:', error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setAddress('');
    ui.clearSearch();
  };

  // ========== RENDER ==========
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Заголовок */}
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SearchIcon color="primary" />
        Пошук клієнта
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Знайдіть існуючого клієнта або створіть нового
      </Typography>

      {/* Форма пошуку */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <ClientSearchForm
            // Швидкий пошук
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onQuickSearch={handleQuickSearch}
            // Розширений пошук
            showAdvancedSearch={showAdvancedSearch}
            onToggleAdvancedSearch={() => setShowAdvancedSearch(!showAdvancedSearch)}
            firstName={firstName}
            onFirstNameChange={setFirstName}
            lastName={lastName}
            onLastNameChange={setLastName}
            phone={phone}
            onPhoneChange={setPhone}
            email={email}
            onEmailChange={setEmail}
            address={address}
            onAddressChange={setAddress}
            onAdvancedSearch={handleAdvancedSearch}
            // Стан
            isSearching={loading.isSearching}
            onClearSearch={handleClearSearch}
          />
        </CardContent>
      </Card>

      {/* Результати пошуку */}
      {data.searchResults?.clients && data.searchResults.clients.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <ClientResultsList
              clients={data.searchResults.clients}
              onClientSelect={handleClientSelect}
              isSelecting={loading.isSelecting}
            />
          </CardContent>
        </Card>
      )}

      {/* Повідомлення про відсутність результатів */}
      {data.searchResults?.clients &&
        data.searchResults.clients.length === 0 &&
        ui.isSearchActive && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              За вашим запитом клієнтів не знайдено. Ви можете створити нового клієнта.
            </Typography>
          </Alert>
        )}

      {/* Кнопка створення нового клієнта */}
      <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          size="large"
          startIcon={<AddIcon />}
          onClick={onCreateNewClient}
          sx={{ minWidth: 200 }}
        >
          Створити нового клієнта
        </Button>
      </Stack>

      {/* Помилки */}
      {(mutations.searchClients.error || mutations.selectClient.error) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Помилка:{' '}
            {mutations.searchClients.error?.message || mutations.selectClient.error?.message}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
