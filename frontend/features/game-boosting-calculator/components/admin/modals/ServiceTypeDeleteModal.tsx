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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import type { ServiceType } from '@api/game';

interface ServiceTypeDeleteModalProps {
  children: React.ReactNode;
  serviceType: ServiceType;
  onDelete: (serviceTypeId: string) => Promise<void>;
  onForceDelete?: (serviceTypeId: string) => Promise<void>;
}

export const ServiceTypeDeleteModal: React.FC<ServiceTypeDeleteModalProps> = ({
  children,
  serviceType,
  onDelete,
  onForceDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteType, setDeleteType] = useState<'soft' | 'force'>('soft');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!isDeleting) {
      setOpen(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteType === 'force' && onForceDelete) {
        await onForceDelete(serviceType.id);
      } else {
        await onDelete(serviceType.id);
      }
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

            {deleteType === 'soft' ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                This will deactivate the service type. It can be reactivated later.
              </Alert>
            ) : (
              <Alert severity="error" sx={{ mb: 2 }}>
                This action cannot be undone. The service type will be permanently deleted along
                with all associated data.
              </Alert>
            )}

            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Delete Type</FormLabel>
              <RadioGroup
                value={deleteType}
                onChange={(e) => setDeleteType(e.target.value as 'soft' | 'force')}
                row
              >
                <FormControlLabel
                  value="soft"
                  control={<Radio />}
                  label="Deactivate (can be undone)"
                />
                {onForceDelete && (
                  <FormControlLabel value="force" control={<Radio />} label="Permanently Delete" />
                )}
              </RadioGroup>
            </FormControl>

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
            {isDeleting
              ? deleteType === 'force'
                ? 'Deleting...'
                : 'Deactivating...'
              : deleteType === 'force'
                ? 'Delete Permanently'
                : 'Deactivate'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
