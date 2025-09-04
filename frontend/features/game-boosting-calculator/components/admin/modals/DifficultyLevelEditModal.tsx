'use client';

/**
 * Difficulty Level Edit Modal
 * Modal for editing existing difficulty levels
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
import type { DifficultyLevel, Game } from '@api/game';

interface DifficultyLevelEditModalProps {
  children: React.ReactNode;
  difficultyLevel: DifficultyLevel;
  games: Game[];
  onUpdate: (
    difficultyLevelId: string,
    difficultyLevelData: {
      name?: string;
      code?: string;
      gameId?: string;
      levelValue?: number;
      description?: string;
      active?: boolean;
      sortOrder?: number;
    }
  ) => Promise<void>;
}

export const DifficultyLevelEditModal: React.FC<DifficultyLevelEditModalProps> = ({
  children,
  difficultyLevel,
  games,
  onUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    gameId: '',
    levelValue: 1,
    description: '',
    active: true,
    sortOrder: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (difficultyLevel) {
      setFormData({
        name: difficultyLevel.name,
        code: difficultyLevel.code,
        gameId: difficultyLevel.gameId,
        levelValue: difficultyLevel.levelValue,
        description: difficultyLevel.description || '',
        active: difficultyLevel.active,
        sortOrder: difficultyLevel.sortOrder ?? 0,
      });
    }
  }, [difficultyLevel]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.code.trim() || !formData.gameId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(difficultyLevel.id, {
        name: formData.name.trim(),
        code: formData.code.trim(),
        gameId: formData.gameId,
        levelValue: formData.levelValue,
        description: formData.description.trim() || undefined,
        active: formData.active,
        sortOrder: formData.sortOrder,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to update difficulty level:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = () => {
    return (
      formData.name !== difficultyLevel.name ||
      formData.code !== difficultyLevel.code ||
      formData.gameId !== difficultyLevel.gameId ||
      formData.levelValue !== difficultyLevel.levelValue ||
      formData.description !== (difficultyLevel.description || '') ||
      formData.active !== difficultyLevel.active ||
      formData.sortOrder !== (difficultyLevel.sortOrder ?? 0)
    );
  };

  return (
    <>
      <Box onClick={handleOpen} sx={{ display: 'inline-block' }}>
        {children}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Difficulty Level</DialogTitle>
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
              !formData.name.trim() ||
              !formData.code.trim() ||
              !formData.gameId ||
              !hasChanges() ||
              isSubmitting
            }
          >
            {isSubmitting ? 'Updating...' : 'Update Difficulty Level'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
