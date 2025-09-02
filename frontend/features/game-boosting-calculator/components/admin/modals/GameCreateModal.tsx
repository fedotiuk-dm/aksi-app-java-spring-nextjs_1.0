'use client';

/**
 * Game Create Modal
 * Modal for creating new games
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
import { CreateGameRequestCategory } from '@api/game';

interface GameCreateModalProps {
  children: React.ReactNode;
  categories: CreateGameRequestCategory[];
  onCreate: (gameData: {
    name: string;
    code: string;
    category: CreateGameRequestCategory;
    description?: string;
  }) => Promise<void>;
}

export const GameCreateModal: React.FC<GameCreateModalProps> = ({
  children,
  categories,
  onCreate,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', code: '', category: '', description: '' });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.code.trim() || !formData.category.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        name: formData.name.trim(),
        code: formData.code.trim(),
        category: formData.category.trim(),
        description: formData.description.trim() || undefined,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to create game:', error);
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
        <DialogTitle>Create New Game</DialogTitle>
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

            <TextField
              label="Game Code"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
              }
              fullWidth
              required
              placeholder="LOL, DOTA2, CS2, etc."
              helperText="Use uppercase letters, numbers, underscores and hyphens only"
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
            {isSubmitting ? 'Creating...' : 'Create Game'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
