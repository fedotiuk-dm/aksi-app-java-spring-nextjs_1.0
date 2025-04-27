'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Paper, Divider, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Client } from '@/features/order-wizard/model/types';
import { StepContainer, StepNavigation } from '@/features/order-wizard/ui/components';
import { useClients } from '@/features/order-wizard/api/clients';
import { useOrderWizardNavigation } from '@/features/order-wizard/model/store';
import { WizardStep } from '@/features/order-wizard/model/types';
import ClientSearch from './components/ClientSearch';
import SearchResults from './components/SearchResults';
import ClientForm from './components/ClientForm';

/**
 * Перший крок Order Wizard - вибір або створення клієнта
 */
export const ClientSelectionStep: React.FC = () => {
  const { useCreateClient, useUpdateClient, useClientSearch } = useClients();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const { data: searchResults = [] } = useClientSearch('');
  const { navigateToStep } = useOrderWizardNavigation();
  
  // Стани для вибраного клієнта, клієнта для редагування та відображення форми
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Обробка вибору клієнта
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setClientToEdit(null);
    setShowCreateForm(false);
  };
  
  // Обробка редагування клієнта
  const handleClientEdit = (client: Client) => {
    setClientToEdit(client);
    setShowCreateForm(true);
  };
  
  // Обробка створення клієнта
  const handleCreateClient = () => {
    setClientToEdit(null);
    setShowCreateForm(true);
  };
  
  // Обробка скасування форми
  const handleFormCancel = () => {
    setShowCreateForm(false);
    setClientToEdit(null);
  };
  
  // Обробка збереження клієнта
  const handleSaveClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      setError(null);
      
      if (clientToEdit?.id) {
        // Оновлення існуючого клієнта
        const updatedClient = await updateClientMutation.mutateAsync({ 
          clientId: clientToEdit.id.toString(), 
          clientData
        });
        setSelectedClient(updatedClient);
      } else {
        // Створення нового клієнта
        const newClient = await createClientMutation.mutateAsync(clientData);
        setSelectedClient(newClient);
      }
      
      setShowCreateForm(false);
      setClientToEdit(null);
    } catch (err) {
      setError(`Помилка при ${clientToEdit ? 'оновленні' : 'створенні'} клієнта: ${err instanceof Error ? err.message : 'Невідома помилка'}`);
      console.error('Client save error:', err);
    }
  };
  
  // Перехід до наступного кроку
  const handleContinue = () => {
    if (selectedClient) {
      // Переходимо до наступного кроку
      navigateToStep(WizardStep.BASIC_INFO);
    }
  };
  
  return (
    <StepContainer title="Вибір клієнта" subtitle="Оберіть існуючого клієнта або створіть нового">
      <Grid container spacing={3}>
        {/* Пошук клієнта */}
        <Grid size={{ xs: 12, md: showCreateForm ? 12 : 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Знайти існуючого клієнта</Typography>
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleCreateClient}
              disabled={showCreateForm}
            >
              Створити нового
            </Button>
          </Box>
          
          {!showCreateForm && (
            <ClientSearch onClientSelect={handleClientSelect} />
          )}
        </Grid>
        
        {/* Форма створення/редагування клієнта */}
        {showCreateForm && (
          <Grid size={{ xs: 12 }}>
            <ClientForm
              initialClient={clientToEdit || undefined}
              onSave={handleSaveClient}
              onCancel={handleFormCancel}
              isEditing={!!clientToEdit}
            />
          </Grid>
        )}
        
        {/* Результати пошуку */}
        {!showCreateForm && searchResults.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <SearchResults
              clients={searchResults}
              onClientSelect={handleClientSelect}
              onClientEdit={handleClientEdit}
            />
          </Grid>
        )}
        
        {/* Помилка */}
        {error && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          </Grid>
        )}
        
        {/* Вибраний клієнт */}
        {selectedClient && !showCreateForm && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2, mt: 2, bgcolor: 'success.light' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'success.contrastText' }}>
                    Вибрано клієнта:
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'success.contrastText' }}>
                    {selectedClient.lastName} {selectedClient.firstName} ({selectedClient.phone})
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleContinue}
                >
                  Продовжити
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      {/* Навігаційні кнопки */}
      <StepNavigation
        onNext={selectedClient ? handleContinue : undefined}
        isNextDisabled={!selectedClient}
        hideBackButton
        nextLabel="Продовжити з вибраним клієнтом"
      />
    </StepContainer>
  );
};

export default ClientSelectionStep;
