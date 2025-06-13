'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Button, Alert, Stack } from '@mui/material';
import { Search as SearcIcon, Add as AddIcon } from '@mui/icons-material';

// Доменна логіка - використовуємо новий debounce хук з workflow
import { useClientSearchDebounce } from '@/domains/wizard/stage1/client-search';

// Загальні компоненти
import { ClientSearchForm, ClientResultsList } from './components';

interface ClientSearchStepProps {
  onClientSelected: (clientId: string) => void;
  onCreateNewClient: () => void;
}

export const ClientSearchStep: React.FC<ClientSearchStepProps> = ({
  onClientSelected,
  onCreateNewClient,
}) => {
  // ========== ДОМЕННА ЛОГІКА З DEBOUNCE + WORKFLOW ==========
  const { ui, data, loading, computed, actions, debounce, workflow } = useClientSearchDebounce();

  // ========== ОБРОБНИКИ ПОДІЙ ==========
  const handleSearchTermChange = (value: string) => {
    actions.searchWithDebounce(value);
  };

  const handleQuickSearch = () => {
    actions.forceSearch();
  };

  const handleClearSearch = () => {
    actions.clearSearch();
  };

  const handleClientSelect = (clientId: string) => {
    ui.setSelectedClientId(clientId);
    onClientSelected(clientId);
  };

  // ========== RENDER ==========
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Заголовок */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Пошук клієнта
      </Typography>

      {/* Статус workflow */}
      {!workflow.ui.isInitialized && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">Ініціалізація системи...</Typography>
        </Alert>
      )}

      {/* Форма пошуку */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <ClientSearchForm
            searchTerm={ui.searchTerm}
            onSearchTermChange={handleSearchTermChange}
            onQuickSearch={handleQuickSearch}
            isSearching={loading.isLoading}
            onClearSearch={handleClearSearch}
            placeholder="Введіть прізвище, ім'я, телефон або email"
            disabled={!computed.hasSessionId}
            isAutoSearching={debounce.isSearching}
            showAutoSearchIndicator={true}
          />
        </CardContent>
      </Card>

      {/* Повідомлення про відсутність результатів */}
      {!computed.hasResults &&
        ui.isSearchActive &&
        computed.hasValidSearchTerm &&
        !loading.isLoading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              За вашим запитом &ldquo;{ui.searchTerm}&rdquo; клієнтів не знайдено. Ви можете
              створити нового клієнта.
            </Typography>
          </Alert>
        )}

      {/* Debounce індикатор */}
      {debounce.isSearching && debounce.hasMinLength && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Автоматичний пошук за запитом &ldquo;{debounce.debouncedSearchTerm}&rdquo;...
          </Typography>
        </Alert>
      )}

      {/* Результати пошуку */}
      {computed.hasResults && (
        <ClientResultsList
          clients={data.searchResults?.clients || []}
          onClientSelect={handleClientSelect}
          isSelecting={loading.isLoading}
        />
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
    </Box>
  );
};
