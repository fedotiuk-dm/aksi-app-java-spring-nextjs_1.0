'use client';

/**
 * Game Delete Modal
 * Confirmation modal for deleting games
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
import type { Game } from '@api/game';

interface GameDeleteModalProps {
  children: React.ReactNode;
  game: Game;
  onDelete: (gameId: string) => Promise<void>;
}

export const GameDeleteModal: React.FC<GameDeleteModalProps> = ({ children, game, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(game.id);
      handleClose();
    } catch (error) {
      console.error('Failed to delete game:', error);
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
        <DialogTitle>Delete Game</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete the game &quot;{game.name}&quot;?
            </Typography>

            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                This action cannot be undone. All associated boosters and pricing data will be
                affected.
              </Typography>
            </Alert>

            <Typography variant="body2" color="text.secondary">
              Game: {game.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Category: {game.category}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Game'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
