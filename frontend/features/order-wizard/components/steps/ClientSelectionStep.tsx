'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  CircularProgress,
  Button,
  Grid,
  Divider,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { clientsApi } from '@/features/clients/api/clientsApi';
import { Client } from '@/features/clients/types/client.types';
import { useDebounce } from '@/features/order-wizard/hooks/useDebounce';

interface ClientSelectionStepProps {
  onClientSelect: (client: Client | null) => void;
  onCreateNewClient: () => void;
  selectedClient: Client | null;
  orderNote: string;
  onOrderNoteChange: (note: string) => void;
  onNext: () => void;
}

export function ClientSelectionStep({
  onClientSelect,
  onCreateNewClient,
  selectedClient,
  orderNote,
  onOrderNoteChange,
  onNext,
}: ClientSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Завантаження клієнтів при зміні пошукового запиту
  useEffect(() => {
    let active = true;

    const fetchClients = async () => {
      setLoading(true);
      setError(null);

      try {
        if (debouncedSearchTerm.length < 2) {
          setOptions([]);
          setLoading(false);
          return;
        }

        const response = await clientsApi.getClients({
          keyword: debouncedSearchTerm,
          size: 10,
        });

        if (active) {
          setOptions(response.content);
        }
      } catch (err) {
        if (active) {
          setError('Помилка при завантаженні списку клієнтів');
          console.error('Помилка при пошуку клієнтів:', err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchClients();

    return () => {
      active = false;
    };
  }, [debouncedSearchTerm]);

  const handleClientChange = (
    _: React.SyntheticEvent,
    newValue: Client | null
  ) => {
    onClientSelect(newValue);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Вибір клієнта
      </Typography>

      <Grid container spacing={3}>
        <Grid size={12} sx={{ mb: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Autocomplete
            id="client-selection"
            options={options}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName} (${option.phone})`
            }
            loading={loading}
            onChange={handleClientChange}
            value={selectedClient}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Пошук клієнта"
                variant="outlined"
                fullWidth
                onChange={(e) => setSearchTerm(e.target.value)}
                helperText="Введіть ім'я, прізвище або телефон клієнта"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onCreateNewClient}
            >
              Створити нового клієнта
            </Button>
          </Box>
        </Grid>

        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid size={12}>
          <Typography variant="h6" gutterBottom>
            Інформація про замовлення
          </Typography>

          <TextField
            label="Примітки до замовлення"
            multiline
            rows={4}
            value={orderNote}
            onChange={(e) => onOrderNoteChange(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder="Додаткова інформація, коментарі, побажання..."
          />
        </Grid>

        <Grid size={12} sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onNext}
              disabled={!selectedClient}
            >
              Далі
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
