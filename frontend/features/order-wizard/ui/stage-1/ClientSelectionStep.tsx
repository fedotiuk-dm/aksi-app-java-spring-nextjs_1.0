'use client';

import { Person, PersonAdd } from '@mui/icons-material';
import { Box, Typography, Tabs, Tab, Paper, Alert, Fade } from '@mui/material';
import { useState } from 'react';

import { useClientManagement } from '@/domain/wizard';

import { ClientCreateForm } from './client/ClientCreateForm';
import { ClientSearchForm } from './client/ClientSearchForm';
import { ClientSearchResults } from './client/ClientSearchResults';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Компонент вибору клієнта (Етап 1.1)
 * Включає пошук існуючого клієнта та створення нового
 */
export const ClientSelectionStep = () => {
  const [tabValue, setTabValue] = useState(0);

  const {
    searchResults,
    selectedClient,
    isSearching,
    isCreating,
    searchError,
    operationError,
    hasSearchResults,
    searchTerm,
  } = useClientManagement();

  // ШВИДКИЙ DEBUG: Перевіряємо стан
  console.log('🔍 СТАН ПОШУКУ:', {
    searchTerm,
    searchTermLength: searchTerm?.length,
    searchResults: searchResults?.length,
    shouldShow: searchTerm && searchTerm.length >= 2,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* Заголовок */}
      <Typography variant="h5" component="h2" gutterBottom>
        Вибір або створення клієнта
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Знайдіть існуючого клієнта або створіть нового для оформлення замовлення
      </Typography>

      {/* Відображення вибраного клієнта */}
      {selectedClient && (
        <Fade in={!!selectedClient}>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="subtitle2">
              Вибрано клієнта: {selectedClient.firstName} {selectedClient.lastName}
            </Typography>
            <Typography variant="body2">
              Телефон: {selectedClient.phone}
              {selectedClient.email && ` | Email: ${selectedClient.email}`}
            </Typography>
          </Alert>
        </Fade>
      )}

      {/* Вкладки */}
      <Paper elevation={1}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="client selection tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<Person />}
            label="Пошук клієнта"
            id="client-tab-0"
            aria-controls="client-tabpanel-0"
          />
          <Tab
            icon={<PersonAdd />}
            label="Новий клієнт"
            id="client-tab-1"
            aria-controls="client-tabpanel-1"
          />
        </Tabs>

        {/* Вкладка пошуку */}
        <TabPanel value={tabValue} index={0}>
          <ClientSearchForm isLoading={isSearching} error={searchError} />

          {/* Показуємо результати тільки коли є пошуковий термін і пошук активний або завершений */}
          {searchTerm && searchTerm.length >= 2 && (
            <Box sx={{ mt: 2 }}>
              <ClientSearchResults
                results={searchResults || []}
                selectedClient={selectedClient}
                isLoading={isSearching}
              />
            </Box>
          )}
        </TabPanel>

        {/* Вкладка створення */}
        <TabPanel value={tabValue} index={1}>
          <ClientCreateForm isLoading={isCreating} error={operationError} />
        </TabPanel>
      </Paper>
    </Box>
  );
};
