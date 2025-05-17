'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import { Client } from '@/features/order-wizard/model/types';
import {
  StepContainer,
  StepNavigation,
} from '@/features/order-wizard/ui/components';
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

  // Визначаємо розмір екрану для адаптивного дизайну
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
          clientData,
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
      setError(
        `Помилка при ${clientToEdit ? 'оновленні' : 'створенні'} клієнта: ${
          err instanceof Error ? err.message : 'Невідома помилка'
        }`
      );
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

  // Функція для відображення ініціалів клієнта
  const getClientInitials = (client: Client) => {
    return `${client.firstName.charAt(0)}${client.lastName.charAt(
      0
    )}`.toUpperCase();
  };

  // Визначаємо, чи є результати пошуку для відображення
  const hasSearchResults = !showCreateForm && searchResults.length > 0;

  return (
    <StepContainer
      title="Вибір клієнта"
      subtitle="Оберіть існуючого клієнта або створіть нового"
    >
      <Box sx={{ position: 'relative' }}>
        {/* Секція пошуку або створення клієнта */}
        <Box
          sx={{
            mb: hasSearchResults ? 2 : 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Grid container spacing={isTablet ? 4 : 3}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: isTablet ? 3 : 2,
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 2 : 0,
                }}
              >
                <Typography
                  variant={isTablet ? 'h5' : 'h6'}
                  sx={{ fontWeight: 'bold', color: 'primary.main' }}
                >
                  {showCreateForm
                    ? 'Створення нового клієнта'
                    : 'Знайти існуючого клієнта'}
                </Typography>

                {!showCreateForm && (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreateClient}
                    size={isTablet ? 'large' : 'medium'}
                    sx={{
                      minWidth: isMobile ? '100%' : 'auto',
                      py: isTablet ? 1.5 : 1,
                      fontSize: isTablet ? '1rem' : 'inherit',
                      fontWeight: 500,
                      borderRadius: 2,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                      },
                    }}
                  >
                    Створити нового
                  </Button>
                )}
              </Box>

              {/* Форма пошуку клієнта */}
              <Fade in={!showCreateForm} timeout={300}>
                <Box sx={{ display: showCreateForm ? 'none' : 'block' }}>
                  <ClientSearch onClientSelect={handleClientSelect} />
                </Box>
              </Fade>

              {/* Форма створення/редагування клієнта */}
              <Fade in={showCreateForm} timeout={400}>
                <Box sx={{ display: showCreateForm ? 'block' : 'none' }}>
                  <ClientForm
                    initialClient={clientToEdit || undefined}
                    onSave={handleSaveClient}
                    onCancel={handleFormCancel}
                    isEditing={!!clientToEdit}
                  />
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Box>

        {/* Помилка */}
        {error && (
          <Zoom in={!!error} timeout={300}>
            <Alert
              severity="error"
              sx={{
                mt: 2,
                fontSize: isTablet ? '1rem' : 'inherit',
                borderRadius: 2,
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </Zoom>
        )}

        {/* Результати пошуку - відображаємо на весь екран */}
        {hasSearchResults && (
          <Fade in={hasSearchResults} timeout={400}>
            <Box sx={{ mt: 3 }}>
              <SearchResults
                clients={searchResults}
                onClientSelect={handleClientSelect}
                onClientEdit={handleClientEdit}
              />
            </Box>
          </Fade>
        )}

        {/* Вибраний клієнт */}
        {selectedClient && !showCreateForm && (
          <Grid container>
            <Grid size={{ xs: 12 }}>
              <Zoom
                in={selectedClient !== null && !showCreateForm}
                timeout={400}
              >
                <Card
                  sx={{
                    mt: isTablet ? 3 : 2,
                    borderRadius: 2,
                    boxShadow: theme.shadows[3],
                    border: `2px solid ${theme.palette.success.main}`,
                    overflow: 'visible',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      left: 20,
                      bgcolor: 'success.main',
                      borderRadius: '50%',
                      p: 1,
                      color: 'white',
                      boxShadow: theme.shadows[3],
                    }}
                  >
                    <CheckCircleIcon fontSize={isTablet ? 'large' : 'medium'} />
                  </Box>

                  <CardContent sx={{ pt: 3, pb: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? 3 : 0,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: isTablet ? 56 : 48,
                            height: isTablet ? 56 : 48,
                            fontSize: isTablet ? '1.5rem' : '1.2rem',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          }}
                        >
                          {getClientInitials(selectedClient)}
                        </Avatar>

                        <Box>
                          <Typography
                            variant="subtitle1"
                            color="success.main"
                            fontWeight="medium"
                          >
                            Вибрано клієнта:
                          </Typography>
                          <Typography
                            variant={isTablet ? 'h5' : 'h6'}
                            sx={{
                              fontWeight: 'bold',
                              color: 'text.primary',
                            }}
                          >
                            {selectedClient.lastName} {selectedClient.firstName}
                          </Typography>

                          <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <LocalPhoneIcon
                                fontSize="small"
                                color="primary"
                              />
                              <Typography variant="body2">
                                {selectedClient.phone}
                              </Typography>
                            </Box>

                            {selectedClient.email && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <EmailIcon fontSize="small" color="primary" />
                                <Typography variant="body2">
                                  {selectedClient.email}
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          {selectedClient.communicationChannels &&
                            selectedClient.communicationChannels.length > 0 && (
                              <Box
                                sx={{
                                  mt: 1,
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 1,
                                }}
                              >
                                {selectedClient.communicationChannels.map(
                                  (channel) => (
                                    <Chip
                                      key={channel}
                                      label={
                                        channel === 'PHONE'
                                          ? 'Телефон'
                                          : channel === 'SMS'
                                          ? 'SMS'
                                          : channel
                                      }
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                    />
                                  )
                                )}
                              </Box>
                            )}
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleContinue}
                        size={isTablet ? 'large' : 'medium'}
                        sx={{
                          minWidth: isMobile ? '100%' : 'auto',
                          py: isTablet ? 1.5 : 1,
                          px: isTablet ? 3 : 2,
                          fontSize: isTablet ? '1rem' : 'inherit',
                          fontWeight: 'bold',
                          borderRadius: 2,
                          boxShadow: theme.shadows[2],
                        }}
                      >
                        Продовжити
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          </Grid>
        )}
      </Box>

      <Divider sx={{ my: isTablet ? 5 : 4 }} />

      {/* Навігаційні кнопки */}
      <StepNavigation
        onNext={selectedClient ? handleContinue : undefined}
        isNextDisabled={!selectedClient}
        hideBackButton
        nextLabel="Продовжити з вибраним клієнтом"
        buttonSize={isTablet ? 'large' : 'medium'}
      />
    </StepContainer>
  );
};

export default ClientSelectionStep;
