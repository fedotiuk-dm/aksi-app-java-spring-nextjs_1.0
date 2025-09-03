'use client';

/**
 * Service Type Edit Modal
 * Modal for editing existing service types
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';
import type { ServiceType, Game } from '@api/game';

interface ServiceTypeEditModalProps {
  children: React.ReactNode;
  serviceType: ServiceType;
  games: Game[];
  onUpdate: (
    serviceTypeId: string,
    serviceTypeData: {
      name?: string;
      code?: string;
      gameId?: string;
      baseMultiplier?: number;
      description?: string;
      active?: boolean;
    }
  ) => Promise<void>;
}

export const ServiceTypeEditModal: React.FC<ServiceTypeEditModalProps> = ({
  children,
  serviceType,
  games,
  onUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    gameId: '',
    baseMultiplier: 100,
    description: '',
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (serviceType) {
      setFormData({
        name: serviceType.name,
        code: serviceType.code,
        gameId: serviceType.gameId,
        baseMultiplier: serviceType.baseMultiplier,
        description: serviceType.description || '',
        active: serviceType.active,
      });
    }
  }, [serviceType]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.code.trim() ||
      !formData.gameId ||
      formData.baseMultiplier <= 0
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(serviceType.id, {
        name: formData.name.trim(),
        code: formData.code.trim(),
        gameId: formData.gameId,
        baseMultiplier: formData.baseMultiplier,
        description: formData.description.trim() || undefined,
        active: formData.active,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to update service type:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = () => {
    return (
      formData.name !== serviceType.name ||
      formData.code !== serviceType.code ||
      formData.gameId !== serviceType.gameId ||
      formData.baseMultiplier !== serviceType.baseMultiplier ||
      formData.description !== (serviceType.description || '') ||
      formData.active !== serviceType.active
    );
  };

  return (
    <>
      <Box onClick={handleOpen} sx={{ display: 'inline-block' }}>
        {children}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Service Type</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Service Type Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
              autoFocus
            />

            <TextField
              label="Code"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
              }
              fullWidth
              required
              helperText="Use uppercase letters, numbers, underscores and hyphens only"
            />

            <FormControl fullWidth required>
              <InputLabel>Game</InputLabel>
              <Select
                value={formData.gameId}
                label="Game"
                onChange={(e) => setFormData((prev) => ({ ...prev, gameId: e.target.value }))}
              >
                {games.map((game) => (
                  <MenuItem key={game.id} value={game.id}>
                    {game.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Base Multiplier (basis points)"
              type="number"
              value={formData.baseMultiplier}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  baseMultiplier: parseFloat(e.target.value) || 0,
                }))
              }
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
              helperText="Base price in USD for this service type"
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

            <TextField
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              placeholder="Brief description of the service type..."
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
              !formData.name.trim() ||
              !formData.code.trim() ||
              !formData.gameId ||
              formData.baseMultiplier <= 0 ||
              !hasChanges() ||
              isSubmitting
            }
          >
            {isSubmitting ? 'Updating...' : 'Update Service Type'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
