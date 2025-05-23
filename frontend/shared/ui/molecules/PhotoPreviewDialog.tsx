'use client';

import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import React from 'react';

interface PhotoPreviewDialogProps {
  open: boolean;
  imageUrl: string | null;
  onClose: () => void;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Компонент для попереднього перегляду фото
 */
export const PhotoPreviewDialog: React.FC<PhotoPreviewDialogProps> = ({
  open,
  imageUrl,
  onClose,
  title = 'Попередній перегляд фото',
  maxWidth = 'md',
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <IconButton onClick={onClose} color="inherit">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {imageUrl && (
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={imageUrl}
              alt="Попередній перегляд"
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
      </DialogActions>
    </Dialog>
  );
};
