'use client';

/**
 * Booster Create Modal
 * Modal for creating new boosters
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';

interface BoosterCreateModalProps {
  children: React.ReactNode;
  onCreate: (boosterData: {
    discordUsername: string;
    displayName: string;
    contactEmail: string;
    phoneNumber?: string;
  }) => Promise<void>;
}

export const BoosterCreateModal: React.FC<BoosterCreateModalProps> = ({ children, onCreate }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    discordUsername: '',
    displayName: '',
    contactEmail: '',
    phoneNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      discordUsername: '',
      displayName: '',
      contactEmail: '',
      phoneNumber: '',
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.discordUsername.trim() ||
      !formData.displayName.trim() ||
      !formData.contactEmail.trim()
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        discordUsername: formData.discordUsername.trim(),
        displayName: formData.displayName.trim(),
        contactEmail: formData.contactEmail.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to create booster:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Box onClick={handleOpen} sx={{ display: 'inline-block' }}>
        {children}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Booster</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Discord Username"
              value={formData.discordUsername}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, discordUsername: e.target.value }))
              }
              fullWidth
              required
              autoFocus
              placeholder="username#1234"
            />

            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
              fullWidth
              required
              placeholder="Professional Gamer"
            />

            <TextField
              label="Contact Email"
              value={formData.contactEmail}
              onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
              fullWidth
              required
              type="email"
              placeholder="booster@example.com"
            />

            <TextField
              label="Phone Number (Optional)"
              value={formData.phoneNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              fullWidth
              placeholder="+1234567890"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.discordUsername.trim() || !formData.displayName.trim() || isSubmitting
            }
          >
            {isSubmitting ? 'Creating...' : 'Create Booster'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
