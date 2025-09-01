'use client';

/**
 * Booster Edit Modal
 * Modal for editing existing boosters
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Switch,
  FormControlLabel,
} from '@mui/material';
import type { Booster } from '@api/game';

interface BoosterEditModalProps {
  children: React.ReactNode;
  booster: Booster;
  onUpdate: (
    boosterId: string,
    boosterData: {
      discordUsername?: string;
      displayName?: string;
      contactEmail?: string;
      phoneNumber?: string;
      active?: boolean;
    }
  ) => Promise<void>;
}

export const BoosterEditModal: React.FC<BoosterEditModalProps> = ({
  children,
  booster,
  onUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    discordUsername: '',
    displayName: '',
    contactEmail: '',
    phoneNumber: '',
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && booster) {
      setFormData({
        discordUsername: booster.discordUsername || '',
        displayName: booster.displayName || '',
        contactEmail: booster.contactEmail || '',
        phoneNumber: booster.phoneNumber || '',
        active: booster.active ?? true,
      });
    }
  }, [open, booster]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!formData.discordUsername.trim() || !formData.displayName.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(booster.id, {
        discordUsername: formData.discordUsername.trim(),
        displayName: formData.displayName.trim(),
        contactEmail: formData.contactEmail.trim() || undefined,
        phoneNumber: formData.phoneNumber.trim() || undefined,
        active: formData.active,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to update booster:', error);
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
        <DialogTitle>Edit Booster</DialogTitle>
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
              label="Contact Email (Optional)"
              value={formData.contactEmail}
              onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
              fullWidth
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

            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                />
              }
              label="Active"
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
            {isSubmitting ? 'Updating...' : 'Update Booster'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
