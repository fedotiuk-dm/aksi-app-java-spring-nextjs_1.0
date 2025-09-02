'use client';

/**
 * Price Configuration Create Modal
 * Modal for creating new price configurations
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
  Typography,
} from '@mui/material';
import type { Game, ServiceType, DifficultyLevel } from '@api/game';

interface PriceConfigurationCreateModalProps {
  children: React.ReactNode;
  games: Game[];
  serviceTypes: ServiceType[];
  difficultyLevels: DifficultyLevel[];
  onCreate: (priceConfigurationData: {
    gameId: string;
    serviceTypeId: string;
    difficultyLevelId: string;
    description?: string;
  }) => Promise<void>;
}

export const PriceConfigurationCreateModal: React.FC<PriceConfigurationCreateModalProps> = ({
  children,
  games,
  serviceTypes,
  difficultyLevels,
  onCreate,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    gameId: '',
    serviceTypeId: '',
    difficultyLevelId: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        gameId: '',
        serviceTypeId: '',
        difficultyLevelId: '',
        description: '',
      });
    }
  }, [open]);

  // Filter dependent dropdowns based on selected game
  const availableServiceTypes = serviceTypes.filter(
    (st) => !formData.gameId || st.gameId === formData.gameId
  );

  const availableDifficultyLevels = difficultyLevels.filter(
    (dl) => !formData.gameId || dl.gameId === formData.gameId
  );

  // Reset dependent fields when game changes
  const handleGameChange = (gameId: string) => {
    setFormData((prev) => ({
      ...prev,
      gameId,
      serviceTypeId: '',
      difficultyLevelId: '',
    }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ gameId: '', serviceTypeId: '', difficultyLevelId: '', description: '' });
  };

  const handleSubmit = async () => {
    if (!formData.gameId || !formData.serviceTypeId || !formData.difficultyLevelId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        gameId: formData.gameId,
        serviceTypeId: formData.serviceTypeId,
        difficultyLevelId: formData.difficultyLevelId,
        description: formData.description.trim() || undefined,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to create price configuration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get selected entities for display
  const selectedServiceType = serviceTypes.find((st) => st.id === formData.serviceTypeId);
  const selectedDifficultyLevel = difficultyLevels.find(
    (dl) => dl.id === formData.difficultyLevelId
  );

  // Calculate final price preview
  const basePrice = selectedServiceType?.basePrice || 0;
  const multiplier = selectedDifficultyLevel?.priceMultiplier || 1;
  const finalPrice = basePrice * multiplier;

  return (
    <>
      <Box onClick={handleOpen} sx={{ display: 'inline-block' }}>
        {children}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Price Configuration</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Game</InputLabel>
              <Select
                value={formData.gameId}
                label="Game"
                onChange={(e) => handleGameChange(e.target.value)}
                autoFocus
              >
                {games.map((game) => (
                  <MenuItem key={game.id} value={game.id}>
                    {game.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required disabled={!formData.gameId}>
              <InputLabel>Service Type</InputLabel>
              <Select
                value={formData.serviceTypeId}
                label="Service Type"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, serviceTypeId: e.target.value }))
                }
              >
                {availableServiceTypes.map((serviceType) => (
                  <MenuItem key={serviceType.id} value={serviceType.id}>
                    {serviceType.name} - ${serviceType.basePrice}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required disabled={!formData.gameId}>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                value={formData.difficultyLevelId}
                label="Difficulty Level"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, difficultyLevelId: e.target.value }))
                }
              >
                {availableDifficultyLevels.map((difficultyLevel) => (
                  <MenuItem key={difficultyLevel.id} value={difficultyLevel.id}>
                    {difficultyLevel.name} - {difficultyLevel.priceMultiplier}x
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Price Preview */}
            {selectedServiceType && selectedDifficultyLevel && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Price Preview:
                </Typography>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2">Base Price: ${basePrice}</Typography>
                  <Typography variant="body2">Multiplier: {multiplier}x</Typography>
                </Box>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  Final Price: ${finalPrice.toFixed(2)}
                </Typography>
              </Box>
            )}

            <TextField
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              placeholder="Optional description for this price configuration..."
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
              !formData.gameId ||
              !formData.serviceTypeId ||
              !formData.difficultyLevelId ||
              isSubmitting
            }
          >
            {isSubmitting ? 'Creating...' : 'Create Price Configuration'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
