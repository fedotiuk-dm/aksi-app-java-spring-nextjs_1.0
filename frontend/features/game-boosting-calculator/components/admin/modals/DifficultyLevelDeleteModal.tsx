'use client';

/**
 * Difficulty Level Delete Modal
 * Modal for confirming difficulty level deletion
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
import type { DifficultyLevel } from '@api/game';

interface DifficultyLevelDeleteModalProps {
  children: React.ReactNode;
  difficultyLevel: DifficultyLevel;
  onDelete: (difficultyLevelId: string) => Promise<void>;
}

export const DifficultyLevelDeleteModal: React.FC<DifficultyLevelDeleteModalProps> = ({
  children,
  difficultyLevel,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!isDeleting) {
      setOpen(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(difficultyLevel.id);
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete difficulty level:', error);
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
        <DialogTitle color="error">Delete Difficulty Level</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete the difficulty level &ldquo;{difficultyLevel.name}
              &rdquo;?
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Code: {difficultyLevel.code}
            </Typography>

            <Alert severity="warning" sx={{ mb: 2 }}>
              This action cannot be undone. All associated price configurations will be affected.
            </Alert>

            <Typography variant="body2" color="text.secondary">
              Game: {difficultyLevel.game?.name || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Price Multiplier: {difficultyLevel.priceMultiplier}x
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Difficulty Level'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
