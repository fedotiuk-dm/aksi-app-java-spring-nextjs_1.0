'use client';

/**
 * Service Type Delete Modal
 * Modal for confirming service type deletion
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
import type { ServiceType } from '@api/game';

interface ServiceTypeDeleteModalProps {
  children: React.ReactNode;
  serviceType: ServiceType;
  onDelete: (serviceTypeId: string) => Promise<void>;
}

export const ServiceTypeDeleteModal: React.FC<ServiceTypeDeleteModalProps> = ({
  children,
  serviceType,
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
      await onDelete(serviceType.id);
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete service type:', error);
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
        <DialogTitle color="error">Delete Service Type</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete the service type &ldquo;{serviceType.name}&rdquo;?
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Code: {serviceType.code}
            </Typography>

            <Alert severity="warning" sx={{ mb: 2 }}>
              This action cannot be undone. All associated price configurations will be affected.
            </Alert>

            <Typography variant="body2" color="text.secondary">
              Game ID: {serviceType.gameId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Base Multiplier: {serviceType.baseMultiplier / 100}x
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Service Type'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
