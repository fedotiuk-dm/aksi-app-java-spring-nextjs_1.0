'use client';

/**
 * Game Edit Modal
 * Modal for editing existing games
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import type { Game, UpdateGameRequestCategory } from '@api/game';

interface GameEditModalProps {
  children: React.ReactNode;
  game: Game;
  categories: UpdateGameRequestCategory[];
  onUpdate: (
    gameId: string,
    gameData: {
      name?: string;
      category?: UpdateGameRequestCategory;
      description?: string;
      active?: boolean;
      sortOrder?: number;
    }
  ) => Promise<void>;
}

export const GameEditModal: React.FC<GameEditModalProps> = ({
  children,
  game,
  categories,
  onUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    active: true,
    sortOrder: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && game) {
      setFormData({
        name: game.name || '',
        category: game.category || '',
        description: game.description || '',
        active: game.active ?? true,
        sortOrder: game.sortOrder ?? 0,
      });
    }
  }, [open, game]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.category.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(game.id, {
        name: formData.name.trim(),
        category: formData.category as UpdateGameRequestCategory,
        description: formData.description?.trim() || undefined,
        active: formData.active,
        sortOrder: formData.sortOrder,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to update game:', error);
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
        <DialogTitle>Edit Game</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Game Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
              autoFocus
            />

            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              placeholder="Brief description of the game..."
            />

            <TextField
              label="Sort Order"
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sortOrder: Number(e.target.value) || 0 }))
              }
              fullWidth
              helperText="Lower numbers appear first in the list"
              slotProps={{
                htmlInput: { min: 0 },
              }}
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
            disabled={!formData.name.trim() || !formData.category.trim() || isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Game'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
