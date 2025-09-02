'use client';

/**
 * Price Configuration Delete Modal
 * Modal for confirming price configuration deletion
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import type { PriceConfiguration } from '@api/game';

interface PriceConfigurationDeleteModalProps {
  children: React.ReactNode;
  priceConfiguration: PriceConfiguration;
  onDelete: (priceConfigurationId: string) => Promise<void>;
}

export const PriceConfigurationDeleteModal: React.FC<PriceConfigurationDeleteModalProps> = ({
  children,
  priceConfiguration,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!isDeleting) {
      setOpen(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(priceConfiguration.id);
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete price configuration:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Box onClick={handleOpen} sx={{ display: 'inline-block' }}>
        {children}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle color="error">Delete Price Configuration</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete this price configuration?
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              ID: {priceConfiguration.id}
            </Typography>

            <Alert severity="warning" sx={{ mb: 2 }}>
              This action cannot be undone. The price configuration will be permanently removed.
            </Alert>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Game: {priceConfiguration.game?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Service Type: {priceConfiguration.serviceType?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Difficulty Level: {priceConfiguration.difficultyLevel?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Final Price: ${priceConfiguration.finalPrice}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Price Configuration'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
