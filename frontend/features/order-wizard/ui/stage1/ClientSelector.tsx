import React from 'react';
import { Box, Typography, Paper, Button, Alert } from '@mui/material';
import { ClientSearch } from './ClientSearch';
import { ClientForm } from './ClientForm';
import { useClientSelection } from '../../hooks/useClientSelection';
import { ClientResponse } from '@/lib/api';

interface ClientSelectorProps {
  onClientSelected: (client: ClientResponse) => void;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({ onClientSelected }) => {
  const {
    selectedClient,
    isExistingClient,
    searchTerm,
    clients,
    isSearching,
    clientForm,
    isCreating,
    createError,
    handleSearch,
    handleSelectClient,
    toggleClientMode,
    handleClientFormChange,
    handleCreateClient,
  } = useClientSelection();

  // Ефект, що відстежує вибір клієнта
  React.useEffect(() => {
    if (selectedClient) {
      onClientSelected(selectedClient);
    }
  }, [selectedClient, onClientSelected]);

  // Обробка створення нового клієнта
  const handleSubmitNewClient = async () => {
    try {
      const newClient = await handleCreateClient();
      onClientSelected(newClient);
    } catch (error) {
      console.error('Error creating new client:', error);
    }
  };

  // Вибір клієнта
  const handleClientSelect = (client: ClientResponse) => {
    handleSelectClient(client);
    onClientSelected(client);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Клієнт замовлення
      </Typography>

      {selectedClient ? (
        <Box>
          <Alert severity="success" sx={{ mb: 2 }}>
            Клієнт вибраний: {`${selectedClient.lastName} ${selectedClient.firstName}`}
          </Alert>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={() => handleSelectClient(null)}>
              Змінити клієнта
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          {isExistingClient ? (
            <ClientSearch
              searchTerm={searchTerm}
              clients={clients}
              isSearching={isSearching}
              onSearch={handleSearch}
              onSelectClient={handleClientSelect}
              onCreateNew={toggleClientMode}
            />
          ) : (
            <ClientForm
              values={clientForm}
              isCreating={isCreating}
              error={createError}
              onChange={handleClientFormChange}
              onSubmit={handleSubmitNewClient}
              onCancel={toggleClientMode}
            />
          )}
        </>
      )}
    </Paper>
  );
};
