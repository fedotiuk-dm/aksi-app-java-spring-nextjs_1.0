'use client';

import React from 'react';
import {
  List,
  ListItemButton,
  Typography,
  Stack,
  Divider,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

interface Client {
  id?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface ClientResultsListProps {
  clients: Client[];
  onClientSelect: (clientId: string) => void;
  isSelecting: boolean;
}

export const ClientResultsList: React.FC<ClientResultsListProps> = ({
  clients,
  onClientSelect,
  isSelecting,
}) => {
  if (clients.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Знайдені клієнти ({clients.length})
      </Typography>

      <List>
        {clients.map((client, index) => (
          <React.Fragment key={client.id || index}>
            <ListItemButton
              onClick={() => client.id && onClientSelect(client.id)}
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
              <Box sx={{ width: '100%' }}>
                {/* Основна інформація */}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="subtitle1">
                    {client.firstName} {client.lastName}
                  </Typography>
                </Stack>

                {/* Додаткова інформація */}
                <Stack spacing={0.5}>
                  {client.phone && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {client.phone}
                      </Typography>
                    </Stack>
                  )}
                  {client.email && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {client.email}
                      </Typography>
                    </Stack>
                  )}
                  {client.address && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {client.address}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            </ListItemButton>
            {index < clients.length - 1 && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>

      {/* Індикатор завантаження */}
      {isSelecting && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Вибір клієнта...
          </Typography>
        </Box>
      )}
    </Box>
  );
};
