'use client';

/**
 * Booster Delete Modal
 * Confirmation modal for deleting boosters
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
import type { Booster } from '@api/game';

interface BoosterDeleteModalProps {
  children: React.ReactNode;
  booster: Booster;
  onDelete: (boosterId: string) => Promise<void>;
}

export const BoosterDeleteModal: React.FC<BoosterDeleteModalProps> = ({
  children,
  booster,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(booster.id);
      handleClose();
    } catch (error) {
      console.error('Failed to delete booster:', error);
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
        <DialogTitle>Delete Booster</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete the booster &quot;{booster.displayName}&quot;?
            </Typography>

            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                This action cannot be undone. All associated orders and ratings will be affected.
              </Typography>
            </Alert>

            <Typography variant="body2" color="text.secondary">
              <strong>Discord:</strong> @{booster.discordUsername}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Orders:</strong> {booster.totalOrders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Rating:</strong> {((booster.rating || 0) / 100).toFixed(1)}/5.0
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Booster'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
