'use client';

/**
 * @fileoverview UI компонент для першого етапу Order Wizard
 *
 * Приклад "тонкого" UI компонента - отримує всі дані та логіку з доменного шару
 * Автоматичний пошук клієнтів з debounce
 */

import { PersonAdd, Business, Clear } from '@mui/icons-material';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  List,
  ListItemText,
  ListItemButton,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import React from 'react';

import { NewClientForm } from './NewClientForm';

import type { OrderWizardContext } from '@/domains/wizard';
import type { CreateClientRequest } from '@/shared/api/generated/full';

interface Props {
  wizard: OrderWizardContext;
}

export const Stage1ClientSelection: React.FC<Props> = ({ wizard }) => {
  const { stage1 } = wizard;
  const {
    state,
    setSearchQuery,
    selectClient,
    clearSelectedClient,
    clearSearchResults,
    startNewClientCreation,
    cancelNewClientCreation,
    createNewClient,
    selectBranch,
    setTagNumber,
    setReceiptNumber,
    isStage1Valid,
    completeStage1,
    isLoading,
    isSearching,
    isCreating,
    error,
    searchResults,
    availableBranches,
    hasSearchResults,
  } = stage1;

  const handleCreateClient = async (clientData: CreateClientRequest) => {
    await createNewClient(clientData);
  };

  const handleClearSearch = () => {
    clearSearchResults();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Етап 1: Клієнт та базова інформація замовлення
      </Typography>

      {/* Помилки */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Ліва частина - Клієнт */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                1.1. Вибір або створення клієнта
              </Typography>

              {!state.selectedClient && !state.isCreatingNewClient && (
                <>
                  {/* Автоматичний пошук клієнта */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Пошук існуючого клієнта
                    </Typography>
                    <TextField
                      fullWidth
                      label="Пошук за прізвищем, ім'ям, телефоном..."
                      value={state.searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={isLoading}
                      placeholder="Введіть мінімум 2 символи для автоматичного пошуку"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {isSearching && <CircularProgress size={20} sx={{ mr: 1 }} />}
                            {(state.searchQuery || hasSearchResults) && (
                              <IconButton
                                onClick={handleClearSearch}
                                size="small"
                                title="Очистити пошук"
                              >
                                <Clear />
                              </IconButton>
                            )}
                          </InputAdornment>
                        ),
                      }}
                      helperText={
                        state.searchQuery.length > 0 && state.searchQuery.length < 2
                          ? 'Введіть мінімум 2 символи'
                          : isSearching
                            ? 'Пошук...'
                            : hasSearchResults
                              ? `Знайдено результатів: ${searchResults.length}`
                              : ''
                      }
                    />

                    {/* Результати пошуку */}
                    {hasSearchResults && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Результати пошуку:
                        </Typography>
                        <List>
                          {searchResults.map((client) => (
                            <ListItemButton
                              key={client.id}
                              onClick={() => selectClient(client)}
                              sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                mb: 1,
                              }}
                            >
                              <ListItemText
                                primary={`${client.lastName} ${client.firstName}`}
                                secondary={
                                  <Box component="span">
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      component="span"
                                    >
                                      {client.phone}
                                    </Typography>
                                    {client.email && (
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        component="span"
                                        sx={{ display: 'block' }}
                                      >
                                        {client.email}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                              />
                            </ListItemButton>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Створення нового клієнта */}
                  <Button
                    variant="contained"
                    onClick={startNewClientCreation}
                    startIcon={<PersonAdd />}
                    fullWidth
                  >
                    Створити нового клієнта
                  </Button>
                </>
              )}

              {/* Вибраний клієнт */}
              {state.selectedClient && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Вибраний клієнт:
                  </Typography>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">
                        {state.selectedClient.lastName} {state.selectedClient.firstName}
                      </Typography>
                      <Typography color="text.secondary">{state.selectedClient.phone}</Typography>
                      {state.selectedClient.email && (
                        <Typography color="text.secondary">{state.selectedClient.email}</Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={clearSelectedClient}>
                        Змінити клієнта
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              )}

              {/* Форма нового клієнта */}
              {state.isCreatingNewClient && (
                <NewClientForm
                  onCreateClient={handleCreateClient}
                  onCancel={cancelNewClientCreation}
                  isCreating={isCreating}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Права частина - Базова інформація */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                1.3. Базова інформація замовлення
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Пункт прийому замовлення *</InputLabel>
                    <Select
                      value={state.selectedBranch?.id || ''}
                      onChange={(e) => {
                        const branch = availableBranches.find((b) => b.id === e.target.value);
                        if (branch) selectBranch(branch);
                      }}
                      label="Пункт прийому замовлення *"
                    >
                      {availableBranches.map((branch) => (
                        <MenuItem key={branch.id} value={branch.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Business fontSize="small" />
                            {branch.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Номер квитанції"
                    value={state.receiptNumber}
                    InputProps={{
                      readOnly: true,
                      endAdornment:
                        isLoading && state.selectedBranch ? <CircularProgress size={20} /> : null,
                    }}
                    helperText={
                      isLoading && state.selectedBranch
                        ? 'Генерується номер квитанції...'
                        : state.receiptNumber
                          ? 'Номер згенеровано автоматично'
                          : 'Оберіть філію для генерації номера'
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Унікальна мітка"
                    value={state.tagNumber}
                    onChange={(e) => setTagNumber(e.target.value)}
                    helperText="Вводиться вручну або сканується"
                  />
                </Grid>
              </Grid>

              {/* Статус валідації */}
              <Box sx={{ mt: 3 }}>
                {isStage1Valid ? (
                  <Chip label="Етап 1 готовий" color="success" variant="outlined" />
                ) : (
                  <Chip label="Заповніть всі обов'язкові поля" color="warning" variant="outlined" />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
