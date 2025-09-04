'use client';

/**
 * Service Type Create Modal
 * Modal for creating new service types
 */

import React, { useState } from 'react';
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
} from '@mui/material';
import type { Game, CreateServiceTypeRequest } from '@api/game';

interface ServiceTypeCreateModalProps {
  children: React.ReactNode;
  games: Game[];
  onCreate: (serviceTypeData: CreateServiceTypeRequest) => Promise<void>;
}

export const ServiceTypeCreateModal: React.FC<ServiceTypeCreateModalProps> = ({
  children,
  games,
  onCreate,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    gameId: '',
    baseMultiplier: 100,
    description: '',
    sortOrder: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      code: '',
      gameId: '',
      baseMultiplier: 100,
      description: '',
      sortOrder: 0,
    });
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
      await onCreate({
        name: formData.name.trim(),
        code: formData.code.trim(),
        gameId: formData.gameId,
        baseMultiplier: formData.baseMultiplier,
        description: formData.description.trim() || undefined,
        sortOrder: formData.sortOrder,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to create service type:', error);
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
        <DialogTitle>Create New Service Type</DialogTitle>
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
              placeholder="BOOSTING, COACHING, etc."
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
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 0.01,
                },
              }}
              helperText="Base price in USD for this service type"
            />

            <TextField
              label="Sort Order"
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sortOrder: parseInt(e.target.value) || 0,
                }))
              }
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
              helperText="Lower numbers appear first in the list"
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
              isSubmitting
            }
          >
            {isSubmitting ? 'Creating...' : 'Create Service Type'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
