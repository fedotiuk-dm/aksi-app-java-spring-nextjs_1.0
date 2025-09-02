'use client';

/**
 * Price Configuration Edit Modal
 * Modal for editing existing price configurations
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
  FormControlLabel,
  Switch,
} from '@mui/material';
import type { PriceConfiguration, Game, ServiceType, DifficultyLevel } from '@api/game';

interface PriceConfigurationEditModalProps {
  children: React.ReactNode;
  priceConfiguration: PriceConfiguration;
  games: Game[];
  serviceTypes: ServiceType[];
  difficultyLevels: DifficultyLevel[];
  onUpdate: (
    priceConfigurationId: string,
    priceConfigurationData: {
      gameId?: string;
      serviceTypeId?: string;
      difficultyLevelId?: string;
      description?: string;
      active?: boolean;
    }
  ) => Promise<void>;
}

export const PriceConfigurationEditModal: React.FC<PriceConfigurationEditModalProps> = ({
  children,
  priceConfiguration,
  games,
  serviceTypes,
  difficultyLevels,
  onUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    gameId: '',
    serviceTypeId: '',
    difficultyLevelId: '',
    description: '',
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (priceConfiguration) {
      setFormData({
        gameId: priceConfiguration.gameId,
        serviceTypeId: priceConfiguration.serviceTypeId,
        difficultyLevelId: priceConfiguration.difficultyLevelId,
        description: priceConfiguration.description || '',
        active: priceConfiguration.active,
      });
    }
  }, [priceConfiguration]);

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
  };

  const handleSubmit = async () => {
    if (!formData.gameId || !formData.serviceTypeId || !formData.difficultyLevelId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(priceConfiguration.id, {
        gameId: formData.gameId,
        serviceTypeId: formData.serviceTypeId,
        difficultyLevelId: formData.difficultyLevelId,
        description: formData.description.trim() || undefined,
        active: formData.active,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to update price configuration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = () => {
    return (
      formData.gameId !== priceConfiguration.gameId ||
      formData.serviceTypeId !== priceConfiguration.serviceTypeId ||
      formData.difficultyLevelId !== priceConfiguration.difficultyLevelId ||
      formData.description !== (priceConfiguration.description || '') ||
      formData.active !== priceConfiguration.active
    );
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
        <DialogTitle>Edit Price Configuration</DialogTitle>
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
              !hasChanges() ||
              isSubmitting
            }
          >
            {isSubmitting ? 'Updating...' : 'Update Price Configuration'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
