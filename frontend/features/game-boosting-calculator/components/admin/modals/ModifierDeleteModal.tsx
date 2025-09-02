'use client';

/**
 * Modifier Delete Modal
 * Modal for confirming modifier deletion
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
  Chip,
} from '@mui/material';
import { PriceModifier } from '@api/pricing';

interface ModifierDeleteModalProps {
  children: React.ReactNode;
  modifier: PriceModifier;
  onDelete: (modifierCode: string) => Promise<void>;
}

export const ModifierDeleteModal: React.FC<ModifierDeleteModalProps> = ({
  children,
  modifier,
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
      await onDelete(modifier.code);
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete modifier:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getModifierDisplayValue = (modifier: PriceModifier) => {
    switch (modifier.operation) {
      case 'MULTIPLY':
        return `${modifier.value / 100}x`;
      case 'ADD':
        return `+$${modifier.value / 100}`;
      case 'PERCENTAGE':
        return `+${modifier.value}%`;
      default:
        return `${modifier.value}`;
    }
  };

  return (
    <>
      <Box onClick={handleOpen} sx={{ display: 'inline-block' }}>
        {children}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle color="error">Delete Price Modifier</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete the modifier &ldquo;{modifier.name}&rdquo;?
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Code: {modifier.code}
            </Typography>

            <Alert severity="warning" sx={{ mb: 2 }}>
              This action cannot be undone. The modifier will be permanently removed and may affect
              existing calculations.
            </Alert>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Modifier Details:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Chip label={modifier.type} size="small" color="primary" variant="outlined" />
                <Chip
                  label={modifier.operation}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
                <Chip
                  label={getModifierDisplayValue(modifier)}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
              {modifier.description && (
                <Typography variant="body2" color="text.secondary">
                  {modifier.description}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Modifier'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
