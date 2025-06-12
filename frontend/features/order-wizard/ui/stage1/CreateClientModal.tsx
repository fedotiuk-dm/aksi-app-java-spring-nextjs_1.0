'use client';

import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import { FC } from 'react';

import { NewClientForm } from './NewClientForm';

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
  onClientCreated?: (clientId: string) => void;
}

export const CreateClientModal: FC<CreateClientModalProps> = ({
  open,
  onClose,
  onClientCreated,
}) => {
  const handleClientCreated = (clientId: string) => {
    onClientCreated?.(clientId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon />
          Створення нового клієнта
        </Typography>
      </DialogTitle>
      <DialogContent>
        <NewClientForm onClientCreated={handleClientCreated} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
      </DialogActions>
    </Dialog>
  );
};
