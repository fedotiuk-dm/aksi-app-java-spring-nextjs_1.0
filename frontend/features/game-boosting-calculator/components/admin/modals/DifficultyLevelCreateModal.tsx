'use client';

/**
 * Difficulty Level Create Modal
 * Modal for creating new difficulty levels
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
import type { Game, CreateDifficultyLevelRequest } from '@api/game';

interface DifficultyLevelCreateModalProps {
  children: React.ReactNode;
  games: Game[];
  onCreate: (difficultyLevelData: CreateDifficultyLevelRequest) => Promise<void>;
}

export const DifficultyLevelCreateModal: React.FC<DifficultyLevelCreateModalProps> = ({
  children,
  games,
  onCreate,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    gameId: '',
    levelValue: 1,
    description: '',
    sortOrder: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', code: '', gameId: '', levelValue: 1, description: '', sortOrder: 0 });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.code.trim() || !formData.gameId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        name: formData.name.trim(),
        code: formData.code.trim(),
        gameId: formData.gameId,
        levelValue: formData.levelValue,
        description: formData.description.trim() || undefined,
        sortOrder: formData.sortOrder,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to create difficulty level:', error);
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
        <DialogTitle>Create New Difficulty Level</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Difficulty Level Name"
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
              placeholder="EASY, MEDIUM, HARD, etc."
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
              label="Level Value"
              type="number"
              value={formData.levelValue}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  levelValue: parseInt(e.target.value) || 1,
                }))
              }
              fullWidth
              required
              slotProps={{
                htmlInput: {
                  min: 1,
                  max: 100,
                },
              }}
              helperText="Difficulty level value (1-100, higher = more difficult)"
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
              placeholder="Brief description of the difficulty level..."
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
              !formData.name.trim() || !formData.code.trim() || !formData.gameId || isSubmitting
            }
          >
            {isSubmitting ? 'Creating...' : 'Create Difficulty Level'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
